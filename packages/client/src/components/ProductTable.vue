<script lang="ts" setup>
import { deleteProductLine, getProducts } from '@/api.ts'
import { computed, ref, watchEffect } from 'vue'
import type { Product } from '@commonproject/common'
import { useRouter } from 'vue-router'
import ProductBox from '@/components/ProductBox.vue'

interface Props {
  productLine?: string
}
const props = defineProps<Props>()

const router = useRouter()

enum StockSort {
  Unknown,
  Ascending,
  Descending,
  MAX,
}

const loading = ref(true)
const products = ref<Product[]>([])
const page = ref(1)

const stockSort = ref(StockSort.Unknown)
const sortStockSymbol = computed(() => {
  switch (stockSort.value) {
    case StockSort.Ascending:
      return '↑'
    case StockSort.Descending:
      return '↓'
    default:
      return '≡'
  }
})
const sortStockString = computed(() => {
  switch (stockSort.value) {
    case StockSort.Ascending:
      return 'asc'
    case StockSort.Descending:
      return 'desc'
    default:
      return ''
  }
})

async function updateProducts() {
  loading.value = true

  try {
    const prods = await getProducts(props.productLine, page.value, sortStockString.value)
    if (page.value === 1 || prods.length) {
      products.value = prods
    } else {
      page.value -= 1 // FIXME
    }
  } finally {
    loading.value = false
  }
}

async function onSort() {
  stockSort.value = (stockSort.value + 1) % StockSort.MAX
}

async function onDelete() {
  const productLine = props.productLine!
  if (!window.confirm(`Are you sure you want to delete ${productLine}?`)) {
    return
  }
  loading.value = true

  try {
    await deleteProductLine(productLine)
    router.push({ name: '/productLine' })
  } finally {
    loading.value = false
  }
}

async function onLink(event: Event) {
  const link = event.currentTarget as HTMLInputElement
  if (event.type == 'mouseenter') {
    link.style.scale = '1.05'
  } else if (event.type == 'mouseleave') {
    link.style.scale = '1'
  }
}

watchEffect(updateProducts)
</script>

<template>
  <nav style="display: flex; justify-content: space-between; align-items: center">
    <div style="font-weight: bold">{{ props.productLine ?? 'All Products' }}</div>
    <button
      :disabled="loading || page === 1"
      style="margin-left: auto"
      type="button"
      @click="page -= 1"
    >
      &lt; Prev
    </button>
    <p style="margin: 0 0.5rem">{{ page }}</p>
    <button :disabled="loading" type="button" @click="page += 1">Next ></button>
    <button :disabled="loading || !props.productLine" style="margin-left: 0.5rem" @click="onDelete">
      Delete
    </button>
    <button :disabled="loading" style="margin-left: 0.5rem" type="button" @click="updateProducts">
      Refresh
    </button>
  </nav>
  <main>
    <!--    <div style="display: flex; justify-content: space-between; margin: 20px">-->
    <!--      <div>Product</div>-->
    <!--      <div>-->
    <!--        Stock <button @click="onSort" type="button">{{ sortStockSymbol }}</button>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <hr />-->
    <!--    <div-->
    <!--      v-for="product of products"-->
    <!--      :key="product.productCode"-->
    <!--      style="display: flex; justify-content: space-between; margin: 20px"-->
    <!--    >-->
    <!--      <RouterLink-->
    <!--        :to="{ name: '/product/[productCode]', params: { productCode: product.productCode } }"-->
    <!--        :title="product.productDescription"-->
    <!--        >{{ product.productName }}</RouterLink-->
    <!--      >-->
    <!--      <div>{{ product.quantityInStock.toLocaleString() }}</div>-->
    <!--    </div>-->
    <div style="display: flex; flex-flow: row wrap; gap: 0.5rem; justify-content: start">
      <RouterLink
        v-for="product of products"
        :key="product.productCode"
        :title="product.productDescription"
        :to="{ name: '/product/[productCode]', params: { productCode: product.productCode } }"
        style="margin: 0.25rem; text-decoration: none; transition-duration: 150ms"
        @mouseenter="onLink"
        @mouseleave="onLink"
      >
        <ProductBox :product="product"></ProductBox>
      </RouterLink>
    </div>
  </main>
</template>

<style scoped></style>
