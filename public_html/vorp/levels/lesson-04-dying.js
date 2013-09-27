var vorpLevels = vorpLevels || {};
vorpLevels['lesson-04'] = [
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
    "x": -384,
    "y": -64
  },
  {
    "type": "addPart",
    "id": "9",
    "clusterId": "7",
    "x": 1280,
    "y": -64
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
    "x": -384,
    "y": -64
  },
  {
    "type": "addPart",
    "id": "21",
    "clusterId": "19",
    "x": -384,
    "y": 704
  },
  {
    "type": "addCluster",
    "id": "22"
  },
  {
    "type": "setData",
    "id": "22",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "23",
    "clusterId": "22",
    "x": 448,
    "y": 576
  },
  {
    "type": "setData",
    "id": "23",
    "key": "timeout",
    "value": "Infinity"
  },
  {
    "type": "addJack",
    "id": "24",
    "partId": "23"
  },
  {
    "type": "setData",
    "id": "24",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "24",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "25",
    "partId": "23"
  },
  {
    "type": "setData",
    "id": "25",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "25",
    "key": "name",
    "value": "RUNNING"
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
    "x": -576,
    "y": 704
  },
  {
    "type": "addPart",
    "id": "33",
    "clusterId": "31",
    "x": 768,
    "y": 704
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
    "x": 1280,
    "y": -64
  },
  {
    "type": "addPart",
    "id": "45",
    "clusterId": "43",
    "x": 1280,
    "y": 960
  },
  {
    "type": "addCluster",
    "id": "52"
  },
  {
    "type": "setData",
    "id": "52",
    "key": "type",
    "value": "player_assembler"
  },
  {
    "type": "addPart",
    "id": "53",
    "clusterId": "52",
    "x": 1184,
    "y": 832
  },
  {
    "type": "addCluster",
    "id": "96"
  },
  {
    "type": "setData",
    "id": "96",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "97",
    "clusterId": "96",
    "x": -576,
    "y": 960
  },
  {
    "type": "addPart",
    "id": "98",
    "clusterId": "96",
    "x": 1280,
    "y": 960
  },
  {
    "type": "addCluster",
    "id": "111"
  },
  {
    "type": "setData",
    "id": "111",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "112",
    "clusterId": "111",
    "x": 0,
    "y": 320
  },
  {
    "type": "addPart",
    "id": "113",
    "clusterId": "111",
    "x": 0,
    "y": 704
  },
  {
    "type": "addCluster",
    "id": "150"
  },
  {
    "type": "setData",
    "id": "150",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "151",
    "clusterId": "150",
    "x": 384,
    "y": 704
  },
  {
    "type": "addPart",
    "id": "152",
    "clusterId": "150",
    "x": 384,
    "y": 320
  },
  {
    "type": "addCluster",
    "id": "174"
  },
  {
    "type": "setData",
    "id": "174",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "175",
    "clusterId": "174",
    "x": -576,
    "y": 576
  },
  {
    "type": "addPart",
    "id": "176",
    "clusterId": "174",
    "x": -576,
    "y": 704
  },
  {
    "type": "addCluster",
    "id": "195"
  },
  {
    "type": "setData",
    "id": "195",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "196",
    "clusterId": "195",
    "x": -64,
    "y": 320
  },
  {
    "type": "addJack",
    "id": "197",
    "partId": "196"
  },
  {
    "type": "setData",
    "id": "197",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "197",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "addCluster",
    "id": "249"
  },
  {
    "type": "setData",
    "id": "249",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "250",
    "clusterId": "249",
    "x": 256,
    "y": 320
  },
  {
    "type": "addJack",
    "id": "251",
    "partId": "250"
  },
  {
    "type": "setData",
    "id": "251",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "251",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "addCluster",
    "id": "252"
  },
  {
    "type": "setData",
    "id": "252",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "253",
    "clusterId": "252",
    "x": -576,
    "y": 960
  },
  {
    "type": "addPart",
    "id": "254",
    "clusterId": "252",
    "x": -576,
    "y": 1088
  },
  {
    "type": "addCluster",
    "id": "294"
  },
  {
    "type": "setData",
    "id": "294",
    "key": "type",
    "value": "beam_sensor"
  },
  {
    "type": "addPart",
    "id": "295",
    "clusterId": "294",
    "x": 704,
    "y": 320
  },
  {
    "type": "addJack",
    "id": "296",
    "partId": "295"
  },
  {
    "type": "setData",
    "id": "296",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "296",
    "key": "name",
    "value": "BEAM_BROKEN"
  },
  {
    "type": "addCluster",
    "id": "300"
  },
  {
    "type": "setData",
    "id": "300",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "301",
    "clusterId": "300",
    "x": 768,
    "y": 704
  },
  {
    "type": "addPart",
    "id": "302",
    "clusterId": "300",
    "x": 768,
    "y": 320
  },
  {
    "type": "addCluster",
    "id": "312"
  },
  {
    "type": "setData",
    "id": "312",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "313",
    "clusterId": "312",
    "x": -128,
    "y": 320
  },
  {
    "type": "setData",
    "id": "313",
    "key": "timeout",
    "value": "20"
  },
  {
    "type": "addJack",
    "id": "314",
    "partId": "313"
  },
  {
    "type": "setData",
    "id": "314",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "314",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "315",
    "partId": "313"
  },
  {
    "type": "setData",
    "id": "315",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "315",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "328"
  },
  {
    "type": "setData",
    "id": "328",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "329",
    "clusterId": "328",
    "x": 192,
    "y": 320
  },
  {
    "type": "setData",
    "id": "329",
    "key": "timeout",
    "value": "20"
  },
  {
    "type": "addJack",
    "id": "330",
    "partId": "329"
  },
  {
    "type": "setData",
    "id": "330",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "330",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "331",
    "partId": "329"
  },
  {
    "type": "setData",
    "id": "331",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "331",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "340"
  },
  {
    "type": "setData",
    "id": "340",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "341",
    "clusterId": "340",
    "x": 640,
    "y": 384
  },
  {
    "type": "setData",
    "id": "341",
    "key": "timeout",
    "value": "20"
  },
  {
    "type": "addJack",
    "id": "342",
    "partId": "341"
  },
  {
    "type": "setData",
    "id": "342",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "342",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "343",
    "partId": "341"
  },
  {
    "type": "setData",
    "id": "343",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "343",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "354"
  },
  {
    "type": "setData",
    "id": "354",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "355",
    "clusterId": "354",
    "x": -1088,
    "y": 576
  },
  {
    "type": "addPart",
    "id": "357",
    "clusterId": "354",
    "x": -1088,
    "y": 1088
  },
  {
    "type": "addCluster",
    "id": "367"
  },
  {
    "type": "setData",
    "id": "367",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "368",
    "clusterId": "367",
    "x": -1088,
    "y": 1088
  },
  {
    "type": "addPart",
    "id": "369",
    "clusterId": "367",
    "x": -576,
    "y": 1088
  },
  {
    "type": "addCluster",
    "id": "380"
  },
  {
    "type": "setData",
    "id": "380",
    "key": "type",
    "value": "wall"
  },
  {
    "type": "addPart",
    "id": "381",
    "clusterId": "380",
    "x": -1088,
    "y": 576
  },
  {
    "type": "addPart",
    "id": "382",
    "clusterId": "380",
    "x": -576,
    "y": 576
  },
  {
    "type": "addCluster",
    "id": "503"
  },
  {
    "type": "setData",
    "id": "503",
    "key": "type",
    "value": "exit"
  },
  {
    "type": "addPart",
    "id": "504",
    "clusterId": "503",
    "x": -832,
    "y": 832
  },
  {
    "type": "setData",
    "id": "504",
    "key": "url",
    "value": "#lesson-05"
  },
  {
    "type": "addCluster",
    "id": "547"
  },
  {
    "type": "setData",
    "id": "547",
    "key": "type",
    "value": "zapper"
  },
  {
    "type": "addPart",
    "id": "548",
    "clusterId": "547",
    "x": -192,
    "y": 384
  },
  {
    "type": "addJack",
    "id": "549",
    "partId": "548"
  },
  {
    "type": "setData",
    "id": "549",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "549",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "2372"
  },
  {
    "type": "setData",
    "id": "2372",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "2373",
    "clusterId": "2372",
    "x": 256,
    "y": 512
  },
  {
    "type": "setData",
    "id": "2373",
    "key": "timeout",
    "value": "Infinity"
  },
  {
    "type": "addJack",
    "id": "2374",
    "partId": "2373"
  },
  {
    "type": "setData",
    "id": "2374",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "2374",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "2375",
    "partId": "2373"
  },
  {
    "type": "setData",
    "id": "2375",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "2375",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "2376"
  },
  {
    "type": "setData",
    "id": "2376",
    "key": "type",
    "value": "button"
  },
  {
    "type": "addPart",
    "id": "2377",
    "clusterId": "2376",
    "x": 192,
    "y": 576
  },
  {
    "type": "addJack",
    "id": "2378",
    "partId": "2377"
  },
  {
    "type": "setData",
    "id": "2378",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "2378",
    "key": "name",
    "value": "CLICKED"
  },
  {
    "type": "addCluster",
    "id": "2379"
  },
  {
    "type": "setData",
    "id": "2379",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "2380",
    "clusterId": "2379",
    "x": 192,
    "y": 832
  },
  {
    "type": "addJack",
    "id": "2381",
    "partId": "2380"
  },
  {
    "type": "setData",
    "id": "2381",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "2381",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "3536"
  },
  {
    "type": "setData",
    "id": "3536",
    "key": "type",
    "value": "timer"
  },
  {
    "type": "addPart",
    "id": "3537",
    "clusterId": "3536",
    "x": -64,
    "y": 512
  },
  {
    "type": "setData",
    "id": "3537",
    "key": "timeout",
    "value": "Infinity"
  },
  {
    "type": "addJack",
    "id": "3538",
    "partId": "3537"
  },
  {
    "type": "setData",
    "id": "3538",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "3538",
    "key": "name",
    "value": "RESTART"
  },
  {
    "type": "addJack",
    "id": "3539",
    "partId": "3537"
  },
  {
    "type": "setData",
    "id": "3539",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "3539",
    "key": "name",
    "value": "RUNNING"
  },
  {
    "type": "addCluster",
    "id": "3540"
  },
  {
    "type": "setData",
    "id": "3540",
    "key": "type",
    "value": "button"
  },
  {
    "type": "addPart",
    "id": "3541",
    "clusterId": "3540",
    "x": -192,
    "y": 576
  },
  {
    "type": "addJack",
    "id": "3542",
    "partId": "3541"
  },
  {
    "type": "setData",
    "id": "3542",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "3542",
    "key": "name",
    "value": "CLICKED"
  },
  {
    "type": "addCluster",
    "id": "3543"
  },
  {
    "type": "setData",
    "id": "3543",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "3544",
    "clusterId": "3543",
    "x": -192,
    "y": 768
  },
  {
    "type": "addJack",
    "id": "3545",
    "partId": "3544"
  },
  {
    "type": "setData",
    "id": "3545",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "3545",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "9134"
  },
  {
    "type": "setData",
    "id": "9134",
    "key": "type",
    "value": "zapper"
  },
  {
    "type": "addPart",
    "id": "9135",
    "clusterId": "9134",
    "x": 192,
    "y": 384
  },
  {
    "type": "addJack",
    "id": "9136",
    "partId": "9135"
  },
  {
    "type": "setData",
    "id": "9136",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "9136",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "15350"
  },
  {
    "type": "setData",
    "id": "15350",
    "key": "type",
    "value": "zapper"
  },
  {
    "type": "addPart",
    "id": "15351",
    "clusterId": "15350",
    "x": 576,
    "y": 384
  },
  {
    "type": "addJack",
    "id": "15352",
    "partId": "15351"
  },
  {
    "type": "setData",
    "id": "15352",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "15352",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addCluster",
    "id": "15357"
  },
  {
    "type": "setData",
    "id": "15357",
    "key": "type",
    "value": "button"
  },
  {
    "type": "addPart",
    "id": "15358",
    "clusterId": "15357",
    "x": 576,
    "y": 576
  },
  {
    "type": "addJack",
    "id": "15359",
    "partId": "15358"
  },
  {
    "type": "setData",
    "id": "15359",
    "key": "type",
    "value": "output"
  },
  {
    "type": "setData",
    "id": "15359",
    "key": "name",
    "value": "CLICKED"
  },
  {
    "type": "addCluster",
    "id": "15360"
  },
  {
    "type": "setData",
    "id": "15360",
    "key": "type",
    "value": "door"
  },
  {
    "type": "addPart",
    "id": "15361",
    "clusterId": "15360",
    "x": 576,
    "y": 768
  },
  {
    "type": "addJack",
    "id": "15362",
    "partId": "15361"
  },
  {
    "type": "setData",
    "id": "15362",
    "key": "type",
    "value": "input"
  },
  {
    "type": "setData",
    "id": "15362",
    "key": "name",
    "value": "OPEN"
  },
  {
    "type": "addLink",
    "id": "39",
    "jackId1": "15359",
    "jackId2": 24
  },
  {
    "type": "addLink",
    "id": "63",
    "jackId1": "25",
    "jackId2": 15362
  },
  {
    "type": "addLink",
    "id": "356",
    "jackId1": "296",
    "jackId2": 342
  },
  {
    "type": "addLink",
    "id": "373",
    "jackId1": "343",
    "jackId2": "15352"
  },
  {
    "type": "addLink",
    "id": "385",
    "jackId1": "251",
    "jackId2": 330
  },
  {
    "type": "addLink",
    "id": "397",
    "jackId1": "331",
    "jackId2": "9136"
  },
  {
    "type": "addLink",
    "id": "408",
    "jackId1": "197",
    "jackId2": 314
  },
  {
    "type": "addLink",
    "id": "423",
    "jackId1": "315",
    "jackId2": "549"
  },
  {
    "type": "addLink",
    "id": "2382",
    "jackId1": 2378,
    "jackId2": 2374
  },
  {
    "type": "addLink",
    "id": "2383",
    "jackId1": 2375,
    "jackId2": 2381
  },
  {
    "type": "addLink",
    "id": "3546",
    "jackId1": 3542,
    "jackId2": 3538
  },
  {
    "type": "addLink",
    "id": "3547",
    "jackId1": 3539,
    "jackId2": 3545
  }
];