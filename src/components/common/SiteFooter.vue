<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import BrandLogo from '../ui/BrandLogo.vue'
import ArrowIcon from '../ui/ArrowIcon.vue'
import HollyStar from '../ui/HollyStar.vue'
import { clinic } from '../../data/clinic'
import { setScrollLocked } from '../../composables/useLenis'

const privacy = ref<HTMLDialogElement>()
function openPrivacy() { privacy.value?.showModal(); setScrollLocked(true) }
function closePrivacy() { privacy.value?.close() }
function afterClose() { setScrollLocked(false) }
function backdropClick(event: MouseEvent) { if (event.target === privacy.value) closePrivacy() }
onUnmounted(() => { if (privacy.value?.open) setScrollLocked(false) })
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-main">
        <BrandLogo />
        <p class="footer-tagline">Estética integrada para revelar<br>a sua melhor versão.</p>
        <nav aria-label="Navegação do rodapé"><a href="#experiencia">A Holly</a><a href="#especialidades">Especialidades</a><a href="#resultados">Resultados</a></nav>
        <nav aria-label="Contato e informações"><a :href="clinic.instagram" target="_blank" rel="noopener noreferrer">Instagram <ArrowIcon /></a><a :href="clinic.whatsapp" target="_blank" rel="noopener noreferrer">Contato <ArrowIcon /></a><button type="button" @click="openPrivacy">Privacidade <ArrowIcon /></button></nav>
      </div>
      <div class="footer-bottom"><small>© {{ new Date().getFullYear() }} Clínica Holly. Todos os direitos reservados.</small><p>Arujá, SP <HollyStar /> Estética integrada</p><a href="#inicio" aria-label="Voltar ao início">Voltar ao início <ArrowIcon direction="up" class="footer-back-arrow" /></a></div>
    </div>
  </footer>
  <dialog ref="privacy" class="privacy-dialog" aria-labelledby="privacy-title" @close="afterClose" @click="backdropClick">
    <div class="privacy-content">
      <div class="privacy-top"><p class="eyebrow">Atendimento com transparência</p><button type="button" autofocus aria-label="Fechar informações de privacidade" @click="closePrivacy">×</button></div>
      <h2 id="privacy-title">Antes de cada escolha,<br><em>informação.</em></h2>
      <div class="privacy-item"><span>01</span><div><h3>Avaliação online</h3><p>As fotos para análise são solicitadas com orientações da equipe e avaliadas pelo profissional responsável.</p></div></div>
      <div class="privacy-item"><span>02</span><div><h3>Planejamento e contrato</h3><p>Após aprovação, o atendimento segue com os termos e orientações adequados ao seu plano.</p></div></div>
      <div class="privacy-item"><span>03</span><div><h3>Agendamento</h3><p>A data e o período são organizados junto a você. Consulte a equipe sobre as condições de sinal e remarcação.</p></div></div>
      <a class="text-link" :href="clinic.whatsapp" target="_blank" rel="noopener noreferrer">Falar com a equipe <ArrowIcon /></a>
    </div>
  </dialog>
</template>

<style scoped>
.site-footer{background:var(--ink);color:var(--ivory);border-top:1px solid #26231c;padding:65px 0 25px}
.footer-main{display:grid;grid-template-columns:1fr 1.45fr 1fr .8fr;gap:40px;align-items:start;padding-bottom:65px}
.footer-tagline{font-size:12px;line-height:1.8;color:#a59d90;max-width:240px}
nav{display:flex;flex-direction:column;gap:15px}
nav a,nav button{display:inline-flex;align-items:center;justify-content:space-between;gap:16px;width:fit-content;padding:0;border:0;background:none;font-size:10px;color:#bdb5a6;transition:color .3s}
nav a:hover,nav button:hover{color:var(--champagne)}
.footer-bottom{display:flex;align-items:center;justify-content:space-between;gap:24px;border-top:1px solid #27241c;padding-top:26px;color:#a59d90;font-size:8px}
.footer-bottom small{font-size:8px}.footer-bottom p{display:flex;align-items:center;gap:14px;font-size:7px;letter-spacing:.12em;text-transform:uppercase}.footer-bottom svg{width:12px;height:12px;color:#b69865}
.footer-bottom>a{display:flex;align-items:center;gap:16px;font-size:8px;letter-spacing:.08em}.footer-back-arrow{width:17px;height:17px;transition:transform .3s}.footer-bottom>a:hover .footer-back-arrow{transform:translateY(-4px)}
.privacy-dialog{width:720px;padding:0;border:1px solid #5f5038;background:var(--ivory);color:var(--ink)}
.privacy-content{padding:clamp(26px,5vw,55px)}
.privacy-top{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:26px;color:var(--bronze)}
.privacy-top button{display:grid;place-items:center;width:44px;height:44px;background:none;border:1px solid #b6a789;font-size:30px;font-weight:400;flex-shrink:0}
.privacy-content h2{font-size:clamp(36px,5vw,57px);line-height:1.05;margin-bottom:30px}.privacy-content h2 em{color:var(--bronze)}
.privacy-item{display:grid;grid-template-columns:25px 1fr;gap:14px;padding:22px 0;border-top:1px solid #d9d0be}.privacy-item>span{font-size:9px;color:var(--bronze);padding-top:6px}.privacy-item h3{font-size:27px}.privacy-item p{font-size:12px;margin-top:8px;color:#5d574c}.privacy-content .text-link{margin-top:12px}
@media(max-width:767px){.site-footer{padding-top:44px}.footer-main{grid-template-columns:1fr 1fr;gap:35px 20px;padding-bottom:40px}.footer-tagline{font-size:10px}.footer-bottom{display:grid;grid-template-columns:1fr auto;gap:22px 12px}.footer-bottom small{grid-column:1/-1;font-size:7px}.footer-bottom p{font-size:6px;gap:10px}.footer-bottom>a{font-size:7px;gap:10px}}
</style>
