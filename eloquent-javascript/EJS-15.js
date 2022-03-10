let cvS = document.querySelector("#canvasShapes").getContext("2d");

const { height, width } = cvS.canvas;

function trapezoid(xPos, yPos, size, largerSide = size / 3) {
  const top =
    largerSide > 0 ? (largerSide > size ? largerSide : largerSide) : size;
  const bottom =
    largerSide < 0 ? (largerSide < -size ? -largerSide : -largerSide) : size;

  cvS.beginPath();
  cvS.moveTo(xPos - top, yPos - size);
  cvS.lineTo(xPos + top, yPos - size);
  cvS.lineTo(xPos + bottom, yPos + size);
  cvS.lineTo(xPos - bottom, yPos + size);
  cvS.closePath();
  cvS.stroke();
  cvS.resetTransform();
}

trapezoid(width / 10, height / 2, 25, -45);

function diamond(xPos, yPos, size, color) {
  cvS.translate(xPos, yPos);
  cvS.fillStyle = color;
  cvS.rotate(Math.PI / 4);
  cvS.fillRect(-(size / 2), -(size / 2), size, size);
  cvS.resetTransform();
}

diamond((width / 10) * 3, height / 2, 50, "red");

function zigzagline(xPos, yPos, width, height, turns) {
  cvS.translate(xPos, yPos);
  cvS.beginPath();
  cvS.moveTo(-width, -height);
  for (let i = 1; i < turns * 2; i++) {
    let turnDistance = height / turns;
    cvS.lineTo(width, -height + turnDistance * i);
    i++;
    cvS.lineTo(-width, -height + turnDistance * i);
  }
  cvS.stroke();
  cvS.resetTransform();
}

zigzagline((width / 10) * 5, height / 2, 40, 40, 6);

function spiral(xPos, yPos, radius, turns) {
  cvS.translate(xPos, yPos);
  cvS.beginPath();
  for (let i = 0; i < 360; i++) {
    let angle = i * Math.PI * (turns / radius / 12);
    let dist = (radius * i) / 100;
    cvS.lineTo(Math.cos(angle) * dist, Math.sin(angle) * dist);
  }
  cvS.stroke();
  cvS.resetTransform();
}
spiral((width / 10) * 7, height / 2, 15, 3);

function star(xPos, yPos, width, height, points, color) {
  cvS.fillStyle = color;
  cvS.translate(xPos, yPos);
  cvS.rotate(-Math.PI / 2);
  cvS.beginPath();
  for (let i = 0; i <= points; i++) {
    const angle = ((2 * Math.PI) / points) * i;
    cvS.quadraticCurveTo(
      0,
      0,
      width * Math.cos(angle),
      height * Math.sin(angle)
    );
  }
  cvS.fill();
  cvS.resetTransform();
}

star((width / 10) * 9, height / 2, 50, 50, 8, "orange");

// Pie Chart Exercise
const results = [
  { name: "Satisfied", count: 150, color: "silver" },
  { name: "Neutral", count: 563, color: "lightgreen" },
  { name: "Unsatisfied", count: 510, color: "pink" },
  { name: "No comment", count: 175, color: "lightblue" },
];
const cvPC = document.querySelector("#canvasPieChart").getContext("2d");
const total = results.reduce((sum, { count }) => sum + count, 0);
let currentAngle = -0.5 * Math.PI;

const centerX = cvPC.canvas.width / 2,
  centerY = cvPC.canvas.height / 2;
const pieChartRadius = 100;
const textLabelRadius = 105;

// Add code to draw the slice labels in this loop.
for (let result of results) {
  let sliceAngle = (result.count / total) * 2 * Math.PI;
  const middleOfSlice = currentAngle + 0.5 * sliceAngle;
  cvPC.beginPath();
  cvPC.arc(
    centerX,
    centerY,
    pieChartRadius,
    currentAngle,
    currentAngle + sliceAngle
  );
  currentAngle += sliceAngle;
  cvPC.lineTo(centerX, centerY);
  cvPC.fillStyle = result.color;
  cvPC.fill();
  cvPC.font = "15px Arial";
  cvPC.fillStyle = "black";
  const textX = Math.cos(middleOfSlice) * textLabelRadius + centerX;
  const textY = Math.sin(middleOfSlice) * textLabelRadius + centerY;
  cvPC.textAlign = Math.cos(middleOfSlice) < 0 ? "end" : "";
  cvPC.textBaseline = Math.sin(middleOfSlice) < 0 ? "bottom" : "top";
  cvPC.fillText(result.name, textX, textY);

  // A Bouncing Ball exercise

  let cvBB = document.querySelector("#canvasBouncingBall").getContext("2d");

  class Vec {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    plus(otherVec) {
      return new Vec(this.x + otherVec.x, this.y + otherVec.y);
    }
    minus(otherVec) {
      return new Vec(this.x + otherVec.x, this.y + otherVec.y);
    }
    times(factor) {
      return new Vec(this.x * factor, this.y * factor);
    }
    get length() {
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
  }

  class Ball {
    constructor(pos, speed, radius) {
      this.pos = pos;
      this.speed = speed;
      this.radius = radius;
    }
    update(step) {
      this.pos = this.collision(step);
    }
    collision(step) {
      let newPos = this.pos.plus(this.speed.times(step * 100));
      if (
        newPos.x - this.radius < 0 ||
        newPos.x + this.radius >= cvBB.canvas.width
      ) {
        this.speed.x *= -1;
      }
      if (
        newPos.y - this.radius < 0 ||
        newPos.y + this.radius >= cvBB.canvas.height
      ) {
        this.speed.y *= -1;
      }
      return newPos;
    }
  }
  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      updateAnimation(Math.min(100, time - lastTime) / 1000);
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function updateAnimation(step) {
    redBall.update(step);
    cvBB.fillStyle = "red";
    cvBB.beginPath();
    cvBB.arc(redBall.pos.x, redBall.pos.y, redBall.radius, 0, Math.PI * 2);
    cvBB.closePath();
    cvBB.clearRect(0, 0, cvBB.canvas.width, cvBB.canvas.height);
    cvBB.fill();
  }
  let redBall = new Ball(
    new Vec(
      Math.random() * cvBB.canvas.width,
      Math.random() * cvBB.canvas.height
    ),
    new Vec((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10),
    10
  );
}
