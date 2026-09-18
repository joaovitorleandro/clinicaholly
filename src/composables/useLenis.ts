import { onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/motion'

let instance: Lenis | undefined
export function setScrollLocked(locked: boolean) {
  if (locked) instance?.stop()
  else instance?.start()
}

export function useLenis() {
  let media: MediaQueryList
  const tick = (seconds: number) => instance?.raf(seconds * 1000)
  const destroy = () => {
    gsap.ticker.remove(tick)
    instance?.off('scroll', ScrollTrigger.update)
    instance?.destroy()
    instance = undefined
  }
  const setup = () => {
    destroy()
    if (media.matches) return
    instance = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -88 },
      prevent: (element) => element.closest('dialog, [data-lenis-prevent]') !== null,
    })
    instance.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
  }
  onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)')
    setup()
    media.addEventListener('change', setup)
  })
  onUnmounted(() => {
    media?.removeEventListener('change', setup)
    destroy()
  })
}
