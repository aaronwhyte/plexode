/**
 * Static namespace only.
 * @type {Object}
 */
VedTemplates = {};

/**
 * @return {Object} A map from VedType value to GrafTemplate for that value
 */
VedTemplates.getClusterMap = function() {
  var map = {};

  function t(shortId, vedType) {
    var template = (new VedTemplateBuilder(shortId)).cluster(vedType);
    map[vedType] = template;
    return template;
  }
  // Fill the map with builders first.
  t(1, VedType.WALL).part().part();
  t(2, VedType.TIMER).part().dataParam('timeout').jacks(TimerSprite);
  t(3, VedType.AND).part().jacks(AndSprite);
  t(4, VedType.BEAM_SENSOR).part().jacks(BeamerSprite);
  t(5, VedType.BLOCK).part();
  t(6, VedType.BUTTON).part().jacks(ButtonSprite);
  t(7, VedType.DOOR).part().jacks(DoorControlSprite);
  t(8, VedType.GRIP).part().jacks(GripSprite);
  // 9 is is for links
  t(10, VedType.PLAYER_ASSEMBLER).part();
  t(11, VedType.TOGGLE).part().jacks(ToggleSprite);
  t(12, VedType.ZAPPER).part().jacks(ZapperControlSprite);
  t(13, VedType.ZOMBIE).part();
  t(14, VedType.ZOMBIE_ASSEMBLER).part();
  t(15, VedType.ANTI_ZOMBIE_TURRET).part();
  t(16, VedType.BIG_BLOCK).part();
  t(17, VedType.PORTAL).part().part();
  t(18, VedType.EXIT).part().dataParam('url');
  t(19, VedType.NOT).part().jacks(NotSprite);
  t(20, VedType.META).dataParam('title').dataParam('desc');

  // Build all templates.
  for (var vedType in map) {
    map[vedType] = map[vedType].build();
  }
  return map;
};

VedTemplates.getLinkMap = function() {
  var template = new GrafTemplate(9, [{
    "type": "addLink",
    "id": GrafTemplate.PARAM,
    "jackId1": GrafTemplate.PARAM,
    "jackId2": GrafTemplate.PARAM
  }]);
  return {'link': template};
};
