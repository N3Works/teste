<div align="center">

![kiina](http://kiina.ai/wp-content/uploads/2018/06/kiina-default-logo.png)

[![node](https://img.shields.io/badge/node->=8-success.svg)](https://nodejs.org/en/)
[![eslint](https://img.shields.io/badge/eslint-^6.6.0-blueviolet.svg)](https://eslint.org/)
[![@google-cloud/pubsub](https://img.shields.io/badge/@googleCloud/pubsub-^0.28.1-yellow.svg)](https://github.com/googleapis/nodejs-pubsub)
[![firebase-admin](https://img.shields.io/badge/firebaseAdmin-~7.0.0-yellow.svg)](https://github.com/firebase/firebase-functions)
[![firebase-functions](https://img.shields.io/badge/firebaseFunctions-^2.2.0-yellow.svg)](https://github.com/firebase/firebase-functions)
[![jest](https://img.shields.io/badge/jest-^24.9.0-success.svg)](https://jestjs.io/docs/en/getting-started)

# Sls-firebase-nodejs
</div>

## Description
This boilerplate contains the base to create a function serverless. All code should have the tests pass correctly.

## Structure of project

- **docs** - Documentation of project.
- **example** - This folder contains all the files of project.
  - **example.js** - This file is example function http what return id to the user.
  - **example-pubsub.js** - This file is example function pubsub what call next function.
- **specs** - This folder contains the tests of your code
- **utils** - Contain some files necessary of the application.
  - **events.js** - This file contains the events triggers of function pubsub.
  - **events.json** - This file contains the configuration of each trigger of function pubsub.
  - **firestore.js** - This class of firestoreapi contain only function what return the configuration of a project specific of firestore.
  - **index.js** - exports all file in one single file.
- **.editorconfig** - This file that standardizes some settings for the editor in different environments.
- **eslintrc.js** - This file that standardizes all the code.
- **.firebaserc** - file of configuration environment of firebase.
- **.gitignore** - files/folder to be ignored when uploading the package to gitlab.
- **.prettierrc** - format the files
- **firebase.json** - contain only the files the be ignore.
- **index.js** - This file starts your application, in him contain the code of a function http and a function pubsub and configuration of database/firestore.
- **package-lock.json** - This file describes the exact tree that was generated, such that subsequent installs are able to generate identical trees, regardless of intermediate dependency updates.
- **package.json** - This file has the necessary settings for publishing the package in NPM.
- **README.md** - Documentation of project.
- **SUMMARY.md** -  Documentation of project.

## Deploy of application in the environment of developer
Before verify if you have configured the firebase in your environment.

Now you must choose what configuration you want to use:

if have environment developer:

```❯ firebase use staging ```

or of production:

```❯ firebase use production ```

After setting what environment choice, only run of command below:

```❯ npm run deploy ```

when show this message: *? Would you like to proceed with deletion? Selecting no will continue the rest of the deployments. (y/N)* , write **N**.

Wait to finish the deployment.
