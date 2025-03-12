import { Pterodactyl } from './pterodactyl.js';
import { RockGenerator } from './rock.js';

export class Game {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB);
    
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.position.z = 5;
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('game-container').appendChild(this.renderer.domElement);
    
    this.addLights();
    
    this.pterodactyl = new Pterodactyl();
    this.scene.add(this.pterodactyl.object);
    
    this.rockGenerator = new RockGenerator(this.scene);
    
    this.isGameOver = false;
    this.score = 0;
    this.scoreElement = document.getElementById('score');
    this.gameOverElement = document.getElementById('game-over');
    
    this.controls = {
      up: false,
      down: false,
      left: false,
      right: false
    };
    
    this.clock = new THREE.Clock();
    this.lastScoreUpdate = 0;
    
    this.setupTouchControls();
    this.animate();
  }

  addLights() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
  }

  setupTouchControls() {
    const gameContainer = document.getElementById('game-container');

    // Обработка начала касания
    gameContainer.addEventListener('touchstart', (event) => {
      event.preventDefault();
      if (this.isGameOver) {
        this.restartGame();
        return;
      }

      const touch = event.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;

      this.handleTouch(x, y);
    }, { passive: false });

    // Обработка движения пальца
    gameContainer.addEventListener('touchmove', (event) => {
      event.preventDefault();
      const touch = event.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;

      this.handleTouch(x, y);
    }, { passive: false });

    // Обработка окончания касания
    gameContainer.addEventListener('touchend', (event) => {
      event.preventDefault();
      this.controls.up = false;
      this.controls.down = false;
      this.controls.left = false;
      this.controls.right = false;
    }, { passive: false });

    // Поддержка мыши для тестирования на десктопе
    gameContainer.addEventListener('mousedown', (event) => {
      if (this.isGameOver) {
        this.restartGame();
        return;
      }
      this.handleTouch(event.clientX, event.clientY);
    });

    gameContainer.addEventListener('mouseup', () => {
      this.controls.up = false;
      this.controls.down = false;
      this.controls.left = false;
      this.controls.right = false;
    });

    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });
  }

  handleTouch(x, y) {
    const thirdWidth = this.width / 3;
    const thirdHeight = this.height / 3;

    // Сбрасываем все состояния
    this.controls.up = false;
    this.controls.down = false;
    this.controls.left = false;
    this.controls.right = false;

    // Вертикальные зоны
    if (y < thirdHeight) {
      this.controls.up = true; // Верхняя треть экрана
    } else if (y > this.height - thirdHeight) {
      this.controls.down = true; // Нижняя треть экрана
    }

    // Горизонтальные зоны
    if (x < thirdWidth) {
      this.controls.left = true; // Левая треть экрана
    } else if (x > this.width - thirdWidth) {
      this.controls.right = true; // Правая треть экрана
    }
  }

  updateScore(elapsedTime) {
    if (elapsedTime - this.lastScoreUpdate >= 1) {
      this.score += 1;
      this.scoreElement.textContent = `Счет: ${this.score}`;
      this.lastScoreUpdate = elapsedTime;
    }
  }

  gameOver() {
    this.isGameOver = true;
    this.gameOverElement.classList.remove('hidden');
  }

  restartGame() {
    this.isGameOver = false;
    this.score = 0;
    this.scoreElement.textContent = `Счет: ${this.score}`;
    this.gameOverElement.classList.add('hidden');
    this.pterodactyl.reset();
    this.rockGenerator.reset();
    this.lastScoreUpdate = 0;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    if (this.isGameOver) {
      this.renderer.render(this.scene, this.camera);
      return;
    }
    
    const deltaTime = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();
    
    this.updateScore(elapsedTime);
    this.pterodactyl.update(this.controls, deltaTime);
    this.pterodactyl.animateWings(elapsedTime);
    this.rockGenerator.update(deltaTime, this.camera.position);
    
    if (this.pterodactyl.checkCollision(this.rockGenerator.getRocks())) {
      this.gameOver();
    }
    
    this.renderer.render(this.scene, this.camera);
  }
}
