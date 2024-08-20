const express = require('express');
const axios = require('axios');

const app = express();
let counter = 0;
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.use(express.json());

async function syncCounter() {
    const otherServers = ['http://localhost:3000', 'http://localhost:3001'];

    for (const server of otherServers) {
        try {
            await axios.post(`${server}/sync`, { counter });
        } catch (error) {
            console.log(`Error propagating increment to ${server}:`, error.message);
        }
    }
}

app.post('/increment', async (req, res) => {
    counter++;
    await syncCounter();

    res.send(`Counter incremented to ${counter}`);
});

app.get('/counter', (req, res) => {
    res.json({ counter });
});

app.post('/sync', (req, res) => {
    const { counter: newCounter } = req.body;
    if (newCounter > counter) {
        counter = newCounter;
        console.log(`Counter synchronized to ${counter}`);
    }
    res.sendStatus(200);
});


app.listen(3002, async () => {
    console.log('Server running on port 3002')
});