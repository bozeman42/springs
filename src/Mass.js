import { Vec2 } from './math'

export default class Mass {
/**
 * 
 * @param {number} x x coordinate
 * @param {number} y y coordinate
 * @param {number} mass mass
 * @param {number} vx velocity x value
 * @param {number} vy velocity y value
 * @param {number} ax acceleration x value
 * @param {number} ay acceleration y value
 */
  constructor(x, y, mass, vx = 0, vy = 0, ax = 0, ay = 0) {
    this.mass = mass
    this.position = new Vec2(x, y)
    this.velocity = new Vec2(vx, vy)
    this.acceleration = new Vec2(ax, ay)
    this.forces = []
  }

  resetForces() {
    this.forces.splice(0, this.forces.length)
    this.resetAcceleration()
  }

  addForce(force) {
    this.forces.push(force)
  }

  resetAcceleration() {
    this.acceleration = new Vec2(0,0)
  }

  applyForce(dT) {
    const force = this.getNetForce()
    
    const acceleration = this.getAcceleration(force)
    acceleration.magnitude = acceleration.magnitude * (dT / 1000)
    const acc = acceleration.magnitude
    this.acceleration = this.acceleration.add(acceleration)
  }

  getNetForce() {
    return this.forces.reduce((total, force) => {
      return total.add(force)
    }, new Vec2(0,0))
  }

  /**
   * 
   * @param {Vec2} force 
   */
  getAcceleration(force) {
    const forceMagnitude = force.magnitude
    const accelerationMagnitude = forceMagnitude / this.mass
    return force.direction(accelerationMagnitude)
  }

  update(dT) {
    this.applyForce(dT)
    this.velocity = this.velocity.add(this.acceleration)
    this.position = this.position.add(this.velocity)
    if (this.position.y > 500) {
      this.position.setVec(this.position.x, 499)
      this.velocity.setVec(this.velocity.x * .5, 0)
    }
    if (this.position.y < 0) {
      this.position.setVec(this.position.x, 1)
      this.velocity.setVec(this.velocity.x, 0)
    }
    if (this.position.x > 500) {
      this.position.setVec(499, this.position.y)
      this.velocity.setVec(0, this.velocity.y)
    }
    if (this.position.x < 0) {
      this.position.setVec(1, this.position.y)
      this.velocity.setVec(0, this.velocity.y)
    }
    this.resetForces()
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw(ctx) {
    const [x, y] = this.position.coordinates

    const radius = 2 * Math.log(this.mass)
    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.strokeStyle = 'black'
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
  }
}