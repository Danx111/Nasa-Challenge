import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface Globe3DProps {
  targetLocation: { lat: number; lon: number } | null;
  onAnimationComplete?: () => void;
}

function Earth({ targetLocation, onAnimationComplete }: Globe3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const markerRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const animatingRef = useRef(false);

  useEffect(() => {
    if (targetLocation && !animatingRef.current) {
      animatingRef.current = true;
      
      // Convert lat/lon to 3D coordinates
      const phi = (90 - targetLocation.lat) * (Math.PI / 180);
      const theta = (targetLocation.lon + 180) * (Math.PI / 180);
      
      const x = -(Math.cos(theta) * Math.sin(phi)) * 2.1;
      const y = Math.cos(phi) * 2.1;
      const z = Math.sin(theta) * Math.sin(phi) * 2.1;
      
      if (markerRef.current) {
        markerRef.current.position.set(x, y, z);
        markerRef.current.visible = true;
      }

      // Animate rotation to target
      const targetRotationY = -theta + Math.PI / 2;
      const startRotationY = meshRef.current?.rotation.y || 0;
      const startTime = Date.now();
      const duration = 2000;

      const animateRotation = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

        if (meshRef.current) {
          meshRef.current.rotation.y = startRotationY + (targetRotationY - startRotationY) * eased;
        }

        if (progress < 1) {
          requestAnimationFrame(animateRotation);
        } else {
          setTimeout(() => {
            animatingRef.current = false;
            onAnimationComplete?.();
          }, 500);
        }
      };

      animateRotation();
    }
  }, [targetLocation, onAnimationComplete]);

  useFrame(() => {
    if (!animatingRef.current && meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#1e3a8a"
          roughness={0.7}
          metalness={0.1}
        >
          <primitive attach="map" object={createEarthTexture()} />
        </meshStandardMaterial>
      </Sphere>
      
      {/* Location marker */}
      <mesh ref={markerRef} visible={false}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  
  // Ocean
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Simple continents (stylized)
  ctx.fillStyle = '#22c55e';
  
  // North America
  ctx.beginPath();
  ctx.ellipse(400, 350, 180, 200, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // South America
  ctx.beginPath();
  ctx.ellipse(500, 650, 120, 180, 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // Europe
  ctx.beginPath();
  ctx.ellipse(1050, 300, 100, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Africa
  ctx.beginPath();
  ctx.ellipse(1080, 550, 150, 200, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Asia
  ctx.beginPath();
  ctx.ellipse(1500, 350, 250, 180, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Australia
  ctx.beginPath();
  ctx.ellipse(1650, 700, 100, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function Globe3D({ targetLocation, onAnimationComplete }: Globe3DProps) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1} />
      <Earth targetLocation={targetLocation} onAnimationComplete={onAnimationComplete} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
