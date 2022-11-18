const router = require("express").Router();
const User = require("../model/userModel");
const Client = require("../postgres/Client");
const SQL = require('sql-template-strings')

//register
router.post("/registeruser", async (req, res) => {
    try {
        //receive name, email, password from frontend
        //console.log(req.body);
        const { name, email, password } = req.body;

        const query = (SQL `SELECT * FROM users WHERE email = ${email}`)

        //check if user exists
        const existingUser = await Client.query(query); 
        /*Client.query(query, (err, res) => {
            if (!err) {
                console.log("checked for user");
                existingUser = res.rows[0];
                console.log("found email: " + existingUser.email);
            }
            else {
                console.log("check error: " + err.message);
            }
        })*/
        //console.log("existing: " + typeof existingUser.rows[0]);

        if (typeof existingUser.rows[0] !== 'undefined')
        {
            console.log("user already exists");
            //res.status(400);
            return res.send({message: "An account with this email already exists."});
        }
        else
        {
            const insert = (SQL `
                INSERT INTO users (name, email, password)
                VALUES (${name}, ${email}, ${password})`);

            //adds user to db
            var inserted; 
            Client.query(insert, (err, res) => {
                if (!err) {
                    console.log("added user");
                }
                else {
                    console.log("insert error: " + err.message);
                    inserted = false;
                }
            })
            
        }
        
        res.status(200).send({message: "registered"});

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

//login
router.post("/loginuser", async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;

        const user = (SQL `
            SELECT * FROM users
            WHERE email = ${email};
        `);


        //get user with input email
        var existing = [];
        const userLogin = await Client.query(user);
        /*Client.query(user, (err, res) => {
            if (!err) {
                existing = res.rows[0];
                console.log("query complete: " + existing[0]);
                //console.log(existing[0]);
            }
            else {
                console.err(err.message);
            }
        });*/

        existing = userLogin.rows[0];
        //console.log("email: " + existing.email);

        if (typeof existing == 'undefined')
        {
            console.log("user with email does not exist");
            return res.send({ message: "Wrong email or password." });
        }

        //check password
        const passwordCorrect = existing.password;
        if (password != passwordCorrect)
        {
            console.log("incorrect password");
            return res.send({ message: "Wrong email or password." });
        }

        res.status(200).send({message: "logged in"});

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

module.exports = router;
