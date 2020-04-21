# media-uploader-mean-app

## Overview
The purpsose of the media-uploader-mean-app is to provide a simple media uploading server. The application accepts upto 4 files of all image types and video types mp4, webm, and ogv. All videos are converted to the other acceptable formats before the http response for genreal browser compatibablity. 

## Install Dependencies
Install docker

## Build
### Network 
Run `docker network create -d bridge media-uploader-bridge`

### Dev
From this directory run: `docker build -t media-uploader:dev -f docker/Dockerfile.dev media-uploader-mean-app`
### Prod
From this directory run: `docker build --no-cache -t media-uploader:prod -f docker/Dockerfile.prod media-uploader-mean-app`

### No Docker
See README in `media-uploader-mean-app`

## Start MongoDB

This app depends on a MongoDB server running on the same bridge network with the resovable hostname `media-upload-db`. The easiest way to get a mongo database up and runnign is with their Docker image.
`docker run --network=media-uploader-bridge --name=media-upload-db --rm mongo:bionic`

## Development server
### Dev
Run `docker run --network=media-uploader-bridge -p 3000:3000 --rm media-uploader:dev`
### Prod
Run `docker run --network=media-uploader-bridge -p 3000:3000 --rm media-uploader:prod`

## Todo
* [ ] Make mongoDB hostname a cmd arg
* [ ] Handle async conversion response better
* [ ] Try streaming converted videos right to DB rather than saving to a file (difficult because of some mp4 files and the mov atom location)
* [ ] Try splitting ffmpeg conversion into another service

