<template>
	<div class="sockets-playground">
		Sockets playground
		<div>
			<input type="text" v-model="keywords" />
			<button type="button" @click="onStartStream">Start Stream</button>
			<button type="button" @click="onStopStream">Stop Stream</button>
		</div>
		<ItemsListComponent :items="items" />

		<div class="canvases">
			<CanvasComponent ref="canvasComponent" class="client" @userDraw="onUserDraw" />
		</div>

		<div class="progress-bar" :style="progressStyle"></div>
		<div class="data" :text="progressText"></div>
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
	import ItemsListComponent from '@/components/items/ItemsList.component.vue'
	import CanvasComponent, { ICanvasComponent, ICanvasDrawInfo } from '@/components/canvas/Canvas.component.vue'

	@Component({
		components: {
			ItemsListComponent,
			CanvasComponent
		}
	})
    export default class SocketsPlayground extends Vue {
		private items: IItem[] = []
		private count: number = 0
		private socketClient!: SocketClient
		private keywords: string = 'javascript'
		private socketNamespace: string = 'mock'
		private messageType: string = 'canvas-stream'

		private progressStyle: {
			height: string
			width: string
			color: string
		} = {
			height: '8px',
			width: '10%',
			color: 'green'
		}

		private get progressText(): string {
			return ''
		}

		private get refCanvasComponent(): ICanvasComponent {
			return (this.$refs as any).canvasComponent as ICanvasComponent
		}

		mounted() {
			const socketClientArgs: ISocketClientArgs = {
				url: `http://192.168.1.12:3100/${ this.socketNamespace }`,
				onServerMessage: this.onServerMessage
			}

			console.log('socketClientArgs', socketClientArgs)

			this.socketClient = new SocketClient(socketClientArgs)
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

		private onServerMessage(response: ISocketMessage<any>) {
			//console.log('About view: onServerMessage', typeof response)
			const resp: ISocketMessage<any> = (typeof response === 'string' ? JSON.parse(response) : response)
			const ack: any = resp.ack
			const model: any = resp.model
			//console.log('my client', this.socketClient.id, 'other client', resp.clientId)
			
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

				case 'canvas-stream': {
					//console.log('About view: canvas-stream: onServerMessage: model', model)
					if (resp.clientId !== this.socketClient.id) {
						console.log('other client', resp.clientId)
						resp.model.strokeStyle = 'orange'
						this.refCanvasComponent.draw(resp.model)
					}
					//this.progressStyle.width = `${model.progress}%`
					break
				}

				default: {
					console.log('unhandled resp type', resp.type)
				}
			}
		}

		private onUserDraw(canvasDrawInfo: ICanvasDrawInfo) {
			this.sendMessageToServer<ICanvasDrawInfo>({
				action: 'draw',
				ack: '',
				model: canvasDrawInfo
			})
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

<style lang="scss">
	.progress-bar {
		height: 8px;
		width: 10%;
		background-color: green;
		outline: solid 1px lightgray;;
	}

	.canvases {
		display: grid;
		grid-template-columns: 50% 50%;;
	}
</style>
