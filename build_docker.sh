#!/usr/bin/env bash

docker build . -f ./docker/Dockerfile -t thegeektechworkshop/ebay-cli:$1 -t thegeektechworkshop/ebay-cli:latest --push --build-arg EBAY_VERSION=$1