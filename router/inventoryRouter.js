const router = require("express").Router();
const Client = require("../postgres/Client");
const SQL = require('sql-template-strings');

//add ingredient to inventory
router.post("/addingredient", async (req, res) => {
    try {
        //receive category name, ingredient name, quantity, and user email from frontend
        const { category, item, quantity, email } = req.body;

        //add item to inventory if it doesn't exist already
        const add = (SQL `INSERT INTO inventory (category, item, quantity, email)
            SELECT * FROM (SELECT ${category} AS category, ${item} AS item, ${quantity} AS quantity, ${email} AS email) AS temp
            WHERE NOT EXISTS (
                SELECT item FROM inventory WHERE item = ${item}
            ) LIMIT 1`);

        const ingredient = await Client.query(add);
        console.log("ingredient: " + ingredient.rows[0]);

        //return error message if ingredient already exists
        if (typeof ingredient.rows[0] !== 'undefined')
        {
            console.log("ingredient already exists");
            //res.status(400);
            return res.send({message: "Item is already in inventory! Edit item instead."});
        }
        

        res.status(200).send({message: "added"});

    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
})

//set inventory when user logs in
router.get("/getinventory", async (req, res) => {
    try {
        //get email parameter from frontend
        const email = req.query.email;
        console.log("request: " + email);
        //get all items that belong to user
        const getIngredients = (SQL `SELECT category, item, quantity FROM inventory
            WHERE email = ${email}`);
        //console.log("email: " + email)

        const inventory = await Client.query(getIngredients);
        var item = "";
        if (typeof inventory.rows[0] !== 'undefined')
        {
            item = inventory.rows[0].category;
        }
        
        console.log(item);
        //console.log("inventory items: " + inventory.rows[0]);

        //DELETE LATER: can access each result with rows[]
        //console.log(inventory.rows[0].category);
        //console.log(inventory.rows[1].category);

        res.json(item);        

    } catch (err) {
        console.error(err);
        res.status(500).send()
    }
}) 

module.exports = router;