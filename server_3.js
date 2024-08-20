const createServer = require('./server');

const port = 3002;
const otherServers = ['http://localhost:3000', 'http://localhost:3001'];

createServer(port, otherServers);
