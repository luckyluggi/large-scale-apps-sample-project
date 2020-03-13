import { 
	IQueue,
	IQueueItem
} from '../../src/models/queue/IQueue'

import { mockUtils } from './MockUtils'

import { 
	SocketClient, 
	ISocketClientArgs, 
	ISocketMessage
} from '../../src/models/sockets'

export interface IMocQueue {
	Model: IQueue
	doAction(action: string, model: IQueueItem): Promise<string>
}

export class MockQueue {
	private namespace: string = 'mock'

	private queueModel: IQueue = {
		name: 'Mocked Queue',
		description: 'A mocked job queue',
		items: [1,2].map((d: number) => {
			let progress = mockUtils.getRandomInt(100)
			let status = 3
			if (progress < 100) {
				status = mockUtils.getStatusFromProgress(progress)
				if (status === 5) {
					progress = 100
				}
			}
			
			return {
				id: d,
				name: `${ d } a queue item`,
				status: status,
				progress: progress
			} as IQueueItem
		}).reverse()
	}

	private actionStrategy: { [key: string]: (item: IQueueItem) => void } = {
		add: (item: IQueueItem) => {
			item.status = Number(item.status)
			this.queueModel.items.push(item)
		},
		remove: (item: IQueueItem) => {
			const index = this.queueModel.items.map(item => item.id).indexOf(item.id);
			console.log('remove at index', index)
			this.queueModel.items.splice(index, 1)
		},
		// clearQueue: (item: IQueueItem) => {
		// 	this.queueModel.items = []
		// },
		increaseProgress: (item: IQueueItem) => {
			this.queueModel.items.forEach((item: IQueueItem) => {
				if (item.progress === 0)
				{
					item.progress = 10
				}

				let newProgress = Math.round(Number(item.progress) * 1.2)
				if (newProgress > 100) {
					newProgress = 100
				}

				let newStatus = mockUtils.getStatusFromProgress(item.progress)
				if (newStatus > 5) {
					newStatus = 5
					newProgress = 100
				}
				item.progress = newProgress
				item.status = newStatus
			})
		}
	}

	get Model(): IQueue {
		return this.queueModel
	}

	constructor() {
		
	}

	async doAction(action: string, model: IQueueItem): Promise<string> {
		return new Promise<string>((resolve: any, reject: any) => {
			const actionDelegate = this.actionStrategy[action]
			if (actionDelegate) {
				actionDelegate(model)
				//const ackMessage = `MockSocketServer: ${ this.namespace }: "${ action }" acknowledged`
				const ackMessage = `MockQueue: "${ action }" acknowledged`
				console.log(ackMessage)
				resolve(ackMessage)
			} else {
				const ackMessage = `MockQueue: WARNING: "${ action }" action not supported`
				reject(ackMessage)
			}
		})
	}
}
