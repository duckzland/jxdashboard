#!/bin/bash

export JX_DEV="production"

webpack -p && ./node_modules/.bin/electron .


