<script setup lang="ts">
import { clinic } from '../data/clinic'
import ParallaxImage from '../components/motion/ParallaxImage.vue'
import ArrowIcon from '../components/ui/ArrowIcon.vue'
import RevealText from '../components/motion/RevealText.vue'
import RevealBlock from '../components/motion/RevealBlock.vue'
import HollyStar from '../components/ui/HollyStar.vue'
import TiltCard from '../components/motion/TiltCard.vue'

const rooms = [
  { image: '/images/space-corridor.webp', label: 'Boas-vindas', alt: 'Corredor da Clínica Holly com painel ripado e a frase Aqui a estrela é você, jardim vertical e poltronas de espera', position: '36% 50%' },
  { image: '/images/space-planning.webp', label: 'Sala de planejamento', alt: 'Sala de planejamento da Clínica Holly, com mesa de madeira, poltronas e certificados na parede, diante de janelas amplas', position: '65% 50%' },
  { image: '/images/space-room-clinical.webp', label: 'Consultório clínico', alt: 'Consultório da Clínica Holly com cadeira odontológica, bancada branca e espelho', position: '64% 50%' },
]
</script>

<template>
  <section id="clinica" class="clinic" aria-labelledby="clinic-title">
    <div class="container">
      <div class="clinic-label section-label"><HollyStar /><p class="eyebrow">Clínica Holly • Arujá, SP</p><span class="section-number">07 / 08</span></div>
      <div class="clinic-heading">
        <RevealText id="clinic-title">Um espaço pensado<br>para o seu <em>momento.</em></RevealText>
        <RevealBlock class="clinic-address"><address>Estrada de Santa Isabel, 965 — Sala 27<br>Bairro Caputerá, Arujá — SP</address><a class="text-link" :href="clinic.maps" target="_blank" rel="noopener noreferrer">Abrir localização <ArrowIcon /></a></RevealBlock>
      </div>
      <div class="clinic-gallery">
        <RevealBlock class="clinic-main-photo">
          <ParallaxImage src="/images/space-reception.webp" alt="Recepção da Clínica Holly, com balcão em mármore e madeira e o logotipo iluminado na parede" :width="1920" :height="1080" position="50% 42%" :speed="4" :scale="1.08" sizes="(max-width: 767px) 100vw, 85vw" />
          <svg class="clinic-orbit" viewBox="0 0 1000 600" fill="none" aria-hidden="true"><ellipse cx="522" cy="315" rx="397" ry="243" transform="rotate(-17 522 315)" /><path d="m872 420 4 12 12 4-12 4-4 12-4-12-12-4 12-4z" /></svg>
          <span class="clinic-photo-caption eyebrow">Um espaço para se sentir bem cuidado.</span>
        </RevealBlock>
        <RevealBlock class="clinic-detail-photo"><TiltCard><ParallaxImage src="/images/space-room-view.webp" alt="Consultório da Clínica Holly com cadeira odontológica e janelas panorâmicas voltadas para árvores" :width="1920" :height="1080" position="30% 50%" :speed="2" :scale="1.06" sizes="(max-width: 767px) 58vw, 30vw" /></TiltCard></RevealBlock>
        <div class="clinic-bottom-note"><HollyStar /><p class="eyebrow">Unidade em Arujá, São Paulo.<br>Atendimentos também no Rio de Janeiro.</p></div>
      </div>
      <div class="clinic-tour">
        <div class="tour-head"><p class="eyebrow">Por dentro da Holly</p><span class="eyebrow">Fotos reais da unidade</span></div>
        <div class="tour-feature">
          <div class="tour-copy">
            <RevealText as="h3" class="tour-title">Luz natural, calma<br>e cuidado em<br><em>cada sala.</em></RevealText>
            <RevealBlock><p>Consultórios com janelas amplas voltadas para o verde e uma sala reservada para conversar, com tempo, sobre o seu planejamento.</p></RevealBlock>
          </div>
          <RevealBlock as="figure" class="tour-photo tour-photo-main">
            <div class="tour-frame"><ParallaxImage src="/images/space-room-brand.webp" alt="Consultório da Clínica Holly com cadeira odontológica vermelha, logotipo Holly na parede e janelas laterais" :width="1920" :height="1080" position="50% 50%" :speed="3" :scale="1.07" sizes="(max-width: 767px) 100vw, 62vw" /></div>
            <figcaption><span>Consultório Holly</span><span class="caption-number">01</span></figcaption>
          </RevealBlock>
        </div>
        <div class="tour-row">
          <RevealBlock v-for="(room, index) in rooms" :key="room.label" as="figure" class="tour-photo tour-photo-small">
            <div class="tour-frame"><ParallaxImage :src="room.image" :alt="room.alt" :width="1920" :height="1080" :position="room.position" :speed="2.5" :scale="1.07" sizes="(max-width: 767px) 74vw, 30vw" /></div>
            <figcaption><span>{{ room.label }}</span><span class="caption-number">0{{ index + 2 }}</span></figcaption>
          </RevealBlock>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.clinic{background:var(--ivory);color:var(--ink);padding:clamp(90px,9vw,150px) 0 clamp(90px,10vw,160px);overflow:hidden}.clinic-label{margin-bottom:46px}.section-number{margin-left:auto;font-size:10px;letter-spacing:.15em;color:#70695f}.clinic-heading{display:grid;grid-template-columns:1.65fr 1fr;align-items:end;gap:60px;margin-bottom:66px}.clinic-heading h2{font-size:clamp(3rem,5.9vw,7rem);letter-spacing:-.03em;margin:0}.clinic-heading h2 em{color:var(--bronze)}.clinic-address{justify-self:end;padding-bottom:9px}.clinic-address address{font-style:normal;font-size:12px;line-height:1.9;color:#645d51;margin-bottom:25px}.clinic-address .text-link{font-size:10px}.clinic-gallery{position:relative;padding-bottom:140px}.clinic-main-photo{position:relative;aspect-ratio:1.95;width:91%;overflow:hidden}.clinic-main-photo :deep(.parallax-image){height:100%}.clinic-main-photo::after{content:'';position:absolute;bottom:0;left:0;right:0;height:27%;background:linear-gradient(transparent,rgba(8,8,7,.55));pointer-events:none}.clinic-photo-caption{position:absolute;left:30px;bottom:29px;z-index:2;color:var(--ivory);font-size:8px}.clinic-detail-photo{position:absolute;right:0;bottom:0;width:34%;aspect-ratio:1.2;border:9px solid var(--ivory);border-right:0;border-bottom:0;z-index:3}.clinic-detail-photo :deep(.parallax-image){height:100%}.clinic-orbit{position:absolute;inset:0;z-index:1;width:100%;height:100%;stroke:var(--champagne);stroke-width:.7;opacity:.3;pointer-events:none}.clinic-orbit path{fill:var(--champagne);stroke:none}.clinic-bottom-note{display:flex;align-items:center;gap:20px;margin-top:28px;color:#74664f}.clinic-bottom-note :deep(svg){width:23px;height:23px;color:var(--bronze)}.clinic-bottom-note .eyebrow{font-size:8px;line-height:1.9;letter-spacing:.12em;margin:0}
.clinic-detail-photo :deep(.tilt-perspective),.clinic-detail-photo :deep(.tilt-card){height:100%}
.clinic-tour{margin-top:clamp(100px,10vw,170px)}.tour-head{display:flex;justify-content:space-between;align-items:center;gap:20px;padding-bottom:22px;margin-bottom:clamp(45px,5vw,80px);border-bottom:1px solid #ccc3b3}.tour-head .eyebrow{font-size:8px;color:#6e675b}.tour-head .eyebrow:first-child{color:var(--bronze)}
.tour-feature{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:clamp(20px,3.8vw,70px);align-items:end}.tour-copy{grid-column:1/5;padding-bottom:58px}.tour-title{font-size:clamp(2.4rem,3.7vw,4.4rem);line-height:1.02;letter-spacing:-.03em;margin:0 0 30px}.tour-title em{color:var(--bronze)}.tour-copy p{max-width:310px;font-size:13px;line-height:1.9;color:#625d54}
.tour-photo{margin:0;min-width:0}.tour-photo-main{grid-column:5/13}.tour-frame{position:relative;overflow:hidden;background:var(--warm)}.tour-photo-main .tour-frame{aspect-ratio:1.7}.tour-frame :deep(.parallax-image){height:100%;transition:transform .9s cubic-bezier(.22,1,.36,1)}.tour-photo:hover .tour-frame :deep(.parallax-image){transform:scale(1.035)}
.tour-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:clamp(20px,3.8vw,70px);margin-top:clamp(60px,6vw,100px);align-items:start}.tour-photo-small .tour-frame{aspect-ratio:.82}.tour-photo-small:nth-child(2){margin-top:90px}.tour-photo-small:nth-child(3){margin-top:36px}
.tour-photo figcaption{display:flex;justify-content:space-between;margin-top:18px;font-size:10px;letter-spacing:.035em;color:#615a50}.tour-photo .caption-number{font-size:9px;letter-spacing:.1em;color:var(--bronze)}
@media(max-width:1023px){.clinic-heading{grid-template-columns:1.4fr 1fr;gap:30px}.clinic-heading h2{font-size:3.55rem}.clinic-address address{font-size:10px}.clinic-gallery{padding-bottom:95px}.clinic-main-photo{width:95%;aspect-ratio:1.65}.clinic-detail-photo{width:37%}.clinic-photo-caption{font-size:7px;left:24px;bottom:24px}.clinic-bottom-note .eyebrow{font-size:7px;max-width:290px}.tour-copy{grid-column:1/6;padding-bottom:30px}.tour-title{font-size:2.6rem}.tour-copy p{font-size:12px}.tour-photo-main{grid-column:6/13}.tour-photo-main .tour-frame{aspect-ratio:1.25}.tour-row{column-gap:22px}.tour-photo-small:nth-child(2){margin-top:60px}.tour-photo-small:nth-child(3){margin-top:24px}}
@media(max-width:767px){.clinic-label{margin-bottom:34px}.clinic-heading{display:block;margin-bottom:35px}.clinic-heading h2{font-size:clamp(3rem,10.7vw,4.8rem)}.clinic-address{margin-top:29px;padding:0}.clinic-address address{font-size:11px;line-height:1.9;margin-bottom:20px}.clinic-gallery{padding-bottom:0}.clinic-main-photo{width:calc(100% + 40px);margin-left:-20px;aspect-ratio:1.02}.clinic-main-photo :deep(img){object-position:36% 50%!important}.clinic-photo-caption{font-size:7px;left:20px;bottom:21px}.clinic-detail-photo{position:relative;width:67%;aspect-ratio:1.25;margin-top:-32px;margin-left:auto;margin-right:-7px;border:7px solid var(--ivory);border-right:0;border-bottom:0}.clinic-bottom-note{margin-top:29px;gap:15px}.clinic-bottom-note .eyebrow{font-size:7px;line-height:1.9;max-width:none}.clinic-bottom-note :deep(svg){width:20px;height:20px}.clinic-orbit{width:150%;max-width:none;left:-20%;opacity:.25}.clinic-tour{margin-top:80px}.tour-head{padding-bottom:18px;margin-bottom:36px}.tour-head .eyebrow{font-size:7px}.tour-feature{display:block}.tour-copy{padding-bottom:34px}.tour-title{font-size:clamp(2.5rem,9.6vw,3.6rem);margin-bottom:22px}.tour-copy p{font-size:12px;max-width:330px}.tour-photo-main .tour-frame{aspect-ratio:1.2;width:calc(100% + 40px);margin-left:-20px}.tour-photo-main .tour-frame :deep(img){object-position:34% 50%!important}.tour-photo figcaption{font-size:9px;margin-top:13px}.tour-row{display:flex;gap:13px;margin:38px calc(var(--gutter) * -1) 0;padding:0 var(--gutter) 6px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:var(--gutter);scrollbar-width:none}.tour-row::-webkit-scrollbar{display:none}.tour-photo-small{flex:0 0 74%;scroll-snap-align:start}.tour-photo-small:nth-child(n){margin-top:0}}
@media(prefers-reduced-motion:reduce){.tour-frame :deep(.parallax-image){transition:none}.tour-photo:hover .tour-frame :deep(.parallax-image){transform:none}}
</style>
