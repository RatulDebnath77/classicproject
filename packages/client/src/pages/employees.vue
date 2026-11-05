<script lang="ts" setup>
import { computed, onMounted, ref, watchEffect } from 'vue'
import type { Employee } from '@commonproject/common'
import { getSalesReps } from '@/api.ts'
import EmployeeCard from '@/components/EmployeeCard.vue'

const employees = ref<Employee[]>([])
const maxCredit = computed(() => {
  return Math.max(...employees.value.map((employee) => Number(employee.totalCreditLimit)))
})

onMounted(async () => {
  employees.value = await getSalesReps()
})

async function onLink(event: Event) {
  const link = event.currentTarget as HTMLInputElement
  if (event.type == 'mouseenter') {
    link.style.scale = '1.05'
  } else if (event.type == 'mouseleave') {
    link.style.scale = '1'
  }
}
</script>

<template>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap">
    <RouterLink
      :to="{
        name: '/employee/[employeeNumber]',
        params: { employeeNumber: employee.employeeNumber },
      }"
      v-for="employee of employees"
      :key="employee.employeeNumber"
      style="text-decoration: none; transition-duration: 150ms"
      @mouseenter="onLink"
      @mouseleave="onLink"
    >
      <EmployeeCard :employee="employee" :isMVP="maxCredit == employee.totalCreditLimit" />
    </RouterLink>
  </div>
</template>

<style scoped></style>
