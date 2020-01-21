/* eslint-disable no-shadow */
/* eslint-disable init-declarations */
/* eslint-disable indent-legacy */
/* eslint-disable indent */
/* eslint-disable max-lines-per-function */
/* eslint-disable multiline-comment-style */
/*
https://scotch.io/tutorials/the-anatomy-of-a-json-web-token

*/

const os = require('os');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const {loggers} = require('winston');
const logger = loggers.get('security')
const moment = require('moment-timezone');


let publicKey = null;
fs.readFile('./keys/mykey.pub', 'utf8', (err, data) => {
	if (err) {
		throw err;
	}
	publicKey = data;
});

// zakladni validace pro vsechny
const checkCoreToken = async (req, res) => {
	logger.info(`Incoming request ${JSON.stringify(req.headers)}`)
	const tempPromise = new Promise((resolve) => {
		const SystemConfig = res.app.get('system_config');

		if (req.headers['ibm-sec-token']) {
			const token = req.headers['ibm-sec-token']


			try {
				jwt.verify(token, publicKey, (err, payload) => {
					if (err) {
						logger.error(`JWT verification error: ${JSON.stringify(err)}`)
						let errMsg
						if (Boolean(err.name) && err.name === 'TokenExpiredError') {
							errMsg = 'Expired jwt token payload'

						} else {
							errMsg = 'Invalid security admin jwt token'
							if (err.message) {
								errMsg += `.Err: ${err.message}`

							}
						}
						logger.error(errMsg)
						resolve({
							code: 403,
							message: errMsg
						})

					} else {

						logger.info('Incoming token successfuly decrypted: ' + JSON.stringify(payload))

						try {
							logger.info('Validation starting for incoming jwt token payload: ' + JSON.stringify(payload))
							logger.info('JWT was issued: ' + moment(payload.iat * 1000).toISOString())
							logger.info('JWT will expire: ' + moment(payload.exp * 1000).toISOString())
							logger.info('Current time to compare with exp: ' + moment().toISOString())

							if (SystemConfig.APP_ANAT_HOST !== payload.iss) {

								logger.error(`Invalid jwt token iss. Incoming: ${payload.iss}, expected: ${os.hostname()}`)
								resolve({
									code: 403,
									message: 'Invalid jwt token'
								});
							}

						} catch (error) {
							const errMsg = `Invalid jwt token iss. Err: ${JSON.stringify(error)}`
							logger.error()
							resolve({
								code: 403,
								message: errMsg
							});
						}
						// eslint-disable-next-line no-unused-vars
						const {iat, exp, iss, ...payload2} = payload

						resolve({
							code: 200,
							payload: payload2
						})

					}
				})


			} catch (err) {
				const errMsg = `Invalid jwt user token supplied: ${JSON.stringify(err)}`
				logger.error()
				resolve({
					code: 403,
					message: errMsg
				})
			}

		} else {
			logger.error('No jwt user token supplied')
			resolve({
				code: 403,
				message: 'No jwt user token supplied'
			})
		}

	})

	const result = await tempPromise

	return result

}


/** pro validaci beznych anonymnich operaci, popr. read-only admin operaci
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const checkSecurityToken = async (req, res, next) => {
	logger.info(`Incoming request ${JSON.stringify(req.headers)}`)
	await checkCoreToken(req, res).then((result) => {
		console.log(result)
		if (result.code === 200) {
			try {
				logger.info(`Route access approved using provided jwt token payload. Going further to the service with: ${JSON.stringify(result.payload)}`)
				req.jwtPayload = result.payload

				return next()

			} catch (err) {
				const errMsg = 'Unexpected error during jwt token handling P2'
				logger.error(errMsg)

				return next({
					code: 500,
					message: errMsg
				});
			}
		} else {

			return next({
				code: result.code,
				message: result.message
			});
		}
	}).catch((error) => {
		const errMsg = `Unexpected error during jwt token handling: ${JSON.stringify(error)}`
		logger.error(errMsg)

		return next({
			code: 500,
			message: errMsg
		});
	})


}


module.exports = {

	checkSecurityToken

}