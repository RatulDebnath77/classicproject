<script setup lang="ts">
definePage({ props: true })

interface Props {
  employeeNumber: string
}

const props = defineProps<Props>()
</script>

<template>{{ employeeNumber }}</template>

<style scoped></style>
