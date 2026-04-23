import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Text, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingCardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  text: string;
  subtext?: string;
  delay?: number;
  scale?: number;
}

function FloatingCard({ position, rotation, color, text, subtext, delay = 0, scale = 1 }: FloatingCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime + delay;
      meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.2;
      meshRef.current.rotation.x = rotation[0] + Math.sin(t * 0.3) * 0.05;
      meshRef.current.rotation.y = rotation[1] + Math.cos(t * 0.2) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <RoundedBox args={[2.2, 1.4, 0.1]} radius={0.15} smoothness={4}>
          <meshStandardMaterial
            ref={materialRef}
            color={color}
            transparent
            opacity={0.15}
            roughness={0.1}
            metalness={0.8}
            side={THREE.DoubleSide}
          />
        </RoundedBox>
        {/* Inner glow border */}
        <RoundedBox args={[2.25, 1.45, 0.08]} radius={0.15} smoothness={4}>
          <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.BackSide} />
        </RoundedBox>
        {/* Text */}
        <Text
          position={[0, 0.15, 0.06]}
          fontSize={0.22}
          color="white"
          anchorX="center"
          anchorY="middle"
          font={undefined}
          maxWidth={2}
        >
          {text}
        </Text>
        {subtext && (
          <Text
            position={[0, -0.25, 0.06]}
            fontSize={0.12}
            color="#00E5FF"
            anchorX="center"
            anchorY="middle"
            font={undefined}
            maxWidth={2}
          >
            {subtext}
          </Text>
        )}
        {/* Icon placeholder - cross/plus symbol */}
        <group position={[0, 0.5, 0.06]}>
          <mesh>
            <boxGeometry args={[0.15, 0.04, 0.02]} />
            <meshBasicMaterial color="#00E5FF" />
          </mesh>
          <mesh>
            <boxGeometry args={[0.04, 0.15, 0.02]} />
            <meshBasicMaterial color="#00E5FF" />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

function FloatingPills() {
  const pillsRef = useRef<THREE.Group>(null);

  const pills = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 - 5,
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.2,
      speed: 0.2 + Math.random() * 0.5,
      color: i % 3 === 0 ? '#00E5FF' : i % 3 === 1 ? '#7C3AED' : '#FFFFFF',
    }));
  }, []);

  useFrame((state) => {
    if (pillsRef.current) {
      pillsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={pillsRef}>
      {pills.map((pill) => (
        <Float key={pill.id} speed={pill.speed} rotationIntensity={0.5} floatIntensity={0.8}>
          <mesh position={pill.position} scale={pill.scale}>
            <capsuleGeometry args={[0.5, 1, 4, 8]} />
            <meshStandardMaterial
              color={pill.color}
              transparent
              opacity={0.3}
              emissive={pill.color}
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.1;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#00E5FF"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00E5FF" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#7C3AED" />
      <directionalLight position={[0, 5, 5]} intensity={0.5} color="#ffffff" />

      {/* Stars background */}
      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

      {/* Floating particles */}
      <Particles />

      {/* Floating medicine pills */}
      <FloatingPills />

      {/* Main floating cards */}
      <FloatingCard
        position={[-4, 1.5, -2]}
        rotation={[0.1, 0.3, -0.1]}
        color="#00E5FF"
        text="30-Minute"
        subtext="Delivery Guarantee"
        delay={0}
        scale={1}
      />
      <FloatingCard
        position={[4, 0.5, -3]}
        rotation={[0.1, -0.4, 0.1]}
        color="#7C3AED"
        text="Medicines"
        subtext="5000+ Products"
        delay={1}
        scale={0.9}
      />
      <FloatingCard
        position={[-3, -2, -1]}
        rotation={[-0.1, 0.2, 0.05]}
        color="#00E5FF"
        text="Prescription"
        subtext="Upload & Order"
        delay={2}
        scale={0.85}
      />
      <FloatingCard
        position={[3.5, -1.5, -2.5]}
        rotation={[-0.05, -0.3, -0.05]}
        color="#FFFFFF"
        text="24/7"
        subtext="Support Available"
        delay={1.5}
        scale={0.8}
      />

      {/* Central glow sphere */}
      <mesh position={[0, 0, -8]}>
        <sphereGeometry args={[3, 32, 32]} />
        <MeshDistortMaterial
          color="#7C3AED"
          transparent
          opacity={0.15}
          distort={0.4}
          speed={2}
          roughness={0}
        />
      </mesh>
    </>
  );
}

interface ThreeSceneProps {
  className?: string;
}

export default function ThreeScene({ className }: ThreeSceneProps) {
  return (
    <div className={`absolute inset-0 ${className || ''}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
