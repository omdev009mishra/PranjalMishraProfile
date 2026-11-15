import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { useRef } from 'react'
import type { Mesh } from 'three'
import { useWorldStore } from '../store/worldStore'

function Tree({ position, scale = 1, hue = '#18c6a1' }: { position: [number, number, number]; scale?: number; hue?: string }) {
  const crown = useRef<Mesh>(null)
  const selectObject = useWorldStore((state) => state.selectObject)

  useFrame((state) => {
    if (crown.current) crown.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2 + position[0]) * 0.08
  })

  return (
    <group position={position} scale={scale} onClick={(event) => {
      event.stopPropagation()
      selectObject('A living signal is pulsing through this tree.')
    }}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.22, 2.2, 7]} />
        <meshStandardMaterial color="#182b23" roughness={0.95} />
      </mesh>
      <mesh ref={crown} position={[0, 2.35, 0]} castShadow>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshStandardMaterial color="#103d31" roughness={0.8} emissive={hue} emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[0.2, 2.2, 0.15]}>
        <icosahedronGeometry args={[0.48, 1]} />
        <meshStandardMaterial color={hue} emissive={hue} emissiveIntensity={1.4} transparent opacity={0.65} />
      </mesh>
    </group>
  )
}

function SignalStone({ position }: { position: [number, number, number] }) {
  const selectObject = useWorldStore((state) => state.selectObject)
  return (
    <Float speed={1.2} floatIntensity={0.25} rotationIntensity={0.12}>
      <mesh position={position} onClick={(event) => {
        event.stopPropagation()
        selectObject('The ecosystem is coming online. Interactive research stations arrive in a later phase.')
      }}>
        <octahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color="#44d9ff" emissive="#18c6a1" emissiveIntensity={2.1} metalness={0.55} roughness={0.2} />
      </mesh>
    </Float>
  )
}

function ForestScene() {
  return (
    <>
      <color attach="background" args={['#07120f']} />
      <fog attach="fog" args={['#07120f', 8, 34]} />
      <ambientLight intensity={0.55} color="#a8e8c9" />
      <hemisphereLight args={['#5edbb5', '#07120f', 0.8]} />
      <directionalLight position={[4, 8, 5]} intensity={1.1} color="#b5f5d2" />
      <pointLight position={[0, 2, -5]} intensity={22} distance={16} color="#18c6a1" />
      <pointLight position={[-6, 1, -10]} intensity={16} distance={12} color="#44d9ff" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -8]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#091b15" roughness={1} />
      </mesh>

      <Tree position={[-5, 0, -5]} scale={1.35} />
      <Tree position={[5, 0, -7]} scale={1.5} hue="#44d9ff" />
      <Tree position={[-7, 0, -14]} scale={1.7} />
      <Tree position={[7, 0, -16]} scale={1.8} hue="#44d9ff" />
      <Tree position={[-3.5, 0, -22]} scale={1.5} hue="#44d9ff" />
      <Tree position={[4, 0, -25]} scale={1.7} />

      <SignalStone position={[0, 1.35, -6]} />
      <SignalStone position={[-2.3, 1.1, -17]} />

      <Sparkles count={100} scale={[18, 8, 30]} size={2.2} speed={0.22} opacity={0.6} color="#65e8c0" />
    </>
  )
}

export function WorldCanvas() {
  const selectObject = useWorldStore((state) => state.selectObject)

  return (
    <div className="world-canvas" aria-label="Decorative interactive 3D bioluminescent forest">
      <Canvas
        camera={{ position: [0, 2.8, 7], fov: 52 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        fallback={<div className="world-fallback" aria-hidden="true" />}
        onPointerMissed={() => selectObject(null)}
      >
        <ForestScene />
      </Canvas>
    </div>
  )
}
