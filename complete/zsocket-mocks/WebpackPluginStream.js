const io = require('socket.io');
let ioServer = undefined;

const initNamespaceMock = (ioServer) => {
	const namespace = 'mock';
	const mockNamespaceServer = ioServer.of(`/${ namespace }`);

	// on connection, wire up handlers		
	mockNamespaceServer.on('connection', (socket) => {
		console.log(`socket-server: ${ namespace }: someone connected`);

		socket.on('disconnect', () => {
			console.log(`socket-server: ${ namespace }: someone disconnected`);
		});

		const emitSocketMessageModel = (ack, action, otherClientId, model) => {
			mockNamespaceServer.emit('server-message', {
				clientId: otherClientId, // the other client id
				namespace: namespace,
				type: 'canvas-stream',
				action: action,
				ack: ack,
				model: model
			});
		};

		// setInterval(() => {
		// 	emitSocketMessageModel('refresh');
		// }, 2000);

		socket.on('client-message', (clientMessage) => {
			console.log(`socket-server: ${ namespace }: client-message`, clientMessage);
			const { type, action, clientId, model } = clientMessage;

			if (type === 'canvas-stream' && action === 'draw') {
				emitSocketMessageModel('', 'refresh', clientId, model);
			}
		});
	})
};

module.exports = class WebpackPluginMockSocketServer {
	// Define `apply` as its prototype method which is supplied with compiler as its argument
	apply(compiler) {
		// Specify the event hook to attach to
		compiler.hooks.emit.tapPromise(
			'mock-stream-server',
			(compilation) => {
				return new Promise((resolve, reject) => {

					if (process.env.NODE_ENV !== 'production' && !ioServer) {
						setTimeout(() => {

							ioServer = io.listen(3100);
							initNamespaceMock(ioServer);
		
							ioServer.on('connection', (socket) => {
								console.log('socket-server: root: someone connected');
		
								socket.on('disconnect', () => {
									console.log('socket-server: root: someone disconnected');
								});
							});
							
						}, 250);
					}

					resolve(true);
				});
			}
		);
	}
}
