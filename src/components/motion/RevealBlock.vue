<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from '../../lib/motion'

withDefaults(defineProps<{ as?: string; delay?: number }>(), { as: 'div', delay: 0 })
const element = ref<HTMLElement>()
let ctx: gsap.Context | undefined
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(element.value!, { y: 22, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: element.value, start: 'top 94%', once: true } })
    })
  }, element.value)
})
onUnmounted(() => ctx?.revert())
</script>

<template><component :is="as" ref="element"><slot /></component></template>
