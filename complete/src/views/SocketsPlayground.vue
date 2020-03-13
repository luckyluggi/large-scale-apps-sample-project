<template>
	<div class="sockets-playground">
		Sockets playground
		<div>
			<input type="text" v-model="keywords" />
			<button type="button" @click="onStartStream">Start Stream</button>
			<button type="button" @click="onStopStream">Stop Stream</button>
		</div>
		<ItemsListComponent :items="items" />

		<QueuePanelComponent :model="jobQueueModel" />
	</div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'
	import { 
		SocketClient, 
		ISocketClientArgs, 
		ISocketMessage
	} from '@/models/sockets'
	import { IItem } from '@/models/items/IItem'
	import { IQueue } from '@/models/queue/IQueue'
	import ItemsListComponent from '@/components/items/ItemsList.component.vue'
	import QueuePanelComponent from '@/components/queue/QueuePanel.component.vue'

	@Component({
		components: {
			ItemsListComponent,
			QueuePanelComponent
		}
	})
    export default class SocketsPlayground extends Vue {
		private items: IItem[] = []
		private count: number = 0
		private socketClient!: SocketClient
		private keywords: string = 'javascript'
		private socketNamespace: string = 'mock'
		private messageType: string = 'mock-queue'

		private jobQueueModel: IQueue = {
			name: '',
			description: '',
			items: []
		}

		mounted() {
			const socketClientArgs: ISocketClientArgs = {
				url: `http://127.0.0.1:3100/${ this.socketNamespace }`,
				onServerMessage: this.onServerMessage
			}

			this.socketClient = new SocketClient(socketClientArgs)
		}

		private sendMessageToServer<T>(args: {
			action: string,
			ack: string,
			model: T
		}) {
			this.socketClient.send({
				namespace: this.socketNamespace,
				type: this.messageType,
				action: args.action,
				ack: args.ack || '',
				model: args.model || {}
			})
		}

		private sendActionToServer(action: string) {
			this.sendMessageToServer({
				action: action,
				ack: '',
				model: {}
			})
		}

		private onServerMessage(response: ISocketMessage<any>) {
			console.log('About view: onServerMessage', typeof response)
			const resp: ISocketMessage<any> = (typeof response === 'string' ? JSON.parse(response) : response)
			const model: any = resp.model;

			// on item
			switch (resp.type)
			{
				case 'item': {
					const max = 10;
					if (this.items.length > max) {
						this.items.splice(0, 1)
					}
					this.items.push(model as IItem)
					break
				}

				case 'mock-queue': {
					//console.log('reveiced jobQueue model', model);
					this.jobQueueModel = model as IQueue;
					break;
				}

				default: {
					console.log('unhandled resp type', resp.type)
				}
			}
		}

		onStartStream() {
			console.log('onStartStream')
			this.sendMessageToServer<any>({
				action: 'start-stream', 
				ack: '',
				model: {
					keywords: this.keywords
				} as any
			})
		}

		onStopStream() {
			console.log('onStopStream')
			this.sendActionToServer('stop-stream')
		}

		onItemAction(params: {
			action: string,
			model: IItem
		}) {
			const { action, model } = params
			console.log(`onItemAction ${ action}`) // JSON.parse(JSON.stringify(model)))
			// if (action === 'select') {
			// 	window.open(model.link, '_blank');
			// } else if (action === 'delete') {
			// 	this.items.splice(this.items.indexOf(model), 1)
			// }
		}
	}
</script>
