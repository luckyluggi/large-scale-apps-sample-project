<template>
	<div class="canvas-wrapper">
		<canvas ref="canvas" :width="width" :height="height"></canvas>
		<slot></slot>
	</div>
</template>
<script lang="ts">
	import { Component, Prop, Vue } from 'vue-property-decorator'

	export interface ICanvasDrawInfo {
		prevX: number
		prevY: number
		currX: number
		currY: number
		flag: boolean
		dot_flag: boolean,
		strokeStyle: string,
		lineWidth: number
	}

	export interface ICanvasComponent {
		draw(drawParams: ICanvasDrawInfo): void
	}

	@Component
	export default class CanvasComponent extends Vue implements ICanvasComponent {
		@Prop({ default: '700px' }) width!: string
		@Prop({ default: '200px' }) height!: string

		private canvas: any
		private context: any

		private drawInfo: ICanvasDrawInfo = {
			prevX: 0,
			prevY: 0,
			currX: 0,
			currY: 0,
			flag: false,
			dot_flag: false,
			strokeStyle: 'blue',
			lineWidth: 2
		}
		
		// private get css(): string {
		// 	let css = 'item'
		// 	if (this.model.selected) {
		// 		css += ' selected'
		// 	}
		// 	return css.trim()
		// }

		mounted() {
			this.initCanvas()
		}

		draw(drawParams: ICanvasDrawInfo) {
			const ctx = this.context
			if (ctx) {
				const { 
					prevX, 
					prevY, 
					currX, 
					currY,
					strokeStyle,
					lineWidth
				} = drawParams
				ctx.beginPath()
				ctx.moveTo(prevX, prevY)
				ctx.lineTo(currX, currY)
				ctx.strokeStyle = strokeStyle
				ctx.lineWidth = lineWidth
				ctx.stroke()
				ctx.closePath()
			}
		}

		private onUserDraw() {
			this.$emit('userDraw', this.drawInfo)
			this.draw(this.drawInfo)
		}

		private onMouseEvent(type: string, e: MouseEvent) {
			const {
				currX,
				currY
			} = this.drawInfo

			const canvas = this.canvas
			const ctx = this.context

			if (type == 'down') {
				this.drawInfo.prevX = currX
				this.drawInfo.prevY = currY
				this.drawInfo.currX = e.clientX - canvas.offsetLeft
				this.drawInfo.currY = e.clientY - canvas.offsetTop
		
				this.drawInfo.flag = true
				// this.drawInfo.dot_flag = true
				// if (this.drawInfo.dot_flag) {
				// 	ctx.beginPath()
				// 	ctx.fillStyle = x
				// 	ctx.fillRect(currX, currY, 2, 2)
				// 	ctx.closePath()
				// 	this.drawInfo.dot_flag = false
				// }
			}
			if (type == 'up' || type == 'out') {
				this.drawInfo.flag = false
			}
			if (type == 'move') {
				if (this.drawInfo.flag) {
					this.drawInfo.prevX = currX
					this.drawInfo.prevY = currY
					this.drawInfo.currX = e.clientX - canvas.offsetLeft
					this.drawInfo.currY = e.clientY - canvas.offsetTop
					this.onUserDraw()
				}
			}
		}

		private initCanvas() {
			this.canvas = this.$refs.canvas
			this.context = this.canvas.getContext('2d')

			this.canvas.addEventListener('mousemove', (e: any) => {
				// console.log('mousemove event', e)
				// console.log('mousemove event', {
				// 	offsetX: e.offsetX,
				// 	offsetY: e.offsetY
				// })
				this.onMouseEvent('move', e)
			}, false)

			this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
				//console.log('mousedown event', e)
				this.onMouseEvent('down', e)
			}, false)

			this.canvas.addEventListener('mouseup', (e: MouseEvent) => {
				this.onMouseEvent('up', e)
			}, false)

			this.canvas.addEventListener('mouseout', (e: MouseEvent) => {
				this.onMouseEvent('out', e)
			}, false)
		}
	}
</script>

<style lang="scss">
	.canvas-wrapper > canvas {
		outline: solid 1px lightgray;
	}
</style>
