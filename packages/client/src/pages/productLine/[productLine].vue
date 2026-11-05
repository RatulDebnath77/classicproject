<script lang="ts" setup>
import ProductTable from '@/components/ProductTable.vue'

definePage({ props: true })

interface Props {
  productLine: string
}
const props = defineProps<Props>()
</script>

<template>
  <ProductTable :productLine="props.productLine" />
</template>

<style scoped></style>
