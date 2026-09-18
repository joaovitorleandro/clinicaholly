<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from '../../lib/motion'

const element = ref<HTMLElement>()
let ctx: gsap.Context | undefined
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.matchMedia().add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const rx = gsap.quickTo(element.value!, 'rotateX', { duration: .9, ease: 'power3.out' })
      const ry = gsap.quickTo(element.value!, 'rotateY', { duration: .9, ease: 'power3.out' })
      const move = (event: PointerEvent) => {
        const box = element.value!.getBoundingClientRect()
        rx(-((event.clientY - box.top) / box.height - .5) * 6)
        ry(((event.clientX - box.left) / box.width - .5) * 8)
      }
      const leave = () => { rx(0); ry(0) }
      element.value?.addEventListener('pointermove', move)
      element.value?.addEventListener('pointerleave', leave)
      return () => { element.value?.removeEventListener('pointermove', move); element.value?.removeEventListener('pointerleave', leave) }
    })
  }, element.value)
})
onUnmounted(() => ctx?.revert())
</script>

<template><div class="tilt-perspective"><div ref="element" class="tilt-card"><slot /></div></div></template>
<style scoped>.tilt-perspective{perspective:1000px}.tilt-card{transform-style:preserve-3d}</style>
