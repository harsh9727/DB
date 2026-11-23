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
  onKnifePickedUp,
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
    // Camera framing the cupcake and sparkler with generous top breathing room & snug bottom spacing
    camera.position.set(0, 1.10, 4.3);
    camera.lookAt(0, 0.74, 0);

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

    // 3. Delicate Vanilla Cupcake with Sparkler Model (Decreased Size matching uploaded photo)
    const cakeModel = createCakeModel();
    cakeModelRef.current = cakeModel;
    cakeModel.rootGroup.position.set(0, -0.14, 0);
    cakeModel.setSparklerVisible(stage === 'UNLIT' || stage === 'LIT');
    scene.add(cakeModel.rootGroup);

    // 4. Authentic Cake Knife (Textured with user's knife image, only shown on "Pick Up the Cake Knife" screen)
    const knife = createCakeKnife();
    // Positioned vertically above the pink dish
    const restingKnifePos = new THREE.Vector3(0.85, 0.58, 0.25);
    knife.position.copy(restingKnifePos);
    // Explicitly hide knife initially (only shown starting from "Pick Up the Cake Knife" screen)
    knife.visible = stage === 'BLOWN' || stage === 'KNIFE_READY' || stage === 'CUTTING' || stage === 'CELEBRATION';
    scene.add(knife);

    // 5. Interactive Cutting Guide Line Mesh (soft glowing guideline)
    const cutLineGeom = new THREE.PlaneGeometry(1.35, 0.02);
    const cutLineMat = new THREE.MeshBasicMaterial({
      color: 0xff758f,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const cutLineMesh = new THREE.Mesh(cutLineGeom, cutLineMat);
    cutLineMesh.rotation.x = -Math.PI / 2;
    cutLineMesh.rotation.z = 0.24;
    cutLineMesh.position.set(0.13, 0.56, 0.16);
    scene.add(cutLineMesh);

    // 6. Pointer Tracking & Knife State
    const pointer = new THREE.Vector2(0, 0);
    const targetKnifePos = new THREE.Vector3().copy(restingKnifePos);
    const targetKnifeQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2, 'YXZ'));

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
      // If clicked on "Pick Up the Cake Knife" screen, trigger knife pickup
      if (stageRef.current === 'BLOWN') {
        if (onKnifePickedUp) {
          onKnifePickedUp();
        }
        return;
      }
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
      camera.position.x = Math.sin(time * 0.35) * 0.10;
      camera.position.y = 1.10 + Math.cos(time * 0.45) * 0.04;
      camera.lookAt(0, 0.74, 0);

      const currentStage = stageRef.current;

      // Only show knife starting from the "Pick Up the Cake Knife" screen (BLOWN)
      const shouldShowKnife =
        currentStage === 'BLOWN' ||
        currentStage === 'KNIFE_READY' ||
        currentStage === 'CUTTING' ||
        currentStage === 'CELEBRATION';

      knife.visible = shouldShowKnife;

      // Knife behavior depending strictly on current stage
      if (currentStage === 'KNIFE_READY' || currentStage === 'CUTTING') {
        if (isCuttingActive) {
          // Plunging downward along the cut line of the user's cupcake image
          const cutY = THREE.MathUtils.lerp(1.30, -0.16, dragProgressRef.current);
          const cutX = THREE.MathUtils.lerp(0.03, 0.24, dragProgressRef.current);
          const cutZ = THREE.MathUtils.lerp(0.28, 0.14, dragProgressRef.current);

          targetKnifePos.set(cutX, cutY, cutZ);
          targetKnifeQuat.setFromEuler(new THREE.Euler(Math.PI * 0.35, Math.PI * 0.12, -Math.PI * 0.18));
          cutLineMat.opacity = THREE.MathUtils.lerp(cutLineMat.opacity, 0.85, delta * 8);
        } else {
          // Hovering ready above the user's cupcake apex
          targetKnifePos.set(0.18, 1.34 + Math.sin(time * 3) * 0.025, 0.30);
          targetKnifeQuat.setFromEuler(new THREE.Euler(Math.PI * 0.30, Math.PI * 0.10, -Math.PI * 0.15));
          cutLineMat.opacity = THREE.MathUtils.lerp(cutLineMat.opacity, 0.75, delta * 6);
        }
      } else if (currentStage === 'CELEBRATION' || cutFinished) {
        // Slice cut complete: knife rests cleanly above the saucer to the side (never penetrating the dish)
        targetKnifePos.set(0.96, 0.06, 0.28);
        targetKnifeQuat.setFromEuler(new THREE.Euler(-Math.PI / 12, -Math.PI / 4, 0));
        cutLineMat.opacity = THREE.MathUtils.lerp(cutLineMat.opacity, 0, delta * 5);
      } else if (currentStage === 'BLOWN') {
        // "Pick Up the Cake Knife" screen:
        // Positioned cleanly ABOVE the pink dish (never clipping or going inside the dish),
        // standing in a VERTICAL position, continuously ROTATING around its vertical Y axis!
        const hoverY = 0.58 + Math.sin(time * 2.5) * 0.035;
        targetKnifePos.set(0.85, hoverY, 0.25);

        // Vertical stance: blade pointing down towards the dish, handle upright
        // Continuous smooth rotation around vertical Y-axis:
        const spinAngle = time * 2.2;
        const verticalEuler = new THREE.Euler(0, spinAngle, Math.PI / 2, 'YXZ');
        targetKnifeQuat.setFromEuler(verticalEuler);
        cutLineMat.opacity = THREE.MathUtils.lerp(cutLineMat.opacity, 0, delta * 5);
      } else {
        // UNLIT, LIT: Knife is strictly hidden and placed off-screen
        targetKnifePos.set(4.0, -10.0, 0);
        knife.position.copy(targetKnifePos);
        cutLineMat.opacity = 0;
      }

      knife.position.lerp(targetKnifePos, delta * 8);
      knife.quaternion.slerp(targetKnifeQuat, delta * 8);

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

    if (stage === 'UNLIT') {
      model.setSparklerVisible(true);
      model.setCandlesLit(false);
    } else if (stage === 'LIT') {
      model.setSparklerVisible(true);
      model.setCandlesLit(true);
    } else if (stage === 'BLOWN' || stage === 'KNIFE_READY' || stage === 'CUTTING' || stage === 'CELEBRATION') {
      // User request: When arriving at the "Pick Up the Cake Knife" screen (BLOWN) and onwards, remove sparkler stick!
      model.setCandlesLit(false);
      model.setSparklerVisible(false);
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
