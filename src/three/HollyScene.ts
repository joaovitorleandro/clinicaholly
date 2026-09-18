import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  DoubleSide,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
} from 'three'
import type { WebGLRenderTarget } from 'three'
import { createHollySignatureObject } from './HollySignatureObject'

const SCENE = {
  cameraFov: 40,
  desktopCameraZ: 9.8,
  mobileCameraZ: 11.4,
  desktopDpr: 1.5,
  mobileDpr: 1.2,
  pointerDamping: 3.4,
  maxDelta: 0.05,
} as const

export interface HollySceneController {
  setProgress: (progress: number) => void
  dispose: () => void
}

/** Procedural studio reflectors; no images, remote maps, or model downloads. */
function createStudioEnvironment(renderer: WebGLRenderer): WebGLRenderTarget {
  const studio = new Scene()
  studio.background = new Color('#171511')
  const geometry = new PlaneGeometry(1, 1)
  const warmMaterial = new MeshBasicMaterial({ color: '#e3d2ac', side: DoubleSide })
  const neutralMaterial = new MeshBasicMaterial({ color: '#f3efe5', side: DoubleSide })

  const key = new Mesh(geometry, neutralMaterial)
  key.position.set(-4, 2.5, 3)
  key.scale.set(3, 6, 1)
  key.lookAt(0, 0, 0)

  const rim = new Mesh(geometry, warmMaterial)
  rim.position.set(3, 1, -2)
  rim.scale.set(1.2, 5, 1)
  rim.lookAt(0, 0, 0)

  const overhead = new Mesh(geometry, neutralMaterial)
  overhead.position.set(0, 5, 0)
  overhead.scale.set(3, 3, 1)
  overhead.lookAt(0, 0, 0)
  studio.add(key, rim, overhead)

  const generator = new PMREMGenerator(renderer)
  try {
    return generator.fromScene(studio, 0.04, 0.1, 30)
  } finally {
    generator.dispose()
    geometry.dispose()
    warmMaterial.dispose()
    neutralMaterial.dispose()
    studio.clear()
  }
}

/** The DOM owns the story. This isolated scene supplies its metallic signature. */
export function createHollyScene(canvas: HTMLCanvasElement): HollySceneController {
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const mobileQuery = window.matchMedia('(max-width: 767px)')
  const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !mobileQuery.matches && window.devicePixelRatio < 2,
    powerPreference: 'low-power',
  })
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15

  let environment: WebGLRenderTarget
  try {
    environment = createStudioEnvironment(renderer)
  } catch (error: unknown) {
    renderer.dispose()
    throw error
  }

  const scene = new Scene()
  scene.environment = environment.texture
  const camera = new PerspectiveCamera(SCENE.cameraFov, 1, 0.1, 40)
  const signature = createHollySignatureObject()
  scene.add(signature.group)

  const ambient = new HemisphereLight('#f3efe5', '#211609', 0.65)
  const key = new DirectionalLight('#eedabb', 2.8)
  key.position.set(-3, 5, 4)
  const rim = new DirectionalLight('#e3d290', 1.4)
  rim.position.set(4, -1, 1)
  scene.add(ambient, key, rim)

  const pointer = new Vector2()
  const pointerTarget = new Vector2()
  let progress = 0
  let elapsed = 0
  let previousTime = 0
  let frameId: number | null = null
  let visible = true
  let contextLost = false
  let disposed = false
  let width = 1
  let height = 1

  function isActive(): boolean {
    return !disposed && !contextLost && visible && !document.hidden
  }

  function draw(delta: number): void {
    if (!isActive()) return
    const reducedMotion = reducedMotionQuery.matches
    const motion = reducedMotion ? 0 : progress
    const mobile = mobileQuery.matches
    const damping = 1 - Math.exp(-SCENE.pointerDamping * delta)
    pointer.lerp(pointerTarget, reducedMotion ? 1 : damping)

    signature.update(motion, elapsed, reducedMotion)
    signature.group.position.set(
      mobile ? 0.17 : Math.min(2.15, camera.aspect * 1.16),
      mobile ? -0.08 : -0.05,
      motion * 0.1,
    )
    signature.group.scale.setScalar(mobile ? 0.73 : 1)
    signature.group.rotation.y = reducedMotion ? 0 : pointer.x * 0.035
    signature.group.rotation.x = reducedMotion ? 0 : -pointer.y * 0.02

    const baseZ = mobile ? SCENE.mobileCameraZ : SCENE.desktopCameraZ
    camera.position.set(
      reducedMotion ? 0 : pointer.x * 0.075,
      motion * 0.27 + (reducedMotion ? 0 : pointer.y * 0.055),
      baseZ - motion * (mobile ? 0.5 : 1.6),
    )
    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)
  }

  function frame(time: number): void {
    frameId = null
    if (!isActive()) return
    const delta = previousTime === 0 ? 1 / 60 : Math.min((time - previousTime) / 1000, SCENE.maxDelta)
    previousTime = time
    elapsed += delta
    draw(delta)
    if (!reducedMotionQuery.matches) frameId = window.requestAnimationFrame(frame)
  }

  function stop(): void {
    if (frameId !== null) window.cancelAnimationFrame(frameId)
    frameId = null
    previousTime = 0
  }

  function start(): void {
    if (!isActive() || frameId !== null) return
    previousTime = 0
    frameId = window.requestAnimationFrame(frame)
  }

  function resize(): void {
    if (disposed) return
    const bounds = canvas.getBoundingClientRect()
    width = Math.max(1, bounds.width)
    height = Math.max(1, bounds.height)
    const maximumDpr = mobileQuery.matches ? SCENE.mobileDpr : SCENE.desktopDpr
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maximumDpr))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    draw(1 / 60)
    start()
  }

  function onPointerMove(event: PointerEvent): void {
    if (!visible || !pointerQuery.matches || reducedMotionQuery.matches) return
    const bounds = canvas.getBoundingClientRect()
    pointerTarget.set(
      MathUtils.clamp(((event.clientX - bounds.left) / width) * 2 - 1, -1, 1),
      MathUtils.clamp(-((event.clientY - bounds.top) / height) * 2 + 1, -1, 1),
    )
  }

  function resetPointer(): void {
    pointerTarget.set(0, 0)
  }

  function onVisibilityChange(): void {
    if (document.hidden) stop()
    else start()
  }

  function onMotionChange(): void {
    resetPointer()
    pointer.set(0, 0)
    stop()
    start()
  }

  function onContextLost(event: Event): void {
    event.preventDefault()
    contextLost = true
    stop()
    canvas.style.opacity = '0'
  }

  function onContextRestored(): void {
    contextLost = false
    canvas.style.opacity = ''
    resize()
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry) return
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    },
    { threshold: 0 },
  )
  intersectionObserver.observe(canvas)

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('blur', resetPointer)
  document.addEventListener('visibilitychange', onVisibilityChange)
  reducedMotionQuery.addEventListener('change', onMotionChange)
  mobileQuery.addEventListener('change', resize)
  canvas.addEventListener('webglcontextlost', onContextLost)
  canvas.addEventListener('webglcontextrestored', onContextRestored)

  resize()

  return {
    setProgress(nextProgress: number) {
      if (disposed) return
      progress = MathUtils.clamp(nextProgress, 0, 1)
    },
    dispose() {
      if (disposed) return
      disposed = true
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('blur', resetPointer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      reducedMotionQuery.removeEventListener('change', onMotionChange)
      mobileQuery.removeEventListener('change', resize)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      signature.dispose()
      environment.dispose()
      scene.environment = null
      scene.clear()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.style.opacity = ''
    },
  }
}
