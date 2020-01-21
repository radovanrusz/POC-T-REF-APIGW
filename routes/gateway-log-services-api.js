/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
const {loggers} = require('winston');
const logger = loggers.get('routers')
const express = require('express');
const router = express.Router();

const path = require('path');
const fs = require('fs');


router.get('/get-gateway-logs', async (req, res) => {
	
    const numberOfLines = 1000
    const file = path.resolve(__dirname, '../logs/', 'api-gateway.log')
    console.log(file)
    // eslint-disable-next-line no-sync
    const data = await fs.readFileSync(file, 'utf8');
    const lines = data.split('\n')
    console.log(lines.length)
    if (lines.length > numberOfLines) {
        const lines2 = lines.slice(lines.length - numberOfLines, lines.length)
        console.log(lines2.length)
        res.render('gateway', {lines: lines2});
		
    } else {
	
        res.render('gateway', {lines});
    }
});
  

module.exports = router;
