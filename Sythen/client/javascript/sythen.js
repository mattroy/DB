//sythen.js

var queue = [];
var newQueue = [];
var baseTime;
var playInterval;
var playing = false;

function loadSounds() {
    
    var audioPath = "sounds/";
    var manifest = [
        {id: "1", src: "sounds/binary_drop_01.ogg"},
        {id: "2", src: "sounds/binary_drop_02.ogg"},
        {id: "3", src: "sounds/binary_drop_03.ogg"},
        {id: "4", src: "sounds/binary_drop_04.ogg"},
        {id: "5", src: "sounds/binary_drop_05.ogg"},
        {id: "6", src: "sounds/binary_drop_06.ogg"},
        {id: "7", src: "sounds/binary_drop_07.ogg"},
        {id: "8", src: "sounds/binary_drop_08.ogg"},
        {id: "9", src: "sounds/binary_drop_09.ogg"},
        {id: "10", src: "sounds/binary_drop_10.ogg"},
        {id: "11", src: "sounds/binary_drop_11.ogg"},
        {id: "12", src: "sounds/binary_drop_12.ogg"}
    ];

    createjs.Sound.addEventListener("loadComplete", handleSoundLoad);
    createjs.Sound.registerManifest(manifest, audioPath);

}

function setupSynthButtons() {
	$("#synth > .synthButton").click(handleSoundButton);
    //$("#startButton").click(handleStart);
    //$("#stopButton").click(handleStop);
    //$("#playButton").click(handlePlay);
}

function handleSoundLoad(event) {
    console.log("Audio " + event.src + " was loaded.");
}

function handleSoundButton(event) {
    createjs.Sound.play(event.target.getAttribute("data-sound-id"));
    console.log("time " + (Date.now() - baseTime) + " event " + event.target.innerText);
    if (playing) {
        newQueue.push({time: (Date.now() - baseTime), id: event.target.innerText});
    } else {
        queue.push({time: (Date.now() - baseTime), id: event.target.innerText});
    }
}

function handleStart() {
    baseTime = Date.now();
    
    console.log("Start time is " + baseTime);
}

function handleStop() {
    console.log("stop");
    clearInterval(playInterval);
    playing = false;
    queue = queue.concat(newQueue);
    queue = queue.sort(function(a, b) {
        a.time < b.time ? a : b;
    });
    newQueue = [];
}

function handlePlay() {
    var time = 0;
    var pos = 0;
    playing = true;

    baseTime = Date.now();

    playInterval = setInterval(function() {
        console.log("Time is " + time + " and pos is " + pos);

        if (pos >= queue.length) {
            clearInterval(playInterval);
        }

        while (pos < queue.length && queue[pos].time < time) {
            createjs.Sound.play(queue[pos].id);
            pos++;
        }
        time += 50;
    }, 50);
}

$(function() {
	console.log("initializing...");
	
	/*Dialog Creation*/
	var dialog = $("#dialog").dialog({
		autoOpen: false
	});
	
	$("#newButton").click(function() {
		console.log("open save dialog");
		$("#dialog").dialog("open");
	});
	
	/*Setup Player*/
	
	/*Load Sounds*/
	loadSounds();
	setupSynthButtons();
	
	//TODO: remove web dependencies
});

