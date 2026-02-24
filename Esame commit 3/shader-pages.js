// Three.js Shader Background for About with mouse interaction
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('shader-canvas'),
  alpha: false,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Mouse position
const mouse = { x: 0.5, y: 0.5 };

// Camera position - centered to view entire plane
camera.position.set(0, 0, 2.5);
camera.lookAt(0, 0, 0);

// Plane geometry - larger to cover entire screen
const geometry = new THREE.PlaneGeometry(40, 40, 128, 128);

// Custom shader material
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0.0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uAmplitude: { value: 1.0 },
    uFrequency: { value: 5.5 },
    uSpeed: { value: 0.4 },
    uDensity: { value: 2.3 },
    uStrength: { value: 4.0 },
    uColor1: { value: new THREE.Color('#D32F2F') },
    uColor2: { value: new THREE.Color('#d30004') },
    uColor3: { value: new THREE.Color('#D32F2F') },
    uBrightness: { value: 1.1 },
    uReflection: { value: 0.1 }
  },
  vertexShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uAmplitude;
    uniform float uFrequency;
    uniform float uSpeed;
    uniform float uDensity;
    uniform float uStrength;
    
    varying vec2 vUv;
    varying float vElevation;
    varying vec2 vMouse;
    
    void main() {
      vUv = uv;
      vMouse = uMouse;
      
      vec3 pos = position;
      
      // Mouse influence on waves
      float distToMouse = distance(uv, uMouse);
      float mouseInfluence = smoothstep(1.0, 0.0, distToMouse);
      
      // Simple plane wave with mouse interaction
      float wave = sin(pos.x * uFrequency + uTime * uSpeed + uMouse.x * 3.0) * 
                   cos(pos.y * uFrequency * uDensity + uTime * uSpeed + uMouse.y * 3.0) * 
                   uAmplitude;
      
      wave += mouseInfluence * 0.5;
      
      pos.z += wave * uStrength * 0.1;
      vElevation = wave;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uBrightness;
    uniform float uReflection;
    uniform vec2 uMouse;
    
    varying vec2 vUv;
    varying float vElevation;
    varying vec2 vMouse;
    
    void main() {
      // Distance from mouse
      float distToMouse = distance(vUv, vMouse);
      float mouseInfluence = smoothstep(0.8, 0.0, distToMouse);
      
      // Mix colors with mouse influence
      vec3 color = mix(uColor1, uColor2, vUv.x + mouseInfluence * 0.2);
      color = mix(color, uColor3, vUv.y);
      
      // Add elevation influence
      color = mix(color, uColor3, vElevation * 0.5 + 0.5);
      
      // Add mouse glow effect
      color += uColor2 * mouseInfluence * 0.3;
      
      // Apply brightness
      color *= uBrightness;
      
      // Add reflection
      color += vec3(uReflection);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  side: THREE.DoubleSide
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Mouse move listener
window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX / window.innerWidth;
  mouse.y = 1.0 - (event.clientY / window.innerHeight);
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  
  material.uniforms.uTime.value += 0.01;
  material.uniforms.uMouse.value.lerp(new THREE.Vector2(mouse.x, mouse.y), 0.05);
  
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
