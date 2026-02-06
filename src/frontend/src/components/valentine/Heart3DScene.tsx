import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import * as THREE from 'three';

interface HeartMeshProps {
  zoomProgress: number;
  isReducedMotion: boolean;
}

function HeartMesh({ zoomProgress, isReducedMotion }: HeartMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useEffect(() => {
    // Set initial camera position
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame(() => {
    if (meshRef.current && !isReducedMotion) {
      // Gentle rotation
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
    }

    // Animate camera zoom based on progress
    const targetZ = 5 - zoomProgress * 4.5; // Zoom from 5 to 0.5
    camera.position.z += (targetZ - camera.position.z) * 0.05;
  });

  // Create heart shape using parametric equations
  const heartShape = new THREE.Shape();
  const scale = 0.5;
  
  heartShape.moveTo(0, 0);
  for (let i = 0; i <= Math.PI * 2; i += 0.1) {
    const x = scale * 16 * Math.pow(Math.sin(i), 3);
    const y = scale * (13 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(3 * i) - Math.cos(4 * i));
    heartShape.lineTo(x / 16, -y / 16);
  }

  const extrudeSettings = {
    depth: 0.4,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 5,
  };

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <extrudeGeometry args={[heartShape, extrudeSettings]} />
      <meshStandardMaterial
        color="#ff1744"
        emissive="#ff1744"
        emissiveIntensity={0.3}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}

interface Heart3DSceneProps {
  zoomProgress: number;
  isReducedMotion: boolean;
}

export function Heart3DScene({ zoomProgress, isReducedMotion }: Heart3DSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={Math.min(window.devicePixelRatio, 2)}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff69b4" />
      <HeartMesh zoomProgress={zoomProgress} isReducedMotion={isReducedMotion} />
    </Canvas>
  );
}
