#!/bin/bash

export JX_DEV="production"
export NODE_ENV="production"

webpack -p && ./node_modules/.bin/electron .


