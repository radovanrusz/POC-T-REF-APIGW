/* eslint-disable require-jsdoc */
/* eslint-disable no-prototype-builtins */
/* eslint-disable complexity */
/* eslint-disable max-statements */
/*
 * how to share singlton with other modules
 * https://codereview.stackexchange.com/questions/120331/passing-node-js-sql-connection-to-multiple-routes
 */
require('dotenv').config()
const {loggers} = require('winston');
const logger = loggers.get('config')
const moment = require('moment-timezone');
moment.locale('cs');

module.exports = function ConfigServices () {
    let vcap = {};


    function getBool (val) {
        return Boolean(JSON.parse(String(val).toLowerCase()));
    }
    // global variables
    try {
        
        if (process.env.hasOwnProperty('RUNTIME_MODE')) {

            if (process.env.RUNTIME_MODE === 'cloud') {
                logger.info('WILL TRY RUN IN DEV MODE IN IBM CLOUD')
                vcap = JSON.parse(process.env.VCAP_SERVICES);
                
            } else if (process.env.RUNTIME_MODE === 'localDev') {
                logger.info('WILL TRY RUN IN LOCAL DEV MODE')


            } else if (process.env.RUNTIME_MODE === 'container') {
                logger.info('WILL TRY RUN IN PROD MODE IN CONTAINER')

            }
        } else {
            const errMsg = 'NO SUPPORTED RUNTIME MODE FOUND'
            logger.error(errMsg)
            throw new Error(errMsg)
        }

       
        if (process.env.hasOwnProperty('RUNTIME_MODE')) {

            try {
                vcap.RUNTIME_MODE = process.env.RUNTIME_MODE;


            } catch (error) {
                logger.error('Error retrieving user defined env variable RUNTIME_MODE.');

            }
        } else {

            logger.error('No user defined evn variable RUNTIME_MODE. ');
        }


        if (process.env.hasOwnProperty('VERSION')) {

            try {
                vcap.VERSION = process.env.VERSION;


            } catch (error) {
                logger.error('Error retrieving user defined env variable VERSION.');

            }
        } else {

            logger.error('No user defined evn variable VERSION. ');
        }

        if (process.env.hasOwnProperty('CLIENT_ID')) {

            try {
                vcap.CLIENT_ID = process.env.CLIENT_ID;


            } catch (error) {
                logger.error('Error retrieving user defined env variable CLIENT_ID.');

            }
        } else {

            logger.error('No user defined evn variable CLIENT_ID. ');
        }


        // gATEWAY super admin credentials
        if (process.env.hasOwnProperty('GATEWAY_ADMIN')) {
            vcap.GATEWAY_ADMIN = process.env.GATEWAY_ADMIN;
        } else {
            logger.error('No user defined evn variable GATEWAY_ADMIN');
            throw new Error('Missing GAT configuration entry')
        }

        if (process.env.hasOwnProperty('GATEWAY_PASSWORD')) {
            vcap.GATEWAY_PASSWORD = process.env.GATEWAY_PASSWORD;
        } else {
            logger.error('No user defined evn variable GATEWAY_PASSWORD');
            throw new Error('Missing GAT configuration entry')
        }

        if (process.env.hasOwnProperty('APP_ANAT_SHOULD_USE_MOCK')) {
            vcap.APP_ANAT_SHOULD_USE_MOCK = getBool(process.env.APP_ANAT_SHOULD_USE_MOCK);
        } else {
            logger.error('No user defined evn variable APP_ANAT_SHOULD_USE_MOCK');
        }

        if (process.env.hasOwnProperty('APP_ANAT_URL')) {
            vcap.APP_ANAT_URL = process.env.APP_ANAT_URL;
        } else {
            logger.error('No user defined evn variable APP_ANAT_URL');
        }

        if (process.env.hasOwnProperty('APP_ANAT_HOST')) {
            vcap.APP_ANAT_HOST = process.env.APP_ANAT_HOST;
        } else {
            logger.error('No user defined evn variable APP_ANAT_HOST');
        }
        if (process.env.hasOwnProperty('APP_ANAT_TOKEN_EXP')) {
            vcap.APP_ANAT_TOKEN_EXP = process.env.APP_ANAT_TOKEN_EXP;
        } else {
            logger.error('No user defined evn variable APP_ANAT_TOKEN_EXP');
        }
        if (process.env.hasOwnProperty('APP_JOURNAL_URL')) {
            vcap.APP_JOURNAL_URL = process.env.APP_JOURNAL_URL;
        } else {
            logger.error('No user defined evn variable APP_JOURNAL_URL');
        }
        if (process.env.hasOwnProperty('APP_JOURNAL_POST_PATH')) {
            vcap.APP_JOURNAL_POST_PATH = process.env.APP_JOURNAL_POST_PATH;
        } else {
            logger.error('No user defined evn variable APP_JOURNAL_POST_PATH');
        }

        if (process.env.hasOwnProperty('APP_JOURNAL_GET_PATH')) {
            vcap.APP_JOURNAL_GET_PATH = process.env.APP_JOURNAL_GET_PATH;
        } else {
            logger.error('No user defined evn variable APP_JOURNAL_GET_PATH');
        }

        if (process.env.hasOwnProperty('APP_MATERIAL_URL')) {
            vcap.APP_MATERIAL_URL = process.env.APP_MATERIAL_URL;
        } else {
            logger.error('No user defined evn variable APP_MATERIAL_URL');
        }

        if (process.env.hasOwnProperty('APP_MATERIAL_POST_PATH')) {
            vcap.APP_MATERIAL_POST_PATH = process.env.APP_MATERIAL_POST_PATH;
        } else {
            logger.error('No user defined evn variable APP_MATERIAL_POST_PATH');
        }

        if (process.env.hasOwnProperty('APP_MATERIAL_GET_PATH')) {
            vcap.APP_MATERIAL_GET_PATH = process.env.APP_MATERIAL_GET_PATH;
        } else {
            logger.error('No user defined evn variable APP_MATERIAL_GET_PATH');
        }
        
        if (!vcap) {
            const err = 'No vcap created and initialized - shutting down.'
            logger.error(err)
            throw new Error(err)

        }

        logger.info('**************************************************************************************************');
        logger.info('')
        logger.info(`CONFIG READY: RUNNING IN MODE: ${vcap.RUNTIME_MODE}`);

        logger.info('**************************************************************************************************');
        logger.info('')

    } catch (error) {
        const errMsg = 'Error retrieving env variables'
        logger.error(errMsg);
        throw errMsg
    }

    const getConfig = () => vcap

    return {
        getConfig
    }


};  
