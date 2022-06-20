const router = require("express").Router();
const Accessory = require("../models/accessory");
const { modelValidator } = require("../middlewares/validatorMiddleware");

const accessoryService = require("../services/accessoryService");

router.get('/create',modelValidator(Accessory), (req, res) => {
    res.render('accessory/create');
});

router.post('/create', async (req, res) => {
    await accessoryService.create(req.body)
    res.redirect('/');
});

module.exports = router;