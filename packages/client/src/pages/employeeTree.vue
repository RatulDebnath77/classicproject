<script lang="ts" setup>
import type { EmployeeNode } from '@commonproject/common'
import { onMounted, ref } from 'vue'
import { getEmployees } from '@/api.ts'
import EmployeeTreeNode from '@/components/EmployeeTreeNode.vue'

const tree = ref<EmployeeNode[]>([])

onMounted(async () => {
  tree.value = await getEmployees()
})
</script>

<template>
  <div style="display: flex; margin-left: 33%">
    <EmployeeTreeNode v-for="node in tree" :key="node.id" :node />
  </div>
</template>

<style scoped></style>
