import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';


const AIAcademyLanding = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const geometriesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Handle scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Initialize Three.js
    const initThree = () => {
      if (!canvasRef.current) return;

      // Scene setup
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.0008);
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 30;
      camera.position.y = 5;
      cameraRef.current = camera;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      canvasRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0x667eea, 2, 100);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);

      const pointLight2 = new THREE.PointLight(0xf093fb, 2, 100);
      pointLight2.position.set(-10, -10, -10);
      scene.add(pointLight2);

      // Create enhanced particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 5000;
      const posArray = new Float32Array(particlesCount * 3);
      const colors = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i += 3) {
        // Position
        posArray[i] = (Math.random() - 0.5) * 100;
        posArray[i + 1] = (Math.random() - 0.5) * 100;
        posArray[i + 2] = (Math.random() - 0.5) * 100;
        
        // Color (purple to pink gradient)
        const mixValue = Math.random();
        colors[i] = 0.4 + mixValue * 0.3; // R
        colors[i + 1] = 0.3 + mixValue * 0.2; // G
        colors[i + 2] = 0.9; // B
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);
      particlesRef.current = particlesMesh;

      // Create floating geometries with better visibility
      const geometryTypes = [
        new THREE.TetrahedronGeometry(3, 0),
        new THREE.OctahedronGeometry(3, 0),
        new THREE.IcosahedronGeometry(3, 0),
        new THREE.BoxGeometry(4, 4, 4),
        new THREE.DodecahedronGeometry(3, 0)
      ];

      const materials = [
        new THREE.MeshPhongMaterial({ 
          color: 0x667eea, 
          wireframe: true, 
          transparent: true, 
          opacity: 0.6,
          emissive: 0x667eea,
          emissiveIntensity: 0.2
        }),
        new THREE.MeshPhongMaterial({ 
          color: 0x764ba2, 
          wireframe: true, 
          transparent: true, 
          opacity: 0.6,
          emissive: 0x764ba2,
          emissiveIntensity: 0.2
        }),
        new THREE.MeshPhongMaterial({ 
          color: 0xf093fb, 
          wireframe: true, 
          transparent: true, 
          opacity: 0.6,
          emissive: 0xf093fb,
          emissiveIntensity: 0.2
        })
      ];

      for (let i = 0; i < 8; i++) {
        const geometry = geometryTypes[i % geometryTypes.length];
        const material = materials[i % materials.length];
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = (Math.random() - 0.5) * 40;
        mesh.position.y = (Math.random() - 0.5) * 40;
        mesh.position.z = (Math.random() - 0.5) * 40;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        scene.add(mesh);
        geometriesRef.current.push(mesh);
      }

      // Create a large central geometry
      const centralGeometry = new THREE.TorusKnotGeometry(5, 1.5, 100, 16);
      const centralMaterial = new THREE.MeshPhongMaterial({
        color: 0x667eea,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        emissive: 0x667eea,
        emissiveIntensity: 0.5
      });
      const centralMesh = new THREE.Mesh(centralGeometry, centralMaterial);
      centralMesh.position.z = -10;
      scene.add(centralMesh);
      geometriesRef.current.push(centralMesh);

      // Mouse movement handler
      const handleMouseMove = (event) => {
        mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', handleMouseMove);

      // Animation loop
      const clock = new THREE.Clock();
      
      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Animate particles
        if (particlesRef.current) {
          particlesRef.current.rotation.y = elapsedTime * 0.05;
          particlesRef.current.rotation.x = elapsedTime * 0.03;
          
          // Wave animation for particles
          const positions = particlesRef.current.geometry.attributes.position.array;
          for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] = Math.sin(elapsedTime + positions[i] * 0.01) * 2;
          }
          particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }

        // Animate floating shapes
        geometriesRef.current.forEach((mesh, i) => {
          mesh.rotation.x += 0.005 * (i + 1);
          mesh.rotation.y += 0.008 * (i + 1);
          
          // Floating animation
          mesh.position.y += Math.sin(elapsedTime * 2 + i) * 0.01;
          mesh.position.x += Math.cos(elapsedTime * 0.5 + i) * 0.01;
          
          // Pulse effect
          const scale = 1 + Math.sin(elapsedTime * 2 + i) * 0.1;
          mesh.scale.set(scale, scale, scale);
        });

        // Mouse parallax with smooth interpolation
        if (cameraRef.current) {
          cameraRef.current.position.x += (mouseRef.current.x * 5 - cameraRef.current.position.x) * 0.05;
          cameraRef.current.position.y += (mouseRef.current.y * 5 - cameraRef.current.position.y) * 0.05;
          cameraRef.current.lookAt(scene.position);
        }

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      animate();

      // Handle resize
      const handleResize = () => {
        if (cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = window.innerWidth / window.innerHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        }
      };
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (rendererRef.current && canvasRef.current) {
          canvasRef.current.removeChild(rendererRef.current.domElement);
          rendererRef.current.dispose();
        }
      };
    };

    const cleanup = initThree();

    // Scroll animations using Intersection Observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.observe-animation').forEach(el => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cleanup && cleanup();
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #000;
          overflow-x: hidden;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .observe-animation {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .observe-animation.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-badge {
          animation: fadeIn 1s ease-out;
        }

        .hero-title {
          animation: slideUp 1.2s ease-out 0.2s both;
        }

        .hero-subtitle {
          animation: slideUp 1s ease-out 0.4s both;
        }

        .hero-buttons {
          animation: slideUp 1s ease-out 0.6s both;
        }

        .hero-stats {
          animation: fadeIn 1s ease-out 0.8s both;
        }

        .floating-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .floating-card:hover {
          transform: translateY(-10px) scale(1.02);
        }

        .glow-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .glow-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }

        .glow-button:hover::before {
          left: 100%;
        }

        .glow-button:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
        }

        .timeline-dot {
          animation: pulse 2s infinite;
        }

        .scroll-indicator {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        {/* Three.js Canvas */}
        <div 
          ref={canvasRef} 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />

        {/* Content wrapper */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Navigation */}
          <nav 
            style={{
              position: 'fixed',
              top: 0,
              width: '100%',
              zIndex: 50,
              transition: 'all 0.3s ease',
              backgroundColor: scrolled ? 'rgba(0,0,0,0.8)' : 'transparent',
              backdropFilter: scrolled ? 'blur(10px)' : 'none',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">AI</span>
                </div>
                <span className="text-xl font-bold">Academy</span>
              </div>
              <div className="hidden md:flex space-x-8">
                <button onClick={() => scrollToSection('features')} className="hover:text-purple-400 transition">
                  Features
                </button>
                <button onClick={() => scrollToSection('curriculum')} className="hover:text-purple-400 transition">
                  Curriculum
                </button>
                <button onClick={() => scrollToSection('projects')} className="hover:text-purple-400 transition">
                  Projects
                </button>
                <button onClick={() => scrollToSection('pricing')} className="hover:text-purple-400 transition">
                  Pricing
                </button>
              </div>
              <button className="glow-button px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-purple-600 to-purple-800">
                Start Learning
              </button>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center relative pt-20">
            <div className="container mx-auto px-6 text-center">
              <div className="hero-badge inline-block mb-6 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                <span className="text-purple-400 text-sm font-semibold">🚀 No Code Required</span>
              </div>
              <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Build <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">AI-Powered</span><br/>
                Apps & Websites
              </h1>
              <p className="hero-subtitle text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Master the art of creating professional applications using AI tools. 
                From idea to deployment - no programming experience needed.
              </p>
              <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button className="glow-button px-8 py-4 rounded-lg text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-800">
                  Get Started Free
                </button>
                <button className="px-8 py-4 rounded-lg text-lg font-semibold border border-white/20 hover:bg-white/10 transition">
                  Watch Demo
                </button>
              </div>
              <div className="hero-stats flex justify-center items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="text-green-400 mr-2" style={{ animation: 'pulse 2s infinite' }}>●</span> 
                  10,000+ Students
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2" style={{ animation: 'pulse 2s infinite' }}>●</span> 
                  500+ Projects Built
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2" style={{ animation: 'pulse 2s infinite' }}>●</span> 
                  4.9/5 Rating
                </div>
              </div>
            </div>
            <div className="scroll-indicator absolute bottom-10 left-1/2 transform -translate-x-1/2">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 relative observe-animation">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Everything You Need to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Succeed</span>
                </h2>
                <p className="text-xl text-gray-400">Learn by doing with real-world projects</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                    gradient: "from-blue-500 to-purple-500",
                    title: "AI-First Approach",
                    description: "Learn to leverage ChatGPT, Claude, and other AI tools to build complete applications from scratch."
                  },
                  {
                    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                    gradient: "from-purple-500 to-pink-500",
                    title: "Hands-On Projects",
                    description: "Build real products: SaaS apps, e-commerce sites, mobile apps, and more using AI assistance."
                  },
                  {
                    icon: "M13 10V3L4 14h7v7l9-11h-7z",
                    gradient: "from-pink-500 to-red-500",
                    title: "Rapid Deployment",
                    description: "Go from idea to live product in days, not months. Learn deployment strategies that work."
                  }
                ].map((feature, index) => (
                  <div 
                    key={index} 
                    className="floating-card group p-8 rounded-2xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6`}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon}></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-20 relative observe-animation" style={{ background: 'linear-gradient(to bottom, transparent, rgba(102, 126, 234, 0.05), transparent)' }}>
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  How It <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Works</span>
                </h2>
                <p className="text-xl text-gray-400">Your journey from zero to AI developer</p>
              </div>
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>
                  
                  {[
                    {
                      number: "1",
                      title: "Learn AI Fundamentals",
                      description: "Master prompt engineering, AI tool selection, and workflow automation basics."
                    },
                    {
                      number: "2",
                      title: "Build Your First App",
                      description: "Create a functional web application using AI assistants and no-code tools."
                    },
                    {
                      number: "3",
                      title: "Deploy & Scale",
                      description: "Launch your product to the world and learn how to maintain and scale it."
                    }
                  ].map((step, index) => (
                    <div key={index} className="relative flex items-start mb-12" style={{ animationDelay: `${index * 0.2}s` }}>
                      <div className="timeline-dot w-16 h-16 bg-black border-2 border-purple-500 rounded-full flex items-center justify-center z-10" style={{ boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)' }}>
                        <span className="text-2xl font-bold">{step.number}</span>
                      </div>
                      <div className="ml-8 p-6 rounded-xl flex-1 floating-card" style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                        <p className="text-gray-400">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Projects Showcase */}
          <section id="projects" className="py-20 observe-animation">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Student <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Success Stories</span>
                </h2>
                <p className="text-xl text-gray-400">Real projects built by our students with AI</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    gradient: "from-purple-600 to-blue-600",
                    title: "E-Commerce Platform",
                    description: "Full-stack marketplace built in 5 days using AI tools",
                    author: "Sarah Chen",
                    role: "Marketing Manager",
                    color: "#667eea"
                  },
                  {
                    gradient: "from-pink-600 to-purple-600",
                    title: "SaaS Dashboard",
                    description: "Analytics platform with real-time data visualization",
                    author: "Mike Rodriguez",
                    role: "Entrepreneur",
                    color: "#f093fb"
                  }
                ].map((project, index) => (
                  <div key={index} className="floating-card group rounded-2xl overflow-hidden" style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    animationDelay: `${index * 0.1}s`
                  }}>
                    <div className={`h-48 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="px-4 py-2 bg-white text-black rounded-lg font-semibold transform scale-90 group-hover:scale-100 transition-transform duration-300">
                          View Project
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-400 mb-4">{project.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <div 
                          className="w-8 h-8 rounded-full mr-2"
                          style={{ backgroundColor: project.color }}
                        />
                        <span>{project.author} • {project.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 observe-animation">
            <div className="container mx-auto px-6">
              <div className="p-12 rounded-3xl text-center" style={{
                background: 'linear-gradient(to right, rgba(102, 51, 153, 0.2), rgba(233, 30, 99, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Build Your Future?
                </h2>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                  Join thousands of students who are already building amazing products with AI. 
                  No coding experience required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="glow-button px-8 py-4 rounded-lg text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-800">
                    Start Free Trial
                  </button>
                  <button className="px-8 py-4 rounded-lg text-lg font-semibold border border-white/20 hover:bg-white/10 transition">
                    Schedule Demo
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-6">
                  ✓ 14-day free trial · ✓ No credit card required · ✓ Cancel anytime
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 border-t border-white/10">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">AI</span>
                  </div>
                  <span className="text-xl font-bold">Academy</span>
                </div>
                <p className="text-gray-500 text-sm">© 2024 AI Academy. Empowering builders worldwide.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default AIAcademyLanding;