const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Successfully connected to ${process.env.MongoURL} database`);
}).catch(err => {
    console.log(err);
});

const characterSchema = new mongoose.Schema({
    name: String,
    birthday: String,
    constellation: String,
    nation: String,
    affiliation: String,
    special_dish: String,
    img: String
});

const Character = mongoose.model('Character', characterSchema);

app.route('/')
    .get((req, res) => {
        res.send(`Go to localhost:${process.env.PORT}/characters`);
    })

app.route('/characters')
    .get((req, res) => {
        Character.find((err, results) => {
            if (!err) {
                res.send(results);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        const newCharacter = new Character({
            name: req.body.name,
            birthday: req.body.birthday,
            constellation: req.body.constellation,
            nation: req.body.nation,
            affiliation: req.body.affiliation,
            special_dish: req.body.special_dish,
            img: req.body.img
        });

        newCharacter.save((err) => {
            if (!err) {
                res.send(`Successfully added ${req.body.name} into the database.`);
            } else {
                res.send(err);
            }
        });
    });

app.route('/characters/:characterName')
    .get((req, res) => {
        Character.findOne({ name: req.params.characterName }, (err, result) => {
            if (result) {
                res.send(result);
            } else {
                res.send(`No charater with the name ${req.params.characterName} found`);
            }
        })
    })
    .patch((req, res) => {
        Character.updateOne(
            { name: req.params.characterName },
            { $set: req.body },
            (err) => {
                if (!err) {
                    res.send(`Successfully updated ${req.params.characterName} database`);
                } else {
                    res.send(err);
                }
            },
        );
    })
    .delete((req, res) => {
        Character.deleteOne(
            { name: req.params.characterName }, (err) => {
                if (!err) {
                    res.send(`Successfully deleted ${req.params.characterName} database`);
                } else {
                    res.send(err);
                }
            })
    })

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});