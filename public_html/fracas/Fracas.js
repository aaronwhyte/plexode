// map codes
var nextCode = 1;

var WALL=nextCode++;
var FLOOR=nextCode++;
var GOLD=nextCode++;
var HEALTH=nextCode++;
var STAIRDOWN=nextCode++;

var GNOME=nextCode++;
var GNOMEGEN=nextCode++;

var PLAYER=nextCode++;
var BULLET=nextCode++;

var levelToMap = {
  '#':WALL,
  '.':FLOOR,
  '$':GOLD,
  '+':HEALTH,
  '>':STAIRDOWN,
  'g':GNOME,
  'G':GNOMEGEN
};

var levels = [];
var level;
var mapHeight, mapWidth;

var MOVECOOL = 4;
var moveCool=0;

var pPos=new Vec2d(); /// player position
var pDir=new Vec2d(); // player direction
var opPos=new Vec2d(); // old position

var bPos=new Vec2d(); // bullet position
var bDir=new Vec2d(); // bullet direction


function Fracas(fracasDivID, log) {
  /////////////////
  // private vars
  /////////////////
  
  var levelNum = 0;
  var exitLevel = false;
  var gameOver = false;
  
  // keys
  var keys = [];
  var vkLeft=37, vkUp=38, vkRight=39, vkDown=40, vkFire=32; // arrows, space
  
  // map data
  // each node has
  // struct(wall, floor, dig, stair), 
  // monster(gnome, zombie), 
  // bullets(star, grenade, fire), 
  // items(gold, health, powerups)
  var map = [];
  
  // contants
  var maxTimeout = 1000/30;
  var GNOMESPEED = 1/8;
  var GNOMEGENSPEED = 1/20;
  
  // reach of animation
  var aniRX = 10; 
  var aniRY = 6; 
  
  // player stats
  var health=0;
  var score=0;
  var maxHealth = 100;
  var fire = false; // boolean - was fire tapped
  var bullet = false; // boolean - bullet on-screen or not
  
  
  //////////////////////
  // private functions
  //////////////////////
  function keyDown(e) {
    var key = -1;
    if (e && e.which) {
      // NS
      key = e.which;
    } else {
      // IE
      key = event.keyCode;
    }
    keys[key] = true;
    if (keys[vkUp]) pDir.y--;
    if (keys[vkRight]) pDir.x++;
    if (keys[vkDown]) pDir.y++;
    if (keys[vkLeft]) pDir.x--;
    if (keys[vkFire]) fire=true;
  }
  
  function keyUp(e) {
    var key = -1;
    if (e && e.which) {
      // NS
      key = e.which;
    } else {
      // IE
      key = event.keyCode;
    }
    keys[key] = false;
  }
  
  
  function initStats() {
    changeScore(0);
    changeHealth(maxHealth);
  }
  
  function changeScore(s) {
    score += s;
    rend.changeScore(s);
  }
  
  function changeHealth(h) {
    if (health == maxHealth && h > 0) {
      // increase your max health
      maxHealth += Math.floor(1 + (Math.random() * 2.5));
      h = maxHealth - health;
    } else if (health + h > maxHealth) {
      // heal
      h = maxHealth - health;
    }
    if (health+h < 0) {
      // gonna die!
      h = -health;
    }
    health += h;
    rend.changeHealth(h);
    if (health == 0) {
      gameOver = true;
      defeat(score);
    }
  }
  
  function setMap(x,y,code) {
    map[x+mapWidth*y]=code;
    rend.setMap(x,y,code);
  }
  
  function getMap(x,y) {
    return map[x+mapWidth*y];
  }
  
  function initMap() {
    mapHeight = level.length;
    mapWidth = level[0].length;
    rend.createMapTable();
    for (var y=0; y<level.length; y++) {
      var row = level[y];
      if (row.length != mapWidth) {
        throw Exception('crap!  mapWidth='+mapWidth+
                        ', but level['+y+'].length='+row.length);
      }
      for (var x=0; x<row.length; x++) {
        var c = row.charAt(x);
        if (c=='@') {
          pPos.setXY(x,y);
          opPos.set(pPos);
          setMap(x,y,PLAYER);
        } else {
          setMap(x,y,levelToMap[c]);
        }
      }
    }
  }
  
  function clock() {
    if (gameOver) {
      // don't keep looping
      return;
    }
    if (exitLevel) {
      exitLevel = false;
      levelNum++;
      if (levelNum < levels.length) {
        startLevel();
      } else {
        gameOver = true;
        victory(score);
      }
      return;
    }
    var t = new Date()|0;
    if (moveCool <= MOVECOOL/2) {
      if (keys[vkUp]) pDir.y--;
      if (keys[vkRight]) pDir.x++;
      if (keys[vkDown]) pDir.y++;
      if (keys[vkLeft]) pDir.x--;
    }
    if (moveCool>0) {
      moveCool--;
    }
    if (fire || keys[vkFire]) {
      fire=false;
      pDir.x = Math.sgn(pDir.x);
      pDir.y = Math.sgn(pDir.y);
      playerFire();
      pDir.x = pDir.y = 0;
    } else if (moveCool==0) {
      pDir.x = Math.sgn(pDir.x);
      pDir.y = Math.sgn(pDir.y);
      playerMove();
      pDir.x = pDir.y = 0;
    }
    if (bullet) animateBullet();
    rend.clock();
    animateMap();
    var timeLen = (new Date()|0)-t;
    setTimeout(clock, Math.max(1, Math.floor(maxTimeout - timeLen)));
  }
  
  
  /**
   * move the player, interact with map.
   */
  function playerMove() {
    /** return false if the player should try to slide around obstruction */
    function move(h, v) {
      var c = getMap(pPos.x+h, pPos.y+v);
      if (c==WALL || c==BULLET || c==GNOMEGEN || c==GNOME) return false;
      if (c==STAIRDOWN) {
        exitLevel = true;
      }
      if (c==GOLD) {
        changeScore(20);
      }
      if (c==HEALTH) {
        changeHealth(10);
        changeScore(5);
      }
      pPos.x+=h;
      pPos.y+=v;
      return true;
    }
    
    opPos.set(pPos);
    if (pDir.x==0 && pDir.y==0) return;
    if (!move(pDir.x, pDir.y)) {
      move(pDir.x, 0);
      move(0, pDir.y);
    }
    if (!opPos.equals(pPos)) {
      setMap(pPos.x, pPos.y, PLAYER);
      setMap(opPos.x, opPos.y, FLOOR);
      moveCool = MOVECOOL;
    }
  }
  
  /**
   * player is trying to fire
   */
  function playerFire() {
    if (!bullet && (pDir.x || pDir.y)) {
      bDir.set(pDir);
      bPos.set(pPos);
      bullet=true;
    }
  }
  
  function getTileVideoPos(tx, ty) {
    var x = sLeft + tileWidth*tx;
    var y = sTop + tileHeight*ty;
    return new Vec2d(x,y);
  }
  
  
  function animateBullet() {
    var obPos = new Vec2d(bPos.x, bPos.y);
    bPos.add(bDir);
    var c1 = getMap(obPos.x, obPos.y);
    var c2 = getMap(bPos.x, bPos.y);
    if (c2==GNOME) {
      // kill da gnome!
      setMap(bPos.x, bPos.y, FLOOR);
      //changeScore(1); // no more points for you
      bullet=false;
    } else if (c2==GNOMEGEN) {
      // kill the generator
      setMap(bPos.x, bPos.y, FLOOR);
      changeScore(5);
      bullet = false;
    } else if (c2==FLOOR) {
      setMap(bPos.x, bPos.y, BULLET);
    } else {
      // hit something and vanished
      bullet=false;
    }
    // erase where bullet was
    if (c1==BULLET) setMap(obPos.x, obPos.y, FLOOR);
  }
  
  /**
   * animates tiles within radius 'aniRad' of the player
   */
  function animateMap() {
    function setMoved(x, y) {
      moved[y*mapWidth + x] = true;
    }
    function isMoved(x, y) {
      return moved[y*mapWidth + x];
    }
    
    // returns false if gnome should slide around obstruction
    function moveGnome(h, v) {
      var c = getMap(nx+h, ny+v);
      if (c==PLAYER) {
        // gnomed!
        changeHealth(-1);
        return true;
      } else if (c==FLOOR) {
        nx+=h;
        ny+=v;
        return true;
      } else if (c==BULLET) {
        // gnome is about to die...
        return true;
      }
      // slide around everything else
      return false;
    }
    
    var x0, x1, y0, y1;
    var h, v;
    var moved=[];
    var bulletFound=false;
    
    // ANIMATION BOX
    // initial setting
    x0 = pPos.x-aniRX;
    x1 = pPos.x+aniRX;
    y0 = pPos.y-aniRY;
    y1 = pPos.y+aniRY;
    // box pushing
    if (x0 < 0) {
      x0 = 0;
      x1 = 2*aniRX;
    }
    if (x1 >= mapWidth) {
      x0 = mapWidth-2*aniRX -1;
      x1 = mapWidth-1;
    }
    if (y0 < 0) {
      y0 = 0;
      y1 = 2*aniRY;
    }
    if (y1 >= mapHeight) {
      y0 = mapHeight-2*aniRY -1;
      y1 = mapHeight-1;
    }
    // final clipping
    x0 = Math.max(x0, 0);
    x1 = Math.min(x1, mapWidth-1);
    y0 = Math.max(y0, 0);
    y1 = Math.min(y1, mapHeight-1);
    for (var y=y0; y<=y1; y++) {
      for (var x=x0; x<=x1; x++) {
        if (!isMoved(x, y)) {
          var c = getMap(x, y);
          if (c==GNOME) {
            if (Math.random() < GNOMESPEED) {
              h = Math.sgn(pPos.x-x);
              v = Math.sgn(pPos.y-y);
              if (h || v) {
                var nx=x, ny=y;
                if (!moveGnome(h, v)) {
                  var g1 = moveGnome(h,0);
                  var g2 = moveGnome(0,v);
                  if (!g1 || !g2) {
                    var rd = Vec2d.randDir();
                    moveGnome(rd.x, rd.y);
                  }
                }
                if (x != nx || y != ny) {
                  setMap(nx, ny, GNOME);
                  setMap(x, y, FLOOR);
                  setMoved(nx, ny);
                }
              }
            }
          } else if (c==GNOMEGEN) {
            if(Math.random() < GNOMEGENSPEED) {
              var gen = Vec2d.randDir();
              gen.x+=x;
              gen.y+=y;
              var c2 = getMap(gen.x, gen.y);
              if (c2==FLOOR) {
                setMap(gen.x, gen.y, GNOME);
                setMoved(gen.x, gen.y);
              }
            }
          } else if (c==BULLET) {
            bulletFound = true;
          }
        }
      }
    }
    if (bullet && !bulletFound) {
      // bullet went out of animation zone.  Clear it.
      bullet=false;
      setMap(bPos.x, bPos.y, FLOOR);
    }
  }

  function startLevel() {
    level = levels[levelNum];
    initMap();
    //aniRX = Math.ceil(((videoDiv.offsetWidth / tileWidth)-1)/2);
    //aniRY = Math.ceil(((videoDiv.offsetHeight / tileHeight)-1)/2);
    clock();
  }
  
  function victory(score) {
    var html =
      '<div style="color:#ff0000; font-family:courier, courier new; font-size:500%;font-weight:bold">' +
      'VICTORY!</div>' +
      'You escaped the gnome caverns, slaying many an evil gnome.<br>' +
      'You are a Master Ninja.<br>' +
      'Your score was an awesome <b>' + score + '</b>!<br>' +
      'The gnomes demand a <a href="http://plexode.com/fracas/">rematch!</a>';
    gebi('game').innerHTML = html;
  }
  
  function defeat(score) {
    var html =
      '<div style="color:#ff0000; font-family:courier, courier new; font-size:500%;font-weight:bold">' + 
      'GAME OVER</div>' + 
      'The gnomes kicked your butt.<br>' +
      'Your score was a mere <small>' + score + '</small>.  So small!<br>' + 
      'Do you dare to <a href="http://plexode.com/fracas/">play again?</a>';
    gebi('game').innerHTML = html;
  }
  
  
  /////////////////////////
  // privileged functions
  /////////////////////////
  this.startGame = function(){
    startLevel();
  };
  
  /////////
  // main
  /////////
  var rend = new FracRend(fracasDivID, log);
  initStats();
  document.onkeydown = keyDown;
  document.onkeypressed = keyDown;
  document.onkeyup = keyUp;
}
