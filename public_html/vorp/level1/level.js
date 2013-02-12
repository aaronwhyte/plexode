var vorpLevels = vorpLevels || {};
vorpLevels['level 1: start outside'] = [
  {
    "type": "addCluster",
    "id": "30"
  },
  {
    "type": "setData",
    "id": "30",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "31",
    "clusterId": "30",
    "x": 520,
    "y": -270
  },
  {
    "type": "setData",
    "id": "31",
    "key": "timeout",
    "value": 100
  },
  {
    "type": "addJack",
    "id": "32",
    "partId": "31"
  },
  {
    "type": "setData",
    "id": "32",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "32",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "33",
    "partId": "31"
  },
  {
    "type": "setData",
    "id": "33",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "33",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "82"
  },
  {
    "type": "setData",
    "id": "82",
    "key": "type",
    "value": "gripper"
  },
  {
    "type": "addPart",
    "id": "83",
    "clusterId": "82",
    "x": -420,
    "y": -320
  },
  {
    "type": "addJack",
    "id": "84",
    "partId": "83"
  },
  {
    "type": "setData",
    "id": "84",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "84",
    "key": "name",
    "value": "GRIPPING"
  },
  {
    "type": "addCluster",
    "id": "86"
  },
  {
    "type": "setData",
    "id": "86",
    "key": "type",
    "value": "player_assembler"
  },
  {
    "type": "addPart",
    "id": "87",
    "clusterId": "86",
    "x": 120,
    "y": 420
  },
  {
    "type": "addCluster",
    "id": "144"
  },
  {
    "type": "setData",
    "id": "144",
    "key": "type",
    "value": "zapper"
  },
  {
    "type": "addPart",
    "id": "145",
    "clusterId": "144",
    "x": 430,
    "y": 30
  },
  {
    "type": "addJack",
    "id": "148",
    "partId": "145"
  },
  {
    "type": "setData",
    "id": "148",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "148",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "146"
  },
  {
    "type": "setData",
    "id": "146",
    "key": "type",
    "value": "block"
  },
  {
    "type": "addPart",
    "id": "147",
    "clusterId": "146",
    "x": -450,
    "y": -320
  },
  {
    "type": "addCluster",
    "id": "152"
  },
  {
    "type": "setData",
    "id": "152",
    "key": "type",
    "value": "zapper"
  },
  {
    "type": "addPart",
    "id": "153",
    "clusterId": "152",
    "x": 320,
    "y": 110
  },
  {
    "type": "addJack",
    "id": "154",
    "partId": "153"
  },
  {
    "type": "setData",
    "id": "154",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "154",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "251"
  },
  {
    "type": "setData",
    "id": "251",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "252",
    "clusterId": "251",
    "x": 360,
    "y": -70
  },
  {
    "type": "addPart",
    "id": "253",
    "clusterId": "251",
    "x": 980,
    "y": -70
  },
  {
    "type": "addCluster",
    "id": "263"
  },
  {
    "type": "setData",
    "id": "263",
    "key": "type",
    "value": "button"
  },
  {
    "type": "addPart",
    "id": "264",
    "clusterId": "263",
    "x": -450,
    "y": 340
  },
  {
    "type": "addJack",
    "id": "265",
    "partId": "264"
  },
  {
    "type": "setData",
    "id": "265",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "265",
    "key": "name",
    "value": "CLICKED"
  },
  {
    "type": "addCluster",
    "id": "301"
  },
  {
    "type": "setData",
    "id": "301",
    "key": "type",
    "value": "gripper"
  },
  {
    "type": "addPart",
    "id": "302",
    "clusterId": "301",
    "x": 200,
    "y": -320
  },
  {
    "type": "addJack",
    "id": "303",
    "partId": "302"
  },
  {
    "type": "setData",
    "id": "303",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "303",
    "key": "name",
    "value": "GRIPPING"
  },
  {
    "type": "addCluster",
    "id": "326"
  },
  {
    "type": "setData",
    "id": "326",
    "key": "type",
    "value": "button"
  },
  {
    "type": "addPart",
    "id": "327",
    "clusterId": "326",
    "x": 160,
    "y": -150
  },
  {
    "type": "addJack",
    "id": "328",
    "partId": "327"
  },
  {
    "type": "setData",
    "id": "328",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "328",
    "key": "name",
    "value": "CLICKED"
  },
  {
    "type": "addCluster",
    "id": "378"
  },
  {
    "type": "setData",
    "id": "378",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "379",
    "clusterId": "378",
    "x": -520,
    "y": -700
  },
  {
    "type": "addPart",
    "id": "380",
    "clusterId": "378",
    "x": 300,
    "y": -700
  },
  {
    "type": "addCluster",
    "id": "390"
  },
  {
    "type": "setData",
    "id": "390",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "391",
    "clusterId": "390",
    "x": -550,
    "y": 230
  },
  {
    "type": "addPart",
    "id": "392",
    "clusterId": "390",
    "x": -550,
    "y": -700
  },
  {
    "type": "addCluster",
    "id": "395"
  },
  {
    "type": "setData",
    "id": "395",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "396",
    "clusterId": "395",
    "x": -330,
    "y": 340
  },
  {
    "type": "setData",
    "id": "396",
    "key": "timeout",
    "value": 100
  },
  {
    "type": "addJack",
    "id": "397",
    "partId": "396"
  },
  {
    "type": "setData",
    "id": "397",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "397",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "398",
    "partId": "396"
  },
  {
    "type": "setData",
    "id": "398",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "398",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "503"
  },
  {
    "type": "setData",
    "id": "503",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "504",
    "clusterId": "503",
    "x": -40,
    "y": 230
  },
  {
    "type": "addPart",
    "id": "505",
    "clusterId": "503",
    "x": 980,
    "y": 230
  },
  {
    "type": "addCluster",
    "id": "514"
  },
  {
    "type": "setData",
    "id": "514",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "515",
    "clusterId": "514",
    "x": -200,
    "y": 230
  },
  {
    "type": "addJack",
    "id": "516",
    "partId": "515"
  },
  {
    "type": "setData",
    "id": "516",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "516",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "662"
  },
  {
    "type": "setData",
    "id": "662",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "663",
    "clusterId": "662",
    "x": 980,
    "y": -30
  },
  {
    "type": "addPart",
    "id": "664",
    "clusterId": "662",
    "x": 980,
    "y": 190
  },
  {
    "type": "addCluster",
    "id": "690"
  },
  {
    "type": "setData",
    "id": "690",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "691",
    "clusterId": "690",
    "x": 320,
    "y": -70
  },
  {
    "type": "addPart",
    "id": "692",
    "clusterId": "690",
    "x": 320,
    "y": -700
  },
  {
    "type": "addCluster",
    "id": "987"
  },
  {
    "type": "setData",
    "id": "987",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "988",
    "clusterId": "987",
    "x": -550,
    "y": 230
  },
  {
    "type": "addPart",
    "id": "989",
    "clusterId": "987",
    "x": -350,
    "y": 230
  },
  {
    "type": "addCluster",
    "id": "1169"
  },
  {
    "type": "setData",
    "id": "1169",
    "key": "type",
    "value": "exit"
  },
  {
    "type": "addPart",
    "id": "1170",
    "clusterId": "1169",
    "x": 830,
    "y": 80
  },
  {
    "type": "setData",
    "id": "1170",
    "key": "url",
    "value": "../level2/"
  },
  {
    "type": "addLink",
    "id": "15",
    "jackId1": "154",
    "jackId2": 303
  },
  {
    "type": "addLink",
    "id": "166",
    "jackId1": "33",
    "jackId2": 148
  },
  {
    "type": "addLink",
    "id": "341",
    "jackId1": "32",
    "jackId2": 328
  },
  {
    "type": "addLink",
    "id": "408",
    "jackId1": "265",
    "jackId2": 397
  },
  {
    "type": "addLink",
    "id": "422",
    "jackId1": "398",
    "jackId2": 516
  },
  {
    "type": "addLink",
    "id": "683",
    "jackId1": "84",
    "jackId2": 516
  }
];
