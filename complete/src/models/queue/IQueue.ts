export interface IQueueItem {
	id: number
	name: string
	status: number
	progress: number
}

export interface IQueue {
	name: string
	description: string
	items: IQueueItem[]
}
