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
		ISocketClientMessage, 
		ISocketServerMessage 
	} from '@/models/sockets/ISocketClient'
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

		private jobQueueModel: IQueue = {
			name: '',
			items: []
		}

		mounted() {
			const socketClientArgs: ISocketClientArgs = {
				url: 'http://127.0.0.1:3100/mock',
				onServerMessage: this.onServerMessage
			}

			this.socketClient = new SocketClient(socketClientArgs)
		}

		private onServerMessage(response: ISocketServerMessage<any>) {
			console.log('About view: onServerMessage', typeof response)
			const resp = (typeof response === 'string' ? JSON.parse(response) : response)
			const data = resp.data

			// on item
			switch (resp.type)
			{
				case 'item': {
					const max = 10
					if (this.items.length > max) {
						this.items.splice(0, 1);
					}
					this.items.push(data)
					break;
				}

				case 'queue': {
					console.log('reveiced jobQueue data', data)
					this.jobQueueModel = data
					break;
				}

				default: {
					console.log('unhandled resp type', resp.type)
				}
			}
		}

		onStartStream() {
			const message: ISocketClientMessage<any> = {
				type: 'start-stream',
				data: {
					keywords: this.keywords
				}
			}
			console.log('onStartStream', message)
			this.socketClient.send<any>(message)
		}

		onStopStream() {
			const message: ISocketClientMessage<any> = {
				type: 'stop-stream',
				data: {}
			}
			console.log('onStopStream', message)
			this.socketClient.send<any>(message)
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
