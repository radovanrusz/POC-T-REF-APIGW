const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

/* gET home page. */
router.get('/', (req, res) => {
    res.render('index', {title: 'Vítejte v návrhu datového modelu api gateway kompoenty PoC řešení pro Třinecké železárny'});
});

module.exports = router;
