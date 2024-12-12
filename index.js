import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set camera position
camera.position.set(0, 1, 2);
camera.lookAt(0, 0, 0);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Load a 3D model
const loader = new GLTFLoader();
loader.load(
  "scene.gltf",
  function (gltf) {
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error("An error occurred:", error);
  }
);

// Define tour points (positions and lookAt targets)
const tourPoints = [
  { position: { x: 0, y: 1, z: 3 }, lookAt: { x: 0, y: 1, z: 0 } },
  { position: { x: 2, y: 1, z: 0 }, lookAt: { x: 0, y: 1, z: 0 } },
  { position: { x: -5, y: 1, z: 0 }, lookAt: { x: 0, y: 1, z: 0 } },
  { position: { x: 7, y: 1, z: 2 }, lookAt: { x: 0, y: 1, z: 0 } },
  { position: { x: 3, y: 1, z: 0 }, lookAt: { x: 0, y: 1, z: 0 } },
  { position: { x: 0, y: 1, z: 14 }, lookAt: { x: 0, y: 1, z: 0 } },
  { position: { x: 0, y: 1, z: 3 }, lookAt: { x: 0, y: 1, z: 0 } },
];

let currentPoint = 0;
let isTourActive = false;

// Function to move the camera to the next point
function moveToNextPoint() {
  if (currentPoint >= tourPoints.length || !isTourActive) {
    endTour(); // End the tour if all points are covered or if the tour is stopped
    return;
  }

  const point = tourPoints[currentPoint];
  const from = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  };
  const to = point.position;

  new TWEEN.Tween(from)
    .to(to, 2000) // Animation duration
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
      camera.position.set(from.x, from.y, from.z);
      camera.lookAt(
        new THREE.Vector3(point.lookAt.x, point.lookAt.y, point.lookAt.z)
      );
    })
    .onComplete(() => {
      currentPoint++;
      if (isTourActive) {
        setTimeout(moveToNextPoint, 1000); // Wait before moving to the next point
      }
    })
    .start();
}

// Function to start the tour
function startTour() {
  if (isTourActive) return; // Prevent starting the tour multiple times
  isTourActive = true;
  controls.enabled = false; // Disable controls during the tour
  currentPoint = 0; // Reset to the first point
  moveToNextPoint();
}

// Function to end the tour
function endTour() {
  isTourActive = false;
  controls.enabled = true; // Re-enable controls
  TWEEN.removeAll(); // Stop all active tweens
}

// Add a button to start the tour
const startButton = document.createElement("button");
startButton.textContent = "Start Tour";
startButton.style.position = "absolute";
startButton.style.top = "10px";
startButton.style.left = "10px";
startButton.style.padding = "10px";
startButton.style.backgroundColor = "#27ae60";
startButton.style.color = "#fff";
startButton.style.border = "none";
startButton.style.borderRadius = "5px";
startButton.style.cursor = "pointer";
document.body.appendChild(startButton);

startButton.addEventListener("click", startTour);

// Add a button to end the tour
const endButton = document.createElement("button");
endButton.textContent = "End Tour";
endButton.style.position = "absolute";
endButton.style.top = "50px";
endButton.style.left = "10px";
endButton.style.padding = "10px";
endButton.style.backgroundColor = "#c0392b";
endButton.style.color = "#fff";
endButton.style.border = "none";
endButton.style.borderRadius = "5px";
endButton.style.cursor = "pointer";
document.body.appendChild(endButton);

endButton.addEventListener("click", endTour);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  TWEEN.update(); // Update TWEEN animations
  if (!isTourActive) controls.update(); // Update controls only if the tour is inactive
  renderer.render(scene, camera);
}

animate();
