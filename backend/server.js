const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Import the database configuration
const dbConfig = require('./config/dbConfig');

// Middleware to serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


// Middleware to parse JSON bodies
app.use(bodyParser.json());

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


// Route for user registration
app.post('/register', async (req, res) => {
   
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const connection = mysql.createConnection(dbConfig);
  
    connection.connect(err => {
      if (err) {
        console.error('Database connection failed:', err);
        return res.status(500).send('Database connection failed');
    }
    const newUser = [ username, email,  hashedPassword ];
    const query = 'INSERT INTO Users (Username, Email,Password) VALUES (?,?,?)';
   
    
      connection.query(query, newUser, (error, results) => {
        connection.end(); // Close the connection whether or not the query was successful
        
        if (error) {
          console.error('Error registering new user:', error);
          return res.status(500).send('Error registering new user');
        }
        
        // If no error, send a success response
        res.status(201).send('User registered successfully');
      });
    });
  });

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
