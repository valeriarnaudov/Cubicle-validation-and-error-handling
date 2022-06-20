const fs = require("fs/promises");
const path = require("path");

const Cube = require("../models/Cube");
const Accessory = require("../models/Accessory");

exports.getAll = async (search = "", fromInput, toImput) => {
    const from = Number(fromInput) || 0;
    const to = Number(toImput) || 6;

    // let cubes = await Cube.find({
    //     name: { $regex: new RegExp(search, "i") },
    //     difficultyLevel: { $and: [{ $gte: from }, { $lte: to }] },
    // }).lean();

    let cubes = await Cube.find({ name: { $regex: new RegExp(search, "i") }})
    .where("difficultyLevel").gte(from).lte(to)
    .lean();

    // const result = cubes
    //     .filter((x) => x.name.toLowerCase().includes(search?.toLowerCase()))
    //     .filter((x) => x.difficultyLevel >= from && x.difficultyLevel <= to);

    return cubes;
};

exports.getOne = (cubeId) => Cube.findById(cubeId);

exports.getOneDetailed = (cubeId) =>
    Cube.findById(cubeId).populate("accessories");

//Nested population

// .populate({
//     path: "accessories",
//     populate: {
//         path: "cubes",
//         model: "Cube"
//     }
// });

exports.create = (cube) => Cube.create(cube);

exports.edit = (cubeId, cubeData) => Cube.findByIdAndUpdate(cubeId, cubeData, {runValidators: true});

exports.delete = (cubeId) => Cube.findByIdAndDelete(cubeId);


exports.attachAccessory = async (cubeId, accessoryId) => {
    const cube = await Cube.findById(cubeId);
    const accessory = await Accessory.findById(accessoryId);

    cube.accessories.push(accessory);
    accessory.cubes.push(cube);

    await cube.save();
    await accessory.save();

    return cube;
};

