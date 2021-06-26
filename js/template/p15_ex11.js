var correctImg = '<div class="showAnswerTickMark showAns"><img src="assets/images/tikMark.png" /></div>';
var incorrectImg= '<div class="showAnswerCrossMark showAns"><img src="assets/images/crossMark.png" /></div>';
var isMusic1Playing = false;
var isMusic2Playing = false;
var $audio1 = $("#audioPlayer1");
var $audio2 = $("#audioPlayer2");
var slider = document.getElementById("myRange");

var lastAudio = 0;

var totalItems = $('.item').length;
var currentIndex = $('div.active').index() + 1;

function fnTemplate4_v1(_div){
	var slide = $(_div);
	var currID;
	
	$audio1[0].pause();
	$audio1[0].currentTime = 0;
	// $("#slider").slider({"value": 0});
	slider.value = 0;
	$audio1[0].pause();
	$audio1[0].removeEventListener('timeupdate', fnUpdateTimer);
	// isMusic1Playing = true;
    $('#pButton .playImg').show();
    $('#pButton .pauseImg').hide();

	setAudio($(slide).attr('data-audioSrc'));
	$('.question').css({'background-color':'#ffffff','color': '#000000'}).removeClass('selected');
	$('.optClick').css('cursor','default');

	$('.question').on('click',function(){
		if($(this).hasClass('disabled')){
			return false;
		}
			$audio1[0].pause();
			$audio2[0].pause();
			$('#pButton .playImg').show();
			$('#pButton .pauseImg').hide();
			
		fnAudio($(this));
		$('.question').removeClass('selected');
		$(this).addClass('selected');
		currID = $(this).index('.question') + 1;
		$('.optClick').each(function(){
			if(!$(this).hasClass('filled')){
				$(this).css('cursor','pointer');
			}
		});
	});
	
	$('.optClick').on('click',function(){
		if($(this).hasClass('filled') || !$('.question').hasClass('selected') || $('.optClick').hasClass('blinking')){
			return false;
		}
		
		var $that = $(this);
		var userAns = $('div.active .question_'+currID+'').find('img').attr('src');
		var corrAns =  $that.attr('data-Answer');
	
		$audio1[0].pause();
		$audio2[0].pause();
		$('#pButton .playImg').show();
		$('#pButton .pauseImg').hide();
		//console.log(userAns+" || "+corrAns)
		$that.html('<img class="ansImage" src='+userAns+' />');
		if(userAns.toString() == corrAns.toString()){
			$('.question').css({'border':'2px solid #ffffff'});
			$('div.active .question_'+currID+'').removeClass('selected');
			//$('div.active .question_'+currID+'').css('visibility','hidden');
			$('.optClick').css('cursor','default');
			fnAudio($('.correctAnsAudio'));
			$that.addClass('filled');
			$that.append(correctImg);
			if($(slide).find('.filled').length == $(slide).find('.optClick').length){
				$('.showAnsBtn').addClass('disabled');
			}
		}else{
			$('.optClick').addClass('blinking').css('cursor','default');
			$that.append(incorrectImg);
			fnAudio($('.incorrectAnsAudio'));
			//$('.question').css({'background-color':'#ffffff','color': '#000000'}).removeClass('selected');
			setTimeout(function(){
				$that.html('&nbsp;');
				$('.optClick').removeClass('blinking');
				$('.optClick').each(function(){
					if(!$(this).hasClass('filled')){
						$(this).css('cursor','pointer');
					}
				});
			},500);
		}
		
		var showbtnEnable = true;
		$('#itemContainer_'+currentIndex+' .optClick').each(function(){
			if(!$(this).hasClass('filled')){
				showbtnEnable = false;
			}
		});
		if(showbtnEnable){
			$('.showAnsBtn').addClass('disabled');
			$('div.active').find('.option').off('click');
			$('div.active').find('.question').addClass('disabled');
		}else{
			$('.showAnsBtn').removeClass('disabled');
		}	
		
	});
	var showbtnEnable = true;
	$('#itemContainer_'+currentIndex+' .optClick').each(function(){
		if(!$(this).hasClass('filled')){
			showbtnEnable = false;
		}
	});
	if(showbtnEnable){
		//$('.showAnsBtn').addClass('disabled');
		$('div.active').find('.option').off('click');
	}else{
		$('.showAnsBtn').removeClass('disabled');
	}

}

function fnReloadAll(){
	$('.optClick').html('&nbsp;');
	$('.question').css({'border':'2px solid #ffffff','visibility':'visible'}).removeClass('selected disabled');
	$('.optClick').removeClass('filled');
	$('.showAnsBtn').removeClass('disabled');
	$('#myCarousel').carousel(0);
	stopAudio();
	$('helpButton').addEventListener ('mousedown', function(){thisPuzzle.hide();});
  $('helpButton').addEventListener ('mouseup', function(){thisPuzzle.show();});
  
	fnTemplate4_v1($('div.active'));
	
}

function fnReloadScreen(){
	$('div.active').find('.option').removeClass('disabled optDisable correctTick incorrectTick showAns').on('click');
	$('div.active').find('.question').removeClass('completed').addClass('notCompleted');
	$('div.active').find('.question').css({'border':'2px solid #ffffff','visibility':'visible'}).removeClass('selected disabled');
	$('div.active').find('.optClick').removeClass('filled');
	$('div.active').find('.optClick').html('&nbsp;');
	stopAudio();
	fnTemplate4_v1($('div.active'));
}


function fnAudio(obj){
	var titleAudioPath = $(obj).attr('data-audioSrc');		
	$audio2[0].setAttribute('src', titleAudioPath);
	$audio2[0].load();
	var playPromise = $audio2[0].play();

    if (playPromise !== undefined) {
      playPromise.then(function(value) {
        // Automatic playback started!
        // Show playing UI.
       // $audio1[0].currentTime = 0;        
		//$("#slider").slider({"value": 0});
		$audio1[0].pause();		
		//$audio1[0].removeEventListener('timeupdate', fnUpdateTimer);
		$('#pButton .playImg').show();
		$('#pButton .pauseImg').hide();
      })
      .catch(function(error){
        // Auto-play was prevented
        // Show paused UI.
      });
    }	
}

function showAns(){
	// music.pause();
	// pButton.className = "";
	// pButton.className = "play";
	
	if($('.showAnsBtn').hasClass('disabled')){
		return false;
	}
	
	$audio1[0].pause();
	$audio2[0].pause();	


	$('div.active').find('.question').css('visibility','hidden');
	$('div.active').find('.optClick').each(function(){
		$(this).html('<img class="ansImage" src='+$(this).attr('data-Answer')+' />').addClass('filled').append(correctImg);
	});
	$(this).addClass('disabled');
	
	
}

function setAudio(_src){
	if(_src == ""){
		$('.controlsDiv').addClass('hide');
	}else{
		$('.controlsDiv').removeClass('hide');
	}
	$audio1[0].setAttribute('src', _src);	
	$audio1[0].load();	
}

/* Title Audio function */
function fnTitleAudioClick(obj){
	if($(obj).hasClass('hide')){
		return false;
	}
	//$audio1[0].currentTime = 0;
	//$("#slider").slider({"value": 0});
	$audio1[0].pause();
	$audio1[0].removeEventListener('timeupdate', fnUpdateTimer);
    $('#pButton .playImg').show();
	$('#pButton .pauseImg').hide();
	var titleAudioPath = $(obj).attr('data-audioSrc');	
	$audio2[0].setAttribute('src', titleAudioPath);
	$audio2[0].load();
	$audio2[0].play();
	isMusic1Playing = false;
	isMusic2Playing = true;
}

function fnUpdateTimer(){	
	var progressValue = Math.round(($audio1[0].currentTime/$audio1[0].duration) * 100);	
	
	slider.value = progressValue;
}

function fnStartAudio(_state){	
	$audio2[0].pause();	
	if(_state == 'play'){
		$('#pButton .playImg').hide();
    	$('#pButton .pauseImg').show();
		$audio1[0].play();
		isMusic1Playing = true;
	}else{
		$('#pButton .playImg').show();
    	$('#pButton .pauseImg').hide();
		$audio1[0].pause();
		lastAudio = 0;
		isMusic1Playing = false;
	}
	$audio1[0].addEventListener('timeupdate', fnUpdateTimer);	
}

function stopAudio(){
	$audio1[0].pause();
	$('#pButton .playImg').show();
    $('#pButton .pauseImg').hide();
	$audio1[0].currentTime = 0;
	slider.value = 0;
	isMusic1Playing = false;
	$audio2[0].pause();
	isMusic2Playing = false;
	lastAudio = 0;
}

function fnSetPlayer(){
	if(currentIndex == 1){
		$('.backBtn').addClass('disabled');
	}

	if(totalItems == 1){
		$('.navigationControls, .nextBtn, .reloadBtnScreen, .backBtn, .pageNumber').addClass('hide');
	}

	if($('.title').attr('data-audioSrc') == ""){
		$('.title').addClass('hide');
		$('.headingTitle').removeClass('col-xs-10').addClass('col-xs-11');
	}

	$audio1[0].addEventListener('playing', function(){
		lastAudio = 1;
		isMusic1Playing = true;
	});

	$audio2[0].addEventListener('playing', function(){
		lastAudio = 2;
		isMusic2Playing = true;
	});

	$audio1[0].addEventListener('pause', function(){
		isMusic1Playing = false;
	});

	$audio2[0].addEventListener('pause', function(){
		isMusic2Playing = false;
	});
	
	$audio1[0].addEventListener('ended', function(){
		lastAudio = 0;
		isMusic1Playing = false;	
		$audio1[0].currentTime = 0;
		slider.value = 0;
		$audio1[0].pause();
		$audio1[0].removeEventListener('timeupdate', fnUpdateTimer);
		$('#pButton .playImg').show();
		$('#pButton .pauseImg').hide();
	});
	
	$audio2[0].addEventListener('ended', function(){
		lastAudio = 0;
	});

	slider.addEventListener("input", function() {
	  // console.log(">> input "+slider.value);
	  // $audio1[0].pause();
	  $audio1[0].removeEventListener('timeupdate', fnUpdateTimer);
	  var setTime = Math.round((slider.value * $audio1[0].duration)/100);
	  $audio1[0].currentTime = setTime;
	}, false);

	slider.addEventListener("change", function() {
		// console.log("change >> "+isMusic1Playing);
		if(isMusic1Playing){
			$audio1[0].play();
			$audio1[0].addEventListener('timeupdate', fnUpdateTimer);	
		}
	}, false);

	$('#myCarousel').on('slid.bs.carousel', function() {
	   currentIndex = $('div.active').index() + 1;
	   $('.pageNumber').html(currentIndex+' of '+totalItems);
	   if(currentIndex == 1){
	   		$('.backBtn').addClass('disabled');
	   }else{
	   		$('.backBtn').removeClass('disabled');
	   }

	   if(currentIndex == totalItems){
	   		$('.nextBtn').addClass('disabled');
	   }else{
	   		$('.nextBtn').removeClass('disabled');
	   }
	   stopAudio();
	 
	   // need to edit template function name here:
	   fnTemplate4_v1($('div.active'));
	});
}



// new code 




    "use strict";

  let thisPuzzle;
  let imagePath;
  let nor, noc; // HTML elements for numbers of rows / columns
  let nbOfRows = 4;  //col num
  let nbOfColumns = 4; // default values //elsayed
  let goodImage = false;

window.onload = function() {

/* class Puzzle */

/* constructor
  - columns, rows = number of columns / rows in the puzzle
  - finalHole is the corner where a tile was removed from the picure to allow for  the movement
       possible values : "TL" for Top Left, "TR", "BL", "BR"

 the size of a tile will be hSize / columns px by vSize / rows px
 
*/

function Puzzle(columns, rows, finalHole) {

  let kx, ky, nvTile, ctx;
  let container = 'game';
  const hSize = img.width;
  const vSize = img.height;
  if (typeof(container) == 'string') {
    container = document.getElementById(container);
  }
  this.container = container;
   // remove any previous contents
  emptyElement(container);

//  this.imagePath = imagePath;

// resize container
  container.style.position = "relative";
  container.style.width = hSize + "px";
  container.style.height = vSize + "px";
// create canvas to display solution
  this.solutionCanvas = document.createElement('canvas');
  this.solutionCanvas.style.position = "absolute";
  this.solutionCanvas.width = hSize;
  this.solutionCanvas.height = vSize;
  ctx = this.solutionCanvas.getContext('2d');
  ctx.drawImage (img, 0, 0); // full image
  container.appendChild(this.solutionCanvas);
// size of tile
  this.hSide = hSize / columns;
  this.vSide = vSize / rows;

  this.columns = columns;
  this.rows = rows;
  finalHole = finalHole.toUpperCase();
  this.finalHole = finalHole;
  this.tbTiles = [];
  this.emptyTileSolution = {};
  this.emptyTileSolution.x = ((finalHole.charAt(1) == "R") ? columns - 1 : 0); // coordinates of hole in solution
  this.emptyTileSolution.y = ((finalHole.charAt(0) == "B") ? rows - 1 : 0);
  this.MoveInPrgrs = false; // no movement in progress
  this.emptyTile = {x: this.emptyTileSolution.x, y: this.emptyTileSolution.y}

// mark hole place
      nvTile = document.createElement("div");
      nvTile.style.width = this.hSide + "px";
      nvTile.style.height = this.vSide + "px";
      nvTile.style.position = "absolute";
      nvTile.style.padding = "0";
      nvTile.style.margin = "0";
      nvTile.style.position = "absolute";
      nvTile.className = "emptyTileSolution";
      nvTile.style.left = this.emptyTileSolution.x * this.hSide + "px";
      nvTile.style.top  = this.emptyTileSolution.y * this.vSide + "px";
      container.appendChild(nvTile);

// 'true' tiles
  for (ky = 0; ky < rows; ky++) {
    this.tbTiles[ky] = [];
    for (kx = 0; kx < columns; kx++) {
      if (kx == this.emptyTile.x && ky == this.emptyTile.y) continue; // no tile at the place of the hole
      nvTile = document.createElement("canvas");
      nvTile.width = this.hSide;
      nvTile.height = this.vSide;
      nvTile.style.position = "absolute";
      nvTile.style.padding = "0";
      nvTile.style.margin = "0";
      nvTile.style.position = "absolute";
      ctx = nvTile.getContext("2d");
      ctx.drawImage(img, kx * this.hSide, ky * this.vSide, this.hSide, this.vSide, 0, 0, this.hSide, this.vSide);
      addBorders(nvTile);

      nvTile.style.left = kx * this.hSide + "px";
      nvTile.style.top = ky * this.vSide + "px";
      nvTile.addEventListener("mousedown" , (function(obj, x, y) {return function(e){ obj.enter(e, x, y); }})(this, kx, ky));
      nvTile.addEventListener("mouseup" ,   (function(obj, x, y) {return function(e){ obj.leave(e, x, y); }})(this, kx, ky));
      nvTile.addEventListener("mouseout" ,  (function(obj, x, y) {return function(e){ obj.leave(e, x, y); }})(this, kx, ky));

      container.appendChild(nvTile);
      this.tbTiles[ky][kx]= {tile: nvTile, currentPos: {x: kx, y: ky}}; // x, y = current position of tile in puzzle

    } // for kx
  } // for ky
  this.gameInProgress = false;
  this.hide();
} // Puzzle constructor

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// display the tiles
Puzzle.prototype.show = function() {
  let kx,ky;

  if (! this.gameInProgress) return;
  for (ky = 0; ky < this.rows; ky++) {
    for (kx = 0; kx < this.columns; kx++) {
      if (typeof(this.tbTiles[ky][kx]) == "undefined") continue; // ignorer tile vide
      this.tbTiles[ky][kx].tile.style.visibility = "visible";
    } // for kx
  } // for ky
  this.solutionCanvas.style.display = 'none';

} // Puzzle.prototype.show

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// hides tiles, and displays solution

Puzzle.prototype.hide = function() {
  let kx,ky;

  this.solutionCanvas.style.display = 'none';
  for (ky=0; ky< this.rows; ky++) {
    for (kx=0; kx< this.columns; kx++) {
      if (typeof(this.tbTiles[ky][kx])=="undefined") continue; // ignorer tile vide
      this.tbTiles[ky][kx].tile.style.visibility="hidden";
    } // for kx
  } // for ky
  this.solutionCanvas.style.display = 'block';

} // Puzzle.prototype.hide


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// beginning of game : shuffle + display

Puzzle.prototype.shuffle = function() {

  // 1st phase : fully random suffle
  let nbTot = this.columns * this.rows; // total number of tiles
  let k = 0;
  let kalea;
  let listalea;

  let kx,ky,kkx,kky;

  do {
    listalea=[];
  // create ordered list
    for (k = 0; k < nbTot; k++) {
      listalea[k] = k;
    } // for k

  // shuffle
    k = 0;
    while (k < nbTot-1) {
      kalea = k + Math.floor(Math.random() * (nbTot - k)); // random k..nbTot-1
      if (k != kalea) {
        // on va permuter
        [listalea[k], listalea[kalea]] = [listalea[kalea], listalea[k]];
      }
      ++k; // next
    } // while

// check parity to see if a solution exists
    for (k = 0; k < nbTot; k++) {
      kx = k % this.columns;
      ky = Math.floor(k / this.columns);

      kkx = listalea[k] % this.columns;
      kky = Math.floor(listalea[k] / this.columns);

      if ((kkx == this.emptyTileSolution.x) && (kky== this.emptyTileSolution.y)) {
        this.emptyTile ={x:kx, y:ky };
      } else {

        this.tbTiles[kky][kkx].currentPos= {x:kx, y: ky};
      }
    } // for k

  } while ((this.parity() & 1) || this.ifRightPlace()); // begin everything back if no solution

  this.gameInProgress = true;
  this.show();
/* launch shuffle animation */
  this.tempo = setInterval((function(obj) { return function() {obj.moveAll();}})(this),10);

} // Puzzle.prototype.shuffle

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Puzzle.prototype.enter = function(e,x,y) {

  if (e.button != 0) return; // not the left button
  if (this.MoveInPrgrs) return; // move already in progress
  e.preventDefault();
  if (typeof(this.tbTiles[y][x].eventListenermousemove) == 'undefined') {
    this.tbTiles[y][x].eventListenermousemove= (function(obj) {
        return function (ee) { obj.move(ee,x,y); }})(this);
    e.target.addEventListener("mousemove", this.tbTiles[y][x].eventListenermousemove);
  }
// record initial position of mouse, will be useful to detect movement direction
  this.xinit = e.screenX;
  this.yinit = e.screenY;

} // Puzzle.prototype.enter

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Puzzle.prototype.leave = function(e,x,y) {

  if (e.button != 0) return; // not the left button
  e.preventDefault();
  e.target.removeEventListener("mousemove",this.tbTiles[y][x].eventListenermousemove);
  delete (this.tbTiles[y][x].eventListenermousemove);
} // Puzzle.prototype.leave

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Puzzle.prototype.move = function(e,x,y) {
  let dx,dy,currTile;
  dx = e.screenX - this.xinit;
  dy = e.screenY - this.yinit;

  currTile=this.tbTiles[y][x];

  if (Math.abs(dx) > 10 && Math.abs(dy / dx) < 0.5) { // horizontal
    if (currTile.currentPos.y == this.emptyTile.y) {
      if ((dx > 0) && (currTile.currentPos.x < this.emptyTile.x)) { // to the right
        this.initiateSlide(x, y, "right");
      } // to the right
      else if ((dx < 0) && (currTile.currentPos.x > this.emptyTile.x)) { // to the left
        this.initiateSlide(x, y, "left");
      } // to the left
    } // if same line as hole
  } // horizontal

  if (Math.abs(dy) > 10 && Math.abs(dx / dy) < 0.5) { // vertical
    if (currTile.currentPos.x == this.emptyTile.x) {
      if ((dy > 0) && (currTile.currentPos.y < this.emptyTile.y)) { // downwards
        this.initiateSlide(x, y, "down");
      } // downwards
      else if ((dy < 0) && (currTile.currentPos.y > this.emptyTile.y)) { // upwards
        this.initiateSlide(x, y, "up");
      } // upwards
    } // if same column as hole
  } // vertical

}  // Puzzle.prototype.move

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// initiate movement of tiles

Puzzle.prototype.initiateSlide = function(kx,ky,direction) {

  let currTile = this.tbTiles[ky][kx].tile;
  let lstTTM = [];      // list of tiles to move
  let xv = this.emptyTile.x; // coord hole (empty tile)
  let yv = this.emptyTile.y;
  let xc = this.tbTiles[ky][kx].currentPos.x; // coord current tile
  let yc = this.tbTiles[ky][kx].currentPos.y;

  let xx, yy; // counters for loops

  currTile.removeEventListener("mousemove",this.tbTiles[ky][kx].eventListenermousemove);
  delete (this.tbTiles[ky][kx].eventListenermousemove);

  this.deplx = 0; this.deply = 0; // displacemnt to be done, in number of tiles (0 or 1)
  this.futEmptyTile = {x: this.tbTiles[ky][kx].currentPos.x,
                       y: this.tbTiles[ky][kx].currentPos.y}; // future hole

  switch (direction) {
    case "right" :
          for (yy = 0; yy < this.rows; yy++) {
            for (xx = 0; xx < this.columns; xx++) {
              if (typeof(this.tbTiles[yy][xx]) == "undefined") continue; // no tile
              if (this.tbTiles[yy][xx].currentPos.y == yv &&
                  this.tbTiles[yy][xx].currentPos.x >= xc &&
                  this.tbTiles[yy][xx].currentPos.x <  xv) {
                  lstTTM.push({x: xx, y: yy});
                  this.deplx = 1;
              } // if tile between click and hole
            } // for xx
          } // for yy
          break;

    case "left" :
          for (yy = 0; yy < this.rows; yy++) {
            for (xx = 0; xx < this.columns; xx++) {
              if (typeof(this.tbTiles[yy][xx]) == "undefined") continue; // no tile
              if (this.tbTiles[yy][xx].currentPos.y == yv &&
                  this.tbTiles[yy][xx].currentPos.x <= xc &&
                  this.tbTiles[yy][xx].currentPos.x >  xv) {
                  lstTTM.push({x: xx, y: yy});
                  this.deplx = -1;
              } // if tile between click and hole
            } // for xx
          } // for yy
          break;

    case "up" :
          for (yy = 0; yy < this.rows; yy++) {
            for (xx = 0; xx < this.columns; xx++) {
              if (typeof(this.tbTiles[yy][xx]) == "undefined") continue; // no tile
              if (this.tbTiles[yy][xx].currentPos.x == xv &&
                  this.tbTiles[yy][xx].currentPos.y <= yc &&
                  this.tbTiles[yy][xx].currentPos.y >  yv) {
                  lstTTM.push({x: xx, y: yy});
                  this.deply = -1;
              } // if tile between click and hole
            } // for xx
          } // for yy
          break;

    case "down" :
          for (yy = 0; yy < this.rows; yy++) {
            for (xx = 0; xx < this.columns; xx++) {
              if (typeof(this.tbTiles[yy][xx]) == "undefined") continue; // no tile
              if (this.tbTiles[yy][xx].currentPos.x == xv &&
                  this.tbTiles[yy][xx].currentPos.y >= yc &&
                  this.tbTiles[yy][xx].currentPos.y <  yv) {
                  lstTTM.push({x: xx, y: yy});
                  this.deply = 1;
              } // if tile between click and hole
            } // for xx
          } // for yy
          break;

  } // switch direction
  this.MoveInPrgrs = true; // moving at last !
  this.tinit = Date.now(); // time of beginning of movement
  this.lstTTM = lstTTM;    // record list of sliding tiles
  this.tempo = setInterval((function(obj) { return function() {obj.slide();}})(this), 10);
} // Puzzle.prototype.initiateSlide

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// slide of tiles
Puzzle.prototype.slide = function() {

  let duration = 300; // duration of movement, in ms
  let now = Date.now() - this.tinit;
  let avx, avy;
  let progress = (Date.now() - this.tinit) / duration;
  let cs,til;

  if (progress >= 1) { // end of movement
    clearInterval(this.tempo);
    for (til in this.lstTTM) {
      til = this.lstTTM[til];
      cs = this.tbTiles[til.y][til.x];
      cs.currentPos.x += this.deplx;
      cs.currentPos.y += this.deply;
      cs.tile.style.left = (cs.currentPos.x * this.hSide) + "px";
      cs.tile.style.top  = (cs.currentPos.y * this.vSide) + "px";
    } // for
    this.emptyTile = this.futEmptyTile; // new place for hole

    this.MoveInPrgrs = false;
    if (this.ifRightPlace()) {  // all ok !
      this.gameInProgress = false;
      this.hide(); // on a gagné
	  //displayError('Congratulations !'); // not enough - sorry for my laziness
	  // ma
	  $('#carteSoudCtrl')[0].play();
     $('.showAnsBtn').addClass('disabled');
     $('#general').css('cursor','default');
	   //elsyed
    }
    return;
  } // end of movement
  avx = progress * this.deplx ;
  avy = progress * this.deply ;

  for (til in this.lstTTM) {
    til = this.lstTTM[til];
    cs = this.tbTiles[til.y][til.x];
    cs.tile.style.left = ((cs.currentPos.x + avx)* this.hSide) + "px";
    cs.tile.style.top  = ((cs.currentPos.y + avy)* this.vSide) + "px";
  } // for

} // Puzzle.prototype.slide

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// calculation of 'parity' of tiles
/* 
   Ever tile is assigned a number from 1 to N (= this.columns*rows) depending on
   if final position (solution) : 1 = upper left, 2 = right of 1…
   this.columns for top right … N for bottom right. The empty tile (hole) is counted.

  The "parity" of a configuration is computed as described hereafter:
  For each tile, we count among thepreceding tiles how many have a number higher
  than this of the tile.
  This number is computed and all the numbers obtained are added. the parity of
  the sum is kept. The sum and the parity are 0 when all tiles are at the right
  places.
  It is easy ( or not ) to see that this parity does not change every time a
  single tile is moved (exchanged with the hole) horizontally.
  For single vertical movements, the parity is changed or unchanged according
  to the … parity of the width (number of columns) :
  - if the width is even, the parity of the configuration changes at every
  vertical move
  - if the width is odd, the parity of the configuration is constant.
*/

Puzzle.prototype.parity = function() {
  let par, kx, ky, cs, k;
// we create a linear structure to make things easier
  let linear = [];
  for (ky = 0; ky < this.rows; ky++) {
    for (kx=0; kx < this.columns; kx++) {
      if (typeof(this.tbTiles[ky][kx]) == "undefined") continue; // hole
      cs = this.tbTiles[ky][kx];
      linear[cs.currentPos.y * this.columns + cs.currentPos.x] = ky * this.columns+kx;
    } // for kx
  } // for ky
  for (k = this.emptyTile.y * this.columns + this.emptyTile.x; k < this.columns * this.rows - 1; k++) {
    linear[k] = linear[k + 1];
  } // for k
  if (linear.length > this.columns * this.rows - 1 ) linear.pop(); // remove last element except if it did not exist

// we scan "linear" now
  par = 0;
  for (kx = 1; kx < linear.length; kx++) { // kx and ky are not horizontal / vertical indexes here
    cs = linear[kx];          // one tile
    for (ky = 0; ky < kx; ky++) { // check only preceding tiles
      if (linear[ky] > cs) par++; // number of preceding tiles bigger than current one
    } // for ky
  } // for kx

/* now take into account the number of lines between current hole position and
       final ole position. Only if this.columns is even.
*/
    if ((this.columns & 1) == 0 ) {
      par += this.emptyTileSolution.y - this.emptyTile.y;
    }

  return par;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// check if every tile is at the right place

Puzzle.prototype.ifRightPlace = function(){
  let kx,ky;

  for (ky = 0; ky < this.rows; ky++) {
    for (kx = 0; kx < this.columns; kx++) {
      if (typeof(this.tbTiles[ky][kx])=="undefined") continue; // ignore hole
      if ((this.tbTiles[ky][kx].currentPos.x != kx) ||
          (this.tbTiles[ky][kx].currentPos.y != ky)) return false;
    } // for kx
  } // for ky
  return true; // all right !
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// approach one tile of its target position, based on actual position.

// returns true and forces target position if close enough from target

Puzzle.prototype.approachTile = function (oneTile) {

  let topTarget, leftTarget;
  let leftAct, topAct;
  let dx, dy, dist;

  const veryClose = 5;
  const displ = 5;

  leftTarget = oneTile.currentPos.x * this.hSide;
  topTarget = oneTile.currentPos.y * this.vSide;
  leftAct = parseInt(oneTile.tile.style.left);
  topAct = parseInt(oneTile.tile.style.top) ;

  dx = leftTarget - leftAct;
  dy = topTarget - topAct;

  dist = Math.sqrt(dx * dx + dy * dy); // distance to target
  if (dist==0) return true; // perfect
  if (dist < veryClose) { // close enough : force right position
    oneTile.tile.style.left = leftTarget + "px";
    oneTile.tile.style.top = topTarget + "px";
    return true;
  }
  // getting closer
  oneTile.tile.style.left = leftAct + displ * dx / dist + "px";
  oneTile.tile.style.top  = topAct + displ * dy / dist + "px";
  return false;

} // Puzzle.prototype.approachTile

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Puzzle.prototype.moveAll = function () {

  let kx,ky,finished;

  finished = true;

  for (ky=0; ky < this.rows; ky++) {
    for (kx=0; kx < this.columns; kx++) {
      if (typeof(this.tbTiles[ky][kx]) == "undefined") continue; // ignore empty tile
      if (!this.approachTile(this.tbTiles[ky][kx])) finished = false;
    } // for kx
  } // for ky

  if (finished) clearInterval(this.tempo);
} // Puzzle.prototype.moveAll

//--------------------------------------------------------------------
/* there is probably a easier way to do this */

function addBorders (canvas) {
  const thickness = 5;
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext('2d');

  let gradient;
  // top
  ctx.beginPath();
  ctx.moveTo (0, 0);
  ctx.lineTo (w, 0);
  ctx.lineTo (w - thickness, thickness);
  ctx.lineTo (thickness, thickness);
  gradient = ctx.createLinearGradient(0, thickness, 0, 0);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
  ctx.fillStyle = gradient;
  ctx.fill();
  // right
  ctx.beginPath();
  ctx.moveTo (w, 0);
  ctx.lineTo (w, h);
  ctx.lineTo (w - thickness, h - thickness);
  ctx.lineTo (w - thickness, thickness);
  gradient = ctx.createLinearGradient(w - thickness, 0, w, 0);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = gradient;
  ctx.fill();
  // bottom
  ctx.beginPath();
  ctx.moveTo (w, h);
  ctx.lineTo (0, h);
  ctx.lineTo (thickness, h - thickness);
  ctx.lineTo (w - thickness, h - thickness);
  gradient = ctx.createLinearGradient(0, h - thickness, 0, h);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = gradient;
  ctx.fill();
  // left
  ctx.beginPath();
  ctx.moveTo (0, h);
  ctx.lineTo (0, 0);
  ctx.lineTo (thickness, thickness);
  ctx.lineTo (h - thickness, thickness);
  gradient = ctx.createLinearGradient(thickness, 0, 0, 0);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
  ctx.fillStyle = gradient;
  ctx.fill();

} // addBorders

//--------------------------------------------------------------------

//--------------------------------------------------------------------

function loaded() {
  
  goodImage = true;
  playGame();
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function loadImage(number) {
  goodImage = false;
  img.src = ["assets/images/img1.jpg",
            // "https://wkz3w59.fr/ipcp/taquin/kitten.jpg",
            // "https://wkz3w59.fr/ipcp/taquin/loh.png"
            ][number - 1];
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function loadUserImage() {

  let inp = document.getElementById('userfile');
  inp.onchange = function() {
// check a few points
    if (this.files.length < 1) {
      callBackKO();
      return;
    }
    let file = this.files[0];

    if (file.type.substr(0,6) != 'image/'){
      callBackKO();
      return;
    }

    if (file.size < 1) {
      callBackKO();
      return;
    }

    let reader = new FileReader();
    reader.onload = function(e) {
            img.src = e.target.result;
            callBackOK();
            return;
          };

    reader.readAsDataURL(file);
   } // inp.onchange

  inp.click(); // click hidden button, open control to load file

  function callBackOK() {
    playGame();
  }
  function callBackKO() {
    displayError('Could not load file');
  }
} // loadUserImage

//--------------------------------------------------------------------
function shuffle() {
  playGame();
}

//--------------------------------------------------------------------
function playGame() {
  readNocNor();
  if (! goodImage) return;
  thisPuzzle = new Puzzle(nbOfColumns, nbOfRows, "BR");
  thisPuzzle.shuffle();
  thisPuzzle.gameInProgress = true;
  //$('.showAnsBtn').addClass('disabled');
} // play Game
//--------------------------------------------------------------------

function readNocNor() {
// read human interface
// number of columns
  let x = parseInt(noc.value, 10);
  if (isNaN (x)) { x = nbOfColumns }
  if (x < 2) x = 2;
  if (x > 10) x = 10;
  noc.value = nbOfColumns = x;

// number of rows
  x = parseInt(nor.value, 10);
  if (isNaN (x)) { x = nbOfRows }
  if (x < 2) x = 2;
  if (x > 10) x = 10;
  nor.value = nbOfRows = x;

} //
//--------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function displayError(message) {
  let msg = document.getElementById('msg');
  msg.innerHTML = message;
  setTimeout(function(){msg.innerHTML = '&nbsp;'},2000);
} // displayError
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function emptyElement(container) {
  while (container.firstChild) {
    emptyElement(container.firstChild);          // remove children recursively
    container.removeChild(container.firstChild);
  } // while
  
} // emptyElement

//--------------------------------------------------------------------

// beginning of execution
  let img = new Image();
  img.addEventListener('load', loaded);
  img.addEventListener('error', function() {
    displayError ("unable to load picture");
    goodImage = false;});

  document.getElementById('shuffleButton').addEventListener ('click', shuffle);
  document.getElementById('helpButton').addEventListener ('mousedown', function(){thisPuzzle.hide();});
  //document.getElementById('helpButton').addEventListener ('mouseup', function(){thisPuzzle.show();});
  document.getElementById('loadButton1').addEventListener ('click', function() {loadImage(1);});
  document.getElementById('loadButton2').addEventListener ('click', function() {loadImage(2);});
  document.getElementById('loadButton3').addEventListener ('click', function() {loadImage(3);});
  document.getElementById('loadButtonY').addEventListener ('click', loadUserImage);
  nor = document.getElementById('nor');
  noc = document.getElementById('noc');

  nor.value = nbOfRows;
  noc.value = nbOfColumns;
  loadImage(1);
}