const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const dinoWidth = 40;
const dinoHeight = 60;
const obstacleWidth = 20;
const obstacleHeight = 30;
const gravity = 0.6;
const jumpStrength = -12;
const dinoImg = new Image();

// 게임 변수
let dino = {
  x: 50,
  y: canvas.height - dinoHeight - 10,
  width: dinoWidth,
  height: dinoHeight,
  velocityY: 0,
  isJumping: false
};
dinoImg.src = "./img/dino.png" // 공룡 이미지 경로

let obstacles = [];
let score = 0;
let gameOver = false;

// 장애물 생성
function createObstacle() {
  const gap = Math.floor(Math.random() * 50) + 20;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - obstacleHeight - gap,
    width: obstacleWidth,
    height: obstacleHeight
  });
}

// 장애물 이동 및 충돌 검사
function moveObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= 4; // 장애물 속도

    // 장애물이 화면을 벗어나면 배열에서 제거
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      score++;
    }

    // 충돌 검사
    if (
      dino.x + dino.width > obstacles[i].x &&
      dino.x < obstacles[i].x + obstacles[i].width &&
      dino.y + dino.height > obstacles[i].y
    ) {
      gameOver = true;
    }
  }
}

// 점프 기능
function jump() {
  if (!dino.isJumping) {
    dino.velocityY = jumpStrength;
    dino.isJumping = true;
  }
}

// 공룡 이동 (점프 처리)
function moveDino() {
  dino.velocityY += gravity; // 중력 처리
  dino.y += dino.velocityY;

  // 바닥에 닿으면 점프 종료
  if (dino.y >= canvas.height - dinoHeight - 10) {
    dino.y = canvas.height - dinoHeight - 10;
    dino.velocityY = 0;
    dino.isJumping = false;
  }
}

// 게임 오버 처리
function showGameOver() {
  document.getElementById("game-over").style.display = "block";
  document.getElementById("score").style.display = "none";
}

// 게임 루프
function gameLoop() {
  if (gameOver) {
    showGameOver();
    return;
  }

  // 배경 채우기
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 공룡 그리기
  ctx.fillStyle = "green";
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

  //공룡 그리기 함수
  function drawDino() {
    if (dinoImg.complete && dinoImg.naturalHeight !== 0) {
      // 이미지가 성공적으로 로드된 경우
      ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    } else {
      // 이미지 로드 실패 시 기본 사각형 그리기
      ctx.fillStyle = "green";
      ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    }
  }
  drawDino();

  

  // 장애물 그리기
  ctx.fillStyle = "red";
  for (let i = 0; i < obstacles.length; i++) {
    ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
  }

  // 점수 표시
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 20, 30);

  // 장애물 이동
  moveObstacles();

  // 공룡 이동
  moveDino();

  // 게임 루프 반복
  requestAnimationFrame(gameLoop);
}

// 이벤트 리스너: 점프 처리
document.addEventListener("keydown", (event) => {
  if (event.key === " " || event.key === "ArrowUp") {
    jump();
  }
});

// 주기적으로 장애물 생성
setInterval(createObstacle, 2000);

// 공룡 이미지 로드 후 게임 시작
dinoImg.onload = function () {
  gameLoop(); // 게임 루프 시작
};
