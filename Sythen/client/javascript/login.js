//SYTHEN 
//Matt Roy
//CS5200
//Final Project

/*Login Page*/
// Post to either sign up or login pages

function login() {
    "use strict";
    var form = document.getElementById("userForm");
    
    console.log("User is attempting to login.");
    form.action = "./login";
    form.submit();
}

function signup() {
    "use strict";
    var form = document.getElementById("userForm");
    
    console.log("User is signing up.");
    form.action = "./signup";
    form.submit();
}
