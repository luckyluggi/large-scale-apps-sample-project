export interface ISocketMessage<T> {
	namespace: string
	type: string
	action: string
	ack: string
	model: T
}
