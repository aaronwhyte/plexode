/**
 * Static namespace only.
 * @type {Object}
 */
VedTemplates = {};

/**
 * @return {Object} A map from VedType value to GrafTemplate for that value
 */
VedTemplates.createMap = function() {
  function t(id) {
    return (new VedTemplateBuilder(id)).cluster(id);
  }
  var templates = [
    t(VedType.AND).part().jacks(AndSprite),
    t(VedType.BEAM_SENSOR).part().jacks(BeamerSprite),
    t(VedType.BIG_BLOCK).part(),
    t(VedType.BLOCK).part(),
    t(VedType.BUTTON).part().jacks(ButtonSprite),
    t(VedType.DOOR).part().jacks(DoorControlSprite),
    t(VedType.EXIT).part().dataParam('url'),
    t(VedType.GRIP).part().jacks(GripSprite),
    t(VedType.NOT).part().jacks(NotSprite),
    t(VedType.PLAYER_ASSEMBLER).part(),
    t(VedType.PORTAL).part().part(),
    t(VedType.TIMER).part().dataParam('timeout').jacks(TimerSprite),
    t(VedType.TOGGLE).part().jacks(ToggleSprite),
    t(VedType.WALL).part().part(),
    t(VedType.ZAPPER).part().jacks(ZapperControlSprite),
    t(VedType.ZOMBIE).part(),
    t(VedType.ZOMBIE_ASSEMBLER).part(),
    t(VedType.ANTI_ZOMBIE_TURRET).part()
  ];
  var map = {};
  for (var i = 0; i < templates.length; i++) {
    var template = templates[i];
    map[template.id] = template.build();
  }
  return map;
};
