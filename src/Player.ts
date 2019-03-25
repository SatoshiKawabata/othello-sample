import { IOthello } from "./App";

export class AI implements IPlayer {
  isAI: boolean = true;
  constructor(public stoneType: "white" | "black") {}

  getNextCell(state: IOthello): Promise<{x: number, y: number, type: "white" | "black"}> {
    return new Promise(res => {
      // ここで外部APIに問い合わせる
      setTimeout(() => {
        const { length } = state[this.stoneType].placeableCells;
        const cell = state[this.stoneType].placeableCells[Math.floor(Math.random() * length)];
        res({
          x: cell.x,
          y: cell.y,
          type: this.stoneType
        });
      }, 100);
    });
  }
}

export class Player implements IPlayer {
  isAI: boolean = false;
  constructor(public stoneType: "white" | "black") {}
  getNextCell(state: IOthello): Promise<{x: number, y: number, type: "white" | "black"}> {
    return null;
  }
}

export interface IPlayer {
  stoneType: "white" | "black";
  isAI: boolean;
  getNextCell(state: IOthello): Promise<{x: number, y: number, type: "white" | "black"}>;
}