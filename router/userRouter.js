const router = require("express").Router();
const User = require("../model/userModel");
const Client = require("../postgres/Client");
const SQL = require('sql-template-strings')

router.post("/registeruser", async (req, res) => {
    try {
        //receive name, email, password from frontend
        console.log(req.body);
        const { name, email, password } = req.body;
        const filter = [email];
        console.log("filter: " + filter);

        //const query = "SELECT * FROM users WHERE email = ?";
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
            

        const newUser = [name, email, password];

        const insert = (SQL `
            INSERT INTO users (name, email, password)
            VALUES (${name}, ${email}, ${password});
        `);

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
