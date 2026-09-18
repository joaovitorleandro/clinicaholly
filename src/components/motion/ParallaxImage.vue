<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { gsap } from '../../lib/motion'

const props = withDefaults(defineProps<{
  src: string; alt: string; width?: number; height?: number; position?: string; speed?: number; scale?: number;
  direction?: 'vertical' | 'horizontal'; mouseParallax?: boolean; scrollParallax?: boolean; sizes?: string;
}>(), { width: 1122, height: 1402, position: '50% 50%', speed: 5, scale: 1.08, direction: 'vertical', mouseParallax: false, scrollParallax: true, sizes: '(max-width: 767px) 100vw, 50vw' })
const frame = ref<HTMLElement>()
const image = ref<HTMLImageElement>()
const srcset = computed(() => `${props.src.replace('.webp', '-640.webp')} 640w, ${props.src.replace('.webp', '-960.webp')} 960w, ${props.src} ${props.width}w`)
let ctx: gsap.Context | undefined
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.matchMedia().add({ desktop: '(min-width: 768px)', reduce: '(prefers-reduced-motion: reduce)' }, (context) => {
      if (context.conditions?.reduce || !context.conditions?.desktop) return
      if (props.scrollParallax) {
        const axis = props.direction === 'horizontal' ? 'xPercent' : 'yPercent'
        gsap.fromTo(image.value!, { [axis]: -props.speed, scale: props.scale }, { [axis]: props.speed, ease: 'none', scrollTrigger: { trigger: frame.value, start: 'top bottom', end: 'bottom top', scrub: true } })
      }
      if (!props.mouseParallax || !window.matchMedia('(pointer: fine)').matches) return
      const x = gsap.quickTo(image.value!, 'x', { duration: .9, ease: 'power3.out' })
      const y = gsap.quickTo(image.value!, 'y', { duration: .9, ease: 'power3.out' })
      const move = (event: PointerEvent) => {
        const bounds = frame.value!.getBoundingClientRect()
        x(((event.clientX - bounds.left) / bounds.width - .5) * 10)
        y(((event.clientY - bounds.top) / bounds.height - .5) * 10)
      }
      const leave = () => { x(0); y(0) }
      frame.value?.addEventListener('pointermove', move)
      frame.value?.addEventListener('pointerleave', leave)
      return () => { frame.value?.removeEventListener('pointermove', move); frame.value?.removeEventListener('pointerleave', leave) }
    })
  }, frame.value)
})
onUnmounted(() => ctx?.revert())
</script>

<template>
  <div ref="frame" class="parallax-image" :style="{ aspectRatio: `${width} / ${height}` }">
    <img ref="image" :src="src" :srcset="srcset" :sizes="sizes" :alt="alt" :width="width" :height="height" :style="{ objectPosition: position }" loading="lazy" decoding="async" />
  </div>
</template>

<style scoped>
.parallax-image{position:relative;overflow:hidden;background:var(--warm);width:100%}
img{width:100%;height:100%;object-fit:cover;transform:scale(1.01)}
</style>
