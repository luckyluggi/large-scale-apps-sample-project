<template>
	<li :class="css" @click="onClick">
		<div class="status">{{ model.status }}</div>
		<div class="name">{{ model.name }}</div>
	</li>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'
	import { IQueueItem } from '@/models/queue/IQueue'

	@Component
    export default class QueueItemComponent extends Vue {
		@Prop() model!: IQueueItem

		private statusCssMap = {
			1: '',
			2: 'working',
			3: 'warning',
			4: 'danger'
		}

		private get css(): string {
			let css = 'job-item'
			if (this.model.status > 1) {
			 	css += ' selected'
			}
			return css.trim()
		}

		onClick() {
			this.$emit('click', this.model)
		}
	}
</script>

<style lang="scss">
	li.job-item {
		padding: 0;
		outline: solid 1px #EEE;
		display: grid;
		grid-template-columns: 1.7em auto;
		cursor: pointer;
		transition: background-color .3s ease;

		.name {
			padding: 5px;
			text-align: left;
		}
		.status {
			padding: 5px;
			color: lightgray;

			&.working {
				background: orange;
				color: white;
			}
			&.warning {
				background: orange;
				color: white;
			}
			&.danger {
				background: red;
				color: white;
			}
			&.success {
				background: lightgreen;
				color: black;
			}
		}
		&:hover {
			background-color: #EEE;
		}
	}
</style>
