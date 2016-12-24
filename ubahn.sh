#!/bin/bash

function ubahn() {
  OUTPUT=`./core.js $@`
  if [ $? -eq 42 ]
  then cd "$OUTPUT"
  else echo "$OUTPUT"
  fi
}

fpath=(`pwd` $fpath)
