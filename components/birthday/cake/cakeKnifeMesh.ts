'use client';

import * as THREE from 'three';

/**
 * Creates a high-fidelity 3D Cake Knife using the user's uploaded knife image
 * from public/images/knife, complete with double-sided photorealistic texturing,
 * metallic spine depth, and visibility control.
 */
export function createCakeKnife(): THREE.Group {
  const knifeGroup = new THREE.Group();
  knifeGroup.name = 'CakeKnife';

  // Load the user's authentic knife image
  const textureLoader = new THREE.TextureLoader();
  const knifeTexture = textureLoader.load('/images/knife-trimmed.png');
  knifeTexture.colorSpace = THREE.SRGBColorSpace;

  // Aspect ratio: 638 x 80 (~7.975 : 1) - scaled proportionally with the smaller cupcake
  const knifeLength = 1.05;
  const knifeHeight = knifeLength * (80 / 638); // ~0.131
  const halfHeight = knifeHeight / 2;

  // Double-sided photorealistic material preserving the user's exact knife colors
  const knifeMat = new THREE.MeshStandardMaterial({
    map: knifeTexture,
    transparent: true,
    alphaTest: 0.015,
    roughness: 0.24,
    metalness: 0.25,
    side: THREE.DoubleSide,
    shadowSide: THREE.DoubleSide,
  });

  // Front face (blade tip on left, handle on right)
  const frontGeom = new THREE.PlaneGeometry(knifeLength, knifeHeight, 16, 4);
  const frontMesh = new THREE.Mesh(frontGeom, knifeMat);
  frontMesh.position.z = 0.007;
  frontMesh.castShadow = true;
  knifeGroup.add(frontMesh);

  // Back face with mirrored UVs so the knife looks identical from reverse perspective
  const backGeom = new THREE.PlaneGeometry(knifeLength, knifeHeight, 16, 4);
  const uvs = backGeom.attributes.uv;
  for (let i = 0; i < uvs.count; i++) {
    uvs.setX(i, 1.0 - uvs.getX(i));
  }
  uvs.needsUpdate = true;

  const backMesh = new THREE.Mesh(backGeom, knifeMat);
  backMesh.position.z = -0.007;
  backMesh.rotation.y = Math.PI;
  backMesh.castShadow = true;
  knifeGroup.add(backMesh);

  // Realistic metallic spine along top edge giving physical 3D thickness
  const spineGeom = new THREE.BoxGeometry(knifeLength * 0.96, 0.012, 0.014);
  const spineMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.92,
    roughness: 0.15,
  });
  const spineMesh = new THREE.Mesh(spineGeom, spineMat);
  spineMesh.position.set(0, halfHeight * 0.85, 0);
  knifeGroup.add(spineMesh);

  // Initially hidden - only displayed when reaching "Pick Up the Cake Knife" screen
  knifeGroup.visible = false;

  return knifeGroup;
}
