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
      height: 16rem;
      width: 10rem;
    "
  >
    <img
      :src="`https://picsum.photos/128?productName=${product.productName}`"
      :alt="`Image of ${product.productName}`"
      style="
        height: 8rem;
        width: 10rem;
        border-radius: 0.9rem 0.9rem 0 0;
        border-bottom: 0.15rem solid coral;
      "
    />
    <div style="margin: 0.5rem">
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
            padding-top: 0.25rem;
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
