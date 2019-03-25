import * as React from "react";
import * as Othello from "othello-game-logic";
import { IPlayer, AI, Player } from "./Player";

export interface IOthello {
  board: number[][];
  gameState: string;
  white: {
    name: string;
    placeableCells: {x: number, y: number}[];
    timeLimit: number;
  }
  black: {
    name: string;
    placeableCells: {x: number, y: number}[];
    timeLimit: number;
  }
};

export default class App extends React.Component<{}, IOthello> {
  private store: any;
  private playerWhite: IPlayer;
  private playerBlack: IPlayer;

  constructor(props: any) {
    super(props);

    this.store = Othello.createStore();
    this.store.subscribe(this.handleStoreChanged);
    this.state = this.store.getState();

    // this.playerBlack = new AI("black");
    this.playerBlack = new Player("black");
    this.playerWhite = new AI("white");
  }

  private handleStoreChanged = (state: IOthello) => {
    this.setState(state);

    // スキップ
    if ((state.gameState ==="white" || state.gameState ==="black") && state[state.gameState].placeableCells.length === 0) {
      setTimeout(() => {
        this.store.dispatch(Othello.ActionCreator.skip());
      }, 1000);
    } else if (this.playerBlack.isAI && state.gameState === this.playerBlack.stoneType) {
      // 続行
      this.playerBlack.getNextCell(state).then(stone => {
        this.store.dispatch(Othello.ActionCreator.putStone(stone.x, stone.y, stone.type));
      });
    } else if (this.playerWhite.isAI && state.gameState === this.playerWhite.stoneType) {
      // 続行
      this.playerWhite.getNextCell(state).then(stone => {
        this.store.dispatch(Othello.ActionCreator.putStone(stone.x, stone.y, stone.type));
      });
    }
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <button onClick={() => {
          this.store.dispatch(Othello.ActionCreator.startGame())
        }}>start</button>
        <p>gameState {this.state.gameState}</p>
        <table>
          <tbody>
            {
              this.state.board.map((rows, y) => {
                return (
                  <tr key={`row-${y}`}>
                    {
                      rows.map((val, x) => {
                        const isPlaceable = (
                          this.state.gameState === "white"
                          || this.state.gameState ==="black")
                          && (
                            (!this.playerBlack.isAI && this.state.gameState === this.playerBlack.stoneType)
                            || (!this.playerWhite.isAI && this.state.gameState === this.playerWhite.stoneType)
                          )
                          && this.state[this.state.gameState].placeableCells.some(cell => cell.x === x && cell.y === y);
                        let str = "-";
                        if (val === 1) {
                          str = "⚪️";
                        } else if (val === -1) {
                          str = "⚫️";
                        } else if (isPlaceable) {
                          str = "□";
                        }
                        return (
                          <td key={`cell-${x}_${y}`}>
                            <button
                              disabled={!isPlaceable}
                              onClick={() => {
                                this.store.dispatch(Othello.ActionCreator.putStone(x, y, this.state.gameState));
                              }}>
                              {str}
                            </button>
                          </td>
                        );
                      })
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}