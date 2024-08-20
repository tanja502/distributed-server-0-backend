const createServer = require('./server');

const port = 3001;
const otherServers = ['http://localhost:3000', 'http://localhost:3002'];

createServer(port, otherServers);
