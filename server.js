const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 5432; 

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'postgres',
  password: '1234',
  database: 'postgres'
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to database:', error);
    return;
  }
  console.log('Connected to database');
});

app.use(bodyParser.json());

app.post('/api/cart/add', (req, res) => {
    const newItem = req.body; 

    const query = 'INSERT INTO cart (name) VALUES (?)';
    connection.query(query, [newItem.name], (error, results) => {
        if (error) {
            console.error('Error adding product to cart:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ message: 'Product added to cart successfully', productId: results.insertId });
        }
    });
});

app.delete('/api/cart/delete/:itemId', (req, res) => {
    const itemId = req.params.itemId; 

    const query = 'DELETE FROM cart WHERE id = ?';
    connection.query(query, [itemId], (error, results) => {
        if (error) {
            console.error('Error deleting product from cart:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ message: 'Product deleted from cart successfully' });
        }
    });
});

app.put('/api/cart/update/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    const updatedQuantity = req.body.quantity; 

    const query = 'UPDATE cart SET quantity = ? WHERE id = ?';
    connection.query(query, [updatedQuantity, itemId], (error, results) => {
        if (error) {
            console.error('Error updating product quantity in cart:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ message: 'Cart item quantity updated successfully' });
        }
    });
});

app.get('/api/cart/items', (req, res) => {
    
    const query = 'SELECT * FROM cart';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error getting cart items:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});
