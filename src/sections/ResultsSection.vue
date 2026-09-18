<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'
import { clinic } from '../data/clinic'
import { setScrollLocked } from '../composables/useLenis'
import ParallaxImage from '../components/motion/ParallaxImage.vue'
import RevealText from '../components/motion/RevealText.vue'
import RevealBlock from '../components/motion/RevealBlock.vue'
import ArrowIcon from '../components/ui/ArrowIcon.vue'
import HollyStar from '../components/ui/HollyStar.vue'

const results = [
  { image: '/images/smile-close.webp', label: 'Estética dentária', alt: 'Sorriso feminino do acervo de estética dentária da Clínica Holly', position: '50% 50%' },
  { image: '/images/smile-man.webp', label: 'Facetas em resina', alt: 'Detalhe do sorriso masculino do acervo da Clínica Holly', position: '50% 47%' },
  { image: '/images/smile-natural.webp', label: 'Detalhes naturais', alt: 'Detalhe de dentes e sorriso do acervo da Clínica Holly', position: '50% 49%' },
]
const dialog = ref<HTMLDialogElement>()
const selected = ref(0)
const isOpen = ref(false)
let previousOverflow = ''
let opener: HTMLElement | null = null

async function openResult(index: number, event: MouseEvent) {
  selected.value = index
  isOpen.value = true
  opener = event.currentTarget as HTMLElement
  await nextTick()
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  setScrollLocked(true)
  dialog.value?.showModal()
}

function closeResult() { dialog.value?.close() }
function onClose() {
  isOpen.value = false
  document.body.style.overflow = previousOverflow
  setScrollLocked(false)
  opener?.focus({ preventScroll: true })
}
function move(direction: number) { selected.value = (selected.value + direction + results.length) % results.length }
function backdropClick(event: MouseEvent) { if (event.target === dialog.value) closeResult() }
onBeforeUnmount(() => {
  if (dialog.value?.open) {
    isOpen.value = false
    document.body.style.overflow = previousOverflow
    setScrollLocked(false)
  }
})
</script>

<template>
  <section id="resultados" class="results" aria-labelledby="results-title">
    <div class="container">
      <div class="results-eyebrow section-label"><HollyStar /><p class="eyebrow">Resultados que falam por si</p><span class="section-number">04 / 08</span></div>
      <div class="results-heading">
        <RevealText id="results-title">A delicadeza está<br>nos <em>detalhes.</em></RevealText>
        <RevealBlock class="results-intro"><p>Uma seleção de trabalhos publicados pela Clínica Holly. Cada caso é único e planejado individualmente.</p><span class="eyebrow">Naturalidade. Individualidade.</span></RevealBlock>
      </div>
      <div class="results-gallery">
        <RevealBlock v-for="(result, index) in results" :key="result.label" as="figure" class="result-photo" :class="`result-photo-${index + 1}`">
          <button class="result-open" :aria-label="`Ampliar fotografia: ${result.label}`" data-cursor="Ver" @click="openResult(index, $event)">
            <ParallaxImage :src="result.image" :alt="result.alt" :width="1122" :height="1402" :position="result.position" :speed="index === 0 ? 4 : 2.5" :scale="1.08" :sizes="index === 0 ? '(max-width: 767px) 86vw, 42vw' : '(max-width: 767px) 75vw, 35vw'" />
            <span class="result-hover" aria-hidden="true"><span>Ver detalhe</span><HollyStar /></span>
          </button>
          <figcaption><span>{{ result.label }}</span><span class="caption-number">0{{ index + 1 }} <ArrowIcon /></span></figcaption>
        </RevealBlock>
        <div class="gallery-aside" aria-hidden="true"><HollyStar /><span>HOLLY — ESTÉTICA INTEGRADA</span></div>
      </div>
      <div class="results-bottom"><a class="text-link" :href="clinic.instagram" target="_blank" rel="noopener noreferrer">Ver mais resultados no Instagram <ArrowIcon /></a><span class="eyebrow">Cada caso é único</span></div>
    </div>
    <dialog ref="dialog" class="result-dialog" aria-label="Galeria de resultados da Clínica Holly" aria-describedby="result-dialog-note" @click="backdropClick" @close="onClose" @keydown.left.prevent="move(-1)" @keydown.right.prevent="move(1)">
      <div class="dialog-content">
        <div class="dialog-top"><span class="eyebrow">Holly — {{ results[selected]?.label }}</span><button autofocus class="dialog-close" aria-label="Fechar fotografia" @click="closeResult">Fechar <span aria-hidden="true">×</span></button></div>
        <img v-if="isOpen && results[selected]" :src="results[selected]!.image" :alt="results[selected]!.alt" width="1122" height="1402" decoding="async">
        <div class="dialog-bottom"><button aria-label="Fotografia anterior" @click="move(-1)"><ArrowIcon direction="left" /></button><span aria-live="polite">0{{ selected + 1 }} / 0{{ results.length }}</span><button aria-label="Próxima fotografia" @click="move(1)"><ArrowIcon direction="right" /></button></div>
        <p id="result-dialog-note">Cada caso é único e planejado individualmente.</p>
      </div>
    </dialog>
  </section>
</template>

<style scoped>
.results{background:var(--ivory);color:var(--ink);padding:clamp(85px,10vw,160px) 0 clamp(85px,8vw,130px);overflow:hidden}.results-eyebrow{margin-bottom:45px}.section-number{margin-left:auto;font-size:10px;letter-spacing:.15em;color:#70695f}.results-heading{display:grid;grid-template-columns:1.4fr 1fr;gap:80px;align-items:end;margin-bottom:80px}.results-heading h2{margin:0;font-size:clamp(3.2rem,6.7vw,7.7rem);letter-spacing:-.035em}.results-heading h2 em{color:var(--bronze)}.results-intro{justify-self:end;max-width:295px;padding-bottom:8px}.results-intro p{font-size:13px;line-height:1.9;color:#625d54;margin:0 0 24px}.results-intro .eyebrow{font-size:8px;color:var(--bronze)}
.results-gallery{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));grid-template-rows:auto auto;column-gap:clamp(20px,3.8vw,70px);row-gap:clamp(45px,5vw,90px);position:relative;align-items:start}.result-photo{margin:0;min-width:0}.result-photo-1{grid-column:1/7;grid-row:1/3;margin-top:70px}.result-photo-2{grid-column:8/13;grid-row:1}.result-photo-3{grid-column:8/12;grid-row:2}.result-open{display:block;position:relative;width:100%;padding:0;border:0;background:var(--ink);cursor:pointer;overflow:hidden;aspect-ratio:4/5}.result-photo-2 .result-open{aspect-ratio:1.15}.result-photo-3 .result-open{aspect-ratio:1.05}.result-open :deep(.parallax-image){height:100%;transition:transform .9s cubic-bezier(.22,1,.36,1)}.result-open:hover :deep(.parallax-image){transform:scale(1.035)}.result-open:active :deep(.parallax-image){transform:scale(1.02)}.result-hover{position:absolute;left:25px;right:25px;bottom:25px;display:flex;align-items:center;justify-content:space-between;color:var(--ivory);opacity:0;transform:translateY(7px);transition:opacity .35s,transform .5s}.result-hover>span{font-size:9px;letter-spacing:.16em;text-transform:uppercase;text-shadow:0 1px 9px #000}.result-hover :deep(svg){width:23px;height:23px}.result-open:hover .result-hover,.result-open:focus-visible .result-hover{opacity:1;transform:translateY(0)}.result-open:focus-visible{outline:2px solid var(--bronze);outline-offset:5px}figcaption{display:flex;justify-content:space-between;margin-top:18px;font-size:10px;letter-spacing:.035em;color:#615a50}.caption-number{display:flex;gap:25px;font-size:9px;letter-spacing:.1em}.caption-number>.arrow-icon{width:13px;height:13px;color:var(--bronze)}
.gallery-aside{position:absolute;left:0;bottom:8px;display:flex;align-items:center;gap:17px;color:var(--bronze)}.gallery-aside :deep(svg){width:22px;height:22px}.gallery-aside>span{font-size:8px;letter-spacing:.19em}.results-bottom{margin-top:70px;padding-top:26px;border-top:1px solid #ccc3b3;display:flex;justify-content:space-between;align-items:center;gap:20px}.results-bottom .text-link{font-size:11px}.results-bottom>.eyebrow{font-size:8px;color:#6e675b}
.result-dialog{position:fixed;inset:0;border:0;background:var(--ink);color:var(--ivory);padding:20px 32px;max-width:calc(100vw - 36px);max-height:calc(100dvh - 36px);width:min(650px,calc(100vw - 36px));overflow:auto}.result-dialog::backdrop{background:rgba(8,8,7,.9);backdrop-filter:blur(8px)}.dialog-content{display:flex;flex-direction:column;align-items:center}.dialog-top{width:100%;display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:18px}.dialog-top .eyebrow{font-size:8px;line-height:1.5}.dialog-close{background:none;border:0;color:var(--ivory);font:10px var(--sans);padding:8px 0 8px 8px;display:flex;gap:14px;align-items:center;cursor:pointer}.dialog-close>span{font-size:25px;font-weight:300}.dialog-content>img{display:block;object-fit:contain;width:auto;max-width:100%;height:min(68dvh,700px);min-height:0}.dialog-bottom{display:flex;gap:42px;align-items:center;margin-top:15px}.dialog-bottom button{display:grid;place-items:center;border:1px solid #534a36;width:40px;height:40px;background:transparent;color:var(--champagne);font-size:18px;cursor:pointer;transition:background .2s}.dialog-bottom button .arrow-icon{width:18px;height:18px}.dialog-bottom button:hover{background:#2d291f}.dialog-bottom>span{font-size:10px;letter-spacing:.15em}.dialog-content>p{font-size:9px;color:var(--taupe);margin:18px 0 0;line-height:1.6;text-align:center}
@media(max-width:1023px){.results-heading{gap:35px;margin-bottom:55px}.results-heading h2{font-size:4rem}.results-intro{max-width:245px}.results-gallery{column-gap:27px;row-gap:55px}.result-photo-1{grid-column:1/7;margin-top:50px}.result-photo-2{grid-column:8/13}.result-photo-3{grid-column:8/13}.gallery-aside{bottom:0}.gallery-aside>span{font-size:7px}}
@media(max-width:767px){.results-eyebrow{margin-bottom:32px}.results-heading{display:block;margin-bottom:44px}.results-heading h2{font-size:clamp(3.2rem,11.8vw,5rem)}.results-intro{max-width:280px;margin-top:27px;margin-left:auto}.results-intro p{font-size:12px;margin-bottom:17px}.results-intro .eyebrow{font-size:7px}.results-gallery{grid-template-columns:repeat(6,minmax(0,1fr));gap:38px 13px}.result-photo-1{grid-column:1/6;grid-row:1;margin-top:0}.result-photo-2{grid-column:2/7;grid-row:2}.result-photo-3{grid-column:1/6;grid-row:3}.result-photo-2 .result-open{aspect-ratio:1.1}.result-photo-3 .result-open{aspect-ratio:1.2}.gallery-aside{display:none}figcaption{font-size:9px;margin-top:13px}.results-bottom{margin-top:42px;display:block}.results-bottom>.eyebrow{display:none}.results-bottom .text-link{font-size:10px}.result-dialog{padding:15px;max-width:calc(100vw - 20px);width:calc(100vw - 20px)}.dialog-top .eyebrow{font-size:7px}.dialog-content>img{height:min(64dvh,600px)}.result-hover{left:17px;right:17px;bottom:17px;opacity:1;transform:none}.result-hover>span{font-size:8px}.result-hover :deep(svg){width:18px;height:18px}}
@media(prefers-reduced-motion:reduce){.result-open :deep(.parallax-image),.result-hover{transition:none}.result-open:hover :deep(.parallax-image){transform:none}}
</style>
