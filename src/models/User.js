const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { secret, saltRounds } = require("../constants");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Email is already in use"],
        validate: /[a-zA-Z0-9]/,
        minLength: 5,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 8,
        validate: /[a-zA-Z0-9]/,
    },
});

userSchema.virtual("repeatPassword").set(function (value) {
    if (this.password !== value) {
        throw new Error("Repeated password does not match");
    }
});

userSchema.pre("save", function (next) {
    bcrypt.hash(this.password, saltRounds).then((hashedPassword) => {
        this.password = hashedPassword;
        next();
    });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
