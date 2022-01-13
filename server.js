const http = require('http');

const app = require('./app.js')

const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Listening for requests on port: ${port}`)
})