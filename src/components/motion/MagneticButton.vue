<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from '../../lib/motion'

withDefaults(defineProps<{ href: string; variant?: 'gold' | 'outline' | 'light'; external?: boolean }>(), { variant: 'gold', external: true })
const element = ref<HTMLAnchorElement>()
let ctx: gsap.Context | undefined
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.matchMedia().add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const x = gsap.quickTo(element.value!, 'x', { duration: .5, ease: 'power3.out' })
      const y = gsap.quickTo(element.value!, 'y', { duration: .5, ease: 'power3.out' })
      const move = (event: PointerEvent) => {
        const rect = element.value!.getBoundingClientRect()
        x(((event.clientX - rect.left) / rect.width - .5) * 8)
        y(((event.clientY - rect.top) / rect.height - .5) * 6)
      }
      const leave = () => { x(0); y(0) }
      element.value?.addEventListener('pointermove', move)
      element.value?.addEventListener('pointerleave', leave)
      return () => { element.value?.removeEventListener('pointermove', move); element.value?.removeEventListener('pointerleave', leave) }
    })
  }, element.value)
})
onUnmounted(() => ctx?.revert())
</script>

<template>
  <a ref="element" class="magnetic-button" :class="`button-${variant}`" :href="href" :target="external ? '_blank' : undefined" :rel="external ? 'noopener noreferrer' : undefined">
    <span class="button-label"><slot /></span><span class="button-arrow" aria-hidden="true">↗</span>
  </a>
</template>

<style scoped>
.magnetic-button{position:relative;display:inline-flex;align-items:center;justify-content:space-between;gap:32px;min-height:56px;padding:18px 27px;border:1px solid transparent;font-size:10px;font-weight:600;letter-spacing:.12em;line-height:1.6;text-transform:uppercase;overflow:hidden;isolation:isolate;transition:border-color .3s,color .3s}
.magnetic-button::before{content:'';position:absolute;inset:0;background:var(--ivory);transform:translateY(102%);transition:transform .4s cubic-bezier(.2,.65,.3,1);z-index:-1}
.magnetic-button:hover::before{transform:translateY(0)}
.button-gold{color:var(--ink);background:#cfb27d}
.button-outline{color:var(--ivory);background:transparent;border-color:rgb(227 210 144 / 45%)}
.button-light{color:var(--ink);background:var(--ivory)}
.button-light::before{background:#cfb27d}
.button-outline:hover{color:var(--ink);border-color:var(--ivory)}
.button-arrow{font-size:19px;line-height:1;transition:transform .3s}
.magnetic-button:hover .button-arrow{transform:translate(3px,-3px)}
@media(max-width:767px){.magnetic-button{min-height:54px;padding:16px 23px;font-size:9px;gap:28px}}
</style>
