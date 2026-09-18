<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, ScrollTrigger } from '../lib/motion'
import MagneticButton from '../components/motion/MagneticButton.vue'
import ArrowIcon from '../components/ui/ArrowIcon.vue'
import HollyStar from '../components/ui/HollyStar.vue'
import { clinic } from '../data/clinic'
import type { HollySceneController } from '../three/HollyScene'

const section = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const webglReady = ref(false)
let ctx: gsap.Context | undefined
let scene: HollySceneController | undefined
let disposed = false
let progress = 0
let frame = 0

onMounted(() => {
  ctx = gsap.context(() => {
    const media = gsap.matchMedia()
    media.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)', reduce: '(prefers-reduced-motion: reduce)' }, (context) => {
      if (context.conditions?.reduce || !context.conditions?.desktop) return
      const desktop = context.conditions?.desktop
      gsap.from('.hero-line-inner', { yPercent: 110, duration: 1.2, stagger: .12, ease: 'power4.out', delay: .1 })
      gsap.from('.hero-intro, .hero-description, .hero-actions, .hero-bottom', { y: 16, opacity: 0, duration: .9, stagger: .09, ease: 'power3.out', delay: .35 })
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section.value, start: 'top top', end: 'bottom bottom', scrub: .9, invalidateOnRefresh: true,
          onUpdate: (self) => { progress = self.progress; scene?.setProgress(progress) },
        },
      })
      timeline.to('.hero-photo', { scale: desktop ? 1.13 : 1.06, xPercent: desktop ? -3 : 0, ease: 'none', duration: 1 }, 0)
      timeline.to('.hero-title', { yPercent: desktop ? -17 : -6, ease: 'none', duration: .7 }, 0)
      timeline.to('.hero-description', { y: -22, opacity: .4, duration: .4 }, .35)
      timeline.to('.hero-intro, .hero-marginalia, .hero-bottom', { opacity: 0, duration: .25 }, .1)
      timeline.to('.hero-title, .hero-description, .hero-actions', { opacity: 0, y: -40, duration: .25 }, .7)
      timeline.fromTo('.hero-outro', { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: .25 }, .66)
      timeline.to('.hero-photo', { opacity: .5, duration: .25 }, .72)
      timeline.to('.hero-orbit-fallback', { rotate: 15, scale: 1.2, duration: 1, ease: 'none' }, 0)
      timeline.to('.hero-transition-star', { rotate: 90, y: desktop ? 60 : 20, duration: .3, ease: 'none' }, .7)
    })
  }, section.value)
  // Decorative WebGL is desktop-only; the mobile hero intentionally stays clean and static.
  if (window.matchMedia('(min-width: 768px)').matches) frame = requestAnimationFrame(() => {
    void import('../three/HollyScene').then(({ createHollyScene }) => {
      if (disposed || !canvas.value) return
      try {
        scene = createHollyScene(canvas.value)
        scene.setProgress(progress)
        webglReady.value = true
      } catch {
        webglReady.value = false
      }
    }).catch(() => { webglReady.value = false })
  })
  void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
})
onUnmounted(() => { disposed = true; cancelAnimationFrame(frame); ctx?.revert(); scene?.dispose() })
</script>

<template>
  <section id="inicio" ref="section" class="hero-scroll" aria-labelledby="hero-title">
    <div class="hero-sticky">
      <div class="hero-photo-wrap" aria-hidden="true">
        <img class="hero-photo" src="/images/hero-smile.webp" srcset="/images/hero-smile-640.webp 640w, /images/hero-smile-960.webp 960w, /images/hero-smile.webp 1536w" sizes="100vw" alt="" width="1536" height="1024" fetchpriority="high" decoding="async" />
      </div>
      <div class="hero-shade" aria-hidden="true"></div>
      <svg class="hero-orbit-fallback" :class="{ 'webgl-ready': webglReady }" viewBox="0 0 1000 1000" fill="none" aria-hidden="true">
        <ellipse cx="500" cy="500" rx="330" ry="450" transform="rotate(24 500 500)" stroke="currentColor" stroke-width=".6" />
        <path d="M300 58C117 286 122 637 278 835" stroke="currentColor" stroke-width="1" />
        <path d="M739 92C920 395 854 731 718 904" stroke="currentColor" stroke-width=".5" />
      </svg>
      <canvas ref="canvas" class="hero-canvas" aria-hidden="true"></canvas>
      <div class="hero-content container">
        <p class="hero-intro eyebrow"><span class="eyebrow-line" aria-hidden="true"></span>Clínica Holly <span class="intro-dot">·</span> Estética integrada</p>
        <h1 id="hero-title" class="hero-title">
          <span class="hero-line"><span class="hero-line-inner">Seu sorriso.</span></span>
          <span class="hero-line hero-line-signature"><em class="hero-line-inner">Sua assinatura.</em></span>
        </h1>
        <p class="hero-description">Tratamentos pensados para valorizar o que existe de mais autêntico em você — com planejamento, técnica e naturalidade.</p>
        <div class="hero-actions">
          <MagneticButton :href="clinic.whatsapp">Quero minha avaliação</MagneticButton>
          <a class="hero-text-link" href="#especialidades">Conheça os tratamentos <ArrowIcon /></a>
        </div>
      </div>
      <div class="hero-marginalia" aria-hidden="true"><HollyStar /><span>Naturalidade.<br>Precisão.<br>Individualidade.</span></div>
      <div class="hero-bottom container">
        <a class="scroll-invitation" href="#experiencia"><span class="scroll-line" aria-hidden="true"></span><span>Uma experiência Holly</span><ArrowIcon direction="down" class="scroll-arrow" /></a>
        <p>Atendimento em SP e RJ <span>·</span> Desde 2021</p>
        <span class="hero-index" aria-hidden="true">01 <span>/</span> 08</span>
      </div>
      <div class="hero-outro" aria-hidden="true"><p class="eyebrow">A experiência Holly</p><p>Estética que começa<br><em>com escuta.</em></p><HollyStar class="hero-transition-star" /></div>
      <div class="hero-progress" aria-hidden="true"><span></span></div>
    </div>
  </section>
</template>

<style scoped>
.hero-scroll{position:relative;height:310svh;scroll-margin-top:0;background:var(--ink)}
.hero-sticky{position:sticky;top:0;height:100svh;min-height:720px;overflow:hidden;isolation:isolate;background:var(--ink)}
.hero-photo-wrap{position:absolute;inset:0;z-index:-4}
.hero-photo{width:100%;height:100%;object-fit:cover;object-position:65% 43%;transform-origin:75% 52%;opacity:.93}
.hero-shade{position:absolute;inset:0;z-index:-3;background:linear-gradient(90deg,rgba(8,8,7,.94) 0%,rgba(8,8,7,.77) 22%,rgba(8,8,7,.3) 48%,rgba(8,8,7,0) 76%),linear-gradient(0deg,rgba(8,8,7,.88),transparent 31%,transparent 78%,rgba(8,8,7,.28));}
.hero-content{position:relative;z-index:2;padding-top:clamp(190px,24svh,260px);pointer-events:none}
.hero-intro{display:flex;align-items:center;gap:14px;color:#d3ba89;font-size:9px;letter-spacing:.2em;margin-bottom:35px}
.eyebrow-line{width:30px;height:1px;background:#b59156}.intro-dot{font-size:14px;color:#927749}
.hero-title{font-size:clamp(90px,9.8vw,184px);line-height:.95;font-weight:400;letter-spacing:-.033em;max-width:1200px}
.hero-line{display:block;overflow:hidden;padding:0 0 .14em;margin-bottom:-.1em}
.hero-line-inner{display:block}
.hero-line-signature{padding-left:8.6vw;margin-top:9px;color:#d5b980}
.hero-description{max-width:338px;font-size:12px;line-height:1.95;color:#d7d2c8;margin-top:27px;font-weight:400}
.hero-actions{display:flex;align-items:center;gap:30px;margin-top:30px;pointer-events:auto}
.hero-text-link{display:inline-flex;gap:16px;align-items:center;font-size:8px;letter-spacing:.13em;line-height:1.8;text-transform:uppercase;padding:10px 0;border-bottom:1px solid #7e7769;transition:border-color .3s,color .3s}
.hero-text-link .arrow-icon{width:17px;height:17px;transition:transform .3s}.hero-text-link:hover{color:#e0c795;border-color:#e0c795}.hero-text-link:hover .arrow-icon{transform:translate(3px,-3px)}
.hero-canvas{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.76}
.hero-orbit-fallback{position:absolute;width:74vw;height:110svh;right:-9vw;top:-4svh;z-index:-1;color:#b89555;opacity:.55;pointer-events:none;transition:opacity .6s}
.hero-orbit-fallback.webgl-ready{opacity:.13}
.hero-marginalia{position:absolute;right:var(--gutter);bottom:24%;display:flex;flex-direction:column;align-items:flex-start;gap:20px;z-index:2}
.hero-marginalia svg{width:26px;height:26px;color:#d5b980}
.hero-marginalia span{font-size:8px;line-height:2.1;letter-spacing:.2em;text-transform:uppercase;color:#e2d4bb}
.hero-bottom{position:absolute;left:0;right:0;bottom:31px;display:flex;justify-content:space-between;align-items:center;z-index:3}
.hero-bottom p{font-size:8px;color:#bab2a2;letter-spacing:.15em;text-transform:uppercase}
.hero-bottom p span{margin-inline:14px;color:#c4a77c}
.scroll-invitation{display:flex;align-items:center;gap:12px;font-size:8px;text-transform:uppercase;letter-spacing:.16em;color:#d9cfbb;min-height:32px}
.scroll-line{width:30px;height:1px;background:#8f7b57}.scroll-arrow{width:16px;height:16px;transition:transform .3s}.scroll-invitation:hover .scroll-arrow{transform:translateY(4px)}
.hero-index{font-size:9px;letter-spacing:.12em;color:#d6bf91}.hero-index span{margin-inline:10px;color:#797165}
.hero-outro{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;opacity:0;pointer-events:none;z-index:2;gap:32px}
.hero-outro>.eyebrow{color:#d1b378}.hero-outro>p:not(.eyebrow){font-family:var(--display);font-size:clamp(70px,8vw,140px);line-height:1}.hero-outro em{color:#d5b980}.hero-transition-star{width:40px;height:40px;color:#d5b980}
.hero-progress{position:absolute;inset:auto 0 0;height:1px;background:rgb(220 195 150 / 15%)}
@media(min-width:1600px){.hero-description{font-size:14px;max-width:370px}.hero-actions{margin-top:36px}.hero-content{padding-top:23svh}.hero-intro{margin-bottom:44px}}
@media(max-width:1100px){.hero-content{padding-top:25svh}.hero-title{font-size:11vw}.hero-line-signature{padding-left:3.5vw}.hero-marginalia{bottom:20%}.hero-description{max-width:305px;font-size:11px}.hero-actions{gap:20px}.hero-bottom p{font-size:7px}}
@media(max-width:767px){
  .hero-scroll{height:100svh}.hero-sticky{position:relative;min-height:760px;height:100svh}
  .hero-photo-wrap{bottom:23%;left:0;top:0;right:-20%}.hero-photo{object-position:64% 23%;opacity:.9}
  .hero-shade{background:linear-gradient(0deg,var(--ink) 0%,rgba(8,8,7,.95) 24%,rgba(8,8,7,.55) 45%,rgba(8,8,7,.02) 77%,rgba(8,8,7,.48)),linear-gradient(90deg,rgba(8,8,7,.35),transparent 70%)}
  .hero-content{padding-top:clamp(268px,39svh,390px)}
  .hero-intro{font-size:7px;letter-spacing:.16em;gap:9px;margin-bottom:20px}.eyebrow-line{width:20px}
  .hero-title{font-size:clamp(66px,14.8vw,108px);line-height:.99;letter-spacing:-.035em}.hero-line-signature{padding-left:0;margin-top:0}
  .hero-description{max-width:330px;font-size:11px;line-height:1.9;margin-top:20px}
  .hero-actions{align-items:flex-start;gap:17px;flex-direction:column;margin-top:23px}.hero-text-link{font-size:8px;gap:24px}
  .hero-marginalia{display:none}.hero-bottom{bottom:22px;align-items:flex-end}.hero-bottom p{max-width:108px;line-height:1.8;font-size:6px;text-align:right}.hero-bottom p span{display:none}.hero-index{display:none}.scroll-invitation{font-size:7px;letter-spacing:.12em;gap:9px}.scroll-line{width:20px}
  .hero-orbit-fallback,.hero-canvas,.hero-outro,.hero-progress{display:none}
}
@media(max-width:767px) and (min-height:850px){.hero-content{padding-top:43svh}.hero-sticky{min-height:850px}}
@media(prefers-reduced-motion:reduce){.hero-scroll{height:auto}.hero-sticky{position:relative}.hero-outro{display:none}.hero-canvas{opacity:.55}}
</style>
