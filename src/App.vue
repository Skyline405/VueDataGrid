<template>
	<div style="height: 80vh; width: 80vw; resize: both; overflow: hidden; padding: 10px; border: 1px solid gray;">
		<table-component
			:dataSource="dataSource"
			:layout="layout"
		></table-component>

		<!-- <v-table></v-table> -->

	</div>
</template>

<script>
import TableComponent from './components/DataGrid/TableComponent'
import VTable from './components/VTable'

import DataSource from './DataSource'

export default {
  name: 'app',
  components: {
		TableComponent,
		VTable
  },
  data: () => ({
		layout: [
			{ id: 'id', name: '#', width: 50 },
			{
				id: 'name', name: 'Name', width: 100, minWidth: 250, sortable: true,
			},
			{
				id: 'age', name: 'Age', width: 200,
				formatter: (data, col) => `${data.age} <span style="color: gray">years old</span>`
			},
			{
				id: 'active', name: 'Active', width: 300,
				formatter: (data) => `<input type="checkbox" checked="${data.active + ''}" /> ${data.active}` // TODO
			},
			{
				id: 'admin', name: 'Admin', width: 70,
			},
		],
    dataSource: new DataSource({ delay: 0 })
  })
}
</script>

<style lang="scss">
	body {
		// height: 2000px;
	}

</style>
