# media-uploader-mean-app

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.7.

## Overview
The purpsose of the media-uploader-mean-app is to provide a simple media uploading server. The application accepts upto 4 files of all image types and video types mp4, webm, and ogv. All videos are converted to the other acceptable formats before the http response for genreal browser compatibablity. 

## Install Dependencies
Install nodejs for your distro

Install ffmpeg for your distro

Run `npm install` to download the necessary node dependencies for building and runnign this app. 

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Start MongoDB

This app depends on a MongoDB server running on othe default network with the resovable host name: `localhost`. The easiest way to get a mongo database up and runnign is with their Docker image.

Must change route to localhost in `server/route/api.js`

`docker run -p 27017:27017 --rm mongo:bionic`

## Development server

Run `node server` for a dev server. Navigate to `http://localhost:3000/`. 

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
