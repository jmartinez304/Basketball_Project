let csvLines;
let xMaxSize = 2870;
let yMaxSize = 1001;
let shots = [];
let drawCounter = 0;
let cleFinalScore;
let gswFinalScore;
let slider;
let pause = false;
let firstQuarterStart;
let secondQuarterStart;
let thirdQuarterStart;
let fourthQuarterStart;
let hideMade = false;
let hideMissed = false;
let hideTwoPoints = false;
let hideThreePoints = false;
let hideFirstQuarter = false;
let hideSecondQuarter = false;
let hideThirdQuarter = false;
let hideFourthQuarter = false;
let scoreboardXEnd = 1251;
let graphXStart = 1252;

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
   * Jump to buttons
   ***********
   **/

  document.write("Jump To: ");

  // 1st Quarter Button
  let firstQuarterButton = createButton("1st Quarter");
  firstQuarterButton.mousePressed(jumpToFirstQuarter);

  // 2nd Quarter Button
  let secondQuarterButton = createButton("2nd Quarter");
  secondQuarterButton.mousePressed(jumpToSecondQuarter);

  // 3rd Quarter Button
  let thirdQuarterButton = createButton("3rd Quarter");
  thirdQuarterButton.mousePressed(jumpToThirdQuarter);

  // 4th Quarter Button
  let fourthQuarterButton = createButton("4th Quarter");
  fourthQuarterButton.mousePressed(jumpToFourthQuarter);

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

  document.write(" | ");

  // First Quarter Checkbox
  let firstQuarterBox = createCheckbox('1st QTR', true);
  firstQuarterBox.style('display', 'inline');
  firstQuarterBox.changed(hideQuarterOne);

  // Second Quarter Checkbox
  let secondQuarterBox = createCheckbox('2nd QTR', true);
  secondQuarterBox.style('display', 'inline');
  secondQuarterBox.changed(hideQuarterTwo);

  // Third Quarter Checkbox
  let thirdQuarterBox = createCheckbox('3rd QTR', true);
  thirdQuarterBox.style('display', 'inline');
  thirdQuarterBox.changed(hideQuarterThree);

  // Fourth Quarter Checkbox
  let fourthQuarterBox = createCheckbox('4th QTR', true);
  fourthQuarterBox.style('display', 'inline');
  fourthQuarterBox.changed(hideQuarterFour);

  // Canvas Creation
  createCanvas(xMaxSize, yMaxSize);
  frameRate(slider.value());
  background(0);
  fill(200);
  rect(0, 0, 501, yMaxSize)
  circle(249, 35, 20);
  circle(249, 963, 20);
  fill(255);
  rect(502, 0, scoreboardXEnd, yMaxSize);
  rect(graphXStart, 0, xMaxSize, yMaxSize);

  // Filtering the CSV list in order to get shots and misses
  let rowCount = table.getRowCount();
  let counter = 0;
  let quarter = 1;
  for (let i = 0; i < rowCount; i++) {
    if (table.getString(i, 8) === "shot" || table.getString(i, 8) === "miss") {
      if (quarter === table.getNum(i, 0)) {
        switch (quarter) {
          case 1:
            firstQuarterStart = counter;
            quarter++;
            break;
          case 2:
            secondQuarterStart = counter;
            quarter++;
            break;
          case 3:
            thirdQuarterStart = counter;
            quarter++;
            break;
          case 4:
            fourthQuarterStart = counter;
            quarter++;
            break;
        }
      }
      console.log(table.getNum(i, 1) + ", " + table.getNum(i, 2) + ", " + table.getNum(i, 15) + ", " + table.getNum(i, 16) + ", " + table.getString(i, 7) + ", " + table.getString(i, 11));
      shots[counter] = new Shot(table.getNum(i, 15), table.getNum(i, 16), table.getString(i, 7), table.getString(i, 11), table.getNum(i, 1), table.getNum(i, 2), table.getString(i, 17), table.getNum(i, 10), table.getNum(i, 0), table.getString(i, 3));

      // Getting shots and times for graph
      if (table.getString(i, 11) === "made") {
        if (table.getString(i, 7) === "GSW") {
          gswTimeElapsed.push(hmsToSecondsOnly(table.getString(i, 4), table.getNum(i, 0)));
          gswPoints.push(table.getNum(i, 1));
        } else {
          cleTimeElapsed.push(hmsToSecondsOnly(table.getString(i, 4), table.getNum(i, 0)));
          clePoints.push(table.getNum(i, 2));
        }
      }
      counter++;
    }
    cleFinalScore = table.getNum(i, 2);
    gswFinalScore = table.getNum(i, 1);
  }

  /** Passing Values for graph **/

  gswTimeElapsed.push("2880");
  cleTimeElapsed.push("2880");
  gswPoints.push(gswFinalScore);
  clePoints.push(cleFinalScore);
  gswNumRows = gswTimeElapsed.length;
  gswNumColumns = gswPoints.length;
  cleNumRows = cleTimeElapsed.length;
  cleNumColumns = clePoints.length;
  let cutOffIncrement = 275;
  let cutOffValue = cutOffIncrement;
  for (let i = 0; i < gswNumRows; i++) {
    if (gswTimeElapsed[i] > cutOffValue) {
      gswTimeElapsed2.push(gswTimeElapsed[i - 1]);
      gswPoints2.push(gswPoints[i - 1]);
      graphTimeValues.push(cutOffValue);
      cutOffValue += cutOffIncrement;
    }
  }

  cutOffValue = cutOffIncrement;

  for (let i = 0; i < cleNumRows; i++) {
    if (cleTimeElapsed[i] > cutOffValue) {
      cleTimeElapsed2.push(cleTimeElapsed[i - 1]);
      clePoints2.push(clePoints[i - 1]);
      cutOffValue += cutOffIncrement;
    }
  }

  gswTimeElapsed2.push(2880);
  cleTimeElapsed2.push(2880);
  graphTimeValues.push(2880);
  gswPoints2.push(gswFinalScore);
  clePoints2.push(cleFinalScore);

  gswTimeElapsed = gswTimeElapsed2;
  cleTimeElapsed = cleTimeElapsed2;
  gswPoints = gswPoints2;
  clePoints = clePoints2;
  gswNumRows = gswTimeElapsed.length;
  gswNumColumns = gswPoints.length;
  cleNumRows = cleTimeElapsed.length;
  cleNumColumns = clePoints.length;


  cleColors = [
    color(255, 0, 0),
    color(255, 0, 0),
    color(255, 0, 0),
    color(255, 0, 0)
  ]

  gswColors = [
    color(255, 215, 0),
    color(255, 215, 0),
    color(255, 215, 0),
    color(255, 215, 0)
  ]

  /** End of passing values for graph **/
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
  rect(502, 0, scoreboardXEnd, yMaxSize);
  rect(graphXStart, 0, xMaxSize, yMaxSize);

  // Redraw every previous ellipse
  if (drawCounter >= 1) {
    for (let i = 0; i < drawCounter; i++) {
      if (
        (!(shots[i].shotStatus === "made" && hideMade === true)) &&
        (!(shots[i].shotStatus === "missed" && hideMissed === true)) &&
        (!(shots[i].playPoints === 2 && hideTwoPoints === true)) &&
        (!(shots[i].playPoints === 3 && hideThreePoints === true)) &&
        (!(shots[i].playQuarter === 1 && hideFirstQuarter === true)) &&
        (!(shots[i].playQuarter === 2 && hideSecondQuarter === true)) &&
        (!(shots[i].playQuarter === 3 && hideThirdQuarter === true)) &&
        (!(shots[i].playQuarter === 4 && hideFourthQuarter === true))
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
      (!(shots[drawCounter].playPoints === 3 && hideThreePoints === true)) &&
      (!(shots[drawCounter].playQuarter === 1 && hideFirstQuarter === true)) &&
      (!(shots[drawCounter].playQuarter === 2 && hideSecondQuarter === true)) &&
      (!(shots[drawCounter].playQuarter === 3 && hideThirdQuarter === true)) &&
      (!(shots[drawCounter].playQuarter === 4 && hideFourthQuarter === true))
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
    drawScoreBoard(cleFinalScore, gswFinalScore, 'Final');
  }
  drawGraph();
}

// Shot object class. We use it to synch each shot with its specific information.
class Shot {
  constructor(shotX, shotY, shotTeam, shotStatus, gswScore, cleScore, playDescription, playPoints, playQuarter, timeRemaining) {
    this.shotX = shotX;
    this.shotY = shotY;
    this.shotTeam = shotTeam;
    this.shotStatus = shotStatus;
    this.gswScore = gswScore;
    this.cleScore = cleScore;
    this.playDescription = playDescription;
    this.playPoints = playPoints;
    this.playQuarter = playQuarter;
    this.timeRemaining = timeRemaining;

    let xMap = map(this.shotX, 0, 50, 0, 501);
    let yMap = map(this.shotY, 94, 0, 0, yMaxSize);

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
    drawScoreBoard(this.cleScore, this.gswScore, this.playQuarter, this.timeRemaining);
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

function drawScoreBoard(cleScore, gswScore, playQuarter, timeRemaining) {
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
  textSize(30);
  text('QTR: ' + playQuarter, 680, 600);
  text(timeRemaining, 680, 650);
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

function pauseGame() {
  pause = !pause;
}

function jumpToFirstQuarter() {
  drawCounter = firstQuarterStart;
}

function jumpToSecondQuarter() {
  drawCounter = secondQuarterStart;
}

function jumpToThirdQuarter() {
  drawCounter = thirdQuarterStart;
}

function jumpToFourthQuarter() {
  drawCounter = fourthQuarterStart;
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

function hideQuarterOne() {
  hideFirstQuarter = !hideFirstQuarter;
}

function hideQuarterTwo() {
  hideSecondQuarter = !hideSecondQuarter;
}

function hideQuarterThree() {
  hideThirdQuarter = !hideThirdQuarter;
}

function hideQuarterFour() {
  hideFourthQuarter = !hideFourthQuarter;
}

// function to change time format from 00:00:00 to seconds
function hmsToSecondsOnly(str, quarter) {
  let p = str.split(':'),
    s = 0,
    m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10);
    m *= 60;
  }

  return s + ((quarter - 1) * 720);
}