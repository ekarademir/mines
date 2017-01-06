function randomInt(max=100, min=0) {
  /*
    Generates a random integer between min and max, excluding max.
  */
  min = parseInt(min);
  max = parseInt(max);
  return Math.floor(Math.random()*(max-min) + min);
}

function randomIntSequence(howMany=5, max=100, min=0){
  /*
    Generates a unique sequence of integers between min and max, excluding max.
  */

  min = parseInt(min);
  max = parseInt(max);
  let del = max-min;
  let rsq = [];
  let nonrsq = [];

  for(let i = min; i < max; i++)
    nonrsq.push(i);

  for(let i = 0; i < howMany; i++)
    rsq.push(nonrsq.splice(randomInt(nonrsq.length), 1));

  return rsq;

}

function generateField(nrow, ncol, numMines) {
  // Generates a random minefield

  let field = [];


  for(let i = 0; i < nrow; i++) {
    let row = [];
    for(let j = 0; j < ncol; j++) {
        row.push(0);   // empty areas are 0
    }

    field.push(row);
  }

  // Place the mines
  let placedMines = 0;
  while(placedMines < numMines) {
    let mrow = randomInt(nrow);
    let mcol = randomInt(ncol);

    if(field[mrow][mcol] == 0) {
      field[mrow][mcol] = -1; //mines are -1
      placedMines++;
    }
  }


  return field;
}

function populateBoard(field) {
  // creates the playing board

  let nrow = field.length;
  let ncol = field[0].length;

  for(let i = 0; i < nrow; i++) {
    for(let j = 0; j < ncol; j++) {
      // check if tile is a mine
      if(field[i][j] == -1) {
        // add one to all the tiles around it
        let right = j+1, left = j-1, top = i-1; bottom = i+1;

        // top row
        if(top >= 0) { // boundary check
          if(left >= 0) {
            if(field[top][left] > -1) {
              field[top][left]++
            }
          }
          if(right < ncol) {
            if(field[top][right] > -1) {
              field[top][right]++
            }
          }

          // top-mid
          if(field[top][j] > -1) {
            field[top][j]++
          }
        } // end top

        // bottom row
        if(bottom < nrow) { // boundary check
          if(left >= 0) {
            if(field[bottom][left] > -1) {
              field[bottom][left]++
            }
          }
          if(right < ncol) {
            if(field[bottom][right] > -1) {
              field[bottom][right]++
            }
          }

          // bottom-mid
          if(field[bottom][j] > -1) {
            field[bottom][j]++
          }
        } // end bottom

        // mid row
        if(left >= 0) {
          if(field[i][left] > -1) {
            field[i][left]++
          }
        }
        if(right < ncol) {
          if(field[i][right] > -1) {
            field[i][right]++
          }
        }
        // end mid
      } // end if tile is mine
    } // end j loop
  } // end i loop

  return field;
}

function constuctMinefield(board) {
  // determine the board size
  let nrow = board.length;
  let ncol = board[0].length;


  // Draw the board. And bind click events.

  // Begin drawing.
  let table = document.createElement("table");

  for(let i = 0; i < nrow; i++) {
    // Each row
    let tr = document.createElement("tr");
    for(let j = 0; j < ncol; j++) {
      // Each col

      flags[i][j] = 0;

      let td = document.createElement("td");
      td.setAttribute("class", "unopened");

      if(debug) {
        if(board[i][j]== -1) {
          td.setAttribute("class", "unopenedmine");
        }

        if(islands[i][j] > 0) {
          td.setAttribute("class", "unopenedzero");
        }
      }

      // A unique id for each tile.
      td.setAttribute("id", i+"-"+j);

      // Binding the click event.
      td.addEventListener("mouseup", checkTile);
      // td.addEventListener("contextmenu", placeFlag);

      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  // End drawing.

  return table;

}

function zeroIslands(board) {
  /*
    Marks islands of connected zeros.
  */

  // determine the board size
  let nrow = board.length;
  let ncol = board[0].length;

  // create a checked unchecked map and island map for the board.
  let islands = Array(nrow);
  for(let i = 0; i < nrow; i++) {
    islands[i] = Array(ncol);
  }

  function paint(r,c,board,islands,island) {
    // console.log("painting with " + island);
    islands[r][c] = island;
    // check neighbour 0 tiles if they have an island assigned.
    let top = r-1, bottom = r+1, midrow = r, right = c+1, left = c-1, midcol = c;

    // no need to check all neighbors since we raster the board top left to bottom right
    // don't go diagonal
    // if(top >= 0 && left >= 0 && board[top][left] == 0 && !islands[top][left] > 0) { // top-left
    //   // console.log("at "+r+"-"+c+" going "+top +" "+left);
    //   paint(top, left, board,islands, island);
    // }
    if(top >= 0 && board[top][midcol] == 0 && !islands[top][midcol] > 0) { // top-mid
      // console.log("at "+r+"-"+c+" going "+top +" "+midcol);
      paint(top, midcol, board,islands, island);
    }
    // if(top >= 0 && right < ncol && board[top][right] == 0 && !islands[top][right] > 0) { // top-right
    //   // console.log("at "+r+"-"+c+" going "+top +" "+right);
    //   paint(top, right, board,islands, island);
    // }
    if(right < ncol && board[midrow][right] == 0 && !islands[midrow][right] > 0) { // mid-right
      // console.log("at "+r+"-"+c+" going "+midrow +" "+right);
      paint(midrow, right, board,islands, island);
    }
    // if(bottom < nrow && right < ncol && board[bottom][right] == 0 && !islands[bottom][right] > 0) { // bottom-right
    //   // console.log("at "+r+"-"+c+" going "+bottom +" "+right);
    //   paint(bottom, right, board,islands, island);
    // }
    if(bottom < nrow && board[bottom][midcol] == 0 && !islands[bottom][midcol] > 0) { // bottom-mid
      // console.log("at "+r+"-"+c+" going "+bottom +" "+midcol);
      paint(bottom, midcol, board,islands, island);
    }
    // if(bottom < nrow && left >= 0 && board[bottom][left] == 0 && !islands[bottom][left] > 0) { // bottom-left
    //   // console.log("at "+r+"-"+c+" going "+bottom +" "+left);
    //   paint(bottom, left, board,islands, island);
    // }
    if(left >= 0 && board[midrow][left] == 0 && !islands[midrow][left] > 0) { // mid-left
      // console.log("at "+r+"-"+c+" going "+midrow +" "+left);
      paint(midrow, left, board,islands, island);
    }
    // console.log("END of island " + island);
    return islands;
  }

  // scan the board
  let nisland = 1;
  for(let i = 0; i < nrow; i++) { // Begin i loop
    for(let j = 0; j < ncol; j++) {// Begin j loop
      if(board[i][j] == 0) { // if tile is zero
        if(!islands[i][j]) { // if this tile doesn't have an assigned island
          islands = paint(i, j, board,islands, nisland);
          nisland++;
        } // end if islands
      } else { // end if tile is zero
        islands[i][j] = 0; // ths should not be a zero island.
      }
    } // end j loop
  } // end i loop

  return islands;
}


function revealTile(r,c, failed = false) {
  if(revealed[r][c] !== true) {
    revealed[r][c] = true;
    tile = document.getElementById(r+"-"+c);

    // console.log(r+"-"+c);

    let tileVal = gamingBoard[r][c];

    if(tileVal > 0){
      let txt = document.createTextNode(tileVal);
      tile.appendChild(txt);
      tile.setAttribute("class", "opened");
    } else if(tileVal == -1){
      if(failed) {
        tile.setAttribute("class", "minefail");
      } else {
        tile.setAttribute("class", "minesuccess");
      }
    } else {
      tile.setAttribute("class", "opened");
    }


  }
}

function revealIsland(island) {
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      if(island == islands[i][j]) { // if the same island?
        let top = i-1, bottom = i+1, midrow = i, right = j+1, left = j-1, midcol = j;
        revealTile(midrow, midcol);
        if(top >=0){

          revealTile(top, midcol);

          if(left>=0) {
            revealTile(top, left);
          }

          if(right < cols) {
            revealTile(top, right);
          }
        }

        if(left>=0) {
          revealTile(midrow, left);
        }

        if(right < cols) {
          revealTile(midrow, right);
        }

        if(bottom < rows){

          revealTile(bottom, midcol);

          if(left>=0) {
            revealTile(bottom, left);
          }

          if(right < cols){
            revealTile(bottom, right);
          }
        }
      }
    }
  }
}

function revealAll(failed = false) {
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      revealTile(i, j, failed);
    }
  }
}

function placeFlag(row,col) {
  tile = document.getElementById(row+"-"+col);
  if(flags[row][col] == 0) {
    tile.setAttribute("class", "flag");
    flags[row][col] = 1;
    numFlags++;
  } else {
    tile.setAttribute("class", "unopened");
    flags[row][col] = 0;
    numFlags--;
  }
}

function checkTile(e) {

  let id = e.target.getAttribute("id");
  let tile = id.split("-");
  let row = parseInt(tile[0]);
  let col = parseInt(tile[1]);

  if(e.button == 0) {
    // tile = document.getElementById(id);

    if(islands[row][col] > 0) { // if it's a zero island
      let island = islands[row][col];
      revealIsland(island);
    } // end if zero island

    if(gamingBoard[row][col] == -1) {
      revealAll(true);// failed
    }

    if(gamingBoard[row][col] > 0) {
      revealTile(row,col);
    }
  } else if (e.button == 2 && revealed[row][col] !== true) {
    placeFlag(row, col);
    if(numFlags == numMines) {
      checkGame();
    }
  }
}

function checkGame() {
  let correctFlags = 0;
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      if(flags[i][j] == 1 && gamingBoard[i][j] == -1) {
        correctFlags++;
      }
    }
  }

  if(correctFlags == numMines) {
    revealAll(false); // won
  } else {
    revealAll(true); // failed
  }
}


var minefield = document.getElementsByClassName("minesweeper")[0];
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

var debug = false;
var cols = 20, rows = 20;

var flags = Array(rows);
var revealed = Array(rows);
for (let i = 0; i < rows; i++) {
  revealed[i] = Array(cols);
  flags[i] = Array(cols);
}

var numMines = 50;
var numFlags = 0;

var field = generateField(rows, cols, numMines);
var gamingBoard = populateBoard(field);
// separate the islands of zeros.
var islands = zeroIslands(gamingBoard);

minefield.appendChild(constuctMinefield(gamingBoard));

// console.log(randomIntSequence(10, 20));
