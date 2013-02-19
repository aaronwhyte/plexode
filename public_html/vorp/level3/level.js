var vorpLevels = vorpLevels || {};
vorpLevels['level 3'] =
[
  {
    "type": "addCluster",
    "id": "10"
  },
  {
    "type": "setData",
    "id": "10",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "11",
    "clusterId": "10",
    "x": 1120,
    "y": -470
  },
  {
    "type": "addPart",
    "id": "14",
    "clusterId": "10",
    "x": 1120,
    "y": 410
  },
  {
    "type": "addCluster",
    "id": "12"
  },
  {
    "type": "setData",
    "id": "12",
    "key": "type",
    "value": "block"
  },
  {
    "type": "addPart",
    "id": "13",
    "clusterId": "12",
    "x": 170,
    "y": 0
  },
  {
    "type": "addCluster",
    "id": "18"
  },
  {
    "type": "setData",
    "id": "18",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "19",
    "clusterId": "18",
    "x": -1380,
    "y": -300
  },
  {
    "type": "addPart",
    "id": "20",
    "clusterId": "18",
    "x": -1380,
    "y": 180
  },
  {
    "type": "addCluster",
    "id": "31"
  },
  {
    "type": "setData",
    "id": "31",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "32",
    "clusterId": "31",
    "x": 30,
    "y": 410
  },
  {
    "type": "addPart",
    "id": "33",
    "clusterId": "31",
    "x": 1120,
    "y": 410
  },
  {
    "type": "addCluster",
    "id": "56"
  },
  {
    "type": "setData",
    "id": "56",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "57",
    "clusterId": "56",
    "x": 30,
    "y": -470
  },
  {
    "type": "addPart",
    "id": "58",
    "clusterId": "56",
    "x": 1120,
    "y": -470
  },
  {
    "type": "addCluster",
    "id": "183"
  },
  {
    "type": "setData",
    "id": "183",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "184",
    "clusterId": "183",
    "x": 530,
    "y": -90
  },
  {
    "type": "addPart",
    "id": "185",
    "clusterId": "183",
    "x": 800,
    "y": -90
  },
  {
    "type": "addCluster",
    "id": "240"
  },
  {
    "type": "setData",
    "id": "240",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "241",
    "clusterId": "240",
    "x": -1860,
    "y": -1040
  },
  {
    "type": "addPart",
    "id": "242",
    "clusterId": "240",
    "x": -1860,
    "y": -300
  },
  {
    "type": "addCluster",
    "id": "282"
  },
  {
    "type": "setData",
    "id": "282",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "283",
    "clusterId": "282",
    "x": -60,
    "y": 1470
  },
  {
    "type": "addJack",
    "id": "284",
    "partId": "283"
  },
  {
    "type": "setData",
    "id": "284",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "284",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "addCluster",
    "id": "297"
  },
  {
    "type": "setData",
    "id": "297",
    "key": "type",
    "value": "not"
  },
  {
    "type": "addPart",
    "id": "298",
    "clusterId": "297",
    "x": -70,
    "y": 1650
  },
  {
    "type": "addJack",
    "id": "299",
    "partId": "298"
  },
  {
    "type": "setData",
    "id": "299",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "299",
    "key": "name",
    "value": "X"
  },
  {
    "type": "addJack",
    "id": "300",
    "partId": "298"
  },
  {
    "type": "setData",
    "id": "300",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "300",
    "key": "name",
    "value": "NOT_X"
  },
  {
    "type": "addCluster",
    "id": "408"
  },
  {
    "type": "setData",
    "id": "408",
    "key": "type",
    "value": "zapper"
  },
  {
    "type": "addPart",
    "id": "409",
    "clusterId": "408",
    "x": -1980,
    "y": -300
  },
  {
    "type": "addJack",
    "id": "410",
    "partId": "409"
  },
  {
    "type": "setData",
    "id": "410",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "410",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "420"
  },
  {
    "type": "setData",
    "id": "420",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "421",
    "clusterId": "420",
    "x": -20,
    "y": 1580
  },
  {
    "type": "setData",
    "id": "421",
    "key": "timeout",
    "value": "60"
  },
  {
    "type": "addJack",
    "id": "422",
    "partId": "421"
  },
  {
    "type": "setData",
    "id": "422",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "422",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "423",
    "partId": "421"
  },
  {
    "type": "setData",
    "id": "423",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "423",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "426"
  },
  {
    "type": "setData",
    "id": "426",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "427",
    "clusterId": "426",
    "x": -210,
    "y": 1510
  },
  {
    "type": "addPart",
    "id": "428",
    "clusterId": "426",
    "x": -210,
    "y": 410
  },
  {
    "type": "addCluster",
    "id": "534"
  },
  {
    "type": "setData",
    "id": "534",
    "key": "type",
    "value": "zapper"
  },
  {
    "type": "addPart",
    "id": "535",
    "clusterId": "534",
    "x": -140,
    "y": 1510
  },
  {
    "type": "addJack",
    "id": "536",
    "partId": "535"
  },
  {
    "type": "setData",
    "id": "536",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "536",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "680"
  },
  {
    "type": "setData",
    "id": "680",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "681",
    "clusterId": "680",
    "x": 530,
    "y": -90
  },
  {
    "type": "addPart",
    "id": "682",
    "clusterId": "680",
    "x": 530,
    "y": 410
  },
  {
    "type": "addCluster",
    "id": "822"
  },
  {
    "type": "setData",
    "id": "822",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "823",
    "clusterId": "822",
    "x": 30,
    "y": 1510
  },
  {
    "type": "addPart",
    "id": "824",
    "clusterId": "822",
    "x": 30,
    "y": 410
  },
  {
    "type": "addCluster",
    "id": "831"
  },
  {
    "type": "setData",
    "id": "831",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "832",
    "clusterId": "831",
    "x": -2100,
    "y": 410
  },
  {
    "type": "addPart",
    "id": "833",
    "clusterId": "831",
    "x": -210,
    "y": 410
  },
  {
    "type": "addCluster",
    "id": "1029"
  },
  {
    "type": "setData",
    "id": "1029",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "1030",
    "clusterId": "1029",
    "x": -2000,
    "y": -390
  },
  {
    "type": "addJack",
    "id": "1031",
    "partId": "1030"
  },
  {
    "type": "setData",
    "id": "1031",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "1031",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "addCluster",
    "id": "1037"
  },
  {
    "type": "setData",
    "id": "1037",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "1038",
    "clusterId": "1037",
    "x": -90,
    "y": 440
  },
  {
    "type": "addJack",
    "id": "1039",
    "partId": "1038"
  },
  {
    "type": "setData",
    "id": "1039",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "1039",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "addCluster",
    "id": "1040"
  },
  {
    "type": "setData",
    "id": "1040",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "1041",
    "clusterId": "1040",
    "x": -40,
    "y": 510
  },
  {
    "type": "setData",
    "id": "1041",
    "key": "timeout",
    "value": "Infinity"
  },
  {
    "type": "addJack",
    "id": "1042",
    "partId": "1041"
  },
  {
    "type": "setData",
    "id": "1042",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "1042",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "1043",
    "partId": "1041"
  },
  {
    "type": "setData",
    "id": "1043",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "1043",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "1044"
  },
  {
    "type": "setData",
    "id": "1044",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "1045",
    "clusterId": "1044",
    "x": -100,
    "y": 410
  },
  {
    "type": "addJack",
    "id": "1046",
    "partId": "1045"
  },
  {
    "type": "setData",
    "id": "1046",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "1046",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "1060"
  },
  {
    "type": "setData",
    "id": "1060",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "1061",
    "clusterId": "1060",
    "x": -2190,
    "y": -350
  },
  {
    "type": "setData",
    "id": "1061",
    "key": "timeout",
    "value": "Infinity"
  },
  {
    "type": "addJack",
    "id": "1062",
    "partId": "1061"
  },
  {
    "type": "setData",
    "id": "1062",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "1062",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "1063",
    "partId": "1061"
  },
  {
    "type": "setData",
    "id": "1063",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "1063",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "1105"
  },
  {
    "type": "setData",
    "id": "1105",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "1106",
    "clusterId": "1105",
    "x": -1860,
    "y": -1040
  },
  {
    "type": "addPart",
    "id": "1107",
    "clusterId": "1105",
    "x": -1670,
    "y": -1040
  },
  {
    "type": "addCluster",
    "id": "1270"
  },
  {
    "type": "setData",
    "id": "1270",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "1271",
    "clusterId": "1270",
    "x": -210,
    "y": 180
  },
  {
    "type": "addPart",
    "id": "1272",
    "clusterId": "1270",
    "x": -1380,
    "y": 180
  },
  {
    "type": "addCluster",
    "id": "1377"
  },
  {
    "type": "setData",
    "id": "1377",
    "key": "type",
    "value": "button"
  },
  {
    "type": "addPart",
    "id": "1378",
    "clusterId": "1377",
    "x": -1470,
    "y": 110
  },
  {
    "type": "addJack",
    "id": "1379",
    "partId": "1378"
  },
  {
    "type": "setData",
    "id": "1379",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "1379",
    "key": "name",
    "value": "CLICKED"
  },
  {
    "type": "addCluster",
    "id": "1381"
  },
  {
    "type": "setData",
    "id": "1381",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "1382",
    "clusterId": "1381",
    "x": -2290,
    "y": -1040
  },
  {
    "type": "addPart",
    "id": "1383",
    "clusterId": "1381",
    "x": -2100,
    "y": -1040
  },
  {
    "type": "addCluster",
    "id": "1396"
  },
  {
    "type": "setData",
    "id": "1396",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "1397",
    "clusterId": "1396",
    "x": -2290,
    "y": -1040
  },
  {
    "type": "addPart",
    "id": "1398",
    "clusterId": "1396",
    "x": -2290,
    "y": -1650
  },
  {
    "type": "addCluster",
    "id": "1518"
  },
  {
    "type": "setData",
    "id": "1518",
    "key": "type",
    "value": "button"
  },
  {
    "type": "addPart",
    "id": "1519",
    "clusterId": "1518",
    "x": -2060,
    "y": 110
  },
  {
    "type": "addJack",
    "id": "1520",
    "partId": "1519"
  },
  {
    "type": "setData",
    "id": "1520",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "1520",
    "key": "name",
    "value": "CLICKED"
  },
  {
    "type": "addCluster",
    "id": "1666"
  },
  {
    "type": "setData",
    "id": "1666",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "1667",
    "clusterId": "1666",
    "x": -1670,
    "y": -1040
  },
  {
    "type": "addPart",
    "id": "1668",
    "clusterId": "1666",
    "x": -1670,
    "y": -1650
  },
  {
    "type": "addCluster",
    "id": "1681"
  },
  {
    "type": "setData",
    "id": "1681",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "1682",
    "clusterId": "1681",
    "x": -2290,
    "y": -1650
  },
  {
    "type": "addPart",
    "id": "1683",
    "clusterId": "1681",
    "x": -1670,
    "y": -1650
  },
  {
    "type": "addCluster",
    "id": "1783"
  },
  {
    "type": "setData",
    "id": "1783",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "1784",
    "clusterId": "1783",
    "x": -1380,
    "y": -300
  },
  {
    "type": "addPart",
    "id": "1785",
    "clusterId": "1783",
    "x": -1860,
    "y": -300
  },
  {
    "type": "addCluster",
    "id": "2064"
  },
  {
    "type": "setData",
    "id": "2064",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "2065",
    "clusterId": "2064",
    "x": -1930,
    "y": -330
  },
  {
    "type": "addJack",
    "id": "2066",
    "partId": "2065"
  },
  {
    "type": "setData",
    "id": "2066",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "2066",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "2439"
  },
  {
    "type": "setData",
    "id": "2439",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "2440",
    "clusterId": "2439",
    "x": -240,
    "y": 250
  },
  {
    "type": "addJack",
    "id": "2441",
    "partId": "2440"
  },
  {
    "type": "setData",
    "id": "2441",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "2441",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "addCluster",
    "id": "2721"
  },
  {
    "type": "setData",
    "id": "2721",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "2722",
    "clusterId": "2721",
    "x": -2050,
    "y": -360
  },
  {
    "type": "addJack",
    "id": "2723",
    "partId": "2722"
  },
  {
    "type": "setData",
    "id": "2723",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "2723",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "2740"
  },
  {
    "type": "setData",
    "id": "2740",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "2741",
    "clusterId": "2740",
    "x": -2100,
    "y": -1040
  },
  {
    "type": "addPart",
    "id": "2742",
    "clusterId": "2740",
    "x": -2100,
    "y": 410
  },
  {
    "type": "addCluster",
    "id": "2749"
  },
  {
    "type": "setData",
    "id": "2749",
    "key": "type",
    "value": "player_assembler"
  },
  {
    "type": "addPart",
    "id": "2750",
    "clusterId": "2749",
    "x": -80,
    "y": -1310
  },
  {
    "type": "addCluster",
    "id": "2785"
  },
  {
    "type": "setData",
    "id": "2785",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "2786",
    "clusterId": "2785",
    "x": -1980,
    "y": 110
  },
  {
    "type": "setData",
    "id": "2786",
    "key": "timeout",
    "value": "50"
  },
  {
    "type": "addJack",
    "id": "2787",
    "partId": "2786"
  },
  {
    "type": "setData",
    "id": "2787",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "2787",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "2788",
    "partId": "2786"
  },
  {
    "type": "setData",
    "id": "2788",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "2788",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "2805"
  },
  {
    "type": "setData",
    "id": "2805",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "2806",
    "clusterId": "2805",
    "x": -1580,
    "y": 110
  },
  {
    "type": "setData",
    "id": "2806",
    "key": "timeout",
    "value": "50"
  },
  {
    "type": "addJack",
    "id": "2807",
    "partId": "2806"
  },
  {
    "type": "setData",
    "id": "2807",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "2807",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "2808",
    "partId": "2806"
  },
  {
    "type": "setData",
    "id": "2808",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "2808",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "2831"
  },
  {
    "type": "setData",
    "id": "2831",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "2832",
    "clusterId": "2831",
    "x": -310,
    "y": 330
  },
  {
    "type": "setData",
    "id": "2832",
    "key": "timeout",
    "value": "Infinity"
  },
  {
    "type": "addJack",
    "id": "2833",
    "partId": "2832"
  },
  {
    "type": "setData",
    "id": "2833",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "2833",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "2834",
    "partId": "2832"
  },
  {
    "type": "setData",
    "id": "2834",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "2834",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "3079"
  },
  {
    "type": "setData",
    "id": "3079",
    "key": "type",
    "value": "exit"
  },
  {
    "type": "addPart",
    "id": "3080",
    "clusterId": "3079",
    "x": -90,
    "y": 2150
  },
  {
    "type": "setData",
    "id": "3080",
    "key": "url",
    "value": "../"
  },
  {
    "type": "addCluster",
    "id": "3126"
  },
  {
    "type": "setData",
    "id": "3126",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "3127",
    "clusterId": "3126",
    "x": -210,
    "y": 290
  },
  {
    "type": "addJack",
    "id": "3128",
    "partId": "3127"
  },
  {
    "type": "setData",
    "id": "3128",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "3128",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "3207"
  },
  {
    "type": "setData",
    "id": "3207",
    "key": "type",
    "value": "portal"
  },
  {
    "type": "addPart",
    "id": "3208",
    "clusterId": "3207",
    "x": -1980,
    "y": -470
  },
  {
    "type": "addPart",
    "id": "3209",
    "clusterId": "3207",
    "x": -1980,
    "y": -1360
  },
  {
    "type": "addCluster",
    "id": "3438"
  },
  {
    "type": "setData",
    "id": "3438",
    "key": "type",
    "value": "button"
  },
  {
    "type": "addPart",
    "id": "3439",
    "clusterId": "3438",
    "x": 430,
    "y": 290
  },
  {
    "type": "addJack",
    "id": "3440",
    "partId": "3439"
  },
  {
    "type": "setData",
    "id": "3440",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "3440",
    "key": "name",
    "value": "CLICKED"
  },
  {
    "type": "addCluster",
    "id": "3453"
  },
  {
    "type": "setData",
    "id": "3453",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "3454",
    "clusterId": "3453",
    "x": 320,
    "y": 280
  },
  {
    "type": "setData",
    "id": "3454",
    "key": "timeout",
    "value": "20"
  },
  {
    "type": "addJack",
    "id": "3455",
    "partId": "3454"
  },
  {
    "type": "setData",
    "id": "3455",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "3455",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "3456",
    "partId": "3454"
  },
  {
    "type": "setData",
    "id": "3456",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "3456",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "3908"
  },
  {
    "type": "setData",
    "id": "3908",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "3909",
    "clusterId": "3908",
    "x": 30,
    "y": -910
  },
  {
    "type": "addPart",
    "id": "3910",
    "clusterId": "3908",
    "x": 30,
    "y": -470
  },
  {
    "type": "addCluster",
    "id": "3911"
  },
  {
    "type": "setData",
    "id": "3911",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "3912",
    "clusterId": "3911",
    "x": 30,
    "y": -910
  },
  {
    "type": "addPart",
    "id": "3913",
    "clusterId": "3911",
    "x": 220,
    "y": -910
  },
  {
    "type": "addCluster",
    "id": "3914"
  },
  {
    "type": "setData",
    "id": "3914",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "3915",
    "clusterId": "3914",
    "x": -400,
    "y": -910
  },
  {
    "type": "addPart",
    "id": "3916",
    "clusterId": "3914",
    "x": -210,
    "y": -910
  },
  {
    "type": "addCluster",
    "id": "3917"
  },
  {
    "type": "setData",
    "id": "3917",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "3918",
    "clusterId": "3917",
    "x": -400,
    "y": -910
  },
  {
    "type": "addPart",
    "id": "3919",
    "clusterId": "3917",
    "x": -400,
    "y": -1520
  },
  {
    "type": "addCluster",
    "id": "3920"
  },
  {
    "type": "setData",
    "id": "3920",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "3921",
    "clusterId": "3920",
    "x": 220,
    "y": -910
  },
  {
    "type": "addPart",
    "id": "3922",
    "clusterId": "3920",
    "x": 220,
    "y": -1520
  },
  {
    "type": "addCluster",
    "id": "3923"
  },
  {
    "type": "setData",
    "id": "3923",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "3924",
    "clusterId": "3923",
    "x": -400,
    "y": -1520
  },
  {
    "type": "addPart",
    "id": "3925",
    "clusterId": "3923",
    "x": 220,
    "y": -1520
  },
  {
    "type": "addCluster",
    "id": "3926"
  },
  {
    "type": "setData",
    "id": "3926",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "3927",
    "clusterId": "3926",
    "x": -210,
    "y": -910
  },
  {
    "type": "addPart",
    "id": "3928",
    "clusterId": "3926",
    "x": -210,
    "y": 180
  },
  {
    "type": "addCluster",
    "id": "3932"
  },
  {
    "type": "setData",
    "id": "3932",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "3933",
    "clusterId": "3932",
    "x": 30,
    "y": 1510
  },
  {
    "type": "addPart",
    "id": "3934",
    "clusterId": "3932",
    "x": 220,
    "y": 1510
  },
  {
    "type": "addCluster",
    "id": "3935"
  },
  {
    "type": "setData",
    "id": "3935",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "3936",
    "clusterId": "3935",
    "x": -400,
    "y": 1510
  },
  {
    "type": "addPart",
    "id": "3937",
    "clusterId": "3935",
    "x": -210,
    "y": 1510
  },
  {
    "type": "addCluster",
    "id": "4400"
  },
  {
    "type": "setData",
    "id": "4400",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "4401",
    "clusterId": "4400",
    "x": -400,
    "y": 2460
  },
  {
    "type": "addPart",
    "id": "4402",
    "clusterId": "4400",
    "x": -400,
    "y": 1510
  },
  {
    "type": "addCluster",
    "id": "4403"
  },
  {
    "type": "setData",
    "id": "4403",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "4404",
    "clusterId": "4403",
    "x": 220,
    "y": 2460
  },
  {
    "type": "addPart",
    "id": "4405",
    "clusterId": "4403",
    "x": 220,
    "y": 1510
  },
  {
    "type": "addCluster",
    "id": "4631"
  },
  {
    "type": "setData",
    "id": "4631",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "4632",
    "clusterId": "4631",
    "x": -400,
    "y": 2460
  },
  {
    "type": "addPart",
    "id": "4633",
    "clusterId": "4631",
    "x": 220,
    "y": 2460
  },
  {
    "type": "addCluster",
    "id": "5933"
  },
  {
    "type": "setData",
    "id": "5933",
    "key": "type",
    "value": "button"
  },
  {
    "type": "addPart",
    "id": "5934",
    "clusterId": "5933",
    "x": 690,
    "y": 0
  },
  {
    "type": "addJack",
    "id": "5935",
    "partId": "5934"
  },
  {
    "type": "setData",
    "id": "5935",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "5935",
    "key": "name",
    "value": "CLICKED"
  },
  {
    "type": "addCluster",
    "id": "5936"
  },
  {
    "type": "setData",
    "id": "5936",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "5937",
    "clusterId": "5936",
    "x": 50,
    "y": 10
  },
  {
    "type": "setData",
    "id": "5937",
    "key": "timeout",
    "value": "40"
  },
  {
    "type": "addJack",
    "id": "5938",
    "partId": "5937"
  },
  {
    "type": "setData",
    "id": "5938",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "5938",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "5939",
    "partId": "5937"
  },
  {
    "type": "setData",
    "id": "5939",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "5939",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "6248"
  },
  {
    "type": "setData",
    "id": "6248",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "6249",
    "clusterId": "6248",
    "x": -110,
    "y": -700
  },
  {
    "type": "addJack",
    "id": "6250",
    "partId": "6249"
  },
  {
    "type": "setData",
    "id": "6250",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "6250",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "addCluster",
    "id": "6251"
  },
  {
    "type": "setData",
    "id": "6251",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "6252",
    "clusterId": "6251",
    "x": -140,
    "y": -430
  },
  {
    "type": "setData",
    "id": "6252",
    "key": "timeout",
    "value": "Infinity"
  },
  {
    "type": "addJack",
    "id": "6253",
    "partId": "6252"
  },
  {
    "type": "setData",
    "id": "6253",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "6253",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "6254",
    "partId": "6252"
  },
  {
    "type": "setData",
    "id": "6254",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "6254",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "6255"
  },
  {
    "type": "setData",
    "id": "6255",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "6256",
    "clusterId": "6255",
    "x": -40,
    "y": -470
  },
  {
    "type": "addJack",
    "id": "6257",
    "partId": "6256"
  },
  {
    "type": "setData",
    "id": "6257",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "6257",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addLink",
    "id": "439",
    "jackId1": "284",
    "jackId2": 422
  },
  {
    "type": "addLink",
    "id": "452",
    "jackId1": "423",
    "jackId2": 299
  },
  {
    "type": "addLink",
    "id": "486",
    "jackId1": "300",
    "jackId2": 536
  },
  {
    "type": "addLink",
    "id": "1047",
    "jackId1": 1039,
    "jackId2": 1042
  },
  {
    "type": "addLink",
    "id": "1048",
    "jackId1": 1043,
    "jackId2": 1046
  },
  {
    "type": "addLink",
    "id": "1111",
    "jackId1": "1031",
    "jackId2": 1062
  },
  {
    "type": "addLink",
    "id": "1130",
    "jackId1": "1063",
    "jackId2": 2723
  },
  {
    "type": "addLink",
    "id": "1147",
    "jackId1": "1063",
    "jackId2": 2066
  },
  {
    "type": "addLink",
    "id": "2820",
    "jackId1": "1379",
    "jackId2": 2807
  },
  {
    "type": "addLink",
    "id": "2845",
    "jackId1": "2441",
    "jackId2": 2833
  },
  {
    "type": "addLink",
    "id": "2849",
    "jackId1": "2808",
    "jackId2": 2066
  },
  {
    "type": "addLink",
    "id": "2862",
    "jackId1": "2834",
    "jackId2": 3128
  },
  {
    "type": "addLink",
    "id": "2863",
    "jackId1": "1520",
    "jackId2": 2787
  },
  {
    "type": "addLink",
    "id": "2904",
    "jackId1": "2788",
    "jackId2": 2723
  },
  {
    "type": "addLink",
    "id": "3469",
    "jackId1": "3455",
    "jackId2": 3440
  },
  {
    "type": "addLink",
    "id": "3485",
    "jackId1": "3456",
    "jackId2": 3128
  },
  {
    "type": "addLink",
    "id": "5940",
    "jackId1": 5938,
    "jackId2": 5935
  },
  {
    "type": "addLink",
    "id": "5958",
    "jackId1": "5939",
    "jackId2": 1046
  },
  {
    "type": "addLink",
    "id": "6258",
    "jackId1": 6250,
    "jackId2": 6253
  },
  {
    "type": "addLink",
    "id": "6259",
    "jackId1": 6254,
    "jackId2": 6257
  }
];