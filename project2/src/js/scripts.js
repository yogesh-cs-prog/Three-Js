import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const doggoUrl = new URL('../assets/doggo2.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

renderer.setClearColor(0xA3A3A3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 10, 10);
orbit.update();

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const assertLoader = new GLTFLoader()

const loadingElement = document.getElementById('loading');
let mixer;  /* for Animation need global variable */
assertLoader.load(doggoUrl.href, function(doggy){
    loadingElement.style.display = 'none';
    const model = doggy.scene
    scene.add(model)
    mixer = new THREE.AnimationMixer(model)  /* Mixer just like creating timeline for animation in blender */
    const clips= doggy.animations; /* hold animation from the model */
    // for all animation to play
    clips.forEach(function(clip){
        const action = mixer.clipAction(clip)
        action.play()
    })

    /* for particular animation to play */
    // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction')
    // const action = mixer.clipAction(clip)
    // action.play()
}, undefined, function(error){
    console.log(error);
})

const clock = new THREE.Clock()
function animate(){
    mixer?.update(clock.getDelta())
    renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});