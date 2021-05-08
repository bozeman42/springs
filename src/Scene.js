import Spring from './Spring'
import Mass from './Mass'

export default class Scene {
  constructor(dampening) {
    this.masses = []
    this.springs = []
    this.dampening = dampening
  }

  clear() {
    this.masses.splice(0, this.masses.length)
    this.springs.splice(0, this.masses.length)
  }

  createGrid(posX, posY, x, y, mass, springLength, springConstant) {
    let massGrid = []
    const { springs } = this
    const diagonalLength = springLength * Math.sqrt(2)
    for(let i = 0; i < y; i++) {
      massGrid.push([])
      for(let j = 0; j < x; j++) {
        const newMass = new Mass(posX + (j * springLength), posY + (i * springLength), mass, 1 + (.005 *j * i))
        massGrid[i].push(newMass)
        this.masses.push(newMass)
      }
    }

    massGrid.forEach((row, yIndex, grid) => {
      row.forEach((massUnit, xIndex, row) => {
        const upRight = yIndex > 0 ? grid[yIndex - 1][xIndex + 1] : null
        const right =  row[xIndex + 1]
        const downRight = yIndex < massGrid.length - 1 ? grid[yIndex + 1][xIndex + 1] : null
        const down = yIndex < massGrid.length - 1 ? grid[yIndex + 1][xIndex] : null
        if (right && right.constructor.name === 'Mass') {
          springs.push(new Spring(massUnit, right, springLength, springConstant, this.dampening))
        }
        if (down && down.constructor.name === 'Mass') {
          springs.push(new Spring(massUnit, down, springLength, springConstant, this.dampening))
        }
        if (upRight && upRight.constructor.name === 'Mass') {
          springs.push(new Spring(massUnit, upRight, diagonalLength + .1, springConstant, this.dampening))
        }
        if (downRight && downRight.constructor.name === 'Mass') {
          springs.push(new Spring(massUnit, downRight, diagonalLength + .1, springConstant, this.dampening))
        }
      })
    })
  }
}