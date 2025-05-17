document.addEventListener('DOMContentLoaded', function() {
    // ========== TYPING ANIMATION ==========
    class TypeWriter {
        constructor(element, words, wait = 3000) {
            this.element = element;
            this.words = words;
            this.txt = '';
            this.wordIndex = 0;
            this.wait = parseInt(wait, 10);
            this.type();
            this.isDeleting = false;
        }

        type() {
            const current = this.wordIndex % this.words.length;
            const fullTxt = this.words[current];

            if(this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            this.element.textContent = this.txt;

            let typeSpeed = 100;

            if(this.isDeleting) {
                typeSpeed /= 2;
            }

            if(!this.isDeleting && this.txt === fullTxt) {
                typeSpeed = this.wait;
                this.isDeleting = true;
            } else if(this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.wordIndex++;
                typeSpeed = 500;
            }

            setTimeout(() => this.type(), typeSpeed);
        }
    }

    // Initialize typing animation
    const typingElement = document.querySelector('.typing-text');
    if(typingElement) {
        const words = JSON.parse(typingElement.getAttribute('data-words'));
        new TypeWriter(typingElement, words);
    }

    // ========== COUNTER ANIMATION ==========
    const counters = document.querySelectorAll('.number');
    const speed = 200;

    function animateCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const increment = target / speed;

            if(count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target;
            }
        });
    }

    // Start counters when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter.parentElement);
    });

    // ========== 3D CYBER SPACE BACKGROUND ==========
    function initCyberSpace() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.querySelector('.cyber-space').appendChild(renderer.domElement);
        
        // Add particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500;
        
        const posArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            particlesMesh.rotation.x += 0.0005;
            particlesMesh.rotation.y += 0.0005;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Resize handler
        function handleResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
        
        window.addEventListener('resize', handleResize);
        
        // Cleanup function
        return function() {
            window.removeEventListener('resize', handleResize);
            document.querySelector('.cyber-space').removeChild(renderer.domElement);
        };
    }
    
    // Initialize 3D background only on desktop
    let cleanupCyberSpace;
    if(window.innerWidth > 768 && typeof THREE !== 'undefined') {
        cleanupCyberSpace = initCyberSpace();
    }

    // ========== MOBILE NAVIGATION ==========
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const dropdownToggles = document.querySelectorAll('.dropdown > a');
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // Toggle body scroll
            if (mainNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
            
            // Close all dropdowns when main menu is closed
            if (!mainNav.classList.contains('active')) {
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                    if (dropdownMenu) dropdownMenu.style.display = 'none';
                });
            }
        });
    }
    
    // Mobile dropdown toggle
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                const dropdown = this.parentElement;
                const dropdownMenu = this.nextElementSibling;
                
                // Close other dropdowns
                document.querySelectorAll('.dropdown').forEach(item => {
                    if (item !== dropdown) {
                        item.classList.remove('active');
                        const otherMenu = item.querySelector('.dropdown-menu');
                        if (otherMenu) otherMenu.style.display = 'none';
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
                if (dropdownMenu) {
                    if (dropdown.classList.contains('active')) {
                        dropdownMenu.style.display = 'block';
                    } else {
                        dropdownMenu.style.display = 'none';
                    }
                }
            }
        });
    });
    
    // Close menu when clicking on nav links (except dropdown toggles)
    document.querySelectorAll('.main-nav a:not(.dropdown > a)').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !e.target.closest('.main-nav') && 
            !e.target.closest('.menu-toggle')) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
            
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                if (dropdownMenu) dropdownMenu.style.display = 'none';
            });
        }
    });
    
    // Reset on window resize
    function handleWindowResize() {
        if (window.innerWidth > 768) {
            // Reset mobile menu
            if (menuToggle) menuToggle.classList.remove('active');
            if (mainNav) mainNav.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                if (dropdownMenu) dropdownMenu.style.display = '';
            });
            
            // Initialize 3D background if not already present
            if (typeof THREE !== 'undefined' && !document.querySelector('.cyber-space canvas')) {
                cleanupCyberSpace = initCyberSpace();
            }
        } else {
            // Cleanup 3D background on mobile
            if (cleanupCyberSpace) {
                cleanupCyberSpace();
                cleanupCyberSpace = null;
            }
        }
    }
    
    window.addEventListener('resize', handleWindowResize);
    
    // ========== SMOOTH SCROLLING ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});