import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface TechEcosystem3DProps {
  nodeCount?: number;
  rotationSpeed?: number;
}

export const TechEcosystem3D: React.FC<TechEcosystem3DProps> = ({
  nodeCount = 22,
  rotationSpeed = 0.002,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const accentColor = new THREE.Color('#00f2ff');
    const techColors = ['#ffffff', '#00f2ff', '#00daf3', '#282a2b', '#111415'];

    function createTechIcon(color: THREE.Color, size: number, distance: number) {
      const geometry = new THREE.IcosahedronGeometry(size, 1);
      const material = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.85,
        emissive: color,
        emissiveIntensity: 0.6,
        shininess: 120,
        wireframe: Math.random() > 0.6
      });
      const mesh = new THREE.Mesh(geometry, material);

      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      mesh.position.set(
        distance * Math.sin(theta) * Math.cos(phi),
        distance * Math.sin(theta) * Math.sin(phi),
        distance * Math.cos(theta)
      );

      mesh.userData = {
        originalPos: mesh.position.clone(),
        speed: 0.001 + Math.random() * 0.002,
        floatOffset: Math.random() * Math.PI * 2,
      };

      return mesh;
    }

    const icons: THREE.Mesh[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const color = new THREE.Color(techColors[i % techColors.length]);
      const size = 0.12 + Math.random() * 0.22;
      const distance = 2.8 + Math.random() * 2.2;
      const icon = createTechIcon(color, size, distance);
      group.add(icon);
      icons.push(icon);
    }

    // Connective energy lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00f2ff,
      transparent: true,
      opacity: 0.15
    });

    const lineGeometry = new THREE.BufferGeometry();
    const positions: number[] = [];

    for (let i = 0; i < icons.length; i++) {
      for (let j = i + 1; j < icons.length; j++) {
        const dist = icons[i].position.distanceTo(icons[j].position);
        if (dist < 3.2) {
          positions.push(
            icons[i].position.x, icons[i].position.y, icons[i].position.z,
            icons[j].position.x, icons[j].position.y, icons[j].position.z
          );
        }
      }
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(linesMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(accentColor, 2.5, 12);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    camera.position.z = 7.5;

    let time = 0;
    let animFrameId: number;

    const animate = () => {
      time += 0.012;

      group.rotation.y += rotationSpeed;
      group.rotation.x += rotationSpeed * 0.5;

      icons.forEach((icon) => {
        const offset = Math.sin(time + icon.userData.floatOffset) * 0.22;
        icon.position.y = icon.userData.originalPos.y + offset;
        icon.rotation.y += 0.015;
        icon.rotation.x += 0.008;
      });

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [nodeCount, rotationSpeed]);

  return <div ref={containerRef} className="w-full h-full relative" />;
};
