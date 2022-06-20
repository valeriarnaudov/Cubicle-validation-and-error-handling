const router = require('express').Router();
const { isEmail } = require('validator/lib/isEmail');

const authService = require('../services/authService');
const { sessionName } = require('../constants')

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    if (!isEmail(req.body.username)) {
        return res.status(404).send('Invalid email');
    }

    let createdUser = await authService.register(req.body);

    if (createdUser) {
        res.redirect('/auth/login');
    } else {
        res.redirect('404');
    }


});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {
    let token = await authService.login(req.body);

    if (!token) {
        return res.redirect('/404');
    }

    res.cookie(sessionName, token, {httpOnly: true});

    res.redirect('/');
});

router.get('/logout', (req, res) => {
    res.clearCookie(sessionName);
    res.redirect('/');
})

module.exports = router;