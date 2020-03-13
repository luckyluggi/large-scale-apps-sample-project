<template>
	<li :class="css">
		<div class="item-grid">
			<div class="status">{{ model.status }}</div>
			<div class="name">{{ model.name }} {{ model.progress }}</div>
			<div class="remove" @click="onRemoveClick">
				Remove
			</div>
		</div>
		<div class="item-progress"><div class="bar" :style="progressBarWidth"></div></div>
	</li>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'
	import { IQueueItem } from '@/models/queue/IQueue'

	@Component
    export default class QueueItemComponent extends Vue {
		@Prop() model!: IQueueItem

		private get progressBarWidth(): string {
			return `width: ${ this.model.progress }%`
		}

		private statusCssMap: { [key: number]: string } = {
			0: '',
			1: 'queued',
			2: 'working',
			3: 'warning',
			4: 'danger',
			5: 'success'
		}

		private get css(): string {
			let css = 'job-item'
			if (this.model.status > -1) {
			 	css += ` ${ this.statusCssMap[this.model.status] }`
			}
			return css.trim()
		}

		onRemoveClick() {
			console.log('onRemoveClick')
			this.$emit('action', {
				action: 'remove',
				model: this.model
			})
		}
	}
</script>

<style lang="scss">

	$color-queued: lightblue;
	$color-working: yellow;
	$color-warning: orange;
	$color-danger: red;
	$color-success: lightgreen;
	

	li.job-item {
		padding: 0;
		outline: solid 1px #EEE;
		transition: background-color .3s ease;
		cursor: pointer;

		.item-grid {
			display: grid;
			grid-template-columns: 20px auto 60px;
		}

		.item-progress {
			display: flex;
			width: 100%;
			height: 4px;
			background-color: rgba(#00bcd4,.2);
			> .bar {
				display: flex;
				transition: width .5s ease;
				background-color: #00bcd4;
			}
		}

		.name {
			padding: 5px;
			text-align: left;
		}
		.status,
		.remove {
			padding: 5px;
			color: lightgray;
		}

		.remove {
			cursor: pointer;
			outline: soid 1px red;
			&:hover {
				background-color: #F99;
			}
		}

		&.queued {
			.status {
				background: $color-queued;
				color: white;
			}
		}
		&.working {
			.status {
				background: $color-working;
				color: white;
			}
		}
		&.warning {
			.status {
				background: $color-warning;
				color: white;
			}
		}
		&.danger {
			.status {
				background: $color-danger;
				color: white;
			}
		}
		&.success {
			.status {
				background: $color-success;
				color: black;
			}

			.item-progress {
				background-color: rgba($color-success,.2);
				> .bar {
					background-color: $color-success;
				}
			}
		}
		
		&:hover {
			background-color: #EEE;
		}
	}
</style>
