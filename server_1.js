const createServer = require('./server');

const port = 3000;
const otherServers = ['http://localhost:3001', 'http://localhost:3002'];

createServer(port, otherServers);
