#!/bin/bash

export JX_DEV="development"
./node_modules/.bin/electron . &
webpack --watch


