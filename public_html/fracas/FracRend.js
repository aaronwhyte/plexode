function FracRend(fracasDivID, log) {
  /////////////////
  // private vars
  /////////////////
  var score = 0;
  var health = 0;
  
  var mapTable; // in the HTML sense
  
  var tileWidth, tileHeight;
  
  // graphics
  var tileHtmls = [];
  tileHtmls[WALL] = '<span class="wall">#</span>';
  tileHtmls[GOLD] = '<span class="gold">$</span>';
  tileHtmls[HEALTH] = '<span class="health">+</span>';
  tileHtmls[FLOOR] = '<span class="floor">.</span>';
  tileHtmls[GNOME] = '<span class="gnome">g</span>';
  tileHtmls[STAIRDOWN] = '<span class="stair">&gt;</span>';
  tileHtmls[BULLET] = '<span class="bullet">*</span>';
  tileHtmls[GNOMEGEN] = '<span class="gnomeGen">G</span>';
  tileHtmls[PLAYER] = '<span class="player">@</span>';
  
  var fracasDiv = gebi(fracasDivID);
  var videoDiv, mapDiv, healthDiv, scoreDiv;
  
  //////////////////////
  // private functions
  //////////////////////
  /**
   * renders the outer HTML of the divs inside the fracasDiv,
   * and sets the xxxDiv pointers to those divs,
   * so we don't have to call document.getElementById() again and again.
   */
  function initLayout() {
  fracasDiv.innerHTML = 
    '<div id="video"><div id="map"></div></div>' +
    '<table border="0" cellpadding="0" cellspacing="4px"><tr>' +
    '<td class="stat">health:<span id="health"></span></td>' +
    '<td class="stat">score:<span id="score"></span></td>' +
    '</tr></table>';
  videoDiv = gebi("video");
  mapDiv = gebi("map");
  healthDiv = gebi("health");
  scoreDiv = gebi("score");
  }
  
  /**
   * @param coordinates of a tile in tile-space
   * @return the Vec2d of the correct scroll position
   */
  function scrollPos(tilePos) {
    var scrollX = (tilePos.x+0.5)*tileWidth - videoDiv.clientWidth*0.5;
    if (scrollX < 0) {
      scrollX = 0;
    }
    if (scrollX > mapTable.clientWidth - videoDiv.clientWidth) {
      scrollX = mapTable.clientWidth - videoDiv.clientWidth;
    }
    var scrollY = (tilePos.y+0.5)*tileHeight - videoDiv.clientHeight*0.5;
    if (scrollY < 0) {
      scrollY = 0;
    }
    if (scrollY > mapTable.clientHeight - videoDiv.clientHeight) {
      scrollY = mapTable.clientHeight - videoDiv.clientHeight;
    }
    return new Vec2d(scrollX, scrollY);
  }
  
  
  /////////////////////////
  // privileged functions
  /////////////////////////
  /**
   * @return the HTML cell in the mapTable at x,y
   */
  this.getCell = function(x,y) {
    return mapTable.rows[y].cells[x];
  };
  
  this.setMap = function(x, y, code) {
    this.getCell(x,y).innerHTML = tileHtmls[code];
  };
  
  this.changeScore = function(s) {
    score += s;
    scoreDiv.innerHTML = score;
  };
  
  this.changeHealth = function(h) {
    if (h < 0) this.pain = 4;
    health+=h;
    healthDiv.innerHTML = health;
  }  ;
  
  /**
   * Moves the camera to follow the player.
   * Scrolls smoothly based on player's speed.
   */
  this.camera = function() {
    var p0 = scrollPos(opPos);
    var p1 = scrollPos(pPos);
    var oldness = moveCool/(MOVECOOL);
    var sLeft = oldness*p0.x + (1-oldness)*p1.x;
    var sTop = oldness*p0.y + (1-oldness)*p1.y;
    
    videoDiv.scrollLeft = sLeft;
    videoDiv.scrollTop = sTop;
  };
  
  /**
   * renders the outer HTML of the mapTable inside the mapDiv,
   * and initializes mapTable.
   */
  this.createMapTable = function() {
    var html = '<table id="mapTable" cellpadding="0" cellspacing="0" border="0">';
    for (var y=0; y<mapHeight; y++) {
      html += '<tr>';
      for (var x=0; x<mapWidth; x++) {
      html +='<td>?</td>';
      }
      html += '</tr>';
    }
    html += '</table>';
    
    mapDiv.innerHTML = html;
    mapTable = gebi("mapTable");
    
    tileWidth = mapTable.clientWidth / mapWidth;
    tileHeight = mapTable.clientHeight / mapHeight;
  };
  
  
  //////////////
  // main body
  //////////////
  initLayout();
}

/////////////////////
// public functions
/////////////////////

function randSgn() {
  var r = Math.random() * 3;
  if (r < 1) return -1;
  if (r < 2) return 0;
  return 1;
};

FracRend.prototype.clock = function() {
  if (this.pain>0) {
  this.pain--;
  this.setMap(pPos.x, pPos.y, PLAYER);
  var pstyle = this.getCell(pPos.x, pPos.y).firstChild.style;
  pstyle.position='relative';
  pstyle.left=this.pain * randSgn();
  pstyle.top=this.pain * randSgn();
  }
  this.camera();
};

