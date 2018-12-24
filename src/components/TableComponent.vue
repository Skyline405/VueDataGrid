<template>
  <div class="grid-wrapper">

		<div class="grid-column-resize-pointer"
			:style="{ display: resizePointerVisible ? 'block' : 'none', left: resizePointerLeft + 'px' }"
		></div>
		<!-- <div class="grid-column-resize-pointer"></div> -->

		<table class="grid-layout-table"
			cellpadding="0" cellspacing="0" border="0"
		>
			<tbody>
				<tr v-if="showHeader">
					<td style="height: 1px;">
						<table-head
							:columns="columns"
							:columnSizeMap="columnSizeMap"
							:scrollLeft="scrollLeft"
							@columnResize:start="onColumnResizeStart"
							@columnResize:move="onColumnResizeMove"
							@columnResize:end="onColumnResizeEnd"
						/>
					</td>
				</tr>
				<tr>
					<td>
						<table-body
							:columns="columns"
							:columnSizeMap="columnSizeMap"
							:data="data"
							:loading="loading"
							:scrollLeft.sync="scrollLeft"
							@bodyWidthChanged="onBodyWidthChanged"
						/>
					</td>
				</tr>
			</tbody>
		</table>

  </div>
</template>

<script>
import TableHead from './TableHead'
import TableBody from './TableBody'
import _ from 'lodash'

const defaultColumnParams = {
	sortable: false,
	formatter(rowData, col) {
		return rowData[col.id]
	},
	minWidth: 30
}

export default {
	name: 'TableComponent',
	components: {
		TableHead,
		TableBody,
	},
	props: {
		layout: Array,
		dataSource: Object,
		showHeader: {
			type: Boolean,
			default: true,
		}
	},
  data: () => ({
		data: [],
		columns: [],
		columnSizeMap: {},
		loading: false,
		resizePointerLeft: 0,
		resizePointerVisible: false,
		scrollLeft: 0,
	}),
	async mounted() {
		if (!this.dataSource) return
		this.data = await this.dataSource.getData(0, 100)
	},
	watch: {
		layout: {
			immediate: true,
			handler() {
				const newColSizeMap = {}

				this.columns = this.layout.map(col => {
					const column = {
						...defaultColumnParams,
						...col
					}

					newColSizeMap[column.id] = this.getColumnWidth(column)
					return column
				})

				this.columnSizeMap = newColSizeMap
			}
		}
	},
	computed: {

	},
	methods: {
		getColumnWidth(column) {
			return Math.max(column.width, column.minWidth)
		},
		onBodyWidthChanged(fullWidth) {
			let freeWidth = fullWidth
			let autoSized = []

			let newColSizeMap = {}

			this.columns.forEach(column => {
				if (column.width) {
					freeWidth -= column.width
					newColSizeMap[column.id] = this.getColumnWidth(column)
				} else {
					autoSized.push(column)
				}

			})

			let widthPerCol = freeWidth / autoSized.length
			autoSized.forEach(column => {
				newColSizeMap[column.id] = Math.max(widthPerCol, column.minWidth)
			})

			console.log('onBodyWidthChange', _.map(this.columns, c => c.width))

			this.columnSizeMap = newColSizeMap
		},
		onColumnResizeStart(posX) {
			this.resizePointerLeft = posX
			this.resizePointerVisible = true
		},
		onColumnResizeMove(posX) {
			this.resizePointerLeft = posX
		},
		onColumnResizeEnd({ column, width }) {
			this.resizePointerVisible = false
			this.columnSizeMap = {
				...this.columnSizeMap,
				[column.id]: width
			}
		},
	}
}
</script>

<style lang="scss" scoped>
	$border: 1px solid lightgray;

	.grid {
		&-wrapper {
			position: relative;
			box-sizing: border-box;
			border: $border;
			overflow: hidden;
		}

		&-layout-table {
			table-layout: fixed;
			width: 100%;
			height: 100%;
			max-height: 100%;
		}

		/deep/ &-cell {
			position: relative;
			padding: 6px;
			border-right: $border;
			border-bottom: $border;
			box-sizing: border-box;
			empty-cells: show;
			overflow: hidden;

			&-content {

			}
		}

		&-column-resize-pointer {
			width: 1px;
			border-left: 1px solid lightgray;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 10px;
			z-index: 999;
		}

  }
</style>
