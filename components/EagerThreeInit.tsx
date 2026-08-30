'use client'

// EAGER IMPORT — simulates loading a heavy 3D library on every route
// This is the exact same anti-pattern described in the AD3 case study,
// where Molstar and RDKit were loaded on pages that never rendered 3D content.
import * as THREE from 'three'

export default function EagerThreeInit() {
  // Force three.js into the bundle so it can't be tree-shaken
  // by creating a simple renderer once on mount
  if (typeof window !== 'undefined') {
    const version = THREE.REVISION
    // Side-effect: three.js is now in every page's main bundle,
    // just like Molstar was in the AD3 platform before optimization.
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PERF:BEFORE] three.js r${version} loaded on this route`)
    }
  }
  // Renders nothing — purely a bundle-weight side effect
  return null
}