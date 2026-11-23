'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createCakeModel, CakeModelRefs } from './cakeModel';
import { createCakeKnife } from './cakeKnifeMesh';
import { cakeAudio } from './cakeAudio';

export type CakeStage = 'UNLIT' | 'LIT' | 'BLOWN' | 'KNIFE_READY' | 'CUTTING' | 'CELEBRATION';

interface CakeCanvasProps {
  stage: CakeStage;
  onCandlesLit?: () => void;
  onCandlesBlown?: () => void;
  onCutComplete?: () => void;
  onKnifePickedUp?: () => void;
}

export function CakeCanvas({
  stage,
  onCutComplete,
}: CakeCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cakeModelRef = useRef<CakeModelRefs | null>(null);
  const stageRef = useRef<CakeStage>(stage);
  const [isDraggingKnife, setIsDraggingKnife] = useState(false);
  const dragProgressRef = useRef<number>(0);

  // Keep stageRef updated with current stage
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1b0307, 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    // Camera framing the medium cupcake and sparkler
    camera.position.set(0, 2.8, 5.8);
    camera.lookAt(0, 0.95, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0xffe6eb, 1.1);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfffaee, 2.5);
    mainLight.position.set(4, 9, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xf43f5e, 1.3);
    fillLight.position.set(-4, 4, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffc2d1, 1.6);
    rimLight.position.set(0, 6, -5);
    scene.add(rimLight);

    // 3. Medium Chocolate Cupcake with Sparkler Model (No balloons)
    const cakeModel = createCakeModel();
    cakeModelRef.current = cakeModel;
    cakeModel.rootGroup.position.set(0, 0, 0);
    scene.add(cakeModel.rootGroup);

    // 4. Compact Metallic Cake Knife (Dainty dessert size)
    const knife = createCakeKnife();
    const restingKnifePos = new THREE.Vector3(1.7, 0.15, 0.45);
    knife.position.copy(restingKnifePos);
    knife.rotation.set(-Math.PI / 12, -Math.PI / 4, Math.PI / 16);
    scene.add(knife);

    // 5. Interactive Cutting Guide Line Mesh (soft glowing guideline)
    const cutLineGeom = new THREE.PlaneGeometry(1.1, 0.035);
    const cutLineMat = new THREE.MeshBasicMaterial({
      color: 0xff758f,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const cutLineMesh = new THREE.Mesh(cutLineGeom, cutLineMat);
    cutLineMesh.rotation.x = -Math.PI / 2;
    cutLineMesh.rotation.z = 0.28;
    cutLineMesh.position.set(0.48, 1.45, 0.25);
    scene.add(cutLineMesh);

    // 6. Pointer Tracking & Knife State
    const pointer = new THREE.Vector2(0, 0);
    const targetKnifePos = new THREE.Vector3().copy(restingKnifePos);
    const targetKnifeRot = new THREE.Euler().copy(knife.rotation);

    let isCuttingActive = false;
    let cutFinished = false;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const rect = container.getBoundingClientRect();

      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      // Only allow knife cutting if stage is KNIFE_READY or CUTTING!
      if ((stageRef.current === 'KNIFE_READY' || stageRef.current === 'CUTTING') && isCuttingActive && !cutFinished) {
        // Dragging downward from top of cupcake (y=0.45) toward base (y=-0.35)
        const progress = THREE.MathUtils.clamp((0.45 - pointer.y) / 0.8, 0, 1);
        dragProgressRef.current = progress;
        cakeModel.setSliceProgress(progress);

        if (progress > 0.05 && progress < 0.95) {
          cakeAudio.playKnifeCutting().catch(() => {});
        }

        if (progress >= 0.95 && !cutFinished) {
          cutFinished = true;
          isCuttingActive = false;
          setIsDraggingKnife(false);
          cakeModel.setSliceProgress(1.0);
          cakeAudio.playCelebration().catch(() => {});
          if (onCutComplete) {
            onCutComplete();
          }
        }
      }
    };

    const handlePointerDown = () => {
      // Strictly gate knife: only active during KNIFE_READY or CUTTING!
      if ((stageRef.current === 'KNIFE_READY' || stageRef.current === 'CUTTING') && !cutFinished) {
        isCuttingActive = true;
        setIsDraggingKnife(true);
      }
    };

    const handlePointerUp = () => {
      if (!cutFinished) {
        isCuttingActive = false;
        setIsDraggingKnife(false);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Update Cupcake & Sparkler fireworks
      cakeModel.update(delta, time);

      // Subtle ambient camera float
      camera.position.x = Math.sin(time * 0.35) * 0.22;
      camera.position.y = 3.2 + Math.cos(time * 0.45) * 0.1;
      camera.lookAt(0, 1.1, 0);

      const currentStage = stageRef.current;

      // Knife behavior depending strictly on current stage
      if (currentStage === 'KNIFE_READY' || currentStage === 'CUTTING') {
        if (isCuttingActive) {
          // Plunging downward through the compact cupcake
          const cutY = THREE.MathUtils.lerp(2.0, 0.55, dragProgressRef.current);
          const cutX = THREE.MathUtils.lerp(0.9, 0.38, dragProgressRef.current);
          const cutZ = THREE.MathUtils.lerp(0.55, 0.25, dragProgressRef.current);

          targetKnifePos.set(cutX, cutY, cutZ);
          targetKnifeRot.set(Math.PI * 0.35, Math.PI * 0.15, -Math.PI * 0.2);
          cutLineMat.opacity = THREE.MathUtils.lerp(cutLineMat.opacity, 0.85, delta * 8);
        } else {
          // Hovering ready above the compact cupcake
          targetKnifePos.set(1.05, 1.8 + Math.sin(time * 3) * 0.04, 0.65);
          targetKnifeRot.set(Math.PI * 0.25, Math.PI * 0.1, -Math.PI * 0.15);
          cutLineMat.opacity = THREE.MathUtils.lerp(cutLineMat.opacity, 0.75, delta * 6);
        }
      } else if (currentStage === 'CELEBRATION' || cutFinished) {
        // Slice cut complete: knife rests cleanly to the side
        targetKnifePos.set(1.75, 0.18, 0.55);
        targetKnifeRot.set(-Math.PI / 12, -Math.PI / 4, 0);
        cutLineMat.opacity = THREE.MathUtils.lerp(cutLineMat.opacity, 0, delta * 5);
      } else {
        // UNLIT, LIT, BLOWN: Knife rests completely on the saucer, immune to clicks
        targetKnifePos.copy(restingKnifePos);
        targetKnifePos.y = restingKnifePos.y + Math.sin(time * 2.5) * 0.025;
        targetKnifeRot.set(-Math.PI / 12, -Math.PI / 4, Math.PI / 16);
        cutLineMat.opacity = THREE.MathUtils.lerp(cutLineMat.opacity, 0, delta * 5);
      }

      knife.position.lerp(targetKnifePos, delta * 8);
      knife.rotation.x = THREE.MathUtils.lerp(knife.rotation.x, targetKnifeRot.x, delta * 8);
      knife.rotation.y = THREE.MathUtils.lerp(knife.rotation.y, targetKnifeRot.y, delta * 8);
      knife.rotation.z = THREE.MathUtils.lerp(knife.rotation.z, targetKnifeRot.z, delta * 8);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      cakeModel.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onCutComplete]);

  // Synchronize stage transitions with cakeModel sparkler & slice states
  useEffect(() => {
    if (!cakeModelRef.current) return;
    const model = cakeModelRef.current;

    if (stage === 'LIT') {
      model.setCandlesLit(true);
    } else if (stage === 'BLOWN' || stage === 'KNIFE_READY' || stage === 'CUTTING' || stage === 'CELEBRATION') {
      model.setCandlesLit(false);
    }

    if (stage === 'CELEBRATION') {
      model.setSliceProgress(1.0);
    }
  }, [stage]);

  return (
    <div className="relative h-full w-full select-none overflow-hidden touch-none">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
      {isDraggingKnife && (
        <div className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-rose-950/80 px-5 py-2 text-xs font-medium text-rose-200 border border-rose-400/40 backdrop-blur-md animate-pulse">
          Dragging knife downward to cut the cupcake... 🧁
        </div>
      )}
    </div>
  );
}
