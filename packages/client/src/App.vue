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
      return 'white'
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
  <div style="display: flex; justify-content: space-between">
    <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
    <p :style="{ backgroundColor: apiStateColor }">
      <strong>API Server:</strong> {{ APIState[apiState] }}
    </p>
  </div>
  <nav>
    <RouterLink :to="{ name: '/' }">Home</RouterLink>
    <RouterLink :to="{ name: '/about' }">About</RouterLink>
    <RouterLink :to="{ name: '/productLine' }">Product Lines</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
