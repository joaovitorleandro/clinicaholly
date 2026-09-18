<script setup lang="ts">
import ParallaxImage from '../components/motion/ParallaxImage.vue'
import ArrowIcon from '../components/ui/ArrowIcon.vue'
import RevealText from '../components/motion/RevealText.vue'
import RevealBlock from '../components/motion/RevealBlock.vue'
import HollyStar from '../components/ui/HollyStar.vue'
</script>

<template>
  <section id="experiencia" class="experience" aria-labelledby="experience-title">
    <div class="container experience-grid">
      <div class="experience-label section-label"><HollyStar /><p class="eyebrow">A experiência Holly</p><span class="section-number">02 / 08</span></div>
      <RevealBlock class="experience-photo">
        <ParallaxImage src="/images/beauty-portrait.webp" alt="Retrato de beleza da Clínica Holly, com foco na naturalidade da expressão" :width="1122" :height="1402" position="50% 38%" :speed="4" :scale="1.08" sizes="(max-width: 767px) 86vw, 38vw" />
        <span class="photo-note eyebrow">Estética integrada</span>
      </RevealBlock>
      <div class="experience-copy">
        <RevealText id="experience-title">Estética que<br>começa com<br><em>escuta.</em></RevealText>
        <RevealBlock class="experience-body">
          <p>Na Holly, cada plano é individual. Entendemos sua história, seus desejos e a harmonia do seu rosto antes de desenhar qualquer transformação.</p>
          <a class="text-link" href="#clinica">Conheça a clínica <ArrowIcon /></a>
        </RevealBlock>
      </div>
      <RevealBlock class="experience-stats">
        <div class="stat"><strong>+56k</strong><p>pessoas que acompanham<br>nosso trabalho</p></div>
        <div class="stat"><strong>5–10 <small>anos</small></strong><p>de estimativa para facetas em resina,<br>com os cuidados indicados</p></div>
      </RevealBlock>
      <svg class="experience-orbit" viewBox="0 0 500 600" fill="none" aria-hidden="true"><ellipse cx="250" cy="300" rx="204" ry="282" transform="rotate(-28 250 300)" /></svg>
    </div>
  </section>
</template>

<style scoped>
.experience{position:relative;z-index:2;background:var(--ivory);color:var(--ink);padding:clamp(84px,10vw,170px) 0 clamp(95px,11vw,180px);overflow:hidden}
.experience-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));position:relative;column-gap:clamp(16px,2.5vw,45px)}
.experience-label{grid-column:1/-1;margin-bottom:76px;position:relative;z-index:2}.section-number{margin-left:auto;font:10px var(--sans);letter-spacing:.15em;color:#6d685e}
.experience-photo{grid-column:1/6;grid-row:2/4;position:relative;aspect-ratio:4/5;align-self:start;z-index:1}.experience-photo :deep(.parallax-image){height:100%}.photo-note{position:absolute;bottom:24px;left:25px;color:var(--ivory);font-size:9px;text-shadow:0 1px 15px #000}
.experience-copy{grid-column:7/13;grid-row:2;z-index:2;padding-top:24px}.experience-copy h2{font-size:clamp(3.6rem,7.3vw,8.2rem);margin:0 0 38px;letter-spacing:-.035em}.experience-copy em{color:var(--bronze)}
.experience-body{max-width:355px;margin-left:5px}.experience-body p{font-size:14px;line-height:1.9;color:#625d54;margin:0 0 27px}.experience-body .text-link{font-size:11px}
.experience-stats{grid-column:7/13;grid-row:3;display:grid;grid-template-columns:1fr 1fr;gap:28px;align-self:end;margin-top:60px;border-top:1px solid #c9c0ae;padding-top:27px;z-index:2}.stat strong{font-family:var(--display);font-size:clamp(2.5rem,4vw,4.5rem);font-weight:400;line-height:1.15;letter-spacing:-.045em}.stat strong small{font:italic 21px var(--display);letter-spacing:0}.stat p{font-size:10px;line-height:1.7;color:#70695f;margin:10px 0 0}
.experience-orbit{position:absolute;width:52%;right:-22%;top:10%;stroke:var(--bronze);stroke-width:.6;opacity:.22;pointer-events:none}
@media(min-width:1600px){.experience-copy{padding-top:48px}.experience-stats{margin-bottom:15px}}
@media(max-width:1023px){.experience-photo{grid-column:1/6;aspect-ratio:3/4}.experience-copy{grid-column:6/13;padding-top:0}.experience-copy h2{font-size:clamp(3.5rem,7.8vw,6rem)}.experience-stats{grid-column:6/13;margin-top:35px;gap:15px}.stat p br{display:none}}
@media(max-width:767px){.experience-grid{grid-template-columns:repeat(6,minmax(0,1fr));column-gap:16px}.experience-label{margin-bottom:45px}.experience-copy{grid-column:1/-1;grid-row:2}.experience-copy h2{font-size:clamp(3.8rem,13.8vw,6.5rem);margin-bottom:28px}.experience-body{max-width:360px;margin-left:0}.experience-body p{font-size:13px;line-height:1.85}.experience-photo{grid-column:2/7;grid-row:3;margin-top:44px;aspect-ratio:4/5}.photo-note{bottom:20px;left:18px;font-size:8px}.experience-stats{grid-column:1/-1;grid-row:4;margin-top:38px;gap:22px;padding-top:22px}.stat strong{font-size:3.3rem}.stat p{font-size:10px}.experience-orbit{width:90%;right:-45%;top:24%}}
</style>
