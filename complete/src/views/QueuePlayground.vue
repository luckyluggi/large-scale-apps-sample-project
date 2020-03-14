<template>
	<div class="queue-playground">
		Queue playground
		<div class="debugging-queue-panel">
			<!-- this is just for testing the Queue panel -->
			<input type="text" ref="newItemName" value="A new queue item" />
			<button type="button" @click="addQueueItem">Add item</button>
		</div>
		<div class="debugging-queue-panel">
			<!-- this is just for testing the Queue panel -->
			<button type="button" @click="increaseProgress">Increase progress</button>
			<button type="button" @click="clearQueue">Clear Queue</button>
		</div>
		<QueuePanelComponent 
			:model="jobQueueModel" 
			addCssClasses="queue-panel white-card-bg" 
			@action="onQueuePanelAction"/>
	</div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'
	import { 
		SocketClient, 
		ISocketClientArgs, 
		ISocketMessage
	} from '@/models/sockets'
	import { IQueue, IQueueItem } from '@/models/queue/IQueue'
	import QueuePanelComponent from '@/components/queue/QueuePanel.component.vue'

	@Component({
		components: {
			QueuePanelComponent
		}
	})
    export default class QueuePlayground extends Vue {
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

		private onServerMessage(response: ISocketMessage<IQueue>) {
			console.log('QueuePlayground view: onServerMessage', typeof response)
			const resp: ISocketMessage<IQueue> = (typeof response === 'string' ? JSON.parse(response) : response)
			const { action, model, ack } = resp

			// on item
			switch (resp.type)
			{
				case this.messageType: {
					if (action === 'refresh') {
						console.log('received jobQueue model', model)
						this.jobQueueModel = model
					} else if (action === 'ack') {
						console.log('received ack', ack)
					}
					break;
				}

				default: {
					console.log('unhandled resp type', resp.type)
				}
			}
		}

		private sendMessageToServer<T>(args: {
			action: string,
			ack: string,
			model: T
		}) {
			this.socketClient.send({
				clientId: this.socketClient.id,
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

		private clearQueue() {
			console.log('clearQueue')
			this.sendActionToServer('clearQueue')
		}

		private increaseProgress() {
			this.sendActionToServer('increaseProgress')
		}

		private addQueueItem() {
			const name = (this.$refs.newItemName as any).value
			console.log('addQueueItem', name)
			this.onQueuePanelAction({
				action: 'add',
				model: {
					id: Math.max(...this.jobQueueModel.items.map(item => item.id)) + 1,
					name: name,
					status: -1,
					progress: 0
				}
			})
		}

		private onQueuePanelAction(params: {
			action: string,
			model: IQueueItem
		}) {
			const { action, model } = params
			console.log(`onQueuePanelAction ${ action}`); // JSON.parse(JSON.stringify(model)));

			this.sendMessageToServer({
				action: action,
				ack: '',
				model: model
			})
		}
	}
</script>

<style lang="scss">
	.queue-paneld {
		z-index: 99999999;
		position: absolute;
		bottom: 20px;
		left: 20px;
		height: fit-content;
		width: 390px;

		&.white-card-bg {
			background: white!important;
		}

		&.queue-panel {
			ul {
				list-style-type: none;
				padding: 0;
				margin: 0;
			}
		}
	}

	.debugging-queue-panel {
		width: 300px;
		display: grid;
		grid-template-columns: 70% 30%;
		grid-column-gap: 5px;
	}
</style>
