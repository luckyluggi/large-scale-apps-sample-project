<template>
	<div :addCssClasses="addCssClasses">
		<div class="card-header">
			<h2 automationid="lbl-queue-header" class="trans-text">Queue</h2>
			<h4 automationid="lbl-queue-title">
				{{ model.name }}
			</h4>
			<p class="card-description">{{ model.description }}</p>
		</div>
		<div class="card-body">
            <ul>
				<QueueItemComponent v-for="item in model.items" 
					:key="item.id" 
					:model="item"
					@action="onItemAction" />
			</ul>
        </div>
	</div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'
	import { IQueue, IQueueItem } from '@/models/queue/IQueue'
	import QueueItemComponent from '@/components/queue/children/QueueItem.component.vue'

	@Component({
		components: {
			QueueItemComponent
		}
	})
    export default class QueuePanelComponent extends Vue {
		@Prop() addCssClasses!: string
		@Prop({
			default: () => {
				return {
					name: '',
					description: '',
					items: []
				}
			}
		}) model!: IQueue

		private onItemAction(params: {
			action: string,
			model: IQueueItem
		}) {
			console.log('onItemAction')
			this.$emit('action', params)
		}
		
	}
</script>
