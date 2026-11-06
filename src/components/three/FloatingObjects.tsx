'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface BananaChipProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  speed?: number;
}

/**
 * 1. Procedural 3D Golden Banana Chip
 * Mimics authentic curvature and undulating surface of kettle-fried Nendran chips.
 */
export function BananaChip({
  position,
  rotation,
  scale = 1,
  speed = 1.6,
}: BananaChipProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(1.5, 1.5, 0.08, 32, 4);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const wave = Math.sin(x * 1.6) * 0.16 + Math.cos(z * 1.3) * 0.12;
      pos.setY(i, pos.getY(i) + wave);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.006;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.12;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.7}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale} geometry={geometry}>
        <meshStandardMaterial
          color="#FFB928"
          roughness={0.42}
          metalness={0.18}
          bumpScale={0.06}
        />
      </mesh>
    </Float>
  );
}

/**
 * 2. Floating Golden Sesame and Spice Particles
 */
export function SpiceParticles({ count = 35 }: { count?: number }) {
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
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.025;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.11}
        color="#F5A477"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * 3. Floating Craft Emblem Ring
 */
export function CraftEmblemRing({ position }: { position: [number, number, number] }) {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.08;
      ringRef.current.rotation.x = 1.1 + Math.sin(state.clock.elapsedTime * 0.35) * 0.04;
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.35}>
      <mesh ref={ringRef} position={position} rotation={[1.1, 0.4, 0]}>
        <torusGeometry args={[2.7, 0.035, 16, 64]} />
        <meshStandardMaterial
          color="#FFB928"
          emissive="#542817"
          roughness={0.28}
          metalness={0.75}
          transparent
          opacity={0.4}
        />
      </mesh>
    </Float>
  );
}
