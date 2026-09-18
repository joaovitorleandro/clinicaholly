<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from '../lib/motion'
import { clinic } from '../data/clinic'
import RevealText from '../components/motion/RevealText.vue'
import RevealBlock from '../components/motion/RevealBlock.vue'
import MagneticButton from '../components/motion/MagneticButton.vue'
import HollyStar from '../components/ui/HollyStar.vue'

const root = ref<HTMLElement>()
let context: gsap.Context | undefined
let media: gsap.MatchMedia | undefined

onMounted(() => {
  context = gsap.context(() => {
    media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.cta-orbit', { rotate: -17, scale: .97 }, { rotate: 13, scale: 1.03, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: 1.4 } })
      gsap.fromTo('.cta-star-track', { rotate: -28 }, { rotate: 27, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: 1.2 } })
    })
  }, root.value)
})
onBeforeUnmount(() => { media?.revert(); context?.revert() })
</script>

<template>
  <section id="contato" ref="root" class="final-cta" aria-labelledby="final-cta-title">
    <svg class="cta-orbit" viewBox="0 0 1300 800" fill="none" aria-hidden="true"><ellipse cx="650" cy="400" rx="626" ry="295" transform="rotate(-16 650 400)" /><ellipse cx="650" cy="400" rx="644" ry="321" transform="rotate(-16 650 400)" /></svg>
    <div class="cta-star-track" aria-hidden="true"><HollyStar /></div>
    <div class="container final-cta-content">
      <RevealBlock class="cta-label"><HollyStar /><p class="eyebrow">O próximo passo é seu</p></RevealBlock>
      <RevealText id="final-cta-title">O seu novo sorriso<br>pode começar <em>hoje.</em></RevealText>
      <RevealBlock><MagneticButton :href="clinic.whatsapp" variant="light">Falar com a Holly</MagneticButton></RevealBlock>
      <span class="final-cta-note eyebrow">HOLLY — ESTÉTICA INTEGRADA</span>
    </div>
  </section>
</template>

<style scoped>
.final-cta{position:relative;isolation:isolate;background:radial-gradient(ellipse at 60% 52%,#1b1711 0%,var(--ink) 66%);color:var(--ivory);min-height:760px;display:flex;align-items:center;padding:clamp(110px,12vw,200px) 0 clamp(90px,10vw,165px);overflow:hidden}.final-cta-content{position:relative;z-index:2;text-align:center}.cta-label{display:flex;align-items:center;justify-content:center;gap:13px;margin-bottom:43px}.cta-label :deep(svg){width:16px;height:16px;color:var(--champagne)}.cta-label .eyebrow{font-size:9px;color:#b7ab94;margin:0}.final-cta h2{font-size:clamp(3.5rem,7.35vw,9.3rem);line-height:1.02;letter-spacing:-.035em;margin:0 0 45px}.final-cta h2 em{color:var(--champagne)}.final-cta-note{display:block;margin-top:90px;font-size:7px;color:#a69b85;letter-spacing:.25em}.cta-orbit{position:absolute;width:110%;max-width:none;left:-5%;height:auto;top:50%;margin-top:-34%;stroke:#a78651;stroke-width:.6;opacity:.24;pointer-events:none;z-index:0;transform-origin:50% 50%}.cta-orbit ellipse:last-child{opacity:.3}.cta-star-track{position:absolute;z-index:1;inset:8% 6%;pointer-events:none;transform-origin:50% 50%}.cta-star-track :deep(svg){position:absolute;right:7%;top:32%;width:31px;height:31px;color:var(--champagne)}
@media(min-width:1600px){.final-cta{min-height:850px}.cta-orbit{margin-top:-34%}}
@media(max-width:1023px){.final-cta{min-height:680px}.final-cta h2{font-size:5.1rem}.cta-orbit{width:150%;left:-25%;margin-top:-47%}.cta-star-track :deep(svg){right:0;top:20%;width:24px;height:24px}}
@media(max-width:767px){.final-cta{min-height:610px;padding:110px 0 85px}.cta-label{margin-bottom:33px;gap:10px}.cta-label .eyebrow{font-size:8px}.cta-label :deep(svg){height:13px;width:13px}.final-cta h2{font-size:clamp(2.8rem,10.7vw,4.8rem);line-height:1.07;margin-bottom:34px}.final-cta-note{margin-top:70px;font-size:6px}.cta-orbit{width:225%;left:-61%;margin-top:-76%;opacity:.3}.cta-star-track{inset:0}.cta-star-track :deep(svg){top:15%;right:13%;width:22px;height:22px}}
</style>
