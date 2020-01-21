/* eslint-disable func-style */
/* eslint-disable no-unused-vars */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const util = require('util');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const {OpenApiValidator} = require('express-openapi-validate');

const cors = require('cors');
const loginRouter = require('./routes/login');
const gatewayRouter = require('./routes/gatewayRouter');

// shared services
const systemConfigServices = require('./system_config_services');
const SharedServicesANAT = require('./services/anat_shared_services');


// app inicialization
// eslint-disable-next-line init-declarations
let sharedServicesANAT, systemConfig


try {
    console.log('*************************************************************')
    console.log('Express Gateway Version 1.0.0')

    console.log('*************************************************************')

    console.log('Initializing common system config subsystem....')

    systemConfig = systemConfigServices().getConfig();
    if (systemConfig) {
        console.log(`Running with system config: ${JSON.stringify(systemConfig)}`)
    } else {
        console.error('Invalid system configuration - exiting....')
        // eslint-disable-next-line no-process-exit
        process.exit(1)
    }

    console.log('*************************************************************************************************')
    console.log('Initializing remote comm. client subsystem....')
    // eslint-disable-next-line new-cap
    sharedServicesANAT = SharedServicesANAT(systemConfig);
    console.log('*************************************************************************************************')


} catch (err) {
    console.error(err)
    // eslint-disable-next-line no-process-exit
    process.exit(1)
}

console.log('All subsystems inicialized successfuly....')

const app = express();

app.options('*', cors());
app.use(cors());
// support parsing of application/json type post data
app.use(bodyParser.json());
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
    extended: false
}));

app.set('system_config', systemConfig);

app.set('shared_services', sharedServicesANAT);

app.enable('case sensitive routing');
app.enable('strict routing');

app.use('/login', loginRouter);
app.use('/gateway', gatewayRouter);
// catch 404 and forward to error handler

app.use((req, res, next) => {
    next(createError(404));
});


/*
 * error handler
 *https://expressjs.com/en/guide/error-handling.html
 *https://www.restapitutorial.com/httpstatuscodes.html
 */

app.use((err, req, res, next) => {

    console.error('Running global app error handler for err: ' + JSON.stringify(err));

    let errMsg = ''

    if (err.message) {
        errMsg = err.message
    } else if (err.errMsg) {
        // eslint-disable-next-line prefer-destructuring
        errMsg = err.errMsg
    } else {
        errMsg = err
    }


    if (err.code) {
        res.status(err.code).json(errMsg).end()

    } else if (err.statusCode) {
        res.status(err.statusCode).json(errMsg).end()

    } else if (err.status) {
        res.status(err.status).json(errMsg).end()

    } else {
        console.error('No status code found for err. Using 500')
        res.status(500).json(errMsg).end()
    }
});


module.exports = app;

