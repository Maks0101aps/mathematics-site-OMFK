"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Grid, Html, OrbitControls, PresentationControls, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { BufferGeometry, DoubleSide, Float32BufferAttribute } from "three";
import { FigureId, Parameters } from "@/lib/figures";

type Props = {
  figureId: FigureId;
  params: Parameters;
  realLife: boolean;
};

const scale = 0.42;

export function GeometryScene({ figureId, params, realLife }: Props) {
  return (
    <Canvas shadows camera={{ position: [6, 5, 8], fov: 42 }} dpr={[1, 1.8]}>
      <color attach="background" args={["#07111f"]} />
      <fog attach="fog" args={["#07111f", 12, 24]} />
      <ambientLight intensity={0.62} />
      <directionalLight castShadow position={[5, 8, 5]} intensity={2.3} shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-4, 3, -3]} intensity={1.6} color="#22d3ee" />
      <pointLight position={[4, 2, 3]} intensity={1.3} color="#fb923c" />
      <Environment preset="city" />
      <PresentationControls global snap rotation={[0.18, -0.42, 0]} polar={[-0.35, 0.35]} azimuth={[-0.7, 0.7]}>
        <Float speed={1.6} rotationIntensity={0.16} floatIntensity={0.2}>
          <Shape figureId={figureId} params={params} realLife={realLife} />
        </Float>
      </PresentationControls>
      <Grid args={[18, 18]} position={[0, -2.15, 0]} cellColor="#1e3a5f" sectionColor="#22d3ee" fadeDistance={18} fadeStrength={1.5} infiniteGrid />
      <ContactShadows position={[0, -2.05, 0]} opacity={0.55} blur={2.6} scale={10} />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={13} />
    </Canvas>
  );
}

function Shape({ figureId, params, realLife }: Props) {
  if (realLife) return <RealObject figureId={figureId} params={params} />;
  return <GeometricObject figureId={figureId} params={params} />;
}

function GeometricObject({ figureId, params }: Omit<Props, "realLife">) {
  const material = <meshStandardMaterial color="#22d3ee" roughness={0.32} metalness={0.18} emissive="#0e7490" emissiveIntensity={0.08} />;
  switch (figureId) {
    case "cube": {
      const a = params.edge * scale;
      return <mesh castShadow receiveShadow scale={[a, a, a]}>{boxGeometry()}{material}</mesh>;
    }
    case "cuboid":
      return (
        <mesh castShadow receiveShadow scale={[params.length * scale, params.height * scale, params.width * scale]}>
          {boxGeometry()}
          {material}
        </mesh>
      );
    case "sphere":
      return (
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[params.radius * scale, 64, 64]} />
          {material}
        </mesh>
      );
    case "cylinder":
      return (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[params.radius * scale, params.radius * scale, params.height * scale, 64]} />
          {material}
        </mesh>
      );
    case "cone":
      return (
        <mesh castShadow receiveShadow>
          <coneGeometry args={[params.radius * scale, params.height * scale, 64]} />
          {material}
        </mesh>
      );
    case "pyramid":
      return (
        <mesh castShadow receiveShadow>
          <coneGeometry args={[(params.base * scale) / Math.SQRT2, params.height * scale, 4]} />
          {material}
        </mesh>
      );
    case "prism":
      return (
        <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[(params.base * scale) / Math.sqrt(3), (params.base * scale) / Math.sqrt(3), params.height * scale, 3]} />
          {material}
        </mesh>
      );
  }
}

function RealObject({ figureId, params }: Omit<Props, "realLife">) {
  switch (figureId) {
    case "cube":
      return (
        <group>
          <Rubik size={params.edge * scale} />
          <ObjectLabel text="Кубик Рубіка" />
        </group>
      );
    case "cuboid":
      return (
        <group>
          <Brick scaleProps={[params.length * scale, params.height * scale, params.width * scale]} />
          <ObjectLabel text="Цеглина" />
        </group>
      );
    case "sphere":
      return (
        <group>
          <Planet radius={params.radius * scale} />
          <ObjectLabel text="Планета" />
        </group>
      );
    case "cylinder":
      return (
        <group>
          <Can radius={params.radius * scale} height={params.height * scale} />
          <ObjectLabel text="Банка бобів" />
        </group>
      );
    case "cone":
      return (
        <group>
          <TrafficCone radius={params.radius * scale} height={params.height * scale} />
          <ObjectLabel text="Дорожній конус" />
        </group>
      );
    case "pyramid":
      return (
        <group>
          <EgyptPyramid base={params.base * scale} height={params.height * scale} />
          <ObjectLabel text="Єгипетська піраміда" />
        </group>
      );
    case "prism":
      return (
        <group>
          <ChocolatePrism base={params.base * scale} height={params.height * scale} />
          <ObjectLabel text="Шоколадка Toblerone" />
        </group>
      );
  }
}

function ObjectLabel({ text }: { text: string }) {
  return (
    <Html position={[0, -1.95, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
      <div className="whitespace-nowrap rounded-full border border-cyan-200/25 bg-slate-950/80 px-3 py-1.5 text-sm font-semibold text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.22)] backdrop-blur-md">
        {text}
      </div>
    </Html>
  );
}

function boxGeometry() {
  return <boxGeometry args={[1, 1, 1]} />;
}

function Rubik({ size }: { size: number }) {
  const faces = [
    { axis: "x", side: 1, color: "#ef4444" },
    { axis: "x", side: -1, color: "#f97316" },
    { axis: "y", side: 1, color: "#f8fafc" },
    { axis: "y", side: -1, color: "#eab308" },
    { axis: "z", side: 1, color: "#22c55e" },
    { axis: "z", side: -1, color: "#2563eb" },
  ] as const;
  const cells = [-1, 0, 1];
  const cellSize = size * 0.24;
  const gap = size * 0.285;

  return (
    <group>
      <mesh castShadow receiveShadow scale={[size, size, size]}>
        {boxGeometry()}
        <meshStandardMaterial color="#111827" roughness={0.38} />
      </mesh>
      {faces.flatMap((face) =>
        cells.flatMap((a) =>
          cells.map((b) => {
            const key = `${face.axis}-${face.side}-${a}-${b}`;
            return (
              <mesh key={key} position={stickerPosition(face.axis, face.side, a * gap, b * gap, size / 2 + 0.012)} rotation={stickerRotation(face.axis)} scale={[cellSize, cellSize, 0.012]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={face.color} roughness={0.34} metalness={0.04} />
              </mesh>
            );
          }),
        ),
      )}
    </group>
  );
}

function Brick({ scaleProps }: { scaleProps: [number, number, number] }) {
  const [length, height, width] = scaleProps;

  const brickTexture = useTexture("/textures/brick.jpg");
  brickTexture.wrapS = THREE.RepeatWrapping;
  brickTexture.wrapT = THREE.RepeatWrapping;
  brickTexture.colorSpace = THREE.SRGBColorSpace;
  
  return (
    <group rotation={[0.02, -0.08, 0.01]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[length, height, width]} />
        <meshStandardMaterial map={brickTexture} roughness={0.9} metalness={0.02} />
      </mesh>
    </group>
  );
}

function Book({ scaleProps }: { scaleProps: [number, number, number] }) {
  const [length, height, width] = scaleProps;
  return (
    <group>
      <mesh castShadow receiveShadow scale={[length, height, width]}>
        {boxGeometry()}
        <meshStandardMaterial color="#1d4ed8" roughness={0.42} />
      </mesh>
      <mesh position={[0, height / 2 + 0.035, 0]} scale={[length * 0.92, 0.035, width * 0.86]}>
        {boxGeometry()}
        <meshStandardMaterial color="#e0f2fe" roughness={0.7} />
      </mesh>
      <mesh position={[-length * 0.48, 0.02, 0]} scale={[0.055, height * 1.03, width * 1.02]}>
        {boxGeometry()}
        <meshStandardMaterial color="#f97316" roughness={0.48} />
      </mesh>
      <mesh position={[length * 0.42, height / 2 + 0.075, 0]} scale={[0.055, 0.035, width * 0.72]}>
        {boxGeometry()}
        <meshStandardMaterial color="#38bdf8" emissive="#0891b2" emissiveIntensity={0.08} roughness={0.35} />
      </mesh>
      {[-0.22, -0.08, 0.06].map((offset) => (
        <mesh key={offset} position={[offset * length, height / 2 + 0.095, width * 0.2]} scale={[length * 0.18, 0.012, 0.018]}>
          {boxGeometry()}
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
      ))}
      <Text position={[0, height / 2 + 0.095, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={Math.min(0.28, width * 0.22)} color="#0f172a" anchorX="center">
        Геометрія
      </Text>
    </group>
  );
}

function Planet({ radius }: { radius: number }) {
  const earthTexture = useTexture("/textures/earth.jpg");
  earthTexture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial map={earthTexture} roughness={0.7} metalness={0.05} />
      </mesh>
    </group>
  );
}

function Can({ radius, height }: { radius: number; height: number }) {
  const [labelTex, topTex, bottomTex] = useTexture([
    "/textures/beans-label.jpg",
    "/textures/beans-top.jpg",
    "/textures/beans-bottom.jpg",
  ]);
  labelTex.colorSpace = THREE.SRGBColorSpace;
  topTex.colorSpace = THREE.SRGBColorSpace;
  bottomTex.colorSpace = THREE.SRGBColorSpace;

  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 64]} />
        <meshStandardMaterial attach="material-0" map={labelTex} roughness={0.3} metalness={0.4} />
        <meshStandardMaterial attach="material-1" map={topTex} roughness={0.2} metalness={0.6} />
        <meshStandardMaterial attach="material-2" map={bottomTex} roughness={0.2} metalness={0.6} />
      </mesh>
    </group>
  );
}

function TrafficCone({ radius, height }: { radius: number; height: number }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <coneGeometry args={[radius, height, 64]} />
        <meshStandardMaterial color="#f97316" roughness={0.38} />
      </mesh>
      <mesh position={[0, -height / 2 + height * 0.28, 0]}>
        <cylinderGeometry args={[radius * 0.7, radius * 0.78, height * 0.07, 64]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.42} />
      </mesh>
      <mesh position={[0, -height / 2 + height * 0.52, 0]}>
        <cylinderGeometry args={[radius * 0.38, radius * 0.46, height * 0.055, 64]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.42} />
      </mesh>
      <mesh position={[0, -height / 2 - 0.04, 0]} scale={[radius * 1.9, 0.08, radius * 1.9]}>
        {boxGeometry()}
        <meshStandardMaterial color="#111827" roughness={0.5} />
      </mesh>
      <mesh position={[0, height / 2 + 0.03, 0]}>
        <sphereGeometry args={[radius * 0.08, 16, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
    </group>
  );
}

function EgyptPyramid({ base, height }: { base: number; height: number }) {
  const levels = 5;
  return (
    <group>
      <mesh castShadow receiveShadow>
        <coneGeometry args={[base / Math.SQRT2, height, 4]} />
        <meshStandardMaterial color="#d6a85f" roughness={0.72} />
      </mesh>
      {Array.from({ length: levels }).map((_, index) => {
        const y = -height / 2 + (index + 0.5) * (height / levels);
        const width = base * (1 - index / (levels + 1));
        return (
          <mesh key={index} position={[0, y, 0]} rotation={[0, Math.PI / 4, 0]} scale={[width, 0.018, width]}>
            {boxGeometry()}
            <meshStandardMaterial color={index % 2 ? "#c7924c" : "#e0b66b"} roughness={0.86} />
          </mesh>
        );
      })}
      <mesh position={[0, -height / 2 - 0.035, 0]} scale={[base * 1.25, 0.07, base * 1.25]}>
        {boxGeometry()}
        <meshStandardMaterial color="#8b5e34" roughness={0.9} />
      </mesh>
      <Text position={[0, -height / 2 + height * 0.2, base * 0.36]} rotation={[0, 0, 0]} fontSize={0.16} color="#fff7ed" anchorX="center">
        GIZA
      </Text>
    </group>
  );
}

function ChocolatePrism({ base, height }: { base: number; height: number }) {
  const length = Math.max(height * 1.35, base * 2.2);
  const prismHeight = base * 0.76;
  const segmentCount = 7;
  const segmentStep = length / segmentCount;

  return (
    <group rotation={[0.02, 0.66, 0]}>
      <TriangularPrism length={length} base={base} prismHeight={prismHeight} color="#f8c537" />

      <mesh position={[0, -prismHeight * 0.2, base * 0.515]} scale={[length * 0.76, 0.052, base * 0.2]}>
        {boxGeometry()}
        <meshStandardMaterial color="#fef3c7" roughness={0.35} />
      </mesh>
      <Text position={[0, -prismHeight * 0.19, base * 0.555]} fontSize={Math.min(0.32, base * 0.17)} color="#7c2d12" anchorX="center" anchorY="middle">
        TOBLERONE
      </Text>

      {Array.from({ length: segmentCount - 1 }).map((_, index) => (
        <mesh key={index} position={[-length / 2 + segmentStep * (index + 1), -prismHeight * 0.2, base * 0.57]} scale={[0.022, 0.07, base * 0.23]}>
          {boxGeometry()}
          <meshStandardMaterial color="#9a3412" roughness={0.45} />
        </mesh>
      ))}

      <mesh position={[0, prismHeight * 0.47, 0]} scale={[length * 0.72, 0.035, 0.035]}>
        {boxGeometry()}
        <meshStandardMaterial color="#fff7cc" roughness={0.4} />
      </mesh>

      <Text position={[0, prismHeight * 0.57, 0]} fontSize={Math.min(0.2, base * 0.11)} color="#7c2d12" anchorX="center" anchorY="middle">
        трикутна призма
      </Text>
    </group>
  );
}

function TriangularPrism({
  length,
  base,
  prismHeight,
  color,
  position = [0, 0, 0],
  opacity = 1,
}: {
  length: number;
  base: number;
  prismHeight: number;
  color: string;
  position?: [number, number, number];
  opacity?: number;
}) {
  const geometry = useMemo(() => {
    const x1 = -length / 2;
    const x2 = length / 2;
    const yBottom = -prismHeight / 2;
    const yTop = prismHeight / 2;
    const zBack = -base / 2;
    const zFront = base / 2;
    const vertices = [
      x1,
      yBottom,
      zBack,
      x1,
      yBottom,
      zFront,
      x1,
      yTop,
      0,
      x2,
      yBottom,
      zBack,
      x2,
      yBottom,
      zFront,
      x2,
      yTop,
      0,
    ];
    const indices = [
      0,
      2,
      1,
      3,
      4,
      5,
      0,
      1,
      4,
      0,
      4,
      3,
      1,
      2,
      5,
      1,
      5,
      4,
      2,
      0,
      3,
      2,
      3,
      5,
    ];
    const prism = new BufferGeometry();
    prism.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    prism.setIndex(indices);
    prism.computeVertexNormals();
    return prism;
  }, [base, length, prismHeight]);

  return (
    <mesh castShadow receiveShadow geometry={geometry} position={position}>
      <meshStandardMaterial color={color} roughness={0.46} metalness={0.06} transparent={opacity < 1} opacity={opacity} side={DoubleSide} />
    </mesh>
  );
}

function stickerPosition(axis: "x" | "y" | "z", side: 1 | -1, a: number, b: number, value: number): [number, number, number] {
  if (axis === "x") return [side * value, a, b];
  if (axis === "y") return [a, side * value, b];
  return [a, b, side * value];
}

function stickerRotation(axis: "x" | "y" | "z"): [number, number, number] {
  if (axis === "x") return [0, Math.PI / 2, 0];
  if (axis === "y") return [Math.PI / 2, 0, 0];
  return [0, 0, 0];
}
