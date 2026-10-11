import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { useMemo } from 'react';
import { IcosahedronGeometry, Vector3, LineCurve3 } from 'three';

export default function NetworkScene({ colors, rotating }: { colors: string[]; rotating: boolean }) {
  const { points, links } = useMemo(() => {
    const geometry = new IcosahedronGeometry(2.25, 0);
    const positions = geometry.getAttribute('position');
    const points: Vector3[] = [];
    const links: [Vector3, Vector3][] = [];
    const seen = new Set<string>();
    for (let i = 0; i < positions.count; i += 3) {
      const triangle = [0, 1, 2].map(j => new Vector3().fromBufferAttribute(positions, i + j));
      for (const point of triangle) {
        if (!points.some(other => other.distanceTo(point) < 0.01)) points.push(point);
      }
      for (let j = 0; j < 3; j++) {
        const a = triangle[j];
        const b = triangle[(j + 1) % 3];
        const key = [a.toArray().join(','), b.toArray().join(',')].sort().join('|');
        if (!seen.has(key)) { seen.add(key); links.push([a, b]); }
      }
    }
    geometry.dispose();
    return { points, links };
  }, []);
  return <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8.5], fov: 42 }} gl={{ antialias: true, alpha: true }}>
    <ambientLight intensity={0.8} />
    <directionalLight position={[3, 5, 5]} intensity={2.5} color={colors[1]} />
    <Environment resolution={64}>
      <Lightformer intensity={3} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} color={colors[1]} />
      <Lightformer intensity={2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 8, 1]} color={colors[0]} />
    </Environment>
    <group rotation={[0.18, 0.3, -0.12]}>
      {links.map(([a, b], i) => <mesh key={i}>
        <tubeGeometry args={[new LineCurve3(a, b), 1, 0.018, 6, false]} />
        <meshStandardMaterial color={colors[0]} metalness={0.45} roughness={0.35} />
      </mesh>)}
      {points.map((point, i) => <mesh key={i} position={point}>
        <sphereGeometry args={[i % 3 === 0 ? 0.19 : 0.12, 20, 16]} />
        <meshStandardMaterial color={i % 3 === 0 ? colors[0] : colors[1]} metalness={0.3} roughness={0.22} />
      </mesh>)}
      <mesh><icosahedronGeometry args={[0.85, 0]} /><meshStandardMaterial color={colors[1]} metalness={0.5} roughness={0.28} flatShading /></mesh>
    </group>
    <OrbitControls makeDefault enableZoom={false} enablePan={false} autoRotate={rotating} autoRotateSpeed={0.6} />
  </Canvas>;
}