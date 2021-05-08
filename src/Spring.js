import { Vec2, mapToRange } from './math'
import Mass from './Mass'

/**
 * @property {Mass} endPoint1
 * @property {Mass} endPoint2
 */
export default class Spring {
  /**
   * 
   * @param {Mass} mass1 to be attached to endpoint 1
   * @param {Mass} mass2 to be attached to endpoint 2
   * @param {number} restLength 
   * Length of spring where no force is applied
   * @param {number} springConstant 
   * force per unit of difference in length from restLength F = -kx
   * @param {number} dampening dampening coefficient (resists motion)
   */
  constructor(mass1, mass2, restLength, springConstant, dampening = 0) {
    this.k = springConstant
    this.restLength = restLength
    this.b = dampening
    this.deltaLength = 0
    this.attachEndpoint1ToMass(mass1)
    this.attachEndpoint2ToMass(mass2)
    this.previousLength = this.length
  }

  get length() {
    return this.endPoint1.position.distance(this.endPoint2.position)
  }

  getForceMagnitude() {
    return -(this.length - this.restLength) * this.k
  }

  getDampeningForce1() {
    const forceVector = this.endPoint1.position.subtract(this.endPoint2.position)
    const magnitude = -(this.b * this.deltaLength)
    forceVector.magnitude = magnitude

    return forceVector
  }

  getDampeningForce2() {
    const forceVector = this.endPoint2.position.subtract(this.endPoint1.position)
    const magnitude = -(this.b * this.deltaLength)
    forceVector.magnitude = magnitude

    return forceVector
  }

  getEndpoint1Force() {
    const forceVector = this.endPoint1.position.subtract(this.endPoint2.position)
    forceVector.magnitude = this.getForceMagnitude(this.endPoint1.mass)
    return forceVector
  }
  
  getEndpoint2Force() {
    const forceVector = this.endPoint2.position.subtract(this.endPoint1.position)
    forceVector.magnitude = this.getForceMagnitude(this.endPoint2.mass)
    return forceVector
  }

  /**
   * 
   * @param {Mass} mass 
   */
  attachEndpoint1ToMass(mass) {
    this.endPoint1 = mass
  }

  /**
   * 
   * @param {Mass} mass 
   */
  attachEndpoint2ToMass(mass) {
    this.endPoint2 = mass
  }

  addForces() {
    const endpoint1Force = this.getEndpoint1Force()
    const endpoint2Force = this.getEndpoint2Force()
    const endpoint1Dampening = this.getDampeningForce1()
    const endpoint2Dampening = this.getDampeningForce2()
    // console.table({
    //   endpoint1Mag: endpoint1Force.magnitude,
    //   endpoint1Dampening: endpoint1Dampening.magnitude,
    //   endpoint1NetMag: endpoint1Force.add(endpoint1Dampening).magnitude,
    //   deltaLength: this.deltaLength
    // })
    this.endPoint1.addForce(endpoint1Force)
    this.endPoint2.addForce(endpoint2Force)
    this.endPoint1.addForce(endpoint1Dampening)
    this.endPoint2.addForce(endpoint2Dampening)

  }

  update(dT) {
    this.deltaLength = (this.length - this.previousLength)
    this.previousLength = this.length
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw(ctx, drawColor, lineWidth) {
    const [x1, y1] = this.endPoint1.position.coordinates
    const [x2, y2] = this.endPoint2.position.coordinates
    this.endPoint1.draw(ctx)
    this.endPoint2.draw(ctx)
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2,y2)
    if (drawColor) {
      const stress = mapToRange(Math.abs(this.length - this.restLength),0, this.restLength / 6, 150, 255)
      const compressed = this.length < this.restLength
      const stretched = this.length > this.restLength
      ctx.strokeStyle = `RGB(${compressed ? stress : 0}, ${stretched ? stress: 0}, 0)`
    }
    ctx.stroke()
  }

}