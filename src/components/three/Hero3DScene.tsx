'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// 1. Stylized 3D Golden Banana Chip with organic curvature
function StylizedBananaChip({ position, rotation, scale = 1 }: { position: [number, number, number]; rotation: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Procedural curved organic geometry mimicking a sliced Nendran plantain chip
  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(1.6, 1.6, 0.08, 32, 4);
    const pos = geo.attributes.position;
    // Introduce gentle wave/undulation
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const wave = Math.sin(x * 1.5) * 0.18 + Math.cos(z * 1.2) * 0.12;
      pos.setY(i, pos.getY(i) + wave);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale} geometry={geometry}>
        <meshStandardMaterial
          color="#FFB928"
          roughness={0.4}
          metalness={0.15}
          bumpScale={0.05}
        />
      </mesh>
    </Float>
  );
}

// 2. Floating Golden Sesame & Spice Particles
function FloatingSpiceParticles({ count = 35 }: { count?: number }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 12;
      p[i * 3 + 1] = (Math.random() - 0.5) * 8;
      p[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null!);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#F5A477"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 3. Floating Bakery Craft Ring (Emblem)
function BakeryEmblemRing({ position }: { position: [number, number, number] }) {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      ringRef.current.rotation.x = 1.1 + Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={ringRef} position={position} rotation={[1.1, 0.4, 0]}>
        <torusGeometry args={[2.8, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#FFB928"
          emissive="#542817"
          roughness={0.25}
          metalness={0.8}
          transparent
          opacity={0.45}
        />
      </mesh>
    </Float>
  );
}

// Main Canvas Scene Container
export default function Hero3DScene() {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        {/* Ambient & Warm Direct Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 6, 4]} intensity={1.4} color="#FFF9EF" />
        <directionalLight position={[-5, -3, -2]} intensity={0.6} color="#FFB928" />
        <pointLight position={[0, 2, 2]} intensity={0.8} color="#F47735" />

        {/* 3D Elements */}
        <StylizedBananaChip position={[3.2, 0.8, -1]} rotation={[0.4, 0.6, 0.2]} scale={0.9} />
        <StylizedBananaChip position={[-3.6, -1.2, -2]} rotation={[-0.3, 1.2, 0.5]} scale={0.7} />
        <BakeryEmblemRing position={[3.2, 0.8, -1.5]} />
        <FloatingSpiceParticles count={40} />
      </Canvas>
    </div>
  );
}
