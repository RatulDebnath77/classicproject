<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { formatPercent, formatUSD, type FullProduct } from '@commonproject/common'
import { getProduct } from '@/api.ts'
import ProductCard from '@/components/ProductCard.vue'

definePage({ props: true })

interface Props {
  productCode: string
}
const props = defineProps<Props>()

const loading = ref(true)
const product = ref<FullProduct>()

async function updateProduct() {
  loading.value = false

  try {
    product.value = await getProduct(props.productCode)
  } finally {
    loading.value = false
  }
}

watchEffect(updateProduct)
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
    <button :disabled="loading" style="margin: 0 0.5rem" type="button">Update</button>
    <button :disabled="loading" type="button" @click="updateProduct">Refresh</button>
  </nav>
  <main>
    <div v-if="loading">Loading {{ props.productCode }}...</div>
    <div v-else>
      <div v-if="product">
        <p>Name: {{ product.productName }}</p>
        <p>
          Quantity: {{ product.quantityInStock.toLocaleString() }}
          <button style="margin: 0.5rem" type="button">-</button><button type="button">+</button>
        </p>
        <br />
        <p>
          Buying Price:
          {{ formatUSD(product.buyPrice) }}
        </p>
        <p>
          Selling Price:
          {{ formatUSD(product.MSRP) }}
        </p>
        <br />
        <p>
          Markup Percentage:
          {{ formatPercent((product.MSRP - product.buyPrice) / product.buyPrice) }}
        </p>
        <p>
          Estimated Profit:
          {{ formatUSD((product.MSRP - product.buyPrice) * product.quantityInStock) }}
        </p>
        <ProductCard :product="product" />
      </div>
    </div>
  </main>
</template>

<style scoped></style>
