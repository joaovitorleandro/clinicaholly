<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap, ScrollTrigger } from '../lib/motion'
import { clinic } from '../data/clinic'
import { beforeAfterCases, beforeAfterImage, beforeAfterSrcset } from '../data/beforeAfter'
import ArrowIcon from '../components/ui/ArrowIcon.vue'
import HollyStar from '../components/ui/HollyStar.vue'
import RevealText from '../components/motion/RevealText.vue'
import RevealBlock from '../components/motion/RevealBlock.vue'

const SIZES = '(max-width: 859px) 100vw, 58vw'
const index = ref(0)
const position = ref(50)
const dragging = ref(false)
const stage = ref<HTMLElement>()
const media = ref<HTMLElement>()
const copy = ref<HTMLElement>()
const tabs = ref<HTMLButtonElement[]>([])
const current = computed(() => beforeAfterCases[index.value]!)
const rounded = computed(() => Math.round(position.value))
// Each label fades out as the divider reaches its corner, so "Depois" never sits over the before photo.
const labelOpacity = computed(() => ({
  before: Math.min(1, Math.max(0, (position.value - 10) / 12)),
  after: Math.min(1, Math.max(0, (90 - position.value) / 12)),
}))

let hint: gsap.core.Timeline | undefined
let trigger: ScrollTrigger | undefined
let reducedMotion = false
let switching = false
let pointerId: number | null = null
let touchStart: { x: number; y: number } | null = null
const preloaded: HTMLImageElement[] = []

const clamp = (value: number) => Math.min(100, Math.max(0, value))

function setFromClientX(clientX: number) {
  const box = stage.value?.getBoundingClientRect()
  if (box && box.width > 0) position.value = clamp(((clientX - box.left) / box.width) * 100)
}

function stopHint() {
  hint?.kill()
  hint = undefined
}

/** Sweeps the divider 50, 78, 22 and back to 50 so visitors see that the image can be dragged. */
function runHint() {
  stopHint()
  if (reducedMotion) return
  const proxy = { value: position.value }
  hint = gsap.timeline({ onUpdate: () => { position.value = proxy.value }, onComplete: () => { hint = undefined } })
    .to(proxy, { value: 50, duration: .25, ease: 'power1.out' })
    .to(proxy, { value: 78, duration: .85, ease: 'power2.inOut' })
    .to(proxy, { value: 22, duration: 1.15, ease: 'power2.inOut' })
    .to(proxy, { value: 50, duration: .85, ease: 'power2.inOut' })
}

function onPointerDown(event: PointerEvent) {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  stopHint()
  pointerId = event.pointerId
  if (event.pointerType === 'touch') {
    // Touch waits for a horizontal intent; vertical swipes keep scrolling the page (touch-action: pan-y).
    touchStart = { x: event.clientX, y: event.clientY }
    return
  }
  stage.value?.setPointerCapture(event.pointerId)
  dragging.value = true
  setFromClientX(event.clientX)
}

function onPointerMove(event: PointerEvent) {
  if (event.pointerId !== pointerId) return
  // A mouse that was released outside the stage ends the drag on its next move.
  if (event.pointerType === 'mouse' && event.buttons === 0) return onPointerEnd(event)
  if (touchStart && !dragging.value) {
    const dx = Math.abs(event.clientX - touchStart.x)
    const dy = Math.abs(event.clientY - touchStart.y)
    if (dx < 6 || dx < dy) return
    // Only pointerup/pointercancel end a drag: taking capture from the implicit touch target
    // fires lostpointercapture, which must not be treated as the finger lifting.
    stage.value?.setPointerCapture(event.pointerId)
    dragging.value = true
  }
  if (dragging.value) setFromClientX(event.clientX)
}

function onPointerEnd(event: PointerEvent) {
  if (event.pointerId !== pointerId) return
  if (touchStart && !dragging.value && event.type === 'pointerup') setFromClientX(event.clientX)
  if (stage.value?.hasPointerCapture(event.pointerId)) stage.value.releasePointerCapture(event.pointerId)
  dragging.value = false
  pointerId = null
  touchStart = null
}

function onKeydown(event: KeyboardEvent) {
  const moves: Record<string, number> = { ArrowLeft: position.value - 5, ArrowDown: position.value - 5, ArrowRight: position.value + 5, ArrowUp: position.value + 5, Home: 0, End: 100, PageDown: position.value - 20, PageUp: position.value + 20 }
  const next = moves[event.key]
  if (next === undefined) return
  event.preventDefault()
  stopHint()
  position.value = clamp(next)
}

async function waitForImages() {
  const images = [...(media.value?.querySelectorAll('img') ?? [])]
  await Promise.all(images.map((image) => image.decode().catch(() => undefined)))
}

async function select(next: number) {
  if (next === index.value || switching) return
  stopHint()
  switching = true
  const targets = [media.value, copy.value].filter(Boolean)
  if (!reducedMotion) await gsap.to(targets, { opacity: 0, duration: .26, ease: 'power2.in' })
  index.value = next
  position.value = 50
  await nextTick()
  await waitForImages()
  if (!reducedMotion) await gsap.to(targets, { opacity: 1, duration: .45, ease: 'power2.out' })
  switching = false
  runHint()
}

function onTabKeydown(event: KeyboardEvent, current: number) {
  const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
  if (!step) return
  event.preventDefault()
  const next = (current + step + beforeAfterCases.length) % beforeAfterCases.length
  tabs.value[next]?.focus()
  void select(next)
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Preload every pair with the same srcset/sizes so switching cases is instant.
  for (const item of beforeAfterCases) {
    for (const side of ['antes', 'depois'] as const) {
      const image = new Image()
      image.sizes = SIZES
      image.srcset = beforeAfterSrcset(item.id, side)
      image.src = beforeAfterImage(item.id, side)
      preloaded.push(image)
    }
  }
  if (stage.value) trigger = ScrollTrigger.create({ trigger: stage.value, start: 'top 72%', once: true, onEnter: runHint })
})

onBeforeUnmount(() => {
  stopHint()
  trigger?.kill()
  gsap.killTweensOf([media.value, copy.value])
})
</script>

<template>
  <section id="antes-e-depois" class="ba" aria-labelledby="ba-title">
    <div class="container">
      <div class="ba-label section-label"><HollyStar /><p class="eyebrow">Antes e depois</p><span class="section-number">05 / 09</span></div>
      <div class="ba-heading">
        <RevealText id="ba-title">Do antes ao depois<br>que <em>fala por si.</em></RevealText>
        <RevealBlock class="ba-intro"><p>Casos reais publicados pela Clínica Holly. Arraste a linha sobre a foto para comparar.</p></RevealBlock>
      </div>

      <div class="ba-layout">
        <RevealBlock class="ba-stage-wrap">
          <div
            ref="stage"
            class="ba-stage"
            :class="{ 'is-dragging': dragging }"
            role="slider"
            tabindex="0"
            aria-label="Comparar antes e depois"
            aria-orientation="horizontal"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="rounded"
            :aria-valuetext="`${rounded}% da imagem mostra o antes`"
            :style="{ '--x': `${position}%` }"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerEnd"
            @pointercancel="onPointerEnd"
            @keydown="onKeydown"
          >
            <div ref="media" class="ba-media">
              <img class="ba-img" :src="beforeAfterImage(current.id, 'depois')" :srcset="beforeAfterSrcset(current.id, 'depois')" :sizes="SIZES" :alt="`Depois: ${current.tag}`" width="1080" height="810" decoding="async" draggable="false">
              <img class="ba-img ba-before" :src="beforeAfterImage(current.id, 'antes')" :srcset="beforeAfterSrcset(current.id, 'antes')" :sizes="SIZES" :alt="`Antes: ${current.tag}`" width="1080" height="810" decoding="async" draggable="false">
            </div>
            <div class="ba-divider" aria-hidden="true"><span class="ba-knob"><ArrowIcon direction="left" /><ArrowIcon direction="right" /></span></div>
            <span class="ba-tag ba-tag-before" aria-hidden="true" :style="{ opacity: labelOpacity.before }">Antes</span>
            <span class="ba-tag ba-tag-after" aria-hidden="true" :style="{ opacity: labelOpacity.after }">Depois</span>
          </div>
        </RevealBlock>

        <div class="ba-info">
          <p class="ba-counter"><span>0{{ index + 1 }}</span><span class="ba-counter-line" aria-hidden="true"></span><span>0{{ beforeAfterCases.length }}</span></p>
          <!-- Every caption shares one grid cell, so the column keeps the height of the longest one. -->
          <div ref="copy" class="ba-copy">
            <div v-for="(item, itemIndex) in beforeAfterCases" :id="`ba-panel-${item.id}`" :key="item.id" class="ba-copy-item" :class="{ 'is-active': itemIndex === index }" role="tabpanel" :aria-labelledby="`ba-tab-${item.id}`" :aria-hidden="itemIndex !== index">
              <p class="eyebrow">{{ item.tag }}</p>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>
          <div class="ba-thumbs" role="tablist" aria-label="Casos de antes e depois">
            <button
              v-for="(item, itemIndex) in beforeAfterCases"
              :key="item.id"
              :id="`ba-tab-${item.id}`"
              ref="tabs"
              type="button"
              class="ba-thumb"
              role="tab"
              :aria-selected="itemIndex === index"
              :tabindex="itemIndex === index ? 0 : -1"
              :aria-controls="`ba-panel-${item.id}`"
              @click="select(itemIndex)"
              @keydown="onTabKeydown($event, itemIndex)"
            >
              <img :src="beforeAfterImage(item.id, 'depois', 540)" alt="" width="540" height="405" loading="lazy" decoding="async">
              <span>{{ item.thumb }}</span>
            </button>
          </div>
          <p class="ba-disclaimer">Pacientes reais. Resultados individuais podem variar.</p>
          <a class="text-link ba-cta" :href="clinic.whatsapp" target="_blank" rel="noopener noreferrer">Quero minha avaliação <ArrowIcon /></a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ba{background:var(--ink);color:var(--ivory);padding:clamp(85px,9vw,150px) 0 clamp(85px,9vw,140px);overflow:hidden}
.ba-label{margin-bottom:46px}.section-number{margin-left:auto;font-size:10px;letter-spacing:.15em;color:var(--taupe)}
.ba-heading{display:grid;grid-template-columns:1.5fr 1fr;gap:60px;align-items:end;margin-bottom:clamp(45px,5vw,75px)}.ba-heading h2{margin:0}.ba-heading h2 em{color:var(--champagne)}
.ba-intro{justify-self:end;max-width:300px;padding-bottom:8px}.ba-intro p{font-size:13px;line-height:1.9;color:#b5ac9d}
.ba-layout{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:clamp(36px,5vw,90px);align-items:center}

.ba-stage{position:relative;width:100%;max-width:calc(82vh * 4 / 3);aspect-ratio:4/3;overflow:hidden;background:var(--warm);cursor:ew-resize;touch-action:pan-y;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
.ba-stage:focus-visible{outline:2px solid var(--champagne);outline-offset:6px}
.ba-media{position:absolute;inset:0}
.ba-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;-webkit-user-drag:none}
.ba-before{clip-path:inset(0 calc(100% - var(--x)) 0 0)}
.ba-divider{position:absolute;top:0;bottom:0;left:var(--x);width:0;z-index:2;pointer-events:none}
.ba-divider::before{content:'';position:absolute;top:0;bottom:0;left:-.5px;width:1px;background:linear-gradient(rgb(227 210 144 / 0%),var(--champagne) 14%,var(--champagne) 86%,rgb(227 210 144 / 0%));box-shadow:0 0 14px rgb(227 210 144 / 45%)}
.ba-knob{position:absolute;top:50%;left:0;display:flex;align-items:center;justify-content:center;gap:3px;width:56px;height:56px;margin:-28px 0 0 -28px;border:1px solid rgb(227 210 144 / 75%);border-radius:50%;color:var(--champagne);background:rgb(8 8 7 / 32%);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 12px 30px rgb(0 0 0 / 35%);transition:transform .4s cubic-bezier(.22,1,.36,1),background-color .3s}
.ba-knob .arrow-icon{width:15px;height:15px}
.ba-stage:hover .ba-knob,.ba-stage:focus-visible .ba-knob,.ba-stage.is-dragging .ba-knob{transform:scale(1.15);background-color:rgb(8 8 7 / 55%)}
.ba-tag{position:absolute;bottom:20px;z-index:3;font:italic 400 clamp(1.35rem,1.9vw,2rem)/1 var(--display);color:var(--ivory);text-shadow:0 2px 16px rgb(0 0 0 / 80%),0 0 2px rgb(0 0 0 / 45%);pointer-events:none}
.ba-tag-before{left:24px}.ba-tag-after{right:24px}

.ba-counter{display:flex;align-items:center;gap:16px;max-width:190px;margin-bottom:30px;font-size:10px;letter-spacing:.15em;color:var(--taupe)}.ba-counter>span:first-child{color:var(--champagne)}.ba-counter-line{flex:1;height:1px;background:#3a352b}
.ba-copy{display:grid}.ba-copy-item{grid-area:1/1;visibility:hidden}.ba-copy-item.is-active{visibility:visible}.ba-copy .eyebrow{font-size:9px;color:var(--champagne);margin-bottom:16px}
.ba-copy h3{font:400 clamp(2rem,2.9vw,3.4rem)/1.05 var(--display);letter-spacing:-.025em;margin:0 0 20px}
.ba-copy p:not(.eyebrow){max-width:400px;font-size:13px;line-height:1.9;color:#b5ac9d}
.ba-thumbs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:30px}
.ba-thumb{display:flex;flex-direction:column;gap:10px;min-width:0;padding:0;border:0;background:none;color:#8f8676;text-align:left;cursor:pointer}
.ba-thumb img{width:100%;aspect-ratio:4/3;object-fit:cover;opacity:.5;filter:grayscale(.4);outline:1px solid transparent;outline-offset:3px;transition:opacity .3s,filter .3s,outline-color .3s}
.ba-thumb span{overflow:hidden;font-size:9px;font-weight:500;letter-spacing:.12em;text-overflow:ellipsis;text-transform:uppercase;white-space:nowrap}
.ba-thumb:hover img{opacity:.85;filter:none}
.ba-thumb[aria-selected="true"] img{opacity:1;filter:none;outline-color:var(--champagne)}
.ba-thumb[aria-selected="true"] span{color:var(--champagne)}
.ba-thumb:focus-visible{outline:none}.ba-thumb:focus-visible img{outline:2px solid var(--champagne)}
.ba-disclaimer{margin-top:24px;font-size:10px;line-height:1.7;font-style:italic;color:#8f8676}
.ba-cta{margin-top:22px;color:var(--champagne)}

@media(max-width:1023px){.ba-heading{gap:30px}.ba-copy h3{font-size:2.2rem}}
@media(max-width:859px){
  .ba-label{margin-bottom:34px}.ba-heading{display:block;margin-bottom:34px}.ba-intro{max-width:330px;margin-top:22px;margin-left:0}.ba-intro p{font-size:12px}
  .ba-layout{display:block}.ba-stage{max-width:none}
  .ba-knob{width:46px;height:46px;margin:-23px 0 0 -23px}.ba-knob .arrow-icon{width:13px;height:13px}
  .ba-tag{bottom:14px;font-size:1.3rem}.ba-tag-before{left:16px}.ba-tag-after{right:16px}
  .ba-info{margin-top:30px}.ba-counter{margin-bottom:20px}.ba-copy h3{font-size:clamp(1.9rem,8vw,2.5rem)}.ba-copy p:not(.eyebrow){font-size:12px}
  .ba-thumbs{gap:8px;margin-top:26px}.ba-thumb span{font-size:7.5px;letter-spacing:.08em}
}
@media(prefers-reduced-motion:reduce){.ba-knob,.ba-thumb img{transition:none}}
</style>
