import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';


const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 5, 5)  
camera.lookAt(0, 0, 0) 

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xffffff)  
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.screenSpacePanning = false
controls.minDistance = 5
controls.maxDistance = 50
controls.maxPolarAngle = Math.PI / 2


const tableGeometry = new THREE.BoxGeometry(8, 0.3, 4)
const tableTexture = new THREE.TextureLoader().load('/billiardTexture.jpg')
const tableMaterial = new THREE.MeshStandardMaterial({ map: tableTexture })
const table = new THREE.Mesh(tableGeometry, tableMaterial)
scene.add(table)


const borderTexture = new THREE.TextureLoader().load('/borderTexture.jpeg')

borderTexture.wrapS = THREE.RepeatWrapping
borderTexture.wrapT = THREE.RepeatWrapping

borderTexture.repeat.set(4, 1) 
const tableLength = 8
const tableWidth = 4
const tableHeight = 0.3 

const borderHeight = 0.5
const borderThickness = 0.2

const borderMaterial = new THREE.MeshStandardMaterial({ map: borderTexture })

const borders = []

const longBorderGeometry = new THREE.BoxGeometry(tableLength + borderThickness, borderHeight, borderThickness)

const leftBorder = new THREE.Mesh(longBorderGeometry, borderMaterial)
leftBorder.position.set(0, tableHeight / 2 + borderHeight / 2, -tableWidth / 2 - borderThickness / 2)
scene.add(leftBorder)
borders.push(leftBorder)

const rightBorder = new THREE.Mesh(longBorderGeometry, borderMaterial)
rightBorder.position.set(0, tableHeight / 2 + borderHeight / 2, tableWidth / 2 + borderThickness / 2)
scene.add(rightBorder)
borders.push(rightBorder)

const shortBorderGeometry = new THREE.BoxGeometry(borderThickness, borderHeight, tableWidth + borderThickness)

const topBorder = new THREE.Mesh(shortBorderGeometry, borderMaterial)
topBorder.position.set(tableLength / 2 + borderThickness / 2, tableHeight / 2 + borderHeight / 2, 0)
scene.add(topBorder)
borders.push(topBorder)

const bottomBorder = new THREE.Mesh(shortBorderGeometry, borderMaterial)
bottomBorder.position.set(-tableLength / 2 - borderThickness / 2, tableHeight / 2 + borderHeight / 2, 0)
scene.add(bottomBorder)
borders.push(bottomBorder)

const legTexture = new THREE.TextureLoader().load('/woodTexture.jpg')
const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 32)
const legMaterial = new THREE.MeshStandardMaterial({map: legTexture})
const legs = []
for (let i = 0; i < 4; i++) {
    const leg = new THREE.Mesh(legGeometry, legMaterial)
    scene.add(leg)
    legs.push(leg)
}
legs[0].position.set(-3.7, -0.9, -1.8)
legs[1].position.set(3.7, -0.9, -1.8)
legs[2].position.set(-3.7, -0.9, 1.8)
legs[3].position.set(3.7, -0.9, 1.8)

const holeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32) 
const holeMaterial = new THREE.MeshStandardMaterial({color: 0x000000,
  transparent: true,
  opacity: 0.5
})

const holes = []
for (let i = 0; i < 6; i++) {
    const hole = new THREE.Mesh(holeGeometry, holeMaterial)
    hole.rotation.y = Math.PI / 2
    scene.add(hole)
    holes.push(hole)
}

holes[0].position.set(-3.7, 0.06, -1.7)
holes[1].position.set(3.7, 0.06, -1.7)
holes[2].position.set(-3.7, 0.06, 1.7)
holes[3].position.set(3.7, 0.06, 1.7)
holes[4].position.set(0, 0.06, -1.7)
holes[5].position.set(0, 0.06, 1.7)

const ballGeometry = new THREE.SphereGeometry(0.15, 32, 32)
const ballTextures = [
  '/1ball.jpg', 
  '/2ball.jpg', 
  '/3ball.jpg', 
  '/4ball.jpg', 
  '/5ball.jpg', 
  '/6ball.jpg', 
  '/7ball.jpg', 
  '/8ball.jpg', 
  '/9ball.jpg', 
  '/10ball.jpg', 
  '/11ball.png', 
  '/12ball.jpg', 
  '/13ball.jpg', 
  '/14ball.png', 
  '/15ball.jpg'  
]

const balls = []
const startX = 0   
const startY = 0.3
const startZ = -0.5 

const ballPositions = [
    [startX, startY, startZ],  
    [startX - 0.17, startY, startZ + 0.3], [startX + 0.17, startY, startZ + 0.3], 
    [startX - 0.34, startY, startZ + 0.6], [startX, startY, startZ + 0.6], [startX + 0.34, startY, startZ + 0.6], 
    [startX - 0.51, startY, startZ + 0.9], [startX - 0.17, startY, startZ + 0.9], [startX + 0.17, startY, startZ + 0.9], [startX + 0.51, startY, startZ + 0.9], 
    [startX - 0.68, startY, startZ + 1.2], [startX - 0.34, startY, startZ + 1.2], [startX, startY, startZ + 1.2], [startX + 0.34, startY, startZ + 1.2], [startX + 0.68, startY, startZ + 1.2] 
]
function rotateBallPositions(positions, angle) {
  const cosAngle = Math.cos(angle)
  const sinAngle = Math.sin(angle)
  
  return positions.map(position => {
      const x = position[0]
      const z = position[2]
      const rotatedX = x * cosAngle - z * sinAngle
      const rotatedZ = x * sinAngle + z * cosAngle
      return [rotatedX, position[1], rotatedZ]
  })
}
const rotatedBallPositions = rotateBallPositions(ballPositions, Math.PI/2)

for (let i = 0; i < ballPositions.length; i++) {
  const ballTexture = new THREE.TextureLoader().load(ballTextures[i])
    const ballMaterial = new THREE.MeshStandardMaterial({map: ballTexture})
    const ball = new THREE.Mesh(ballGeometry, ballMaterial)
    ball.position.set(rotatedBallPositions[i][0], rotatedBallPositions[i][1], rotatedBallPositions[i][2])
    scene.add(ball)
    balls.push({
        mesh: ball,
        velocity: new THREE.Vector3(0, 0, 0),
        angularVelocity: new THREE.Vector3(0, 0, 0) 
    })
}

const whiteBallMaterial = new THREE.MeshStandardMaterial({color: 0xffffff})
const whiteBall = new THREE.Mesh(ballGeometry, whiteBallMaterial)
whiteBall.position.set(2, startY, 0)
scene.add(whiteBall)
balls.push({
  mesh: whiteBall,
  velocity: new THREE.Vector3(0, 0, 0), 
  angularVelocity: new THREE.Vector3(0, 0, 0)
})




let isSpacePressed = false
let pressStartTime = 0


let ballsPottedCount = 0
let movesMadeCount = 0

function updateInfoBox() {
  document.getElementById('balls-potted').textContent = ballsPottedCount
  document.getElementById('moves-made').textContent = movesMadeCount
}
function incrementMoves() {
  movesMadeCount++
  updateInfoBox()
}
function incrementBallsPotted() {
  ballsPottedCount++
  updateInfoBox()
}


// Funzione per l'animazione
function animate() {
    requestAnimationFrame(animate)
    moveBalls()
    controls.update()
    renderer.render(scene, camera)
    if (isSpacePressed){
      const elapsedTime = Date.now()-pressStartTime
      const chargeLevel = Math.min(elapsedTime / 1000, 1)
      drawChargeIndicator(chargeLevel)
    }
}

function handleBallCollision(ball, otherBall) {
const distance = ball.mesh.position.distanceTo(otherBall.mesh.position)

  if (distance < 0.3) {
      const normal = new THREE.Vector3().subVectors(ball.mesh.position, otherBall.mesh.position).normalize()
      const relativeVelocity = new THREE.Vector3().subVectors(ball.velocity, otherBall.velocity)
      const separatingVelocity = relativeVelocity.dot(normal)

      if (separatingVelocity < 0) {
          const newSepVelocity = -separatingVelocity
          const impulse = normal.multiplyScalar(newSepVelocity)
          ball.velocity.add(impulse)
          otherBall.velocity.sub(impulse)
      }
  }
}

function moveBalls() {
  const friction = 0.99
  const rollingFriction = 0.99
  const tableLength = 8
  const tableWidth = 4
  const borderThickness = 0.2
  
  for (let i = 0; i < balls.length; i++) {
      const ball = balls[i]
      
      ball.velocity.multiplyScalar(friction)
      ball.angularVelocity.multiplyScalar(rollingFriction)

      if (ball.velocity.length() < 0.0001) {
          ball.velocity.set(0, 0, 0)
      }

      ball.mesh.position.add(ball.velocity)

      const axis = new THREE.Vector3(0, 1, 0).cross(ball.velocity).normalize()
      const angle = ball.velocity.length() / ballGeometry.parameters.radius
      ball.mesh.rotateOnAxis(axis, angle)

      if (ball.mesh.position.x > tableLength / 2 - borderThickness) {
          ball.mesh.position.x = tableLength / 2 - borderThickness
          ball.velocity.x *= -1
      }
      if (ball.mesh.position.x < -tableLength / 2 + borderThickness) {
          ball.mesh.position.x = -tableLength / 2 + borderThickness
          ball.velocity.x *= -1
      }

      if (ball.mesh.position.z > tableWidth / 2 - borderThickness) {
          ball.mesh.position.z = tableWidth / 2 - borderThickness
          ball.velocity.z *= -1
      }
      if (ball.mesh.position.z < -tableWidth / 2 + borderThickness) {
          ball.mesh.position.z = -tableWidth / 2 + borderThickness
          ball.velocity.z *= -1
      }

      holes.forEach(hole => {
          const distance = ball.mesh.position.distanceTo(hole.position)
          if (distance < 0.3) {
                  activateLightOnHole(hole.position)
                  incrementBallsPotted()
                  scene.remove(ball.mesh)
                  balls.splice(balls.indexOf(ball), 1)
                  checkWinCondition() 
          }
      })

      for (let j = i + 1; j < balls.length; j++) {
          handleBallCollision(ball, balls[j])
      }
  }
}

function startMovement(force) {
    balls.forEach(ball => {
        ball.velocity.set(
            (Math.random() - 0.5) * 0.5*force,
            0,
            (Math.random() - 0.5) * 0.5 *force
        )
    })
}

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(10, 20, 10)
directionalLight.castShadow = true  
directionalLight.shadow.mapSize.width = 4096  
directionalLight.shadow.mapSize.height = 4096
directionalLight.shadow.camera.near = 0.5  
directionalLight.shadow.camera.far = 50    
directionalLight.shadow.bias = -0.0001     
scene.add(directionalLight)


table.castShadow = false  
table.receiveShadow = true  

balls.forEach(ball => {
    ball.mesh.castShadow = true  
    ball.mesh.receiveShadow = false  
})


table.receiveShadow = true

const lightX = document.getElementById('light-x')
const lightY = document.getElementById('light-y')
const lightZ = document.getElementById('light-z')

function updateLightPosition() {
    directionalLight.position.set(
        parseFloat(lightX.value),
        parseFloat(lightY.value),
        parseFloat(lightZ.value)
    )
}

lightX.addEventListener('input', updateLightPosition)
lightY.addEventListener('input', updateLightPosition)
lightZ.addEventListener('input', updateLightPosition)

window.addEventListener('keydown', function(event) {
  if (event.code === 'Space' && !isSpacePressed) {
  isSpacePressed = true
  pressStartTime = Date.now()
  }
  })

  window.addEventListener('keyup', function(event) {
    if (event.code === 'Space' && isSpacePressed) {
    isSpacePressed = false
    const pressDuration = Date.now() - pressStartTime
    const force = Math.min(pressDuration / 1000, 2) 
    startMovement(force)
    setTimeout(() => {
      indicatorContext.clearRect(0, 0, indicatorCanvas.width, indicatorCanvas.height)
    }, 100)
    incrementMoves()
    }
   
    })
  
const indicatorCanvas = document.getElementById('indicatorCanvas')
indicatorCanvas.width = window.innerWidth
indicatorCanvas.height = window.innerHeight
const indicatorContext = indicatorCanvas.getContext('2d')


function drawChargeIndicator(level) {
    indicatorContext.clearRect(0, 0, indicatorCanvas.width, indicatorCanvas.height)
    const barWidth = indicatorCanvas.width * 0.2 
    const barHeight = 10
    const barX = (indicatorCanvas.width - barWidth) / 2 
    const barY = indicatorCanvas.height - barHeight - 20 
    indicatorContext.fillStyle = 'rgba(200, 200, 200, 0.5)' 
    indicatorContext.fillRect(barX, barY, barWidth, barHeight)
    indicatorContext.fillStyle = '#008000' 
    indicatorContext.fillRect(barX, barY, barWidth * level, barHeight)
}

function activateLightOnHole(position) {
  const pointLight = new THREE.PointLight(0xffdd88, 2, 3) 
  pointLight.position.set(position.x, position.y + 0.5, position.z)
  scene.add(pointLight)
  const duration = 1000;  
  const startTime = Date.now();

  function animateLight() {
      const elapsedTime = Date.now() - startTime;
      const progress = elapsedTime / duration;

      if (progress < 1) {
          pointLight.intensity = 2 * (1 - progress);  
          requestAnimationFrame(animateLight);
      } else {
          scene.remove(pointLight);
      }
  }
  animateLight();
}

function checkWinCondition() {
  if (balls.length === 0) {
      displayWinMessage()
  }
}

function displayWinMessage() {
  const winMessage = document.getElementById('win-message')
  winMessage.style.display = 'block' 
}
animate()