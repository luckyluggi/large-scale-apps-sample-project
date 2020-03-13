import * as SocketIo from 'socket.io-client'
import { ISocketMessage } from './ISocketMessage'

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

	send<T>(message: ISocketMessage<T>) {
		console.log('SocketClient: send client-message', JSON.stringify(message))
        this.socket.emit('client-message', message)
    }
}
