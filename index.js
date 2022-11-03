const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const Client = require("./postgres/Client");

const app = express();
const port = 3000;

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
