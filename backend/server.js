const express = require('express');
const app = express();
const port = 8080;

const MONGODB_URL = process.env.MONGODB_URL

// Define routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
