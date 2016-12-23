#!/usr/bin/env node

'use strict';

const commandLineCommands = require('command-line-commands')
var jsonfile = require('jsonfile')

const ubahnFilePath = "./ubahnfile.json";

const validCommands = [ null, 'list', 'goto', 'add', 'remove' ];
const commandAndArgs = commandLineCommands(validCommands);
const command = commandAndArgs.command;
const args = commandAndArgs.argv;


var ubahn = {};
ubahn.package = require('./package.json');
ubahn.version = ubahn.package.version;

if(command == "list") {

  jsonfile.readFile(ubahnFilePath, function(err, obj) {
    if (obj) {
      obj.map(function(entry) {
        console.log("echo " + entry.shortname + ": " + entry.path);
      });
    } else {
      console.log("echo ubahn is empty");
    }
  });

} else if (command == "add") {
  var shortname = args[0];
  var path = args[1];

  if(!path) {
    path = __dirname;
  }

  if(shortname) {
    jsonfile.readFile(ubahnFilePath, function(err, obj) {
      if (!obj) {
        obj = [];
      }
        var entry = {};
        entry.shortname = shortname;
        entry.path = path;
        obj.push(entry);

        jsonfile.writeFile(ubahnFilePath, obj, function (err) {
          if(err) {
            console.error("echo " + err);
          }
        });
    });
  } else {
    console.log("echo You must specify a directory shortname.");
  }

} else if (command == "goto") {
  var shortname = args[0];

  if(shortname) {
    jsonfile.readFile(ubahnFilePath, function(err, obj) {
      if (obj) {
        var entry = obj.find(function(element, index, array) {
          return element.shortname == shortname;
        });

        if(entry) {
          console.log("cd " + entry.path);
        } else {
          console.log("echo " + shortname + " not found");
        }
      } else {
        console.log("echo ubahn is empty");
      }
    });
  } else {
    console.log("echo You must specify a directory shortname.");
  }


} else if (command == "remove") {

} else {
  console.log("echo ubahn " + ubahn.version);
}
