const router = require("express").Router();
const { isEmail } = require("validator/lib/isEmail");

const authService = require("../services/authService");
const { sessionName } = require("../constants");

router.get("/register", (req, res) => {
    res.render("auth/register");
});

router.post("/register", async (req, res, next) => {
    if (!isEmail(req.body.username)) {
        // return res.status(404).send("Invalid email");
        let error = {
            message: "Invalid email",
            status: 401,
        };
        return next(error);
    }

    try {
        await authService.register(req.body);
        res.redirect("/auth/login");
    } catch (error) {
        // let text = '';
        // if (error.errors) {
        //     text = Object.values(error.errors)[0].message;
        // } else {
        //     text = error.message;
        // }

        // res.locals.error = error.message;
        res.status(401).render("/auth/register", { error: error.message });
    }
});

router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.post("/login", async (req, res) => {
    try {
        let token = await authService.login(req.body);

        if (!token) {
            return res.redirect("/404");
        }

        res.cookie(sessionName, token, { httpOnly: true });

        res.redirect("/");
    } catch (error) {
        res.status(400).render("auth/login", { error: error.message });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie(sessionName);
    res.redirect("/");
});

module.exports = router;
