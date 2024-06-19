import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import starsTexture from "/img/stars.jpg";
import sunTexture from "/img/sun.jpg";
import mercuryTexture from "/img/mercury.jpg";
import venusTexture from "/img/venus.jpg";
import earthTexture from "/img/earth.jpg";
import marsTexture from "/img/mars.jpg";
import jupiterTexture from "/img/jupiter.jpg";
import saturnTexture from "/img/saturn.jpg";
import saturnRingTexture from "/img/saturn-ring.png";
import uranusTexture from "/img/uranus.jpg";
import uranusRingTexture from "/img/uranus-ring.png";
import neptuneTexture from "/img/neptune.jpg";
import plutoTexture from "/img/pluto.jpg";

if ( !THREE.WebGLRenderer ) {
    console.error("WebGL not supported, please use a compatible browser.");
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.set(-90, 140, 140);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();



const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture, starsTexture, starsTexture,
    starsTexture, starsTexture, starsTexture
]);

const textureLoader = new THREE.TextureLoader()

const sunGeo = new THREE.SphereGeometry(20, 30, 30)
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
})
const sun = new THREE.Mesh(sunGeo, sunMat)
scene.add(sun)

function createPlanet(size, texture, position, ring){
    const Geo = new THREE.SphereGeometry(size, 30, 30)
    const Mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture)
    })
    const mesh = new THREE.Mesh(Geo, Mat)
    const obj = new THREE.Object3D();
    obj.add(mesh)
    if(ring){
        const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32)
        const ringMat = new THREE.MeshBasicMaterial({
        map: textureLoader.load(ring.texture),
        side: THREE.DoubleSide
        })
        const ringMesh = new THREE.Mesh(ringGeo, ringMat)
        obj.add(ringMesh)
        ringMesh.position.x = position
        ringMesh.rotation.x = -0.5 * Math.PI
        }
    scene.add(obj)
    mesh.position.x = position;
    return { mesh, obj}
}

const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const saturn = createPlanet(10, saturnTexture, 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
});
const uranus = createPlanet(7, uranusTexture, 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
});
const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(2.8, plutoTexture, 216);



const pointLight = new THREE.PointLight(0xffffff, 1500, 5000);
scene.add(pointLight);


function animate(){
    sun.rotateY(0.003)
    mercury.mesh.rotateY(0.004)
    mercury.obj.rotateY(0.035)
    saturn.obj.rotateY(0.003)
    saturn.mesh.rotateY(0.002)
    earth.mesh.rotateY(0.02)
    earth.obj.rotateY(0.01)
    venus.mesh.rotateY(0.002)
    venus.obj.rotateY(0.02  )
    mars.mesh.rotateY(0.018);
    mars.obj.rotateY(0.008);
    jupiter.mesh.rotateY(0.04);
    jupiter.obj.rotateY(0.002);
    uranus.mesh.rotateY(0.03);
    uranus.obj.rotateY(0.0004);
    neptune.mesh.rotateY(0.032);
    pluto.mesh.rotateY(0.008);
    neptune.obj.rotateY(0.0002);
    pluto.obj.rotateY(0.00009);
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener("resize", function(){
    camera.aspect = window.innerWidth / this.window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)

})


// Code Logic

// Saturn Planet


// const saturnGeo = new THREE.SphereGeometry(5, 30, 30)
// const saturnMat = new THREE.MeshBasicMaterial({
//     map: textureLoader.load(saturnTexture)
// })
// const saturn = new THREE.Mesh(saturnGeo, saturnMat)
// const saturnObj = new THREE.Object3D();
// saturnObj.add(saturn)
// scene.add(saturnObj)
// saturn.position.x = 138

// Saturn Planet Ring


// const saturnRingGeo = new THREE.RingGeometry(7, 20, 32)
// const saturnRingMat = new THREE.MeshBasicMaterial({
//     map: textureLoader.load(saturnRingTexture),
//     side: THREE.DoubleSide
// })
// const saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat)
// saturnObj.add(saturnRing)
// saturnRing.position.x = 138
// saturnRing.rotation.x = -0.5 * Math.PI
