const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
const delayedUrl = 'https://httpbin.org/delay/3';

function sleepSync(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds) {
    }
}

app.post('/sync-read', (req, res) => {
    try {
        const { callCounter } = req.query;
        console.log(`starting ${callCounter} ${new Date().toLocaleTimeString()}`);
        sleepSync(3000);
        res.send({ message: 'Sync call completed', data: {} });
        console.log(`finished ${callCounter} ${new Date().toLocaleTimeString()}`);
    } catch (error) {
        res.status(500).send({ error: 'Error in sync call' });
    }
});

app.post('/async-read', async (req, res) => {
    try {
        const { callCounter } = req.query;
        console.log(`starting ${callCounter} ${new Date().toLocaleTimeString()}`);
        const response = await axios.get(delayedUrl);
        res.send({ message: 'Async call completed', data: response.data });
        console.log(`finished ${callCounter} ${new Date().toLocaleTimeString()}`);
    } catch (error) {
        res.status(500).send({ error: 'Error in async call' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});