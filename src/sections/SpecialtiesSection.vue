<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { ScrollTrigger } from '../lib/motion'
import { clinic } from '../data/clinic'
import RevealText from '../components/motion/RevealText.vue'
import RevealBlock from '../components/motion/RevealBlock.vue'
import HollyStar from '../components/ui/HollyStar.vue'

const active = ref(0)
const selected = ref<number | null>(0)
const treatments = [
  { title: 'Facetas & lentes', lines: ['Facetas &', 'lentes'], description: 'Detalhe, naturalidade e um sorriso que conversa com você.', image: '/images/smile-close.webp', alt: 'Detalhe de sorriso do acervo da Clínica Holly', position: '49% 50%' },
  { title: 'Harmonização facial', lines: ['Harmonização', 'facial'], description: 'Equilíbrio e leveza para valorizar sua expressão.', image: '/images/lips-profile.webp', alt: 'Perfil com foco nos lábios e na harmonia da expressão', position: '52% 48%' },
  { title: 'Odontologia integrada', lines: ['Odontologia', 'integrada'], description: 'Saúde, função e beleza no mesmo cuidado.', image: '/images/smile-man.webp', alt: 'Sorriso masculino do acervo da Clínica Holly', position: '50% 47%' },
]
const treatmentDetails = [
  { title: 'Seu sorriso, do seu jeito.', description: 'Durante a avaliação, conversamos sobre resultado, rotina e possibilidades para indicar a técnica que faz sentido para você.', options: [
    { title: 'Resina basic', description: 'Superfície mais lisa, ideal para quem busca linhas retas e uma cor mais evidente.' },
    { title: 'Resina premium', description: 'Mais detalhe e resistência, reproduzindo com precisão a forma dos dentes.' },
    { title: 'Resina estratificada & porcelana', description: 'Alternativas para quem valoriza translucidez, naturalidade e durabilidade.' },
  ] },
  { title: 'Harmonia que respeita você.', description: 'Procedimentos planejados para equilibrar proporções e manter o que faz seu rosto ser unicamente seu.', options: [
    { title: 'Preenchimento', description: 'Ácido hialurônico para regiões como lábios, nariz, olheiras, queixo e mandíbula, conforme avaliação.' },
    { title: 'Botox & bioestimulador', description: 'Tratamentos voltados a suavizar, prevenir e estimular com leveza.' },
    { title: 'Contorno facial', description: 'Fios de PDO, enzima facial, lipo de papada e outras indicações personalizadas.' },
  ] },
  { title: 'Saúde é a base de toda beleza.', description: 'O sorriso mais bonito começa em uma boca saudável. Por isso, a Holly reúne especialidades para um cuidado completo.', options: [
    { title: 'Implantes', description: 'Planejamento para devolver função e segurança ao seu sorriso.' },
    { title: 'Endodontia', description: 'Cuidado especializado para preservar a saúde e a estrutura do dente.' },
    { title: 'Ortodontia & adicionais', description: 'Alinhamento, gengivoplastia, remoção de facetas, fixa adesiva e manutenção.' },
  ] },
]

function select(index: number) {
  active.value = index
  selected.value = selected.value === index ? null : index
}
watch(selected, async () => {
  await nextTick()
  ScrollTrigger.refresh()
})
function refreshAfterResize(event: TransitionEvent) {
  if (event.propertyName === 'height') ScrollTrigger.refresh()
}
</script>

<template>
  <section id="especialidades" class="specialties" aria-labelledby="specialties-title">
    <div class="container">
      <div class="specialties-heading">
        <div class="section-label"><HollyStar /><p class="eyebrow">Especialidades</p></div>
        <RevealText id="specialties-title">Escolha por onde<br>quer <em>começar.</em></RevealText>
        <span class="section-number">03 / 08</span>
      </div>
      <RevealBlock class="specialties-panels">
        <article v-for="(treatment, index) in treatments" :key="treatment.title" class="specialty-panel" :class="{ 'is-active': active === index, 'is-open': selected === index }" @pointerenter="active = index" @transitionend="refreshAfterResize">
          <img class="panel-photo" :src="treatment.image" :srcset="`${treatment.image.replace('.webp', '-640.webp')} 640w, ${treatment.image.replace('.webp', '-960.webp')} 960w, ${treatment.image} 1122w`" sizes="(max-width: 767px) 90vw, 50vw" :alt="treatment.alt" width="1122" height="1402" loading="lazy" decoding="async" :style="{ objectPosition: treatment.position }">
          <div class="panel-shade" aria-hidden="true"></div>
          <button class="panel-button" :aria-expanded="selected === index" :aria-controls="`treatment-detail-${index}`" :aria-label="`Explorar ${treatment.title}`" @click="select(index)" @focus="active = index">
            <span class="panel-number">0{{ index + 1 }} <span class="panel-line" aria-hidden="true"></span></span>
            <span class="panel-title"><span v-for="line in treatment.lines" :key="line">{{ line }}</span></span>
            <span class="panel-explore">Explorar <span class="panel-plus" aria-hidden="true">{{ selected === index ? '−' : '+' }}</span></span>
          </button>
          <div :id="`treatment-detail-${index}`" class="panel-detail" :inert="selected !== index" :aria-hidden="selected !== index">
            <p>{{ treatment.description }}</p>
            <a :href="clinic.whatsapp" class="treatment-cta" target="_blank" rel="noopener noreferrer">Agendar avaliação <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      </RevealBlock>
      <div v-for="(detail, index) in treatmentDetails" v-show="selected === index" :id="`treatment-options-${index}`" :key="detail.title" class="treatment-options" role="region" :aria-label="treatments[index]?.title">
        <div class="treatment-options-intro"><h3>{{ detail.title }}</h3><p>{{ detail.description }}</p></div>
        <dl><div v-for="option in detail.options" :key="option.title"><dt>{{ option.title }}</dt><dd>{{ option.description }}</dd></div></dl>
      </div>
      <div class="specialties-footer"><span class="eyebrow">Estética integrada</span><span class="eyebrow">Clínica Holly <span aria-hidden="true">—</span> desde 2021</span></div>
    </div>
  </section>
</template>

<style scoped>
.specialties{background:var(--ink);color:var(--ivory);padding:clamp(80px,9vw,145px) 0 clamp(65px,7vw,105px)}.specialties-heading{display:grid;grid-template-columns:1fr 1.6fr auto;align-items:start;gap:30px;margin-bottom:65px}.specialties-heading .section-label{margin-top:11px}.specialties-heading h2{margin:0;letter-spacing:-.025em}.specialties-heading h2 em{color:var(--champagne)}.section-number{font-size:10px;letter-spacing:.15em;color:#a59d90;margin-top:14px}
.specialties-panels{display:flex;gap:10px;min-height:570px;height:clamp(570px,43vw,740px)}.specialty-panel{position:relative;flex:1;overflow:hidden;transition:flex .85s cubic-bezier(.22,1,.36,1);isolation:isolate;min-width:0}.specialty-panel.is-active{flex:1.45}.panel-photo{position:absolute;width:100%;height:100%;inset:0;object-fit:cover;transform:scale(1.035);transition:transform 1.2s cubic-bezier(.22,1,.36,1)}.is-active .panel-photo{transform:scale(1.085)}.panel-shade{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(8,8,7,.24),rgba(8,8,7,.04) 22%,rgba(8,8,7,.24) 49%,rgba(8,8,7,.93) 100%)}
.panel-button{position:absolute;inset:0;background:none;border:0;color:var(--ivory);z-index:2;cursor:pointer;text-align:left;padding:35px clamp(20px,2.3vw,40px);display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;width:100%;transition:padding-bottom .7s cubic-bezier(.22,1,.36,1)}.panel-button:focus-visible{outline:2px solid var(--champagne);outline-offset:-7px}.panel-number{position:absolute;top:30px;left:clamp(20px,2.3vw,40px);right:clamp(20px,2.3vw,40px);display:flex;gap:20px;align-items:center;font-size:10px;letter-spacing:.15em}.panel-line{height:1px;background:rgba(243,239,229,.35);flex:1;transform:scaleX(.35);transform-origin:left;transition:transform .7s}.is-active .panel-line{transform:scaleX(1)}.panel-title{font-family:var(--display);font-size:clamp(2.1rem,3.5vw,4.3rem);line-height:1.02;letter-spacing:-.02em;display:flex;flex-direction:column;margin-bottom:28px}.panel-explore{font-size:10px;letter-spacing:.12em;text-transform:uppercase;display:flex;justify-content:space-between;width:100%;align-items:center}.panel-plus{font-size:23px;font-weight:300;line-height:1}
.is-open .panel-button{padding-bottom:155px}.panel-detail{position:absolute;bottom:32px;left:clamp(20px,2.3vw,40px);right:clamp(20px,2.3vw,40px);z-index:3;opacity:0;transform:translateY(15px);transition:opacity .5s,transform .5s;pointer-events:none}.is-open .panel-detail{opacity:1;transform:translateY(0);pointer-events:auto}.panel-detail p{font-size:12px;line-height:1.7;margin:0 0 18px;max-width:260px;color:#ddd5c7}.treatment-cta{font-size:10px;line-height:1.6;color:var(--champagne);text-decoration:none;padding-bottom:5px;display:inline-flex;gap:20px;border-bottom:1px solid #8c7851}.treatment-cta span{transition:transform .25s}.treatment-cta:hover span{transform:translate(3px,-3px)}.treatment-cta:active{opacity:.75}.specialties-footer{display:flex;align-items:center;justify-content:space-between;margin-top:24px;color:#aba396}.specialties-footer .eyebrow{font-size:8px}
.treatment-options{display:grid;grid-template-columns:1fr 1.6fr;gap:70px;padding:46px 0 34px;border-bottom:1px solid #383329}.treatment-options-intro h3{font:400 clamp(1.85rem,2.5vw,3rem)/1.13 var(--display);color:var(--champagne);margin:0 0 17px;max-width:320px}.treatment-options-intro p{font-size:11px;line-height:1.9;max-width:320px;color:#b5ac9d}.treatment-options dl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:29px;margin:0}.treatment-options dt{font:400 23px/1.15 var(--display);margin:0 0 16px}.treatment-options dd{font-size:10px;line-height:1.9;color:#b5ac9d;margin:0}
@media(max-width:1023px){.specialties-heading{grid-template-columns:1fr 1.4fr}.specialties-heading h2{font-size:3.5rem}.section-number{display:none}.specialties-panels{gap:7px;height:560px;min-height:560px}.panel-title{font-size:clamp(1.85rem,3.7vw,2.45rem)}.panel-button{padding-right:19px;padding-left:19px}.panel-number{left:19px;right:19px}.panel-detail{left:19px;right:19px}.panel-detail p{font-size:11px}.is-open .panel-button{padding-bottom:165px}.treatment-options{gap:35px;grid-template-columns:1fr 1.7fr}.treatment-options dl{gap:20px}.treatment-options dt{font-size:20px}}
@media(max-width:767px){.specialties-heading{display:block;margin-bottom:38px}.specialties-heading .section-label{margin:0 0 34px}.specialties-heading h2{font-size:clamp(3.3rem,11.5vw,5rem)}.specialties-panels{display:flex;flex-direction:column;height:auto;min-height:0;gap:12px}.specialty-panel,.specialty-panel.is-active{flex:auto;height:240px;transition:height .7s cubic-bezier(.22,1,.36,1)}.specialty-panel.is-open{height:480px}.panel-photo{object-position:50% 40%!important}.panel-shade{background:linear-gradient(180deg,rgba(8,8,7,.2),rgba(8,8,7,.12) 20%,rgba(8,8,7,.9) 100%)}.panel-button{padding:25px}.panel-number{top:23px;left:25px;right:25px}.panel-title{font-size:2.9rem;margin-bottom:17px}.panel-title{flex-direction:row;flex-wrap:wrap;gap:0 8px;max-width:95%}.panel-detail{left:25px;right:25px;bottom:29px}.panel-detail p{font-size:13px;max-width:285px}.is-open .panel-button{padding-bottom:154px}.specialties-footer .eyebrow{font-size:7px;letter-spacing:.12em}.panel-line{transform:scaleX(1)}}
@media(prefers-reduced-motion:reduce){.specialty-panel,.panel-photo,.panel-button,.panel-line,.panel-detail{transition:none}.panel-photo,.is-active .panel-photo{transform:none}}
@media(max-width:767px){.treatment-options{display:block;padding:32px 0 27px}.treatment-options-intro h3{font-size:2.25rem;margin-bottom:14px}.treatment-options-intro p{font-size:11px;max-width:360px}.treatment-options dl{display:block;margin-top:30px}.treatment-options dl>div{padding-top:19px;margin-top:19px;border-top:1px solid #302b23}.treatment-options dt{font-size:23px;margin-bottom:10px}.treatment-options dd{font-size:11px;max-width:350px}}
</style>
