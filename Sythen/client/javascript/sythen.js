//SYTHEN 
//Matt Roy
//CS5200
//Final Project

//This is the front end code for running the digital synthesizer. It is responsible for 
// loading the audio files and recording/playing sounds.




 /*Initializers*///--------------------------------------------------------

 // Summary:
 //  Create the dialogs for user actions.
function createDialogs() {
    $("#saveDialog").dialog({
            autoOpen: false
     });
     
     $("#openDialog").dialog({
            autoOpen: false
     });
     
     $("#profileDialog").dialog({
        autoOpen: false
    });
}

function loadSounds() {
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


function setupMenuButtons() {
    $("#saveButton").click(handleSaveButton);
    $("#openButton").click(handleOpenButton);
    $("#logoutButton").click(handleLogoutButton);
    $("#avatarImage").click(handleProfileClick);
}

function setupDialogButtons() {
    $("#saveNewSongButton").button().click(handleSaveNewSongButton);
}


/*Handlers*///-------------------------------------------------------------
function handleSoundLoad(event) {
    console.log("Audio " + event.src + " was loaded.");
}

function handleSaveButton() {
    console.log("save button was clicked");
    $("#saveDialog").dialog("open");
}

function handleOpenButton() {
    console.log("Open button was clicked");
    $("#openDialog").dialog("open");
}

function handleProfileClick() {
    $("#profileDialog").dialog("open");
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


/*Controllers*///---------------------------------------------------------
function openSongsController($scope, $http) {
    console.log("Open songs controller.");
    $http.get("./songs").success(function(data) {
        $scope.songs = data;
    });

    
    /*Loading*/
    $scope.loadSong = function(id) {
        console.log("Attempting to open song " + id);
        for(var i = 0; i < $scope.songs.length; i++) {
            if($scope.songs[i]._id === id) {
                queue = $scope.songs[i].data;
               $scope.currentSong = $scope.songs[i];
               $scope.loadComments();
            }
        }
    };
    
    $scope.loadComments = function(comment) {
        console.log("Loading the comments for this song.");
        $http.get("./comments/" + $scope.currentSong._id).success(function(data) {
            $scope.comments = data;
        });
    };
    
    $scope.loadUser = function() {
        console.log("Get current user.");
        $http.get("./currentUser").success(function(data) {
            $scope.currentUser = data;
        });
    };
    
    $scope.newSong = function() {
        console.log("Switching to  a new song.");
        $scope.currentSong = {};
        $scope.currentSong.queue = [];
        $scope.currentSong.name = "New Song";
        $scope.comments = [];
    };
    
    /*Comments*/
    $scope.leaveComment = function() {
        var comment = {};
        
        if(!$scope.currentSong._id) {
            return;
        }
        console.log("Adding comment.");
        
        comment.user = $scope.currentUser.username;
        comment.comment =  $scope.commentInput;
        comment.song = $scope.currentSong._id;
        $http.post("./comments", comment).success(function() {
            $scope.commentInput = "";
            $scope.loadComments();
        });
    };
    
    $scope.handleSythnButton = function(id) {
        var queue = [];
        
        createjs.Sound.play(id);
        console.log("Play sound-> time: " + (Date.now() - $scope.baseTime) + " event: " + id);
        
        if(!$scope.baseTime) {
            return;
        }
        
        if ($scope.playerState === "recording") {
            $scope.newQueue.push({time: (Date.now() - $scope.baseTime), id: id});
        }
    };
    
    $scope.handleRecordButton = function() {
        var time = 0, pos = 0;
            
        $scope.currentSong.queue = $scope.currentSong.queue.sort(function(a, b) { return a.time - b.time});
        
        console.log("Starting to record.");
        $scope.baseTime = Date.now();
        $scope.playerState = "recording";
        $scope.newQueue = [];
        
        $scope.playInterval = setInterval(function() {
        console.log("Time is " + time + " and pos is " + pos);

            if (pos >= $scope.currentSong.queue.length) {
                clearInterval($scope.playInterval);
                return;
            }

            while (pos < $scope.currentSong.queue.length && $scope.currentSong.queue[pos].time < time) {
                createjs.Sound.play($scope.currentSong.queue[pos].id);
                pos++;
            }
            time += 50;
        }, 50);
    };
    
    $scope.handleStopButton = function() {
        console.log("Stopping the player.");
        $scope.baseTime = null;
        clearInterval($scope.playInterval);
        $scope.playerState = "stopped";
        $scope.currentSong.queue = $scope.currentSong.queue.concat($scope.newQueue);
        $scope.currentSong.queue = $scope.currentSong.queue.sort(function(a, b) {
            return a.time - b.time;
        });
        $scope.newQueue = [];
    };
    
    $scope.handlePlayButton = function() {
        var time = 0, pos = 0;
        
        $scope.currentSong.queue = $scope.currentSong.queue.sort(function(a, b) { return a.time - b.time});
        
        $scope.playerState = "playing";
        $scope.baseTime = Date.now();

        $scope.playInterval = setInterval(function() {
        console.log("Time is " + time + " and pos is " + pos);

            if (pos >= $scope.currentSong.queue.length) {
                clearInterval($scope.playInterval);
                $scope.baseTime = null;
                $scope.playerState = "stopped";
                return;
            }

            while (pos < $scope.currentSong.queue.length && $scope.currentSong.queue[pos].time < time) {
                createjs.Sound.play($scope.currentSong.queue[pos].id);
                pos++;
            }
            time += 50;
        }, 50);
    };
    
    /*INIT*/
    $scope.loadUser();
    $scope.newSong();
}

//Run initializers
$(function() {
    console.log("Initializing app...");

    createDialogs();
    loadSounds();
    setupMenuButtons();
    setupDialogButtons();
    
    console.log("App Initialized.");
});

