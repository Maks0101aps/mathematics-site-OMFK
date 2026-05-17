"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Grid, Html, OrbitControls, Text, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BufferGeometry, DoubleSide, Float32BufferAttribute } from "three";
import { FigureId, Parameters } from "@/lib/figures";

type Props = {
  figureId: FigureId;
  params: Parameters;
  realLife: boolean;
  controlMode?: "camera" | "figure";
  showElements?: boolean;
  hiddenElements?: Set<string>;
};

const scale = 0.42;

export function GeometryScene({ figureId, params, realLife, controlMode = "camera", showElements = false, hiddenElements = new Set() }: Props) {
  const figureMode = controlMode === "figure";
  return (
    <Canvas shadows camera={{ position: [6, 5, 8], fov: 42 }} dpr={[1, 1.8]}>
      <color attach="background" args={["#07111f"]} />
      <fog attach="fog" args={["#07111f", 12, 24]} />
      <ambientLight intensity={0.7} />
      <directionalLight castShadow position={[5, 8, 5]} intensity={1.2} shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-4, 3, -3]} intensity={0.6} color="#22d3ee" />
      <pointLight position={[4, 2, 3]} intensity={0.5} color="#fb923c" />
      <Environment preset="city" environmentIntensity={0.3} />
      <DragRotate enabled={figureMode}>
        <Float speed={1.6} rotationIntensity={0.16} floatIntensity={0.2}>
          {showElements ? (
            <ElementsView figureId={figureId} params={params} hidden={hiddenElements} />
          ) : (
            <Shape figureId={figureId} params={params} realLife={realLife} />
          )}
        </Float>
      </DragRotate>
      <Grid args={[18, 18]} position={[0, -2.15, 0]} cellColor="#1e3a5f" sectionColor="#22d3ee" fadeDistance={18} fadeStrength={1.5} infiniteGrid />
      <ContactShadows position={[0, -2.05, 0]} opacity={0.55} blur={2.6} scale={10} />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={13} enabled={!figureMode} />
    </Canvas>
  );
}

function DragRotate({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null!);
  const dragging = useRef(false);
  const prev = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const spinning = useRef<false | "camera" | "local">(false);
  const spinSpeed = useRef(0);
  const lastAxes = useRef({ right: new THREE.Vector3(1, 0, 0), up: new THREE.Vector3(0, 1, 0) });
  const { gl, camera } = useThree();

  const getCameraAxes = () => {
    const right = new THREE.Vector3();
    const up = new THREE.Vector3();
    camera.matrixWorld.extractBasis(right, up, new THREE.Vector3());
    return { right: right.normalize(), up: up.normalize() };
  };

  useEffect(() => {
    const dom = gl.domElement;
    const onDown = (e: PointerEvent) => {
      if (!enabled) return;
      dragging.current = true;
      spinning.current = false;
      spinSpeed.current = 0;
      velocity.current = { x: 0, y: 0 };
      prev.current = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current || !enabled || !groupRef.current) return;
      const dx = (e.clientX - prev.current.x) * 0.01;
      const dy = (e.clientY - prev.current.y) * 0.01;
      prev.current = { x: e.clientX, y: e.clientY };
      velocity.current = { x: dx, y: dy };
      const { right, up } = getCameraAxes();
      lastAxes.current = { right, up };
      const qx = new THREE.Quaternion().setFromAxisAngle(up, dx);
      const qy = new THREE.Quaternion().setFromAxisAngle(right, dy);
      groupRef.current.quaternion.premultiply(qx).premultiply(qy);
    };
    const onUp = () => { dragging.current = false; };

    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "q" || e.key === "Q" || e.key === "й" || e.key === "Й") {
        if (spinning.current === "camera") { spinning.current = false; spinSpeed.current = 0; }
        else { spinning.current = "camera"; spinSpeed.current = 0.04; }
      }
      if (e.key === "e" || e.key === "E" || e.key === "у" || e.key === "У") {
        if (spinning.current === "local") { spinSpeed.current += 0.02; }
        else { spinning.current = "local"; spinSpeed.current = 0.03; }
      }
    };

    dom.addEventListener("pointerdown", onDown);
    dom.addEventListener("pointermove", onMove);
    dom.addEventListener("pointerup", onUp);
    document.addEventListener("keydown", onKey);
    return () => {
      dom.removeEventListener("pointerdown", onDown);
      dom.removeEventListener("pointermove", onMove);
      dom.removeEventListener("pointerup", onUp);
      document.removeEventListener("keydown", onKey);
    };
  }, [enabled, gl, camera]);

  useFrame(() => {
    if (!groupRef.current) return;

    if (spinning.current === "camera") {
      const { up } = getCameraAxes();
      const q = new THREE.Quaternion().setFromAxisAngle(up, spinSpeed.current);
      groupRef.current.quaternion.premultiply(q);
      return;
    }
    if (spinning.current === "local") {
      const localY = new THREE.Vector3(0, 1, 0).applyQuaternion(groupRef.current.quaternion).normalize();
      const q = new THREE.Quaternion().setFromAxisAngle(localY, spinSpeed.current);
      groupRef.current.quaternion.premultiply(q);
      spinSpeed.current *= 0.995;
      if (Math.abs(spinSpeed.current) < 0.001) { spinning.current = false; spinSpeed.current = 0; }
      return;
    }

    if (dragging.current || !enabled) return;
    const v = velocity.current;
    if (Math.abs(v.x) < 0.0001 && Math.abs(v.y) < 0.0001) return;
    const { right, up } = lastAxes.current;
    const qx = new THREE.Quaternion().setFromAxisAngle(up, v.x);
    const qy = new THREE.Quaternion().setFromAxisAngle(right, v.y);
    groupRef.current.quaternion.premultiply(qx).premultiply(qy);
    v.x *= 0.95;
    v.y *= 0.95;
  });

  return <group ref={groupRef}>{children}</group>;
}

function Annotation({ from, to, label, color = "#fb923c" }: { from: [number, number, number]; to: [number, number, number]; label: string; color?: string }) {
  const mid: [number, number, number] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2];
  // compute an offset direction perpendicular-ish to the line for the leader
  const dir = useMemo(() => {
    const d = new THREE.Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
    const up = new THREE.Vector3(0, 1, 0);
    const perp = new THREE.Vector3().crossVectors(d, up).normalize();
    if (perp.length() < 0.01) perp.set(1, 0, 0);
    return perp.multiplyScalar(0.45).add(new THREE.Vector3(0, 0.25, 0));
  }, [from, to]);
  const labelPos: [number, number, number] = [mid[0] + dir.x, mid[1] + dir.y, mid[2] + dir.z];
  const mainLine = useMemo(() => new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...from), new THREE.Vector3(...to)]), [from, to]);
  const leaderLine = useMemo(() => new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...mid), new THREE.Vector3(...labelPos)]), [mid, labelPos]);
  return (
    <group>
      <line>
        <primitive object={mainLine} attach="geometry" />
        <lineBasicMaterial color={color} linewidth={2} />
      </line>
      <line>
        <primitive object={leaderLine} attach="geometry" />
        <lineBasicMaterial color={color} linewidth={1} transparent opacity={0.5} />
      </line>
      <mesh position={to}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={from}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={mid}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Html position={labelPos} center distanceFactor={8}>
        <div style={{ background: "rgba(0,0,0,0.75)", color, padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", border: `1px solid ${color}` }}>
          {label}
        </div>
      </Html>
    </group>
  );
}

function FaceLabel({ position, label, offset = [0.4, 0.3, 0] }: { position: [number, number, number]; label: string; offset?: [number, number, number] }) {
  const target: [number, number, number] = [position[0] + offset[0], position[1] + offset[1], position[2] + offset[2]];
  const points = useMemo(() => [new THREE.Vector3(...position), new THREE.Vector3(...target)], [position, target]);
  const lineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <group>
      <line>
        <primitive object={lineGeo} attach="geometry" />
        <lineBasicMaterial color="#64748b" linewidth={1} />
      </line>
      <mesh position={position}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#94a3b8" />
      </mesh>
      <Html position={target} center distanceFactor={8}>
        <div style={{ background: "rgba(0,0,0,0.75)", color: "#cbd5e1", padding: "2px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500, whiteSpace: "nowrap", border: "1px solid rgba(148,163,184,0.3)", pointerEvents: "none" }}>
          {label}
        </div>
      </Html>
    </group>
  );
}

function ElementsView({ figureId, params, hidden }: { figureId: FigureId; params: Parameters; hidden: Set<string> }) {
  const show = (key: string) => !hidden.has(key);

  switch (figureId) {
    case "cube": {
      const a = params.edge * scale;
      const h = a / 2;
      return (
        <group>
          <mesh scale={[a, a, a]}>
            {boxGeometry()}
            <meshStandardMaterial color="#22d3ee" wireframe opacity={0.4} transparent />
          </mesh>
          {show("a") && <Annotation from={[-h, -h, h]} to={[h, -h, h]} label="Ребро" />}
          {show("a") && <Annotation from={[h, -h, h]} to={[h, h, h]} label="Ребро" color="#22d3ee" />}
          {show("D") && <Annotation from={[-h, -h, h]} to={[h, h, -h]} label="Діагональ куба" color="#a78bfa" />}
          {show("d") && <Annotation from={[-h, -h, h]} to={[h, -h, -h]} label="Діагональ грані" color="#fbbf24" />}
          {show("face-top") && <FaceLabel position={[0, h, 0]} label="Верхня грань" offset={[0.5, 0.4, 0]} />}
          {show("face-bottom") && <FaceLabel position={[0, -h, 0]} label="Нижня грань" offset={[0.5, -0.4, 0]} />}
          {show("face-front") && <FaceLabel position={[0, 0, h]} label="Передня грань" offset={[0.5, 0.3, 0.3]} />}
          {show("face-side") && <FaceLabel position={[h, 0, 0]} label="Бічна грань" offset={[0.4, 0.3, 0]} />}
        </group>
      );
    }
    case "cuboid": {
      const lx = params.length * scale;
      const ly = params.height * scale;
      const lz = params.width * scale;
      const hx = lx / 2, hy = ly / 2, hz = lz / 2;
      return (
        <group>
          <mesh scale={[lx, ly, lz]}>
            {boxGeometry()}
            <meshStandardMaterial color="#22d3ee" wireframe opacity={0.4} transparent />
          </mesh>
          {show("edge") && <Annotation from={[-hx, -hy, hz]} to={[hx, -hy, hz]} label="Ребро" />}
          {show("D") && <Annotation from={[-hx, -hy, hz]} to={[hx, hy, -hz]} label="Діагональ паралелепіпеда" color="#fbbf24" />}
          {show("d") && <Annotation from={[-hx, -hy, hz]} to={[hx, -hy, -hz]} label="Діагональ грані" color="#a78bfa" />}
          {show("face-side") && <FaceLabel position={[hx, 0, -hz * 0.5]} label="Грань" offset={[0.4, 0.3, -0.2]} />}
        </group>
      );
    }
    case "sphere": {
      const r = params.radius * scale;
      return (
        <group>
          <mesh>
            <sphereGeometry args={[r, 32, 16]} />
            <meshStandardMaterial color="#22d3ee" wireframe opacity={0.3} transparent />
          </mesh>
          {show("r") && <Annotation from={[0, 0, 0]} to={[r, 0, 0]} label="Радіус" />}
          {show("D") && <Annotation from={[-r, 0, 0]} to={[r, 0, 0]} label="Діаметр" color="#a78bfa" />}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#fff" />
          </mesh>
          {show("face-surface") && <FaceLabel position={[0, r, 0]} label="Поверхня" offset={[0.5, 0.4, 0]} />}
        </group>
      );
    }
    case "cylinder": {
      const r = params.radius * scale;
      const h = params.height * scale;
      return (
        <group>
          <mesh>
            <cylinderGeometry args={[r, r, h, 32]} />
            <meshStandardMaterial color="#22d3ee" wireframe opacity={0.3} transparent />
          </mesh>
          {show("h") && <Annotation from={[0, -h / 2, 0]} to={[0, h / 2, 0]} label="Висота" color="#a78bfa" />}
          {show("r") && <Annotation from={[0, h / 2, 0]} to={[r, h / 2, 0]} label="Радіус" />}
          {show("l") && <Annotation from={[r, -h / 2, 0]} to={[r, h / 2, 0]} label="Твірна" color="#fbbf24" />}
          {show("face-base") && <FaceLabel position={[0, h / 2, 0]} label="Основа" offset={[0.5, 0.4, 0]} />}
          {show("face-base") && <FaceLabel position={[0, -h / 2, 0]} label="Основа" offset={[0.5, -0.4, 0]} />}
          {show("face-side") && <FaceLabel position={[-r, 0, 0]} label="Бічна поверхня" offset={[-0.4, 0.3, 0]} />}
        </group>
      );
    }
    case "cone": {
      const r = params.radius * scale;
      const h = params.height * scale;
      const l = Math.sqrt(r * r + h * h);
      return (
        <group>
          <mesh>
            <coneGeometry args={[r, h, 32]} />
            <meshStandardMaterial color="#22d3ee" wireframe opacity={0.3} transparent />
          </mesh>
          {show("h") && <Annotation from={[0, -h / 2, 0]} to={[0, h / 2, 0]} label="Висота" color="#a78bfa" />}
          {show("r") && <Annotation from={[0, -h / 2, 0]} to={[r, -h / 2, 0]} label="Радіус" />}
          {show("l") && <Annotation from={[0, h / 2, 0]} to={[r, -h / 2, 0]} label="Твірна" color="#fbbf24" />}
          {show("face-apex") && <FaceLabel position={[0, h / 2, 0]} label="Вершина" offset={[0.5, 0.4, 0]} />}
          {show("face-base") && <FaceLabel position={[0, -h / 2, 0]} label="Основа" offset={[0.5, -0.4, 0]} />}
          {show("face-side") && <FaceLabel position={[r * 0.5, 0, 0]} label="Бічна поверхня" offset={[0.5, 0.3, 0]} />}
        </group>
      );
    }
    case "pyramid": {
      const n = params.sides ?? 4;
      const a = params.base * scale;
      const h = params.height * scale;
      const R = a / (2 * Math.sin(Math.PI / n));
      const ri = a / (2 * Math.tan(Math.PI / n));
      const angle0 = Math.PI / 2 + Math.PI / n;
      const v0: [number, number, number] = [R * Math.cos(angle0), -h / 2, R * Math.sin(angle0)];
      const angle1 = angle0 - 2 * Math.PI / n;
      const v1: [number, number, number] = [R * Math.cos(angle1), -h / 2, R * Math.sin(angle1)];
      const midX = (v0[0] + v1[0]) / 2;
      const midZ = (v0[2] + v1[2]) / 2;
      return (
        <group>
          <mesh>
            <coneGeometry args={[R, h, n]} />
            <meshStandardMaterial color="#22d3ee" wireframe opacity={0.3} transparent />
          </mesh>
          {show("a") && <Annotation from={v0} to={v1} label="Сторона основи" />}
          {show("h") && <Annotation from={[0, -h / 2, 0]} to={[0, h / 2, 0]} label="Висота" color="#a78bfa" />}
          {show("l") && <Annotation from={[0, h / 2, 0]} to={[midX, -h / 2, midZ]} label="Апофема" color="#fbbf24" />}
          {show("b") && <Annotation from={[0, h / 2, 0]} to={v1} label="Бокове ребро" color="#38bdf8" />}
          {show("R") && <Annotation from={[0, -h / 2, 0]} to={v0} label="Радіус описаного кола" color="#f472b6" />}
          {show("r") && <Annotation from={[0, -h / 2, 0]} to={[midX, -h / 2, midZ]} label="Радіус вписаного кола" color="#4ade80" />}
          {show("face-apex") && <FaceLabel position={[0, h / 2, 0]} label="Вершина" offset={[0.5, 0.4, 0]} />}
          {show("face-base") && <FaceLabel position={[0, -h / 2, 0]} label="Основа" offset={[0.5, -0.4, 0]} />}
          {show("face-side") && <FaceLabel position={[R * 0.5, 0, R * 0.5]} label="Бічна грань" offset={[0.4, 0.3, 0.4]} />}
        </group>
      );
    }
    case "prism": {
      const a = params.base * scale;
      const h = params.height * scale;
      return (
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[a / Math.sqrt(3), a / Math.sqrt(3), h, 3]} />
            <meshStandardMaterial color="#22d3ee" wireframe opacity={0.3} transparent />
          </mesh>
          {show("h") && <Annotation from={[0, -h / 2, 0]} to={[0, h / 2, 0]} label="Висота" color="#a78bfa" />}
          {show("a") && <Annotation from={[0, -h / 2, -a / Math.sqrt(3)]} to={[0, -h / 2, a / (2 * Math.sqrt(3))]} label="Сторона основи" />}
          {show("face-base") && <FaceLabel position={[0, h / 2, 0]} label="Основа" offset={[0.5, 0.4, 0]} />}
          {show("face-base") && <FaceLabel position={[0, -h / 2, 0]} label="Основа" offset={[0.5, -0.4, 0]} />}
          {show("face-side") && <FaceLabel position={[0, 0, a / Math.sqrt(3)]} label="Бічна грань" offset={[0.4, 0.3, 0.3]} />}
        </group>
      );
    }
  }
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
    case "pyramid": {
      const n = params.sides ?? 4;
      const R = (params.base * scale) / (2 * Math.sin(Math.PI / n));
      return (
        <mesh castShadow receiveShadow>
          <coneGeometry args={[R, params.height * scale, n]} />
          {material}
        </mesh>
      );
    }
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
  const [texRight, texLeft, texTop, texBottom, texFront, texBack] = useTexture([
    "/textures/rubik-right.jpg",
    "/textures/rubik-left.jpg",
    "/textures/rubik-top.jpg",
    "/textures/rubik-bottom.jpg",
    "/textures/rubik-front.jpg",
    "/textures/rubik-back.jpg",
  ]);
  [texRight, texLeft, texTop, texBottom, texFront, texBack].forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
  });

  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial attach="material-0" map={texRight} roughness={0.34} metalness={0.04} />
      <meshStandardMaterial attach="material-1" map={texLeft} roughness={0.34} metalness={0.04} />
      <meshStandardMaterial attach="material-2" map={texTop} roughness={0.34} metalness={0.04} />
      <meshStandardMaterial attach="material-3" map={texBottom} roughness={0.34} metalness={0.04} />
      <meshStandardMaterial attach="material-4" map={texFront} roughness={0.34} metalness={0.04} />
      <meshStandardMaterial attach="material-5" map={texBack} roughness={0.34} metalness={0.04} />
    </mesh>
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
  const [sideTex, bottomTex] = useTexture([
    "/textures/cone-side.jpg",
    "/textures/cone-bottom.jpg",
  ]);
  sideTex.colorSpace = THREE.SRGBColorSpace;
  bottomTex.colorSpace = THREE.SRGBColorSpace;

  return (
    <group>
      <mesh castShadow receiveShadow>
        <coneGeometry args={[radius, height, 64, 1, true]} />
        <meshStandardMaterial map={sideTex} roughness={0.38} metalness={0.04} side={DoubleSide} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial map={bottomTex} roughness={0.38} metalness={0.04} side={DoubleSide} />
      </mesh>
    </group>
  );
}

function EgyptPyramid({ base, height }: { base: number; height: number }) {
  const pyramidTex = useTexture("/textures/pyramid.jpg");
  pyramidTex.wrapS = THREE.RepeatWrapping;
  pyramidTex.wrapT = THREE.RepeatWrapping;
  pyramidTex.colorSpace = THREE.SRGBColorSpace;

  return (
    <group>
      <mesh castShadow receiveShadow rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[base / Math.SQRT2, height, 4]} />
        <meshStandardMaterial map={pyramidTex} roughness={0.82} metalness={0.02} side={DoubleSide} />
      </mesh>
    </group>
  );
}

function ChocolatePrism({ base, height }: { base: number; height: number }) {
  const length = Math.max(height * 1.35, base * 2.2);
  const prismHeight = base * 0.76;

  const [sideTex, baseTex] = useTexture([
    "/textures/prism-side.jpg",
    "/textures/prism-base.jpg",
  ]);
  sideTex.wrapS = THREE.RepeatWrapping;
  sideTex.wrapT = THREE.RepeatWrapping;
  sideTex.colorSpace = THREE.SRGBColorSpace;
  baseTex.colorSpace = THREE.SRGBColorSpace;

  const geometry = useMemo(() => {
    const x1 = -length / 2;
    const x2 = length / 2;
    const yBottom = -prismHeight / 2;
    const yTop = prismHeight / 2;
    const zBack = -base / 2;
    const zFront = base / 2;

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    let idx = 0;

    const addQuad = (
      p0: number[], p1: number[], p2: number[], p3: number[], n: number[]
    ) => {
      positions.push(...p0, ...p1, ...p2, ...p3);
      normals.push(...n, ...n, ...n, ...n);
      uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
      indices.push(idx, idx + 1, idx + 2, idx, idx + 2, idx + 3);
      idx += 4;
    };

    const addTri = (p0: number[], p1: number[], p2: number[], n: number[]) => {
      positions.push(...p0, ...p1, ...p2);
      normals.push(...n, ...n, ...n);
      uvs.push(0, 0, 1, 0, 0.5, 1);
      indices.push(idx, idx + 1, idx + 2);
      idx += 3;
    };

    // Bottom face (quad)
    addQuad(
      [x1, yBottom, zFront], [x2, yBottom, zFront],
      [x2, yBottom, zBack], [x1, yBottom, zBack],
      [0, -1, 0]
    );
    // Front face (quad)
    const nFront = [0, base / 2, prismHeight / 2];
    const nfLen = Math.hypot(nFront[1], nFront[2]);
    addQuad(
      [x1, yBottom, zFront], [x2, yBottom, zFront],
      [x2, yTop, 0], [x1, yTop, 0],
      [0, nFront[1] / nfLen, nFront[2] / nfLen]
    );
    // Back face (quad)
    addQuad(
      [x2, yBottom, zBack], [x1, yBottom, zBack],
      [x1, yTop, 0], [x2, yTop, 0],
      [0, nFront[1] / nfLen, -nFront[2] / nfLen]
    );
    // Left triangle
    addTri(
      [x1, yBottom, zBack], [x1, yBottom, zFront], [x1, yTop, 0],
      [-1, 0, 0]
    );
    // Right triangle
    addTri(
      [x2, yBottom, zFront], [x2, yBottom, zBack], [x2, yTop, 0],
      [1, 0, 0]
    );

    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geo.setAttribute("normal", new Float32BufferAttribute(normals, 3));
    geo.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    // Groups: 0=bottom(quad,6idx), 1=front(quad,6idx), 2=back(quad,6idx), 3=left tri(3idx), 4=right tri(3idx)
    geo.addGroup(0, 6, 0);   // bottom - side texture
    geo.addGroup(6, 6, 0);   // front - side texture
    geo.addGroup(12, 6, 0);  // back - side texture
    geo.addGroup(18, 3, 1);  // left triangle - base texture
    geo.addGroup(21, 3, 1);  // right triangle - base texture
    return geo;
  }, [base, length, prismHeight]);

  return (
    <group rotation={[0, 0.66, 0]}>
      <mesh castShadow receiveShadow geometry={geometry}>
        <meshStandardMaterial attach="material-0" map={sideTex} roughness={0.46} metalness={0.06} side={DoubleSide} />
        <meshStandardMaterial attach="material-1" map={baseTex} roughness={0.46} metalness={0.06} side={DoubleSide} />
      </mesh>
    </group>
  );
}

