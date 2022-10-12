const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const { Client, Pool } = require('pg');
const { RDS } = require('aws-sdk');

/*const signerOptions = {
    credentials: {
        accessKeyId: 'AKIAWKXHKMXPJHABANNX',
        secretAccessKey: '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',
    },
    region: 'us-east-1',
    hostname: 'test2.c6bgfxahnjn0.us-east-1.rds.amazonaws.com',
    port: 5432,
    username: 'postgres',
}
const signer = new RDS.Signer();
const getPassword = () => signer.getAuthToken(signerOptions);

const pool = new Pool({
    host: signerOptions.hostname,
    port: signerOptions.port,
    user: signerOptions.username,
    database: 'postgres',
    password: getPassword,
})

pool.query('select * from users', (err, res) => {
    console.log(err, res);
    pool.end;
})*/

const client = new Client({
    host: "test2.c6bgfxahnjn0.us-east-1.rds.amazonaws.com",
    user: "postgres",
    port: 5432,
    password: "yoonkang",
    database: "postgres"
});
client.connect();

const query = `
INSERT INTO users (id, firstname, lastname)
VALUES (3, 'test', '3');
`;

client.query(query, (err, res) => {
    if (!err) {
        console.log("added row");
    }
    else {
        console.log(err.message);
    }
})

client.query('Select * from users', (err, res) => {
    if (!err) {
        console.log(res.rows);
    } else {
        console.log(err.message);
    }
    client.end;
})

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