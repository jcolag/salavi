const faces = [ '⚀', '⚁', '⚂', '⚃', '⚄', '⚅' ];
const pieces = [
  '♔', '♕', '♖', '♗', '♘', '♙',
  '♚', '♛', '♜', '♝', '♞', '♟︎'
];

window.addEventListener('load', (e) => {
  const roll = document.getElementById('roll');
  const start = document.getElementById('sq000');

  document.addEventListener('drag', () => {}, false);
  document.addEventListener('dragover', (e) => e.preventDefault(), false);
  document.addEventListener('drop', dropPiece);
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
  const p1 = document.getElementById('player-1');

  tray.innerHTML = `<b>${faces[roll - 1]}</b>`;
  p1.draggable = true;
  p1.addEventListener('dragstart', dragPiece);

  if (document.getElementById(id)) {
    button.disabled = true;
    dropTargets.push(id);
  }
}

function dragPiece(event) {
  dragged = event.target;
}
function dropPiece(event) {
  var target = event.target;

  if (target.className.indexOf('game-piece') >= 0) {
    target = target.parentElement;
  }

  event.preventDefault();
  dragged.parentNode.removeChild(dragged);
  target.appendChild(dragged);
  dragged = null;
}
function ignore(event) {
  event.preventDefault();
}
