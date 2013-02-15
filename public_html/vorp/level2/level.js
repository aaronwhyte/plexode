var vorpLevels = vorpLevels || {};
vorpLevels['level 2'] = [
  {
    "type": "addCluster",
    "id": "7"
  },
  {
    "type": "setData",
    "id": "7",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "8",
    "clusterId": "7",
    "x": -100,
    "y": -40
  },
  {
    "type": "addPart",
    "id": "9",
    "clusterId": "7",
    "x": 400,
    "y": -40
  },
  {
    "type": "addCluster",
    "id": "13"
  },
  {
    "type": "setData",
    "id": "13",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "14",
    "clusterId": "13",
    "x": 820,
    "y": 2500
  },
  {
    "type": "addJack",
    "id": "15",
    "partId": "14"
  },
  {
    "type": "setData",
    "id": "15",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "setData",
    "id": "15",
    "key": "type",
    "value": "output"
  },
  {
    "type": "addCluster",
    "id": "19"
  },
  {
    "type": "setData",
    "id": "19",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "20",
    "clusterId": "19",
    "x": 1840,
    "y": 2370
  },
  {
    "type": "addPart",
    "id": "21",
    "clusterId": "19",
    "x": 1840,
    "y": 2740
  },
  {
    "type": "addCluster",
    "id": "28"
  },
  {
    "type": "setData",
    "id": "28",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "29",
    "clusterId": "28",
    "x": -100,
    "y": -770
  },
  {
    "type": "addPart",
    "id": "30",
    "clusterId": "28",
    "x": 680,
    "y": -770
  },
  {
    "type": "addCluster",
    "id": "34"
  },
  {
    "type": "setData",
    "id": "34",
    "key": "type",
    "value": "button"
  },
  {
    "type": "addPart",
    "id": "35",
    "clusterId": "34",
    "x": 930,
    "y": 1760
  },
  {
    "type": "addJack",
    "id": "36",
    "partId": "35"
  },
  {
    "type": "setData",
    "id": "36",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "36",
    "key": "name",
    "value": "CLICKED"
  },
  {
    "type": "addCluster",
    "id": "37"
  },
  {
    "type": "setData",
    "id": "37",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "38",
    "clusterId": "37",
    "x": 860,
    "y": 1730
  },
  {
    "type": "setData",
    "id": "38",
    "key": "timeout",
    "value": "Infinity"
  },
  {
    "type": "addJack",
    "id": "39",
    "partId": "38"
  },
  {
    "type": "setData",
    "id": "39",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "39",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "40",
    "partId": "38"
  },
  {
    "type": "setData",
    "id": "40",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "40",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "42"
  },
  {
    "type": "setData",
    "id": "42",
    "key": "type",
    "value": "not"
  },
  {
    "type": "addPart",
    "id": "49",
    "clusterId": "42",
    "x": 70,
    "y": 210
  },
  {
    "type": "addJack",
    "id": "50",
    "partId": "49"
  },
  {
    "type": "setData",
    "id": "50",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "50",
    "key": "name",
    "value": "X"
  },
  {
    "type": "addJack",
    "id": "54",
    "partId": "49"
  },
  {
    "type": "setData",
    "id": "54",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "54",
    "key": "name",
    "value": "NOT_X"
  },
  {
    "type": "addCluster",
    "id": "43"
  },
  {
    "type": "setData",
    "id": "43",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "44",
    "clusterId": "43",
    "x": 680,
    "y": -770
  },
  {
    "type": "addPart",
    "id": "45",
    "clusterId": "43",
    "x": 680,
    "y": -540
  },
  {
    "type": "addCluster",
    "id": "46"
  },
  {
    "type": "setData",
    "id": "46",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "47",
    "clusterId": "46",
    "x": 1460,
    "y": 810
  },
  {
    "type": "addPart",
    "id": "48",
    "clusterId": "46",
    "x": 1460,
    "y": 1430
  },
  {
    "type": "addCluster",
    "id": "51"
  },
  {
    "type": "setData",
    "id": "51",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "52",
    "clusterId": "51",
    "x": 1840,
    "y": 2740
  },
  {
    "type": "addPart",
    "id": "53",
    "clusterId": "51",
    "x": 2470,
    "y": 2740
  },
  {
    "type": "addCluster",
    "id": "60"
  },
  {
    "type": "setData",
    "id": "60",
    "key": "type",
    "value": "zapper"
  },
  {
    "type": "addPart",
    "id": "72",
    "clusterId": "60",
    "x": -580,
    "y": -520
  },
  {
    "type": "addJack",
    "id": "73",
    "partId": "72"
  },
  {
    "type": "setData",
    "id": "73",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "73",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "61"
  },
  {
    "type": "setData",
    "id": "61",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "62",
    "clusterId": "61",
    "x": 1060,
    "y": 1430
  },
  {
    "type": "addPart",
    "id": "63",
    "clusterId": "61",
    "x": 1460,
    "y": 1430
  },
  {
    "type": "addCluster",
    "id": "65"
  },
  {
    "type": "setData",
    "id": "65",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "66",
    "clusterId": "65",
    "x": 560,
    "y": 200
  },
  {
    "type": "addJack",
    "id": "67",
    "partId": "66"
  },
  {
    "type": "setData",
    "id": "67",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "67",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "68"
  },
  {
    "type": "setData",
    "id": "68",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "69",
    "clusterId": "68",
    "x": 490,
    "y": 130
  },
  {
    "type": "addJack",
    "id": "70",
    "partId": "69"
  },
  {
    "type": "setData",
    "id": "70",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "70",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "addCluster",
    "id": "92"
  },
  {
    "type": "setData",
    "id": "92",
    "key": "type",
    "value": "zapper"
  },
  {
    "type": "addPart",
    "id": "93",
    "clusterId": "92",
    "x": 1700,
    "y": 2260
  },
  {
    "type": "addJack",
    "id": "94",
    "partId": "93"
  },
  {
    "type": "setData",
    "id": "94",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "94",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "108"
  },
  {
    "type": "setData",
    "id": "108",
    "key": "type",
    "value": "zapper"
  },
  {
    "type": "addPart",
    "id": "109",
    "clusterId": "108",
    "x": 1840,
    "y": 2270
  },
  {
    "type": "addJack",
    "id": "110",
    "partId": "109"
  },
  {
    "type": "setData",
    "id": "110",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "110",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "124"
  },
  {
    "type": "setData",
    "id": "124",
    "key": "type",
    "value": "gripper"
  },
  {
    "type": "addPart",
    "id": "125",
    "clusterId": "124",
    "x": 940,
    "y": 940
  },
  {
    "type": "addJack",
    "id": "126",
    "partId": "125"
  },
  {
    "type": "setData",
    "id": "126",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "126",
    "key": "name",
    "value": "GRIPPING"
  },
  {
    "type": "addCluster",
    "id": "142"
  },
  {
    "type": "setData",
    "id": "142",
    "key": "type",
    "value": "gripper"
  },
  {
    "type": "addPart",
    "id": "143",
    "clusterId": "142",
    "x": 450,
    "y": 1100
  },
  {
    "type": "addJack",
    "id": "144",
    "partId": "143"
  },
  {
    "type": "setData",
    "id": "144",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "144",
    "key": "name",
    "value": "GRIPPING"
  },
  {
    "type": "addCluster",
    "id": "145"
  },
  {
    "type": "setData",
    "id": "145",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "146",
    "clusterId": "145",
    "x": -100,
    "y": -770
  },
  {
    "type": "addPart",
    "id": "147",
    "clusterId": "145",
    "x": -100,
    "y": -600
  },
  {
    "type": "addCluster",
    "id": "157"
  },
  {
    "type": "setData",
    "id": "157",
    "key": "type",
    "value": "gripper"
  },
  {
    "type": "addPart",
    "id": "158",
    "clusterId": "157",
    "x": 1420,
    "y": 1110
  },
  {
    "type": "addJack",
    "id": "159",
    "partId": "158"
  },
  {
    "type": "setData",
    "id": "159",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "159",
    "key": "name",
    "value": "GRIPPING"
  },
  {
    "type": "addCluster",
    "id": "169"
  },
  {
    "type": "setData",
    "id": "169",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "170",
    "clusterId": "169",
    "x": 800,
    "y": 1860
  },
  {
    "type": "addPart",
    "id": "171",
    "clusterId": "169",
    "x": 800,
    "y": 1430
  },
  {
    "type": "addCluster",
    "id": "177"
  },
  {
    "type": "setData",
    "id": "177",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "178",
    "clusterId": "177",
    "x": -100,
    "y": -40
  },
  {
    "type": "addPart",
    "id": "179",
    "clusterId": "177",
    "x": -100,
    "y": -300
  },
  {
    "type": "addCluster",
    "id": "181"
  },
  {
    "type": "setData",
    "id": "181",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "182",
    "clusterId": "181",
    "x": 1060,
    "y": 1430
  },
  {
    "type": "addPart",
    "id": "183",
    "clusterId": "181",
    "x": 1060,
    "y": 1860
  },
  {
    "type": "addCluster",
    "id": "201"
  },
  {
    "type": "setData",
    "id": "201",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "202",
    "clusterId": "201",
    "x": 710,
    "y": -400
  },
  {
    "type": "addJack",
    "id": "203",
    "partId": "202"
  },
  {
    "type": "setData",
    "id": "203",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "203",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "222"
  },
  {
    "type": "setData",
    "id": "222",
    "key": "type",
    "value": "zapper"
  },
  {
    "type": "addPart",
    "id": "223",
    "clusterId": "222",
    "x": 530,
    "y": 370
  },
  {
    "type": "addJack",
    "id": "224",
    "partId": "223"
  },
  {
    "type": "setData",
    "id": "224",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "224",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "265"
  },
  {
    "type": "setData",
    "id": "265",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "266",
    "clusterId": "265",
    "x": 1190,
    "y": 2800
  },
  {
    "type": "addJack",
    "id": "267",
    "partId": "266"
  },
  {
    "type": "setData",
    "id": "267",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "setData",
    "id": "267",
    "key": "type",
    "value": "output"
  },
  {
    "type": "addCluster",
    "id": "268"
  },
  {
    "type": "setData",
    "id": "268",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "269",
    "clusterId": "268",
    "x": 1620,
    "y": 2240
  },
  {
    "type": "addJack",
    "id": "270",
    "partId": "269"
  },
  {
    "type": "setData",
    "id": "270",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "270",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "315"
  },
  {
    "type": "setData",
    "id": "315",
    "key": "type",
    "value": "block"
  },
  {
    "type": "addPart",
    "id": "316",
    "clusterId": "315",
    "x": -1530,
    "y": -450
  },
  {
    "type": "addCluster",
    "id": "319"
  },
  {
    "type": "setData",
    "id": "319",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "320",
    "clusterId": "319",
    "x": 680,
    "y": 810
  },
  {
    "type": "addPart",
    "id": "321",
    "clusterId": "319",
    "x": 1460,
    "y": 810
  },
  {
    "type": "addCluster",
    "id": "322"
  },
  {
    "type": "setData",
    "id": "322",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "323",
    "clusterId": "322",
    "x": 530,
    "y": -40
  },
  {
    "type": "addJack",
    "id": "324",
    "partId": "323"
  },
  {
    "type": "setData",
    "id": "324",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "324",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "434"
  },
  {
    "type": "setData",
    "id": "434",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "435",
    "clusterId": "434",
    "x": 710,
    "y": 2120
  },
  {
    "type": "addPart",
    "id": "436",
    "clusterId": "434",
    "x": 1300,
    "y": 2120
  },
  {
    "type": "addCluster",
    "id": "449"
  },
  {
    "type": "setData",
    "id": "449",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "450",
    "clusterId": "449",
    "x": 1300,
    "y": 2120
  },
  {
    "type": "addPart",
    "id": "451",
    "clusterId": "449",
    "x": 1300,
    "y": 1690
  },
  {
    "type": "addCluster",
    "id": "461"
  },
  {
    "type": "setData",
    "id": "461",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "462",
    "clusterId": "461",
    "x": 1560,
    "y": 2120
  },
  {
    "type": "addPart",
    "id": "463",
    "clusterId": "461",
    "x": 1560,
    "y": 1690
  },
  {
    "type": "addCluster",
    "id": "464"
  },
  {
    "type": "setData",
    "id": "464",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "465",
    "clusterId": "464",
    "x": 1640,
    "y": 2250
  },
  {
    "type": "addJack",
    "id": "466",
    "partId": "465"
  },
  {
    "type": "setData",
    "id": "466",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "466",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "476"
  },
  {
    "type": "setData",
    "id": "476",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "477",
    "clusterId": "476",
    "x": 1300,
    "y": 1690
  },
  {
    "type": "addPart",
    "id": "478",
    "clusterId": "476",
    "x": 1560,
    "y": 1690
  },
  {
    "type": "addCluster",
    "id": "482"
  },
  {
    "type": "setData",
    "id": "482",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "483",
    "clusterId": "482",
    "x": 1760,
    "y": 2220
  },
  {
    "type": "addJack",
    "id": "484",
    "partId": "483"
  },
  {
    "type": "setData",
    "id": "484",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "484",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "494"
  },
  {
    "type": "setData",
    "id": "494",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "495",
    "clusterId": "494",
    "x": 1780,
    "y": 2230
  },
  {
    "type": "addJack",
    "id": "496",
    "partId": "495"
  },
  {
    "type": "setData",
    "id": "496",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "496",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "599"
  },
  {
    "type": "setData",
    "id": "599",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "600",
    "clusterId": "599",
    "x": 1430,
    "y": 2120
  },
  {
    "type": "addJack",
    "id": "601",
    "partId": "600"
  },
  {
    "type": "setData",
    "id": "601",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "601",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "630"
  },
  {
    "type": "setData",
    "id": "630",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "631",
    "clusterId": "630",
    "x": 400,
    "y": 1430
  },
  {
    "type": "addPart",
    "id": "632",
    "clusterId": "630",
    "x": 400,
    "y": -40
  },
  {
    "type": "addCluster",
    "id": "633"
  },
  {
    "type": "setData",
    "id": "633",
    "key": "type",
    "value": "zapper"
  },
  {
    "type": "addPart",
    "id": "634",
    "clusterId": "633",
    "x": 1560,
    "y": 2300
  },
  {
    "type": "addJack",
    "id": "635",
    "partId": "634"
  },
  {
    "type": "setData",
    "id": "635",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "635",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "645"
  },
  {
    "type": "setData",
    "id": "645",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "646",
    "clusterId": "645",
    "x": 400,
    "y": 1430
  },
  {
    "type": "addPart",
    "id": "647",
    "clusterId": "645",
    "x": 800,
    "y": 1430
  },
  {
    "type": "addCluster",
    "id": "763"
  },
  {
    "type": "setData",
    "id": "763",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "764",
    "clusterId": "763",
    "x": 1080,
    "y": -540
  },
  {
    "type": "addPart",
    "id": "765",
    "clusterId": "763",
    "x": 680,
    "y": -540
  },
  {
    "type": "addCluster",
    "id": "781"
  },
  {
    "type": "setData",
    "id": "781",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "782",
    "clusterId": "781",
    "x": 1080,
    "y": -310
  },
  {
    "type": "addPart",
    "id": "783",
    "clusterId": "781",
    "x": 680,
    "y": -310
  },
  {
    "type": "addCluster",
    "id": "794"
  },
  {
    "type": "setData",
    "id": "794",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "795",
    "clusterId": "794",
    "x": 860,
    "y": 1430
  },
  {
    "type": "addJack",
    "id": "799",
    "partId": "795"
  },
  {
    "type": "setData",
    "id": "799",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "799",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "796"
  },
  {
    "type": "setData",
    "id": "796",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "797",
    "clusterId": "796",
    "x": 1080,
    "y": -540
  },
  {
    "type": "addPart",
    "id": "798",
    "clusterId": "796",
    "x": 1080,
    "y": -310
  },
  {
    "type": "addCluster",
    "id": "893"
  },
  {
    "type": "setData",
    "id": "893",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "894",
    "clusterId": "893",
    "x": 930,
    "y": 1460
  },
  {
    "type": "addJack",
    "id": "895",
    "partId": "894"
  },
  {
    "type": "setData",
    "id": "895",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "895",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "1057"
  },
  {
    "type": "setData",
    "id": "1057",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "1058",
    "clusterId": "1057",
    "x": 880,
    "y": 2430
  },
  {
    "type": "addJack",
    "id": "1059",
    "partId": "1058"
  },
  {
    "type": "setData",
    "id": "1059",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "setData",
    "id": "1059",
    "key": "type",
    "value": "output"
  },
  {
    "type": "addCluster",
    "id": "1145"
  },
  {
    "type": "setData",
    "id": "1145",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "1146",
    "clusterId": "1145",
    "x": 990,
    "y": 1490
  },
  {
    "type": "addJack",
    "id": "1147",
    "partId": "1146"
  },
  {
    "type": "setData",
    "id": "1147",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "1147",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "1207"
  },
  {
    "type": "setData",
    "id": "1207",
    "key": "type",
    "value": "portal"
  },
  {
    "type": "addPart",
    "id": "1208",
    "clusterId": "1207",
    "x": 930,
    "y": 1590
  },
  {
    "type": "addPart",
    "id": "1209",
    "clusterId": "1207",
    "x": 1430,
    "y": 1860
  },
  {
    "type": "addCluster",
    "id": "1255"
  },
  {
    "type": "setData",
    "id": "1255",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "1256",
    "clusterId": "1255",
    "x": 800,
    "y": 1860
  },
  {
    "type": "addPart",
    "id": "1257",
    "clusterId": "1255",
    "x": 1060,
    "y": 1860
  },
  {
    "type": "addCluster",
    "id": "1285"
  },
  {
    "type": "setData",
    "id": "1285",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "1286",
    "clusterId": "1285",
    "x": 710,
    "y": 2910
  },
  {
    "type": "addPart",
    "id": "1287",
    "clusterId": "1285",
    "x": 710,
    "y": 2120
  },
  {
    "type": "addCluster",
    "id": "1312"
  },
  {
    "type": "setData",
    "id": "1312",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "1313",
    "clusterId": "1312",
    "x": 710,
    "y": 2910
  },
  {
    "type": "addPart",
    "id": "1314",
    "clusterId": "1312",
    "x": 1560,
    "y": 2910
  },
  {
    "type": "addCluster",
    "id": "1319"
  },
  {
    "type": "setData",
    "id": "1319",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "1320",
    "clusterId": "1319",
    "x": 20,
    "y": -700
  },
  {
    "type": "addJack",
    "id": "1321",
    "partId": "1320"
  },
  {
    "type": "setData",
    "id": "1321",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "1321",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "addCluster",
    "id": "1447"
  },
  {
    "type": "setData",
    "id": "1447",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "1448",
    "clusterId": "1447",
    "x": 1560,
    "y": 2370
  },
  {
    "type": "addPart",
    "id": "1449",
    "clusterId": "1447",
    "x": 1560,
    "y": 2910
  },
  {
    "type": "addCluster",
    "id": "1456"
  },
  {
    "type": "setData",
    "id": "1456",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "1457",
    "clusterId": "1456",
    "x": 2470,
    "y": 2120
  },
  {
    "type": "addPart",
    "id": "1458",
    "clusterId": "1456",
    "x": 1560,
    "y": 2120
  },
  {
    "type": "addCluster",
    "id": "1471"
  },
  {
    "type": "setData",
    "id": "1471",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "1472",
    "clusterId": "1471",
    "x": 1560,
    "y": 2370
  },
  {
    "type": "addPart",
    "id": "1473",
    "clusterId": "1471",
    "x": 1840,
    "y": 2370
  },
  {
    "type": "addCluster",
    "id": "1492"
  },
  {
    "type": "setData",
    "id": "1492",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "1493",
    "clusterId": "1492",
    "x": 1230,
    "y": 2760
  },
  {
    "type": "addJack",
    "id": "1494",
    "partId": "1493"
  },
  {
    "type": "setData",
    "id": "1494",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "setData",
    "id": "1494",
    "key": "type",
    "value": "output"
  },
  {
    "type": "addCluster",
    "id": "1844"
  },
  {
    "type": "setData",
    "id": "1844",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "1845",
    "clusterId": "1844",
    "x": 750,
    "y": 2430
  },
  {
    "type": "addPart",
    "id": "1846",
    "clusterId": "1844",
    "x": 820,
    "y": 2430
  },
  {
    "type": "addCluster",
    "id": "1986"
  },
  {
    "type": "setData",
    "id": "1986",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "1987",
    "clusterId": "1986",
    "x": -520,
    "y": 30
  },
  {
    "type": "setData",
    "id": "1987",
    "key": "timeout",
    "value": "120"
  },
  {
    "type": "addJack",
    "id": "1988",
    "partId": "1987"
  },
  {
    "type": "setData",
    "id": "1988",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "1988",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "1989",
    "partId": "1987"
  },
  {
    "type": "setData",
    "id": "1989",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "1989",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "1998"
  },
  {
    "type": "setData",
    "id": "1998",
    "key": "type",
    "value": "not"
  },
  {
    "type": "addPart",
    "id": "1999",
    "clusterId": "1998",
    "x": -380,
    "y": 30
  },
  {
    "type": "addJack",
    "id": "2000",
    "partId": "1999"
  },
  {
    "type": "setData",
    "id": "2000",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "2000",
    "key": "name",
    "value": "X"
  },
  {
    "type": "addJack",
    "id": "2001",
    "partId": "1999"
  },
  {
    "type": "setData",
    "id": "2001",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "2001",
    "key": "name",
    "value": "NOT_X"
  },
  {
    "type": "addCluster",
    "id": "2190"
  },
  {
    "type": "setData",
    "id": "2190",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "2191",
    "clusterId": "2190",
    "x": -260,
    "y": 110
  },
  {
    "type": "setData",
    "id": "2191",
    "key": "timeout",
    "value": "60"
  },
  {
    "type": "addJack",
    "id": "2192",
    "partId": "2191"
  },
  {
    "type": "setData",
    "id": "2192",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "2192",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "2193",
    "partId": "2191"
  },
  {
    "type": "setData",
    "id": "2193",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "2193",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "2469"
  },
  {
    "type": "setData",
    "id": "2469",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "2470",
    "clusterId": "2469",
    "x": 2470,
    "y": 2120
  },
  {
    "type": "addPart",
    "id": "2471",
    "clusterId": "2469",
    "x": 2470,
    "y": 2740
  },
  {
    "type": "addCluster",
    "id": "2678"
  },
  {
    "type": "setData",
    "id": "2678",
    "key": "type",
    "value": "exit"
  },
  {
    "type": "addPart",
    "id": "2679",
    "clusterId": "2678",
    "x": 2150,
    "y": 2430
  },
  {
    "type": "setData",
    "id": "2679",
    "key": "url",
    "value": "../level3/"
  },
  {
    "type": "addCluster",
    "id": "2914"
  },
  {
    "type": "setData",
    "id": "2914",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "2915",
    "clusterId": "2914",
    "x": 1230,
    "y": 2800
  },
  {
    "type": "addPart",
    "id": "2916",
    "clusterId": "2914",
    "x": 1230,
    "y": 2880
  },
  {
    "type": "addCluster",
    "id": "3466"
  },
  {
    "type": "setData",
    "id": "3466",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "3467",
    "clusterId": "3466",
    "x": 680,
    "y": -310
  },
  {
    "type": "addPart",
    "id": "3468",
    "clusterId": "3466",
    "x": 680,
    "y": 810
  },
  {
    "type": "addCluster",
    "id": "3478"
  },
  {
    "type": "setData",
    "id": "3478",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "3479",
    "clusterId": "3478",
    "x": 680,
    "y": -370
  },
  {
    "type": "addJack",
    "id": "3480",
    "partId": "3479"
  },
  {
    "type": "setData",
    "id": "3480",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "3480",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "3505"
  },
  {
    "type": "setData",
    "id": "3505",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "3506",
    "clusterId": "3505",
    "x": 240,
    "y": -690
  },
  {
    "type": "addJack",
    "id": "3507",
    "partId": "3506"
  },
  {
    "type": "setData",
    "id": "3507",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "3507",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "addCluster",
    "id": "3597"
  },
  {
    "type": "setData",
    "id": "3597",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "3598",
    "clusterId": "3597",
    "x": 560,
    "y": 640
  },
  {
    "type": "addJack",
    "id": "3599",
    "partId": "3598"
  },
  {
    "type": "setData",
    "id": "3599",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "3599",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "3600"
  },
  {
    "type": "setData",
    "id": "3600",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "3601",
    "clusterId": "3600",
    "x": 490,
    "y": 570
  },
  {
    "type": "addJack",
    "id": "3602",
    "partId": "3601"
  },
  {
    "type": "setData",
    "id": "3602",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "3602",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "addCluster",
    "id": "3603"
  },
  {
    "type": "setData",
    "id": "3603",
    "key": "type",
    "value": "zapper"
  },
  {
    "type": "addPart",
    "id": "3604",
    "clusterId": "3603",
    "x": 530,
    "y": 810
  },
  {
    "type": "addJack",
    "id": "3605",
    "partId": "3604"
  },
  {
    "type": "setData",
    "id": "3605",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "3605",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "3706"
  },
  {
    "type": "setData",
    "id": "3706",
    "key": "type",
    "value": "button"
  },
  {
    "type": "addPart",
    "id": "3707",
    "clusterId": "3706",
    "x": 1020,
    "y": -430
  },
  {
    "type": "addJack",
    "id": "3708",
    "partId": "3707"
  },
  {
    "type": "setData",
    "id": "3708",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "3708",
    "key": "name",
    "value": "CLICKED"
  },
  {
    "type": "addCluster",
    "id": "3943"
  },
  {
    "type": "setData",
    "id": "3943",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "3944",
    "clusterId": "3943",
    "x": 890,
    "y": -340
  },
  {
    "type": "setData",
    "id": "3944",
    "key": "timeout",
    "value": "Infinity"
  },
  {
    "type": "addJack",
    "id": "3945",
    "partId": "3944"
  },
  {
    "type": "setData",
    "id": "3945",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "3945",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "3946",
    "partId": "3944"
  },
  {
    "type": "setData",
    "id": "3946",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "3946",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "4441"
  },
  {
    "type": "setData",
    "id": "4441",
    "key": "type",
    "value": "block"
  },
  {
    "type": "addPart",
    "id": "4442",
    "clusterId": "4441",
    "x": 770,
    "y": -430
  },
  {
    "type": "addCluster",
    "id": "5296"
  },
  {
    "type": "setData",
    "id": "5296",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "5297",
    "clusterId": "5296",
    "x": -1030,
    "y": -600
  },
  {
    "type": "addPart",
    "id": "5298",
    "clusterId": "5296",
    "x": -100,
    "y": -600
  },
  {
    "type": "addCluster",
    "id": "5311"
  },
  {
    "type": "setData",
    "id": "5311",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "5312",
    "clusterId": "5311",
    "x": -1030,
    "y": -990
  },
  {
    "type": "addPart",
    "id": "5313",
    "clusterId": "5311",
    "x": -1030,
    "y": -600
  },
  {
    "type": "addCluster",
    "id": "5326"
  },
  {
    "type": "setData",
    "id": "5326",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "5327",
    "clusterId": "5326",
    "x": -1660,
    "y": -990
  },
  {
    "type": "addPart",
    "id": "5328",
    "clusterId": "5326",
    "x": -1030,
    "y": -990
  },
  {
    "type": "addCluster",
    "id": "5341"
  },
  {
    "type": "setData",
    "id": "5341",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "5342",
    "clusterId": "5341",
    "x": -1660,
    "y": -990
  },
  {
    "type": "addPart",
    "id": "5343",
    "clusterId": "5341",
    "x": -1660,
    "y": -300
  },
  {
    "type": "addCluster",
    "id": "5371"
  },
  {
    "type": "setData",
    "id": "5371",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "5372",
    "clusterId": "5371",
    "x": -1660,
    "y": -300
  },
  {
    "type": "addPart",
    "id": "5373",
    "clusterId": "5371",
    "x": -100,
    "y": -300
  },
  {
    "type": "addCluster",
    "id": "6735"
  },
  {
    "type": "setData",
    "id": "6735",
    "key": "type",
    "value": "player_assembler"
  },
  {
    "type": "addPart",
    "id": "6736",
    "clusterId": "6735",
    "x": -1350,
    "y": -800
  },
  {
    "type": "addLink",
    "id": "41",
    "jackId1": 36,
    "jackId2": 39
  },
  {
    "type": "addLink",
    "id": "56",
    "jackId1": "2001",
    "jackId2": 2192
  },
  {
    "type": "addLink",
    "id": "64",
    "jackId1": "40",
    "jackId2": 1147
  },
  {
    "type": "addLink",
    "id": "71",
    "jackId1": 70,
    "jackId2": 67
  },
  {
    "type": "addLink",
    "id": "80",
    "jackId1": "40",
    "jackId2": 895
  },
  {
    "type": "addLink",
    "id": "100",
    "jackId1": "40",
    "jackId2": 799
  },
  {
    "type": "addLink",
    "id": "113",
    "jackId1": "2193",
    "jackId2": 73
  },
  {
    "type": "addLink",
    "id": "273",
    "jackId1": "224",
    "jackId2": 54
  },
  {
    "type": "addLink",
    "id": "318",
    "jackId1": "50",
    "jackId2": 2193
  },
  {
    "type": "addLink",
    "id": "363",
    "jackId1": "3946",
    "jackId2": 203
  },
  {
    "type": "addLink",
    "id": "378",
    "jackId1": "3507",
    "jackId2": 203
  },
  {
    "type": "addLink",
    "id": "424",
    "jackId1": "3946",
    "jackId2": 324
  },
  {
    "type": "addLink",
    "id": "620",
    "jackId1": "40",
    "jackId2": 601
  },
  {
    "type": "addLink",
    "id": "656",
    "jackId1": "270",
    "jackId2": "1059"
  },
  {
    "type": "addLink",
    "id": "675",
    "jackId1": "15",
    "jackId2": 466
  },
  {
    "type": "addLink",
    "id": "700",
    "jackId1": "484",
    "jackId2": "267"
  },
  {
    "type": "addLink",
    "id": "717",
    "jackId1": "496",
    "jackId2": "1494"
  },
  {
    "type": "addLink",
    "id": "1159",
    "jackId1": "126",
    "jackId2": 799
  },
  {
    "type": "addLink",
    "id": "1174",
    "jackId1": "144",
    "jackId2": 895
  },
  {
    "type": "addLink",
    "id": "1194",
    "jackId1": "159",
    "jackId2": 1147
  },
  {
    "type": "addLink",
    "id": "1358",
    "jackId1": "1321",
    "jackId2": 3480
  },
  {
    "type": "addLink",
    "id": "2021",
    "jackId1": "2001",
    "jackId2": 1988
  },
  {
    "type": "addLink",
    "id": "2177",
    "jackId1": "1989",
    "jackId2": 2000
  },
  {
    "type": "addLink",
    "id": "3606",
    "jackId1": 3602,
    "jackId2": 3599
  },
  {
    "type": "addLink",
    "id": "3626",
    "jackId1": "2193",
    "jackId2": 3605
  },
  {
    "type": "addLink",
    "id": "4024",
    "jackId1": "3708",
    "jackId2": 3945
  },
  {
    "type": "addLink",
    "id": "4042",
    "jackId1": "3946",
    "jackId2": 3480
  }
];