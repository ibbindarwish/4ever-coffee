<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import CupDesignSvg from './CupDesignSvg.vue'

const props = defineProps<{
  bodyLight:      string
  bodyDark:       string
  sleeveColor:    string
  borderColor:    string
  logoColor:      string
  logoStyle:      'circle4' | 'none'
  mainText:       string
  mainFontSize?:  number
  mainSpacing?:   number
  subText:        string
  subFontSize?:   number
  subSpacing?:    number
  font:           string
}>()

// ── viewBox geometry constants (mirrors CupDesignSvg's 160×260 viewBox) ──
const VB_W = 160, VB_H = 260
const RIM_Y = 80, BASE_Y = 249
const RIM_R = 58, BASE_R = 44
const SLEEVE_X0 = 22, SLEEVE_X1 = 138
const SLEEVE_Y0 = 116, SLEEVE_Y1 = 204

const host       = ref<HTMLDivElement>()
const hiddenSvg   = ref<InstanceType<typeof CupDesignSvg>>()
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let controls: OrbitControls | null = null
let animId = 0
let resizeObserver: ResizeObserver | null = null

let sleeveMat: THREE.MeshStandardMaterial | null = null
let labelMat:  THREE.MeshStandardMaterial | null = null
let bodyMatTop: THREE.MeshStandardMaterial | null = null
let bodyMatBottom: THREE.MeshStandardMaterial | null = null
let borderMatTop: THREE.MeshStandardMaterial | null = null
let borderMatBottom: THREE.MeshStandardMaterial | null = null

function frac(y: number) { return (y - RIM_Y) / (BASE_Y - RIM_Y) }

const HEIGHT = 2.6
const R_TOP  = 1.0
const R_BOT  = R_TOP * (BASE_R / RIM_R)
function yAt(f: number) { return HEIGHT / 2 - f * HEIGHT }
function rAt(f: number) { return R_TOP + (R_BOT - R_TOP) * f }

async function svgToCanvas(svgEl: SVGSVGElement, destW: number, destH: number): Promise<HTMLCanvasElement> {
  const svgStr = new XMLSerializer().serializeToString(svgEl)
  const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr)
  const img = new Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
    img.src = dataUrl
  })
  const canvas = document.createElement('canvas')
  canvas.width = destW
  canvas.height = destH
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, destW, destH)
  return canvas
}

function cropCanvas(src: HTMLCanvasElement, sx: number, sy: number, sw: number, sh: number): HTMLCanvasElement {
  const out = document.createElement('canvas')
  out.width = sw
  out.height = sh
  out.getContext('2d')!.drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh)
  return out
}

async function buildLabelTexture(): Promise<THREE.CanvasTexture | null> {
  const svgEl = (hiddenSvg.value as any)?.$el as SVGSVGElement | undefined
  if (!svgEl) return null
  const scaleFactor = 6
  const full = await svgToCanvas(svgEl, VB_W * scaleFactor, VB_H * scaleFactor)
  const crop = cropCanvas(
    full,
    SLEEVE_X0 * scaleFactor, SLEEVE_Y0 * scaleFactor,
    (SLEEVE_X1 - SLEEVE_X0) * scaleFactor, (SLEEVE_Y1 - SLEEVE_Y0) * scaleFactor,
  )
  const tex = new THREE.CanvasTexture(crop)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

function buildScene() {
  if (!host.value) return
  const width  = host.value.clientWidth
  const height = host.value.clientHeight

  scene  = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100)
  camera.position.set(0, 0.15, 6.4)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  host.value.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = false
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 4
  controls.maxDistance = 9
  controls.minPolarAngle = Math.PI / 2 - 0.5
  controls.maxPolarAngle = Math.PI / 2 + 0.5
  controls.autoRotate = true
  controls.autoRotateSpeed = 2.2

  scene.add(new THREE.AmbientLight(0xffffff, 0.65))
  const key = new THREE.DirectionalLight(0xfff2df, 1.1)
  key.position.set(3, 4, 5)
  scene.add(key)
  const fill = new THREE.DirectionalLight(0xffe8cc, 0.4)
  fill.position.set(-4, 1, -3)
  scene.add(fill)

  const group = new THREE.Group()
  scene.add(group)

  // ── Body — upper (rim → sleeve top) & lower (sleeve bottom → base) ──
  const fSleeveTop = frac(SLEEVE_Y0), fSleeveBot = frac(SLEEVE_Y1)

  bodyMatTop    = new THREE.MeshStandardMaterial({ color: props.bodyLight, roughness: 0.55, metalness: 0.02 })
  bodyMatBottom = new THREE.MeshStandardMaterial({ color: props.bodyLight, roughness: 0.55, metalness: 0.02 })

  const upperGeo = new THREE.CylinderGeometry(rAt(0), rAt(fSleeveTop), HEIGHT * (fSleeveTop - 0), 48, 1, true)
  const upperMesh = new THREE.Mesh(upperGeo, bodyMatTop)
  upperMesh.position.y = (yAt(0) + yAt(fSleeveTop)) / 2
  group.add(upperMesh)

  const lowerGeo = new THREE.CylinderGeometry(rAt(fSleeveBot), rAt(1), HEIGHT * (1 - fSleeveBot), 48, 1, true)
  const lowerMesh = new THREE.Mesh(lowerGeo, bodyMatBottom)
  lowerMesh.position.y = (yAt(fSleeveBot) + yAt(1)) / 2
  group.add(lowerMesh)

  // ── Sleeve band (base color, full wrap) ──
  sleeveMat = new THREE.MeshStandardMaterial({ color: props.sleeveColor, roughness: 0.6 })
  const sleeveGeo = new THREE.CylinderGeometry(
    rAt(fSleeveTop) * 1.006, rAt(fSleeveBot) * 1.006, HEIGHT * (fSleeveBot - fSleeveTop), 48, 1, true,
  )
  const sleeveMesh = new THREE.Mesh(sleeveGeo, sleeveMat)
  sleeveMesh.position.y = (yAt(fSleeveTop) + yAt(fSleeveBot)) / 2
  group.add(sleeveMesh)

  // ── Label patch — front-facing arc with logo + text texture ──
  labelMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, transparent: true })
  const thetaLength = 2.3
  const labelGeo = new THREE.CylinderGeometry(
    rAt(fSleeveTop) * 1.012, rAt(fSleeveBot) * 1.012, HEIGHT * (fSleeveBot - fSleeveTop), 48, 1, true,
    -thetaLength / 2, thetaLength,
  )
  const labelMesh = new THREE.Mesh(labelGeo, labelMat)
  labelMesh.position.y = sleeveMesh.position.y
  group.add(labelMesh)

  // ── Sleeve borders ──
  borderMatTop    = new THREE.MeshStandardMaterial({ color: props.borderColor, roughness: 0.5 })
  borderMatBottom = new THREE.MeshStandardMaterial({ color: props.borderColor, roughness: 0.5 })
  const borderTopGeo = new THREE.TorusGeometry(rAt(fSleeveTop) * 1.01, 0.012, 8, 48)
  const borderTop = new THREE.Mesh(borderTopGeo, borderMatTop)
  borderTop.rotation.x = Math.PI / 2
  borderTop.position.y = yAt(fSleeveTop)
  group.add(borderTop)
  const borderBotGeo = new THREE.TorusGeometry(rAt(fSleeveBot) * 1.01, 0.012, 8, 48)
  const borderBot = new THREE.Mesh(borderBotGeo, borderMatBottom)
  borderBot.rotation.x = Math.PI / 2
  borderBot.position.y = yAt(fSleeveBot)
  group.add(borderBot)

  // ── Rim + coffee interior ──
  const rimGeo = new THREE.TorusGeometry(rAt(0), 0.02, 8, 48)
  const rimMesh = new THREE.Mesh(rimGeo, new THREE.MeshStandardMaterial({ color: props.bodyDark, roughness: 0.4 }))
  rimMesh.rotation.x = Math.PI / 2
  rimMesh.position.y = yAt(0)
  group.add(rimMesh)

  const coffeeGeo = new THREE.CircleGeometry(rAt(0) * 0.86, 48)
  const coffeeMesh = new THREE.Mesh(coffeeGeo, new THREE.MeshStandardMaterial({ color: 0x0e0806, roughness: 0.2 }))
  coffeeMesh.rotation.x = -Math.PI / 2
  coffeeMesh.position.y = yAt(0) - 0.01
  group.add(coffeeMesh)

  // ── Base cap ──
  const baseGeo = new THREE.CircleGeometry(rAt(1), 48)
  const baseMesh = new THREE.Mesh(baseGeo, new THREE.MeshStandardMaterial({ color: props.bodyDark, roughness: 0.5 }))
  baseMesh.rotation.x = Math.PI / 2
  baseMesh.position.y = yAt(1)
  group.add(baseMesh)

  buildLabelTexture().then(tex => {
    if (tex && labelMat) { labelMat.map = tex; labelMat.needsUpdate = true }
  })

  const tick = () => {
    controls?.update()
    if (renderer && scene && camera) renderer.render(scene, camera)
    animId = requestAnimationFrame(tick)
  }
  tick()

  resizeObserver = new ResizeObserver(() => {
    if (!host.value || !renderer || !camera) return
    const w = host.value.clientWidth, h = host.value.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  })
  resizeObserver.observe(host.value)
}

function updateMaterialColors() {
  bodyMatTop?.color.set(props.bodyLight)
  bodyMatBottom?.color.set(props.bodyLight)
  sleeveMat?.color.set(props.sleeveColor)
  borderMatTop?.color.set(props.borderColor)
  borderMatBottom?.color.set(props.borderColor)
}

function refreshLabel() {
  buildLabelTexture().then(tex => {
    if (tex && labelMat) {
      labelMat.map?.dispose()
      labelMat.map = tex
      labelMat.needsUpdate = true
    }
  })
}

onMounted(async () => {
  await nextTick()
  buildScene()
})

watch(() => [props.bodyLight, props.bodyDark, props.sleeveColor, props.borderColor], updateMaterialColors)
watch(() => [
  props.logoColor, props.logoStyle, props.mainText, props.subText,
  props.mainFontSize, props.mainSpacing, props.subFontSize, props.subSpacing, props.font,
  props.sleeveColor, props.borderColor,
], async () => {
  await nextTick()
  refreshLabel()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animId)
  resizeObserver?.disconnect()
  controls?.dispose()
  renderer?.dispose()
  scene?.traverse(obj => {
    const mesh = obj as THREE.Mesh
    if (mesh.geometry) mesh.geometry.dispose()
    const mat = mesh.material as THREE.MeshStandardMaterial | undefined
    if (mat) { mat.map?.dispose(); mat.dispose() }
  })
  renderer?.domElement.remove()
})
</script>

<template>
  <div class="cup-3d-host" ref="host">
    <!-- Off-screen source SVG used purely to texture the label patch -->
    <div style="position:fixed; left:-99999px; top:0;">
      <CupDesignSvg
        ref="hiddenSvg"
        size="lg" :scale="3"
        :body-light="bodyLight" :body-dark="bodyDark"
        :sleeve-color="sleeveColor" :border-color="borderColor"
        :logo-color="logoColor" :logo-style="logoStyle"
        :main-text="mainText" :main-font-size="mainFontSize" :main-spacing="mainSpacing"
        :sub-text="subText" :sub-font-size="subFontSize" :sub-spacing="subSpacing"
        :show-steam="false" steam-color="transparent"
        :font="font"
      />
    </div>
  </div>
</template>

<style scoped>
.cup-3d-host { width: 100%; height: 100%; min-height: 360px; touch-action: none; }
.cup-3d-host :deep(canvas) { display: block; border-radius: 12px; }
</style>