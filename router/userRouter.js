const router = require("express").Router();
const User = require("../model/userModel");
const Client = require("../postgres/Client");
const SQL = require('sql-template-strings')

//register
router.post("/registeruser", async (req, res) => {
    try {
        //receive name, email, password from frontend
        console.log(req.body);
        const { name, email, password } = req.body;

        const query = (SQL `SELECT email FROM users WHERE email = ${email}`)

        //check if user exists
        const existingUser = Client.query(query, (err, res) => {
            if (!err) {
                console.log("checked for user");
            }
            else {
                console.log("check error: " + err.message);
            }
        })

        if (existingUser)
        {
            console.log("user already exists");
            return res
                .status(400)
                .send({ message: "An account with this email already exists." });
        }
            
        const insert = (SQL `
            INSERT INTO users (name, email, password)
            VALUES (${name}, ${email}, ${password});
        `);

        //adds user to db
        Client.query(insert, (err, res) => {
            if (!err) {
                console.log("added user");
            }
            else {
                console.log("insert error: " + err.message);
            }
        })


    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

module.exports = router;
