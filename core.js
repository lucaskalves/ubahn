#!/usr/bin/env node

'use strict';

const commandLineCommands = require('command-line-commands')
const jsonfile = require('jsonfile')
const sh = require("shelljs");

function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}

const ubahnFilePath = getUserHome() + "/.ubahnfile.json";

const validCommands = [ null, 'list', 'goto', 'add', 'rm' ];
const commandAndArgs = commandLineCommands(validCommands);
const command = commandAndArgs.command;
const args = commandAndArgs.argv;


var ubahn = {};
ubahn.package = require('./package.json');
ubahn.version = ubahn.package.version;

if(command == "list") {

  jsonfile.readFile(ubahnFilePath, function(err, obj) {
    if (obj && obj.length > 0) {
      obj.map(function(entry) {
        console.log(entry.shortname + ": " + entry.path);
      });
    } else {
      console.log("ubahn is empty");
    }
  });

} else if (command == "add") {
  var shortname = args[0];
  var path = args[1];

  if(!path) {
    path = sh.pwd();
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
            console.error(err);
          } else {
            console.log("Added " + shortname + " to ubahn")
}
        });
    });
  } else {
    console.log("You must specify a directory shortname.");
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
          console.log(entry.path);
          process.exit(42);
        } else {
          console.log(shortname + " not found");
        }
      } else {
        console.log("ubahn is empty");
      }
    });
  } else {
    console.log("You must specify a directory shortname.");
  }


} else if (command == "rm") {
  var shortname = args[0];

  if(shortname) {
    jsonfile.readFile(ubahnFilePath, function(err, obj) {
      if (!obj) {
        obj = [];
      }

      obj = obj.filter(function(entry) {
        return entry.shortname != shortname;
      });

      jsonfile.writeFile(ubahnFilePath, obj, function (err) {
        if(err) {
          console.error(err);
        } else {
          console.log("Removed " + shortname + " from ubahn")
        }
      });
    });
  } else {
    console.log("You must specify a directory shortname.");
  }

} else {
  console.log("ubahn " + ubahn.version);
}
