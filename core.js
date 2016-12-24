#!/usr/bin/env node

'use strict';

const commandLineCommands = require('command-line-commands')
const jsonfile            = require('jsonfile')
const sh                  = require("shelljs");

const validCommands  = [ null, 'list', 'to', 'add', 'rm', 'clear' ];
const commandAndArgs = commandLineCommands(validCommands);
const command        = commandAndArgs.command;
const args           = commandAndArgs.argv;
const userHome       = process.env.HOME || process.env.USERPROFILE;

var ubahn = {};
ubahn.package  = require('./package.json');
ubahn.version  = ubahn.package.version;
ubahn.filepath = userHome + "/.ubahnfile.json";
ubahn.stations = jsonfile.readFileSync(ubahn.filepath) || [];

if (command == "list") {
  if (ubahn.stations.length > 0) {
    ubahn.stations.map(function(station) {
      console.log(station.shortname + ": " + station.path);
    });
  } else {
    console.log("ubahn is empty");
  }

} else if (command == "add") {
  var shortname = args[0];
  var path      = args[1] || sh.pwd();

  if (shortname) {
    var station = {};
    station.shortname = shortname;
    station.path      = path;
    ubahn.stations.push(station);

    jsonfile.writeFileSync(ubahn.filepath, ubahn.stations);
    console.log("Added " + shortname)
  } else {
    console.error("You must specify a directory shortname.");
  }

} else if (command == "to") {
  var shortname = args[0];

  if (shortname) {
    if (ubahn.stations.length > 0) {
      var entry = ubahn.stations.find(function(element, index, array) {
        return element.shortname == shortname;
      });

      if (entry) {
        console.log(entry.path);
        process.exit(42);
      } else {
        console.error(shortname + " not found");
      }
    } else {
      console.error("ubahn is empty");
    }
  } else {
    console.error("You must specify a directory shortname.");
  }

} else if (command == "rm") {
  var shortname = args[0];

  if (shortname) {
    ubahn.stations = ubahn.stations.filter(function(entry) {
      return entry.shortname != shortname;
    });

    jsonfile.writeFileSync(ubahn.filepath, ubahn.stations);
    console.log("Removed " + shortname);
  } else {
    console.error("You must specify a directory shortname.");
  }

} else if (command == "clear") {
  ubahn.stations = [];
  jsonfile.writeFile(ubahn.filepath, ubahn.stations);
  console.log("Removed all stations from ubahn");
} else {
  console.log("ubahn " + ubahn.version);
  console.log("usage: ubahn <command> [<args>]\n");
  console.log("commands:\n");
  console.log("list                    List all directories saved on ubahn");
  console.log("to <shortname>          Change directory to the one specified");
  console.log("add <shortname> [path]  Add a new directory to ubahn. If path is empty, it gets the current one.");
  console.log("rm <shortname>          Remove a directory from ubahn");
  console.log("clear                   Remove all directories from ubahn");
}
