#!/usr/bin/env node

'use strict';

const commandLineCommands = require('command-line-commands')
const jsonfile = require('jsonfile')
const sh = require("shelljs");

function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}

const validCommands = [ null, 'list', 'goto', 'add', 'rm', 'clear' ];
const commandAndArgs = commandLineCommands(validCommands);
const command = commandAndArgs.command;
const args = commandAndArgs.argv;


var ubahn = {};
ubahn.package  = require('./package.json');
ubahn.version  = ubahn.package.version;
ubahn.filepath = getUserHome() + "/.ubahnfile.json";


if(command == "list") {

  jsonfile.readFile(ubahn.filepath, function(err, obj) {
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
    jsonfile.readFile(ubahn.filepath, function(err, obj) {
      if (!obj) {
        obj = [];
      }
        var entry = {};
        entry.shortname = shortname;
        entry.path = path;
        obj.push(entry);

        jsonfile.writeFile(ubahn.filepath, obj, function (err) {
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
    jsonfile.readFile(ubahn.filepath, function(err, obj) {
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
    jsonfile.readFile(ubahn.filepath, function(err, obj) {
      if (!obj) {
        obj = [];
      }

      obj = obj.filter(function(entry) {
        return entry.shortname != shortname;
      });

      jsonfile.writeFile(ubahn.filepath, obj, function (err) {
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

} else if(command == "clear") {
  jsonfile.writeFile(ubahn.filepath, [], function (err) {
    if(err) {
      console.error(err);
    } else {
      console.log("Removed all stations from ubahn");
    }
  });
} else {
  console.log("ubahn " + ubahn.version);
  console.log("usage: ubahn <command> [<args>]\n");
  console.log("commands:\n");
  console.log("list                   List all directories saved on ubahn");
  console.log("goto <shortname>       Change directory to the one specified");
  console.log("add <shortname> [path] Add a new directory to ubahn. If path is empty, it gets the current one.");
  console.log("rm <shortname>         Remove a directory from ubahn");
  console.log("clear                  Remove all directories from ubahn");
}
