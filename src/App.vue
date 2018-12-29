<template>
	<div>
		<div style="height: 80vh; width: 80vw; resize: both; overflow: hidden; padding: 10px; border: 1px solid gray;">
			<table-component
				:dataSource="dataSource"
				:layout="layout"
			></table-component>
		</div>
		<div>
			Selection: {{ selectdIdList }}
		</div>
		<div>
			<button @click="appendColumn">Append column</button>
		</div>
	</div>
</template>

<script>
import TableComponent from './components/DataGrid/TableComponent'
import TableColumn from './components/DataGrid/TableColumn'
import VTable from './components/VTable'

import DataSource from './DataSource'

export default {
  name: 'app',
  components: {
		TableComponent,
		TableColumn,
		VTable
  },
  data: (vm) => ({
		selectdIdList: [1],
		layout: [
			{
				id: 'id', name: '#', width: 50, resizable: false,
				formatter: (h, { item }) => (
					<input type="checkbox"
						checked={vm.selectdIdList.indexOf(item.id) > -1}
						{...{ on: { change: () => vm.setSelected(item) } }}
					/>
				)
			},
			{
				id: 'name', name: 'Name', width: 100, minWidth: 250, sortable: true,
				style: ({ item }) => ({ backgroundColor: item.active ? 'lightgreen' : 'coral' })
			},
			{
				id: 'age', name: 'Age', width: 200,
				formatter: (h, { item, column, style }) => [item.age, ' ', <span style="color: gray">years old</span>],
				style: ({ item }) => ({
					color: item.age > 50 ? 'red' : 'green'
				})
			},
			{
				id: 'active', name: 'Active', width: 100,
				formatter: (h, { item, column: { id } }) => <input type="checkbox" checked={ item[id] } />
			},
			{
				id: 'company', name: 'Company', width: 250,
				style: ({ item }) => ({ backgroundColor: item.company === 'Navitel' ? 'lightgreen' : '' })
			},
			{
				id: 'admin', name: 'Admin', width: 70,
				formatter: (h, { item, column: { id } }) => <input type="checkbox" checked={ item[id] } />
			},
		],
    dataSource: new DataSource({ delay: 0 })
	}),
	methods: {
		appendColumn() {
			const index = _.random(1, 5)
			this.layout.push(_.assign({}, this.layout[index]))
		},
		setSelected(item) {
			const index = this.selectdIdList.indexOf(item.id)
			if (index > -1) {
				this.selectdIdList.splice(index, 1)
			} else {
				this.selectdIdList.push(item.id)
			}
		}
	}
}
</script>

<style lang="scss">

</style>
