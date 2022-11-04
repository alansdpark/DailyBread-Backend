const { Client, Pool } = require('pg');
const { RDS } = require('aws-sdk');

//connect to aws rds database
const client = new Client({
    host: "test2.c6bgfxahnjn0.us-east-1.rds.amazonaws.com",
    user: "postgres",
    port: 5432,
    password: "yoonkang",
    database: "postgres"
});
client.connect();

/*const query = `
INSERT INTO users (name, email, password)
VALUES ('test', 'test@email.com', 'test1234');
`;

client.query(query, (err, res) => {
    if (!err) {
        console.log("added row");
    }
    else {
        console.log(err.message);
    }
})*/

client.query('Select * from users', (err, res) => {
    if (!err) {
        console.log(res.rows);
    } else {
        console.log(err.message);
    }
    client.end;
})

module.exports = client;