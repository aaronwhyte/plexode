var vorpLevels = vorpLevels || {};
vorpLevels['level 5'] =
[
  {
    "type":"addCluster",
    "id":"5"
  },
  {
    "type":"setData",
    "id":"5",
    "key":"type",
    "value":"and"
  },
  {
    "type":"addPart",
    "id":"6",
    "clusterId":"5",
    "x":200,
    "y":50
  },
  {
    "type":"addJack",
    "id":"9",
    "partId":"6"
  },
  {
    "type":"setData",
    "id":"9",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"9",
    "key":"name",
    "value":"X"
  },
  {
    "type":"addJack",
    "id":"22",
    "partId":"6"
  },
  {
    "type":"setData",
    "id":"22",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"22",
    "key":"name",
    "value":"AND_X"
  },
  {
    "type":"addCluster",
    "id":"7"
  },
  {
    "type":"setData",
    "id":"7",
    "key":"type",
    "value":"anti_zombie_turret"
  },
  {
    "type":"addPart",
    "id":"8",
    "clusterId":"7",
    "x":-550,
    "y":-600
  },
  {
    "type":"addCluster",
    "id":"10"
  },
  {
    "type":"setData",
    "id":"10",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"11",
    "clusterId":"10",
    "x":-250,
    "y":-680
  },
  {
    "type":"addPart",
    "id":"12",
    "clusterId":"10",
    "x":-250,
    "y":-480
  },
  {
    "type":"addCluster",
    "id":"13"
  },
  {
    "type":"setData",
    "id":"13",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"14",
    "clusterId":"13",
    "x":10,
    "y":800
  },
  {
    "type":"addPart",
    "id":"15",
    "clusterId":"13",
    "x":-370,
    "y":800
  },
  {
    "type":"addCluster",
    "id":"16"
  },
  {
    "type":"setData",
    "id":"16",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"17",
    "clusterId":"16",
    "x":-370,
    "y":800
  },
  {
    "type":"addPart",
    "id":"18",
    "clusterId":"16",
    "x":-370,
    "y":410
  },
  {
    "type":"addCluster",
    "id":"19"
  },
  {
    "type":"setData",
    "id":"19",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"20",
    "clusterId":"19",
    "x":-690,
    "y":-260
  },
  {
    "type":"addPart",
    "id":"21",
    "clusterId":"19",
    "x":-690,
    "y":-680
  },
  {
    "type":"addCluster",
    "id":"23"
  },
  {
    "type":"setData",
    "id":"23",
    "key":"type",
    "value":"timer"
  },
  {
    "type":"addPart",
    "id":"24",
    "clusterId":"23",
    "x":20,
    "y":60
  },
  {
    "type":"setData",
    "id":"24",
    "key":"timeout",
    "value":"390"
  },
  {
    "type":"addJack",
    "id":"25",
    "partId":"24"
  },
  {
    "type":"setData",
    "id":"25",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"25",
    "key":"name",
    "value":"RESTART"
  },
  {
    "type":"addJack",
    "id":"26",
    "partId":"24"
  },
  {
    "type":"setData",
    "id":"26",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"26",
    "key":"name",
    "value":"RUNNING"
  },
  {
    "type":"addCluster",
    "id":"29"
  },
  {
    "type":"setData",
    "id":"29",
    "key":"type",
    "value":"zombie"
  },
  {
    "type":"addPart",
    "id":"30",
    "clusterId":"29",
    "x":-60,
    "y":700
  },
  {
    "type":"addCluster",
    "id":"31"
  },
  {
    "type":"setData",
    "id":"31",
    "key":"type",
    "value":"zombie"
  },
  {
    "type":"addPart",
    "id":"32",
    "clusterId":"31",
    "x":-620,
    "y":-390
  },
  {
    "type":"addCluster",
    "id":"34"
  },
  {
    "type":"setData",
    "id":"34",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"35",
    "clusterId":"34",
    "x":-690,
    "y":-260
  },
  {
    "type":"addPart",
    "id":"36",
    "clusterId":"34",
    "x":-890,
    "y":-260
  },
  {
    "type":"addCluster",
    "id":"42"
  },
  {
    "type":"setData",
    "id":"42",
    "key":"type",
    "value":"timer"
  },
  {
    "type":"addPart",
    "id":"46",
    "clusterId":"42",
    "x":400,
    "y":-90
  },
  {
    "type":"setData",
    "id":"46",
    "key":"timeout",
    "value":"30"
  },
  {
    "type":"addJack",
    "id":"48",
    "partId":"46"
  },
  {
    "type":"setData",
    "id":"48",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"48",
    "key":"name",
    "value":"RESTART"
  },
  {
    "type":"addJack",
    "id":"49",
    "partId":"46"
  },
  {
    "type":"setData",
    "id":"49",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"49",
    "key":"name",
    "value":"RUNNING"
  },
  {
    "type":"addCluster",
    "id":"43"
  },
  {
    "type":"setData",
    "id":"43",
    "key":"type",
    "value":"anti_zombie_turret"
  },
  {
    "type":"addPart",
    "id":"44",
    "clusterId":"43",
    "x":1800,
    "y":100
  },
  {
    "type":"addCluster",
    "id":"52"
  },
  {
    "type":"setData",
    "id":"52",
    "key":"type",
    "value":"zombie"
  },
  {
    "type":"addPart",
    "id":"53",
    "clusterId":"52",
    "x":230,
    "y":310
  },
  {
    "type":"addCluster",
    "id":"85"
  },
  {
    "type":"setData",
    "id":"85",
    "key":"type",
    "value":"door"
  },
  {
    "type":"addPart",
    "id":"86",
    "clusterId":"85",
    "x":-300,
    "y":-480
  },
  {
    "type":"addJack",
    "id":"87",
    "partId":"86"
  },
  {
    "type":"setData",
    "id":"87",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"87",
    "key":"name",
    "value":"OPEN"
  },
  {
    "type":"addCluster",
    "id":"167"
  },
  {
    "type":"setData",
    "id":"167",
    "key":"type",
    "value":"door"
  },
  {
    "type":"addPart",
    "id":"168",
    "clusterId":"167",
    "x":330,
    "y":-50
  },
  {
    "type":"addJack",
    "id":"169",
    "partId":"168"
  },
  {
    "type":"setData",
    "id":"169",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"169",
    "key":"name",
    "value":"OPEN"
  },
  {
    "type":"addCluster",
    "id":"193"
  },
  {
    "type":"setData",
    "id":"193",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"194",
    "clusterId":"193",
    "x":10,
    "y":800
  },
  {
    "type":"addPart",
    "id":"195",
    "clusterId":"193",
    "x":10,
    "y":410
  },
  {
    "type":"addCluster",
    "id":"218"
  },
  {
    "type":"setData",
    "id":"218",
    "key":"type",
    "value":"timer"
  },
  {
    "type":"addPart",
    "id":"219",
    "clusterId":"218",
    "x":20,
    "y":-90
  },
  {
    "type":"setData",
    "id":"219",
    "key":"timeout",
    "value":"300"
  },
  {
    "type":"addJack",
    "id":"223",
    "partId":"219"
  },
  {
    "type":"setData",
    "id":"223",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"223",
    "key":"name",
    "value":"RESTART"
  },
  {
    "type":"addJack",
    "id":"224",
    "partId":"219"
  },
  {
    "type":"setData",
    "id":"224",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"224",
    "key":"name",
    "value":"RUNNING"
  },
  {
    "type":"addCluster",
    "id":"220"
  },
  {
    "type":"setData",
    "id":"220",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"221",
    "clusterId":"220",
    "x":-250,
    "y":-680
  },
  {
    "type":"addPart",
    "id":"222",
    "clusterId":"220",
    "x":-690,
    "y":-680
  },
  {
    "type":"addCluster",
    "id":"256"
  },
  {
    "type":"setData",
    "id":"256",
    "key":"type",
    "value":"not"
  },
  {
    "type":"addPart",
    "id":"257",
    "clusterId":"256",
    "x":200,
    "y":-90
  },
  {
    "type":"addJack",
    "id":"258",
    "partId":"257"
  },
  {
    "type":"setData",
    "id":"258",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"258",
    "key":"name",
    "value":"X"
  },
  {
    "type":"addJack",
    "id":"259",
    "partId":"257"
  },
  {
    "type":"setData",
    "id":"259",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"259",
    "key":"name",
    "value":"NOT_X"
  },
  {
    "type":"addCluster",
    "id":"325"
  },
  {
    "type":"setData",
    "id":"325",
    "key":"type",
    "value":"zombie"
  },
  {
    "type":"addPart",
    "id":"326",
    "clusterId":"325",
    "x":-150,
    "y":600
  },
  {
    "type":"addCluster",
    "id":"335"
  },
  {
    "type":"setData",
    "id":"335",
    "key":"type",
    "value":"zombie"
  },
  {
    "type":"addPart",
    "id":"336",
    "clusterId":"335",
    "x":-80,
    "y":490
  },
  {
    "type":"addCluster",
    "id":"347"
  },
  {
    "type":"setData",
    "id":"347",
    "key":"type",
    "value":"zombie"
  },
  {
    "type":"addPart",
    "id":"348",
    "clusterId":"347",
    "x":-210,
    "y":460
  },
  {
    "type":"addCluster",
    "id":"371"
  },
  {
    "type":"setData",
    "id":"371",
    "key":"type",
    "value":"zombie"
  },
  {
    "type":"addPart",
    "id":"372",
    "clusterId":"371",
    "x":-220,
    "y":590
  },
  {
    "type":"addCluster",
    "id":"538"
  },
  {
    "type":"setData",
    "id":"538",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"539",
    "clusterId":"538",
    "x":880,
    "y":-220
  },
  {
    "type":"addPart",
    "id":"540",
    "clusterId":"538",
    "x":1050,
    "y":-220
  },
  {
    "type":"addCluster",
    "id":"553"
  },
  {
    "type":"setData",
    "id":"553",
    "key":"type",
    "value":"zapper"
  },
  {
    "type":"addPart",
    "id":"554",
    "clusterId":"553",
    "x":-620,
    "y":-520
  },
  {
    "type":"addJack",
    "id":"555",
    "partId":"554"
  },
  {
    "type":"setData",
    "id":"555",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"555",
    "key":"name",
    "value":"OPEN"
  },
  {
    "type":"addCluster",
    "id":"592"
  },
  {
    "type":"setData",
    "id":"592",
    "key":"type",
    "value":"beam_sensor"
  },
  {
    "type":"addPart",
    "id":"593",
    "clusterId":"592",
    "x":460,
    "y":-140
  },
  {
    "type":"addJack",
    "id":"594",
    "partId":"593"
  },
  {
    "type":"setData",
    "id":"594",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"594",
    "key":"name",
    "value":"BEAM_BROKEN"
  },
  {
    "type":"addCluster",
    "id":"595"
  },
  {
    "type":"setData",
    "id":"595",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"596",
    "clusterId":"595",
    "x":-690,
    "y":0
  },
  {
    "type":"addPart",
    "id":"597",
    "clusterId":"595",
    "x":-890,
    "y":0
  },
  {
    "type":"addCluster",
    "id":"607"
  },
  {
    "type":"setData",
    "id":"607",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"608",
    "clusterId":"607",
    "x":-890,
    "y":-260
  },
  {
    "type":"addPart",
    "id":"609",
    "clusterId":"607",
    "x":-890,
    "y":-460
  },
  {
    "type":"addCluster",
    "id":"637"
  },
  {
    "type":"setData",
    "id":"637",
    "key":"type",
    "value":"zapper"
  },
  {
    "type":"addPart",
    "id":"638",
    "clusterId":"637",
    "x":240,
    "y":-520
  },
  {
    "type":"addJack",
    "id":"639",
    "partId":"638"
  },
  {
    "type":"setData",
    "id":"639",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"639",
    "key":"name",
    "value":"OPEN"
  },
  {
    "type":"addCluster",
    "id":"657"
  },
  {
    "type":"setData",
    "id":"657",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"658",
    "clusterId":"657",
    "x":-110,
    "y":-680
  },
  {
    "type":"addPart",
    "id":"659",
    "clusterId":"657",
    "x":-110,
    "y":-480
  },
  {
    "type":"addCluster",
    "id":"777"
  },
  {
    "type":"setData",
    "id":"777",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"778",
    "clusterId":"777",
    "x":880,
    "y":-40
  },
  {
    "type":"addPart",
    "id":"779",
    "clusterId":"777",
    "x":1050,
    "y":-40
  },
  {
    "type":"addCluster",
    "id":"792"
  },
  {
    "type":"setData",
    "id":"792",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"793",
    "clusterId":"792",
    "x":1050,
    "y":-220
  },
  {
    "type":"addPart",
    "id":"794",
    "clusterId":"792",
    "x":1050,
    "y":-40
  },
  {
    "type":"addCluster",
    "id":"850"
  },
  {
    "type":"setData",
    "id":"850",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"851",
    "clusterId":"850",
    "x":-690,
    "y":410
  },
  {
    "type":"addPart",
    "id":"852",
    "clusterId":"850",
    "x":-690,
    "y":0
  },
  {
    "type":"addCluster",
    "id":"853"
  },
  {
    "type":"setData",
    "id":"853",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"854",
    "clusterId":"853",
    "x":330,
    "y":-260
  },
  {
    "type":"addPart",
    "id":"855",
    "clusterId":"853",
    "x":330,
    "y":-680
  },
  {
    "type":"addCluster",
    "id":"874"
  },
  {
    "type":"setData",
    "id":"874",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"875",
    "clusterId":"874",
    "x":-890,
    "y":200
  },
  {
    "type":"addPart",
    "id":"876",
    "clusterId":"874",
    "x":-890,
    "y":0
  },
  {
    "type":"addCluster",
    "id":"886"
  },
  {
    "type":"setData",
    "id":"886",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"887",
    "clusterId":"886",
    "x":-1520,
    "y":200
  },
  {
    "type":"addPart",
    "id":"888",
    "clusterId":"886",
    "x":-890,
    "y":200
  },
  {
    "type":"addCluster",
    "id":"916"
  },
  {
    "type":"setData",
    "id":"916",
    "key":"type",
    "value":"and"
  },
  {
    "type":"addPart",
    "id":"917",
    "clusterId":"916",
    "x":200,
    "y":-270
  },
  {
    "type":"addJack",
    "id":"918",
    "partId":"917"
  },
  {
    "type":"setData",
    "id":"918",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"918",
    "key":"name",
    "value":"X"
  },
  {
    "type":"addJack",
    "id":"919",
    "partId":"917"
  },
  {
    "type":"setData",
    "id":"919",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"919",
    "key":"name",
    "value":"AND_X"
  },
  {
    "type":"addCluster",
    "id":"920"
  },
  {
    "type":"setData",
    "id":"920",
    "key":"type",
    "value":"timer"
  },
  {
    "type":"addPart",
    "id":"921",
    "clusterId":"920",
    "x":20,
    "y":-260
  },
  {
    "type":"setData",
    "id":"921",
    "key":"timeout",
    "value":"520"
  },
  {
    "type":"addJack",
    "id":"925",
    "partId":"921"
  },
  {
    "type":"setData",
    "id":"925",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"925",
    "key":"name",
    "value":"RESTART"
  },
  {
    "type":"addJack",
    "id":"926",
    "partId":"921"
  },
  {
    "type":"setData",
    "id":"926",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"926",
    "key":"name",
    "value":"RUNNING"
  },
  {
    "type":"addCluster",
    "id":"922"
  },
  {
    "type":"setData",
    "id":"922",
    "key":"type",
    "value":"door"
  },
  {
    "type":"addPart",
    "id":"923",
    "clusterId":"922",
    "x":-50,
    "y":410
  },
  {
    "type":"addJack",
    "id":"924",
    "partId":"923"
  },
  {
    "type":"setData",
    "id":"924",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"924",
    "key":"name",
    "value":"OPEN"
  },
  {
    "type":"addCluster",
    "id":"927"
  },
  {
    "type":"setData",
    "id":"927",
    "key":"type",
    "value":"timer"
  },
  {
    "type":"addPart",
    "id":"928",
    "clusterId":"927",
    "x":20,
    "y":-410
  },
  {
    "type":"setData",
    "id":"928",
    "key":"timeout",
    "value":"400"
  },
  {
    "type":"addJack",
    "id":"929",
    "partId":"928"
  },
  {
    "type":"setData",
    "id":"929",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"929",
    "key":"name",
    "value":"RESTART"
  },
  {
    "type":"addJack",
    "id":"930",
    "partId":"928"
  },
  {
    "type":"setData",
    "id":"930",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"930",
    "key":"name",
    "value":"RUNNING"
  },
  {
    "type":"addCluster",
    "id":"931"
  },
  {
    "type":"setData",
    "id":"931",
    "key":"type",
    "value":"not"
  },
  {
    "type":"addPart",
    "id":"932",
    "clusterId":"931",
    "x":200,
    "y":-410
  },
  {
    "type":"addJack",
    "id":"933",
    "partId":"932"
  },
  {
    "type":"setData",
    "id":"933",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"933",
    "key":"name",
    "value":"X"
  },
  {
    "type":"addJack",
    "id":"934",
    "partId":"932"
  },
  {
    "type":"setData",
    "id":"934",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"934",
    "key":"name",
    "value":"NOT_X"
  },
  {
    "type":"addCluster",
    "id":"1012"
  },
  {
    "type":"setData",
    "id":"1012",
    "key":"type",
    "value":"door"
  },
  {
    "type":"addPart",
    "id":"1013",
    "clusterId":"1012",
    "x":-50,
    "y":-480
  },
  {
    "type":"addJack",
    "id":"1014",
    "partId":"1013"
  },
  {
    "type":"setData",
    "id":"1014",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"1014",
    "key":"name",
    "value":"OPEN"
  },
  {
    "type":"addCluster",
    "id":"1025"
  },
  {
    "type":"setData",
    "id":"1025",
    "key":"type",
    "value":"door"
  },
  {
    "type":"addPart",
    "id":"1026",
    "clusterId":"1025",
    "x":910,
    "y":-70
  },
  {
    "type":"addJack",
    "id":"1027",
    "partId":"1026"
  },
  {
    "type":"setData",
    "id":"1027",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"1027",
    "key":"name",
    "value":"OPEN"
  },
  {
    "type":"addCluster",
    "id":"1069"
  },
  {
    "type":"setData",
    "id":"1069",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"1070",
    "clusterId":"1069",
    "x":-1520,
    "y":-460
  },
  {
    "type":"addPart",
    "id":"1071",
    "clusterId":"1069",
    "x":-890,
    "y":-460
  },
  {
    "type":"addCluster",
    "id":"1084"
  },
  {
    "type":"setData",
    "id":"1084",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"1085",
    "clusterId":"1084",
    "x":-1520,
    "y":200
  },
  {
    "type":"addPart",
    "id":"1086",
    "clusterId":"1084",
    "x":-1520,
    "y":-460
  },
  {
    "type":"addCluster",
    "id":"1118"
  },
  {
    "type":"setData",
    "id":"1118",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"1119",
    "clusterId":"1118",
    "x":560,
    "y":-260
  },
  {
    "type":"addPart",
    "id":"1120",
    "clusterId":"1118",
    "x":330,
    "y":-260
  },
  {
    "type":"addCluster",
    "id":"1133"
  },
  {
    "type":"setData",
    "id":"1133",
    "key":"type",
    "value":"anti_zombie_turret"
  },
  {
    "type":"addPart",
    "id":"1134",
    "clusterId":"1133",
    "x":-1040,
    "y":-340
  },
  {
    "type":"addCluster",
    "id":"1159"
  },
  {
    "type":"setData",
    "id":"1159",
    "key":"type",
    "value":"anti_zombie_turret"
  },
  {
    "type":"addPart",
    "id":"1160",
    "clusterId":"1159",
    "x":1010,
    "y":-130
  },
  {
    "type":"addCluster",
    "id":"1284"
  },
  {
    "type":"setData",
    "id":"1284",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"1285",
    "clusterId":"1284",
    "x":330,
    "y":-680
  },
  {
    "type":"addPart",
    "id":"1286",
    "clusterId":"1284",
    "x":-110,
    "y":-680
  },
  {
    "type":"addCluster",
    "id":"1370"
  },
  {
    "type":"setData",
    "id":"1370",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"1371",
    "clusterId":"1370",
    "x":330,
    "y":410
  },
  {
    "type":"addPart",
    "id":"1372",
    "clusterId":"1370",
    "x":10,
    "y":410
  },
  {
    "type":"addCluster",
    "id":"1378"
  },
  {
    "type":"setData",
    "id":"1378",
    "key":"type",
    "value":"anti_zombie_turret"
  },
  {
    "type":"addPart",
    "id":"1379",
    "clusterId":"1378",
    "x":-390,
    "y":-590
  },
  {
    "type":"addCluster",
    "id":"1394"
  },
  {
    "type":"setData",
    "id":"1394",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"1395",
    "clusterId":"1394",
    "x":-370,
    "y":410
  },
  {
    "type":"addPart",
    "id":"1396",
    "clusterId":"1394",
    "x":-690,
    "y":410
  },
  {
    "type":"addCluster",
    "id":"1617"
  },
  {
    "type":"setData",
    "id":"1617",
    "key":"type",
    "value":"anti_zombie_turret"
  },
  {
    "type":"addPart",
    "id":"1618",
    "clusterId":"1617",
    "x":30,
    "y":-590
  },
  {
    "type":"addCluster",
    "id":"1619"
  },
  {
    "type":"setData",
    "id":"1619",
    "key":"type",
    "value":"anti_zombie_turret"
  },
  {
    "type":"addPart",
    "id":"1620",
    "clusterId":"1619",
    "x":190,
    "y":-580
  },
  {
    "type":"addCluster",
    "id":"1623"
  },
  {
    "type":"setData",
    "id":"1623",
    "key":"type",
    "value":"player_assembler"
  },
  {
    "type":"addPart",
    "id":"1624",
    "clusterId":"1623",
    "x":-1380,
    "y":-130
  },
  {
    "type":"addCluster",
    "id":"1638"
  },
  {
    "type":"setData",
    "id":"1638",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"1639",
    "clusterId":"1638",
    "x":-110,
    "y":-480
  },
  {
    "type":"addPart",
    "id":"1640",
    "clusterId":"1638",
    "x":-250,
    "y":-480
  },
  {
    "type":"addCluster",
    "id":"1643"
  },
  {
    "type":"setData",
    "id":"1643",
    "key":"type",
    "value":"button"
  },
  {
    "type":"addPart",
    "id":"1644",
    "clusterId":"1643",
    "x":-180,
    "y":-380
  },
  {
    "type":"addJack",
    "id":"1645",
    "partId":"1644"
  },
  {
    "type":"setData",
    "id":"1645",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"1645",
    "key":"name",
    "value":"CLICKED"
  },
  {
    "type":"addCluster",
    "id":"1667"
  },
  {
    "type":"setData",
    "id":"1667",
    "key":"type",
    "value":"timer"
  },
  {
    "type":"addPart",
    "id":"1668",
    "clusterId":"1667",
    "x":-190,
    "y":270
  },
  {
    "type":"setData",
    "id":"1668",
    "key":"timeout",
    "value":"180"
  },
  {
    "type":"addJack",
    "id":"1669",
    "partId":"1668"
  },
  {
    "type":"setData",
    "id":"1669",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"1669",
    "key":"name",
    "value":"RESTART"
  },
  {
    "type":"addJack",
    "id":"1670",
    "partId":"1668"
  },
  {
    "type":"setData",
    "id":"1670",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"1670",
    "key":"name",
    "value":"RUNNING"
  },
  {
    "type":"addCluster",
    "id":"1900"
  },
  {
    "type":"setData",
    "id":"1900",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"1901",
    "clusterId":"1900",
    "x":560,
    "y":-590
  },
  {
    "type":"addPart",
    "id":"1902",
    "clusterId":"1900",
    "x":560,
    "y":-260
  },
  {
    "type":"addCluster",
    "id":"2122"
  },
  {
    "type":"setData",
    "id":"2122",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"2123",
    "clusterId":"2122",
    "x":560,
    "y":-590
  },
  {
    "type":"addPart",
    "id":"2124",
    "clusterId":"2122",
    "x":1360,
    "y":-590
  },
  {
    "type":"addCluster",
    "id":"2132"
  },
  {
    "type":"setData",
    "id":"2132",
    "key":"type",
    "value":"zombie_assembler"
  },
  {
    "type":"addPart",
    "id":"2133",
    "clusterId":"2132",
    "x":-180,
    "y":710
  },
  {
    "type":"addCluster",
    "id":"2134"
  },
  {
    "type":"setData",
    "id":"2134",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"2135",
    "clusterId":"2134",
    "x":330,
    "y":0
  },
  {
    "type":"addPart",
    "id":"2136",
    "clusterId":"2134",
    "x":330,
    "y":410
  },
  {
    "type":"addCluster",
    "id":"2137"
  },
  {
    "type":"setData",
    "id":"2137",
    "key":"type",
    "value":"zombie_assembler"
  },
  {
    "type":"addPart",
    "id":"2138",
    "clusterId":"2137",
    "x":-40,
    "y":590
  },
  {
    "type":"addCluster",
    "id":"2139"
  },
  {
    "type":"setData",
    "id":"2139",
    "key":"type",
    "value":"zombie_assembler"
  },
  {
    "type":"addPart",
    "id":"2140",
    "clusterId":"2139",
    "x":-310,
    "y":590
  },
  {
    "type":"addCluster",
    "id":"2335"
  },
  {
    "type":"setData",
    "id":"2335",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"2336",
    "clusterId":"2335",
    "x":560,
    "y":0
  },
  {
    "type":"addPart",
    "id":"2337",
    "clusterId":"2335",
    "x":330,
    "y":0
  },
  {
    "type":"addCluster",
    "id":"2365"
  },
  {
    "type":"setData",
    "id":"2365",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"2366",
    "clusterId":"2365",
    "x":560,
    "y":0
  },
  {
    "type":"addPart",
    "id":"2367",
    "clusterId":"2365",
    "x":560,
    "y":320
  },
  {
    "type":"addCluster",
    "id":"2512"
  },
  {
    "type":"setData",
    "id":"2512",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"2513",
    "clusterId":"2512",
    "x":560,
    "y":320
  },
  {
    "type":"addPart",
    "id":"2514",
    "clusterId":"2512",
    "x":1360,
    "y":320
  },
  {
    "type":"addCluster",
    "id":"2794"
  },
  {
    "type":"setData",
    "id":"2794",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"2795",
    "clusterId":"2794",
    "x":1360,
    "y":-590
  },
  {
    "type":"addPart",
    "id":"2796",
    "clusterId":"2794",
    "x":1360,
    "y":-260
  },
  {
    "type":"addCluster",
    "id":"2929"
  },
  {
    "type":"setData",
    "id":"2929",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"2930",
    "clusterId":"2929",
    "x":1360,
    "y":0
  },
  {
    "type":"addPart",
    "id":"2931",
    "clusterId":"2929",
    "x":1360,
    "y":320
  },
  {
    "type":"addCluster",
    "id":"4828"
  },
  {
    "type":"setData",
    "id":"4828",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"4829",
    "clusterId":"4828",
    "x":1680,
    "y":-260
  },
  {
    "type":"addPart",
    "id":"4830",
    "clusterId":"4828",
    "x":1360,
    "y":-260
  },
  {
    "type":"addCluster",
    "id":"4831"
  },
  {
    "type":"setData",
    "id":"4831",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"4832",
    "clusterId":"4831",
    "x":1680,
    "y":-430
  },
  {
    "type":"addPart",
    "id":"4833",
    "clusterId":"4831",
    "x":1680,
    "y":-260
  },
  {
    "type":"addCluster",
    "id":"4834"
  },
  {
    "type":"setData",
    "id":"4834",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"4835",
    "clusterId":"4834",
    "x":1680,
    "y":-430
  },
  {
    "type":"addPart",
    "id":"4836",
    "clusterId":"4834",
    "x":2240,
    "y":-430
  },
  {
    "type":"addCluster",
    "id":"4837"
  },
  {
    "type":"setData",
    "id":"4837",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"4838",
    "clusterId":"4837",
    "x":1680,
    "y":0
  },
  {
    "type":"addPart",
    "id":"4839",
    "clusterId":"4837",
    "x":1360,
    "y":0
  },
  {
    "type":"addCluster",
    "id":"4840"
  },
  {
    "type":"setData",
    "id":"4840",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"4841",
    "clusterId":"4840",
    "x":1680,
    "y":0
  },
  {
    "type":"addPart",
    "id":"4842",
    "clusterId":"4840",
    "x":1680,
    "y":170
  },
  {
    "type":"addCluster",
    "id":"4843"
  },
  {
    "type":"setData",
    "id":"4843",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"4844",
    "clusterId":"4843",
    "x":1680,
    "y":170
  },
  {
    "type":"addPart",
    "id":"4845",
    "clusterId":"4843",
    "x":2240,
    "y":170
  },
  {
    "type":"addCluster",
    "id":"4849"
  },
  {
    "type":"setData",
    "id":"4849",
    "key":"type",
    "value":"wall"
  },
  {
    "type":"addPart",
    "id":"4850",
    "clusterId":"4849",
    "x":2240,
    "y":-430
  },
  {
    "type":"addPart",
    "id":"4851",
    "clusterId":"4849",
    "x":2240,
    "y":170
  },
  {
    "type":"addCluster",
    "id":"4962"
  },
  {
    "type":"setData",
    "id":"4962",
    "key":"type",
    "value":"exit"
  },
  {
    "type":"addPart",
    "id":"4963",
    "clusterId":"4962",
    "x":1950,
    "y":-130
  },
  {
    "type":"setData",
    "id":"4963",
    "key":"url",
    "value":"../"
  },
  {
    "type":"addCluster",
    "id":"5141"
  },
  {
    "type":"setData",
    "id":"5141",
    "key":"type",
    "value":"door"
  },
  {
    "type":"addPart",
    "id":"5142",
    "clusterId":"5141",
    "x":1480,
    "y":-140
  },
  {
    "type":"addJack",
    "id":"5143",
    "partId":"5142"
  },
  {
    "type":"setData",
    "id":"5143",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"5143",
    "key":"name",
    "value":"OPEN"
  },
  {
    "type":"addCluster",
    "id":"5192"
  },
  {
    "type":"setData",
    "id":"5192",
    "key":"type",
    "value":"door"
  },
  {
    "type":"addPart",
    "id":"5193",
    "clusterId":"5192",
    "x":1510,
    "y":-140
  },
  {
    "type":"addJack",
    "id":"5194",
    "partId":"5193"
  },
  {
    "type":"setData",
    "id":"5194",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"5194",
    "key":"name",
    "value":"OPEN"
  },
  {
    "type":"addCluster",
    "id":"5237"
  },
  {
    "type":"setData",
    "id":"5237",
    "key":"type",
    "value":"door"
  },
  {
    "type":"addPart",
    "id":"5238",
    "clusterId":"5237",
    "x":1540,
    "y":-140
  },
  {
    "type":"addJack",
    "id":"5239",
    "partId":"5238"
  },
  {
    "type":"setData",
    "id":"5239",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"5239",
    "key":"name",
    "value":"OPEN"
  },
  {
    "type":"addCluster",
    "id":"5255"
  },
  {
    "type":"setData",
    "id":"5255",
    "key":"type",
    "value":"door"
  },
  {
    "type":"addPart",
    "id":"5256",
    "clusterId":"5255",
    "x":1570,
    "y":-140
  },
  {
    "type":"addJack",
    "id":"5257",
    "partId":"5256"
  },
  {
    "type":"setData",
    "id":"5257",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"5257",
    "key":"name",
    "value":"OPEN"
  },
  {
    "type":"addCluster",
    "id":"5705"
  },
  {
    "type":"setData",
    "id":"5705",
    "key":"type",
    "value":"gripper"
  },
  {
    "type":"addPart",
    "id":"5706",
    "clusterId":"5705",
    "x":740,
    "y":-490
  },
  {
    "type":"addJack",
    "id":"5707",
    "partId":"5706"
  },
  {
    "type":"setData",
    "id":"5707",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"5707",
    "key":"name",
    "value":"GRIPPING"
  },
  {
    "type":"addCluster",
    "id":"5960"
  },
  {
    "type":"setData",
    "id":"5960",
    "key":"type",
    "value":"gripper"
  },
  {
    "type":"addPart",
    "id":"5961",
    "clusterId":"5960",
    "x":1190,
    "y":-470
  },
  {
    "type":"addJack",
    "id":"5962",
    "partId":"5961"
  },
  {
    "type":"setData",
    "id":"5962",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"5962",
    "key":"name",
    "value":"GRIPPING"
  },
  {
    "type":"addCluster",
    "id":"6119"
  },
  {
    "type":"setData",
    "id":"6119",
    "key":"type",
    "value":"gripper"
  },
  {
    "type":"addPart",
    "id":"6120",
    "clusterId":"6119",
    "x":1190,
    "y":220
  },
  {
    "type":"addJack",
    "id":"6121",
    "partId":"6120"
  },
  {
    "type":"setData",
    "id":"6121",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"6121",
    "key":"name",
    "value":"GRIPPING"
  },
  {
    "type":"addCluster",
    "id":"6425"
  },
  {
    "type":"setData",
    "id":"6425",
    "key":"type",
    "value":"gripper"
  },
  {
    "type":"addPart",
    "id":"6426",
    "clusterId":"6425",
    "x":740,
    "y":220
  },
  {
    "type":"addJack",
    "id":"6427",
    "partId":"6426"
  },
  {
    "type":"setData",
    "id":"6427",
    "key":"type",
    "value":"output"
  },
  {
    "type":"setData",
    "id":"6427",
    "key":"name",
    "value":"GRIPPING"
  },
  {
    "type":"addCluster",
    "id":"6906"
  },
  {
    "type":"setData",
    "id":"6906",
    "key":"type",
    "value":"zapper"
  },
  {
    "type":"addPart",
    "id":"6907",
    "clusterId":"6906",
    "x":880,
    "y":-130
  },
  {
    "type":"addJack",
    "id":"6908",
    "partId":"6907"
  },
  {
    "type":"setData",
    "id":"6908",
    "key":"type",
    "value":"input"
  },
  {
    "type":"setData",
    "id":"6908",
    "key":"name",
    "value":"OPEN"
  },
  {
    "type":"addLink",
    "id":"40",
    "jackId1":"22",
    "jackId2":169
  },
  {
    "type":"addLink",
    "id":"41",
    "jackId1":"1670",
    "jackId2":924
  },
  {
    "type":"addLink",
    "id":"45",
    "jackId1":"25",
    "jackId2":1645
  },
  {
    "type":"addLink",
    "id":"47",
    "jackId1":"5962",
    "jackId2":5257
  },
  {
    "type":"addLink",
    "id":"61",
    "jackId1":"6121",
    "jackId2":5239
  },
  {
    "type":"addLink",
    "id":"78",
    "jackId1":"5707",
    "jackId2":5194
  },
  {
    "type":"addLink",
    "id":"99",
    "jackId1":"6427",
    "jackId2":5143
  },
  {
    "type":"addLink",
    "id":"239",
    "jackId1":"1645",
    "jackId2":223
  },
  {
    "type":"addLink",
    "id":"293",
    "jackId1":"224",
    "jackId2":258
  },
  {
    "type":"addLink",
    "id":"547",
    "jackId1":"259",
    "jackId2":9
  },
  {
    "type":"addLink",
    "id":"567",
    "jackId1":"26",
    "jackId2":9
  },
  {
    "type":"addLink",
    "id":"611",
    "jackId1":"594",
    "jackId2":48
  },
  {
    "type":"addLink",
    "id":"629",
    "jackId1":"49",
    "jackId2":169
  },
  {
    "type":"addLink",
    "id":"935",
    "jackId1":930,
    "jackId2":933
  },
  {
    "type":"addLink",
    "id":"936",
    "jackId1":934,
    "jackId2":918
  },
  {
    "type":"addLink",
    "id":"937",
    "jackId1":926,
    "jackId2":918
  },
  {
    "type":"addLink",
    "id":"961",
    "jackId1":"1645",
    "jackId2":929
  },
  {
    "type":"addLink",
    "id":"972",
    "jackId1":"1645",
    "jackId2":925
  },
  {
    "type":"addLink",
    "id":"997",
    "jackId1":"919",
    "jackId2":87
  },
  {
    "type":"addLink",
    "id":"1011",
    "jackId1":"919",
    "jackId2":1014
  },
  {
    "type":"addLink",
    "id":"1183",
    "jackId1":"919",
    "jackId2":1027
  },
  {
    "type":"addLink",
    "id":"1739",
    "jackId1":"1669",
    "jackId2":1645
  }
]