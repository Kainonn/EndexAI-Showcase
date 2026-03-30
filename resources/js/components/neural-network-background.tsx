import {
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';
import * as THREE from 'three';

interface Neuron {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    connections: number[];
    energy: number;
    pulseTime: number;
    depth: number;
}

interface EnergyPulse {
    from: number;
    to: number;
    progress: number;
    speed: number;
    intensity: number;
}

export interface NeuralNetworkRef {
    triggerEnergyWave: () => void;
}

const NeuralNetworkBackground = forwardRef<NeuralNetworkRef>((_, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const neuronsRef = useRef<Neuron[]>([]);
    const pulsesRef = useRef<EnergyPulse[]>([]);
    const neuronMeshesRef = useRef<THREE.Points | null>(null);
    const connectionLinesRef = useRef<THREE.LineSegments | null>(null);
    const pulsePointsRef = useRef<THREE.Points | null>(null);
    const cubeWireframeRef = useRef<THREE.LineSegments | null>(null);
    const animationFrameRef = useRef<number>(0);

    const NEURON_COUNT = 500;
    const MAX_CONNECTION_DISTANCE = 200;
    const PULSE_SPEED = 0.025;
    const BURST_INTERVAL = 4000;
    const CUBE_SIZE = 1400;

    useImperativeHandle(ref, () => ({
        triggerEnergyWave: () => {
            // Trigger massive energy wave across all neurons
            neuronsRef.current.forEach((neuron, idx) => {
                setTimeout(() => {
                    neuron.energy = 1.5;
                    neuron.pulseTime = Date.now();
                    
                    // Create pulses from this neuron
                    neuron.connections.slice(0, 3).forEach((targetIdx) => {
                        pulsesRef.current.push({
                            from: idx,
                            to: targetIdx,
                            progress: 0,
                            speed: PULSE_SPEED * (1.5 + Math.random() * 0.5),
                            intensity: 1.2,
                        });
                    });
                }, idx * 15); // Stagger the wave
            });
        },
    }));

    useEffect(() => {
        if (!containerRef.current) return;

        // Setup Scene
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0a0a0f, 0.0008);
        sceneRef.current = scene;

        // Setup Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            5000,
        );
        camera.position.z = 750;
        cameraRef.current = camera;

        // Setup Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x0a0a0f, 1);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Initialize Neurons within a cube
        const neurons: Neuron[] = [];
        for (let i = 0; i < NEURON_COUNT; i++) {
            const depth = Math.random();
            neurons.push({
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * CUBE_SIZE,
                    (Math.random() - 0.5) * CUBE_SIZE,
                    (Math.random() - 0.5) * CUBE_SIZE,
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.3,
                ),
                connections: [],
                energy: Math.random() * 0.3,
                pulseTime: Date.now() - Math.random() * 2000,
                depth,
            });
        }
        neuronsRef.current = neurons;

        // Create Rotating Cube Wireframe
        const cubeGeometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
        const cubeEdges = new THREE.EdgesGeometry(cubeGeometry);
        const cubeMaterial = new THREE.LineBasicMaterial({
            color: 0x00e5ff,
            transparent: true,
            opacity: 0.15,
            linewidth: 1,
        });
        const cubeWireframe = new THREE.LineSegments(cubeEdges, cubeMaterial);
        scene.add(cubeWireframe);
        cubeWireframeRef.current = cubeWireframe;

        // Create Neuron Geometry
        const neuronGeometry = new THREE.BufferGeometry();
        const neuronPositions = new Float32Array(NEURON_COUNT * 3);
        const neuronColors = new Float32Array(NEURON_COUNT * 3);
        const neuronSizes = new Float32Array(NEURON_COUNT);

        neurons.forEach((neuron, i) => {
            neuronPositions[i * 3] = neuron.position.x;
            neuronPositions[i * 3 + 1] = neuron.position.y;
            neuronPositions[i * 3 + 2] = neuron.position.z;
            
            const color = new THREE.Color(0x00e5ff);
            neuronColors[i * 3] = color.r;
            neuronColors[i * 3 + 1] = color.g;
            neuronColors[i * 3 + 2] = color.b;
            
            neuronSizes[i] = (2 + neuron.depth * 3) * (1 + neuron.energy * 2);
        });

        neuronGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(neuronPositions, 3),
        );
        neuronGeometry.setAttribute(
            'color',
            new THREE.BufferAttribute(neuronColors, 3),
        );
        neuronGeometry.setAttribute(
            'size',
            new THREE.BufferAttribute(neuronSizes, 1),
        );

        const neuronMaterial = new THREE.PointsMaterial({
            size: 4,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            map: createGlowTexture(),
        });

        const neuronMesh = new THREE.Points(neuronGeometry, neuronMaterial);
        scene.add(neuronMesh);
        neuronMeshesRef.current = neuronMesh;

        // Create Connection Lines Geometry
        const lineGeometry = new THREE.BufferGeometry();
        const maxConnections = NEURON_COUNT * 4; // Max 4 connections per neuron
        const linePositions = new Float32Array(maxConnections * 3 * 2);
        const lineColors = new Float32Array(maxConnections * 3 * 2);
        lineGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(linePositions, 3),
        );
        lineGeometry.setAttribute(
            'color',
            new THREE.BufferAttribute(lineColors, 3),
        );

        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
        });

        const connectionLines = new THREE.LineSegments(
            lineGeometry,
            lineMaterial,
        );
        scene.add(connectionLines);
        connectionLinesRef.current = connectionLines;

        // Create Pulse Points
        const pulseGeometry = new THREE.BufferGeometry();
        const maxPulses = 500;
        const pulsePositions = new Float32Array(maxPulses * 3);
        const pulseColors = new Float32Array(maxPulses * 3);
        const pulseSizes = new Float32Array(maxPulses);
        
        pulseGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(pulsePositions, 3),
        );
        pulseGeometry.setAttribute(
            'color',
            new THREE.BufferAttribute(pulseColors, 3),
        );
        pulseGeometry.setAttribute(
            'size',
            new THREE.BufferAttribute(pulseSizes, 1),
        );

        const pulseMaterial = new THREE.PointsMaterial({
            size: 8,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            map: createGlowTexture(),
        });

        const pulsePoints = new THREE.Points(pulseGeometry, pulseMaterial);
        scene.add(pulsePoints);
        pulsePointsRef.current = pulsePoints;

        // Ambient Lights
        const ambientLight = new THREE.AmbientLight(0x2222aa, 0.3);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x00e5ff, 1.5, 2000);
        pointLight1.position.set(400, 400, 400);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x0099ff, 1.2, 2000);
        pointLight2.position.set(-400, -400, 200);
        scene.add(pointLight2);

        // Periodic Burst Activity
        const burstInterval = setInterval(() => {
            const burstOrigin = Math.floor(Math.random() * NEURON_COUNT);
            neuronsRef.current[burstOrigin].energy = 1.0;
            neuronsRef.current[burstOrigin].pulseTime = Date.now();

            // Spread to nearby neurons
            neuronsRef.current[burstOrigin].connections.forEach(
                (connIdx) => {
                    pulsesRef.current.push({
                        from: burstOrigin,
                        to: connIdx,
                        progress: 0,
                        speed: PULSE_SPEED * (1 + Math.random()),
                        intensity: 0.8 + Math.random() * 0.4,
                    });
                },
            );
        }, BURST_INTERVAL);

        // Animation Loop
        function animate() {
            animationFrameRef.current = requestAnimationFrame(animate);

            const time = Date.now();
            const neurons = neuronsRef.current;

            // Rotate the cube
            if (cubeWireframeRef.current) {
                const rotationSpeed = 0.0003;
                cubeWireframeRef.current.rotation.x += rotationSpeed;
                cubeWireframeRef.current.rotation.y += rotationSpeed * 1.5;
                cubeWireframeRef.current.rotation.z += rotationSpeed * 0.5;
            }

            // Update neuron positions and connections
            const cubeLimit = CUBE_SIZE / 2;
            neurons.forEach((neuron, i) => {
                // Floating motion
                neuron.position.add(neuron.velocity);

                // Boundaries - bounce within cube
                ['x', 'y', 'z'].forEach((axis) => {
                    const key = axis as 'x' | 'y' | 'z';
                    if (Math.abs(neuron.position[key]) > cubeLimit) {
                        neuron.position[key] = Math.sign(neuron.position[key]) * cubeLimit;
                        neuron.velocity[key] *= -1;
                    }
                });

                // Energy decay
                neuron.energy = Math.max(0.1, neuron.energy - 0.005);

                // Update connections: only keep 4 closest neurons
                if (time % 100 < 16) {
                    // Calculate distances to all other neurons
                    const distances: { idx: number; dist: number }[] = [];
                    neurons.forEach((other, j) => {
                        if (i !== j) {
                            const dist = neuron.position.distanceTo(other.position);
                            if (dist < MAX_CONNECTION_DISTANCE) {
                                distances.push({ idx: j, dist });
                            }
                        }
                    });

                    // Sort by distance and keep only 4 closest
                    distances.sort((a, b) => a.dist - b.dist);
                    neuron.connections = distances.slice(0, 4).map((d) => d.idx);
                }
            });

            // Update neuron mesh
            if (neuronMeshesRef.current) {
                const positions = neuronMeshesRef.current.geometry.attributes
                    .position.array as Float32Array;
                const colors = neuronMeshesRef.current.geometry.attributes
                    .color.array as Float32Array;
                const sizes = neuronMeshesRef.current.geometry.attributes
                    .size.array as Float32Array;

                neurons.forEach((neuron, i) => {
                    positions[i * 3] = neuron.position.x;
                    positions[i * 3 + 1] = neuron.position.y;
                    positions[i * 3 + 2] = neuron.position.z;

                    const color = new THREE.Color(0x00e5ff);
                    const intensity = 0.5 + neuron.energy * 0.5;
                    color.multiplyScalar(intensity);
                    colors[i * 3] = color.r;
                    colors[i * 3 + 1] = color.g;
                    colors[i * 3 + 2] = color.b;

                    sizes[i] = (2 + neuron.depth * 3) * (1 + neuron.energy * 2);
                });

                neuronMeshesRef.current.geometry.attributes.position.needsUpdate = true;
                neuronMeshesRef.current.geometry.attributes.color.needsUpdate = true;
                neuronMeshesRef.current.geometry.attributes.size.needsUpdate = true;
            }

            // Update connection lines
            if (connectionLinesRef.current) {
                const positions = connectionLinesRef.current.geometry
                    .attributes.position.array as Float32Array;
                const colors = connectionLinesRef.current.geometry.attributes
                    .color.array as Float32Array;

                let lineIndex = 0;
                neurons.forEach((neuron, i) => {
                    neuron.connections.forEach((connIdx) => {
                        if (lineIndex >= positions.length / 6) return;

                        const target = neurons[connIdx];
                        positions[lineIndex * 6] = neuron.position.x;
                        positions[lineIndex * 6 + 1] = neuron.position.y;
                        positions[lineIndex * 6 + 2] = neuron.position.z;
                        positions[lineIndex * 6 + 3] = target.position.x;
                        positions[lineIndex * 6 + 4] = target.position.y;
                        positions[lineIndex * 6 + 5] = target.position.z;

                        const avgEnergy = (neuron.energy + target.energy) / 2;
                        const color = new THREE.Color(0x00e5ff);
                        color.multiplyScalar(0.3 + avgEnergy * 0.7);

                        for (let j = 0; j < 2; j++) {
                            colors[lineIndex * 6 + j * 3] = color.r;
                            colors[lineIndex * 6 + j * 3 + 1] = color.g;
                            colors[lineIndex * 6 + j * 3 + 2] = color.b;
                        }

                        lineIndex++;
                    });
                });

                connectionLinesRef.current.geometry.setDrawRange(0, lineIndex * 2);
                connectionLinesRef.current.geometry.attributes.position.needsUpdate = true;
                connectionLinesRef.current.geometry.attributes.color.needsUpdate = true;
            }

            // Update energy pulses
            const activePulses: EnergyPulse[] = [];
            pulsesRef.current.forEach((pulse) => {
                pulse.progress += pulse.speed;

                if (pulse.progress < 1) {
                    activePulses.push(pulse);

                    // Activate target neuron when pulse arrives
                    if (pulse.progress > 0.95) {
                        const target = neurons[pulse.to];
                        target.energy = Math.min(1.0, target.energy + pulse.intensity * 0.5);
                        target.pulseTime = time;

                        // Chain reaction - create new pulses
                        if (Math.random() < 0.3) {
                            target.connections.slice(0, 2).forEach((nextIdx) => {
                                if (nextIdx !== pulse.from) {
                                    activePulses.push({
                                        from: pulse.to,
                                        to: nextIdx,
                                        progress: 0,
                                        speed: PULSE_SPEED,
                                        intensity: pulse.intensity * 0.7,
                                    });
                                }
                            });
                        }
                    }
                }
            });
            pulsesRef.current = activePulses;

            // Render pulses
            if (pulsePointsRef.current) {
                const positions = pulsePointsRef.current.geometry.attributes
                    .position.array as Float32Array;
                const colors = pulsePointsRef.current.geometry.attributes
                    .color.array as Float32Array;
                const sizes = pulsePointsRef.current.geometry.attributes
                    .size.array as Float32Array;

                activePulses.forEach((pulse, i) => {
                    const from = neurons[pulse.from].position;
                    const to = neurons[pulse.to].position;
                    const pos = from.clone().lerp(to, pulse.progress);

                    positions[i * 3] = pos.x;
                    positions[i * 3 + 1] = pos.y;
                    positions[i * 3 + 2] = pos.z;

                    const color = new THREE.Color(0x00ffff);
                    color.multiplyScalar(pulse.intensity);
                    colors[i * 3] = color.r;
                    colors[i * 3 + 1] = color.g;
                    colors[i * 3 + 2] = color.b;

                    sizes[i] = 8 * pulse.intensity * (1 - Math.abs(pulse.progress - 0.5) * 0.5);
                });

                pulsePointsRef.current.geometry.setDrawRange(0, activePulses.length);
                pulsePointsRef.current.geometry.attributes.position.needsUpdate = true;
                pulsePointsRef.current.geometry.attributes.color.needsUpdate = true;
                pulsePointsRef.current.geometry.attributes.size.needsUpdate = true;
            }

            // Subtle camera movement
            if (cameraRef.current) {
                cameraRef.current.position.x = Math.sin(time * 0.00008) * 100;
                cameraRef.current.position.y = Math.cos(time * 0.00012) * 70;
                cameraRef.current.lookAt(0, 0, 0);
            }

            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        }

        animate();

        // Handle Resize
        function handleResize() {
            if (!cameraRef.current || !rendererRef.current) return;

            cameraRef.current.aspect = window.innerWidth / window.innerHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            clearInterval(burstInterval);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameRef.current);

            if (rendererRef.current && containerRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }

            neuronGeometry.dispose();
            neuronMaterial.dispose();
            lineGeometry.dispose();
            lineMaterial.dispose();
            pulseGeometry.dispose();
            pulseMaterial.dispose();
            cubeGeometry.dispose();
            cubeMaterial.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-0"
            style={{ background: 'linear-gradient(to bottom, #0a0a0f, #050508)' }}
        />
    );
});

NeuralNetworkBackground.displayName = 'NeuralNetworkBackground';

export default NeuralNetworkBackground;

// Helper function to create glow texture for particles
function createGlowTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;

    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(0, 229, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(0, 229, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}
