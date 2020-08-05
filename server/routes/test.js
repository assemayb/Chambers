const express = require("express");
const Test = require("../models/TestModel");


const mongoose = require('mongoose')


// const TestSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     values: [String],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// })

// module.exports = mongoose.model("Test", TestSchema)


router.post('/test', async (req, res) => {
    const { title, value } = req.body
    console.log([title, value])
    try {
        await Test.create({
            title: title,
            values: value
        }, () => {
            res.json({ msg: "Ok cool !" })
        })
    } catch (error) {
        console.error(error)
    }
})

router.post('/test/edit', async (req, res) => {
    const { title, comm } = req.body
    try {
        let doc = await Test.findOne({ title: title })
        await Test.updateOne(doc, { $push : { values: comm }}, () => {
            res.json({ msg: "ok cool Done!" })
            // console.log(response)
        })
        // await Test.findOneAndUpdate({ title: title }, {  $push: { values: comm  }, }, (err, response) => {
        //     res.json({ msg: "ok cool Done!" })
        //     console.log(response)
        // })
    } catch (error) {
        console.error(error)
    }
})
