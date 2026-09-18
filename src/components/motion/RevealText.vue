<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from '../../lib/motion'

withDefaults(defineProps<{ as?: string }>(), { as: 'h2' })
const element = ref<HTMLElement>()
let ctx: gsap.Context | undefined
onMounted(() => {
  ctx = gsap.context(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(element.value!, { y: 34, opacity: 0, duration: .95, ease: 'power3.out', scrollTrigger: { trigger: element.value, start: 'top 93%', once: true } })
    })
  }, element.value)
})
onUnmounted(() => ctx?.revert())
</script>

<template><component :is="as" ref="element" class="reveal-text"><slot /></component></template>
