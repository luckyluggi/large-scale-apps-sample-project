import * as SocketIo from 'socket.io-client'

export interface ISocketServerMessage<T> {
	namespace: string
	type: string
	data: T
}

export interface ISocketClientMessage<T> {
	type: string
	data: T
}

export interface ISocketClientArgs {
	url: string
	onServerMessage: (data: any) => void
}

export interface ISocketClient {
	send: (message: any) => void
}

export class SocketClient {
	private socket: any;

	constructor(args: ISocketClientArgs) {
		if (!this.socket) {
			const { url, onServerMessage } = args
			this.socket = (<any>SocketIo)(url)
			this.socket.on('server-message', onServerMessage)
		}
	}

	send<T>(message: ISocketClientMessage<T>) {
		console.log('SocketClient: send client-message', JSON.stringify(message))
        this.socket.emit('client-message', message)
    }
}

