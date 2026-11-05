<script setup lang="ts">
import { type Employee, formatCurrency, formatUSD } from '@commonproject/common'

interface Props {
  employee: Employee
  isMVP: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <div
    style="
      border: 0.25rem solid darkgreen;
      border-radius: 1rem;
      width: 18.5rem;
      height: 8rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0.25rem 0.25rem 0.5rem forestgreen;
      margin-bottom: 0.5rem;
    "
  >
    <div style="display: flex; align-items: center; height: fit-content">
      <div style="border: 0.1rem dashed darkgrey; width: 4rem; height: 4rem; border-radius: 2rem">
        profile image
      </div>
      <div style="display: flex; flex-direction: column; margin-left: 1rem">
        <div style="font-weight: bold; font-size: larger; color: darkolivegreen">
          {{ employee.employeeName }}
        </div>
        <div style="font-size: smaller; word-break: break-all">
          🏠 {{ employee.officeCity }}, {{ employee.officeCountry }}
        </div>
        <div style="font-size: smaller; word-break: break-all">
          📧
          <a>{{ employee.email }}</a>
        </div>
      </div>
    </div>
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        margin-top: 0.75rem;
        font-size: 2.5rem;
        width: 100%;
      "
    >
      <div style="margin-left: 1rem">
        <div v-if="isMVP">🏆</div>
      </div>
      <div style="margin-right: 4rem; font-weight: bold; color: seagreen">
        {{ formatUSD(employee.totalCreditLimit, true) }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
