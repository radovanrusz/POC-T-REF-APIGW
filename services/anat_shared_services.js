/* eslint-disable max-lines */
/* eslint-disable multiline-comment-style */
/* eslint-disable dot-location */
/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
const axios = require('axios');
const fs = require('fs');
const jwt = require('jsonwebtoken');

let systemConfig = {}
const allowedCredentials = require('../mockData/allowedCredentials.json');

console.log(`allowedCredentials inicialized with: ${JSON.stringify(allowedCredentials)}`)

let publicKey = null;
fs.readFile('./keys/mykey.pub', 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    publicKey = data;
    console.log(`public key inicialized with: ${JSON.stringify(publicKey)}`)

});

let privateKey = null;
fs.readFile('./keys/mykey.pem', 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    privateKey = data;
    console.log(`private key inicialized with: ${JSON.stringify(privateKey)}`)

});

// eslint-disable-next-line space-before-function-paren
module.exports = function SharedServicesANAT(sConfig) {
    systemConfig = sConfig


    const doRemoteLogin = async (data) => {

        /*
        Realizuje vzdalene volani na Anat sluzbu pro ziskani JWT tokenu    
        
        Bude implementovano TZ podle BoxNote dokumentace pro APIGW a ANAT sluzbu
        */
        return {}


    }

    const selectServiceToCall = (req) => {
        try {
            console.log(`Trying to select service based on incoming req: ${req.path}`)

            let url = ''
            if (req.method === 'PUT') {
                if (req.path.includes('wmj')) {
                    return 501

                } else if (req.path.includes('mms')) {
                    url = systemConfig.APP_MATERIAL_URL + systemConfig.APP_MATERIAL_PUT_PATH

                } else {
                    return 501
                }
            } else if (req.method === 'GET') {
                if (req.path.includes('wmj')) {
                    url = systemConfig.APP_JOURNAL_URL + systemConfig.APP_JOURNAL_GET_PATH

                } else if (req.path.includes('mms')) {
                    url = systemConfig.APP_MATERIAL_URL + systemConfig.APP_MATERIAL_GET_PATH

                } else if (req.path.includes('coco')) {
                    url = systemConfig.APP_COCO_URL + systemConfig.APP_COCO_GET_PATH

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

            console.log(`Selected service: ${url}`)

            return url
        } catch (err) {
            console.error(`Remote service selection failed on err: ${err}`)

            return 400
        }


    }

    const doRemoteRequest = async (req) => {

        const promise = new Promise((resolve, reject) => {

            if (req) {
                const remoteUrl = selectServiceToCall(req)
                if (isNaN(remoteUrl)) {
                    console.log(`About to call  remote server url: ${remoteUrl}`)
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
                            //  console.log(res.data);
                            resolve(res.data)
                        }).
                        catch((error) => {
                           
                            console.error(`Remote service call failed with error: ${error.message}`)
                            
                            let errMsg = ''
                            if (error.response && error.response.status) {

                                errMsg = `No response from server for request. Check its availability. Axios error code: ${error.response.status}`
                                console.error(errMsg)
                                reject(error.response.status)
                            } else {
                                
                                // eslint-disable-next-line prefer-promise-reject-errors
                                reject(503)
                            }
                            
                        });
                } else {
                    console.error(`Invalid, unsupported or unimplemented service requested. Http status: ${remoteUrl}`)

                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject(501)
                }

            } else {
                const errMsg = 'No data provided for a remote service call'
                console.error(errMsg)
                reject(new Error(errMsg))

            }
        })

        const result = await promise


        return result


    }

    const doLocalLoginViaTokenMock = async (data) => {


        const promise = new Promise((resolve) => {


            if (Boolean(data) && Boolean(data.name) && Boolean(data.password)) {
                console.log(`About to start local mock login request: ${JSON.stringify(data)}`)

                // filtr proti allowedCreds
                const validatedCred = allowedCredentials.filter((item) => {
                    if (item.name === data.name && item.password === data.password) {
                        return true
                    }

                    return false

                })

                if (validatedCred.length === 1) {
                    console.log(`Local mock login successful for user: ${JSON.stringify(validatedCred[0])} -> going to generate jwt`)
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
                        console.log(`Local mock login, about to create token with signoptions: ${JSON.stringify(signOptions)}`)
                        const token = jwt.sign(payload, privateKey, signOptions);

                        console.log(`Local mock login, token successfuly generated: ${JSON.stringify(token)}`)
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
                        console.log(`Local mock login, response successfuly generated: ${JSON.stringify(res)}`)
                        resolve(res)
                    } catch (err) {
                        const errMsg = `Unexpected err: "${err}" during login request ${JSON.stringify(data)}.`
                        console.error(errMsg)
                        const res = {
                            status: 403,
                            statusCase: 'err',
                            msg: 'authentication failed'
                        }
                        resolve(res)
                    }
                } else {

                    const errMsg = `ERR: Unknown user, request ${JSON.stringify(data)}.`
                    console.error(errMsg)
                    const res = {
                        status: 403,
                        statusCase: 'err',
                        msg: 'authentication failed'
                    }
                    resolve(res)

                }

            } else {
                const errMsg = `Invalid or no data provided for a local mock login request ${JSON.stringify(data)}`
                console.error(errMsg)
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


    return {
        doRemoteLogin,
        doRemoteRequest,
        doLocalLoginViaTokenMock
    }
};
