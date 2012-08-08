/**
 * Populates a Vorp using a VedModel
 * @param {Vorp} vorp
 * @constructor
 */
function Transformer(vorp, gameClock, sledgeInvalidator) {
  this.vorp = vorp;
  this.gameClock = gameClock;
  this.sledgeInvalidator = sledgeInvalidator;

  // maps jackIds to objects like
  // {
  //   spriteId: id,
  //   type: buffer type enum,
  //   index: num
  // }
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
    if (cluster.data['type'] == VedType.WALL) {
      this.vorp.addSprites(this.transformCluster(cluster));
    }
  }

  // Compile all non-wall sprites before adding them,
  // so the wallhugger rayscans will only see the walls.
  var sprites = [];
  for (id in model.clusters) {
    cluster = model.clusters[id];
    if (cluster.data['type'] != VedType.WALL) {
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

Transformer.prototype.createImmovableSpriteTemplate = function() {
  return this.createBaseTemplate()
      .setGroup(Vorp.WALL_GROUP)
      .setMass(Infinity)
      .setSledgeDuration(Infinity);
};

Transformer.prototype.createMovableSpriteTemplate = function() {
  return this.createBaseTemplate()
      .setGroup(Vorp.GENERAL_GROUP)
      .setSledgeDuration(1.01);
};

Transformer.prototype.createBaseTemplate = function() {
  return new SpriteTemplate()
      .setWorld(this.vorp)
      .setGameClock(this.gameClock)
      .setSledgeInvalidator(this.sledgeInvalidator);
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
  var controlVec, template, sprite;
  var parts = [];
  for (var id in cluster.parts) {
    parts.push(cluster.parts[id]);
  }
  switch (cluster.data.type) {
    case VedType.WALL:
      if (parts.length != 2) {
        throw Error("Expected 2 parts in a wall cluster, found " + parts.length +
            ", in cluster with id " + cluster.id);
      }
      var x0 = parts[0].x;
      var y0 = parts[0].y;
      var x1 = parts[1].x;
      var y1 = parts[1].y;
      sprite = new WallSprite(this.createImmovableSpriteTemplate()
          .setPainter(new RectPainter("rgb(80,48,176)"))
          .setPosXY(this.mid(x0, x1), this.mid(y0, y1))
          .setRadXY(this.rad(x0, x1, Transformer.WALL_RADIUS),
                    this.rad(y0, y1, Transformer.WALL_RADIUS)));
      sprites.push(sprite);
      break;
    case VedType.PLAYER_ASSEMBLER:
      controlVec = new Vec2d(parts[0].x, parts[0].y);
      template = this.createImmovableSpriteTemplate()
          .setPainter(new PlayerAssemblerPainter());
      this.positionMonoHugger(template, controlVec,
          Transformer.WALL_RADIUS * 4, Transformer.WALL_RADIUS);
      sprite = new PlayerAssemblerSprite(template);
      // there's enough room to assemble a player sprite
      sprite.setTargetPos(Vec2d.alongRayDistance(template.pos, controlVec,
          Transformer.WALL_RADIUS / 2 * 1.01 + Transformer.BOX_RADIUS));
      sprites.push(sprite);
      break;
    case VedType.BUTTON:
      controlVec = new Vec2d(parts[0].x, parts[0].y);
      template = this.createImmovableSpriteTemplate()
          .setPainter(new ButtonPainter());
      this.positionMonoHugger(template, controlVec,
          Transformer.WALL_RADIUS * 1.9, Transformer.WALL_RADIUS * 0.6);
      sprite = new ButtonSprite(template);
      sprites.push(sprite);
      // TODO jacks
      break;
    case VedType.GRIP:
      controlVec = new Vec2d(parts[0].x, parts[0].y);
      template = this.createImmovableSpriteTemplate()
          .setPainter(new GripPainter());
      this.positionMonoHugger(template, controlVec,
          Transformer.WALL_RADIUS, Transformer.WALL_RADIUS * 0.8);
      sprite = new GripSprite(template);
      sprite.setTargetPos(Vec2d.alongRayDistance(template.pos, controlVec,
          Transformer.BOX_RADIUS * 3));
      sprites.push(sprite);
      // TODO jacks
      break;
    case VedType.BLOCK:
      controlVec = new Vec2d(parts[0].x, parts[0].y);
      template = this.createMovableSpriteTemplate()
          .setPainter(new RectPainter("#dd4"))
          .setPos(controlVec)
          .setRadXY(Transformer.BOX_RADIUS, Transformer.BOX_RADIUS)
          .setMass(1);
      sprite = new BlockSprite(template);
      sprites.push(sprite);
      break;
    case VedType.EXIT:
      controlVec = new Vec2d(parts[0].x, parts[0].y);
      template = this.createImmovableSpriteTemplate()
          .setPainter(new RectPainter("#0f0"))
          .setPos(controlVec)
          .setRadXY(Transformer.BOX_RADIUS * 1.5, Transformer.BOX_RADIUS * 1.5);
      sprite = new ExitSprite(template);
      // TODO: proper exit URL
      sprite.setUrl("index.html");
      sprites.push(sprite);
      break;
    case VedType.DOOR:
      controlVec = new Vec2d(parts[0].x, parts[0].y);

      // DoorControlSprite
      template = this.createImmovableSpriteTemplate()
          .setPos(controlVec);
      var controlSprite = new DoorControlSprite(template);
      // TODO jacks
      sprites.push(controlSprite);

      // DoorSprite x2
      var hugPoints = this.calcDoubleHugPoints(controlVec);
      var midpoint = Vec2d.midpoint(hugPoints[0], hugPoints[1]);
      for (var i = 0; i < 2; i++) {
        template = this.createImmovableSpriteTemplate()
            .setPainter(new RectPainter("#aaa"));
        var hug = hugPoints[i];
        sprite = new DoorSprite(template, hug.x, hug.y, midpoint.x, midpoint.y);
        controlSprite.addDoorSprite(sprite);
        sprites.push(sprite);
      }
      break;
  }
  return sprites;
};

/**
 * @param {GrafLink} link
 */
Transformer.prototype.transformLink = function(link) {
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
  var normalUnitVec = new Vec2d().set(controlVec).subtract(hugPoint).scaleToLength(1);
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
