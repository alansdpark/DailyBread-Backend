const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const Client = require("./postgres/Client");

const app = express();
const port = 3000;

const options = {
  method: 'GET',
  url: 'https://tasty.p.rapidapi.com/recipes/list',
  params: {from: '0', size: '20', q: 'apple, flour'},
  headers: {
    'X-RapidAPI-Key': '0fabe6247amsh3cc35d831f1063ep17f222jsncb85460e2453',
    'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
  }
};

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.get('/', (req, res) => {
    res.json({ info: 'Test test'})
});

app.get('/recipes', (req, res) => {
    axios.request(options).then(function (response) {
        const resultsParsed = response.data.results.map(resultsObject => {
            let instructions = [];
            resultsObject.instructions.map(instructionsObject => {
                instructions.push(instructionsObject.display_text);
            });

            let ingredients = [];
            resultsObject.sections[0].components.map(ingredientsObject => {
                ingredients.push(ingredientsObject.raw_text);
            });

            return {
                id: resultsObject.id,
                name: resultsObject.name,
                instructions: instructions,
                ingredients: ingredients
            }
        });
        res.json(resultsParsed);
    }).catch(function (error) {
        console.error(error);
    });
});

app.listen(port, () => {
    console.log(`App running on port ${port}`)
});

app.use("/auth", require("./router/userRouter"));
