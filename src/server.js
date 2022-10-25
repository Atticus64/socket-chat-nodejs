import { Server } from 'net';
import { EXIT } from './end-protocol.js';
import { error } from './helpers.js';

const server = new Server();

/**
 * Collections of connections and users
 * @property socket - socket object
 * @property user - name of user
 * 
 * Example
 * 127.0.0.1 -> TestUser
 */
const connections = new Map();

const sendMessages = (message, origin) => {
	// TODO: Mandar a todos menos a origin el message
}

const listen = (port) => {
  server.on('connection', (socket) => {
    const fullAdress = `[${socket.remoteAddress}:${socket.remotePort}]`;

    console.log(`Connected ${fullAdress}`);
    socket.setEncoding('utf-8');

    socket.on('data', (message) => {
			if ( !connections.has(socket)){
				console.log(`Username ${message} set for connection ${fullAdress}`)
				connections.set(socket, message)
			}
      else if (message === EXIT) {
        socket.end();
      } else {
				// TODO: Enviar los mensajes al resto de usuarios
				console.log(`${fullAdress}: ${message}`)
			};
    });

    socket.on('close', () => {
      console.log(`Closed connnection from ${fullAdress}`);
    });
  });

	server.on('error', (err) => {
		error(err.message)
	})

  server.listen({ port, host: '0.0.0.0' }, () => {
    console.log(`listening on port ${port}`);
  });
};

const main = () => {
	if ( process.argv.length < 3){
		error('usage: node server.js port')
	}

	let [,,port] = process.argv

	if ( isNaN(port) ){
		error(`invalid port ${ port }`)
	}

	port = Number(port)

	listen(port)
};


main();