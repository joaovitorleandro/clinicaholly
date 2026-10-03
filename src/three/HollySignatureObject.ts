import {
  CatmullRomCurve3,
  Color,
  ExtrudeGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  Shape,
  TubeGeometry,
  Vector3,
} from 'three'
import type { BufferGeometry } from 'three'

const SIGNATURE = {
  champagne: '#d8bd82',
  arcRadius: 0.019,
  arc: { width: 1.55, height: 3, apex: 0.5 },
  starScale: 1.9,
  orbitRadius: 0.006,
  segments: 96,
} as const

export interface HollySignatureObject {
  group: Group
  update: (progress: number, elapsed: number, reducedMotion: boolean) => void
  dispose: () => void
}

/** A shallow, faceted four-point star: the small punctuation in the Holly mark. */
function createStarGeometry(): ExtrudeGeometry {
  const shape = new Shape()
  const longPoint = 0.18
  const shortPoint = 0.12
  const waist = 0.021

  shape.moveTo(0, longPoint)
  shape.quadraticCurveTo(waist, waist, shortPoint, 0)
  shape.quadraticCurveTo(waist, -waist, 0, -longPoint)
  shape.quadraticCurveTo(-waist, -waist, -shortPoint, 0)
  shape.quadraticCurveTo(-waist, waist, 0, longPoint)

  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.012,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.004,
    bevelThickness: 0.008,
    curveSegments: 8,
  })
  geometry.center()
  return geometry
}

/**
 * One side of the Holly mark — `)` or `(` — as a true circular arc, so the curve
 * stays perfectly round. Endpoints sit at (±width, ±height); the apex bows inward to ±apex.
 */
function createArc(side: -1 | 1): TubeGeometry {
  const { width, height, apex } = SIGNATURE.arc
  const centerX = (width * width + height * height - apex * apex) / (2 * (width - apex))
  const radius = centerX - apex
  const sweep = Math.atan2(height, centerX - width)
  const points: Vector3[] = []
  for (let index = 0; index <= SIGNATURE.segments; index += 1) {
    const angle = Math.PI + MathUtils.lerp(-sweep, sweep, index / SIGNATURE.segments)
    points.push(new Vector3(side * (centerX + Math.cos(angle) * radius), Math.sin(angle) * radius, 0))
  }
  const curve = new CatmullRomCurve3(points, false, 'centripetal')
  return new TubeGeometry(curve, SIGNATURE.segments * 2, SIGNATURE.arcRadius, 12, false)
}

function orbitPoint(angle: number): Vector3 {
  return new Vector3(
    Math.cos(angle) * 2.78,
    Math.sin(angle) * 2.92,
    Math.sin(angle) * 0.45,
  )
}

function createOrbit(): TubeGeometry {
  const points: Vector3[] = []
  // Leave the ellipse open; its negative space is as deliberate as the metal.
  for (let index = 0; index <= SIGNATURE.segments; index += 1) {
    const angle = MathUtils.lerp(-Math.PI * 0.82, Math.PI * 0.89, index / SIGNATURE.segments)
    points.push(orbitPoint(angle))
  }
  return new TubeGeometry(
    new CatmullRomCurve3(points, false, 'centripetal'),
    SIGNATURE.segments,
    SIGNATURE.orbitRadius,
    5,
    false,
  )
}

export function createHollySignatureObject(): HollySignatureObject {
  const group = new Group()
  const arcs = new Group()
  const orbit = new Group()
  const geometries: BufferGeometry[] = []

  const arcMaterial = new MeshPhysicalMaterial({
    color: new Color(SIGNATURE.champagne),
    metalness: 0.94,
    roughness: 0.29,
    clearcoat: 0.18,
    clearcoatRoughness: 0.36,
    envMapIntensity: 0.85,
  })
  const orbitMaterial = new MeshPhysicalMaterial({
    color: new Color(SIGNATURE.champagne),
    metalness: 0.88,
    roughness: 0.36,
    transparent: true,
    opacity: 0.57,
    depthWrite: false,
    envMapIntensity: 0.72,
  })
  const frontGeometry = createArc(1)
  const backGeometry = createArc(-1)
  const orbitGeometry = createOrbit()
  const starGeometry = createStarGeometry()
  geometries.push(frontGeometry, backGeometry, orbitGeometry, starGeometry)

  const frontArc = new Mesh(frontGeometry, arcMaterial)
  const backArc = new Mesh(backGeometry, arcMaterial)
  arcs.add(frontArc, backArc)

  const orbitMesh = new Mesh(orbitGeometry, orbitMaterial)
  const star = new Mesh(starGeometry, arcMaterial)
  star.scale.setScalar(SIGNATURE.starScale)
  // As in the logo, the star sits between the two arcs: )★(
  arcs.add(star)
  orbit.add(orbitMesh)
  orbit.rotation.set(0.25, -0.47, -0.23)
  group.add(arcs, orbit)

  let disposed = false

  function update(progress: number, elapsed: number, reducedMotion: boolean): void {
    if (disposed) return
    const motion = reducedMotion ? 0 : MathUtils.clamp(progress, 0, 1)
    const breath = reducedMotion ? 0 : Math.sin(elapsed * 0.19) * 0.012

    arcs.rotation.y = motion * 0.3
    arcs.rotation.z = breath
    frontArc.rotation.y = motion * 0.16
    backArc.rotation.y = -motion * 0.16
    orbit.rotation.x = 0.25 + motion * 0.2
    orbit.rotation.y = -0.47 + motion * 0.25
    orbit.rotation.z = -0.23 + motion * 0.14

    star.position.set(0, 0, 0.05)
    star.rotation.set(0, motion * 0.8, -motion * 0.45)
    orbitMaterial.opacity = MathUtils.lerp(0.57, 0.32, motion)
  }

  update(0, 0, true)

  return {
    group,
    update,
    dispose() {
      if (disposed) return
      disposed = true
      geometries.forEach((geometry) => geometry.dispose())
      ;[arcMaterial, orbitMaterial].forEach((material) => material.dispose())
      group.clear()
    },
  }
}
