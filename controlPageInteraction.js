// This is in the first place to control the interaction with the music.

// All together it is left to
// 1) Create the menu bar.
// 2) Iclude a counter of who is viewing the page when.

// Initial settings and global variables:
var trackWrapper = document.getElementsByClassName('trackWrapper');
var playhead = document.getElementById("playhead");
var timeline = document.getElementById("timeline");
var currTrackNum;
var currTrack;
var duration;
var playheadDragged;
var infosnapper;
var infosnapperisopen;


var trackMin = 0;
var trackMax = trackWrapper.length-1;
var paused = true;




function init(){

  //document.addEventListener("DOMContentLoaded", function() {
  //  document.getElementById("aBlackCurtain").style.visibility = 'hidden';
  //});
  // Is called onload of body.
  playheadDragged = false;
  currTrackNum = 0;
  // initialisation of duration.
  // initialisation of currTrack.

  // The info menu.
  infosnapper = new Snap({
  element: document.getElementById('content')
  });
  infosnapper.disable();
  infosnapperisopen = false;


  showTrackImage();
  showPlayPauseButton();
  updateCurrentTrack();

  document.getElementById('temporalContactLayer').style.visibility = 'hidden';
  document.getElementById('temporalInfoLayer').style.visibility = 'hidden';
  // Event listener:
  playhead.addEventListener("mousedown", function () { playheadDragged = true;}, false );
  document.addEventListener("mousemove", function(event) { if(playheadDragged) {moveplayhead(event);} }, false);
  document.addEventListener("mouseup", function() {
    if (playheadDragged) {
      playheadDragged = false;
      currTrack.currentTime = duration*clickPercent(event);
    }
  },
  false);



}


// Next steps:
// 1) Erstelle Timeline wie in Tutorial.
// 2) Erstelle Menü.

function updateCurrentTrack(){
  // We update the temporal track with all the necessary events.
  currTrack = document.getElementById("track" + currTrackNum);
  // I don't like the following solution:
  // We want the duration of the current Track, but it's possible that it's not yet loaded.
  if (isNaN(currTrack.duration)) {
    // Wait until it's loaded.
    currTrack.addEventListener("loadedmetadata", function(){ duration = currTrack.duration;}, false);
  }else {
    // All good, just set duration.
    duration = currTrack.duration;
  }

  currTrack.addEventListener("timeupdate", timeUpdate, false);

  // I want on the event ended, that the next track will start! But it doesn't work for some reason.
  // What happens is that the event ended is fired just in the beginnging where the track doesn't even start yet.
  currTrack.addEventListener("ended", function() {forwardClicked();}, false);
}


function showTrackImage(){
  // It just goes throught all the trackWrapper divs and shows the correct image.
  for (var i = 0; i < trackWrapper.length; i++) {
    if (i != currTrackNum) {
      trackWrapper[i].style.visibility = 'hidden';
    }else {
      trackWrapper[i].style.visibility = 'visible';
    }
  }
}

function showPlayPauseButton(){
  // It just controls the visibility of eather the paly or the pause button.
  if (paused) {
    document.getElementById("playButtonImage").style.visibility = 'visible';
    document.getElementById("pauseButtonImage").style.visibility = 'hidden';
  } else {
    document.getElementById("playButtonImage").style.visibility = 'hidden';
    document.getElementById("pauseButtonImage").style.visibility = 'visible';
  }
}




function backwardClicked(){
  // Is called if the backward button is clicked.
  if (currTrack.currentTime < 3)
  {
    // Previous Track.
    changeTrack(false);

    if (!paused){
      currTrack.play();
    }
  }else {
    // From the beginning.
    currTrack.currentTime = 0;

    if (!paused) {
      currTrack.play();
    }
  }

}

function forwardClicked(){
  // Just next track.
  changeTrack(true);

  if (!paused) {
    currTrack.play();
  }
}

function playPauseClicked(){
  
  if (paused) {
    currTrack.play();
    paused = false;

    // Visual fade of the button!!!
  }else {
    currTrack.pause();
    paused = true;
    // Visual fade to pause button!!!
  }
  // And adjusting the image
  showPlayPauseButton();
}


function changeTrack(next){
  // 1) Stop the current track.
  currTrack.pause();
  currTrack.currentTime = 0;

  // 2) Change number of the current track w.r.t. next.
  if(next){
    // Look if the current track is last track.
    if(currTrackNum == trackMax){
      currTrackNum = trackMin;
    }else {
      currTrackNum++;
    }

  }else { // previous
      // LLook if the current track is first track.
    if (currTrackNum == trackMin) {
      // Change to last Track
      currTrackNum = trackMax;
    }else {
        currTrackNum--;
    }
  }

  // 3) Make only the corresponding image visible.
  showTrackImage();
  // 4) Update the variable currTrack
  updateCurrentTrack();
}


// Controlling the time line and playhead.
timelineWidth = timeline.offsetWidth - 2; // border width of the timeline is 1px.
playheadWidth = playhead.offsetWidth;
function timeUpdate(){
  // This is called always when the track is progressing.
   // The playhead should start with a marginLeft of 1px and ends so that 1px is left of the timeline...
  var playPercent = (timelineWidth - playheadWidth)*(currTrack.currentTime / duration );
  playhead.style.marginLeft = playPercent + "px";
}

// We want the timeline to be clickable:
timeline.addEventListener("click", function (event) {
  moveplayhead(event);
  currTrack.currentTime = duration*clickPercent(event);
}, false);

function clickPercent(e){
  return (e.pageX - timeline.offsetLeft)/timeline.offsetWidth;
}

// This is necessary to assure dragging and dropping of the playhead.
/* The dragging and dropping doesn't work properly yet:
  1) The playhead is not dragged in the middle, but on the right end.*/
function moveplayhead(e){
  var newMargLeft = e.pageX - timeline.offsetLeft;

  // The x of the curser between the timeline.
  if (newMargLeft >= 0 && newMargLeft <= (timelineWidth - playheadWidth)){
    playhead.style.marginLeft = (newMargLeft - playheadWidth) + "px";
  }
  if (newMargLeft < 0){
    playhead.style.marginLeft = "0px";
  }
  if(newMargLeft > (timelineWidth - playheadWidth)){
    playhead.style.marginLeft = (timelineWidth -playheadWidth) + "px";
  }
}

///////////////////
function menuButtonClicked(){
  if(!infosnapperisopen){
    infosnapper.open('left');
    infosnapperisopen = true;
  }else { // infosnapperisopen == true
      infosnapper.close();
      infosnapperisopen = false;
  }
}


function makeTempLayerInvisible(id){
  document.getElementById(id).style.visibility = 'hidden';
}

function openTemporalLaywer(id){
   document.getElementById(id).style.visibility = 'visible';
}
