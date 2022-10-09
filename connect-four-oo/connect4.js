/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
/*
const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2

let board = []; // array of rows, each row is array of cells  (board[y][x])
*/
/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

class Game {
  constructor(height, width) {
    // tested for number
    if (!Number.isInteger(height) || !Number.isInteger(width)) {
      throw new Error(`Height'${height}' and Width'${width}'  is not a number`);
    }

    if (+height < 4 || +width < 4) {
      throw new Error(
        `Height'${height}'and Width '${width}'must be upto 4 to connect four`
      );
    }
    // Properties game
    // set height to HEIGHT holder
    // set the color
    // set playboard 1 and 2
    this.HEIGHT = +height;
    this.WIDTH = +width;
    this.play1Board = 1;
    this.play2Board = 2;
    this.currPlayer = "";
    this.play1Color = "";
    this.play2Color = "";

    // Method
    this.resetPlay();
    // Method
    this.startButton();

    // Property playtime is set to boolean
    this.playTime = true;
  }
  // Method return function
  getHeight() {
    return this.HEIGHT;
  }

  getWidth() {
    return this.WIDTH;
  }

  iFplayTime() {
    return this.playTime;
  }

  setPlayTime() {
    this.playTime = true;
  }

  setNoPlayTime() {
    this.playTime = false;
  }

  switchPlayers() {
    // switch the players

    this.currPlayer === this.play1Board
      ? (this.currPlayer = this.play2Board)
      : (this.currPlayer = this.play1Board);
  }

  resetPlay() {
    this.currPlayer = this.play1Board;
  }

  // Make the game board
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.getHeight(); y++) {
      this.board.push(Array.from({ length: this.getWidth() }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const htmlBoard = document.getElementById("board");

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    this.bindHolder = this.handleClick.bind(this);
    top.addEventListener("click", this.bindHolder);
    // run for loop and append headCell width
    for (let x = 0; x < this.getWidth(); x++) {
      const headCellHolder = document.createElement("td");
      headCellHolder.setAttribute("id", x);
      top.append(headCellHolder);
    }

    htmlBoard.append(top);

    // make main part of board
    // run for loop and append row
    for (let y = 0; y < this.getHeight(); y++) {
      const rowHolder = document.createElement("tr");

      for (let x = 0; x < this.getWidth(); x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        rowHolder.append(cell);
      }

      htmlBoard.append(rowHolder);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.getHeight() - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.classList.add("g1");
    piece.classList.add("g2");
    piece.classList.add("g3");
    piece.classList.add("g4");
    piece.classList.add("g5");
    piece.style.backgroundColor = this.colorOfCurrPlayer();
    piece.style.top = -50 * (y + 2);

    const pieceHolder = document.getElementById(`${y}-${x}`);
    pieceHolder.append(piece);
  }

  /** endGame:  game end */

  endGame(msg) {
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    if (!this.iFplayTime()) {
      const x = +evt.target.id;
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }

      this.board[y][x] = this.getPlayerNum();
      this.placeInTable(y, x);

      // check for win
      if (this.checkForWin()) {
        this.setPlayTime();
        return this.endGame(`Player with ${this.colorOfCurrPlayer()} won!`);
      }

      // check for tie
      if (this.board.every((row) => row.every((cell) => cell))) {
        this.setPlayTime();
        return this.endGame("Tie!");
      }

      // switch players
      this.switchPlayers();
    }
  }

  colorOfCurrPlayer() {
    // return the color for the current player
    if (this.currPlayer === this.play1Board) {
      return this.play1Color;
    }
    return this.play2Color;
  }
  // let  sets the color for the  player
  setPlayerColor(player, color) {
    if (color.length > 0) {
      if (player === 1) {
        if (color !== this.play1Color) {
          this.play2Color = color;
        }
      } else {
        if (color !== this.play2Color) {
          this.play1Color = color;
        }
      }
    }
  }

  getPlayerNum() {
    // return the number for the current player
    if (this.currPlayer === this.play1Board) {
      return this.play1Board;
    } else {
      return this.play2Board;
    }
  }

  eventButton(e) {
    if (this.colorOfCurrPlayer() === "") {
      console.log("color of curr player");
      const play1Color = document.getElementById("colx");
      const play2Color = document.getElementById("coly");
      this.setPlayerColor(1, play1Color.value);
      this.setPlayerColor(2, play2Color.value);

      const containerHolder = document.getElementById("container");
    }

    this.resetPlay();
    this.makeBoard();
    const board = document.getElementById("board");
    board.innerHTML = "";
    this.makeHtmlBoard();

    this.setNoPlayTime();
  }

  startButton() {
    const btnStart = document.getElementById("start-game");
    this.bindHolder = this.eventButton.bind(this);
    btnStart.addEventListener("click", this.bindHolder);
  }

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match the player

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.getHeight() &&
          x >= 0 &&
          x < this.getWidth() &&
          this.board[y][x] === this.getPlayerNum()
      );
    };

    for (let y = 0; y < this.getHeight(); y++) {
      for (let x = 0; x < this.getWidth(); x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

let gameHolder = new Game(6, 7, "red", "green");
