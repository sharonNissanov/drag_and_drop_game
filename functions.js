"use strict";
const dataArr = ["pictures/dress.png","pictures/dress2.png","pictures/golf1.png","pictures/tshitrt.png", "pictures/tshirt2.png"]
var isMuted = false; 
var bMusic = new Audio('sounds/backmusic.mp3');
var gameOver = new Audio('sounds/game-over.mp3');
var applause = new Audio('sounds/applause.mp3');
var victory = new Audio('sounds/victory.mp3');

var counter = 0;
let countDownMinutes = 3;
let time = countDownMinutes * 60;
const lifeCycle = 8;
//let time = 2;
let minute = 0;
let second = 0;
let cron1, cron4;
let gameStatuses  = ["willStart", "paused", "playing"], currentStatus = gameStatuses[0];
let statusA = {exists: false , nextDrop: false , dropped: false , createdTime: time-lifeCycle};
let statusB = {exists: false , nextDrop: false , dropped: false , endTime : time-20-lifeCycle , createdTime: time-20 ,} ;
let comment = "";

//-------------------------------------------------------------------------------------------------------------------------------
//Timer's buttons functionality
function startTimer() {
  if( currentStatus == gameStatuses[0] || currentStatus == gameStatuses[1] ){
    bMusic.pause();
    bMusic.play();
    if(currentStatus == gameStatuses[1]){
      if(statusA.exists) document.getElementById("element").setAttribute('draggable', true);
      if(statusB.exists) document.getElementById("shoes").setAttribute('draggable', true);
    }
    currentStatus = gameStatuses[2];
    if(time<0 || minute <0) resetTimer();
    cron1 = setInterval(() => { updateCountDowm(); }, 1000);
    // cron4 = setInterval(() => { status(); }, 500); 
  } 
}
function pauseTimer() {
  currentStatus = gameStatuses[1];
  if(statusA.exists) document.getElementById("element").setAttribute('draggable', false);
  if(statusB.exists) document.getElementById("shoes").setAttribute('draggable', false);
  bMusic.pause();
  clearInterval(cron1);
  clearInterval(cron4);
}
function resetTimer() {
  location.reload();
}
//-------------------------------------------------------------------------------------------------------------------------------
function updateCountDowm() {
  //handle the time, play/pause the music, creates A element every 8 seconds and B element evert 20-30 seconds
      time--;
      minute = '0' +  Math.floor( time / 60);
      second = time % 60;
    if(time == statusA.createdTime+ lifeCycle - 4 && statusA.exists ){
       document.getElementById("element").setAttribute('draggable', true);
       comment = "A is draggable ";
    }
    if(time == statusB.endTime + 4 && statusB.exists ){
      document.getElementById("shoes").setAttribute('draggable', true);
      comment = "B is draggable ";
   }   
  
      if( statusA.createdTime == time){
        var elm = 'a';
        if( !statusA.dropped) handleRedcolor(elm);
        createAElement();
      }
      if( statusB.endTime == time){
        var elm = 'b';
        // console.log("end B" , time)
        if( !statusB.dropped && statusB.exists) handleRedcolor(elm);
      }
      if( statusB.createdTime == time){
          createBElement();
      }
      
      second = second < 10 ? '0' + second : second;
      document.getElementById('minute').innerText = (minute);
      document.getElementById('second').innerText = (second);
  
      if((minute == 0 && second == 0 ) ||  counter == 10)
      {
        if( counter <= 10){
          bMusic.pause();
          pauseTimer();
          applause.play();
          victory.play();
          victory.play();  
          document.getElementById("headline").innerHTML= "YOU WON!"; 
        }
        else{
          bMusic.pause();
          pauseTimer();
          gameOver.play();
          document.getElementById("headline").innerHTML= "YOU LOST!";
        }
        try{
          
          document.getElementById("element").remove();
          document.getElementById("dropZone").remove();
          document.getElementById("shoes").remove(); 
        }
        catch(e){
          console.log(e);
        }
      }
  
      if( (second == 4 || second == 1) && minute == 0) document.getElementById('clock').style.color = "blue";
      if(second == 3 && minute == 0) document.getElementById('clock').style.color = "red";
      if(second == 2 && minute == 0)  document.getElementById('clock').style.color = "yellow";
  
}
//-------------------------------------------------------------------------------------------------------------------------------
//functions that create the elements and locate them randomaly on the screen and update their statuses
function createAElement() {  
  if( currentStatus == gameStatuses[2] ){
      var currElement =  document.getElementById("element");
      currElement.style.display = "none";
      var xy = getElementRandomPosition(element);
      var newElement = currElement;
      newElement.setAttribute('draggable', false); 
      currElement.src = dataArr[ Math.floor(Math.random() * 5 )];
      newElement.style.display = "inline";
      newElement.style.top =  xy[0] + 'px';
      newElement.style.left = xy[1] + 'px';
      statusA.exists = true; statusA.dropped = false;
      statusA.createdTime = statusA.createdTime- lifeCycle;
      if( statusB.exists == false) statusA.nextDrop = true; 
     // console.log( "statusA.createdTime " , statusA.createdTime)
      document.body.appendChild(newElement);    

  }
}
function createBElement() {
  //create B element- in our case: shoes
  
    if( currentStatus == gameStatuses[2] ){

      var currElement =  document.getElementById("shoes");
      currElement.style.display = "none";
     // console.log("B element need to check "  , statusB.createdTime -lifeCycle)
      var newElement = currElement;
      newElement.setAttribute('draggable', false); 
      newElement.style.display = "inline";
      var nextShow = (Math.floor(Math.random() * 11 ) + 20 );

      var xy = getShoesRandomPosition(shoes); 
      newElement.style.top =  xy[0] + 'px';
      newElement.style.left = xy[1] + 'px';
      // var arrTop =[200 , -100];
      // var arrLeft =[100 , -200];

      // var randomX = Math.floor(Math.random() * 2);
      // var randomY = Math.floor(Math.random() * 2); 

      // newElement.style.top = parseInt(document.getElementById("element").style.top) + arrTop[randomX]+"px";
      // newElement.style.left = parseInt(document.getElementById("element").style.left) + arrLeft[randomY] +"px";
      document.body.appendChild(newElement);   
      statusB.endTime = statusB.createdTime -lifeCycle ;
      statusB.exists = true; statusB.dropped = false; statusB.nextDrop = true;
      statusB.createdTime = statusB.createdTime - nextShow; 
      if( statusA.exists == true) statusA.nextDrop = false;  
    }
}
function getShoesRandomPosition(shoes){
  var arrTop =[200 , -100];
  var arrLeft =[100 , -200];
  var randomX = element.offsetTop + arrTop[ Math.floor(Math.random() * 2)];
  var randomY = element.offsetLeft + arrLeft[Math.floor(Math.random() * 2)];
// console.log(randomX, randomY)
  if(( randomX+200 > window.innerHeight && randomX-200< window.innerHeight ) || randomY+200 > window.innerWidth && randomY-200 < window.innerWidth  || randomY<0)
      return getShoesRandomPosition(shoes);
  return [randomX, randomY];
}
function getElementRandomPosition(element) {
//get a random position on the screem for Element (A), and check its get om the timer 
  var randomY = Math.floor(Math.random() *(window.innerWidth - 200 )) ;
  var randomX = Math.floor(Math.random() * (window.innerHeight -200)) ;
  if(isOverlapping(randomX,randomY))
    return getElementRandomPosition(element);
  else
	  return [randomX,randomY];
}
function isOverlapping (randomX,randomY)  {
//checks if the new postion is not on the timer so that the player will be able to see the timer and the score
  
    // console.log(randomX, clock.offsetTop + clock.offsetHeight, 'ddddddd');
    let overlap = false;
    if(( clock.offsetTop < randomX && randomX+200 < clock.offsetTop + clock.offsetHeight) ||
    clock.offsetLeft< randomY+200 &&  randomY+200 <clock.offsetLeft + clock.offsetWidth ){
    // console.log("overlapping");
    overlap = true;
    }
      comment = overlap ;
      console.warn('Please provide valid HTMLElement object');
      return overlap;
}
//-------------------------------------------------------------------------------------------------------------------------------
//functions that change the drag zone animation to green or red, update the statuses of the elements and calculate the score 
function drop(event) {
//handles the drop event:
  event.preventDefault();
  var data = event.dataTransfer.getData("Text");
  event.target.appendChild(document.getElementById(data));
  var lastChild_ID = document.getElementById("dropZone").lastChild.id;
  var dropZoneStyle = document.getElementById("dropZone");
  // console.log(counter)
  if(lastChild_ID == "element") 
      statusA.dropped = true;
  else
    statusB.dropped = true;
   
  //A dropped and B isnt exists
  if( statusA.exists == true && statusA.dropped == true && statusA.nextDrop == true && statusB.exists == false ){  //console.log("A dropped and B isnt exists" , time)
    statusA.dropped = false; statusA.nextDrop = false; statusA.exists = false; 
    counter ++; comment = "A dropped and B isnt exists";
    document.getElementById("element").style.display = "none";
    dropZoneStyle.style.animationName = "greenAnimation";
    document.getElementById("score").innerHTML = counter;
  }
  //if B is exists and didnt dropped
  if( statusB.exists == true && statusB.dropped == false ){  //console.log("B is exists and didnt dropped" , time)
    counter -= 2; comment = "B is exists and didnt dropped";
    dropZoneStyle.style.animationName = "redAnimation";
    document.getElementById("score").innerHTML = counter;
  }

  //if B is exists and  dropped
  if( statusB.exists == true && statusB.dropped == true ){ //console.log("B is exists and  dropped" , time)
    statusB.exists = false; statusB.dropped = false; statusB.nextDrop = false;  
    if(statusA.exists ) statusA.nextDrop =true; 
    counter += 2; comment = "B dropped A is exists ";
    document.getElementById("shoes").style.display = "none";
    dropZoneStyle.style.animationName = "greenAnimation";
    document.getElementById("score").innerHTML = counter;
  }

  //A dropped and didnt had to 
  if( statusA.exists == true && statusA.dropped == true && statusA.nextDrop == false ){ //console.log("A dropped and didnt had to" , time)
    statusA.dropped = false; statusA.nextDrop = false; statusA.exists = false;
    counter -= 2;  comment = "A dropped and didnt had to";
    document.getElementById("element").style.display = "none";
    dropZoneStyle.style.animationName = "redAnimation";
    document.getElementById("score").innerHTML = counter;
  }
  setTimeout(()=>{document.getElementById("dropZone").style.animationName = "none";}, 900);

}
function handleRedcolor(elm) {
//If the user didnt drop the element - dropZone will be red 
  if( elm == 'a'){
    if( statusA.exists == true && statusA.dropped == false ){
      console.log("handleRedcolor A" , time);
      document.getElementById("element").style.display = "none";
      statusA.exists = false; statusA.nextDrop = false; statusA.dropped = false
      counter--;    comment = "A didn't drop";
      document.getElementById("dropZone").style.animationName="redAnimation";
      document.getElementById("score").innerHTML = counter;  
      setTimeout(()=>{document.getElementById("dropZone").style.animationName = "none";}, 900);
    }
  }
  else{
  if(statusB.exists == true && statusB.nextDrop == true && statusB.dropped == false  ){  //console.log("handleRedcolor B" , time)
    statusB.exists = false; statusB.dropped = false;
    document.getElementById("shoes").style.display = "none";  
    if( statusA.exists ) statusA.nextDrop = true; 
    counter-= 2;
    comment = "B didn't drop";
    document.getElementById("dropZone").style.animationName="redAnimation";
    document.getElementById("score").innerHTML = counter;  
    setTimeout(()=>{document.getElementById("dropZone").style.animationName = "none";}, 900);
  }
  }
}
//-------------------------------------------------------------------------------------------------------------------------------

function handleMuteClick(){
  //handle the mute/unmute buttom 
    isMuted = !isMuted;
    bMusic.muted = isMuted;
    gameOver.muted = isMuted;
    applause.muted = isMuted;
    victory.muted = isMuted;
    if( isMuted == true ){
      document.getElementById('volume_up').style.display = "none";
      document.getElementById('volume_off').style.display = "block";
    }
    else{
      document.getElementById('volume_up').style.display = "block";
      document.getElementById('volume_off').style.display = "none";  
    }
}
function dragStart(event) {
  event.dataTransfer.setData("Text", event.target.id);
}
function allowDrop(event) {
  event.preventDefault();
}
function status() {
  // document.getElementById("turn").innerHTML = comment + " " + time + " " + statusA.exists + " " + statusA.nextDrop + " " + statusA.dropped;
  // document.getElementById("turn").innerHTML = comment + "A: "+ statusA.nextDrop + "B: " + statusB.nextDrop;
  // document.getElementById("turn").innerHTML = comment ;
  createAElement(); 
  //createBElement()

}