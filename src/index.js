import Scene from './Scene'
import Spring from './Spring'
import Mass from './Mass'
import Gravity from './Gravity'


const STARTING_GRAVITY = 500
const INITIAL_LINE_WIDTH = 1
const GRID_SPRING_CONSTANT = 500
const GRID_DAMPENING = 50
const GRID_MASSES = 8
const GRID_SPRING_LENGTH = 15
const GRID_POSITION = [ 25, 25 ]
const GRID_DIMENSIONS = [ 12, 12 ] 

const color = document.getElementById('color')
const gravitySlider = document.getElementById('gravity-slider')
const gravityInput = document.getElementById('gravity-input')
const lineWidthSlider = document.getElementById('line-width-slider')
const lineWidthInput = document.getElementById('line-width-input')
gravitySlider.value = STARTING_GRAVITY
gravityInput.value = STARTING_GRAVITY
const resetButton = document.getElementById('reset')
const canvas = document.getElementById('main-canvas')
canvas.height = 500
canvas.width = 500

const ctx = canvas.getContext('2d')




const mass1 = new Mass(100, 100, 500000)
const mass2 = new Mass(100, 200, 400)
const mass3 = new Mass(200,100, 100)
const mass4 = new Mass(205,205, 1000000)


const spring = new Spring(mass1, mass2, 100, 100)
const spring2 = new Spring(mass1, mass3, 100, 100)
const spring3 = new Spring(mass1, mass4, Math.sqrt(2) * 100, 10000)
const spring4 = new Spring(mass2, mass3, Math.sqrt(2) * 100, 100)
const spring5 = new Spring(mass2, mass4, 100, 100)
const spring6 = new Spring(mass3, mass4, 100,100)
let masses = []
let springs = []

const gravity = new Gravity(0, parseInt(gravitySlider.value))

gravitySlider.oninput = e => {
  const value = parseInt(e.target.value)
  gravityInput.value = value
  gravity.setGravity(0,value)
}

gravityInput.onchange = e => {
  const value = parseInt(e.target.value)
  gravitySlider.value = value
  gravity.setGravity(0,value)
}

let lineWidth = INITIAL_LINE_WIDTH
lineWidthSlider.value = lineWidth
lineWidthInput.value = lineWidth
lineWidthSlider.oninput = e => {
  lineWidth = parseInt(e.target.value)
  lineWidthInput.value = lineWidth
}

lineWidthInput.onchange = e => {
  lineWidth = parseInt(e.target.value)
  lineWidthSlider.value = lineWidth
}

resetButton.onclick = () => {
  scene.clear()
}

const form = document.getElementById('create-grid')
form.onsubmit = e => {
  e.preventDefault()

}

let prevTime
const drawScene = timeStamp => {
  if (typeof prevTime === 'undefined') prevTime = timeStamp

  const dT = 2 //(timeStamp - prevTime)

  if (dT) {
    // add forces
    springs.forEach(spring => spring.update(dT))
    springs.forEach(spring => spring.addForces())
    masses.forEach(mass => {
      gravity.addForceToMass(mass, dT)
    })
    
    // update
    masses.forEach(mass => mass.update(dT))
  }

  // draw
  ctx.clearRect(0,0,500,500)
  const drawColor = color.checked
  springs.forEach(spring => spring.draw(ctx, drawColor, lineWidth))
  masses.forEach(mass => mass.draw(ctx))
  prevTime = timeStamp
  requestAnimationFrame(drawScene)
}

let counter = 0
const stepForward = document.createElement('button')
stepForward.innerText = 'Start'
document.body.prepend(stepForward)
stepForward.onclick = () => {
  // counter += 6
  // drawScene(counter)
  const scene = new Scene(GRID_DAMPENING)
  masses = scene.masses //[mass1, mass2, mass3, mass4]
  springs = scene.springs //[spring, spring2, spring3, spring4, spring5, spring6]
  scene.createGrid(...GRID_POSITION, ...GRID_DIMENSIONS, GRID_MASSES, GRID_SPRING_LENGTH, GRID_SPRING_CONSTANT)
}

requestAnimationFrame(drawScene)