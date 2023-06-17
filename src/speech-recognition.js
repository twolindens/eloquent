 var recognizing = false;
var tmstart = new Date().getTime();
let fillerWords = /\b(almost|basically|etc|um|uh|oh|er|ah|very|really|highly|like|just|you know|you see|right|I mean|I guess|I suppose|totally|literally|seriously|actually)\b/gi;

var recognition = new (window.SpeechRecognition ||
window.webkitSpeechRecognition ||
window.mozSpeechRecognition ||
window.msSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;



// Feedback Counters are defined as global variables
var final = "";
var interim = "";

var tm = "";
var tm1 = parseFloat(tmstart)/1000.0;

var count = "";
var count1 = 0;

var pace = "";
var pace1 = 0;
var paceclass = "info";

var fillerwc = "";
var fillerwc1 = 0;
var fillerclass = "success";

var confidence = "";
var confidence1 = 0;
var confidenceclass = "info";

setDisplayForReady();
initFeedbackCounters();
setFeedbackDisplay();
setDetailsDisplay();

function initFeedbackCounters(){
  final = "";
  interim = "";
  tm1 = parseFloat(tmstart)/1000.0;
  count1 = 0;
  pace1 = 0;
  paceclass = "other"; 
  fillerwc1 = 0;
  fillerclass = "other";
  confidence1 = "0";
  confidenceclass = "other";
}

function setFeedbackDisplay(){
  /* PACE */
  // change bar color based on pace
  if(pace1 < 60) { paceclass = "info";}
  else if (pace1 > 100) {paceclass = "danger";} 
  else {paceclass = "success";}
  pacebar.className = paceclass;
  //scale bar width within 10%-100%
  pacebar.style.width = parseInt(10.00 + pace1*(90.00/300.00)).toString() + "%";
  //print pace value on bar
  pacebar.innerHTML = (parseInt(pace1)).toString();
  
  /* FILLER WORDS */
  if (fillerwc1 == 0) {fillerclass = "success";}
  else if (fillerwc1 < 3) { fillerclass = "info";}
  else {fillerclass = "danger";}
  fillerbar.className = fillerclass;
  //scale bar width within 10%-100%
  fillerbar.style.width = (fillerwc1+10).toString() + "%";
  //print pace value on bar
  fillerbar.innerHTML = fillerwc1.toString();

  /* CONFIDENCE */
  if(confidence1 > 90) {confidenceclass = "success";}
  else if (confidence1 > 80) { confidenceclass = "info";}
  else {confidenceclass = "danger";}
  confidencebar.className = confidenceclass;
  //scale bar width within 10%-100%
  confidencebar.style.width = confidence1.toString() + "%";
  //print pace value on bar
  confidencebar.innerHTML = confidence1.toString() + "%";
}


function setDetailsDisplay(){
  final_span.innerHTML = final.replace(fillerWords,wordReplace);
  interim_span.innerHTML = interim;
  time_span.innerHTML = getTenWords(tm);
  count_span.innerHTML = getTenWords(count);
  pace_span.innerHTML = getTenWords(pace);
  fillerwc_span.innerHTML = getTenWords(fillerwc);
  confidence_span.innerHTML = getTenWords(confidence);
}

function getWordCount(str) {
    return str.split(' ')
      .filter(function(n) { return n != '' })
      .length;
}

function getTenWords(str) {
  if (str.split(' ')
    .filter(function(n) { return n != '' }).length > 10) {
      str=str.split(' ').slice(0,10).join(' ');
    };
  return str;
}


function fillerCount(str){
    return (str.match(fillerWords) || []).length;
}

function wordReplace(str)
{
  return str.toUpperCase();
}

/* This is the auto pause state. Restarting recognizing for now. */
recognition.onend = startRecognizeCycle;

/* When a result is returned, we will update the feedback accordingly */
recognition.onresult = function (event) {
  console.log("DEBUG: recognition.onresult");
  console.log("DEBUG:" + event);

  initFeedbackCounters();

  for (var i = 0; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {

      final += event.results[i][0].transcript;

      count1 = getWordCount(event.results[i][0].transcript);
      count = count1.toString() + " " + count;
      
      tm1 = parseFloat(new Date().getTime()-tmstart)/1000.0;
      tm = parseInt(tm1).toString() + " " + tm;

      pace1 = parseInt(parseFloat(count1*60)/parseFloat(tm1));
      pace = pace1.toString() + " " + pace;

      confidence1 = parseInt(event.results[i][0].confidence*100);
      confidence = confidence1.toString() + " " + confidence;
    } else {
      interim += event.results[i][0].transcript;
    }
  }
  
  fillerwc1 = fillerCount(final);
  fillerwc = fillerwc1.toString() + " " + fillerwc;

  /* FEEDBACK*/
  setFeedbackDisplay();

  /* DETAILS */
  setDetailsDisplay();
  //final_span.innerHTML = final.replace(fillerWords,wordReplace);
  //interim_span.innerHTML = interim;
  //count_span.innerHTML = count.toString();
  //time_span.innerHTML = tm.toString();
  //pace_span.innerHTML = pace.toString();
  //fillerwc_span.innerHTML = fillerwc.toString();
  //confidence_span.innerHTML = confidence1;

  /* LOG */
  console.log("count1" + " " + count1);
  console.log("count" + " " + count);
  console.log("fillerwc" + " " + fillerwc);
  console.log("fillerwc1" + " " + fillerwc1);
  console.log("tm1" + " " + tm1 + "%");
  console.log("tm" + " " + tm + "%");
  console.log("pace1" + " " + pace1 + "%");
  console.log("pace" + " " + pace + "%");
  console.log("confidence" + " " + confidence + "%");
  console.log("confidence1" + " " + confidence1 + "%");
}

function startRecognizeCycle(){
  console.log("DEBUG: recognition.start");
  if(recognizing) {
    tmstart = new Date().getTime();
    recognition.start();
  }
}

function stopRecognizeCycle(){
  console.log("DEBUG: recognition.stop");
  recognition.stop();
}

function initRecognizeCycle(){
  count_span.innerHTML = "0";
  final_span.innerHTML = "";
  interim_span.innerHTML = "";
  confidence_span.innerHTML = "";
}

function setDisplayForReady(){
  greetings1.style.display = "block";
  greetings2.style.display = "none";
  greetings3.style.display = "none";

  visual_feedback.style.display = "none";
  button_listen.innerHTML = "<i class='fa fa-microphone'> </i> Start";


  welcome_image.style.display = "block";
  transcribe_section.style.display = "none";
  feedback_section.style.display = "none";
}

function setDisplayForAutoPause(){
  greetings1.style.display = "none";
  greetings2.style.display = "block";
  greetings3.style.display = "none";  

  visual_feedback.style.display = "block"
  button_listen.innerHTML = "<i class='fa fa-microphone-slash'> </i> Stop Listening";


  welcome_image.style.display = "none";
  transcribe_section.style.display = "block";
  feedback_section.style.display = "block";
}

function setDisplayForListen(){
  greetings1.style.display = "none";
  greetings2.style.display = "none";
  greetings3.style.display = "block";  

  visual_feedback.style.display = "block"
  button_listen.innerHTML = "<i class='fa fa-microphone-slash'> </i> Stop";


  welcome_image.style.display = "none";
  transcribe_section.style.display = "block";
  feedback_section.style.display = "block";
}

function toggleStartStop() {
  var greetings1 = document.getElementById("greetings1");
  var greetings2 = document.getElementById("greetings2");
  var greetings3 = document.getElementById("greetings3");

  var button_listen = document.getElementById("button_listen");


  var visual_feedback = document.getElementById("visual_feedback");
  //document.getElementById('progress').style.width = "50%";
  var pacebar = document.getElementById("pacebar");
  var fillerbar = document.getElementById("fillerbar");
  var confidencebar = document.getElementById("cofidencebar");

  var welcome_image = document.getElementById("welcome_image");
  var transcribe_section = document.getElementById("transcribe_section");
  var feedback_section = document.getElementById("feedback_section");

  if (recognizing) {
    recognizing = false;
    setDisplayForReady();
    stopRecognizeCycle();
    initRecognizeCycle();

  } else {
    recognizing = true;
    setDisplayForListen();
    startRecognizeCycle();
    initRecognizeCycle();
  }
}
