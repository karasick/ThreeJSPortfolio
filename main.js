import './style.css'

import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene()

const aspectRatio = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(75, aspectRatio,  0.1, 1000)

const rendererCanvas = document.querySelector('#background')
const renderer = new THREE.WebGLRenderer({
    canvas: rendererCanvas
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.setZ(30)

const animateCallbacks = []

function animate() {
    requestAnimationFrame(animate)

    animateCallbacks.forEach(callback => callback())

    renderer.render(scene, camera)
}

animate()

// const controls = new OrbitControls(camera, renderer.domElement)
//
// animateCallbacks.push(controls.update)

const spaceTexture = new THREE.TextureLoader().load('galaxy.jpg')
scene.background = spaceTexture

const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshStandardMaterial({
    color: 0xFF6347,
    wireframe: true
})
const torus = new THREE.Mesh(geometry, material)

scene.add(torus)

function rotateTorus() {
    torus.rotation.x += 0.01
    torus.rotation.y += 0.005
    torus.rotation.z += 0.01
}

animateCallbacks.push(rotateTorus)

const ambientLight = new THREE.AmbientLight(0xffffff)

scene.add(ambientLight)

const lightPoint = new THREE.PointLight(0xffffff)
lightPoint.position.set(5, 5, 5)

scene.add(lightPoint)

// const lightPointHelper = new THREE.PointLightHelper(lightPoint)
// const gridHelper = new THREE.GridHelper(200, 50)
//
// scene.add(lightPointHelper, gridHelper)

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24)
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff
    })
    const star = new THREE.Mesh(geometry, material)

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

    star.position.set(x, y, z)
    scene.add(star)
}

Array(200).fill().forEach(addStar)

const cubeTexture = new THREE.TextureLoader().load('face.jpg')
const cubeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshBasicMaterial({
        map: cubeTexture
    })
)

scene.add(cubeMesh)

const marsTexture = new THREE.TextureLoader().load('mars_texture.jpg')
const marsNormal = new THREE.TextureLoader().load('mars_1k_normal.jpg')
const marsMesh = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({
        map: marsTexture,
        normalMap: marsNormal
    })
)

scene.add(marsMesh)

function rotateMars() {
    marsMesh.rotation.x += 0.005;
}

animateCallbacks.push(rotateMars)

marsMesh.position.z = 30;
marsMesh.position.setX(-10);

cubeMesh.position.z = -5;
cubeMesh.position.x = 2;

// Scroll Animation

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    marsMesh.rotation.x += 0.05;
    marsMesh.rotation.y += 0.075;
    marsMesh.rotation.z += 0.05;

    cubeMesh.rotation.y += 0.01;
    cubeMesh.rotation.z += 0.01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();