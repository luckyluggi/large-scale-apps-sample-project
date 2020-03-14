export interface ISocketMessage<T> {
	clientId: string
	namespace: string
	type: string
	action: string
	ack: string
	model: T
}
