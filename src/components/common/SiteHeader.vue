<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import BrandLogo from '../ui/BrandLogo.vue'
import HollyStar from '../ui/HollyStar.vue'
import { clinic, navigation } from '../../data/clinic'
import { setScrollLocked } from '../../composables/useLenis'
import { gsap } from '../../lib/motion'

const scrolled = ref(false)
const active = ref('inicio')
const menuOpen = ref(false)
const dialog = ref<HTMLDialogElement>()
const toggleButton = ref<HTMLButtonElement>()
let opener: HTMLElement | null = null
let observer: IntersectionObserver | undefined
let ctx: gsap.Context | undefined
const updateScroll = () => { scrolled.value = window.scrollY > 40 }

function openMenu(event?: MouseEvent) {
  opener = (event?.currentTarget as HTMLElement) ?? toggleButton.value ?? (document.activeElement as HTMLElement)
  dialog.value?.showModal()
  menuOpen.value = true
  setScrollLocked(true)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ctx?.revert()
    ctx = gsap.context(() => {
      gsap.from('.menu-item', { y: 26, opacity: 0, stagger: .07, duration: .65, ease: 'power3.out' })
    }, dialog.value)
  }
}

function closeMenu() { dialog.value?.close() }

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !dialog.value) return
  const focusable = Array.from(
    dialog.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
  ).filter((element) => element.offsetParent !== null || element.getClientRects().length > 0)
  if (focusable.length === 0) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey) {
    if (document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    }
  } else if (document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

function navigateTo(id: string) {
  closeMenu()
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

function afterClose() {
  menuOpen.value = false
  setScrollLocked(false)
  opener?.focus({ preventScroll: true })
}
function onResize() { if (window.innerWidth > 1100 && menuOpen.value) closeMenu() }
onMounted(() => {
  updateScroll()
  window.addEventListener('scroll', updateScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) active.value = entry.target.id
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 })
  document.querySelectorAll('main section[id]').forEach((section) => observer?.observe(section))
})
onUnmounted(() => {
  observer?.disconnect()
  ctx?.revert()
  window.removeEventListener('scroll', updateScroll)
  window.removeEventListener('resize', onResize)
  if (menuOpen.value) setScrollLocked(false)
})
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="header-inner container">
      <BrandLogo />
      <nav class="desktop-nav" aria-label="Navegação principal">
        <a v-for="item in navigation" :key="item.id" :href="`#${item.id}`" :aria-current="active === item.id ? 'location' : undefined">{{ item.label }}</a>
      </nav>
      <a class="header-cta" :href="clinic.whatsapp" target="_blank" rel="noopener noreferrer">Agendar avaliação <span aria-hidden="true">↗</span></a>
      <button ref="toggleButton" class="menu-toggle" type="button" aria-controls="mobile-navigation" :aria-expanded="menuOpen" aria-label="Abrir menu de navegação" @click="openMenu($event)"><span>Menu</span><span class="menu-bars" aria-hidden="true"><i></i><i></i></span></button>
    </div>
  </header>
  <dialog id="mobile-navigation" ref="dialog" class="mobile-menu" aria-label="Navegação principal" @keydown="onKeydown" @close="afterClose">
    <div class="mobile-menu-head"><BrandLogo @click="closeMenu" /><button class="menu-close" type="button" autofocus aria-label="Fechar menu" @click="closeMenu">Fechar <span aria-hidden="true">×</span></button></div>
    <nav aria-label="Navegação mobile">
      <a v-for="(item, index) in navigation" :key="item.id" class="menu-item" :href="`#${item.id}`" @click="navigateTo(item.id)"><span class="eyebrow">0{{ index + 1 }}</span>{{ item.label }}<span class="menu-link-arrow" aria-hidden="true">↗</span></a>
      <a class="menu-item menu-contact" :href="clinic.whatsapp" target="_blank" rel="noopener noreferrer" @click="closeMenu"><span class="eyebrow">06</span>Seu momento Holly<span class="menu-link-arrow" aria-hidden="true">↗</span></a>
    </nav>
    <div class="mobile-menu-foot"><p class="eyebrow">Estética integrada<br>Arujá, São Paulo</p><HollyStar /><a :href="clinic.instagram" target="_blank" rel="noopener noreferrer" class="eyebrow">Instagram ↗</a></div>
  </dialog>
</template>

<style scoped>
.site-header{position:fixed;inset:0 0 auto;z-index:40;border-bottom:1px solid rgb(243 239 229 / 12%);transition:background .4s,border-color .4s;}
.header-inner{height:102px;display:flex;align-items:center;justify-content:space-between;gap:24px;transition:height .4s}
.is-scrolled{background:rgb(8 8 7 / 94%);backdrop-filter:blur(9px);border-color:rgb(243 239 229 / 9%)}
.is-scrolled .header-inner{height:78px}
.desktop-nav{display:flex;gap:clamp(18px,2.2vw,36px);align-items:center}
.desktop-nav a{position:relative;padding:12px 0;color:#d2cdc3;font-size:10px;letter-spacing:.035em;transition:color .3s}
.desktop-nav a::after{content:'';position:absolute;left:0;bottom:4px;width:100%;height:1px;background:#c9aa75;transform:scaleX(0);transform-origin:right;transition:transform .3s}
.desktop-nav a:hover,.desktop-nav a[aria-current]{color:var(--champagne)}
.desktop-nav a:hover::after,.desktop-nav a[aria-current]::after{transform:scaleX(1);transform-origin:left}
.header-cta{display:inline-flex;align-items:center;justify-content:space-between;gap:28px;min-height:43px;padding:12px 19px;border:1px solid rgb(207 178 125 / 55%);color:#dfc998;font-size:9px;letter-spacing:.105em;text-transform:uppercase;transition:background .3s,color .3s}
.header-cta:hover{background:#cfb27d;color:var(--ink)}
.header-cta span{font-size:16px;transition:transform .3s}.header-cta:hover span{transform:translate(3px,-2px)}
.menu-toggle{display:none;align-items:center;gap:14px;border:0;background:none;padding:12px 0;font-size:10px;letter-spacing:.08em}
.menu-bars{display:flex;flex-direction:column;gap:6px;width:25px}.menu-bars i{height:1px;width:25px;background:var(--ivory)}.menu-bars i:last-child{width:17px;margin-left:auto}
.mobile-menu{position:fixed;inset:0;width:100%;height:100dvh;max-width:100%;max-height:100%;margin:0;padding:24px var(--gutter) 32px;border:0;background:var(--ink);color:var(--ivory)}
.mobile-menu[open]{display:flex;flex-direction:column}
.mobile-menu-head{display:flex;align-items:center;justify-content:space-between}
.menu-close{display:flex;align-items:center;gap:18px;background:none;border:0;font-size:10px;letter-spacing:.1em;padding:12px}.menu-close span{font-size:30px;font-weight:400;line-height:1}
.mobile-menu nav{margin-block:auto;padding-block:36px}
.menu-item{display:flex;align-items:center;gap:24px;font-family:var(--display);font-size:clamp(31px,7.5vw,62px);line-height:1.35;padding:12px 0;border-bottom:1px solid #27251e;transition:color .3s}
.menu-item .eyebrow{color:#bf9b61;font-family:var(--sans);font-size:9px}
.menu-link-arrow{margin-left:auto;font-family:var(--sans);font-size:18px;color:#baa075}
.menu-item:hover,.menu-contact{color:#cfb27d}
.mobile-menu-foot{display:flex;align-items:center;justify-content:space-between;gap:24px;color:var(--taupe)}.mobile-menu-foot svg{width:25px;color:#c9aa75}
@media(max-width:1100px){.desktop-nav{display:none}.header-cta{margin-left:auto}.menu-toggle{display:flex}.header-inner{height:88px}}
@media(max-width:600px){.header-inner{height:79px;gap:12px}.is-scrolled .header-inner{height:69px}.header-cta{display:none}.menu-toggle{font-size:9px}.menu-item{gap:18px}.mobile-menu nav{padding-block:20px}}
@media(max-height:650px){.menu-item{padding:7px 0;font-size:31px}.mobile-menu-foot{display:none}}
</style>
