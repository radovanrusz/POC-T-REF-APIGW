/* eslint-disable max-lines */
/* eslint-disable multiline-comment-style */
/* eslint-disable dot-location */
/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
const {loggers} = require('winston');
const logger = loggers.get('shared-services-client')
const axios = require('axios');
const fs = require('fs');
const jwt = require('jsonwebtoken');

let systemConfig = {}
const allowedCredentials = require('../mockData/allowedCredentials.json');

logger.info(`allowedCredentials inicialized with: ${JSON.stringify(allowedCredentials)}`)

let privateKey = null;
fs.readFile('./keys/mykey.pem', 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    privateKey = data;
    logger.info(`private key inicialized with: ${privateKey}`)

});

let publicKey = null;
fs.readFile('./keys/mykey.pub', 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    publicKey = data;
    logger.info(`public key inicialized with: ${JSON.stringify(publicKey)}`)

});

// eslint-disable-next-line space-before-function-paren
module.exports = function SharedServicesANAT(sConfig) {
    systemConfig = sConfig


    const doRemoteLogin = async (data) => {


        const promise = new Promise((resolve) => {

            const url = systemConfig.APP_ANAT_URL
            if (data) {
                const data2 = {
                    clientId: systemConfig.CLIENT_ID,
                    uid: data.name,
                    password: data.password

                }

                logger.info(`About to start remote login request: ${JSON.stringify(data2)} using server url: ${url}`)

                axios.post(
                    url,
                    data2,
                    {
                        headers: {
                            'Content-Type': 'application/json'

                        },
                        timeout: 5000
                    }
                ).then((res) => {

                    logger.info(`Remote login, token successfuly generated: ${JSON.stringify(res.data)}`)
                    const res2 = {
                        status: 202,
                        statusCase: 'ok',
                        msg: 'authentication done',
                        id: res.data.id,
                        name: res.data.name,
                        email: res.data.email,
                        role: res.data.roles,
                        token: res.data.token
                    }
                    logger.info(`Local mock login, response successfuly generated: ${JSON.stringify(res2)}`)
                    resolve(res2)
                }).catch((error) => {
                    logger.error(`Remote login error: ${JSON.stringify(error)}`)
                    let errMsg = ''
                    if (error.message) {
                        errMsg = `Remote login error: ${error.message}`

                    } else {
                        errMsg = `No response from server for request ${JSON.stringify(data)}. Check its availability. Axios error code: ${error.response.data} ${error.response.status}`
                    }

                    logger.error(errMsg)
                    const res = {
                        status: 502,
                        statusCase: 'err',
                        msg: errMsg
                    }
                    resolve(res)

                });

            } else {
                const errMsg = `No data or security header provided for a remote login request ${JSON.stringify(data)}`
                logger.error(errMsg)
                const res = {
                    status: 400,
                    statusCase: 'err',
                    msg: errMsg
                }
                resolve(res)

            }
        })

        const result = await promise


        return result


    }

    const selectServiceToCall = (req) => {
        try {
            logger.info(`Trying to select service based on incoming req: ${req.path}`)

            /* tbd - for multi part path ?
            const tempAR = req.path.split('/')
            const reqPathAR = tempAR.filter((item) => {
                if (item.length > 0) {
                    return true
                }

                return false

            })

            logger.info(`Running service selection for ${reqPathAR}`)
            */

            let url = ''
            if (req.method === 'POST') {
                if (req.path.includes('wmj')) {
                    url = systemConfig.APP_JOURNAL_URL + systemConfig.APP_JOURNAL_POST_PATH

                } else if (req.path.includes('mms')) {
                    url = systemConfig.APP_MATERIAL_URL + systemConfig.APP_MATERIAL_POST_PATH

                } else {
                    return 501
                }
            } else if (req.method === 'GET') {
                if (req.path.includes('wmj')) {
                    url = systemConfig.APP_JOURNAL_URL + systemConfig.APP_JOURNAL_GET_PATH

                } else if (req.path.includes('mms')) {
                    url = systemConfig.APP_MATERIAL_URL + systemConfig.APP_MATERIAL_GET_PATH

                } else {
                    return 501
                }

                if (req.originalUrl.includes('?')) {
                    const tempAR = req.originalUrl.split('?')
                    const [, tempQuery] = tempAR
                    url += `?${tempQuery}`

                }
            } else {
                return 501
            }

            logger.info(`Selected service: ${url}`)

            return url
        } catch (err) {
            logger.error(`Remote service selection failed on err: ${err}`)

            return 400
        }


    }

    const doRemoteRequest = async (req) => {

        const promise = new Promise((resolve, reject) => {

            if (req) {
                const remoteUrl = selectServiceToCall(req)
                if (isNaN(remoteUrl)) {
                    logger.info(`About to call  remote server url: ${remoteUrl}`)
                    axios({
                        method: req.method,
                        url: remoteUrl,
                        timeout: 5000,
                        responseType: 'application/json',
                        headers: {
                            'Content-Type': 'application/json'

                        }
                    })
                        .then((res) => {
                            //  logger.info(res.data);
                            resolve(res.data)
                        }).
                        catch((error) => {
                           
                            logger.error(`Remote service call failed with error: ${error.message}`)
                            
                            let errMsg = ''
                            if (error.response && error.response.status) {

                                errMsg = `No response from server for request. Check its availability. Axios error code: ${error.response.status}`
                                logger.error(errMsg)
                                reject(error.response.status)
                            } else {
                                
                                // eslint-disable-next-line prefer-promise-reject-errors
                                reject(503)
                            }
                            
                        });
                } else {
                    logger.error(`Invalid, unsupported or unimplemented service requested. Http status: ${remoteUrl}`)

                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject(501)
                }

            } else {
                const errMsg = 'No data provided for a remote service call'
                logger.error(errMsg)
                reject(new Error(errMsg))

            }
        })

        const result = await promise


        return result


    }

    const doLocalLoginViaTokenMock = async (data) => {


        const promise = new Promise((resolve) => {


            if (Boolean(data) && Boolean(data.name) && Boolean(data.password)) {
                logger.info(`About to start local mock login request: ${JSON.stringify(data)}`)

                // filtr proti allowedCreds
                const validatedCred = allowedCredentials.filter((item) => {
                    if (item.name === data.name && item.password === data.password) {
                        return true
                    }

                    return false

                })

                if (validatedCred.length === 1) {
                    logger.info(`Local mock login successful for user: ${JSON.stringify(validatedCred[0])} -> going to generate jwt`)
                    try {
                        const signOptions = {
                            issuer: systemConfig.APP_ANAT_HOST,
                            subject: validatedCred[0].email || 'anonymous-user',
                            expiresIn: systemConfig.APP_ANAT_TOKEN_EXP,
                            algorithm: 'RS256'
                        };
                        if (!privateKey) {
                            throw new Error('Private key not loaded');
                        }
                        const payload = {
                            roles: []
                        }
                        if (Array.isArray(validatedCred[0].role)) {
                            payload.roles = validatedCred[0].role
                        } else {
                            payload.roles.push(validatedCred[0].role)
                        }
                        logger.info(`Local mock login, about to create token with signoptions: ${JSON.stringify(signOptions)}`)
                        const token = jwt.sign(payload, privateKey, signOptions);

                        logger.info(`Local mock login, token successfuly generated: ${JSON.stringify(token)}`)
                        const res = {
                            status: 200,
                            statusCase: 'ok',
                            msg: 'authentication done',
                            id: validatedCred[0].id,
                            name: validatedCred[0].name,
                            email: validatedCred[0].email,
                            role: payload.roles,
                            token
                        }
                        logger.info(`Local mock login, response successfuly generated: ${JSON.stringify(res)}`)
                        resolve(res)
                    } catch (err) {
                        const errMsg = `Unexpected err: "${err}" during login request ${JSON.stringify(data)}.`
                        logger.error(errMsg)
                        const res = {
                            status: 403,
                            statusCase: 'err',
                            msg: 'authentication failed'
                        }
                        resolve(res)
                    }
                } else {

                    const errMsg = `ERR: Unknown user, request ${JSON.stringify(data)}.`
                    logger.error(errMsg)
                    const res = {
                        status: 403,
                        statusCase: 'err',
                        msg: 'authentication failed'
                    }
                    resolve(res)

                }

            } else {
                const errMsg = `Invalid or no data provided for a local mock login request ${JSON.stringify(data)}`
                logger.error(errMsg)
                const res = {
                    status: 400,
                    statusCase: 'err',
                    msg: errMsg
                }
                resolve(res)

            }
        })

        const result = await promise


        return result

    }

    /*
        not implemented
    */
    const doLocalMockRequest = async (req) => {
        logger.info(`Running doLocalMockRequest with incoming req: ${JSON.stringify(req.jwtPayload)} and route: ${req.path}`)


        const promise = new Promise((resolve, reject) => {

            if (req.path) {
                let url = ''
                try {
                    url = selectServiceToCall(req)
                } catch (errMsg) {
                    logger.error(errMsg)
                    const res = {
                        status: 404,
                        statusCase: 'err',
                        msg: errMsg
                    }
                    resolve(res)
                }
                if (req.method === 'GET') {
                    axios.get(
                        url,

                        {
                            headers: {
                                'Content-Type': 'application/json'

                            }
                        }
                    ).then((res) => {
                        //  logger.info(res.data);
                        resolve(res.data)
                    }).catch((error) => {
                        let errMsg = ''
                        if (error.response) {

                            /*
                             * request made and server responded
                             *console.log(error.response.data);
                             *console.log(error.response.status);
                             */
                            errMsg = `No response from server for request ${JSON.stringify(error)}. Check its availability. Axios error code: ${error.response.data} ${error.response.status}`
                            logger.error(errMsg)
                        } else if (error.request) {
                            // the request was made but no response was received
                            errMsg = `postDailyUsageStatusData request err: ${JSON.stringify(error.message)}`
                            logger.error(errMsg)

                        } else {
                            // something happened in setting up the request that triggered an Error
                            errMsg = 'postDailyUsageStatusData other error: JSON.stringify(error.message)'
                            logger.error(errMsg)
                        }
                        reject(new Error(errMsg))

                    });
                }
            } else {
                const errMsg = 'No path found in request'
                logger.error(errMsg)
                reject(new Error(errMsg))

            }
        })

        const result = await promise


        return result


    }

    return {
        doRemoteLogin,
        doRemoteRequest,
        doLocalLoginViaTokenMock,
        doLocalMockRequest
    }
};
