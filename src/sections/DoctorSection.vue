<script setup lang="ts">
import { clinic } from '../data/clinic'
import ParallaxImage from '../components/motion/ParallaxImage.vue'
import RevealText from '../components/motion/RevealText.vue'
import RevealBlock from '../components/motion/RevealBlock.vue'
import HollyStar from '../components/ui/HollyStar.vue'
</script>

<template>
  <section id="doutor" class="doctor" aria-labelledby="doctor-title">
    <div class="container doctor-grid">
      <div class="doctor-label section-label"><HollyStar /><p class="eyebrow">Dr. Guilherme Lucena</p><span class="section-number">06 / 08</span></div>
      <RevealBlock class="doctor-portrait">
        <ParallaxImage src="/images/doctor-editorial.webp" alt="Dr. Guilherme Lucena, fundador da Clínica Holly, sentado na clínica" :width="1122" :height="1402" position="50% 30%" :speed="3" :scale="1.06" sizes="(max-width: 767px) 89vw, 48vw" />
        <span class="portrait-caption eyebrow">Dr. Guilherme Lucena</span>
      </RevealBlock>
      <div class="doctor-copy">
        <p class="eyebrow founder-label">Fundador da Clínica Holly</p>
        <RevealText id="doctor-title" as="h2">“A melhor estética<br>é aquela que parece<br><em>ser sua desde<br>sempre.</em>”</RevealText>
        <RevealBlock class="doctor-biography">
          <p>Cirurgião-dentista, pós-graduado em Endodontia, com atuação em estética dentária e harmonização facial. Dr. Guilherme Lucena fundou a Holly em 2021 com a visão de unir atendimento próximo, precisão técnica e resultados elegantes.</p>
          <a class="text-link" :href="clinic.doctorInstagram" target="_blank" rel="noopener noreferrer">Acompanhe o Dr. Guilherme <span aria-hidden="true">↗</span></a>
        </RevealBlock>
      </div>
      <svg class="doctor-arc" viewBox="0 0 900 900" fill="none" aria-hidden="true"><path d="M85 880C-150 365 232-53 583 67c196 67 339 415 181 777" /><path d="M111 888C-111 379 251-14 576 95c179 60 310 388 169 744" /></svg>
      <div class="doctor-signature" aria-hidden="true"><span>Guilherme</span><em>Lucena</em><HollyStar /></div>
    </div>
  </section>
</template>

<style scoped>
.doctor{position:relative;background:var(--ink);color:var(--ivory);padding:clamp(85px,9vw,150px) 0 clamp(100px,12vw,200px);overflow:hidden}.doctor-grid{position:relative;display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:clamp(20px,3vw,55px)}.doctor-label{grid-column:1/-1;margin-bottom:66px}.section-number{margin-left:auto;color:var(--taupe);font-size:10px;letter-spacing:.15em}.doctor-portrait{grid-column:1/7;position:relative;aspect-ratio:4/5;z-index:1;align-self:start}.doctor-portrait :deep(.parallax-image){height:100%}.doctor-portrait::after{position:absolute;content:'';inset:60% 0 0;background:linear-gradient(transparent,rgba(8,8,7,.55));pointer-events:none}.portrait-caption{position:absolute;left:29px;bottom:25px;z-index:2;font-size:9px}.doctor-copy{grid-column:7/13;padding-top:47px;z-index:3;position:relative}.founder-label{font-size:8px;color:var(--taupe);margin:0 0 37px}.doctor-copy h2{font-size:clamp(2.6rem,4.8vw,5.9rem);line-height:1.055;letter-spacing:-.03em;margin:0 0 36px;margin-left:-4.6vw;width:calc(100% + 4.6vw);text-shadow:0 2px 40px rgba(8,8,7,.15)}.doctor-copy h2 em{color:var(--champagne)}.doctor-biography{max-width:350px}.doctor-biography p{font-size:12px;line-height:1.95;color:#b6aea0;margin:0 0 27px}.doctor-biography .text-link{font-size:10px;color:var(--ivory)}.doctor-arc{position:absolute;width:92%;left:8%;top:4%;stroke:#ae8950;stroke-width:.5;opacity:.22;pointer-events:none;z-index:2}.doctor-signature{grid-column:1/-1;display:flex;align-items:baseline;gap:3vw;position:relative;z-index:4;margin-top:-.055em;font:400 clamp(3.8rem,11.7vw,13.5rem)/.9 var(--display);letter-spacing:-.045em;margin-left:3.7vw;pointer-events:none}.doctor-signature em{color:var(--champagne)}.doctor-signature :deep(svg){width:clamp(30px,5vw,72px);height:clamp(30px,5vw,72px);align-self:center;color:var(--champagne);margin-left:auto;margin-right:8%}
@media(min-width:1600px){.doctor-copy{padding-top:70px}.doctor-copy h2{margin-left:-55px;width:calc(100% + 55px)}.doctor-biography{max-width:380px;font-size:13px}}
@media(max-width:1023px){.doctor-grid{gap:0 25px}.doctor-copy{padding-top:10px}.doctor-copy h2{font-size:3.35rem;line-height:1.07;margin-left:-28px;width:calc(100% + 28px)}.founder-label{margin-bottom:25px}.doctor-biography p{font-size:11px;line-height:1.85}.doctor-portrait{aspect-ratio:3/4}.doctor-signature{margin-top:35px}.doctor-signature :deep(svg){margin-right:0}}
@media(max-width:767px){.doctor-label{margin-bottom:35px}.doctor-grid{display:block}.doctor-portrait{width:100%;aspect-ratio:4/5}.doctor-portrait :deep(img){object-position:50% 30%!important}.portrait-caption{left:20px;bottom:20px;font-size:8px}.doctor-copy{padding-top:42px}.founder-label{font-size:8px;margin-bottom:26px}.doctor-copy h2{font-size:clamp(2.6rem,9.7vw,4.25rem);margin-left:0;width:auto;line-height:1.06;margin-bottom:27px}.doctor-copy h2 br:first-child{display:none}.doctor-biography{max-width:350px}.doctor-biography p{font-size:12px}.doctor-signature{font-size:clamp(3.2rem,11.8vw,5.4rem);gap:10px;flex-wrap:wrap;margin:57px 0 0}.doctor-signature :deep(svg){height:23px;width:23px;margin-left:auto}.doctor-arc{width:155%;left:-30%;top:12%;opacity:.25}.doctor-biography .text-link{font-size:10px}}
</style>
