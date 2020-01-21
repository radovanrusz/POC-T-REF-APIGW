
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

/* gET home page. */
router.post('/', async (req, res) => {
    try {
        const Services = res.app.get('shared_services');
        const SystemConfig = res.app.get('system_config');
        console.log(`Starting login api with incoming request: ${JSON.stringify(req.body)}`)
        let result = {}

        if (SystemConfig.APP_ANAT_SHOULD_USE_MOCK) {
            console.log('Starting Local MOCK for login&token')
            result = await Services.doLocalLoginViaTokenMock(req.body)
            
        } else {
            console.log('Starting Remote LDAP for login&token')
            result = await Services.doRemoteLogin(req.body)
            
        }

        if (result.status === 200) {
            console.log(`Login api done with result: ${JSON.stringify(result)}`)
            res.json(result).status(result.status).end()

        } else {
            console.error(`Login api done with result: ${JSON.stringify(result)}`)
            res.sendStatus(result.status)

        }


    } catch (err) {
        console.error(`Remote login api ERR: ${JSON.stringify(err)}`)
        res.sendStatus(500)
    }
});

module.exports = router;
