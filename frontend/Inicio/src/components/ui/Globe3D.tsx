import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";
import earthDayTexture from "@/assets/earth-day.jpg";
import earthBumpTexture from "@/assets/earth-bump.jpg";
import earthWaterTexture from "@/assets/earth-water.png";
import earthCloudsTexture from "@/assets/earth-clouds.png";

interface Globe3DProps {
  targetLocation: { lat: number; lon: number } | null;
  onAnimationComplete?: () => void;
}

function Earth({ targetLocation, onAnimationComplete }: Globe3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const markerRef = useRef<THREE.Mesh>(null);
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

        if (cloudsRef.current) {
          cloudsRef.current.rotation.y = startRotationY + (targetRotationY - startRotationY) * eased;
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
    if (!animatingRef.current) {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.001;
      }
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += 0.0012;
      }
    }
  });

  // Load textures
  const textureLoader = new THREE.TextureLoader();
  const dayMap = textureLoader.load(earthDayTexture);
  const bumpMap = textureLoader.load(earthBumpTexture);
  const specularMap = textureLoader.load(earthWaterTexture);
  const cloudsMap = textureLoader.load(earthCloudsTexture);

  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      {/* Earth sphere */}
      <Sphere ref={meshRef} args={[2, 128, 128]}>
        <meshPhongMaterial
          map={dayMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          specularMap={specularMap}
          specular={new THREE.Color(0x333333)}
          shininess={25}
        />
      </Sphere>
      
      {/* Clouds layer */}
      <Sphere ref={cloudsRef} args={[2.02, 64, 64]}>
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.8}
          depthWrite={false}
        />
      </Sphere>
      
      {/* Location marker */}
      <mesh ref={markerRef} visible={false}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

export default function Globe3D({ targetLocation, onAnimationComplete }: Globe3DProps) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
      <Earth targetLocation={targetLocation} onAnimationComplete={onAnimationComplete} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
