/* eslint-disable func-style */
/* eslint-disable no-unused-vars */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const util = require('util');
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const {OpenApiValidator} = require('express-openapi-validate');
const jsYaml = require('js-yaml');
const swaggerMongoose = require('payapi-swagger-mongoose');
// nevyzkousena alternativa: https://github.com/isa-group/oas-tools

// nefunguvalo:
/*
 * "express-openapi-validator": "^0.30.0",
 * "swagger-express-middleware": "^2.0.2",
 * "swagger-object-validator": "^1.2.1",
 */
/*
 *var OpenApiValidator = require('express-openapi-validator').OpenApiValidator;
 *var swaggerMiddleware = require('swagger-express-middleware');
 *var Middleware = swaggerMiddleware.Middleware
 */


const cors = require('cors');
const morgan = require('morgan');

// nastavi centralne winston loggers pro ruzne moduly a transporty
const logService = require('./services/log_services'); 
const {loggers} = require('winston');
// nacte si "default" app log
const logger = loggers.get('app')

const YAML = require('yamljs');

// routers
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const gatewayRouter = require('./routes/gatewayRouter');

const gatewayLogServicesRouter = require('./routes/gateway-log-services-api');


// shared services
const systemConfigServices = require('./system_config_services');
const SharedServicesANAT = require('./services/anat_shared_services');


// app inicialization
// eslint-disable-next-line init-declarations
let sharedServicesANAT, systemConfig


try {
    logger.info('*************************************************************')
    logger.info('Express Gateway Version 1.0.0')

    logger.info('*************************************************************')

    logger.info('Initializing common system config subsystem....')

    systemConfig = systemConfigServices().getConfig();
    if (systemConfig) {
        logger.info(`Running with system config: ${JSON.stringify(systemConfig)}`)
    } else {
        logger.error('Invalid system configuration - exiting....')
        // eslint-disable-next-line no-process-exit
        process.exit(1)
    }

    logger.info('*************************************************************************************************')
    logger.info('Initializing remote comm. client subsystem....')
    // eslint-disable-next-line new-cap
    sharedServicesANAT = SharedServicesANAT(systemConfig);
    logger.info('*************************************************************************************************')


} catch (err) {
    logger.error(err)
    // eslint-disable-next-line no-process-exit
    process.exit(1)
}

logger.info('All subsystems inicialized successfuly....')

const app = express();


app.use(morgan('dev'));
app.options('*', cors());
app.use(cors());
// support parsing of application/json type post data
app.use(bodyParser.json());
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
    extended: false
}));
// set secret variable
app.set('system_config', systemConfig);


const basicAuth = require('basic-auth');

app.set('shared_services', sharedServicesANAT);

// eslint-disable-next-line func-names
const auth = function (req, res, next) {
    const user = basicAuth(req);
    // logger.info("Running auth request with: " + JSON.stringify(user))

    if (!user || !user.name || !user.pass) {
    //  logger.info("SUCCESS on auth request with: " + JSON.stringify(user.name))
        logger.error(`${JSON.stringify({
            user: JSON.stringify(user),
            type: 'login_invalid'
        })}`)

    
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
    } else if (user.name === systemConfig.GATEWAY_ADMIN && user.pass === systemConfig.GATEWAY_PASSWORD) {
        logger.info(`${JSON.stringify({
            user: user.name,
            type: 'login_success'
        })}`)
        // sUCCEESS
        next();

    } else {
        logger.error('ERR on auth request with: ' + JSON.stringify(user))
      
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
    }
}
// validation possible on https://editor.swagger.io/
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = YAML.load('./Api.yaml');

app.all('/api-docs/*', auth);
app.use('/api-docs/v1', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.all('/api-logs/*', auth);
app.use('/api-logs/gateway', gatewayLogServicesRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.enable('case sensitive routing');
app.enable('strict routing');

/*
 * //Validator - pouziva se primo v routerech/api, zde neni potreba
 * const openApiDocument = jsYaml.safeLoad(
 * fs.readFileSync("./Api30.yaml", "utf-8")
 * );
 * const validator = new OpenApiValidator(openApiDocument);
 *
 */
/*
 *pOZOR: vsechny konfigurace pred definovanim routes !!!
 *Mapovani routes
 */
app.use('/', indexRouter);
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

    logger.error('Running global app error handler for err: ' + JSON.stringify(err));

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
        logger.error('No status code found for err. Using 500')
        res.status(500).json(errMsg).end()
    }
});


module.exports = app;

