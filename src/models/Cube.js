const mongoose = require("mongoose");

const cubeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        maxLength: 120,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    difficultyLevel: {
        type: Number,
        required: true,
        min: 1,
        max: 6,
    },
    accessories: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Accessory',
        },
    ],
    owener: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
});

cubeSchema.path("imageUrl").validate(function () {
    return this.imageUrl.startsWith("http");
}, "Image URL must start with http");

const Cube = mongoose.model("Cube", cubeSchema);

module.exports = Cube;
