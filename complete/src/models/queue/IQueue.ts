export interface IQueueItem {
	id: number
	name: string
	status: number
}

export interface IQueue {
	name: string
	items: IQueueItem[]
}
