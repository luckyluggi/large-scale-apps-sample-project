import { 
	SocketClient, 
	ISocketClientArgs, 
	ISocketMessage
} from '../../src/models/sockets'

import {
	IMockSocketServerArgs,
	MockSocketServer
} from './MockSocketServer'

import { 
	IQueue,
	IQueueItem
} from '../../src/models/queue/IQueue'

import {
	MockQueue
} from './MockQueue'

import * as io from 'socket.io'

let ioServer: any = undefined
let mockServer: any
let mockQueue: MockQueue

export default class WebpackPluginMockSocketServer {

	// Define `apply` as its prototype method which is supplied with compiler as its argument
	apply(compiler: any) {
		
		// Specify the event hook to attach to
		compiler.hooks.emit.tapPromise(
			'mock-socket-server',
			(compilation: any) => {

				return new Promise((resolve: any, reject: any) => {

					if (process.env.NODE_ENV !== 'production' && !mockServer) {
						setTimeout(() => {

							const args: IMockSocketServerArgs = {
								port: 3100
							}

							mockServer = new MockSocketServer(args)

							const namespace = 'mock'
							const mockNamespaceServer = mockServer.initNamespace(namespace)

							// create our mocked queue
							mockQueue = new MockQueue()

							mockNamespaceServer.on('connection', (socket: any) => {
								console.log(`MockSocketServer: ${ namespace }: someone connected`);

								socket.on('disconnect', () => {
									console.log(`MockSocketServer: ${ namespace }: someone disconnected`);
								})

								const emitQueueModel = (ack: string) => {
									const socketMessage: ISocketMessage<IQueue> = {
										namespace: namespace,
										type: 'mock-queue',
										action: 'refresh',
										ack: ack,
										model: mockQueue.Model
									}

									socket.emit('server-message', socketMessage)
								}

								setInterval(() => {
									emitQueueModel('refresh');
								}, 2000); // TODO: might want to use a variable for the intervale value

								const akcnowledgeAction = (ack: string) => {
									const socketMessage: ISocketMessage<IQueue> = {
										namespace: namespace,
										type: 'mock-queue',
										action: 'ack',
										ack: ack,
										model: mockQueue.Model
									}

									socket.emit('server-message', socketMessage)
								}

								socket.on('client-message', (clientMessage: ISocketMessage<IQueueItem>) => {
									console.log('socket-server: ${ namespace }: client-message', clientMessage);
									const { type, action, model } = clientMessage;

									if (type === 'mock-queue') {
										mockQueue.doAction(action, model)
											.then((ack: string) => {
												akcnowledgeAction(ack)
											})
											.catch((ack: string) => {
												akcnowledgeAction(ack)
											})
									}
								})
							})

							
						}, 250);
					}

					resolve(true);
				});
			}
		);
	}
}
