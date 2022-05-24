const faces = [ '⚀', '⚁', '⚂', '⚃', '⚄', '⚅' ];
const pieces = [
  '♔', '♕', '♖', '♗', '♘', '♙',
  '♚', '♛', '♜', '♝', '♞', '♟︎'
];
const dropTargets = [];
const arrows = [];
let dragged = null;

window.addEventListener('load', (e) => {
  const roll = document.getElementById('roll');
  const start = document.getElementById('sq000');
  const begins = Array.from(
    document
      .getElementsByClassName('square')
    )
    .filter((s) => s.attributes['jump']);

  document.addEventListener('drag', () => {}, false);
  document.addEventListener('dragover', (e) => e.preventDefault(), false);
  document.addEventListener('drop', dropPiece);
  roll.addEventListener('click', (e) => {
    rollDie();
  });
  start.innerHTML = '<span class="game-piece" id="player-1">' +
    pieces[Math.trunc(Math.random() * pieces.length)] +
    '</span>';
  begins.forEach((b) => {
    const up = b.id < b.attributes['jump'].value
    const style = {
      color: up ? 'transparent' : 'green',
      dash: {
        animation: true,
      },
      dropShadow: up,
      endPlug: up ? 'square' : 'arrow3',
      endPlugColor: up ? 'brown' : 'green',
      endPlugOutline: !up,
      endPlugOutlineColor: up ? 'brown' : 'transparent',
      outline: up,
      outlineColor: up ? 'brown' : 'transparent',
      path: up ? 'straight' : 'fluid',
    };
    arrows.push(
      new LeaderLine(
        LeaderLine.pointAnchor(
          b,
          {
            x: '50%',
            y: '50%',
          },
        ),
        LeaderLine.pointAnchor(
          document.getElementById(b.attributes['jump'].value),
          {
            x: '50%',
            y: '50%',
          }
        ),
        style
      )
    );
  });
});

function rollDie() {
  const tray = document.getElementById('dice-tray');
  const roll = Math.trunc(Math.random() * 6) + 1;
  const button = document.getElementById('roll');
  const p1 = document.getElementById('player-1');
  const sqid = p1.parentElement.id.replace(/^[0a-z]*/g, '');
  const square = sqid.length === 0 ? 0 : Number(sqid);
  const id = 'sq' + `000${square + roll}`.slice(-3);
  const target = document.getElementById(id);

  dropTargets.length = 0;
  tray.innerHTML = `<b>${faces[roll - 1]}</b>`;
  p1.draggable = true;
  p1.addEventListener('dragstart', dragPiece);

  if (target) {
    button.disabled = true;
    dropTargets.push(id);
    target.classList.add('highlight-box');
  }
}

function dragPiece(event) {
  dragged = event.target;
}

function dropPiece(event) {
  const roll = document.getElementById('roll');
  var target = event.target;
  if (dropTargets.indexOf(target.id) < 0) {
    return;
  }

  if (target.className.indexOf('game-piece') >= 0) {
    target = target.parentElement;
  }

  roll.disabled = false;
  event.preventDefault();
  dragged.draggable = false;
  dragged.parentNode.removeChild(dragged);
  target.appendChild(dragged);
  target.classList.remove('highlight-box');

  if (target.attributes['jump']) {
    const id = target.attributes['jump'].value.toString();
    const goto = document.getElementById(id);

    dragged.parentNode.removeChild(dragged);
    goto.appendChild(dragged);
  }

  dragged = null;
}

function changeArrow(fromId) {
  const sq = document.getElementById(fromId);
  const connected = arrows.filter((a) => a.start === sq || a.end === sq);
  const arrow = connected[Math.floor(Math.random() * connected.length)];
  const squares = Array.from(document.getElementsByClassName('square'));
  const target = squares[
    Math.floor(Math.random() * squares.length)
  ];

  if (arrow.start === sq) {
    arrow.start = LeaderLine.pointAnchor(
      target,
      {
        x: '50%',
        y: '50%',
      }
    );
  } else {
    arrow.end = LeaderLine.pointAnchor(
      target,
      {
        x: '50%',
        y: '50%',
      }
    );
  }
}
