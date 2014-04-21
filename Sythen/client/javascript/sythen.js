//SYTHEN 
//Matt Roy
//CS5200
//Final Project

//This is the front end code for running the digital synthesizer. It is responsible for 
// loading the audio files and recording/playing sounds.


var queue = [],
    newQueue = [],
    baseTime,
    playInterval,
    playing = false,
    currentSongId;

 /*Initializers*///--------------------------------------------------------

 // Summary:
 //  Create the dialogs for user actions.
function createDialogs() {
    "use strict";
    var dialog, open;
    
    dialog = $("#saveDialog").dialog({
            autoOpen: false
     });
     
     open = $("#openDialog").dialog({
            autoOpen: false
     });
}

function loadSounds() {
    "use strict";
    var audioPath = "sounds/",
        manifest = [
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
    "use strict";
    
    $("#synth  .synthButton").click(handleSoundButton);
    $("#recordButton").click(handleStart);
    $("#stopButton").click(handleStop);
    $("#playButton").click(handlePlay);
}

function setupMenuButtons() {
    $("#saveButton").click(handleSaveButton);
    $("#openButton").click(handleOpenButton);
    $("#logoutButton").click(handleLogoutButton);
}

function setupDialogButtons() {
    $("#saveNewSongButton").button().click(handleSaveNewSongButton);
}

function setupComments() {
    var commentInput = $('#commentInput');
    
    commentInput.keydown(function(e) {
            
            if(e.keyCode === 13) {
                e.preventDefault();
                addNewComment(commentInput.val(), loadComments);
            }
        });
}

/*Handlers*///-------------------------------------------------------------
function handleSoundLoad(event) {
    console.log("Audio " + event.src + " was loaded.");
}

function handleSoundButton(event) {
    var id = event.target.getAttribute("data-sound-id");
    
    createjs.Sound.play(id);
    console.log("Play sound-> time: " + (Date.now() - baseTime) + " event: " + id);
    
    if(!baseTime) {
        return;
    }
    
    if (playing) {
        newQueue.push({time: (Date.now() - baseTime), id: id});
    } else {
        queue.push({time: (Date.now() - baseTime), id: id});
    }
}

function handleStart() {
    baseTime = Date.now();
    console.log("Start time is " + baseTime);
    $("#indicator").addClass("recording");
}

function handleStop() {
    console.log("stop");
    $("#indicator").removeClass("playing");
    $("#indicator").removeClass("recording");
    clearInterval(playInterval);
    playing = false;
    queue = queue.concat(newQueue);
    queue = queue.sort(function(a, b) {
        a.time < b.time ? a : b;
    });
    newQueue = [];
}

function handlePlay() {
    $("#indicator").addClass("playing");
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

function handleSaveButton() {
    console.log("save button was clicked");
    $("#saveDialog").dialog("open");
}

function handleOpenButton() {
    console.log("Open button was clicked");
    $("#openDialog").dialog("open");
}

function handleSaveNewSongButton() {
    var songName = $("#newSongNameInput").val(),
    song = {};
    
    song.name = songName;
    song.songData = queue.slice(0, queue.length - 1);
    
    $.post("./songs", song, function() {
        console.log("close save dialog");
        $("#saveDialog").dialog("close");
    });
}

function handleLogoutButton() {
    $.get("./logout", function(data) {
        console.log("data is " + JSON.stringify(data));
        window.location = "/";
    });
}

/*Comment Services*///------------------------------------------------
function addNewComment(comment, songId, callback) {
    $.post("./songs/" + songId + "/comments", comment, callback);
}

function loadComments(songId) {
    $.get("./songs/" + songId + "/comments", function(data) {
        
    });
}

/*Controllers*///---------------------------------------------------------
function openSongsController($scope, $http) {
    console.log("Open songs controller.");
    $http.get("./songs").success(function(data) {
        $scope.songs = data;
    });
    
    $scope.loadSong = function(id) {
        console.log("Attempting to open song " + id);
        for(var i = 0; i < $scope.songs.length; i++) {
            if($scope.songs[i]._id === id) {
                queue = $scope.songs[i].data;
               $scope.currentSong = $scope.songs[i];
            }
        }
    }
    
    $scope.loadComments = function(comment) {
        console.log("Loading the comments for this song.");
        $http.get("./comments/" + $scope.currentSong._id).success(function(data) {
            $scope.comments = data;
        });
    }
    
    $scope.newSong = function() {
        console.log("Switching to  a new song.");
        $scope.currentSong = {};
        $scope.currentSong.queue = [];
        $scope.currentSong.name = "New Song";
    }
}

//Run initializers
$(function() {
    console.log("Initializing app...");

    createDialogs();
    loadSounds();
    setupSynthButtons();
    setupMenuButtons();
    setupDialogButtons();
    setupComments();
    
    console.log("App Initialized.");
});

