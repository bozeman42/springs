import { Vec2 } from "./math";
import Mass from './Mass'

export default class Gravity {
  constructor(x, y, masses) {
    this.acceleration = new Vec2(x, y)
    this.masses = masses
  }

  setGravity(x,y) {
    this.acceleration.setVec(x,y)
  }

  /**
   * 
   * @param {Mass} massObj 
   */
  addForceToMass(massObj, dT) {
    const [ax, ay] = this.acceleration.coordinates
    const mass = massObj.mass * dT / 1000
    const force = new Vec2(ax * mass, ay * mass)
    massObj.addForce(force)
  }
}