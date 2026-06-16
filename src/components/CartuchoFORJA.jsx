import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, Center } from "@react-three/drei";

function Model() {
  const groupRef = useRef();
  const { scene } = useGLTF("/FORJAmatch.glb");

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useFrame((_, delta) => {
    if (groupRef.current && !prefersReducedMotion) {
      groupRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} scale={1.2} />
      </Center>
    </group>
  );
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#e6372e" wireframe />
    </mesh>
  );
}

function CartuchoFORJA() {
  return (
    <div className="cartridge-canvas">
      <Canvas
        camera={{ position: [0, 0, 100], fov: 97 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-3, -3, 2]} intensity={0.4} color="#e6372e" />
        <Environment preset="city" />
        <Suspense fallback={<Loader />}>
          <Model />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}

export default CartuchoFORJA;
