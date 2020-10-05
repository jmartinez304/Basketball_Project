let csvLines;
let shotX = [];
let shotY = [];
let shotTeam = [];
let shotStatus = [];
let shot;
let shots = [];
let lines = [];
var theCourt;
let fade = [];
let fadeCounter = 255;
let drawCounter = 0;
var count = 9999;

function preload() {

  /**
   * This preload-function loads the CSV because JavaScript needs 
   * to load it first because it does not do a good job running 
   * things in parallel.
   */

  table = loadTable("nba_gsw_cle.csv", "csv", "header");
  // csvLines = loadStrings('nba_gsw_cle.csv');
}

function setup() {
  // Canvas Creation
  createCanvas(501, 1001);
  frameRate(0.5);
  background(200);
  fill(200);
  circle(249, 35, 20);
  circle(249, 963, 20);


  let rowCount = table.getRowCount();
  let counter = 0;
  for (let i = 0; i < rowCount; i++) {
    if (table.getString(i, 8) === "shot" || table.getString(i, 8) === "miss") {
      shotX[counter] = table.getNum(i, 15);
      shotY[counter] = table.getNum(i, 16);
      shotTeam[counter] = table.getString(i, 7);
      shotStatus[counter] = table.getString(i, 11);
      console.log(table.getNum(i, 15) + ", " + table.getNum(i, 16) + ", " + table.getString(i, 7) + ", " + table.getString(i, 11));
      shots[counter] = new Shot(table.getNum(i, 15), table.getNum(i, 16), table.getString(i, 7), table.getString(i, 11));
      counter++;
    }
  }
}

function draw() {
  stroke(0);
  fill(200);
  circle(249, 35, 20);
  circle(249, 963, 20);

  if (drawCounter >= 1) {
    shots[drawCounter - 1].update();
    for (i = 0; i < drawCounter; i++) {
      shots[i].drawEllipses();
    }
  }

  if (drawCounter <= (shots.length - 1)) {
    // shots[drawCounter].visualize();
    shots[drawCounter].drawLines();
    shots[drawCounter].drawEllipses();
    // console.log("The drawCounter count: " + drawCounter);
    // Create update method to update fadeCounter
    if (drawCounter >= 5) {
      // shots[drawCounter - 5].update();
      // background(240);
    }
    drawCounter++;
  }

}

class Shot {
  constructor(shotX, shotY, shotTeam, shotStatus) {
    this.shotX = shotX;
    this.shotY = shotY;
    this.shotTeam = shotTeam;
    this.shotStatus = shotStatus;
    let xMap = map(this.shotX, 0, 50, 0, width);
    // console.log("xMap: " + xMap);
    let yMap = map(this.shotY, 94, 0, 0, height);
    // console.log("yMap: " + yMap);
    this.xShotLocation = Math.floor(xMap);
    this.xShotLocation = Math.ceil(this.xShotLocation);
    this.xShotLocation = Math.round(this.xShotLocation);
    this.yShotLocation = Math.floor(yMap);
    this.yShotLocation = Math.ceil(this.yShotLocation);
    this.yShotLocation = Math.round(this.yShotLocation);
  }

  drawEllipses() {
    strokeWeight(0.5);
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
    strokeWeight(0.5);
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

  update() {

    // Build the line as a property of the object and then delete it.
    strokeWeight(3);
    stroke(200, 200, 200, 255);
    if (this.shotTeam === "GSW") {
      line(this.xShotLocation, this.yShotLocation, 249, 963);
    } else {
      line(this.xShotLocation, this.yShotLocation, 249, 35);
    }

  }
}