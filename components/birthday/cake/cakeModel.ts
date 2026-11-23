'use client';

import * as THREE from 'three';
import { createVanillaCakeInteriorTexture } from './cakeTextures';

export interface CakeModelRefs {
  rootGroup: THREE.Group;
  sliceGroup: THREE.Group;
  sparklerGroup: THREE.Group;
  flameMeshes: THREE.Mesh[];
  flameLights: THREE.PointLight[];
  sparklerLit: boolean;
  sliceSeparated: boolean;
  sliceDistance: number;
  update: (delta: number, time: number) => void;
  setCandlesLit: (lit: boolean) => void;
  setSparklerVisible: (visible: boolean) => void;
  setSliceProgress: (progress: number) => void;
  dispose: () => void;
}

/**
 * Creates the high-fidelity Birthday Cupcake Model using the user's uploaded cupcake image
 * featuring 3D curved geometry, dynamic slice separation, sparking candle/sparkler, and pink saucer.
 */
export function createCakeModel(): CakeModelRefs {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'UserReferenceCupcake';
  // Scale down cupcake so sparkler and fireworks have generous top headroom
  rootGroup.scale.set(0.72, 0.72, 0.72);

  const interiorTexture = createVanillaCakeInteriorTexture();

  // Load the user's isolated cupcake textures (main body and interactive cut slice)
  const textureLoader = new THREE.TextureLoader();
  const mainTexture = textureLoader.load('/images/cupcake-main.png');
  const sliceTexture = textureLoader.load('/images/cupcake-slice.png');

  mainTexture.colorSpace = THREE.SRGBColorSpace;
  sliceTexture.colorSpace = THREE.SRGBColorSpace;

  // Cupcake Mesh Materials (preserving exact photo colors with soft ambient response)
  const cupcakeMaterialConfig = {
    transparent: true,
    alphaTest: 0.015,
    roughness: 0.32,
    metalness: 0.02,
    side: THREE.DoubleSide,
    shadowSide: THREE.DoubleSide,
  };

  const mainMat = new THREE.MeshStandardMaterial({
    map: mainTexture,
    ...cupcakeMaterialConfig,
  });

  const sliceMat = new THREE.MeshStandardMaterial({
    map: sliceTexture,
    ...cupcakeMaterialConfig,
  });

  const interiorMat = new THREE.MeshStandardMaterial({
    map: interiorTexture,
    roughness: 0.55,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });

  // --- 1. Pastel Pink Dessert Saucer (matching photo background plate) ---
  const plateMat = new THREE.MeshStandardMaterial({
    color: 0xeb779a, // Ceramic pink saucer
    roughness: 0.22,
    metalness: 0.05,
  });

  const plateGeom = new THREE.CylinderGeometry(1.05, 0.88, 0.07, 48);
  const plateMesh = new THREE.Mesh(plateGeom, plateMat);
  plateMesh.position.set(0, -0.14, -0.06);
  plateMesh.receiveShadow = true;
  rootGroup.add(plateMesh);

  // Soft rim accent on saucer
  const rimGeom = new THREE.TorusGeometry(1.02, 0.032, 12, 48);
  rimGeom.rotateX(Math.PI / 2);
  const rimMesh = new THREE.Mesh(rimGeom, plateMat);
  rimMesh.position.set(0, -0.105, -0.06);
  rootGroup.add(rimMesh);

  // --- 2. Curved 3D Cupcake Plane Geometries ---
  // Aspect ratio 1024x1536 -> width: 1.6, height: 2.4
  const cupcakeWidth = 1.6;
  const cupcakeHeight = 2.4;
  const halfWidth = cupcakeWidth / 2;

  function createCurvedPlaneGeometry(): THREE.PlaneGeometry {
    const geom = new THREE.PlaneGeometry(cupcakeWidth, cupcakeHeight, 36, 48);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // Gentle cylindrical arc so the cupcake has real 3D depth and specular curvature
      const zOffset = (1.0 - Math.pow(x / halfWidth, 2)) * 0.16;
      pos.setZ(i, zOffset);
    }
    geom.computeVertexNormals();
    return geom;
  }

  // Main cupcake body mesh
  const mainGeom = createCurvedPlaneGeometry();
  const mainMesh = new THREE.Mesh(mainGeom, mainMat);
  mainMesh.position.set(0, 0.94, 0);
  mainMesh.castShadow = true;
  mainMesh.receiveShadow = true;
  rootGroup.add(mainMesh);

  // Cut Slice group and mesh
  const sliceGroup = new THREE.Group();
  sliceGroup.name = 'CupcakeInteractiveSlice';

  const sliceGeom = createCurvedPlaneGeometry();
  const sliceMesh = new THREE.Mesh(sliceGeom, sliceMat);
  sliceMesh.position.set(0, 0.94, 0);
  sliceMesh.castShadow = true;
  sliceMesh.receiveShadow = true;
  sliceGroup.add(sliceMesh);

  // Interior Cut Seam Geometry (revealed when slice slides outward)
  const cutPlaneGeom = new THREE.BufferGeometry();
  const cutVertices = new Float32Array([
    // Apex top to bottom along cut line
    0.02, 1.84, 0.16,
    0.02, 1.84, -0.04,
    0.32, -0.07, -0.04,

    0.02, 1.84, 0.16,
    0.32, -0.07, -0.04,
    0.32, -0.07, 0.14,
  ]);
  const cutUvs = new Float32Array([
    0.5, 1.0,
    0.5, 0.0,
    0.0, 0.0,

    0.5, 1.0,
    0.0, 0.0,
    0.0, 1.0,
  ]);
  cutPlaneGeom.setAttribute('position', new THREE.BufferAttribute(cutVertices, 3));
  cutPlaneGeom.setAttribute('uv', new THREE.BufferAttribute(cutUvs, 2));
  cutPlaneGeom.computeVertexNormals();

  const cutInteriorMesh = new THREE.Mesh(cutPlaneGeom, interiorMat);
  sliceGroup.add(cutInteriorMesh);

  rootGroup.add(sliceGroup);

  // --- 3. Sparkling Birthday Candle / Sparkler at Swirl Peak ---
  const sparklerGroup = new THREE.Group();
  sparklerGroup.name = 'BirthdaySparkler';

  const sparklerTopY = 1.94; // Apex of the user's cupcake swirl
  const wireLength = 0.62;

  // Thin metallic wire
  const wireGeom = new THREE.CylinderGeometry(0.01, 0.01, wireLength, 10);
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0xe5e7eb,
    metalness: 0.92,
    roughness: 0.15,
  });
  const wireMesh = new THREE.Mesh(wireGeom, wireMat);
  wireMesh.position.set(0.02, sparklerTopY + wireLength / 2 - 0.1, 0.05);
  sparklerGroup.add(wireMesh);

  // Pyrotechnic sparkler coating
  const coatingGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.32, 10);
  const coatingMat = new THREE.MeshStandardMaterial({
    color: 0x3d3d3d,
    roughness: 0.95,
  });
  const coatingMesh = new THREE.Mesh(coatingGeom, coatingMat);
  coatingMesh.position.set(0.02, sparklerTopY + 0.36, 0.05);
  sparklerGroup.add(coatingMesh);

  // Burning tip spark origin
  const sparkOriginY = sparklerTopY + 0.52;

  // Dynamic firework point light (illuminates the user's cupcake with warm flicker)
  const sparkLight = new THREE.PointLight(0xffdf6d, 0, 7.0);
  sparkLight.position.set(0.02, sparkOriginY, 0.08);
  sparklerGroup.add(sparkLight);

  // --- 4. Realistic Fireworks Sparkler Particle System ---
  const sparkCount = 240;
  const sparkGeom = new THREE.BufferGeometry();
  const sparkPositions = new Float32Array(sparkCount * 3);
  const sparkColors = new Float32Array(sparkCount * 3);

  interface SparkParticle {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    life: number;
    maxLife: number;
    color: THREE.Color;
  }

  const sparks: SparkParticle[] = [];
  const sparkPalette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xffe082),
    new THREE.Color(0xffb74d),
    new THREE.Color(0xff7043),
  ];

  function resetSpark(s: SparkParticle) {
    s.x = 0.02 + (Math.random() - 0.5) * 0.025;
    s.y = sparkOriginY + (Math.random() - 0.5) * 0.025;
    s.z = 0.08 + (Math.random() - 0.5) * 0.025;

    const angleH = Math.random() * Math.PI * 2;
    const angleV = (Math.random() - 0.5) * Math.PI * 0.85;
    const speed = Math.random() * 0.055 + 0.022;

    s.vx = Math.cos(angleH) * Math.cos(angleV) * speed;
    s.vy = Math.sin(angleV) * speed + 0.014;
    s.vz = Math.sin(angleH) * Math.cos(angleV) * speed;

    s.life = 0;
    s.maxLife = Math.random() * 0.22 + 0.1;
    s.color = sparkPalette[Math.floor(Math.random() * sparkPalette.length)];
  }

  for (let i = 0; i < sparkCount; i++) {
    const s: SparkParticle = {
      x: 0,
      y: -100,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      life: 0,
      maxLife: 1,
      color: new THREE.Color(1, 1, 1),
    };
    resetSpark(s);
    sparks.push(s);

    sparkPositions[i * 3] = s.x;
    sparkPositions[i * 3 + 1] = s.y;
    sparkPositions[i * 3 + 2] = s.z;

    sparkColors[i * 3] = s.color.r;
    sparkColors[i * 3 + 1] = s.color.g;
    sparkColors[i * 3 + 2] = s.color.b;
  }

  sparkGeom.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
  sparkGeom.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));

  const sparkMat = new THREE.PointsMaterial({
    size: 0.068,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const sparkPoints = new THREE.Points(sparkGeom, sparkMat);
  sparkPoints.visible = false;
  sparklerGroup.add(sparkPoints);

  rootGroup.add(sparklerGroup);

  let isSparklerLit = false;
  let currentSliceProgress = 0;

  const refs: CakeModelRefs = {
    rootGroup,
    sliceGroup,
    sparklerGroup,
    flameMeshes: [],
    flameLights: [sparkLight],
    sparklerLit: false,
    sliceSeparated: false,
    sliceDistance: 0,

    setCandlesLit: (lit: boolean) => {
      isSparklerLit = lit;
      refs.sparklerLit = lit;
      sparkPoints.visible = lit;
    },

    setSparklerVisible: (visible: boolean) => {
      sparklerGroup.visible = visible;
      if (!visible) {
        sparkPoints.visible = false;
        sparkLight.intensity = 0;
        isSparklerLit = false;
        refs.sparklerLit = false;
      }
    },

    setSliceProgress: (progress: number) => {
      currentSliceProgress = Math.max(0, Math.min(1, progress));
      refs.sliceSeparated = currentSliceProgress > 0.05;

      const maxDistance = 0.65;
      const dist = currentSliceProgress * maxDistance;
      refs.sliceDistance = dist;

      // Slice smoothly slides outward and forward in 3D perspective
      sliceGroup.position.set(dist * 0.88, -dist * 0.06, dist * 0.40);
      sliceGroup.rotation.y = currentSliceProgress * 0.18;
      sliceGroup.rotation.z = -currentSliceProgress * 0.04;
    },

    update: (delta: number, _time: number) => {
      if (isSparklerLit) {
        const lightFlicker = Math.random() * 2.2;
        sparkLight.intensity = THREE.MathUtils.lerp(sparkLight.intensity, 4.4 + lightFlicker, delta * 20);

        const posAttr = sparkGeom.attributes.position as THREE.BufferAttribute;
        const colAttr = sparkGeom.attributes.color as THREE.BufferAttribute;

        for (let i = 0; i < sparkCount; i++) {
          const s = sparks[i];
          s.life += delta;

          if (s.life >= s.maxLife) {
            resetSpark(s);
          } else {
            s.vy -= delta * 0.28;
            s.x += s.vx;
            s.y += s.vy;
            s.z += s.vz;
          }

          posAttr.setXYZ(i, s.x, s.y, s.z);

          const lifeProgress = s.life / s.maxLife;
          const r = THREE.MathUtils.lerp(s.color.r, 1.0, lifeProgress);
          const g = THREE.MathUtils.lerp(s.color.g, 0.35, lifeProgress);
          const b = THREE.MathUtils.lerp(s.color.b, 0.0, lifeProgress);
          colAttr.setXYZ(i, r, g, b);
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
      } else {
        sparkLight.intensity = THREE.MathUtils.lerp(sparkLight.intensity, 0, delta * 8);
        sparkPoints.visible = false;
      }
    },

    dispose: () => {
      mainTexture.dispose();
      sliceTexture.dispose();
      interiorTexture.dispose();
      mainGeom.dispose();
      sliceGeom.dispose();
      cutPlaneGeom.dispose();
      plateGeom.dispose();
      rimGeom.dispose();
      sparkGeom.dispose();
      sparkMat.dispose();
      mainMat.dispose();
      sliceMat.dispose();
      plateMat.dispose();
      interiorMat.dispose();
    },
  };

  return refs;
}
