const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { secret, saltRounds } = require("../constants");

exports.register = async ({ username, password, repeatPassword }) => {
    // if (password !== repeatPassword) {
    //     return false;
    // }

    // let hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
        let createdUser = User.create({
            username,
            password: hashedPassword,
        });

        return createdUser;
    } catch (error) {
        return error;
    }

    // let createdUser = new User({
    //     username,
    //     password: hashedPassword,
    // })
    // createdUser.save();
};

exports.login = async ({ username, password }) => {
    let user = await User.findOne({ username });

    if (!user) {
        return;
    }

    let isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return;
    }

    let result = new Promise((resolve, reject) => {
        jwt.sign(
            { _id: user._id, username: user.username },
            secret,
            { expiresIn: "2d" },
            (err, token) => {
                if (err) {
                    return reject(err);
                }
                resolve(token);
            }
        );
    });

    return result;
};
