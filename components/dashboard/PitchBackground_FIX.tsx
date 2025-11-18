"use client";

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Plane, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// 1. Græs-overfladen
function GrassPitch() {
  const texture = useTexture('/images/grass-texture-seamless.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(100, 100);

  return (
    <Plane
      // NULSTILLET: Ingen 'position' prop
      
      // Din foretrukne rotation
      rotation={[-Math.PI / 2.7, 0, 0]}
      
      args={[5000, 5000]}
    >
      <meshStandardMaterial
        map={texture}
        roughness={0.8}
        metalness={0.2}
      />
    </Plane>
  );
}

// 2. Kamera-controlleren
function CameraController({ position, scale }: { position: { x: number, y: number }, scale: number }) {

  const baseZ = 25;
  const baseHeight = 10;
  const panSensitivity = 150;

  useFrame((state) => {
    state.camera.position.x = -position.x / panSensitivity;
    // NULSTILLET: Ingen Y_OFFSET
    state.camera.position.y = (position.y / panSensitivity) + baseHeight;
    state.camera.position.z = baseZ / scale;
    
    // NULSTILLET: Kig på (0,0,0)
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

// 3. Hoved-komponenten
export default function PitchBackground({ position, scale }: { position: { x: number, y: number }, scale: number }) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        // HOVED-RETTELSE:
        // Vi justerer 'fov' (Field of View) fra 58 til 50.
        camera={{ position: [0, 10, 25], fov: 50 }}
      >
        <color attach="background" args={['#2a5a32']} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[0, 10, 5]} intensity={1.8} />
        <Suspense fallback={null}>
          <GrassPitch />
        </Suspense>
        <CameraController position={position} scale={scale} />
      </Canvas>
    </div>
  );
}