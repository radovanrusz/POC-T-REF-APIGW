const {loggers} = require('winston');
const logger = loggers.get('routers')
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const jwtMiddleware = require('../jwt-express-middleware');

const path = require('path');
const fs = require('fs');
const {OpenApiValidator} = require('express-openapi-validate');
const jsYaml = require('js-yaml');


// eslint-disable-next-line no-sync
const openApiDocument = jsYaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', 'Api.yaml'), 'utf-8'));
const validator = new OpenApiValidator(openApiDocument);

/* gET home page. */
router.post('/', validator.validate('post', '/login'), async (req, res) => {
    try {
        const Services = res.app.get('shared_services');
        const SystemConfig = res.app.get('system_config');
        logger.info(`Starting login api with incoming request: ${JSON.stringify(req.body)}`)
        let result = {}

        if (SystemConfig.APP_ANAT_SHOULD_USE_MOCK) {
            logger.info('Starting Local MOCK for login&token')
            result = await Services.doLocalLoginViaTokenMock(req.body)
            
        } else {
            logger.info('Starting Remote LDAP for login&token')
            result = await Services.doRemoteLogin(req.body)
            
        }

        if (result.status === 200) {
            logger.info(`Login api done with result: ${JSON.stringify(result)}`)
            res.json(result).status(result.status).end()

        } else {
            logger.error(`Login api done with result: ${JSON.stringify(result)}`)
            res.sendStatus(result.status)

        }


    } catch (err) {
        logger.error(`Remote login api ERR: ${JSON.stringify(err)}`)
        res.sendStatus(500)
    }
});

router.get('/verify', jwtMiddleware.checkSecurityToken, validator.validate('get', '/login/verify'), (req, res) => {
    try {


        logger.info(`Token successfuly validated.Path: ${req.path}. Incoming jwt payload: ${JSON.stringify(req.jwtPayload)}`)

        res.sendStatus(200)

    } catch (err) {
        logger.error(`Remote login api ERR: ${JSON.stringify(err)}`)
        res.sendStatus(500)
    }
});


module.exports = router;
