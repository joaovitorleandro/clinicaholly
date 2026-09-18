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
  bronze: '#9e6a29',
  ivory: '#f3efe5',
  arcRadius: 0.019,
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

function createArc(side: -1 | 1, depth: number): TubeGeometry {
  const points = [
    new Vector3(side * 0.22, 3.05, depth - 0.4),
    new Vector3(side * 1.07, 2.2, depth - 0.06),
    new Vector3(side * 1.48, 1.15, depth + 0.15),
    new Vector3(side * 1.62, 0, depth + 0.24),
    new Vector3(side * 1.45, -1.25, depth + 0.12),
    new Vector3(side * 0.98, -2.25, depth - 0.08),
    new Vector3(side * 0.12, -3.0, depth - 0.45),
  ]
  const curve = new CatmullRomCurve3(points, false, 'centripetal')
  return new TubeGeometry(curve, SIGNATURE.segments, SIGNATURE.arcRadius, 8, false)
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
  const bronzeMaterial = new MeshPhysicalMaterial({
    color: new Color(SIGNATURE.bronze),
    metalness: 0.92,
    roughness: 0.38,
    envMapIntensity: 0.8,
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
  const starMaterial = new MeshPhysicalMaterial({
    color: new Color(SIGNATURE.ivory),
    metalness: 0.96,
    roughness: 0.21,
    envMapIntensity: 1.15,
  })

  const frontGeometry = createArc(1, 0.15)
  const backGeometry = createArc(-1, -0.3)
  const orbitGeometry = createOrbit()
  const starGeometry = createStarGeometry()
  geometries.push(frontGeometry, backGeometry, orbitGeometry, starGeometry)

  const frontArc = new Mesh(frontGeometry, arcMaterial)
  const backArc = new Mesh(backGeometry, bronzeMaterial)
  backArc.rotation.z = -0.08
  backArc.scale.setScalar(0.96)
  arcs.add(frontArc, backArc)

  const orbitMesh = new Mesh(orbitGeometry, orbitMaterial)
  const star = new Mesh(starGeometry, starMaterial)
  orbit.add(orbitMesh, star)
  orbit.rotation.set(0.25, -0.47, -0.23)
  group.add(arcs, orbit)

  let disposed = false

  function update(progress: number, elapsed: number, reducedMotion: boolean): void {
    if (disposed) return
    const motion = reducedMotion ? 0 : MathUtils.clamp(progress, 0, 1)
    const breath = reducedMotion ? 0 : Math.sin(elapsed * 0.19) * 0.012

    arcs.rotation.y = -0.18 + motion * 0.37
    arcs.rotation.z = -0.13 - motion * 0.13 + breath
    frontArc.rotation.y = motion * 0.14
    backArc.rotation.y = -motion * 0.19
    orbit.rotation.x = 0.25 + motion * 0.2
    orbit.rotation.y = -0.47 + motion * 0.25
    orbit.rotation.z = -0.23 + motion * 0.14

    const starAngle = MathUtils.lerp(Math.PI * 0.2, -Math.PI * 0.35, motion)
    star.position.copy(orbitPoint(starAngle))
    star.position.z += 0.03
    star.rotation.set(0.1, 0.15 + motion * 0.8, -motion * 0.45)
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
      ;[arcMaterial, bronzeMaterial, orbitMaterial, starMaterial].forEach((material) => material.dispose())
      group.clear()
    },
  }
}
