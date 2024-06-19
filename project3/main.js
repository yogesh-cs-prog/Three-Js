import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es'

if ( !THREE.WebGLRenderer ) {
    console.error("WebGL not supported, please use a compatible browser.");
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.set(0, 30, 50);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const axisHelper = new THREE.AxesHelper(20)
scene.add(axisHelper)

const boxGeo = new THREE.BoxGeometry(2, 2, 2)
const boxMat = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true
})

const box = new THREE.Mesh(boxGeo, boxMat)
scene.add(box)

const sphereGeo = new THREE.SphereGeometry(2)
const sphereMat = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
})
const sphere = new THREE.Mesh(sphereGeo, sphereMat)
scene.add(sphere)

const groundPhyMat = new CANNON.Material()

const boxPhyMat = new CANNON.Material()

const spherePhyMat = new CANNON.Material()


const groundGeo = new THREE.PlaneGeometry(30, 30)
const groundMat = new THREE.MeshBasicMaterial({
  wireframe: true,
  side: THREE.DoubleSide,
  color: 0xffffff
})

const ground = new THREE.Mesh(groundGeo, groundMat)
scene.add(ground)

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0)
})

const timeStep = 1 / 60

const groundBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
    // mass: 10,
    type: CANNON.Body.STATIC,
    material: groundPhyMat

})

const sphereBody = new CANNON.Body({
  mass: 10,
  shape: new CANNON.Sphere(2),
  position: new CANNON.Vec3(0, 15, 0),
  material: spherePhyMat
})

world.addBody(sphereBody)

world.addBody(groundBody)
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)


const boxBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  mass: 1,
  position: new CANNON.Vec3(3, 20, 0),
  material: boxPhyMat
})

world.addBody(boxBody)
sphereBody.linearDamping = 0.1
boxBody.angularDamping = 0.1
boxBody.linearDamping = 0.31



const groundBoxContactMaterial = new CANNON.ContactMaterial(
  groundPhyMat,
  boxPhyMat,
  {friction: 0}
)
world.addContactMaterial(groundBoxContactMaterial)

const groundSphereContactMaterial = new CANNON.ContactMaterial(
  spherePhyMat,
  groundPhyMat,
  {restitution: 0.9}
)

world.addContactMaterial(groundSphereContactMaterial)

// object render at click

const mouse = new THREE.Vector2() /* Position for vector, used for ray-caster */
const intersectionPoint = new THREE.Vector3()  /* Captures the mouse point precisely */
const planeNormal = new THREE.Vector3()  /* indicates the direction of the plane */
const plane = new THREE.Plane() /* plane to be calculated whenever changes the position of the camera */
const rayCaster = new THREE.Raycaster() /* emit ray between camera and cursor */


window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) *2 + 1;
  planeNormal.copy(camera.position).normalize() /* normalize generates an unique vector values */
  plane.setFromNormalAndCoplanarPoint(planeNormal, new THREE.Vector3(0,0,0))
  rayCaster.setFromCamera(mouse, camera)
  rayCaster.ray.intersectPlane(plane, intersectionPoint)
})

window.addEventListener("click", (e) => {
  const SphereGeometry = new THREE.SphereGeometry(2.125, 30, 30)
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xffea00,
    metalness: 0,
    roughness: 0
  })
  const balls = new THREE.Mesh(SphereGeometry, sphereMaterial)
  scene.add(balls)
  balls.position.copy(intersectionPoint)

})



function animate(){
    ground.position.copy(groundBody.position)
    ground.quaternion.copy(groundBody.quaternion)
    box.position.copy(boxBody.position)
    box.quaternion.copy(boxBody.quaternion)
    sphere.position.copy(sphereBody.position)
    sphere.quaternion.copy(sphereBody.quaternion)
    world.step(timeStep)
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener("resize", function(){
    camera.aspect = window.innerWidth / this.window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)

})

