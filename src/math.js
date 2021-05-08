const { cos, sin, PI } = Math

export class Vec2 {
  constructor(x = 0, y = 0) {
    this._x = x
    this._y = y
  }

  /**
   * Sets the coordinates of the vector given an angle in radians and a magnitude
   * @param {number} angle in radians
   * @param {number} length magnitude of the vector
   * @returns {Vec2} this vector
   */
  setByAngLen(angle = 0, magnitude = 1) {
    return this.setVec(magnitude * cos(angle), magnitude * sin(angle))
  }

  /**
   * returns x coordinate of the vector
   * @returns {number}
   */
  get x() {
    return this._x
  }

  /**
   * returns y coordinate of the vector
   * @returns {number}
   */
  get y() {
    return this._y
  }

  set x(xInput) {
    throw new Error('do not set x coordinate directly. use setVec(x,y) instead')
  }

  set y(yInput) {
    throw new Error('do not set y coordinate directly. use setVec(x,y) instead')
  }

  /**
   * @returns {number} angle of the vector in radians
   */
  get angle() {
    return Math.atan2(this._y, this._x)
  }

  /**
   * sets the angle of the vector without altering the magnitude
   * @param {number} angle new angle in radians
   */
  set angle(_angle) {
    this.setByAngLen(_angle, this.magnitude)
  }

  /**
   * Rotates the vector without changing the magnitude
   * @param {number} angle angle in radians by which to rotate the vector
   * @returns {Vec2} this vector
   */
  rotate(angle) {
    const { _x, _y } = this
    const { cos, sin } = Math
    const rad = angle
    this.setVec(_x * cos(rad) - _y * sin(rad), _x * sin(rad) + _y * cos(rad))
    return this
  }

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @returns {Vec2} this vector
   */
  setVec (x, y) {
    this._x = x,
    this._y = y
    return this
  }

  /**
   * @returns {[x: number, y: number]}
   */
  get coordinates () {
    return [ this.x, this.y ]
  }

  /**
   * @returns {number} the magnitude of this vector
   */
  get magnitude() {
    const { x, y } = this
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y,2))
  }

  /**
   * sets the magnitude of this vector without changing its direction
   */
  set magnitude(length) {
    if (length === 0 || length === -0 || this.magnitude === 0) return this.setVec(0,0)
    this.setVec(length * (this._x / this.magnitude), length * (this._y / this.magnitude))
  }

  /**
   * 
   * @param {number} length desired magnitude of vector
   * @returns {Vec2} returns new vector in the direction of this vector with specified magnitude
   */
  direction (magnitude = 1) {
    if (this.magnitude === 0) return new Vec2(0,0)
    return new Vec2(
      magnitude * (this._x / this.magnitude),
      magnitude * (this._y / this.magnitude)
    )
  }

  /**
   * translates the coordinates of a vector by x, y
   * @param {number} x 
   * @param {number} y 
   * @returns {Vec2} this vector with its coordinates translated by x, y
   */
  translate(x,y) {
    return this.setVec(this.x + x, this.y + y)
  }

  /**
   * 
   * @param {Vec2} vec vector to add to this vector 
   * @returns {Vec2} new vector which is the sum of this vector and vec
   */
  add(vec) {
    const [ x, y ] = this.coordinates
    const [ x1, y1 ] = vec.coordinates
    return new Vec2( x + x1, y + y1)
  }

  /**
   * 
   * @param {Vec2} vec vector to subtract from this vector
   * @returns {Vec2} new vector this vector - vec
   */
  subtract(vec) {
    const [ x, y ] = this.coordinates
    const [ x1, y1 ] = vec.coordinates
    return new Vec2(x - x1, y - y1)
  }

  /**
   * 
   * @param {Vec2} vec 
   * @returns {number} the magnitude of the difference of this vector and vec
   */
  distance(vec) {
    return this.subtract(vec).magnitude
  }
}

export class Vec2deg {
  constructor(x = 0, y = 0) {
    this._x = x
    this._y = y
  }

  setByAngLen(angle = 0, length = 1) {
    this._x = length * cos(angle / 360 * 2 * PI)
    this._y = length * sin(angle / 360 * 2 * PI)
    return this
  }

  get x() {
    return this._x
  }
  get y() {
    return this._y
  }

  get angle() {
    return 
  }

  rotate(angle) {
    const { _x, _y } = this
    const { PI, cos, sin } = Math
    const rad = angle * ( PI / 180 )
    this.setVec(_x * cos(rad) - _y * sin(rad), _x * sin(rad) + _y * cos(rad))
  }

  setVec (x, y) {
    this._x = x,
    this._y = y
  }

  get coordinates () {
    return [ this.x, this.y ]
  }


  get magnitude() {
    const { x, y } = this
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y,2))
  }

  set magnitude(length) {
    if (this.magnitude === 0 || length === 0) return this.setVec(0,0)
    this.setVec(length * (this._x / this.magnitude), length * (this._y / this.magnitude))
  }

  direction (length = 1) {
    return [
      length * (this._x / this.magnitude),
      length * (this._y / this.magnitude)
    ]
  }

  translate(x,y) {
    this._x += x
    this._y += y
  }

  add(vec) {
    const [ x, y ] = this.coordinates
    const [ x1, y1 ] = vec.coordinates
    return new Vec2( x + x1, y + y1)
  }
}

export function mapToRange(num, inputMin, inputMax, rangeMin, rangeMax) {
  const distFromMin = num - inputMin
  const scale = (rangeMax - rangeMin) / (inputMax - inputMin)
  return rangeMin + (scale * distFromMin) > rangeMax ? rangeMax : rangeMin + (scale * distFromMin)
}