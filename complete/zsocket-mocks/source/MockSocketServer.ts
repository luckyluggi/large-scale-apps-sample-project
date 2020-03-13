import * as io from 'socket.io'

import { 
	SocketClient, 
	ISocketClientArgs, 
	ISocketMessage
} from '../../src/models/sockets'

export interface IMockSocketServerArgs {
	port: number
}

export interface IMockSocketServer {
	initNamespace(namespace: string): any
}

export class MockSocketServer implements IMockSocketServer {
	private ioServer: any

	constructor(args: IMockSocketServerArgs) {
		this.ioServer = io.listen(args.port)

		this.ioServer.on('connection', (socket: any) => {
			console.log('MockSocketServer: root: someone connected')

			socket.on('disconnect', () => {
				console.log('MockSocketServer: root: someone disconnected')
			})
		})
	}

	initNamespace(namespace: string): any {
		const mockNamespaceServer = this.ioServer.of(`/${ namespace }`)
		return mockNamespaceServer
	}

}