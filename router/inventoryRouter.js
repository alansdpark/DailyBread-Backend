const router = require("express").Router();
const Client = require("../postgres/Client");
const SQL = require('sql-template-strings');

//preliminary check to see if ingredient is already in inventory
router.get("/getingredient", async (req, res) => {
    try {
        const {item, email} = req.query;

        const check = (SQL `SELECT item FROM inventory
            WHERE item = ${item} AND email = ${email}`);

        const ingredient = await Client.query(check);

        //return error message if ingredient already exists
        if (typeof ingredient.rows[0] !== 'undefined')
        {
            console.log("trying to add duplicate: " + ingredient.rows[0]);
            return res.send({message: "true"});
            
        }

        res.send({message: "false"});


    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

//add and save ingredient to inventory
router.post("/addingredient", async (req, res) => {
    try {
        //receive category name, ingredient name, quantity, and user email from frontend
        const { category, item, quantity, email } = req.body;

        //add item to inventory if it doesn't exist already
        const add = (SQL `INSERT INTO inventory (category, item, quantity, email)
           SELECT * FROM (SELECT ${category} AS category, ${item} AS item, ${quantity} AS quantity, ${email} AS email) AS temp
            WHERE NOT EXISTS (
                SELECT item FROM inventory WHERE item = ${item}
            ) RETURNING item`);

        //const ingredient = 
        await Client.query(add);

        /* //return error message if ingredient already exists
        if (typeof ingredient.rows[0] == 'undefined')
        {
            return res.send({message: "Item is already in inventory! Edit item instead."});
            
        }
        else {
            console.log("ingredient: " + ingredient.rows[0].item);
        } */
        

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
        //console.log("request: " + email);

        //get all items that belong to user
        const getIngredients = (SQL `SELECT category, item, quantity FROM inventory
            WHERE email = ${email}
            ORDER BY category, item ASC`);
        //console.log("email: " + email)
        var inventory = {inventory: []};
        var categoryList = [];
        //var categoryItems = [];
        var itemList = {items: []};
        //var items = [];
        let j = 0;
        const inventoryQuery = await Client.query(getIngredients);
        //console.log("inventory: " + JSON.stringify(inventoryQuery.rows).length);
        //console.log("inventory size: " + inventoryQuery.rows.length);
        //console.log("inventory: " + inventoryQuery.rows);
        //const category = inventoryQuery.rows[0].category;
        /* if (typeof inventoryQuery.rows[0] !== 'undefined')
        {
            const category = inventoryQuery.rows[0].category;
            //push to inventory "category": categoryName and "items": JSON array of items
            inventory.inventory.push({"category": inventoryQuery.rows[0].category});
            //inventory.inventory.category[category].push(inventoryQuery.rows[0].item);
            //inventory.inventory.category.push("item", inventoryQuery.rows[0].item);
            console.log("inventory: " + JSON.stringify(inventory));
        } */
        

        if (typeof inventoryQuery.rows[0] !== 'undefined')
        {
            for (let i = 0; i < inventoryQuery.rows.length; i++)
            {
                const item = inventoryQuery.rows[i];
                const category = item.category;
                //console.log("item: " + JSON.stringify(item));
                //itemList.items.push({"name": item.item, "count": item.quantity});

                if (categoryList.length == 0)
                {
                    /*items.push(item.quantity);
                    itemList.push(items);
                    items.length = 0; */
                    categoryList.push(item.category);
                }
                else if (categoryList[j] !== category)
                {
                    //console.log("category in list: " + categoryList[j] + " current row category: " + category);
                    //console.log("item list: " + JSON.stringify(itemList));
                    console.log("adding to inventory...");
                    inventory.inventory.push({"category": categoryList[j], "items": itemList});
                    //console.log("checking inventory: " + JSON.stringify(inventory));
                    categoryList.push(category);
                    itemList = {items: []};
                    
                    j++;
                }
                itemList.items.push({"name": item.item, "count": item.quantity});
                //console.log("current item list: " + JSON.stringify(itemList));
            }
        }
        //console.log(categoryList[j]);
        inventory.inventory.push({"category": categoryList[j], "items": itemList});
        
        //console.log("categories: " + categoryList);
        //console.log("inventory: " + JSON.stringify(inventory, null, 4));
        

        /* var item = "";
        if (typeof inventory.rows[0] !== 'undefined')
        {
            item = inventory.rows[0].category;
        } */
        
        //console.log("inventory items: " + inventory.rows[0]);


        //res.json(item);      
        res.json(JSON.stringify(inventory));  

    } catch (err) {
        console.error(err);
        res.status(500).send()
    }
}) 

//delete item from inventory
router.post("/deleteingredient", async (req, res) => {
    try {
        const { item, email } = req.body;

        const remove = (SQL `DELETE FROM inventory 
            WHERE email = ${email} AND item=${item}`);

        await Client.query(remove);

        res.status(200).send({message: "removed"});

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
    
})

//edit item in inventory
router.post("/editingredient", async (req, res) => {
    try {
        const { item, newName, newCount, email } = req.body;

        const edit = (SQL `UPDATE inventory 
            SET item = ${newName}, quantity = ${newCount}
            WHERE item = ${item} AND email = ${email}`)

        //const result = 
        await Client.query(edit);

        res.status(200).send({message: "edited"});

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

//preliminary check to see if category already exists in inventory
router.get("/getcategory", async (req, res) => {
    try {
        const {category, email} = req.query;

        const check = (SQL `SELECT item FROM inventory
            WHERE category = ${category} AND email = ${email}
            LIMIT 1`);

        const categories = await Client.query(check);

        //return error message if ingredient already exists
        if (typeof categories.rows[0] !== 'undefined')
        {
            console.log("trying to add duplicate: " + JSON.stringify(categories.rows[0]));
            return res.send({message: "true"});
            
        }

        res.send({message: "false"});


    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

//add new category to inventory
router.post("/addcategory", async (req, res) => {
    try {
        const { category, email } = req.body;

        const addCat = (SQL `INSERT INTO inventory (category, item, quantity, email)
            VALUES (${category}, '', '', ${email})
        `)

        await Client.query(addCat);

        res.status(200).send({message: "added empty category."});

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

//delete entired category
router.post("/deletecategory", async (req, res) => {
    try {
        const { category, email } = req.body;

        const remove = (SQL `DELETE FROM inventory
            WHERE email = ${email} AND category = ${category}`);

        await Client.query(remove);

        res.status(200).send({message: "category removed"});

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

module.exports = router;