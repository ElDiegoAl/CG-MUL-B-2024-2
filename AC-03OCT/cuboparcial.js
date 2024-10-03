// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

// Cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 3, 5);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Geometría del cubo
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Wireframe para el cubo
const wireframe = new THREE.WireframeGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0077ff });
const cube = new THREE.LineSegments(wireframe, lineMaterial);
scene.add(cube);

// Luz (opcional, no afecta al wireframe pero puede ser útil para futuras adiciones)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Controles de órbita
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Mejora la suavidad del movimiento
controls.dampingFactor = 0.05;

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Animación del cubo (opcional)
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Actualizar controles de órbita
    controls.update();

    // Renderizar la escena
    renderer.render(scene, camera);
}

// Iniciar la animación
animate();

// Ajuste del tamaño de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
