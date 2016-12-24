#!/bin/bash

function ubahn() {
  OUTPUT=`ubahn-wrapper $@`
  if [ $? -eq 42 ]
  then cd "$OUTPUT"
  else echo "$OUTPUT"
  fi
}
