<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { clinic } from '../data/clinic'
import { serviceCategories } from '../data/services'
import ArrowIcon from '../components/ui/ArrowIcon.vue'
import HollyStar from '../components/ui/HollyStar.vue'
import BioIcon from './BioIcon.vue'

const links = [
  { href: clinic.whatsappBio, icon: 'whatsapp', title: 'Agendar avaliação', description: 'Atendimento pelo WhatsApp', primary: true, external: true },
  { href: clinic.harmonizationCatalog, icon: 'catalog', title: 'Catálogo Harmonização Facial', description: 'Conheça os procedimentos de estética', primary: false, external: true },
  { href: '/', icon: 'site', title: 'Conheça nosso site', description: 'A clínica, o Dr. Guilherme e os resultados', primary: false, external: false },
] as const

const highlights = [
  { id: 'lentes', image: '/images/smile-close', alt: 'Sorriso com lentes do acervo da Clínica Holly', position: '50% 50%' },
  { id: 'estetica', image: '/images/lips-profile', alt: 'Perfil com foco nos lábios e na harmonia da expressão', position: '52% 46%' },
  { id: 'implantes', image: '/images/smile-man', alt: 'Sorriso masculino do acervo da Clínica Holly', position: '50% 46%' },
].map((highlight) => ({ ...highlight, category: serviceCategories.find((category) => category.id === highlight.id)! }))

const spaces = [
  { image: '/images/space-reception-640.webp', label: 'Recepção', alt: 'Recepção da Clínica Holly com logotipo iluminado e balcão em mármore e madeira', position: '40% 50%' },
  { image: '/images/space-room-brand-640.webp', label: 'Consultório', alt: 'Consultório da Clínica Holly com cadeira odontológica e logotipo Holly na parede', position: '45% 50%' },
  { image: '/images/space-room-view-640.webp', label: 'Luz natural', alt: 'Consultório com janelas panorâmicas voltadas para árvores', position: '32% 50%' },
  { image: '/images/space-corridor-640.webp', label: 'Boas-vindas', alt: 'Painel ripado com a frase Aqui a estrela é você', position: '36% 50%' },
]

const nav = ref<HTMLElement>()
const showFloating = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  const target = nav.value?.querySelector('.is-primary')
  if (!target || !('IntersectionObserver' in window)) return
  observer = new IntersectionObserver(([entry]) => {
    if (entry) showFloating.value = !entry.isIntersecting && entry.boundingClientRect.top < 0
  })
  observer.observe(target)
})
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div class="bio">
    <svg class="bio-orbit" viewBox="0 0 600 600" fill="none" aria-hidden="true"><ellipse cx="300" cy="300" rx="210" ry="285" transform="rotate(24 300 300)" /></svg>
    <main class="bio-shell">
      <header class="bio-brand reveal" style="--i:0">
        <svg class="brand-symbol" viewBox="0 0 50 64" aria-hidden="true">
          <path d="M8 3Q28 32 8 61Q20 32 8 3M42 3Q22 32 42 61Q30 32 42 3" fill="currentColor" />
          <path d="m25 20 2.4 8.6L36 32l-8.6 2.4L25 44l-2.4-9.6L14 32l8.6-3.4Z" fill="currentColor" />
        </svg>
        <h1><span class="brand-category">Clínica</span><span class="brand-word">HOLLY</span></h1>
        <p class="brand-tagline">Estética integrada <span aria-hidden="true">·</span> Arujá, SP</p>
      </header>

      <section class="bio-hero reveal" style="--i:1" aria-label="Apresentação">
        <img src="/images/hero-smile-960.webp" srcset="/images/hero-smile-640.webp 640w, /images/hero-smile-960.webp 960w" sizes="(max-width: 520px) 100vw, 480px" alt="" width="960" height="640" fetchpriority="high" decoding="async">
        <div class="bio-hero-shade" aria-hidden="true"></div>
        <svg class="bio-hero-mark" viewBox="0 0 200 300" fill="none" aria-hidden="true">
          <path class="mark-arc" d="M30 10A221 221 0 0 1 30 290" />
          <path class="mark-arc" d="M170 10A221 221 0 0 0 170 290" />
          <path class="mark-star" d="m100 128 4.4 15.6L120 150l-15.6 4.4L100 172l-4.4-17.6L80 150l15.6-6.4Z" />
        </svg>
        <div class="bio-hero-copy">
          <p class="bio-eyebrow">Lentes · Estética · Implantes</p>
          <h2>Seu sorriso.<br><em>Sua assinatura.</em></h2>
          <p>Tratamentos pensados para valorizar o que existe de mais autêntico em você.</p>
        </div>
      </section>

      <ul class="bio-trust reveal" style="--i:2" aria-label="Sobre a clínica">
        <li><HollyStar /><strong>Desde 2021</strong><span>Estética integrada</span></li>
        <li><HollyStar /><strong>SP e RJ</strong><span>Atendimentos</span></li>
        <li><HollyStar /><strong>Convênios</strong><span>MetLife · SulAmérica · OdontoGroup</span></li>
      </ul>

      <nav ref="nav" class="bio-links" aria-label="Links da Clínica Holly">
        <a v-for="(link, index) in links" :key="link.title" class="bio-link reveal" :class="{ 'is-primary': link.primary }" :style="{ '--i': index + 3 }" :href="link.href" v-bind="link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}">
          <span class="bio-link-icon"><BioIcon :name="link.icon" /></span>
          <span class="bio-link-text"><strong>{{ link.title }}</strong><span>{{ link.description }}</span></span>
          <ArrowIcon class="bio-link-arrow" />
        </a>
      </nav>

      <section class="bio-section" aria-labelledby="highlights-title">
        <div class="bio-section-head"><p class="bio-eyebrow"><HollyStar />Nossos destaques</p><h2 id="highlights-title">Tratamentos em <em>destaque.</em></h2></div>
        <div class="bio-highlights">
          <article v-for="(highlight, index) in highlights" :key="highlight.id" class="bio-highlight">
            <div class="bio-highlight-photo">
              <img :src="`${highlight.image}-640.webp`" :alt="highlight.alt" width="640" height="800" loading="lazy" decoding="async" :style="{ objectPosition: highlight.position }">
              <span class="bio-highlight-number">0{{ index + 1 }}</span>
              <h3>{{ highlight.category.title }}</h3>
            </div>
            <p>{{ highlight.category.summary }}</p>
            <ul><li v-for="item in highlight.category.items.slice(0, 4)" :key="item">{{ item }}</li></ul>
          </article>
        </div>
      </section>

      <section class="bio-section" aria-labelledby="services-title">
        <div class="bio-section-head"><p class="bio-eyebrow"><HollyStar />Cardápio completo</p><h2 id="services-title">Todos os <em>tratamentos.</em></h2></div>
        <div class="bio-services">
          <details v-for="(category, index) in serviceCategories" :key="category.id" class="bio-service" name="servicos" :open="index === 0">
            <summary>
              <span class="bio-service-index">0{{ index + 1 }}</span>
              <span class="bio-service-title">{{ category.title }}<small v-if="category.featured">Destaque</small></span>
              <span class="bio-service-count">{{ category.items.length }}</span>
              <span class="bio-service-plus" aria-hidden="true"></span>
            </summary>
            <div class="bio-service-body">
              <ul><li v-for="item in category.items" :key="item">{{ item }}</li></ul>
              <p v-if="category.note">{{ category.note }}</p>
            </div>
          </details>
        </div>
        <a class="bio-inline-cta" :href="clinic.whatsappBio" target="_blank" rel="noopener noreferrer">Quero agendar minha avaliação <ArrowIcon /></a>
      </section>

      <section class="bio-section" aria-labelledby="space-title">
        <div class="bio-section-head"><p class="bio-eyebrow"><HollyStar />Fotos reais da unidade</p><h2 id="space-title">Um espaço pensado para o seu <em>momento.</em></h2></div>
        <div class="bio-spaces">
          <figure v-for="space in spaces" :key="space.label">
            <img :src="space.image" :alt="space.alt" width="640" height="360" loading="lazy" decoding="async" :style="{ objectPosition: space.position }">
            <figcaption>{{ space.label }}</figcaption>
          </figure>
        </div>
        <a class="bio-address" :href="clinic.maps" target="_blank" rel="noopener noreferrer">
          <span class="bio-link-icon"><BioIcon name="pin" /></span>
          <span><strong>{{ clinic.address }}</strong><span>{{ clinic.neighborhood }}</span></span>
          <ArrowIcon class="bio-link-arrow" />
        </a>
      </section>

      <footer class="bio-footer">
        <svg class="footer-mark" viewBox="0 0 200 120" fill="none" aria-hidden="true">
          <path d="M62 8A110 110 0 0 1 62 112" /><path d="M138 8A110 110 0 0 0 138 112" />
          <path class="mark-star" d="m100 46 2.6 9.4L112 60l-9.4 2.6L100 74l-2.6-11.4L88 60l9.4-4.6Z" />
        </svg>
        <p class="footer-quote">Aqui, a estrela<br><em>é você.</em></p>
        <div class="footer-social">
          <a :href="clinic.instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Clínica Holly"><BioIcon name="instagram" /></a>
          <a :href="clinic.whatsappBio" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp da Clínica Holly"><BioIcon name="whatsapp" /></a>
        </div>
        <small>© Clínica Holly · Estética integrada</small>
      </footer>
    </main>

    <a class="bio-floating" :class="{ 'is-visible': showFloating }" :href="clinic.whatsappBio" target="_blank" rel="noopener noreferrer" :tabindex="showFloating ? 0 : -1" :aria-hidden="!showFloating">
      <BioIcon name="whatsapp" /><span>Agendar avaliação</span><ArrowIcon />
    </a>
  </div>
</template>

<style scoped>
.bio{--panel:#12100d;--line:rgb(227 210 144 / 13%);--gold:#d5b980;--muted:#a59d90;position:relative;min-height:100svh;overflow:hidden;background:radial-gradient(120% 60% at 50% 0%,#1a1610 0%,var(--ink) 58%);color:var(--ivory)}
.bio-orbit{position:absolute;width:min(900px,170vw);left:50%;top:-6%;transform:translateX(-50%);stroke:var(--gold);stroke-width:.5;opacity:.13;pointer-events:none}
.bio-shell{position:relative;width:min(480px,100%);margin:0 auto;padding:44px 18px calc(110px + env(safe-area-inset-bottom))}

.bio-brand{display:flex;flex-direction:column;align-items:center;text-align:center}
.brand-symbol{width:38px;height:49px;color:#c4a16c;margin-bottom:14px}
.bio-brand h1{display:flex;flex-direction:column;align-items:center;margin:0;font-weight:400}
.brand-category{font:500 9px var(--sans);letter-spacing:.32em;text-transform:uppercase;color:#ceb788;margin-bottom:4px;padding-left:.32em}
.brand-word{font:400 48px/1 var(--display);letter-spacing:.05em}
.brand-tagline{margin-top:14px;font-size:9px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--muted);line-height:1.6}
.brand-tagline span{color:var(--bronze);margin-inline:6px}

.bio-hero{position:relative;margin-top:32px;aspect-ratio:4/5;overflow:hidden;border:1px solid var(--line);isolation:isolate}
.bio-hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:68% 40%;z-index:-2;transform:scale(1.04);animation:heroZoom 14s ease-out both}
.bio-hero-shade{position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(8,8,7,.15) 0%,rgba(8,8,7,0) 30%,rgba(8,8,7,.55) 60%,rgba(8,8,7,.96) 100%),linear-gradient(90deg,rgba(8,8,7,.55),transparent 70%)}
.bio-hero-mark{position:absolute;right:-6%;top:5%;width:56%;stroke:var(--gold);stroke-width:1.1;opacity:.85}
.mark-arc{stroke-dasharray:300;stroke-dashoffset:300;animation:draw 2.2s .5s cubic-bezier(.22,1,.36,1) forwards}
.mark-star{fill:var(--gold);stroke:none;transform-origin:100px 150px;animation:twinkle 1.2s 1.6s both}
.bio-hero-copy{position:absolute;left:24px;right:24px;bottom:26px}
.bio-hero-copy h2{font-size:clamp(2.9rem,12.5vw,3.6rem);line-height:.98;letter-spacing:-.03em;margin:12px 0 14px}
.bio-hero-copy h2 em{color:var(--gold)}
.bio-hero-copy>p:last-child{font-size:12px;line-height:1.75;color:#d7d2c8;max-width:270px}
.bio-eyebrow{display:flex;align-items:center;gap:9px;font-size:9px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);line-height:1.6}
.bio-eyebrow :deep(svg){width:12px;height:12px;color:var(--bronze)}

.bio-trust{list-style:none;margin:14px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border:1px solid var(--line);background:rgb(18 16 13 / 70%)}
.bio-trust li{display:flex;flex-direction:column;align-items:center;text-align:center;gap:5px;padding:16px 8px 15px}
.bio-trust li+li{border-left:1px solid var(--line)}
.bio-trust :deep(svg){width:13px;height:13px;color:var(--bronze);margin-bottom:3px}
.bio-trust strong{font:400 19px/1.1 var(--display);letter-spacing:-.01em}
.bio-trust span{font-size:7.5px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);line-height:1.6}

.bio-links{display:flex;flex-direction:column;gap:10px;margin-top:26px}
.bio-link{position:relative;display:flex;align-items:center;gap:15px;min-height:74px;padding:14px 18px 14px 14px;border:1px solid var(--line);background:var(--panel);transition:border-color .3s,background .3s,transform .3s}
.bio-link:hover{border-color:rgb(213 185 128 / 45%);background:#17140f}
.bio-link:active{transform:scale(.985)}
.bio-link-icon{display:grid;place-items:center;width:44px;height:44px;flex:none;border:1px solid rgb(213 185 128 / 35%);border-radius:50%;color:var(--gold);font-size:20px}
.bio-link-text{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}
.bio-link-text strong{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;line-height:1.35}
.bio-link-text span{font-size:11.5px;color:var(--muted);line-height:1.45}
.bio-link-arrow{font-size:17px;color:var(--gold);transition:transform .3s}
.bio-link:hover .bio-link-arrow{transform:translate(3px,-3px)}
.bio-link.is-primary{border-color:transparent;background:linear-gradient(120deg,#e3c992 0%,#d5b980 45%,#b88f55 100%);color:var(--ink);box-shadow:0 18px 40px -22px rgb(213 185 128 / 70%)}
.bio-link.is-primary::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgb(255 255 255 / 35%) 48%,transparent 66%);transform:translateX(-120%);animation:shine 4.5s 2.2s ease-in-out infinite;pointer-events:none}
.bio-link.is-primary .bio-link-icon{border-color:rgb(8 8 7 / 30%);background:var(--ink);color:var(--gold)}
.bio-link.is-primary .bio-link-text span{color:#3a3020}
.bio-link.is-primary .bio-link-arrow{color:var(--ink)}
.bio-link.is-primary:hover{background:linear-gradient(120deg,#ead3a0 0%,#dcc28c 45%,#c09a60 100%)}

.bio-section{margin-top:64px}
.bio-section-head{margin-bottom:22px}
.bio-section-head h2{font-size:clamp(2.3rem,10vw,2.9rem);line-height:1.02;letter-spacing:-.03em;margin:12px 0 0}
.bio-section-head h2 em{color:var(--gold)}

.bio-highlights{display:flex;gap:12px;margin:0 -18px;padding:0 18px 4px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:18px;scrollbar-width:none}
.bio-highlights::-webkit-scrollbar{display:none}
.bio-highlight{flex:0 0 78%;scroll-snap-align:start;border:1px solid var(--line);background:var(--panel);padding:10px 10px 18px}
.bio-highlight-photo{position:relative;aspect-ratio:4/4.3;overflow:hidden;isolation:isolate}
.bio-highlight-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.bio-highlight-photo::after{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,transparent 45%,rgba(8,8,7,.85))}
.bio-highlight-number{position:absolute;top:14px;left:15px;font-size:9px;letter-spacing:.16em;color:var(--ivory)}
.bio-highlight h3{position:absolute;left:15px;right:15px;bottom:13px;font-size:30px;line-height:1;letter-spacing:-.02em;color:var(--ivory)}
.bio-highlight>p{font-size:12px;line-height:1.7;color:#cfc7b9;margin:15px 6px 12px}
.bio-highlight ul{list-style:none;display:flex;flex-wrap:wrap;gap:6px;margin:0 6px;padding:0}
.bio-highlight li{font-size:9.5px;letter-spacing:.04em;color:var(--gold);border:1px solid rgb(213 185 128 / 28%);padding:5px 9px;line-height:1.3}

.bio-services{border-top:1px solid var(--line)}
.bio-service{border-bottom:1px solid var(--line)}
.bio-service summary{display:flex;align-items:center;gap:14px;padding:19px 2px;cursor:pointer;list-style:none}
.bio-service summary::-webkit-details-marker{display:none}
.bio-service summary:focus-visible{outline-offset:2px}
.bio-service-index{font-size:9px;letter-spacing:.15em;color:#7f7768;width:18px}
.bio-service-title{flex:1;display:flex;align-items:center;flex-wrap:wrap;gap:4px 10px;font:400 24px/1.1 var(--display);letter-spacing:-.01em}
.bio-service-title small{font:500 7.5px var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--ink);background:var(--gold);padding:4px 7px 3px}
.bio-service-count{font-size:10px;color:var(--muted)}
.bio-service-plus{position:relative;width:13px;height:13px;flex:none}
.bio-service-plus::before,.bio-service-plus::after{content:'';position:absolute;left:0;right:0;top:6px;height:1px;background:var(--gold);transition:transform .35s}
.bio-service-plus::after{transform:rotate(90deg)}
.bio-service[open] .bio-service-plus::after{transform:rotate(0)}
.bio-service[open] .bio-service-title{color:var(--gold)}
.bio-service-body{padding:0 2px 20px 32px;animation:open .45s cubic-bezier(.22,1,.36,1)}
.bio-service-body ul{list-style:none;margin:0;padding:0}
.bio-service-body li{position:relative;font-size:13px;line-height:1.5;color:#ddd5c7;padding:8px 0 8px 16px}
.bio-service-body li::before{content:'';position:absolute;left:0;top:17px;width:6px;height:1px;background:var(--bronze)}
.bio-service-body li+li{border-top:1px solid rgb(227 210 144 / 7%)}
.bio-service-body p{margin-top:10px;font-size:11px;line-height:1.7;color:var(--muted);font-style:italic}
.bio-inline-cta{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:22px;padding:14px 0;border-bottom:1px solid var(--gold);font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
.bio-inline-cta .arrow-icon{font-size:16px;transition:transform .3s}
.bio-inline-cta:hover .arrow-icon{transform:translate(3px,-3px)}

.bio-spaces{display:flex;gap:10px;margin:0 -18px;padding:0 18px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:18px;scrollbar-width:none}
.bio-spaces::-webkit-scrollbar{display:none}
.bio-spaces figure{flex:0 0 70%;scroll-snap-align:start;margin:0}
.bio-spaces img{width:100%;aspect-ratio:4/5;object-fit:cover;border:1px solid var(--line)}
.bio-spaces figcaption{margin-top:10px;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
.bio-address{display:flex;align-items:center;gap:15px;margin-top:22px;padding:14px 18px 14px 14px;border:1px solid var(--line);background:var(--panel);transition:border-color .3s}
.bio-address:hover{border-color:rgb(213 185 128 / 45%)}
.bio-address>span:nth-child(2){display:flex;flex-direction:column;gap:3px;flex:1;min-width:0}
.bio-address strong{font-size:12px;font-weight:500;line-height:1.45}
.bio-address>span:nth-child(2) span{font-size:11px;color:var(--muted)}

.bio-footer{display:flex;flex-direction:column;align-items:center;text-align:center;margin-top:72px;padding-top:40px;border-top:1px solid var(--line)}
.footer-mark{width:92px;stroke:var(--gold);stroke-width:1.4}
.footer-quote{margin-top:16px;font:400 32px/1.05 var(--display);letter-spacing:-.02em}
.footer-quote em{color:var(--gold)}
.footer-social{display:flex;gap:12px;margin-top:24px}
.footer-social a{display:grid;place-items:center;width:44px;height:44px;border:1px solid rgb(213 185 128 / 35%);border-radius:50%;color:var(--gold);font-size:19px;transition:background .3s,color .3s}
.footer-social a:hover{background:var(--gold);color:var(--ink)}
.bio-footer small{margin-top:24px;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#6f685d}

.bio-floating{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));z-index:10;display:flex;align-items:center;justify-content:center;gap:12px;width:min(444px,calc(100% - 36px));min-height:54px;padding:0 22px;background:linear-gradient(120deg,#e3c992,#d5b980 45%,#b88f55);color:var(--ink);font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;box-shadow:0 18px 45px -12px rgb(0 0 0 / 80%);transform:translate(-50%,150%);opacity:0;transition:transform .5s cubic-bezier(.22,1,.36,1),opacity .4s;pointer-events:none}
.bio-floating.is-visible{transform:translate(-50%,0);opacity:1;pointer-events:auto}
.bio-floating>.bio-icon{font-size:19px}
.bio-floating>span{flex:1;text-align:center}
.bio-floating>.arrow-icon{font-size:16px}

.reveal{animation:rise .9s calc(var(--i,0) * .09s) cubic-bezier(.22,1,.36,1) both}
@keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes twinkle{from{opacity:0;transform:scale(.3) rotate(-45deg)}to{opacity:1;transform:none}}
@keyframes heroZoom{from{transform:scale(1.12)}to{transform:scale(1.04)}}
@keyframes shine{0%,62%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
@keyframes open{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}

@media(min-width:768px){
  .bio-shell{padding-top:64px}
  .bio-highlights,.bio-spaces{margin:0;padding:0 0 4px;scroll-padding-inline:0}
}
@media(prefers-reduced-motion:reduce){
  .reveal,.bio-hero>img,.mark-star,.bio-service-body{animation:none}
  .mark-arc{animation:none;stroke-dashoffset:0}
  .bio-link.is-primary::after{display:none}
}
</style>
