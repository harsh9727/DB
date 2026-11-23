'use client';

import * as THREE from 'three';
import { createChocolateCakeInteriorTexture, createChocolateGanacheBumpMap } from './cakeTextures';

export interface CakeModelRefs {
  rootGroup: THREE.Group;
  sliceGroup: THREE.Group;
  flameMeshes: THREE.Mesh[];
  flameLights: THREE.PointLight[];
  sparklerLit: boolean;
  sliceSeparated: boolean;
  sliceDistance: number;
  update: (delta: number, time: number) => void;
  setCandlesLit: (lit: boolean) => void;
  setSliceProgress: (progress: number) => void;
  dispose: () => void;
}

export function createCakeModel(): CakeModelRefs {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'ChocolateCupcakeWithSparkler';

  const interiorTexture = createChocolateCakeInteriorTexture();
  const ganacheBump = createChocolateGanacheBumpMap();

  // Color Palette
  const darkChocolateColor = 0x2b130a; // Rich Belgian dark chocolate
  const cocoaSpongeColor = 0x200e07;   // Moist cocoa cake sponge
  const goldPlateColor = 0xd4af37;     // Champagne gold dessert plate
  const roseGoldLinerColor = 0xb76e79; // Fluted rose-gold metallic liner

  // Materials
  const chocolateFrostingMat = new THREE.MeshStandardMaterial({
    color: darkChocolateColor,
    roughness: 0.24,
    metalness: 0.08,
    bumpMap: ganacheBump,
    bumpScale: 0.015,
  });

  const spongeMat = new THREE.MeshStandardMaterial({
    color: cocoaSpongeColor,
    roughness: 0.7,
    metalness: 0.02,
  });

  const linerMat = new THREE.MeshStandardMaterial({
    color: roseGoldLinerColor,
    roughness: 0.35,
    metalness: 0.65,
  });

  const plateMat = new THREE.MeshStandardMaterial({
    color: goldPlateColor,
    metalness: 0.88,
    roughness: 0.2,
  });

  const interiorMat = new THREE.MeshStandardMaterial({
    map: interiorTexture,
    roughness: 0.55,
    metalness: 0.02,
  });

  const strawberryMat = new THREE.MeshStandardMaterial({
    color: 0xbd102b,
    roughness: 0.2,
    metalness: 0.05,
  });

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x275927,
    roughness: 0.45,
  });

  // --- 1. Elegant Gold Dessert Saucer / Plate (Scaled down & refined) ---
  const plateGeom = new THREE.CylinderGeometry(1.6, 1.35, 0.09, 48);
  const plateMesh = new THREE.Mesh(plateGeom, plateMat);
  plateMesh.position.y = -0.045;
  plateMesh.receiveShadow = true;
  rootGroup.add(plateMesh);

  // --- 2. Slice Sector Angle Definitions ---
  const cutStart = -0.15;
  const cutAngle = Math.PI * 0.28; // ~50 degree slice
  const cutEnd = cutStart + cutAngle;
  const sliceCenterAngle = cutStart + cutAngle / 2;

  // Sector extrusion helper for cupcake layers
  function createSectorCupcakeLayer(
    radius: number,
    height: number,
    startAngle: number,
    arcAngle: number,
    material: THREE.Material,
    isSlice: boolean
  ): THREE.Mesh {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.arc(0, 0, radius, startAngle, startAngle + arcAngle, false);
    shape.lineTo(0, 0);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      curveSegments: 40,
    });
    geom.rotateX(-Math.PI / 2);

    const mesh = new THREE.Mesh(geom, [
      material,
      isSlice ? interiorMat : material,
    ]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  // --- 3. Compact Pleated Cupcake Liner Base ---
  const cupHeight = 0.78;
  const cupRadius = 0.88;

  const mainCupLiner = createSectorCupcakeLayer(
    cupRadius,
    cupHeight,
    cutEnd,
    Math.PI * 2 - cutAngle,
    linerMat,
    false
  );
  rootGroup.add(mainCupLiner);

  const sliceGroup = new THREE.Group();
  sliceGroup.name = 'CupcakeSlice';

  const sliceCupLiner = createSectorCupcakeLayer(
    cupRadius,
    cupHeight,
    cutStart,
    cutAngle,
    linerMat,
    true
  );
  sliceGroup.add(sliceCupLiner);

  // --- 4. Moist Chocolate Sponge Dome ---
  const spongeHeight = 0.38;
  const spongeRadius = 0.98;
  const spongeY = cupHeight;

  const mainSponge = createSectorCupcakeLayer(
    spongeRadius,
    spongeHeight,
    cutEnd,
    Math.PI * 2 - cutAngle,
    spongeMat,
    false
  );
  mainSponge.position.y = spongeY;
  rootGroup.add(mainSponge);

  const sliceSponge = createSectorCupcakeLayer(
    spongeRadius,
    spongeHeight,
    cutStart,
    cutAngle,
    spongeMat,
    true
  );
  sliceSponge.position.y = spongeY;
  sliceGroup.add(sliceSponge);

  // --- 5. Beautiful Contoured Chocolate Swirl Frosting ---
  const swirlTiers = [
    { r: 0.92, h: 0.28, y: spongeY + spongeHeight },
    { r: 0.72, h: 0.26, y: spongeY + spongeHeight + 0.28 },
    { r: 0.50, h: 0.22, y: spongeY + spongeHeight + 0.54 },
    { r: 0.28, h: 0.18, y: spongeY + spongeHeight + 0.76 },
  ];

  swirlTiers.forEach((tier) => {
    const mainSwirl = createSectorCupcakeLayer(
      tier.r,
      tier.h,
      cutEnd,
      Math.PI * 2 - cutAngle,
      chocolateFrostingMat,
      false
    );
    mainSwirl.position.y = tier.y;
    rootGroup.add(mainSwirl);

    const sliceSwirl = createSectorCupcakeLayer(
      tier.r,
      tier.h,
      cutStart,
      cutAngle,
      chocolateFrostingMat,
      true
    );
    sliceSwirl.position.y = tier.y;
    sliceGroup.add(sliceSwirl);
  });

  // --- 6. REALISTIC CHOCOLATE SPRINKLES (Jimmies) ---
  const sprinkleGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.08, 6);
  sprinkleGeom.rotateZ(Math.PI / 2);

  const darkSprinkleMat = new THREE.MeshStandardMaterial({
    color: 0x160803, // Extra dark chocolate sprinkle
    roughness: 0.25,
  });

  const milkSprinkleMat = new THREE.MeshStandardMaterial({
    color: 0x4a2416, // Milk chocolate sprinkle
    roughness: 0.28,
  });

  const whiteSprinkleMat = new THREE.MeshStandardMaterial({
    color: 0xfff8ee, // White chocolate cream sprinkle
    roughness: 0.3,
  });

  const goldBallGeom = new THREE.SphereGeometry(0.024, 8, 8);

  const sprinkleCount = 65;
  for (let i = 0; i < sprinkleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const tierIdx = Math.floor(Math.random() * swirlTiers.length);
    const tier = swirlTiers[tierIdx];
    const r = Math.random() * (tier.r - 0.06) + 0.05;
    const yPos = tier.y + Math.random() * tier.h + 0.02;
    const isInsideSlice = angle >= cutStart && angle <= cutEnd;

    let sprinkleMesh: THREE.Mesh;
    if (i % 5 === 0) {
      // Golden edible pearls
      sprinkleMesh = new THREE.Mesh(goldBallGeom, plateMat);
    } else {
      // Chocolate cylinder sprinkles (varied dark, milk, white)
      const mat = (i % 3 === 0) ? darkSprinkleMat : (i % 3 === 1) ? milkSprinkleMat : whiteSprinkleMat;
      sprinkleMesh = new THREE.Mesh(sprinkleGeom, mat);
      sprinkleMesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
    }

    sprinkleMesh.position.set(
      Math.cos(angle) * r,
      yPos,
      Math.sin(angle) * r
    );
    sprinkleMesh.castShadow = true;

    if (isInsideSlice) {
      sliceGroup.add(sprinkleMesh);
    } else {
      rootGroup.add(sprinkleMesh);
    }
  }

  // --- 7. Glossy Strawberry on Swirl ---
  const strawberryGeom = new THREE.SphereGeometry(0.09, 14, 14);
  const sPos = strawberryGeom.attributes.position;
  for (let i = 0; i < sPos.count; i++) {
    const y = sPos.getY(i);
    if (y < 0) {
      const taper = 1.0 + y * 0.6;
      sPos.setX(i, sPos.getX(i) * taper);
      sPos.setZ(i, sPos.getZ(i) * taper);
    }
    sPos.setY(i, y * 1.35);
  }
  strawberryGeom.computeVertexNormals();
  strawberryGeom.rotateX(Math.PI);

  const calyxGeom = new THREE.ConeGeometry(0.1, 0.025, 5);
  const berryGroup = new THREE.Group();
  berryGroup.add(new THREE.Mesh(strawberryGeom, strawberryMat));
  const leaves = new THREE.Mesh(calyxGeom, leafMat);
  leaves.position.y = 0.1;
  berryGroup.add(leaves);
  berryGroup.position.set(0.35, spongeY + spongeHeight + 0.45, -0.25);
  berryGroup.rotation.set(0.2, 0.4, 0.15);
  rootGroup.add(berryGroup);

  // --- 8. The Birthday Sparkler Stick & Firework Origin ---
  const sparklerGroup = new THREE.Group();
  sparklerGroup.name = 'BirthdaySparkler';

  const sparklerTopY = spongeY + spongeHeight + 0.94;
  const wireLength = 1.25;

  // Thin metallic wire
  const wireGeom = new THREE.CylinderGeometry(0.012, 0.012, wireLength, 10);
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.9,
    roughness: 0.2,
  });
  const wireMesh = new THREE.Mesh(wireGeom, wireMat);
  wireMesh.position.y = sparklerTopY + wireLength / 2 - 0.2;
  sparklerGroup.add(wireMesh);

  // Charcoal pyrotechnic coating on top
  const coatingGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.52, 10);
  const coatingMat = new THREE.MeshStandardMaterial({
    color: 0x3a3a3a,
    roughness: 0.95,
  });
  const coatingMesh = new THREE.Mesh(coatingGeom, coatingMat);
  coatingMesh.position.y = sparklerTopY + 0.7;
  sparklerGroup.add(coatingMesh);

  // Tip burning center
  const sparkOriginY = sparklerTopY + 1.0;

  // Dynamic firework point light
  const sparkLight = new THREE.PointLight(0xffdf6d, 0, 7.0);
  sparkLight.position.set(0, sparkOriginY, 0);
  sparklerGroup.add(sparkLight);

  // --- 9. Realistic Fireworks Sparkler Particle System ---
  const sparkCount = 280;
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
    s.x = (Math.random() - 0.5) * 0.03;
    s.y = sparkOriginY + (Math.random() - 0.5) * 0.03;
    s.z = (Math.random() - 0.5) * 0.03;

    const angleH = Math.random() * Math.PI * 2;
    const angleV = (Math.random() - 0.5) * Math.PI * 0.85;
    const speed = Math.random() * 0.06 + 0.025;

    s.vx = Math.cos(angleH) * Math.cos(angleV) * speed;
    s.vy = Math.sin(angleV) * speed + 0.015;
    s.vz = Math.sin(angleH) * Math.cos(angleV) * speed;

    s.life = 0;
    s.maxLife = Math.random() * 0.25 + 0.1;
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
    size: 0.07,
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
  rootGroup.add(sliceGroup);

  let isSparklerLit = false;
  let currentSliceProgress = 0;

  const refs: CakeModelRefs = {
    rootGroup,
    sliceGroup,
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

    setSliceProgress: (progress: number) => {
      currentSliceProgress = Math.max(0, Math.min(1, progress));
      refs.sliceSeparated = currentSliceProgress > 0.05;

      const maxDistance = 1.05;
      const dist = currentSliceProgress * maxDistance;
      refs.sliceDistance = dist;

      sliceGroup.position.x = Math.cos(sliceCenterAngle) * dist;
      sliceGroup.position.z = Math.sin(sliceCenterAngle) * dist;
      sliceGroup.rotation.y = currentSliceProgress * 0.08;
      sliceGroup.rotation.z = currentSliceProgress * 0.02;
    },

    update: (delta: number, _time: number) => {
      if (isSparklerLit) {
        const lightFlicker = Math.random() * 2.5;
        sparkLight.intensity = THREE.MathUtils.lerp(sparkLight.intensity, 4.5 + lightFlicker, delta * 20);

        const posAttr = sparkGeom.attributes.position as THREE.BufferAttribute;
        const colAttr = sparkGeom.attributes.color as THREE.BufferAttribute;

        for (let i = 0; i < sparkCount; i++) {
          const s = sparks[i];
          s.life += delta;

          if (s.life >= s.maxLife) {
            resetSpark(s);
          } else {
            s.vy -= delta * 0.3;
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
      interiorTexture.dispose();
      ganacheBump.dispose();
      sparkGeom.dispose();
      sparkMat.dispose();
      sprinkleGeom.dispose();
      goldBallGeom.dispose();
      darkSprinkleMat.dispose();
      milkSprinkleMat.dispose();
      whiteSprinkleMat.dispose();
      rootGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
    },
  };

  return refs;
}
