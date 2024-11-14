// Import libraries
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import Donut from './Donut'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
// Create a group object
const group = new THREE.Group()
group.add(camera)

// Add your object to the group
scene.add(group)

// Set the pivot point by adjusting the position of the group
group.position.set(0, 0, 0)
camera.position.set(0, 0, 5)

// Render set
const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
const app = document.getElementById('app')
app!.appendChild(renderer.domElement)

// Donut handling
const loader = new GLTFLoader()
const donut = new Donut(scene, loader)
donut.populate()

// Lights
const light = new THREE.PointLight(0x9fc5e8, 5, 100)
light.position.set(0, 0, 5)
scene.add(light)

// Sync (aka how fast everything moves relative to each other) variable
let sync = 1

setTimeout(() => {
  donut.syncAnimate(sync)
  renderer.render(scene, camera)
}, 500)

window.addEventListener('resize', onWindowResize, false)

// Handle resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('keydown', function (event) {
  if (event.code === 'Space') {
    donut.jump()
  }
})

let prevX = 0
let prevY = 0
let isMouseDown = false

window.addEventListener('mousedown', () => {
  isMouseDown = true
})

window.addEventListener('mouseup', () => {
  isMouseDown = false
})

window.addEventListener('mousemove', (event) => {
  if (!isMouseDown) return

  const currentX = event.clientX
  const currentY = event.clientY

  if (currentX > prevX) {
    donut.syncAnimate(sync, 0.06)
  } else if (currentX < prevX) {
    donut.syncAnimate(sync, -0.06)
  }

  if (currentY > prevY) {
    donut.syncAnimateX(sync, 0.06)
  } else if (currentY < prevY) {
    donut.syncAnimateX(sync, -0.06)
  }

  renderer.render(scene, camera)

  // Update previous coordinates
  prevX = currentX
  prevY = currentY
})

// Add wheel for panning around
window.addEventListener('wheel', (event) => {
  if (event.deltaY < 0 && camera.fov > 10) {
    camera.fov -= 5
  } else if (event.deltaY > 0 && camera.fov < 100) {
    camera.fov += 5
  }

  camera.updateProjectionMatrix()
  renderer.render(scene, camera)
})
