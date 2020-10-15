let csvLines;
let xMaxSize = 1501;
let yMaxSize = 1001;
let shots = [];
let drawCounter = 0;
let cleFinalScore;
let gswFinalScore;
let slider;
// var soundEffect;

function preload() {

  /**
   * This preload-function loads the CSV because JavaScript needs 
   * to load it first because it does not do a good job running 
   * things in parallel.
   */

  table = loadTable("nba_gsw_cle.csv", "csv", "header");
  // soundEffect = loadSound("Swish.mp3");
}

function setup() {
  // Framerate slider
  document.write("Control framerate: ");
  slider = createSlider(0.25, 5, 0.25, 0.25);

  // Playback buttons

  // Reset
  document.write(" | ");
  document.write("Reset Game: ");
  var resetButton = createButton("reset");
  resetButton.mousePressed(resetGame);

  // Back
  document.write(" | ");
  document.write("Back: ");
  var resetButton = createButton("back");
  resetButton.mousePressed(rewind);

  // Forward
  document.write(" | ");
  document.write("Forward: ");
  var resetButton = createButton("forward");
  resetButton.mousePressed(forward);

  // Forward
  document.write(" | ");
  document.write("End Game: ");
  var resetButton = createButton("end");
  resetButton.mousePressed(endGame);

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
      shots[counter] = new Shot(table.getNum(i, 15), table.getNum(i, 16), table.getString(i, 7), table.getString(i, 11), table.getNum(i, 1), table.getNum(i, 2), table.getString(i, 17));
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
    shots[drawCounter - 1].updateCourt();
    for (i = 0; i < drawCounter; i++) {
      shots[i].drawEllipses();
    }
  }

  // Draw new ellipse with line
  if (drawCounter <= (shots.length - 1)) {
    shots[drawCounter].drawLines();
    shots[drawCounter].drawEllipses();
    shots[drawCounter].updateScoreBoard();
    shots[drawCounter].drawPlayBoard();
    // console.log("The drawCounter count: " + drawCounter);
    drawCounter++;
  } else {
    drawScoreBoard(cleFinalScore, gswFinalScore);
  }
}

class Shot {
  constructor(shotX, shotY, shotTeam, shotStatus, gswScore, cleScore, playDescription) {
    this.shotX = shotX;
    this.shotY = shotY;
    this.shotTeam = shotTeam;
    this.shotStatus = shotStatus;
    this.gswScore = gswScore;
    this.cleScore = cleScore;
    this.playDescription = playDescription;
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
        // soundEffect.play();
      } else {
        fill(0);
      }
    } else {
      stroke(255, 0, 0);
      if (this.shotStatus === "made") {
        fill(255, 0, 0);
        // soundEffect.play();
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

  // Method to erase the previous lines
  updateCourt() {
    strokeWeight(4);
    stroke(200, 200, 200, 255);
    if (this.shotTeam === "GSW") {
      line(this.xShotLocation, this.yShotLocation, 249, 963);
    } else {
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
  drawCounter -= 2;
}

function forward() {
  drawCounter += 1;
}

function endGame() {
  drawCounter = shots.length;
}