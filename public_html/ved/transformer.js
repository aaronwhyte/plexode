/**
 * Populates a Vorp using a VedModel
 * @param {Vorp} vorp
 * @constructor
 */
function Transformer(vorp, gameClock, sledgeInvalidator) {
  this.vorp = vorp;
  this.gameClock = gameClock;
  this.sledgeInvalidator = sledgeInvalidator;

  // Maps model jackIds to JackAddress objects, to locate jacks in the Vorp instance.
  // Gets populated as sprites are created, and used when links are added.
  this.jackMap = {};
}

Transformer.BOX_RADIUS = 20;
Transformer.WALL_RADIUS = 24;
Transformer.CARDINAL_DIRECTIONS = [
  new Vec2d(0, -1),
  new Vec2d(1, 0),
  new Vec2d(0, 1),
  new Vec2d(-1, 0)
];
Transformer.MAX_HUG_DIST = 1000;

/**
 * @param {GrafModel} model  stuff to add to Vorp
 */
Transformer.prototype.transformModel = function(model) {
  var id, cluster;

  // Add all wall sprites first,
  // so wallhugger rayscans will see them.
  for (id in model.clusters) {
    cluster = model.clusters[id];
    if (cluster.getType() == VedType.WALL) {
      this.vorp.addSprites(this.transformCluster(cluster));
    }
  }

  // Compile all non-wall sprites before adding them,
  // so the wallhugger rayscans will only see the walls.
  var sprites = [];
  for (id in model.clusters) {
    cluster = model.clusters[id];
    if (cluster.getType() != VedType.WALL) {
      var clusterSprites = this.transformCluster(model.clusters[id]);
      for (var i = 0; i < clusterSprites.length; i++) {
        sprites.push(clusterSprites[i]);
      }
    }
  }
  this.vorp.addSprites(sprites);

  for (id in model.links) {
    this.transformLink(model.links[id]);
  }
};

Transformer.prototype.createBaseTemplate = function() {
  return VorpSpriteTemplate.createBase(this.vorp, this.gameClock, this.sledgeInvalidator);
};

Transformer.prototype.mid = function(a, b) {
  return (a + b) / 2;
};

Transformer.prototype.rad = function(a, b, r) {
  return Math.abs(a - b) / 2 + r;
};

/**
 * Transforms graf clusters into sprites.
 * @param {GrafCluster} cluster
 * @return an array of sprites
 */
Transformer.prototype.transformCluster = function(cluster) {
  var sprites = [];
  var controlVec, controlSprite, template, sprite, part, hugPoints;
  var parts = cluster.getPartList();
  switch (cluster.getType()) {

    case VedType.BEAM_SENSOR:
      part = parts[0];
      controlVec = new Vec2d(part.x, part.y);
      hugPoints = this.calcDoubleHugPoints(controlVec);

      // BeamerSprite
      template = this.createBaseTemplate()
          .makeImmovable()
          .setPainter(new BeamerPainter());
      this.positionHugger(template, hugPoints[0], controlVec,
          0.5 * Transformer.WALL_RADIUS,
          0.6 * Transformer.WALL_RADIUS);
      var beamer = new BeamerSprite(template);
      this.transformJacks(beamer, part.getJackList());
      sprites.push(beamer);

      // SensorSprite
      template = this.createBaseTemplate()
          .makeImmovable()
          .setPainter(new RectPainter('#888'));
      this.positionHugger(template, hugPoints[1], controlVec,
          0.6 * Transformer.WALL_RADIUS,
          0.2 * Transformer.WALL_RADIUS);
      var sensor = new SensorSprite(template);
      sprites.push(sensor);
      beamer.setTargetSprite(sensor);
      break;

    case VedType.BLOCK:
      part = parts[0];
      controlVec = new Vec2d(part.x, part.y);
      template = this.createBaseTemplate()
          .makeMovable()
          .setPainter(new RectPainter("#dd4"))
          .setPos(controlVec)
          .setRadXY(Transformer.BOX_RADIUS, Transformer.BOX_RADIUS)
          .setMass(1);
      sprite = new BlockSprite(template);
      sprites.push(sprite);
      break;

    case VedType.BUTTON:
      part = parts[0];
      controlVec = new Vec2d(part.x, part.y);
      template = this.createBaseTemplate()
          .makeImmovable()
          .setPainter(new ButtonPainter());
      this.positionMonoHugger(template, controlVec,
          Transformer.WALL_RADIUS * 1.9, Transformer.WALL_RADIUS * 0.6);
      sprite = new ButtonSprite(template);
      this.transformJacks(sprite, part.getJackList());
      sprites.push(sprite);
      break;

    case VedType.DOOR:
      part = parts[0];
      controlVec = new Vec2d(part.x, part.y);

      // DoorControlSprite
      template = this.createBaseTemplate()
          .makeIntangible()
          .setPos(controlVec);
      controlSprite = new DoorControlSprite(template);
      this.transformJacks(controlSprite, part.getJackList());
      sprites.push(controlSprite);

      // DoorSprite x2
      hugPoints = this.calcDoubleHugPoints(controlVec);
      var midpoint = Vec2d.midpoint(hugPoints[0], hugPoints[1]);
      for (var i = 0; i < 2; i++) {
        template = this.createBaseTemplate()
            .makeImmovable()
            .setPainter(new RectPainter("#aaa"));
        var hug = hugPoints[i];
        sprite = new DoorSprite(template, hug.x, hug.y, midpoint.x, midpoint.y);
        controlSprite.addDoorSprite(sprite);
        sprites.push(sprite);
      }
      break;

    case VedType.EXIT:
      part = parts[0];
      controlVec = new Vec2d(part.x, part.y);
      template = this.createBaseTemplate()
          .makeImmovable()
          .setPainter(new RectPainter("#0f0"))
          .setPos(controlVec)
          .setRadXY(Transformer.BOX_RADIUS * 1.5, Transformer.BOX_RADIUS * 1.5);
      sprite = new ExitSprite(template);
      sprite.setUrl(parts[0].data['url']);
      sprites.push(sprite);
      break;

    case VedType.GRIP:
      part = parts[0];
      controlVec = new Vec2d(part.x, part.y);
      template = this.createBaseTemplate()
          .makeImmovable()
          .setPainter(new GripPainter());
      this.positionMonoHugger(template, controlVec,
          Transformer.WALL_RADIUS, Transformer.WALL_RADIUS * 0.8);
      sprite = new GripSprite(template);
      sprite.setTargetPos(Vec2d.alongRayDistance(template.pos, controlVec,
          Transformer.BOX_RADIUS * 3));
      this.transformJacks(sprite, part.getJackList());
      sprites.push(sprite);
      break;

    case VedType.PLAYER_ASSEMBLER:
      part = parts[0];
      controlVec = new Vec2d(part.x, part.y);
      template = this.createBaseTemplate()
          .makeImmovable()
          .setPainter(new PlayerAssemblerPainter());
      this.positionMonoHugger(template, controlVec,
          Transformer.WALL_RADIUS * 4, Transformer.WALL_RADIUS);
      sprite = new PlayerAssemblerSprite(template,
          new PlayerSpriteFactory(this.createBaseTemplate()));
      // there's enough room to assemble a player sprite
      sprite.setTargetPos(Vec2d.alongRayDistance(template.pos, controlVec,
          Transformer.WALL_RADIUS / 2 * 1.01 + Transformer.BOX_RADIUS));
      sprites.push(sprite);
      break;

    case VedType.PORTAL:
      var portals = [];
      for (var i = 0; i < 2; i++) {
        controlVec = new Vec2d(parts[i].x, parts[i].y);
        template = this.createBaseTemplate()
            .makeMovable()
            .setPainter(new RectPainter('#0df'))
            .setPos(controlVec)
            .setRadXY(Transformer.BOX_RADIUS * 1.1, Transformer.BOX_RADIUS * 1.1)
            .setMass(1.1);
        portals[i] = new PortalSprite(template);
        sprites.push(portals[i]);
      }
      portals[0].setTargetSprite(portals[1]);
      portals[1].setTargetSprite(portals[0]);
      break;

    case VedType.TIMER:
      part = parts[0];
      controlVec = new Vec2d(part.x, part.y);
      template = this.createBaseTemplate()
          .makeIntangible()
          .setPos(controlVec);
      sprite = new TimerSprite(template);
      sprite.setTimeoutLength(parts[0].data['timeout']);
      this.transformJacks(sprite, part.getJackList());
      sprites.push(sprite);
      break;

    case VedType.TOGGLE:
      part = parts[0];
      controlVec = new Vec2d(part.x, part.y);
      template = this.createBaseTemplate()
          .makeIntangible()
          .setPos(controlVec);
      sprite = new ToggleSprite(template);
      this.transformJacks(sprite, part.getJackList());
      sprites.push(sprite);
      break;

    case VedType.WALL:
      if (parts.length != 2) {
        throw Error("Expected 2 parts in a wall cluster, found " + parts.length +
            ", in cluster with id " + cluster.id);
      }
      var x0 = parts[0].x;
      var y0 = parts[0].y;
      var x1 = parts[1].x;
      var y1 = parts[1].y;
      template = this.createBaseTemplate()
          .makeImmovable()
          .setPainter(new RectPainter("rgb(80,48,176)"))
          .setPosXY(this.mid(x0, x1), this.mid(y0, y1))
          .setRadXY(
              this.rad(x0, x1, Transformer.WALL_RADIUS),
              this.rad(y0, y1, Transformer.WALL_RADIUS));
      sprite = new WallSprite(template);
      sprites.push(sprite);
      break;

    case VedType.ZAPPER:
      part = parts[0];
      controlVec = new Vec2d(part.x, part.y);
      hugPoints = this.calcDoubleHugPoints(controlVec);

      // ZapperControlSprite
      template = this.createBaseTemplate()
          .makeIntangible()
          .setPos(controlVec);
      controlSprite = new ZapperControlSprite(template);
      this.transformJacks(controlSprite, part.getJackList());
      sprites.push(controlSprite);

      // ZapperSprite
      template = this.createBaseTemplate()
          .makeImmovable()
          .setGroup(Vorp.ZAPPER_GROUP)
          .setPainter(new ZapperPainter(true))
          .setPos(Vec2d.midpoint(hugPoints[0], hugPoints[1]))
          .setRadXY(
              this.rad(hugPoints[0].x, hugPoints[1].x, Transformer.WALL_RADIUS * 0.4),
              this.rad(hugPoints[0].y, hugPoints[1].y, Transformer.WALL_RADIUS * 0.4));
      sprite = new ZapperSprite(template);
      controlSprite.setZapperSprite(sprite);
      sprites.push(sprite);

      // WallSprite x2
      for (var i = 0; i < 2; i++) {
        template = this.createBaseTemplate()
            .makeImmovable()
            .setPainter(new RectPainter("#88f"));
        this.positionHugger(template, hugPoints[i], controlVec,
            Transformer.WALL_RADIUS, Transformer.WALL_RADIUS * 0.5);
        sprite = new WallSprite(template);
        sprites.push(sprite);
      }
      break;

  }
  return sprites;
};

Transformer.prototype.transformJacks = function(sprite, jackList) {
  for (var i = 0; i < jackList.length; i++) {
    var jack = jackList[i];
    var type = jack.getType();
    var jackIndexMap = null;
    if (type === JackAddress.Type.INPUT) {
      jackIndexMap = sprite.inputIds;
    } else if (type === JackAddress.Type.OUTPUT) {
      jackIndexMap = sprite.outputIds;
    }
    this.jackMap[jack.id] = new JackAddress(sprite, type, jackIndexMap[jack.getName()]);
  }
};

/**
 * @param {GrafLink} link
 */
Transformer.prototype.transformLink = function(link) {
  var ja1 = this.jackMap[link.jackId1];
  var ja2 = this.jackMap[link.jackId2];
  this.vorp.addLogicLink(new LogicLink(ja1.sprite.id, ja1.index, ja2.sprite.id, ja2.index));
};

/**
 * Sets the template's pos and rad.
 * @param {SpriteTemplate} template
 * @param {Vec2d} controlVec  the control point from the graf cluster
 * @param {number} width  the length of the edge that touches the wall
 * @param {number} height  how far the sprite extends away from the wall
 */
Transformer.prototype.positionMonoHugger = function(template, controlVec, width, height) {
  var hugPoint = this.calcMonoHugPoint(controlVec);
  this.positionHugger(template, hugPoint, controlVec, width, height);
};

/**
 * @param template
 * @param hugPoint
 * @param facingPoint
 * @param width
 * @param height
 */
Transformer.prototype.positionHugger = function(template, hugPoint, facingPoint, width, height) {
  var normalUnitVec = new Vec2d().set(facingPoint).subtract(hugPoint).scaleToLength(1);
  template.pos.set(normalUnitVec).scaleToLength(height / 2).add(hugPoint);

  template.rad.set(normalUnitVec).scaleToLength(height / 2);
  template.rad.add(normalUnitVec.rot90Right().scaleToLength(width / 2));
  template.rad.abs();
};

Transformer.prototype.calcMonoHugPoint = function(controlVec) {
  var hugPoints = this.calcHugPoints(controlVec);
  var index = this.indexOfClosestPoint(controlVec, hugPoints);
  return hugPoints[index];
};

Transformer.prototype.calcDoubleHugPoints = function(controlVec) {
  var hugPoints = this.calcHugPoints(controlVec);
  var index = this.indexOfClosestPoint(controlVec, hugPoints);
  var oppositeIndex = (index + 2) % 4;
  return [hugPoints[index], hugPoints[oppositeIndex]];
};

/**
 * @param {Vec2d} controlVec
 * @return an array of four points in cardinal directions from controlVec,
 * where a rayscan intersected a wall, or at the maximum scan length.
 */
Transformer.prototype.calcHugPoints = function(controlVec) {
  var hugPoints = [];
  for (var i = 0; i < Transformer.CARDINAL_DIRECTIONS.length; i++) {
    var targetPos = new Vec2d()
        .set(Transformer.CARDINAL_DIRECTIONS[i])
        .scale(Transformer.MAX_HUG_DIST)
        .add(controlVec);
    var rayScan = new RayScan(
        controlVec.x, controlVec.y,
        targetPos.x, targetPos.y,
        1, 1);
    // time is zero to one
    var time = this.vorp.rayScan(rayScan, Vorp.GENERAL_GROUP) ? rayScan.time : 1;
    hugPoints[i] = Vec2d.alongRayFraction(controlVec, targetPos, time);
  }
  return hugPoints;
};

Transformer.prototype.indexOfClosestPoint = function(controlVec, hugPoints) {
  var lowestDistSquared = Infinity;
  var index;
  for (var i = 0; i < hugPoints.length; i++) {
    var distSquared = hugPoints[i].distanceSquared(controlVec);
    if (distSquared < lowestDistSquared) {
      lowestDistSquared = distSquared;
      index = i;
    }
  }
  return index;
};
