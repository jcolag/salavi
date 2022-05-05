const faces = [ '⚀', '⚁', '⚂', '⚃', '⚄', '⚅' ];
const pieces = [
  '♔', '♕', '♖', '♗', '♘', '♙',
  '♚', '♛', '♜', '♝', '♞', '♟︎'
];

window.addEventListener('load', (e) => {
  const start = document.getElementById('sq000');

  start.innerHTML = '<span class="game-piece" id="player-1">' +
    pieces[Math.trunc(Math.random() * pieces.length)] +
    '</span>';
});
