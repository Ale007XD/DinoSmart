import { Game } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  if (!isWebGLAvailable()) {
    const warning = document.createElement('div');
    warning.style.position = 'absolute';
    warning.style.top = '50%';
    warning.style.left = '50%';
    warning.style.transform = 'translate(-50%, -50%)';
    warning.style.color = 'white';
    warning.style.backgroundColor = 'red';
    warning.style.padding = '20px';
    warning.style.borderRadius = '5px';
    warning.style.fontWeight = 'bold';
    warning.textContent = 'Ваш браузер не поддерживает WebGL. Попробуйте использовать другой браузер.';
    document.getElementById('game-container').appendChild(warning);
    return;
  }

  new Game();
});

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}
