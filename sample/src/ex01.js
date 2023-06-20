import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "dat.gui";

// ----- 주제: Light 기본

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 10;
  camera.position.z = 20;
  scene.add(camera);

  // Light
  // const ambientLight = new THREE.AmbientLight("white", 0.5);
  // scene.add(ambientLight);

  // const light = new THREE.HemisphereLightProbe("white", 20);
  // // light.position.x = -5;
  // scene.add(light);

  const light = new THREE.HemisphereLight("blue", "green", 1);
  scene.add(light);
  const lightHelper = new THREE.HemisphereLightHelper(light);
  scene.add(lightHelper);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxDistance = 70;
  controls.minDistance = 1;
  // controls.enablePan = false;

  const group1 = new THREE.Group();
  const group2 = new THREE.Group();
  const group3 = new THREE.Group();

  // Geometry
  const solarGeometry = new THREE.SphereGeometry(5, 64, 64);
  const earthGeometry = new THREE.SphereGeometry(0.5, 32, 16);
  const moonGeometry = new THREE.SphereGeometry(0.1, 32, 16);

  // Material
  const solarMaterial = new THREE.MeshStandardMaterial({
    // color: "orangered",
    side: THREE.DoubleSide,
    // flatShading: true,
    wireframe: true,
  });

  const textureLoader = new THREE.TextureLoader();
  const textureEarth = textureLoader.load("/textures/earth.png");
  const earthMaterial = new THREE.MeshStandardMaterial({
    map: textureEarth,
    roughness: 0.3,
    metalness: 0.3,
  });
  const textureMoon = textureLoader.load("/textures/moon.jpg");
  const moonMaterial = new THREE.MeshStandardMaterial({ map: textureMoon });

  // Mesh
  const solar = new THREE.Mesh(solarGeometry, solarMaterial);

  const positionArray = solarGeometry.attributes.position.array;
  const randomArray = [];
  for (let i = 0; i < positionArray.length; i += 3) {
    positionArray[i] += (Math.random() - 0.5) * 0.2;
    positionArray[i + 1] += (Math.random() - 0.5) * 0.2;
    positionArray[i + 2] += (Math.random() - 0.5) * 0.2;

    randomArray[i] = (Math.random() - 0.5) * 0.2;
    randomArray[i + 1] = (Math.random() - 0.5) * 0.2;
    randomArray[i + 2] = (Math.random() - 0.5) * 0.2;
  }

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  group2.position.x = 10;
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.position.x = 1;

  group3.add(moon);
  group2.add(earth, group3);
  group1.add(solar, group2);
  scene.add(group1);

  // Dat GUI
  const gui = new dat.GUI();
  gui.add(light.position, "x", -50, 50);
  gui.add(light.position, "y", -50, 50);
  gui.add(light.position, "z", -50, 50);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime() * 0.39;

    // light.position.x = Math.cos(time) * 5;
    // light.position.z = -Math.sin(time) * 5;

    const solarTime = clock.getElapsedTime() * 3;

    for (let i = 0; i < positionArray.length; i += 3) {
      positionArray[i] += Math.sin(solarTime + randomArray[i] * 100) * 0.001;
      positionArray[i + 1] +=
        Math.sin(solarTime + randomArray[i + 1] * 100) * 0.001;
      positionArray[i + 2] +=
        Math.sin(solarTime + randomArray[i + 2] * 100) * 0.001;
    }

    solarGeometry.attributes.position.needsUpdate = true;

    const delta = clock.getDelta() * 10;
    group1.rotation.y += delta;
    group2.rotation.y += delta;
    group3.rotation.y += delta;

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener("resize", setSize);

  draw();
}
