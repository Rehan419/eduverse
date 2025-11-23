document.addEventListener('DOMContentLoaded', () => {

    // 1. ScrollReveal Setup
    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal('.hero-content', { delay: 400, distance: '50px', origin: 'left', easing: 'ease-in-out' });
        ScrollReveal().reveal('.feature-card', { delay: 300, distance: '30px', origin: 'bottom', interval: 150, easing: 'cubic-bezier(0.5, 0, 0, 1)' });
        ScrollReveal().reveal('.features-section h2', { delay: 200, distance: '20px', origin: 'top' });
        
        // NEW: Add ScrollReveal for the Contact Us section
        ScrollReveal().reveal('.contact-us-section h2, .contact-subtitle', { delay: 200, distance: '20px', origin: 'top' });
        ScrollReveal().reveal('.contact-form, .contact-info-card', { delay: 300, distance: '50px', origin: 'bottom', interval: 100 });
    }

    // 2. Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 3. Simple CTA button handling
    const ctaButtons = document.querySelectorAll('.nav-cta, .btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Initiating Free Demo Enrollment! (In a live site, this would open a sign-up modal)');
        });
    });

    // --- 4. Three.js 3D VR Headset Integration ---
    const container = document.getElementById('three-js-canvas');
    if (container) {
        let scene, camera, renderer, vrModel;
        const clock = new THREE.Clock();

        function initThreeJS() {
            scene = new THREE.Scene();

            // Camera setup
            camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.set(0, 0, 3);

            // Renderer setup
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            // Lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            scene.add(ambientLight);

            const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight1.position.set(2, 3, 2).normalize();
            scene.add(directionalLight1);

            const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight2.position.set(-2, -3, -2).normalize();
            scene.add(directionalLight2);

            const pointLightPink = new THREE.PointLight(0xFF0077, 1.5, 5); // Pink neon light
            pointLightPink.position.set(1.5, 1.5, 1.5);
            scene.add(pointLightPink);

            const pointLightCyan = new THREE.PointLight(0x00FFFF, 1.5, 5); // Cyan neon light
            pointLightCyan.position.set(-1.5, -1.5, 1.5);
            scene.add(pointLightCyan);

            // --- VR Headset Geometry with Custom Image Texture ---
            const geometry = new THREE.BoxGeometry(1.5, 1, 1); // Base box for VR headset
            const loader = new THREE.TextureLoader();

            // Load your custom image here!
            const vrTexture = loader.load('images/vr-headset-custom.png',
                // Success callback
                function (texture) {
                    console.log('Image texture loaded successfully!');
                },
                // Progress callback (optional)
                undefined,
                // Error callback
                function (err) {
                    console.error('An error happened loading the texture:', err);
                    // Fallback to a plain material if image fails to load
                    vrModel.material = new THREE.MeshStandardMaterial({
                        color: 0x8A2BE2, // Primary purple color
                        metalness: 0.6,
                        roughness: 0.4
                    });
                }
            );

            const material = new THREE.MeshStandardMaterial({
                map: vrTexture, // Apply the loaded texture
                metalness: 0.6,
                roughness: 0.4
            });

            vrModel = new THREE.Mesh(geometry, material);

            // Glowing edges
            const edgeGeometry = new THREE.EdgesGeometry(geometry);
            const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x00FFFF, linewidth: 2 }); // Cyan glowing edges
            const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);

            // Grouping VR headset + edges
            const vrGroup = new THREE.Group();
            vrGroup.add(vrModel);
            vrGroup.add(edges);

            vrModel = vrGroup;
            scene.add(vrModel);
            console.log('VR Headset with image created successfully!');
        }

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();

            // Continuous rotation + wobble
            if (vrModel) {
                vrModel.rotation.y += 0.005;
                vrModel.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
            }

            renderer.render(scene, camera);
        }

        // Responsive resize
        function onWindowResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        // Mouse parallax
        let mouseX = 0, mouseY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX) / 100;
            mouseY = (event.clientY - windowHalfY) / 100;
        });

        function updateModelRotation() {
            if (vrModel) {
                // Apply a portion of mouseX/Y movement to rotation, blending with existing wobble
                vrModel.rotation.x += (mouseY * 0.05 - (vrModel.rotation.x - Math.sin(clock.getElapsedTime() * 0.5) * 0.1)) * 0.05;
                vrModel.rotation.y += (mouseX * 0.05 - (vrModel.rotation.y % (2 * Math.PI))) * 0.05;
            }
        }

        const originalAnimate = animate;
        animate = function() {
            originalAnimate();
            updateModelRotation();
        }

        window.addEventListener('resize', onWindowResize);

        // Initialize
        initThreeJS();
        animate();
    }
});