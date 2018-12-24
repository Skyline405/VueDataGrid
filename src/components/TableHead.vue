<template>
	<div class="grid-header-wrapper">
		<div class="grid-header" ref="scrollNode">

			<table class="grid-header-table" ref="tableNode"
				cellpadding="0" cellspacing="0" border="0"
			>
				<colgroup>
					<col
						v-for="column in columns"
						:key="'col_' + column.id"
						:name="column.id"
						:width="getColumnWidth(column)"
					/>
				</colgroup>
				<thead>
					<tr>
						<th class="grid-cell"
							v-for="column in columns"
							:key="column.id"
						>
							<span class="grid-cell-content">{{ column.name }}</span>
							<span class="resize-handler"
								@mousedown.prevent="onMouseDown($event, column)"
							></span>
						</th>
					</tr>
				</thead>
			</table>

		</div>
	</div>
</template>

<script>
import _ from 'lodash'

export default {
	name: 'TableHead',
	props: {
		columns: Array,
		columnSizeMap: {
			type: Object,
			default: {}
		},
		scrollLeft: {
			type: Number,
			default: 0
		},
	},
	watch: {
		scrollLeft: {
			handler(screenLeft) {
				this.$refs.scrollNode.scrollLeft = screenLeft
			}
		}
	},
	computed: {
		tableWidth() {
			return _.sum(_.values(this.columnSizeMap))
		},
		clientRect() {
			return this.$refs.tableNode.getBoundingClientRect()
		}
	},
	methods: {
		onMouseDown(e, column) {
			const startX = e.clientX
			console.log('mousedown', startX)
			this.$emit('columnResize:start', this.calcRelativePosition(startX))

			const onMouseMove = e => {
				const posX = e.clientX
				const relativeX = this.calcRelativePosition(posX);

				this.$emit('columnResize:move', relativeX)
			}

			const onMouseUp = e => {
				const endX = e.clientX
				const delta = endX - startX

				console.log('mouseup', delta)

				this.$emit('columnResize:end', {
					column,
					width: this.columnSizeMap[column.id] + delta
				})

				document.removeEventListener('mousemove', onMouseMove)
				document.removeEventListener('mouseup', onMouseUp)
			}

			document.addEventListener('mousemove', onMouseMove)
			document.addEventListener('mouseup', onMouseUp)
		},
		calcRelativePosition(x) {
			return x - this.clientRect.x
		},
		getColumnWidth(column) {
			return Math.max.call(null,
				this.columnSizeMap[column.id] || 0,
				column.minWidth
			)
		}
	}
}
</script>

<style lang="scss" scoped>
	.grid-header-wrapper {
		padding-right: 15px;
		background: #f0f0f0;
		border-bottom: 1px solid lightgray;
		box-sizing: border-box;
	}

	.grid-header {
		overflow: hidden;
		border-right: 1px solid lightgray;

		.grid-cell {
			border-bottom: none;
		}
	}

	.grid-header-table {
		width: 1px;
		table-layout: fixed;
	}

	.resize-handler {
		position: absolute;
		//background: black;
		width: 5px;
		height: 100%;
		top: 0;
		right: 0;
		opacity: 0.5;
		cursor: col-resize;
	}
</style>
