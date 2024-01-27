const express = require('express');
const app = express();

// Import the database connection using config.js file
const dbConfig = require('./config/dbConfig');

// Create a route to test the database connection
app.get('/test-connection', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            res.status(500).send('Error connecting to the database');
        } else {
            console.log('Connected to the database');
            res.send('Connected to the database');
        }
    });

    connection.end();
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
