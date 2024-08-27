const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use(express.json());

app.post('/server/start', (req, res) => {
    exec('npm run start:all', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Error starting servers: ${stderr}`);
        }
        res.send(`Servers started successfully: ${stdout}`);
    });
});

app.post('/server/stop', (req, res) => {
    exec('npm run stop:all', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Error stopping servers: ${stderr}`);
        }
        res.send(`Servers stopped successfully: ${stdout}`);
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Control server running on port ${PORT}`);
});
