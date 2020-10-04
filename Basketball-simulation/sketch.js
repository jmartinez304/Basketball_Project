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

  startT = millis();
  // Canvas Creation
  createCanvas(501, 1001);
  frameRate(10);
  background(255);
  circle(249, 35, 20);
  circle(249, 963, 20);
  fill(100, 100, 100);

  let rowCount = table.getRowCount();
  let counter = 0;
  for (let i = 0; i < rowCount; i++) {
    if (table.getString(i, 8) === "shot" || table.getString(i, 8) === "miss") {
      shotX[counter] = table.getNum(i, 15);
      shotY[counter] = table.getNum(i, 16);
      shotTeam[counter] = table.getString(i, 7);
      shotStatus[counter] = table.getString(i, 11);
      console.log(table.getNum(i, 15) + ", " + table.getNum(i, 16) + ", " + table.getString(i, 7) + ", " + table.getString(i, 11))
      shots[counter] = new Shot(table.getNum(i, 15), table.getNum(i, 16), table.getString(i, 7), table.getString(i, 11));
      counter++;
    }
  }
}

function draw() {
  if (drawCounter >= 1) {
    shots[drawCounter - 1].update();
    for (i = 0; i < drawCounter; i++) {
      shots[i].drawEllipses();
    }
  }

  if (drawCounter <= (shots.length - 1)) {
    // shots[drawCounter].visualize();
    strokeWeight(1);
    shots[drawCounter].drawLines();
    shots[drawCounter].drawEllipses();
    console.log("The drawCounter count: " + drawCounter);
    // Create update method to update fadeCounter
    if (drawCounter >= 5) {
      // shots[drawCounter - 5].update();
      // background(240);
    }
    drawCounter++;
  }
  // while (count >= 1) {
  //   console.log("Count: " + count);
  //   count--;
  // }
}

class Shot {
  constructor(shotX, shotY, shotTeam, shotStatus) {
    this.shotX = shotX;
    this.shotY = shotY;
    this.shotTeam = shotTeam;
    this.shotStatus = shotStatus;
    let xMap = map(this.shotX, 0, 50, 0, width);
    console.log("xMap: " + xMap);
    let yMap = map(this.shotY, 94, 0, 0, height);
    console.log("yMap: " + yMap);
    this.xShotLocation = Math.floor(xMap);
    this.xShotLocation = Math.ceil(this.xShotLocation);
    this.xShotLocation = Math.round(this.xShotLocation);
    this.yShotLocation = Math.floor(yMap);
    this.yShotLocation = Math.ceil(this.yShotLocation);
    this.yShotLocation = Math.round(this.yShotLocation);
  }

  drawEllipses() {
    if (this.shotTeam === "GSW") {
      stroke(255, 255, 0);
      if (this.shotStatus === "made") {
        fill(255, 255, 0);
      } else {
        fill(0);
      }
    } else {
      // stroke(255, 0, 0);
      if (this.shotStatus === "made") {
        fill(255, 0, 0);
      } else {
        fill(0);
      }
    }
    ellipse(this.xShotLocation, this.yShotLocation, 10, 10);
    console.log("Ellipse X: " + this.xShotLocation + ", Ellipse Y: " + this.yShotLocation);
  }

  drawLines() {
    if (this.shotTeam === "GSW") {
      if (this.shotStatus === "made") {
        stroke(255, 255, 0, fade[fadeCounter]);
      } else {
        stroke(0, fade[fadeCounter]);
      }
      line(this.xShotLocation, this.yShotLocation, 249, 963);
    } else {
      // stroke(255, 0, 0);
      if (this.shotStatus === "made") {
        stroke(255, 0, 0, fade[fadeCounter]);
      } else {
        stroke(0, fade[fadeCounter]);
      }
      line(this.xShotLocation, this.yShotLocation, 249, 35);
    }
  }

  update() {

    // Build the line as a property of the object and then delete it.
    strokeWeight(2);
    stroke(255, 255, 255, 255);
    if (this.shotTeam === "GSW") {
      line(this.xShotLocation, this.yShotLocation, 249, 963);
    } else {
      line(this.xShotLocation, this.yShotLocation, 249, 35);
    }

    circle(249, 35, 20);
    circle(249, 963, 20);
    fill(100, 100, 100);
  }
}