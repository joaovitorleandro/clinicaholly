<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap, ScrollTrigger } from '../lib/motion'
import { clinic } from '../data/clinic'
import RevealText from '../components/motion/RevealText.vue'
import HollyStar from '../components/ui/HollyStar.vue'

const root = ref<HTMLElement>()
const active = ref(0)
const steps = [
  { title: 'Conte sobre você', description: 'Inicie a avaliação online pelo WhatsApp. Você receberá orientações simples sobre as fotos necessárias.' },
  { title: 'Planejamento exclusivo', description: 'O Dr. Guilherme e a equipe analisam seu caso para indicar as possibilidades mais adequadas.' },
  { title: 'Seu momento Holly', description: 'Com seu plano aprovado, organizamos a melhor data e tudo o que você precisa saber para o atendimento.' },
]
let context: gsap.Context | undefined
let media: gsap.MatchMedia | undefined

onMounted(() => {
  context = gsap.context(() => {
    media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.journey-track-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.journey-steps', start: 'top 65%', end: 'bottom 65%', scrub: .7 } })
      gsap.utils.toArray<HTMLElement>('.journey-step').forEach((step, index) => {
        ScrollTrigger.create({ trigger: step, start: 'top 65%', end: 'bottom 65%', onEnter: () => { active.value = index }, onEnterBack: () => { active.value = index } })
      })
    })
  }, root.value)
})
onBeforeUnmount(() => { media?.revert(); context?.revert() })
</script>

<template>
  <section id="jornada" ref="root" class="journey" aria-labelledby="journey-title">
    <div class="container journey-grid">
      <div class="journey-intro">
        <div class="section-label"><HollyStar /><p class="eyebrow">Seu caminho até a Holly</p></div>
        <RevealText id="journey-title">Leve, claro e<br><em>sem pressa.</em></RevealText>
        <a class="text-link" :href="clinic.whatsapp" target="_blank" rel="noopener noreferrer">Quero minha avaliação <span aria-hidden="true">↗</span></a>
        <div class="journey-counter" aria-hidden="true"><span>0{{ active + 1 }}</span><span class="counter-line"></span><span>03</span></div>
      </div>
      <div class="journey-steps-wrap">
        <span class="journey-track" aria-hidden="true"><span class="journey-track-fill"></span></span>
        <ol class="journey-steps">
          <li v-for="(step, index) in steps" :key="step.title" class="journey-step" :class="{ 'is-active': active === index }">
            <span class="journey-dot" aria-hidden="true"></span>
            <span class="step-number">0{{ index + 1 }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
            <HollyStar class="step-star" />
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.journey{background:#ebe6db;color:var(--ink);padding:clamp(80px,9vw,140px) 0 clamp(75px,8vw,130px);position:relative}.journey::before{content:'';height:1px;position:absolute;top:0;left:5%;right:5%;background:#d2cabb}.journey-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(50px,10vw,180px);align-items:start}.journey-intro{position:sticky;top:24vh;padding-bottom:55px}.journey-intro .section-label{margin-bottom:44px}.journey-intro h2{font-size:clamp(3.5rem,6.3vw,7.4rem);letter-spacing:-.025em;margin:0 0 35px}.journey-intro h2 em{color:var(--bronze)}.journey-intro .text-link{font-size:11px}.journey-counter{display:flex;align-items:center;gap:20px;font-size:10px;letter-spacing:.12em;max-width:150px;margin-top:72px;color:#736b5e}.journey-counter>span:first-child{color:var(--bronze)}.counter-line{height:1px;background:#b4a58f;flex:1}.journey-steps{list-style:none;margin:0;padding:0 0 0 49px;position:relative}.journey-track{position:absolute;left:0;top:0;bottom:55px;width:1px;background:#cfc5b4}.journey-track-fill{position:absolute;inset:0;background:var(--bronze);transform-origin:top}.journey-step{position:relative;min-height:330px;padding:0 0 95px}.journey-step:last-child{min-height:270px;padding-bottom:50px}.journey-dot{position:absolute;left:-52px;top:14px;width:7px;height:7px;border:1px solid #aa997e;background:#ebe6db;border-radius:50%;transition:background .6s,border-color .6s}.journey-step.is-active .journey-dot{background:var(--bronze);border-color:var(--bronze)}.step-number{font-family:var(--display);font-size:clamp(2.2rem,3vw,3.7rem);line-height:1;color:#877861;transition:color .6s}.journey-step.is-active .step-number{color:var(--bronze)}.journey-step h3{font-family:var(--display);font-weight:400;font-size:clamp(1.9rem,3vw,3.1rem);letter-spacing:-.025em;line-height:1.1;margin:28px 0 18px;color:#736b5f;transition:color .6s}.journey-step.is-active h3{color:var(--ink)}.journey-step p{font-size:13px;line-height:1.85;color:#655e53;max-width:330px;margin:0}.step-star{position:absolute;right:0;top:6px;width:17px;height:17px;color:var(--bronze);opacity:0;transform:rotate(-30deg);transition:opacity .65s,transform .85s}.is-active .step-star{opacity:1;transform:rotate(0)}
.journey-steps-wrap{position:relative}
@media(max-width:1023px){.journey-grid{gap:50px;grid-template-columns:1fr 1fr}.journey-intro h2{font-size:3.7rem}.journey-steps{padding-left:32px}.journey-dot{left:-35px}.journey-step{min-height:330px}.journey-step h3{font-size:2.2rem}.journey-step p{font-size:12px}.step-star{right:-5px}}
@media(max-width:767px){.journey-grid{display:block}.journey-intro{position:relative;top:auto;padding-bottom:60px}.journey-intro .section-label{margin-bottom:33px}.journey-intro h2{font-size:clamp(3.5rem,12vw,5.4rem);margin-bottom:30px}.journey-counter{display:none}.journey-steps{padding-left:30px;margin-left:3px}.journey-dot{left:-33px}.journey-step{min-height:0;padding-bottom:62px}.journey-step:last-child{min-height:0;padding-bottom:0}.journey-track{bottom:0}.step-number{font-size:2.7rem}.journey-step h3{font-size:2.25rem;margin:20px 0 14px;color:var(--ink)}.journey-step p{font-size:12px;max-width:300px}.step-star{right:0;top:12px}}
@media(prefers-reduced-motion:reduce){.journey-intro{position:relative;top:auto}.journey-step h3{color:var(--ink)}.journey-dot,.step-star,.step-number,.journey-step h3{transition:none}.step-star{transform:none;opacity:1}}
</style>
