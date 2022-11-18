const { Client, Pool } = require('pg');
const { RDS } = require('aws-sdk');
const dotenv = require("dotenv");

dotenv.config();

const hostname = process.env.AWS_RDS_HOST;
const username = process.env.AWS_RDS_USER;
const db = process.env.AWS_RDS_DB;
const password = process.env.AWS_RDS_PASS;

//connect to aws rds database
const client = new Client({
    host: hostname,
    user: username,
    port: 5432,
    password: password,
    database: db
});
client.connect();

module.exports = client;