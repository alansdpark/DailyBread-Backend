const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const Client = require("./postgres/Client");

const app = express();
const port = 3000;


/*const { Client, Pool } = require('pg');
const { RDS } = require('aws-sdk');*/

//connect to aws rds database
/*const client = new Client({
    host: "test2.c6bgfxahnjn0.us-east-1.rds.amazonaws.com",
    user: "postgres",
    port: 5432,
    password: "yoonkang",
    database: "postgres"
});
client.connect();*/

/*const query = `
INSERT INTO users (id, name, email, password)
VALUES (1, 'test', 'test@email.com', 'test1234');
`;

client.query(query, (err, res) => {
    if (!err) {
        console.log("added row");
    }
    else {
        console.log(err.message);
    }
})*/

/*client.query('Select * from users', (err, res) => {
    if (!err) {
        console.log(res.rows);
    } else {
        console.log(err.message);
    }
    client.end;
})*/


app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.get('/', (req, res) => {
    res.json({ info: 'Test test'})
});

app.listen(port, () => {
    console.log(`App running on port ${port}`)
});

app.use("/auth", require("./router/userRouter"));