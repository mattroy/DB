SYTHEN
==
This is a MEAN stack webapp built for the final project of a Database class. The purpose of the project was to learn node.js, mongodb, and angular.js. As such I am probably not using the best practices of any of them.

RUNNING
==
The app expects a mongodb instance to be running and specified in the config.js file. 

Before starting the app you will need to install the node packages, run the command

npm --install

In order to start the app, run the command 

node server.js 

APP
==
Point your browser at localhost:3000, the index page allows you to sign up or login.


FILES
==
server.js - main script, mostly config for express, not much going on here.
routing.js - Configures the routes, all service end points are located in here.
passport_config.js - configuration for using passport to authenticate users.
schema/* - three schema files used for mongoose
client - all the client side code, pages, images, sounds and css.
