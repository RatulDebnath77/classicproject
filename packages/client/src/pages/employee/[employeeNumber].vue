<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { type Customer, formatUSD } from '@commonproject/common'
import { getCustomers } from '@/api.ts'

definePage({ props: true })

interface Props {
  employeeNumber: string
}

const props = defineProps<Props>()

const customers = ref<Customer[]>([])

onMounted(async () => {
  customers.value = await getCustomers(parseInt(props.employeeNumber))
})
</script>

<template>
  <div style="display: flex; justify-content: center">
    <table style="border: 0.1rem solid dimgrey; border-radius: 0.25rem; padding: 0.5rem">
      <caption>
        <div style="font-weight: bold; font-size: x-large; margin-bottom: 1rem">Customers</div>
      </caption>
      <thead>
        <tr>
          <th>🏢 Company</th>
          <th>🧑‍💼 Contact</th>
          <th>📞 Phone</th>
          <th>📍 Address</th>
          <th>💵 Credit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer.customerNumber">
          <td>
            <RouterLink
              :to="{
                name: '/customer/[customerNumber]',
                params: { customerNumber: customer.customerNumber },
              }"
              >{{ customer.customerName }}</RouterLink
            >
          </td>
          <td>{{ customer.contactName }}</td>
          <td>
            <a :href="`tel:${customer.phone}`">{{ customer.phone }}</a>
          </td>
          <td>
            {{ customer.city }},{{ customer.state ? ` ${customer.state},` : '' }}
            {{ customer.country }}
          </td>
          <td>{{ formatUSD(customer.creditLimit) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
td {
  border-top: 0.1rem solid dimgrey;
  padding: 0.25rem;
}
</style>
