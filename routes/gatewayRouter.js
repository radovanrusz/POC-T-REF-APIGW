/* eslint-disable dot-location */
/* eslint-disable indent-legacy */
/* eslint-disable indent */
/* eslint-disable no-sync */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../jwt-express-middleware');

/* gET home page. */
router.put('/*', jwtMiddleware.checkSecurityToken, async (req, res) => {

	const Services = res.app.get('shared_services');
	const SystemConfig = res.app.get('system_config');
	console.log(`Starting gateway PUT api on path: ${req.path} with incoming request: ${JSON.stringify(req.body)}' and jwt payload: ${JSON.stringify(req.jwtPayload)}`)

	/*
		Bude implementovano TZ analogicky k nasledujici funkci GET
	*/

});

router.get('/*', jwtMiddleware.checkSecurityToken, async (req, res) => {
	try {
		const Services = res.app.get('shared_services');
		const SystemConfig = res.app.get('system_config');
		console.log(`Starting gateway ${req.method} api on path: ${req.originalUrl} with parameters: ${JSON.stringify(req.query)} and jwt payload: ${JSON.stringify(req.jwtPayload)}`)

		let result = {}
		let status = 500

		await Services.doRemoteRequest(req)
			.then((response) => {
				console.log(`Remote service call done with result: ${JSON.stringify(response)}`)
				status = 200
				result = response
			})
			.catch((error) => {
				console.error(`Remote service call done with result: ${error}`)
				status = error
			})


		if (status === 200) {
			res.json(result).status(status).end()
		} else {
			res.status(status).end()
		}


	} catch (err) {
		if (typeof err === 'object') {
			if (Object.entries(err).length > 0) {
				console.error(`Remote service api ERR: ${JSON.stringify(err)}`)
			} else {
				console.error('Unexpected remote service api error')
			}
		} else if ((typeof err === 'string' || err instanceof String) && err.length > 0) {
			console.error(`Remote service api ERR: ${err}`)
		} else {
			console.error('Unexpected remote service api error')

		}
		res.sendStatus(500)
	}
});


module.exports = router;
