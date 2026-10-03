'use client'

// EAGER IMPORT — simulates loading a heavy 3D library on every route
// This is the exact same anti-pattern described in the AD3 case study,
// where Molstar and RDKit were loaded on pages that never rendered 3D content.
//
// NOTE on tree-shaking: referencing only THREE.REVISION lets bundlers drop the
// entire three.js tree. To make this anti-pattern reproducible, we construct
// real three.js core objects (Scene, PerspectiveCamera, WebGLRenderer) and
// read their instance properties, so the bundler must keep the code paths.

import { useEffect } from 'react'
import * as THREE from 'three'

export default function EagerThreeInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    // WebGLRenderer pulls in the full renderer subtree, like a real
    // app that initializes 3D on every route would.
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    scene.add(camera)
    renderer.dispose()
    // Read instance properties so the objects can't be eliminated as unused.
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[PERF:BEFORE] three.js r${THREE.REVISION} loaded on this route (scene=${scene.uuid}, camera=${camera.uuid})`
      )
    }
  })
  // Renders nothing — purely a bundle-weight side effect
  return null
}
