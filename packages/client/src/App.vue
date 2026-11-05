<script lang="ts" setup>
import './assets/styles.css'
import { getHealth, getPing } from '@/api.ts'
import { computed, onMounted, onUnmounted, ref } from 'vue'

enum APIState {
  Unknown,
  Offline,
  Online,
  Healthy,
}

const apiState = ref(APIState.Unknown)
const apiStateColor = computed(() => {
  switch (apiState.value) {
    case APIState.Offline:
      return 'red'
    case APIState.Online:
      return 'yellow'
    case APIState.Healthy:
      return 'green'
    default:
      return 'orange'
  }
})

let intervalId: number | undefined

onMounted(() => {
  setTimeout(computeAPIState)
  intervalId = setInterval(computeAPIState, 5000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

async function computeAPIState() {
  try {
    await getPing()
    try {
      const json = await getHealth()
      apiState.value = json.health ? APIState.Healthy : APIState.Online
    } catch {
      apiState.value = APIState.Online
    }
  } catch {
    apiState.value = APIState.Offline
  }
}
</script>

<template>
  <nav style="display: flex; justify-content: space-between">
    <RouterLink :to="{ name: '/' }" style="font-weight: bold">Home</RouterLink>
    <RouterLink :to="{ name: '/employeeTree' }">Employee Tree</RouterLink>
    <RouterLink :to="{ name: '/employees' }">Sales Reps</RouterLink>
    <RouterLink :to="{ name: '/productLine' }">Product Lines</RouterLink>
    <div style="display: flex; margin-left: auto">
      <div style="font-weight: bold">API Server:&nbsp;</div>
      <div
        style="border-radius: 0.5rem; padding: 0 0.25rem"
        :style="{ backgroundColor: `color-mix(in srgb, ${apiStateColor} 66%, transparent)` }"
      >
        {{ APIState[apiState] }}
      </div>
    </div>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
