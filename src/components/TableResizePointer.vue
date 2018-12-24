<template>
	<div class="grid-column-resize-pointer"
		:style="{ display: isVisible ? 'block' : 'none', left: left + 'px' }"
	></div>
</template>

<script>
export default {
	name: 'TableResizePointer',
	model: {
		prop: 'model',
		event: 'input'
	},
	props: {
		model: Object,
	},
	computed: {
		isVisible() {
			return this.model.visible
		},
		left() {
			return this.model.left
		}
	}
}
</script>
