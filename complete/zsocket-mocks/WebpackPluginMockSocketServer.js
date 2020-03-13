// const io = require('socket.io');
// let ioServer = undefined;

// const getRandomInt = (max) => {
// 	return Math.floor(Math.random() * Math.floor(max));
// };

// const getStatusFromProgress = (input) => {
// 	var xMax = 5;
// 	var xMin = 0;
  
// 	var yMax = 100;
// 	var yMin = 0;
  
// 	var percent = (input - yMin) / (yMax - yMin);
// 	var outputX = percent * (xMax - xMin) + xMin;
// 	return Math.round(outputX);
// };

// const queueModel = {
// 	name: 'Mocked Queue',
// 	description: 'A mocked job queue',
// 	items: [1,2].map((d) => {
// 		let progress = getRandomInt(100);
// 		let status = 3
// 		if (progress < 100) {
// 			status = getStatusFromProgress(progress);
// 			if (status === 5) {
// 				progress = 100;
// 			}
// 		}
		
// 		return {
// 			id: d,
// 			name: `${ d } a queue item`,
// 			status: status,
// 			progress: progress
// 		};
// 	}).reverse()
// };

// const actionStrategy = {
// 	add: (item) => {
// 		item.status = Number(item.status);
// 		queueModel.items.push(item);
// 	},
// 	remove: (item) => {
// 		const index = queueModel.items.map(item => item.id).indexOf(item.id);
// 		console.log('remove at index', index);
// 		queueModel.items.splice(index, 1);
// 	},
// 	clearQueue: () => {
// 		queueModel.items = [];
// 	},
// 	increaseProgress: () => {
// 		queueModel.items.forEach((item) => {
// 			if (item.progress === 0)
// 			{
// 				item.progress = 10;
// 			}
// 			let newProgress = Math.round(Number(item.progress) * 1.2);
// 			if (newProgress > 100) {
// 				newProgress = 100;
// 			}

// 			let newStatus = getStatusFromProgress(item.progress);
// 			if (newStatus > 5) {
// 				newStatus = 5;
// 				newProgress = 100;
// 			}
// 			item.progress = newProgress;
// 			item.status = newStatus;
// 		})
// 	}
// };


// // 			1: '',
// // 			2: 'queued',
// // 			3: 'working',
// // 			4: 'warning',
// // 			5: 'danger',
// // 			6: 'success'

// const initNamespaceMock = (ioServer) => {
// 	const namespace = 'mock';
// 	const mockNamespaceServer = ioServer.of(`/${ namespace }`);

// 	// on connection, wire up handlers		
// 	mockNamespaceServer.on('connection', (socket) => {
// 		console.log(`socket-server: ${ namespace }: someone connected`);

// 		socket.on('disconnect', () => {
// 			console.log(`socket-server: ${ namespace }: someone disconnected`);
// 		});

// 		const emitQueueModel = (ack) => {
// 			socket.emit('server-message', {
// 				namespace: namespace,
// 				type: 'mock-queue',
// 				action: '',
// 				ack: ack,
// 				model: queueModel
// 			});
// 		};

// 		emitQueueModel('refresh');

// 		setInterval(() => {
// 			emitQueueModel('refresh');
// 		}, 2000);

// 		socket.on('client-message', (clientMessage) => {
// 			console.log('socket-server: ${ namespace }: client-message', clientMessage);
// 			const { type, action, model } = clientMessage;

// 			if (type === 'mock-queue') {
// 				const actionDelegate = actionStrategy[action];
// 				if (actionDelegate) {
// 					actionDelegate(model);
// 					emitQueueModel(action);
// 					const ackMessage = `socket-server: ${ namespace }: "${ action }" acknowledged`;
// 					console.log(ackMessage);
// 					emitQueueModel(ackMessage);
// 				} else {
// 					const ackMessage = `socket-server: ${ namespace }: WARNING: "${ action }" action not supported`;
// 					console.log(ackMessage);
// 					emitQueueModel(ackMessage);
// 				}
// 			}
// 		});
// 	})
// };

// module.exports = class WebpackPluginMockSocketServer {
// 	// Define `apply` as its prototype method which is supplied with compiler as its argument
// 	apply(compiler) {
// 		// Specify the event hook to attach to
// 		compiler.hooks.emit.tapPromise(
// 			'mock-socket-server',
// 			(compilation) => {
// 				return new Promise((resolve, reject) => {

// 					if (process.env.NODE_ENV !== 'production' && !ioServer) {
// 						setTimeout(() => {

// 							ioServer = io.listen(3100);
// 							initNamespaceMock(ioServer);
		
// 							ioServer.on('connection', (socket) => {
// 								console.log('socket-server: root: someone connected');
		
// 								socket.on('disconnect', () => {
// 									console.log('socket-server: root: someone disconnected');
// 								});
// 							});
							
// 						}, 250);
// 					}

// 					resolve(true);
// 				});
// 			}
// 		);
// 	}
// }
