// Graph variables
let gswNumRows;
let cleNumRows;
let gswNumColumns;
let cleNumColumns;
let gswTimeElapsed = [0];
let cleTimeElapsed = [0];
let gswTimeElapsed2 = [0];
let cleTimeElapsed2 = [0];
let period;
let gswPoints = [0];
let clePoints = [0];
let gswPoints2 = [0];
let clePoints2 = [0];
let DEFAULT_RADIUS = 8;
let cleColors;
let gswColors;
let gswPointsOnGraph = [];
let clePointsOnGraph = [];
let title = "Points vs Time (S)";
let highestYPoint = 110;
let graphTimeValues = [0];
let xAxisX = [];
let xAxisY = [];
let xAxisStr = [];

// Graph canvas settings
let GRAPH_ORIGINX = 1290;
let GRAPH_ORIGINY = 70;
let GRAPHH = 900;
let GRAPHW = 1580;
let ARROWW = 5;
let ARROWL = 15;

let AXESLEN = 700;

let HASHMARKL = 5;
let PADDINGX = 1;
let PADDINGY = 1;

function drawGraph() {
  drawAxes();
  drawGSWPoints();
  drawCLEPoints();
  drawLegends();
  drawTitle();
}

function drawAxes() {
  beginShape();


  vertex(GRAPH_ORIGINX, GRAPH_ORIGINY);
  vertex(GRAPH_ORIGINX, GRAPH_ORIGINY + GRAPHH); // 
  vertex(GRAPH_ORIGINX + GRAPHW, GRAPH_ORIGINY + GRAPHH); // Under
  fill(300); // This is a test measure to get rid of the black triangle in graph
  endShape();

  drawArrows();
  drawHashMarks();
}

function drawArrows() {
  fill(51);
  line(GRAPH_ORIGINX, GRAPH_ORIGINY, GRAPH_ORIGINX, GRAPH_ORIGINY - 25);
  triangle(GRAPH_ORIGINX - 5, GRAPH_ORIGINY - 25, GRAPH_ORIGINX, GRAPH_ORIGINY - 40, GRAPH_ORIGINX + 5, GRAPH_ORIGINY - 25);

  // arrow for x axis
  beginShape(TRIANGLES);
  vertex(GRAPH_ORIGINX + GRAPHW, GRAPH_ORIGINY + GRAPHH);
  vertex(GRAPH_ORIGINX + GRAPHW - ARROWL, GRAPH_ORIGINY + GRAPHH - ARROWW);
  vertex(GRAPH_ORIGINX + GRAPHW - ARROWL, GRAPH_ORIGINY + GRAPHH + ARROWW);
  endShape();
}

function drawHashMarks() {
  drawHashMarksForYAxes();
  drawHashMarksForXAxes();
}

function drawHashMarksForYAxes() {
  let numHashMarks = 110; // Currently covered in black
  let hashMarkL = GRAPH_ORIGINX;
  let hashMarkR = hashMarkL + HASHMARKL;
  let dist = (GRAPHH - PADDINGY) / numHashMarks;
  for (let i = 1; i <= numHashMarks; ++i) {
    let hashMarkY = GRAPH_ORIGINY + GRAPHH - (i * dist);
    if (i % 10 == 0) {
      drawTextForYHashMarkAtY(hashMarkY, hashMarkR, i.toString());
      stroke(51);
      line(hashMarkL, hashMarkY, hashMarkR, hashMarkY);
    }
  }
}

function drawHashMarksForXAxes() {
  let numHashMarks = cleNumRows;
  let dist = GRAPHW - 2 * PADDINGX;
  let unitDist = dist / numHashMarks;
  let startX = GRAPH_ORIGINX + PADDINGX;
  let hashMarkB = GRAPH_ORIGINY + GRAPHH - 1;
  for (let i = 0; i < numHashMarks; ++i) {
    let hashMarkX = startX + (i * unitDist);

    if (i % 2 == 0) {
      stroke(51);
      line(hashMarkX, hashMarkB + HASHMARKL, hashMarkX, hashMarkB);
      push();
      let x = hashMarkX;
      let y = hashMarkB + 5;
      translate(x, y);
      rotate(PI / 2);
      let stringTest = graphTimeValues[i].toString();
      xAxisX.push(x);
      xAxisY.push(y);
      xAxisStr.push(stringTest);
      console.log(graphTimeValues[i].toString());
      pop();
    }
  }
  // attribute name for x axis
  let x = GRAPH_ORIGINX + GRAPHW;
  let y = GRAPH_ORIGINY + GRAPHH;
  for (let i = 0; i < xAxisStr.length; i++) {
    drawTextForXHashMark(xAxisX[i] - 15, xAxisY[i] + 23, xAxisStr[i]);
  }

  drawTextForXHashMark(xAxisX[xAxisStr.length - 1] + 120, xAxisY[xAxisStr.length - 1] + 23, "seconds");
}

function drawTextForYHashMarkAtY(hashMarkY, hashMarkL, str) {
  let len = str.length * 10;
  let height = 15;
  let padding = 0;
  let x = hashMarkL - padding - len;
  let y = hashMarkY - height / 2;

  fill(50);
  textSize(23);
  text(str, x - 15, y + 12);
  text("points", GRAPH_ORIGINX - 35, GRAPH_ORIGINY - 50)
}

function drawTextForXHashMark(x, y, str) {
  fill(50);
  textSize(23);
  text(str, x, y);
}

function drawGSWPoints() {
  let distY = (GRAPHH - PADDINGY) / highestYPoint; // This is the line to change for the amount of points
  let distX = (GRAPHW - 2 * PADDINGX) / gswNumRows;

  let startX = GRAPH_ORIGINX + PADDINGX;
  let previousX;
  let previousY;
  // we do this in two passes in order for the points not overrlapped
  // by the lines.
  for (let i = 0; i < gswNumRows; ++i) {
    let val = gswPoints[i];
    let x = startX + (i * distX);
    let y = GRAPH_ORIGINY + GRAPHH - parseFloat(val) * distY;
    let gswColor = getGSWColorForBar(i % 4, x, y, DEFAULT_RADIUS, val);

    if (i > 0) {
      stroke(100);
      stroke(255, 215, 0);
      line(previousX, previousY, x, y);
    }
    // record
    gswPointsOnGraph.push({
      x: x,
      y: y,
      r: DEFAULT_RADIUS,
      gswColor: gswColor
    });
    previousX = x;
    previousY = y;
  }

  gswPointsOnGraph.forEach(function drawPoint(p) {
    fill(p.gswColor);
    noStroke();
    ellipse(p.x, p.y, p.r, p.r);
  })
}

function drawCLEPoints() {
  let distY = (GRAPHH - PADDINGY) / highestYPoint; // This is the line to change for the amount of points
  let distX = (GRAPHW - 2 * PADDINGX) / cleNumRows;

  let startX = GRAPH_ORIGINX + PADDINGX;
  let previousX;
  let previousY;
  // we do this in two passes in order for the points not overlapped
  // by the lines.
  for (let i = 0; i < cleNumRows; ++i) {
    let val = clePoints[i];
    let x = startX + (i * distX);
    let y = GRAPH_ORIGINY + GRAPHH - parseFloat(val) * distY;
    let cleColor = getCleColorForBar(i % 4, x, y, DEFAULT_RADIUS, val);

    if (i > 0) {
      stroke(100);
      stroke(255, 0, 0);
      line(previousX, previousY, x, y);
    }
    // record
    clePointsOnGraph.push({
      x: x,
      y: y,
      r: DEFAULT_RADIUS,
      cleColor: cleColor
    });
    previousX = x;
    previousY = y;
  }

  clePointsOnGraph.forEach(function drawPoint(p) {
    fill(p.cleColor);
    noStroke();
    ellipse(p.x, p.y, p.r, p.r);
  })
}

function getGSWColorForBar(index, x, y, r, val) {
  if (mouseX > x - r && mouseX < x + r && mouseY > y - r && mouseY < y + r) {
    drawToolTipForVal(val, x, y, r);
    return highlightColor;
  }
  return gswColors[index];
}

function getCleColorForBar(index, x, y, r, val) {
  if (mouseX > x - r && mouseX < x + r && mouseY > y - r && mouseY < y + r) {
    drawToolTipForVal(val, x, y, r);
    return highlightColor;
  }
  return cleColors[index];
}

function drawToolTipForVal(val, x, y, w) {
  fill(51);
  noStroke();
  textStyle(NORMAL);
  textAlign(CENTER);
  text(val, x, y - 20, w, 100);
}

function drawLegends() {
  // for the containing box
  let width = 80;
  let height = 60;
  let x = GRAPH_ORIGINX + GRAPHW - width;
  let y = GRAPH_ORIGINY;

  noFill();
  stroke(51);
  rect(x, y, width, height);

  // for contained boxes
  let padding = 10;
  let boxL = 15;
  let gap = (height - 2 * padding - 4 * boxL) / 3;
  let textPadding = 10;

  let originY = y + padding;
  let originX = x + padding;
  for (let i = 0; i < 1; ++i) {
    let curY = originY + i * (boxL + (i > 0 ? gap : 0));
    noStroke();
    fill(gswColors[i]); // Substitute for Cle and GSW colors
    rect(originX, curY, boxL, boxL);
    fill(cleColors[i]);
    rect(originX, curY + 25, boxL, boxL);

    fill(51);
    textSize(16);
    text("GSW", originX + 20, curY + 15);
    text("CLE", originX + 20, curY + 40);
  }
}

function drawTitle() {
  fill(125);
  textSize(25);
  text(title, 2075, 50);
}