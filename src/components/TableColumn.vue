<template>
  <th class="column">
    <slot></slot>
  </th>
</template>

<script>
export default {
  name: 'TableColumn',
  props: {
    field: String,
  }
}
</script>

<style lang="scss" scoped>
  .column {
    padding: 4px;
  }
</style>
