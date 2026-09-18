<script setup lang="ts">
import { clinic } from '../data/clinic'
import ParallaxImage from '../components/motion/ParallaxImage.vue'
import RevealText from '../components/motion/RevealText.vue'
import RevealBlock from '../components/motion/RevealBlock.vue'
import HollyStar from '../components/ui/HollyStar.vue'
import TiltCard from '../components/motion/TiltCard.vue'
</script>

<template>
  <section id="clinica" class="clinic" aria-labelledby="clinic-title">
    <div class="container">
      <div class="clinic-label section-label"><HollyStar /><p class="eyebrow">Clínica Holly • Arujá, SP</p><span class="section-number">07 / 08</span></div>
      <div class="clinic-heading">
        <RevealText id="clinic-title">Um espaço pensado<br>para o seu <em>momento.</em></RevealText>
        <RevealBlock class="clinic-address"><address>Estrada de Santa Isabel, 965 — Sala 27<br>Bairro Caputerá, Arujá — SP</address><a class="text-link" :href="clinic.maps" target="_blank" rel="noopener noreferrer">Abrir localização <span aria-hidden="true">↗</span></a></RevealBlock>
      </div>
      <div class="clinic-gallery">
        <RevealBlock class="clinic-main-photo">
          <ParallaxImage src="/images/clinic-reception.webp" alt="Recepção da Clínica Holly, com balcão em pedra, iluminação quente e logotipo na parede" :width="1448" :height="1086" position="50% 47%" :speed="4" :scale="1.08" sizes="(max-width: 767px) 100vw, 85vw" />
          <svg class="clinic-orbit" viewBox="0 0 1000 600" fill="none" aria-hidden="true"><ellipse cx="522" cy="315" rx="397" ry="243" transform="rotate(-17 522 315)" /><path d="m872 420 4 12 12 4-12 4-4 12-4-12-12-4 12-4z" /></svg>
          <span class="clinic-photo-caption eyebrow">Um espaço para se sentir bem cuidado.</span>
        </RevealBlock>
        <RevealBlock class="clinic-detail-photo"><TiltCard><ParallaxImage src="/images/clinic-lounge.webp" alt="Lounge da Clínica Holly com poltronas, mesa de apoio e iluminação acolhedora" :width="1448" :height="1086" position="50% 48%" :speed="2" :scale="1.06" sizes="(max-width: 767px) 58vw, 30vw" /></TiltCard></RevealBlock>
        <div class="clinic-bottom-note"><HollyStar /><p class="eyebrow">Unidade em Arujá, São Paulo.<br>Atendimentos também no Rio de Janeiro.</p></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.clinic{background:var(--ivory);color:var(--ink);padding:clamp(90px,9vw,150px) 0 clamp(90px,10vw,160px);overflow:hidden}.clinic-label{margin-bottom:46px}.section-number{margin-left:auto;font-size:10px;letter-spacing:.15em;color:#70695f}.clinic-heading{display:grid;grid-template-columns:1.65fr 1fr;align-items:end;gap:60px;margin-bottom:66px}.clinic-heading h2{font-size:clamp(3rem,5.9vw,7rem);letter-spacing:-.03em;margin:0}.clinic-heading h2 em{color:var(--bronze)}.clinic-address{justify-self:end;padding-bottom:9px}.clinic-address address{font-style:normal;font-size:12px;line-height:1.9;color:#645d51;margin-bottom:25px}.clinic-address .text-link{font-size:10px}.clinic-gallery{position:relative;padding-bottom:140px}.clinic-main-photo{position:relative;aspect-ratio:1.95;width:91%;overflow:hidden}.clinic-main-photo :deep(.parallax-image){height:100%}.clinic-main-photo::after{content:'';position:absolute;bottom:0;left:0;right:0;height:27%;background:linear-gradient(transparent,rgba(8,8,7,.55));pointer-events:none}.clinic-photo-caption{position:absolute;left:30px;bottom:29px;z-index:2;color:var(--ivory);font-size:8px}.clinic-detail-photo{position:absolute;right:0;bottom:0;width:34%;aspect-ratio:1.2;border:9px solid var(--ivory);border-right:0;border-bottom:0;z-index:3}.clinic-detail-photo :deep(.parallax-image){height:100%}.clinic-orbit{position:absolute;inset:0;z-index:1;width:100%;height:100%;stroke:var(--champagne);stroke-width:.7;opacity:.3;pointer-events:none}.clinic-orbit path{fill:var(--champagne);stroke:none}.clinic-bottom-note{display:flex;align-items:center;gap:20px;margin-top:28px;color:#74664f}.clinic-bottom-note :deep(svg){width:23px;height:23px;color:var(--bronze)}.clinic-bottom-note .eyebrow{font-size:8px;line-height:1.9;letter-spacing:.12em;margin:0}
.clinic-detail-photo :deep(.tilt-perspective),.clinic-detail-photo :deep(.tilt-card){height:100%}
@media(max-width:1023px){.clinic-heading{grid-template-columns:1.4fr 1fr;gap:30px}.clinic-heading h2{font-size:3.55rem}.clinic-address address{font-size:10px}.clinic-gallery{padding-bottom:95px}.clinic-main-photo{width:95%;aspect-ratio:1.65}.clinic-detail-photo{width:37%}.clinic-photo-caption{font-size:7px;left:24px;bottom:24px}.clinic-bottom-note .eyebrow{font-size:7px;max-width:290px}}
@media(max-width:767px){.clinic-label{margin-bottom:34px}.clinic-heading{display:block;margin-bottom:35px}.clinic-heading h2{font-size:clamp(3rem,10.7vw,4.8rem)}.clinic-address{margin-top:29px;padding:0}.clinic-address address{font-size:11px;line-height:1.9;margin-bottom:20px}.clinic-gallery{padding-bottom:0}.clinic-main-photo{width:calc(100% + 40px);margin-left:-20px;aspect-ratio:1.02}.clinic-main-photo :deep(img){object-position:47% 50%!important}.clinic-photo-caption{font-size:7px;left:20px;bottom:21px}.clinic-detail-photo{position:relative;width:67%;aspect-ratio:1.25;margin-top:-32px;margin-left:auto;margin-right:-7px;border:7px solid var(--ivory);border-right:0;border-bottom:0}.clinic-bottom-note{margin-top:29px;gap:15px}.clinic-bottom-note .eyebrow{font-size:7px;line-height:1.9;max-width:none}.clinic-bottom-note :deep(svg){width:20px;height:20px}.clinic-orbit{width:150%;max-width:none;left:-20%;opacity:.25}}
</style>
