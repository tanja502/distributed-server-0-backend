const express = require('express');
const axios = require('axios');

function createServer(port, otherServers) {
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

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = createServer;
