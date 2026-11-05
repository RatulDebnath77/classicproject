<script lang="ts" setup>
import { formatUnit, formatUSD, type FullProduct, type ProductSold } from '@commonproject/common'
import { computed, ref, watchEffect } from 'vue'
import { getProductSold } from '@/api.ts'

interface Props {
  product: FullProduct
}

const props = defineProps<Props>()

const productSold = ref<ProductSold>()
const stars = computed(() => {
  if (!productSold.value || !props.product) return 0
  return ((productSold.value.lowestPrice - props.product.buyPrice) / props.product.buyPrice) * 5
})

watchEffect(async () => {
  productSold.value = await getProductSold(props.product.productCode)
})
</script>

<template>
  <div
    style="
      border: 0.25rem solid coral;
      border-radius: 1rem;
      width: 384px;
      height: 128px;
      padding: 1rem;
      display: flex;
      box-shadow: 0.25rem 0.25rem 0.5rem darkorange;
      margin-bottom: 0.5rem;
    "
  >
    <div
      style="
        border: 0.1rem dashed darkgrey;
        width: 8rem;
        height: 8rem;
        flex-shrink: 0;
        margin-right: 0.5rem;
      "
    >
      image
    </div>
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: end;
        align-items: start;
        width: 100%;
      "
    >
      <div>
        <div style="font-weight: bold; font-size: x-large; color: darkorange">
          {{ product.productName }}
        </div>
        <div
          v-if="productSold"
          style="font-size: small; color: grey; display: flex; align-items: center"
        >
          <div style="display: flex; align-items: end">
            <div style="color: gold">{{ stars >= 2.5 ? '★' : '☆' }}</div>
            {{ stars.toFixed(1) }} ({{ productSold.reviewCount }})
          </div>
          <div style="margin: 0.5rem">|</div>
          <div style="margin-top: 0.15rem">
            {{ formatUnit(productSold.productSold) }} sold in last month
          </div>
        </div>
      </div>
      <div style="display: flex; align-items: end; margin-top: auto; width: 100%">
        <div style="font-weight: bold; font-size: x-large; color: orangered">
          {{ formatUSD(product.buyPrice) }}
        </div>
        <div
          style="
            text-decoration: line-through;
            color: dimgray;
            margin-left: 0.5rem;
            margin-bottom: 0.15rem;
          "
        >
          {{ formatUSD(product.MSRP) }}
        </div>
        <button
          style="font-size: large; margin-left: auto; border-radius: 0.25rem; cursor: pointer"
        >
          🔗
        </button>
        <button
          style="font-size: large; margin-left: 0.25rem; border-radius: 0.25rem; cursor: pointer"
        >
          🛒
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
