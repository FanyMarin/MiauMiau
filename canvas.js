// import {randomIntFromRange, randomColor, distance} from "./utils.js"

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "FF7F66"];

//helper functions
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

//Stars
function star(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.velocity = {
    x: randomIntFromRange(-5, 5),
    y: 3
  };
  this.gravity = 1;
  this.friction = 0.8;
}

star.prototype.draw = function() {
  ctx.save();
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  ctx.fillStyle = this.color;
  ctx.shadowColor = "#E3EAEF";
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.closePath();
  ctx.restore();
};

star.prototype.update = function() {
  this.draw();

  //when ball hits bottom of screen
  if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
    this.velocity.y = -this.velocity.y * this.friction;
    this.shatter();
  } else {
    this.velocity.y += this.gravity;
  }

  //whan ball hits side of screen
  if (
    this.x + this.radius + this.velocity.x > canvas.width ||
    this.x - this.radius <= 0
  ) {
    this.velocity.x = -this.velocity.x * this.friction;
    this.shatter();
  }

  this.x += this.velocity.x;
  this.y += this.velocity.y;
};

star.prototype.shatter = function() {
  this.radius -= 3;
  for (let i = 0; i < 8; i++) {
    miniStars.push(new miniStar(this.x, this.y, 2));
  }
  console.log(miniStars);
};

function miniStar(x, y, radius, color) {
  this.y = y;
  this.x = x;
  this.radius = radius;
  this.color = color;
  this.velocity = {
    x: randomIntFromRange(-5, 5),
    y: randomIntFromRange(-15, 15)
  };
  this.gravity = 0.1;
  this.friction = 0.8;
  this.ttl = 100; // ttl= time to live
  this.opacity = 1;
}

miniStar.prototype.draw = function() {
  ctx.save();
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  ctx.fillStyle = `rgba(227, 234, 239, ${this.opacity})`;
  ctx.shadowColor = "#E3EAEF";
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.closePath();
  ctx.restore();
};

miniStar.prototype.update = function() {
  this.draw();

  //when ball hits bottom of screen
  if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
    this.velocity.y = -this.velocity.y * this.friction;
  } else {
    this.velocity.y += this.gravity;
  }
  this.x += this.velocity.x;
  this.y += this.velocity.y;
  this.ttl -= 1;
  this.opacity -= 1 / this.ttl;
};

function createMountainRange(mountainAmount, height, color) {
  for (let i = 0; i < mountainAmount; i++) {
    const mountainWidth = canvas.width / mountainAmount;
    ctx.beginPath();
    ctx.moveTo(i * mountainWidth, canvas.height);
    ctx.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height);
    ctx.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height);
    ctx.lineTo(i * mountainWidth - 325, canvas.height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }
}

//Implementation
const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, "#171E26");
backgroundGradient.addColorStop(1, "#3F586B");

let stars;
let miniStars;
let backgroundStars;
let ticker = 0;
let randomSpawnRate = 75;
let groundHeight = 100;

function init() {
  stars = [];
  miniStars = [];
  backgroundStars = [];

  // for (let i = 0; i < 1; i++) {
  //   stars.push(new star(canvas.width / 2, 30, 30, "#E3EAEF"));
  // }

  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 3;
    backgroundStars.push(new star(x, y, radius, "white"));
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  ctx.fillStyle = backgroundGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  backgroundStars.forEach(backgroundStar => {
    backgroundStar.draw();
  });

  createMountainRange(1, canvas.height - 200, "#384551");
  createMountainRange(2, canvas.height - 300, "#2B3843");
  createMountainRange(3, canvas.height - 400, "#26333E");
  ctx.fillStyle = "#182028";
  ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

  stars.forEach((star, index) => {
    star.update();
    if (star.radius == 0) {
      stars.splice(index, 1);
    }
  });

  miniStars.forEach((miniStar, index) => {
    miniStar.update();
    if (miniStar.ttl == 0) {
      miniStars.splice(index, 1);
    }
  });

  ticker++;
  if (ticker % randomSpawnRate == 0) {
    const radius = 12;
    const x = Math.max(radius, Math.random() * canvas.width - radius);
    stars.push(new star(x, -100, radius, "white"));
    randomSpawnRate = randomIntFromRange(75, 200);
  }
}

init();
animate();
