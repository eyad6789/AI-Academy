
// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero animation
gsap.from("h1", {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: "power4.out"
});

gsap.from("p", {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: "power4.out"
});

gsap.from("button", {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.4,
    stagger: 0.1,
    ease: "power4.out"
});

// Floating cards animation
gsap.utils.toArray(".floating-card").forEach((card, i) => {
    gsap.from(card, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        }
    });
});

// Three.js Background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 3000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Gradient material for particles
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x667eea,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create floating geometries
const geometries = [];
const materials = [
    new THREE.MeshBasicMaterial({ color: 0x667eea, wireframe: true, transparent: true, opacity: 0.3 }),
    new THREE.MeshBasicMaterial({ color: 0x764ba2, wireframe: true, transparent: true, opacity: 0.3 }),
    new THREE.MeshBasicMaterial({ color: 0xf093fb, wireframe: true, transparent: true, opacity: 0.3 })
];

// Add some floating shapes
for(let i = 0; i < 5; i++) {
    const geometry = new THREE.IcosahedronGeometry(0.5, 0);
    const material = materials[i % materials.length];
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.x = (Math.random() - 0.5) * 8;
    mesh.position.y = (Math.random() - 0.5) * 8;
    mesh.position.z = (Math.random() - 0.5) * 8;
    
    scene.add(mesh);
    geometries.push(mesh);
}

camera.position.z = 5;

// Mouse movement effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0005;
    
    // Animate floating shapes
    geometries.forEach((mesh, i) => {
        mesh.rotation.x += 0.01 * (i + 1) * 0.2;
        mesh.rotation.y += 0.01 * (i + 1) * 0.2;
        mesh.position.y = Math.sin(Date.now() * 0.001 + i) * 0.5;
    });
    
    // Mouse parallax
    camera.position.x = mouseX * 0.5;
    camera.position.y = mouseY * 0.5;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.6s ease-out';
    observer.observe(section);
});