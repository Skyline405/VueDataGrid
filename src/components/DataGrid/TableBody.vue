<template>
	<div class="grid-body-wrapper" ref="wrapperNode" @scroll.passive="onScroll">

		<div class="grid-body" ref="bodyNode">

			<template v-if="data.length > 0">
				<table class="grid-body-table"
					cellpadding="0" cellspacing="0" border="0"
				>
					<colgroup>
						<col
							v-for="(column, i) in columns"
							:key="i"
							:name="column.id"
							:width="getColumnWidth(column)"
						/>
					</colgroup>
					<tbody>
						<tr class="grid-row hover"
							v-for="row in data"
							:key="row.id"
						>
							<td class="grid-cell"
								v-for="(column, i) in columns"
								:key="i"
							>
								<span class="grid-cell-content"
									v-html="column.formatter(row, column)"
								></span>
							</td>
						</tr>
					</tbody>
				</table>
			</template>

		</div>

	</div>
</template>

<script>
export default {
	name: 'TableBody',
	props: {
		columns: Array,
		columnSizeMap: {
			type: Object,
			default: {}
		},
		data: Array,
		loading: false,
	},
	data: () => ({
		scrollHeight: 0,
		lastBodyWidth: 0,
		lastScrollLeft: 0,
		isScrollAtBottom: false,
	}),
	async mounted() {
		await this.$nextTick()
		this.checkBodyWidth()
	},
	updated() {
		this.checkBodyWidth()
	},
	computed: {
		bodyWidth() {
			return this.$refs.bodyNode.offsetWidth
		}
	},
	methods: {
		checkBodyWidth() {
			if (this.lastBodyWidth !== this.bodyWidth) {
				this.$emit('bodyWidthChanged', this.bodyWidth)
				this.lastBodyWidth = this.bodyWidth
			}
		},
		getColumnWidth(column) {
			return Math.max.call(null,
				this.columnSizeMap[column.id] || 0,
				column.minWidth
			)
		},
		onScroll(e) {
			const scrollLeft = this.$refs.wrapperNode.scrollLeft

			if (scrollLeft !== this.lastScrollLeft) {
				this.$emit('scrollLeft', scrollLeft)
				this.lastScrollLeft = scrollLeft
			}

			// const scrollTop = this.$refs.wrapperNode.scrollTop
			// const scrollHeight = this.$refs.wrapperNode.scrollHeight
			// const bodyHeight = this.$refs.bodyNode.offsetHeight

			// const scrollBottom = scrollTop + bodyHeight
			// if (scrollBottom >= scrollHeight) {
			// 	console.log('At bottom')
			// 	this.$emit('reachBottom')
			// }
		}
	}
}
</script>

<style lang="scss" scoped>
	.grid-body-wrapper {
		height: 100%;
		width: 100%;
		overflow-x: auto;
		overflow-y: scroll;
		box-sizing: border-box;
	}

	.grid-body-container {
		height: 100%;
		width: 100%;
	}

	.grid-body {
		position: relative;
		height: 100%;
	}

	.grid-body-table {
		width: 1px;
		table-layout: fixed;
	}

	.grid-row {
		&.hover:hover {
			background: #f7f7f7;
		}
	}
</style>
