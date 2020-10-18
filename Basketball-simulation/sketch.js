let csvLines;
let xMaxSize = 1501;
let yMaxSize = 1001;
let shots = [];
let drawCounter = 0;
let cleFinalScore;
let gswFinalScore;
let slider;
let hideMade = false;
let hideMissed = false;
let hideTwoPoints = false;
let hideThreePoints = false;
let pause = false;

function preload() {

  /**
   * This preload-function loads the CSV because JavaScript needs 
   * to load it first because it does not do a good job running 
   * things in parallel.
   */

  table = loadTable("nba_gsw_cle.csv", "csv", "header");
}

function setup() {

  /**
   ************
   * Playback buttons
   ************
   **/

  // Framerate slider
  document.write("Control framerate: ");
  slider = createSlider(0.25, 5, 1.00, 0.25);

  // Reset Game
  document.write(" | ");
  document.write("Reset Game: ");
  let resetButton = createButton("reset");
  resetButton.mousePressed(resetGame);

  // Back
  document.write(" | ");
  document.write("Back: ");
  let backButton = createButton("back");
  backButton.mousePressed(rewind);

  // Forward
  document.write(" | ");
  document.write("Forward: ");
  let forwardButton = createButton("forward");
  forwardButton.mousePressed(forward);

  // End Game
  document.write(" | ");
  document.write("End Game: ");
  let endButton = createButton("end");
  endButton.mousePressed(endGame);

  // Pause Game
  document.write(" | ");
  document.write("Pause: ");
  let pauseButton = createButton("pause");
  pauseButton.mousePressed(pauseGame);

  document.write("<br>");

  /**
   ***********
   * Filters
   ***********
   **/

  document.write("Filters: ");

  // Made Shots Checkbox
  let madeBox = createCheckbox('Made Shots', true);
  madeBox.style('display', 'inline');
  madeBox.changed(hideMadeShots);

  // Missed Shots Checkbox
  let missedBox = createCheckbox('Missed Shots', true);
  missedBox.style('display', 'inline');
  missedBox.changed(hideMissedShots);

  document.write(" | ");

  // Two Pointer Checkbox
  let twoPointsBox = createCheckbox('2 pointers', true);
  twoPointsBox.style('display', 'inline');
  twoPointsBox.changed(hideTwoPointers);

  // Three Pointer Checkbox
  let threePointsBox = createCheckbox('3 pointers', true);
  threePointsBox.style('display', 'inline');
  threePointsBox.changed(hideThreePointers);


  // Canvas Creation
  createCanvas(xMaxSize, yMaxSize);
  frameRate(slider.value());
  background(0);
  fill(200);
  rect(0, 0, 501, yMaxSize)
  circle(249, 35, 20);
  circle(249, 963, 20);
  fill(255);
  rect(502, 0, xMaxSize, yMaxSize)

  let rowCount = table.getRowCount();
  let counter = 0;
  for (let i = 0; i < rowCount; i++) {
    if (table.getString(i, 8) === "shot" || table.getString(i, 8) === "miss") {
      console.log(table.getNum(i, 1) + ", " + table.getNum(i, 2) + ", " + table.getNum(i, 15) + ", " + table.getNum(i, 16) + ", " + table.getString(i, 7) + ", " + table.getString(i, 11));
      shots[counter] = new Shot(table.getNum(i, 15), table.getNum(i, 16), table.getString(i, 7), table.getString(i, 11), table.getNum(i, 1), table.getNum(i, 2), table.getString(i, 17), table.getNum(i, 10));
      counter++;
    }
    cleFinalScore = table.getNum(i, 2);
    gswFinalScore = table.getNum(i, 1);
  }
}

function draw() {
  // Framerate can be adjusted by slider each frame
  frameRate(slider.value());

  // Redraw basketball hoops
  background(0);
  stroke(0);
  fill(200);
  rect(0, 0, 501, yMaxSize)
  circle(249, 35, 20);
  circle(249, 963, 20);
  fill(255);
  rect(502, 0, xMaxSize, yMaxSize)

  // Redraw every previous ellipse
  if (drawCounter >= 1) {
    for (i = 0; i < drawCounter; i++) {
      if (
        (!(shots[i].shotStatus === "made" && hideMade === true)) &&
        (!(shots[i].shotStatus === "missed" && hideMissed === true)) &&
        (!(shots[i].playPoints === 2 && hideTwoPoints === true)) &&
        (!(shots[i].playPoints === 3 && hideThreePoints === true))
      ) {
        shots[i].drawEllipses();
      }
    }
  }

  // Draw new ellipse with line
  if (drawCounter <= (shots.length - 1)) {
    if (
      (!(shots[drawCounter].shotStatus === "made" && hideMade === true)) &&
      (!(shots[drawCounter].shotStatus === "missed" && hideMissed === true)) &&
      (!(shots[drawCounter].playPoints === 2 && hideTwoPoints === true)) &&
      (!(shots[drawCounter].playPoints === 3 && hideThreePoints === true))
    ) {
      shots[drawCounter].drawLines();
      shots[drawCounter].drawEllipses();
      shots[drawCounter].drawPlayBoard();
    }
    shots[drawCounter].updateScoreBoard();
    // console.log("The drawCounter count: " + drawCounter);
    if (pause === false) {
      drawCounter++;
    }
  } else {
    drawScoreBoard(cleFinalScore, gswFinalScore);
  }
}

class Shot {
  constructor(shotX, shotY, shotTeam, shotStatus, gswScore, cleScore, playDescription, playPoints) {
    this.shotX = shotX;
    this.shotY = shotY;
    this.shotTeam = shotTeam;
    this.shotStatus = shotStatus;
    this.gswScore = gswScore;
    this.cleScore = cleScore;
    this.playDescription = playDescription;
    this.playPoints = playPoints;

    let xMap = map(this.shotX, 0, 50, 0, 501);
    // console.log("xMap: " + xMap);
    let yMap = map(this.shotY, 94, 0, 0, yMaxSize);
    // console.log("yMap: " + yMap);

    // Process to change float numbers to integer
    this.xShotLocation = Math.floor(xMap);
    this.xShotLocation = Math.ceil(this.xShotLocation);
    this.xShotLocation = Math.round(this.xShotLocation);
    this.yShotLocation = Math.floor(yMap);
    this.yShotLocation = Math.ceil(this.yShotLocation);
    this.yShotLocation = Math.round(this.yShotLocation);
  }

  drawEllipses() {
    strokeWeight(2);
    if (this.shotTeam === "GSW") {
      stroke(255, 215, 0);
      if (this.shotStatus === "made") {
        fill(255, 215, 0);
      } else {
        fill(0);
      }
    } else {
      stroke(255, 0, 0);
      if (this.shotStatus === "made") {
        fill(255, 0, 0);
      } else {
        fill(0);
      }
    }
    ellipse(this.xShotLocation, this.yShotLocation, 10, 10);
    // console.log("Ellipse X: " + this.xShotLocation + ", Ellipse Y: " + this.yShotLocation);
  }

  drawLines() {
    strokeWeight(2);
    if (this.shotTeam === "GSW") {
      if (this.shotStatus === "made") {
        stroke(255, 215, 0, 255);
      } else {
        stroke(0, 255);
      }
      line(this.xShotLocation, this.yShotLocation, 249, 963);
    } else {
      // stroke(255, 0, 0);
      if (this.shotStatus === "made") {
        stroke(255, 0, 0, 255);
      } else {
        stroke(0, 255);
      }
      line(this.xShotLocation, this.yShotLocation, 249, 35);
    }
  }

  updateScoreBoard() {
    drawScoreBoard(this.cleScore, this.gswScore);
  }

  drawPlayBoard() {
    textSize(25);
    stroke(0);
    fill(0);
    if (this.shotTeam === "GSW") {
      text(this.playDescription, 550, 800);
    } else {
      text(this.playDescription, 550, 200);
    }
  }

  get ShotStatus() {
    return this.shotStatus;
  }

  set ShotStatus(shotStatus) {
    this.shotStatus = shotStatus;
  }

  get PlayPoints() {
    return this.playPoints;
  }

  set PlayPoints(playPoints) {
    this.playPoints = playPoints;
  }
}

function drawScoreBoard(cleScore, gswScore) {
  textSize(50);
  stroke(255, 0, 0);
  fill(255, 0, 0);
  text('CLE', 550, 500);
  stroke(0);
  fill(0);
  text('-', 725, 500);
  stroke(255, 215, 0);
  fill(255, 215, 0);
  text('GSW', 800, 500);
  stroke(0);
  fill(0);
  text(cleScore, 550, 550);
  text(gswScore, 800, 550);
}

function resetGame() {
  drawCounter = 0;
}

function rewind() {
  if (drawCounter >= 1) {
    drawCounter -= 1;
  }
}

function forward() {
  if (drawCounter < shots.length) {
    drawCounter += 1;
  }
}

function endGame() {
  drawCounter = shots.length;
}

function hideMadeShots() {
  hideMade = !hideMade;
}

function hideMissedShots() {
  hideMissed = !hideMissed;
}

function hideTwoPointers() {
  hideTwoPoints = !hideTwoPoints;
}

function hideThreePointers() {
  hideThreePoints = !hideThreePoints;
}

function pauseGame() {
  pause = !pause;
}