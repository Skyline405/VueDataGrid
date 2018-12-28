<script>
const DEFAULT_RENDER_CELL = (h, { item, cell, index }) => {
	if (cell.formatter) {
		return cell.formatter(h, item, cell, index)
	}
	return item[cell.id]
}



export default {
	name: 'TableColumn',
	functional: true,
	// abstract: true,
	props: {
		id: String,
		name: {
			type: String,
			default: ''
		},
		width: Number,
		minWidth: {
			type: Number,
			default: 30
		},
		sortable: {
			type: Boolean,
			default: false
		},
		resizable: {
			type: Boolean,
			default: true
		},
		item: Object,
		index: Number,

	},
	created() {
		// console.log('column', this.$slots, $scopedSlots)
	},
	methods: {
		// renderHeader(h, props) {
		// 	return <td>

		// 	</td>
		// },
		renderCell(h, props) {
			let renderCell = null;

			if (this.$scopedSlots.default) {
				renderCell = () => this.$scopedSlots.default(props)
			} else {
				renderCell = DEFAULT_RENDER_CELL
			}

			return <td>
				{
					renderCell(h, props)
				}
			</td>
		}
	},
	render(h, context) {
		// console.log('Cell:', context)
		return <td>Hello</td>
	},
	// renderCell(h, props) {
	// 		let renderCell = null;

	// 		if (this.$scopedSlots) {
	// 			renderCell = () => this.$scopedSlots.default(props)
	// 		} else {
	// 			renderCell = DEFAULT_RENDER_CELL
	// 		}

	// 		return <td>
	// 			{
	// 				renderCell(h, props)
	// 			}
	// 		</td>
	// 	}

}
</script>
