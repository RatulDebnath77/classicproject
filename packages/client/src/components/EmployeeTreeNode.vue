<script setup lang="ts">
import type { EmployeeNode } from '@commonproject/common'
import { ref } from 'vue'

interface Props {
  node: EmployeeNode
}

const props = defineProps<Props>()

const expand = ref(true)
</script>

<template>
  <div style="margin-left: 1rem; line-height: 1.5rem">
    <div style="display: flex; align-items: center">
      <div
        style="margin-right: 0.5rem; width: 1rem; user-select: none"
        @click="expand = !expand"
        :style="{ cursor: node.employees.length ? 'pointer' : 'default' }"
      >
        {{ node.employees.length ? (expand ? '➖' : '➕') : '&nbsp;' }}
      </div>
      <div style="display: flex">
        <div style="margin: 0 0.25rem">
          {{ node.employees.length ? '👥' : '👤' }}
        </div>
        <RouterLink
          :to="{ name: '/employee/[employeeNumber]', params: { employeeNumber: node.id } }"
          style="margin: 0.1rem; width: 12rem"
        >
          <div style="font-weight: bold">{{ node.name }}</div>
        </RouterLink>
      </div>
    </div>
    <div v-if="expand">
      <EmployeeTreeNode
        v-for="employee in node.employees"
        :key="employee.id"
        :node="employee"
      ></EmployeeTreeNode>
    </div>
  </div>
</template>

<style scoped></style>
