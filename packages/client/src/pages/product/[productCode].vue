<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { FullProduct } from '@commonproject/common'
import { getProduct } from '@/api.ts'

definePage({ props: true })

interface Props {
  productCode: string
}
const props = defineProps<Props>()

const loading = ref(true)
const product = ref<FullProduct>()

watch(
  () => props.productCode,
  async () => {
    loading.value = false

    try {
      product.value = await getProduct(props.productCode)
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <h2>{{ product ? product.productName : props.productCode }}</h2>
  <nav style="display: flex; justify-content: space-between">
    <RouterLink
      v-if="product"
      :to="{ name: '/productLine/[productLine]', params: { productLine: product.productLine } }"
      style="margin-left: auto"
      >{{ product.productLine }}</RouterLink
    >
  </nav>
  <main>
    <div v-if="loading">Loading {{ props.productCode }}...</div>
    <div v-else>
      <div v-if="product">
        <p>Name: {{ product.productName }}</p>
        <p>Quantity: {{ product.quantityInStock }}</p>
        <br />
        <p>Buying Price: ${{ product.buyPrice }}</p>
        <p>Selling Price: ${{ product.MSRP }}</p>
        <br />
        <p>
          Markup:
          {{ (((product.MSRP - product.buyPrice) / product.buyPrice) * 100).toFixed(2) }}%
        </p>
        <p>
          Estimated Profit: ${{
            ((product.MSRP - product.buyPrice) * product.quantityInStock).toFixed(2)
          }}
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
