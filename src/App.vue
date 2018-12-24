<template>
	<div style="height: 98vh">
		<table-component
			:dataSource="dataSource"
			:layout="layout"
		></table-component>

	</div>
</template>

<script>
import TableComponent from './components/TableComponent'

import DataSource from './DataSource'

export default {
  name: 'app',
  components: {
    TableComponent,
  },
  data: () => ({
		layout: [
			{ id: 'id', name: '#', width: 50 },
			{
				id: 'name', name: 'Name', width: 500
			},
			{
				id: 'age', name: 'Age', width: 100,
				formatter: (data, col) => `${data.age} <span style="color: gray">years old</span>`
			},
			{
				id: 'active', name: 'Active', width: 200,
				formatter: (data) => `<input type="checkbox" checked="${data.active + ''}" /> ${data.active}` // TODO
			},
			{
				id: 'admin', name: 'Admin', width: 70,
			},
		],
    // data: [
    //   { id: 0, name: 'Вася', age: 30 },
    //   { id: 1, name: 'Петя', age: 32 },
    //   { id: 2, name: 'Михаил', age: 45 },
    //   { id: 3, name: 'Аркадий', age: 25 },
    // ],
    dataSource: new DataSource({ delay: 0 })
  })
}
</script>

<style lang="scss">
	body {
		height: 2000px;
		// padding-left: 200px;
	}

</style>
