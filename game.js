const faces = [ '⚀', '⚁', '⚂', '⚃', '⚄', '⚅' ];
const pieces = [
  '♔', '♕', '♖', '♗', '♘', '♙',
  '♚', '♛', '♜', '♝', '♞', '♟︎'
];

window.addEventListener('load', (e) => {
  const roll = document.getElementById('roll');
  const start = document.getElementById('sq000');

  roll.addEventListener('click', (e) => {
    rollDie();
  });
  start.innerHTML = '<span class="game-piece" id="player-1">' +
    pieces[Math.trunc(Math.random() * pieces.length)] +
    '</span>';
});

function rollDie() {
  const tray = document.getElementById('dice-tray');
  const roll = Math.trunc(Math.random() * 6) + 1;
  const button = document.getElementById('roll');

  tray.innerHTML = `<b>${faces[roll - 1]}</b>`;
  p1.draggable = true;

  if (document.getElementById(id)) {
    button.disabled = true;
    dropTargets.push(id);
  }
}

