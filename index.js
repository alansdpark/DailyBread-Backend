const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const Client = require("./postgres/Client");

const app = express();
const port = 3000;
const dotenv = require("dotenv");

dotenv.config();

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
    const query = req.query.q;

    console.log("recipe search: " + query);

    const options = {
        method: 'GET',
        url: 'https://tasty.p.rapidapi.com/recipes/list',
        params: {
            from: '0', 
            size: '20', 
            q: query
        },
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY,
            'X-RapidAPI-Host': process.env.API_HOST
        }
    };

    axios.request(options).then(function (response) {
        const resultsParsed = response.data.results.map(resultsObject => {

            let instructions = [];
            let ingredients = [];

            const hasInstructions = resultsObject.hasOwnProperty('instructions'); 
            if (hasInstructions) {
                resultsObject.instructions.map(instructionsObject => {
                    instructions.push(instructionsObject.display_text);
                });
            }
            
            const hasIngredients = resultsObject.hasOwnProperty('sections');
            if (hasIngredients) {
                // resultsObject.sections[0].hasOwnProperty('components'); // leave in case something breaks.
                const sectionsLength = Object.keys(resultsObject.sections).length;
                for (let i = 0; i < sectionsLength; i++) {
                    resultsObject.sections[i].components.map(ingredientsObject => {
                        ingredients.push(ingredientsObject.raw_text);
                    });
                }
            }
            
            if (hasInstructions || hasIngredients) { // only return objects that have at least instructions or ingredients
                return {
                    id: resultsObject.id,
                    name: resultsObject.name,
                    instructions: instructions,
                    ingredients: ingredients
                }
            } 
        });
        const filteredResponse = resultsParsed.filter(obj => obj); // Filter out null values
        res.json(filteredResponse);
    }).catch(function (error) {
        console.error(error);
    });
});

app.listen(port, () => {
    console.log(`App running on port ${port}`)
});

app.use("/auth", require("./router/userRouter"));
app.use("/auth", require("./router/inventoryRouter"));