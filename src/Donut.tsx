import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

class Donut {
  scene: THREE.Scene // Scene to render to
  loader: GLTFLoader // Loader to use to load

  gravity: number = 0

  donut: THREE.Object3D | null = null // Object3D

  constructor(scene: THREE.Scene, loader: GLTFLoader) {
    this.scene = scene
    this.loader = loader
  }

  populate() {
    this.loader.load(
      '/tinyfile_donut.glb',
      (gltf) => {
        this.donut = gltf.scene
        this.scene.add(this.donut) // Use "this" to refer to class instance
        this.donut.rotation.z += 14
      },
      undefined,
      (error) => {
        console.error(error)
      }
    )
  }

  syncAnimate(sync: number, y: number = 0.01) {
    if (this.donut != null) {
      this.donut.rotation.y += sync * y
    }

    if (this.gravity && this.donut!.position.y > 0) {
      this.donut!.position.y -= y
    }
  }

  syncAnimateX(sync: number, x: number = 0.01) {
    if (this.donut != null) {
      this.donut.rotation.x += sync * x
    }

    if (this.gravity && this.donut!.position.x > 0) {
      this.donut!.position.x -= x
    }
  }

  jumpKey: number = 0
  async jump() {
    if (!this.jumpKey && this.donut!.position.y <= 0) {
      this.jumpKey = 1

      for (let i = 0; i < 200; i++) {
        this.donut!.position.y += 0.01
        this.gravity = 0
        await new Promise((resolve) => setTimeout(resolve, 5))
      }

      this.jumpKey = 0
      this.gravity = 1
    }
  }

  async syncJump(sync: number) {
    if (!this.jumpKey && this.donut!.position.y <= 0) {
      this.jumpKey = 1
      for (let i = 0; i < 200; i++) {
        this.donut!.position.y += 0.01 * sync
        this.gravity = 0
        await new Promise((resolve) => setTimeout(resolve, 5 * sync))
      }

      this.jumpKey = 0
      this.gravity = 1
    }
  }
}

export default Donut
