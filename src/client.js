import { Socket, SocketAddress } from 'net';
import readline from 'readline';
import { EXIT } from './end-protocol.js';
import { error } from './helpers.js';

const socket = new Socket();

const main = () => {
  if (process.argv.length < 4) {
    error('usage: node server.js host port');
  }

  let [, , host, port] = process.argv;

  if (isNaN(port)) {
    error(`invalid port ${port}`);
  }

  port = Number(port);

  console.log(`${host}:${port}`);

  connect(host, port)
};

const connect = (host, port) => {
  const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  input.on('line', (message) => {
    socket.write(message);

    if (message === EXIT) {
      socket.end();
    }
  });

  socket.connect({ host, port }, () => {
    console.log('connected');
    socket.setEncoding('utf8');

    socket.on('data', (message) => {
      console.log(message);
    });
  });

  socket.on('close', () => {
    process.exit(0);
  });

  socket.on('error', (err) => {
    error(err.message)
  })
};

main();
