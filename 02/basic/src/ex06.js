import * as THREE from 'three';

// ----- 주제: 애니메이션 성능 보정

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
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
	camera.position.z = 5;
	scene.add(camera);

	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.x = 1;
	light.position.z = 2;
	scene.add(light);

	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshStandardMaterial({
		color: 'red'
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();
		
		// 각도는 Radian을 사용
		// 360도는 2파이
		// mesh.rotation.y += 0.1;
		// mesh.rotation.y += THREE.MathUtils.degToRad(1);
		mesh.rotation.y += 2 * delta;
		mesh.position.y += 3 * delta;
		if (mesh.position.y > 3) {
			mesh.position.y = 0;
		}
		renderer.render(scene, camera);

		// window.requestAnimationFrame(draw);
		renderer.setAnimationLoop(draw);
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);

	draw();
}
