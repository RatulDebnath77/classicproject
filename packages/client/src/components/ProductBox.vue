<script lang="ts" setup>
import { formatUnit, type Product } from '@commonproject/common'

interface Props {
  product: Product
}

const props = defineProps<Props>()
</script>

<template>
  <div
    style="
      border: 0.15rem solid coral;
      border-radius: 1rem;
      box-shadow: 0.1rem 0.1rem 0.5rem darkorange;
      height: 16.5rem;
      width: 10rem;
      padding: 0.5rem;
    "
  >
    <div style="height: 8rem; width: 10rem; outline: 0.25rem dashed darkgrey">hero image</div>
    <div style="margin-top: 1rem">
      <div style="height: 4rem">
        <div
          style="
            font-weight: bold;
            font-size: large;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            line-clamp: 2;
            overflow: hidden;
            color: darkorange;
          "
        >
          {{ product.productName }}
        </div>
        <div style="color: dimgray; font-size: smaller">
          {{ formatUnit(product.quantityInStock) }} left
        </div>
      </div>
      <div>
        <div
          style="
            color: orangered;
            font-size: small;
            padding-top: 1rem;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            line-clamp: 1;
            overflow: hidden;
          "
        >
          🚗 {{ product.productLine }}
        </div>
        <div
          style="
            color: orangered;
            font-size: small;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            line-clamp: 1;
            overflow: hidden;
          "
        >
          🏬 {{ product.productVendor }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
