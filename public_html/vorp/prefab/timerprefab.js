/**
 * @constructor
 * @extends {Prefab}
 */
function TimerPrefab(x, y, timeoutLength, onTimeout) {
  Prefab.call(this);
  this.x = x;
  this.y = y;
  this.timeoutLength = timeoutLength;
  this.onTimeout = onTimeout;
}
TimerPrefab.prototype = new Prefab();
TimerPrefab.prototype.constructor = Prefab;

TimerPrefab.prototype.createSprites = function(baseSpriteTemplate) {
  this.baseSpriteTemplate = baseSpriteTemplate;
  var r = Prefab.WALL_RADIUS * 0.33;
  this.sprite = new TimerSprite(this.createImmovableSpriteTemplate()
      .setPainter(new TimerPainter())
      .setPosXY(this.x, this.y)
      .setRadXY(r, r)
      .setGroup(Vorp.EMPTY_GROUP));
  this.sprite.setTimeoutLength(this.timeoutLength);
  this.sprite.setOnTimeout(this.onTimeout);
  return [this.sprite];
};

TimerPrefab.prototype.stop = function() {
  this.sprite.stop();
};

TimerPrefab.prototype.start = function() {
  this.sprite.start();
};

