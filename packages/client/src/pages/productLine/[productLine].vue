<script lang="ts" setup>
import ProductTable from '@/components/ProductTable.vue'
</script>

<template>
  <ProductTable :productLine="$route.params.productLine" />
</template>

<style scoped></style>
