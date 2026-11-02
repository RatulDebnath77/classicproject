<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getProductLines, postProductLine } from '@/api.ts'
import type { ProductLine } from '@commonproject/common'
import ProductTable from '@/components/ProductTable.vue'

const loading = ref(true)
const adding = ref(false)
const productLines = ref<ProductLine[]>([])
const newProductLine = ref('')

onMounted(updateProductLines)

async function addProductLine() {
  if (adding.value) {
    loading.value = true
    try {
      await postProductLine(newProductLine.value)
      adding.value = false
      newProductLine.value = ''
      setTimeout(updateProductLines)
    } catch {
      alert(`Failed to add product line: ${newProductLine.value}`)
    } finally {
      loading.value = false
    }
  } else {
    adding.value = true
  }
}

async function updateProductLines() {
  loading.value = true

  try {
    productLines.value = await getProductLines()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <h2>Product Lines</h2>
  <nav style="display: flex; justify-content: space-between">
    <RouterLink
      v-for="productLine in productLines"
      :key="productLine.productLine"
      :to="{
        name: '/productLine/[productLine]',
        params: { productLine: productLine.productLine },
      }"
      :title="productLine.textDescription"
      >{{ productLine.productLine }}</RouterLink
    >
    <div style="margin-left: auto">
      <input v-if="adding" :disabled="loading" v-model="newProductLine" type="text" />
      <button
        v-if="!adding || newProductLine"
        :disabled="loading"
        @click="addProductLine"
        type="button"
        style="width: 50px"
      >
        Add
      </button>
      <button v-else @click="adding = false" type="button">Close</button>
    </div>
    <button :disabled="loading" @click="updateProductLines" type="button" style="margin-left: 5px">
      Refresh
    </button>
  </nav>
  <main>
    <RouterView v-if="'productLine' in $route.params" />
    <ProductTable v-else />
  </main>
</template>

<style scoped></style>
