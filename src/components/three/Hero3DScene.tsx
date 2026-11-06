'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BananaChip, SpiceParticles, CraftEmblemRing } from './FloatingObjects';
import SceneFallback from './SceneFallback';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Mouse-responsive scene rig
function MouseRig({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle responsive camera/group tilt based on pointer coords (-1 to +1)
      const targetX = state.pointer.x * 0.35;
      const targetY = state.pointer.y * 0.25;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.04);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.04);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function Hero3DScene() {
  const prefersReduced = useReducedMotion();
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || prefersReduced || hasWebGLError) {
    return <SceneFallback />;
  }

  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          if (!gl.domElement) setHasWebGLError(true);
        }}
      >
        {/* Soft Warm Bakery Lighting */}
        <ambientLight intensity={0.85} />
        <directionalLight position={[5, 6, 4]} intensity={1.3} color="#FFF9EF" />
        <directionalLight position={[-5, -3, -2]} intensity={0.5} color="#FFB928" />
        <pointLight position={[0, 2, 2]} intensity={0.7} color="#F47735" />

        {/* Mouse Interactive Scene */}
        <MouseRig>
          <BananaChip position={[3.3, 0.9, -1]} rotation={[0.4, 0.6, 0.2]} scale={0.9} speed={1.8} />
          <BananaChip position={[-3.5, -1.1, -2]} rotation={[-0.3, 1.2, 0.5]} scale={0.65} speed={1.4} />
          <CraftEmblemRing position={[3.3, 0.9, -1.5]} />
          <SpiceParticles count={35} />
        </MouseRig>
      </Canvas>
    </div>
  );
}
