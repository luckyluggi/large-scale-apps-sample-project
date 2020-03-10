<template>
	<div class="queue-panel">
		<h3>{{ model.name }}</h3>
		<ul>
			<QueueItemComponent v-for="item in model.items" 
				:key="item.id" 
				:model="item"/>
		</ul>
	</div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'
	import { IQueue } from '@/models/queue/IQueue'
	import QueueItemComponent from '@/components/queue/children/QueueItem.component.vue'

	@Component({
		components: {
			QueueItemComponent
		}
	})
    export default class QueuePanelComponent extends Vue {
		@Prop({
			default: () => {
				return {
					name: '',
					items: []
				}
			}
		}) model!: IQueue
		
	}
</script>

<style lang="scss">
	.queue-panel {
		position: absolute;
		bottom: 20px;
		right: 20px;
		padding: 20px;
		border: solid 1px lightgray;
		border-radius: 10px;
		background: white;
		height: 250px;
		width: 250px;
	}
</style>
