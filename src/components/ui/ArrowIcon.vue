<script setup lang="ts">
type Direction = 'up-right' | 'up' | 'right' | 'down' | 'left'

const { direction = 'up-right' } = defineProps<{ direction?: Direction }>()

const rotations: Record<Direction, number> = {
  'up-right': 0,
  up: -45,
  right: 45,
  down: 135,
  left: -135,
}
</script>

<template>
  <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <g :transform="`rotate(${rotations[direction]} 12 12)`">
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </g>
  </svg>
</template>

<style scoped>
.arrow-icon{display:block;width:1em;height:1em;flex:none}
</style>
