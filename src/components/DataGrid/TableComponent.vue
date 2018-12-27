<template>
  <div class="grid">
		<div class="grid-wrapper">

			<table-resize-pointer v-model="resizePointerModel" />

			<table-head v-if="showHeader"
				:columns="columns"
				:columnSizeMap="columnSizeMap"
				:scrollLeft="scrollLeft"
				@columnResize:start="onColumnResizeStart"
				@columnResize:move="onColumnResizeMove"
				@columnResize:end="onColumnResizeEnd"
			/>

			<table-body
				:columns="columns"
				:columnSizeMap="columnSizeMap"
				:data="data"
				:loading="loading"
				@bodyWidthChanged="onBodyWidthChanged"
				@scrollLeft="updateScrollLeft"
				@reachBottom="fetchData"
			/>

		</div>
  </div>
</template>

<script>
import TableHead from './TableHead'
import TableBody from './TableBody'
import TableResizePointer from './TableResizePointer'

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
		TableResizePointer,
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
		resizePointerModel: {
			left: 0,
			visible: false,
		},
		scrollLeft: 0,
	}),
	created() {
		this.fetchData()
	},
	async mounted() {

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
	methods: {
		async fetchData() {
			if (!this.dataSource) return
			let data = await this.dataSource.getData(this.data.length, 10)
			this.data = [...this.data, ...data]
		},
		getColumnWidth(column) {
			return Math.max.call(null,
				this.columnSizeMap[column.id] || 0,
				column.minWidth,
				column.width,
			)
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

			this.columnSizeMap = newColSizeMap
		},
		onColumnResizeStart(posX) {
			this.resizePointerModel = {
				left: posX,
				visible: true
			}
		},
		onColumnResizeMove(posX) {
			this.resizePointerModel = {
				...this.resizePointerModel,
				left: posX
			}
		},
		onColumnResizeEnd({ column, width }) {
			this.resizePointerModel = {
				...this.resizePointerModel,
				visible: false
			}
			this.columnSizeMap = {
				...this.columnSizeMap,
				[column.id]: width
			}
		},
		updateScrollLeft(scrollLeft) {
			this.scrollLeft = scrollLeft
		}
	}
}
</script>

<style lang="scss" scoped>
	$border: 1px solid lightgray;

	.grid {
		overflow: hidden;
		height: 100%;

		&-wrapper {
			display: flex;
			flex-direction: column;
			position: relative;
			box-sizing: border-box;
			border: $border;
			overflow: hidden;
			height: 100%;
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
		}

		&-column-resize-pointer {
			width: 1px;
			border-left: $border;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 10px;
			z-index: 999;
		}

  }
</style>
