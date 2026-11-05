<script lang="ts" setup>
import {
  type History,
  formatPercent,
  formatUnit,
  formatUSD,
  type Order,
  formatDate,
} from '@commonproject/common'
import { computed, onMounted, ref } from 'vue'
import { getHistory, getOrders } from '@/api.ts'

definePage({ props: true })

interface Props {
  customerNumber: string
}

const props = defineProps<Props>()

const history = ref<History[]>([])
const orders = ref<Order[]>([])

const groupedHistory = computed<{ [key: string]: History[] }>(() =>
  Object.groupBy(history.value, (entry: History) => entry.date),
)

function sum(entries: History[]) {
  let sum = 0
  entries.forEach((entry) => {
    sum += (entry.type === 'credit' ? 1 : -1) * Number(entry.amount)
  })
  return sum
}

onMounted(async () => {
  ;[history.value, orders.value] = await Promise.all([
    getHistory(props.customerNumber),
    getOrders(props.customerNumber),
  ])
})
</script>

<template>
  <div style="display: flex; flex-direction: column; align-items: center">
    <div style="width: 75%">
      <div style="font-size: xx-large; font-weight: bold; margin: 1rem">History</div>
      <div
        v-for="(entries, date) in groupedHistory"
        :key="date"
        style="display: flex; flex-direction: row; margin: 1rem"
      >
        <div style="font-size: larger; width: 6rem">
          <div>{{ formatDate(date) }}</div>
          <div
            style="font-weight: bold"
            :style="{ color: sum(entries) > 0 ? 'darkgreen' : 'darkred' }"
          >
            {{ formatUSD(sum(entries), false, 'exceptZero') }}
          </div>
        </div>
        <div style="margin-left: 1rem">
          <div>
            <div v-for="entry in entries" :key="entry.id">
              <div v-if="entry.type === 'credit'">
                Credited {{ formatUSD(entry.amount) }} from {{ entry.id }}
              </div>
              <div v-else>
                <a :href="`#${entry.id}`">Debited {{ formatUSD(entry.amount) }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table style="border-spacing: 0">
      <caption style="font-size: x-large; font-weight: bold">
        Orders
      </caption>
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Current Price</th>
          <th>Order Price</th>
          <th>Order Quantity</th>
          <th>Grand Total</th>
          <th>Delivery Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.orderNumber" :id="order.orderNumber.toString()">
          <td style="display: flex">
            <img
              :alt="`Image of ${order.productName}`"
              :src="`https://picsum.photos/32?productName=${order.productName}`"
              style="width: 2rem; height: 2rem; border-radius: 0.25rem"
            />
            <div style="display: flex; flex-direction: column; margin-left: 0.25rem">
              <div style="font-weight: bold">
                <RouterLink
                  :to="{
                    name: '/product/[productCode]',
                    params: { productCode: order.productCode },
                  }"
                  >{{ order.productName }}</RouterLink
                >
              </div>
              <div style="font-size: x-small">{{ order.productCode }}</div>
            </div>
          </td>
          <td>
            <RouterLink
              :to="{
                name: '/productLine/[productLine]',
                params: { productLine: order.productLine },
              }"
              >{{ order.productLine.slice(0, -1) }}</RouterLink
            >
          </td>
          <td>{{ formatUSD(order.MSRP) }}</td>
          <td>
            <div style="display: flex; align-items: end">
              <div style="font-weight: bold">{{ formatUSD(order.priceEach) }}</div>
              <div style="margin-left: auto; font-style: italic; font-size: smaller">
                {{ formatPercent((order.priceEach - order.MSRP) / order.MSRP) }}
              </div>
            </div>
          </td>
          <td style="text-align: right">{{ formatUnit(order.quantityOrdered) }}</td>
          <td style="font-weight: bold">
            {{ formatUSD(order.priceEach * order.quantityOrdered) }}
          </td>
          <td
            :style="{ textDecoration: order.status == 'Shipped' ? 'line-through' : 'default' }"
            style="text-align: center"
          >
            {{ order.status }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
:target {
  background-color: yellow;
  transition: background-color 1s;
}

th {
  font-size: larger;
  padding: 0 1rem;
}

td {
  border: 0.1rem solid dimgrey;
  border-radius: 0.5rem;
  padding: 0.25rem;
}
</style>
