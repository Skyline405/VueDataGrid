<script>
export default {
	name: 'TableBody',
	props: {
		columns: Array,
		columnSizeMap: {
			type: Object,
			default: {}
		},
		data: {
			type: Array,
			default: []
		},
		loading: false,
	},
	data: () => ({
		scrollHeight: 0,
		lastBodyWidth: 0,
		lastScrollLeft: 0,
		isScrollAtBottom: false,
	}),
	created() {
		// no reactive
		this.nativeEventMap = {
			'scroll': this.onScroll.bind(this)
		}
	},
	async mounted() {
		await this.$nextTick()
		this.checkBodyWidth()
		this.$refs.wrapperNode.addEventListener('scroll', this.nativeEventMap.scroll)
	},
	updated() {
		this.checkBodyWidth()
	},
	beforeDestroy() {
		this.$refs.wrapperNode.removeEventListener('scroll', this.nativeEventMap.scroll)
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
		}
	},
	render(h) {
		return <div class="grid-body-wrapper" ref="wrapperNode">
			<div class="grid-body" ref="bodyNode">
				{
					this.data.length > 0 &&
					<table class="grid-body-table"
						cellpadding="0" cellspacing="0" border="0"
					>
						<colgroup>
							{
								this.columns.map((column, i) => (
									<col key={i}
										name={column.id}
										width={this.getColumnWidth(column)}
									/>
								))
							}
						</colgroup>
						<tbody>
							{
								this.data.map((item, rowIndex) => (
									<tr class="grid-row hover" key={item.id}>
										{
											this.columns.map((column, colIndex) => {
												const context = { item, column, rowIndex }
												return <td class="grid-cell" key={colIndex} style={column.style(context)}>
													{
														column.formatter &&
														column.formatter(h, context)
													}
												</td>
											})
										}
									</tr>
								))
							}
						</tbody>
					</table>
				}

			</div>
		</div>
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
