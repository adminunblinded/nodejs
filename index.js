const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios'); // Add axios for making HTTP requests
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Proxy route to forward the request to Zapier
app.post('/proxy', async (req, res) => {
    try {
        const response = await axios.post('https://hooks.zapier.com/hooks/catch/15640277/22yikp5/', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({
            message: 'Error forwarding request to Zapier',
            error: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
