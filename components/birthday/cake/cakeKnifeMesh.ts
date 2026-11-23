'use client';

import * as THREE from 'three';

/**
 * Creates an exquisite, compact 3D metallic dessert knife model
 */
export function createCakeKnife(): THREE.Group {
  const knifeGroup = new THREE.Group();
  knifeGroup.name = 'CakeKnife';

  // 1. Compact Knife Blade (extruded realistic knife profile)
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.lineTo(1.25, 0); // Flat back spine
  bladeShape.quadraticCurveTo(1.48, 0.03, 1.55, 0.14); // Tapered sharp tip
  bladeShape.quadraticCurveTo(1.3, 0.24, 0.85, 0.22); // Cutting edge belly
  bladeShape.lineTo(0, 0.2); // Heel
  bladeShape.closePath();

  const bladeGeom = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.02,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.006,
    bevelThickness: 0.006,
  });
  bladeGeom.center();

  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0xf5f7fa,
    metalness: 0.96,
    roughness: 0.12,
  });

  const bladeMesh = new THREE.Mesh(bladeGeom, bladeMat);
  bladeMesh.castShadow = true;
  bladeMesh.position.set(0.78, 0, 0);
  knifeGroup.add(bladeMesh);

  // 2. Bolster / Collar (Champagne Gold)
  const bolsterGeom = new THREE.CylinderGeometry(0.055, 0.055, 0.1, 16);
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.88,
    roughness: 0.2,
  });
  const bolsterMesh = new THREE.Mesh(bolsterGeom, goldMat);
  bolsterMesh.rotation.z = Math.PI / 2;
  bolsterMesh.position.set(-0.04, 0, 0);
  knifeGroup.add(bolsterMesh);

  // 3. Ergonomic Handle (Deep Burgundy Rosewood / Velvet Finish)
  const handleShape = new THREE.Shape();
  handleShape.moveTo(0, -0.045);
  handleShape.quadraticCurveTo(-0.35, -0.075, -0.75, -0.06);
  handleShape.quadraticCurveTo(-0.85, 0, -0.75, 0.06);
  handleShape.quadraticCurveTo(-0.35, 0.075, 0, 0.045);
  handleShape.closePath();

  const handleGeom = new THREE.ExtrudeGeometry(handleShape, {
    depth: 0.048,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  });
  handleGeom.center();

  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x4a0e17,
    roughness: 0.35,
    metalness: 0.1,
  });

  const handleMesh = new THREE.Mesh(handleGeom, handleMat);
  handleMesh.castShadow = true;
  handleMesh.position.set(-0.46, 0, 0);
  knifeGroup.add(handleMesh);

  // 4. Gold Rivets on Handle
  const rivetGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.06, 12);
  rivetGeom.rotateX(Math.PI / 2);
  [-0.26, -0.46, -0.66].forEach((xPos) => {
    const rivet = new THREE.Mesh(rivetGeom, goldMat);
    rivet.position.set(xPos, 0, 0);
    knifeGroup.add(rivet);
  });

  // Scale down to an elegant dessert knife size
  knifeGroup.scale.set(0.68, 0.68, 0.68);

  return knifeGroup;
}
