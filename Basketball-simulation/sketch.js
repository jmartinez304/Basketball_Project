let csvLines;
let shots = [];
let drawCounter = 0;
let cleFinalScore;
let gswFinalScore;
var soundEffect;

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
  // Canvas Creation
  createCanvas(1001, 1001);
  frameRate(10);
  background(0);
  fill(200);
  rect(0, 0, 501, 1001)
  circle(249, 35, 20);
  circle(249, 963, 20);
  fill(255);
  rect(502, 0, 501, 1001)

  let rowCount = table.getRowCount();
  let counter = 0;
  for (let i = 0; i < rowCount; i++) {
    if (table.getString(i, 8) === "shot" || table.getString(i, 8) === "miss") {
      console.log(table.getNum(i, 1) + ", " + table.getNum(i, 2) + ", " + table.getNum(i, 15) + ", " + table.getNum(i, 16) + ", " + table.getString(i, 7) + ", " + table.getString(i, 11));
      shots[counter] = new Shot(table.getNum(i, 15), table.getNum(i, 16), table.getString(i, 7), table.getString(i, 11), table.getNum(i, 1), table.getNum(i, 2));
      counter++;
    }
    cleFinalScore = table.getNum(i, 2);
    gswFinalScore = table.getNum(i, 1);
  }
}

function draw() {
  // Redraw basketball hoops
  background(0); 
  stroke(0);
  fill(200);
  rect(0, 0, 501, 1001)
  circle(249, 35, 20);
  circle(249, 963, 20);
  fill(255);
  rect(502, 0, 501, 1001)

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
    // console.log("The drawCounter count: " + drawCounter);
    drawCounter++;
  } else {
    drawScoreBoard(cleFinalScore, gswFinalScore);
  }

}

class Shot {
  constructor(shotX, shotY, shotTeam, shotStatus, gswScore, cleScore) {
    this.shotX = shotX;
    this.shotY = shotY;
    this.shotTeam = shotTeam;
    this.shotStatus = shotStatus;
    this.gswScore = gswScore;
    this.cleScore = cleScore;
    let xMap = map(this.shotX, 0, 50, 0, 501);
    // console.log("xMap: " + xMap);
    let yMap = map(this.shotY, 94, 0, 0, 1001);
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
}

function drawScoreBoard(cleScore, gswScore) {
  textSize(50);
  stroke(255, 0, 0);
  fill(255, 0, 0);
  text('CLE', 550, 450);
  stroke(0);
  fill(0);
  text('-', 725, 450);
  stroke(255, 215, 0);
  fill(255, 215, 0);
  text('GSW', 800, 450);
  stroke(0);
  fill(0);
  text(cleScore, 550, 500);
  text(gswScore, 800, 500);
}