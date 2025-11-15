const faces = [ '⚀', '⚁', '⚂', '⚃', '⚄', '⚅' ];
const pieces = [
  '♔', '♕', '♖', '♗', '♘', '♙',
  '♚', '♛', '♜', '♝', '♞', '♟︎'
];
const dropTargets = [];
const arrows = [];
const arrowMap = [];
let dragged = null;
let owlCell = 0;

let flipper = setInterval(
  () => {
  },
  5000
);

window.addEventListener('load', (e) => {
  const roll = document.getElementById('roll');
  const start = document.getElementById('sq000');
  const sprite = document.getElementById('owl');
  const cells = document.querySelectorAll('td');
  const nCells = cells.length;
  const target = cells[Math.trunc(Math.random() * nCells)];
  const targetRect = target.getBoundingClientRect();
  const begins = Array.from(
    document
      .getElementsByClassName('square')
    )
    .filter((s) => s.attributes['jump']);

  owlCell = target.id;
  document.addEventListener('drag', () => {}, false);
  document.addEventListener('dragover', (e) => e.preventDefault(), false);
  document.addEventListener('drop', dropPiece);
  roll.addEventListener('click', (e) => {
    rollDie();
  });
  piece = pieces[Math.trunc(Math.random() * pieces.length)];
  start.innerHTML = '<div class="game-piece" id="player-1">' +
    piece + '</div>';
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
    arrowMap.push({
      arrow: arrows.slice(-1)[0],
      from: b,
      to: document.getElementById(b.attributes['jump'].value),
    });
  });

  sprite.style.left = `${targetRect.left + 10}px`;
  sprite.style.top = `${targetRect.top + 15}px`;
  sprite.style.maxWidth = `${targetRect.width - 10}px`;

  if (target.cellIndex > target.parentElement.cells.length / 2 - 1) {
    sprite.classList.add('reverse');
  } else {
    sprite.classList.remove('reverse');
  }
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
  } else {
    moveOwl();
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
  moveOwl();
}

function moveOwl() {
  const owl = document.getElementById('owl');
  const cells = document.querySelectorAll('td');
  const nCells = cells.length;
  const jumpTo = cells[Math.trunc(Math.random() * nCells)];
  const from = owlCell;
  const row = jumpTo.parentElement;

  owlCell = jumpTo.id;
  jumpSprite('owl', document.getElementById(from), jumpTo);

  if (jumpTo.cellIndex > row.cells.length / 2 - 1) {
    owl.classList.add('reverse');
  } else {
    owl.classList.remove('reverse');
  }
}

function fight() {
  const player = document.getElementById('player-1');
  const home = document.getElementById('sq000');

  if (player.parentElement.id === owlCell) {
    player.innerHTML = pow;
    player.classList.add('spin');
    player.parentElement.removeChild(player);
    home.appendChild(player);
  }
}

function changeArrow(fromId) {
  const sq = document.getElementById(fromId);
  const connected = arrowMap.filter((a) => a.from === sq || a.to === sq);

  if (connected.length === 0) {
    return;
  }

  const map = connected[Math.floor(Math.random() * connected.length)];
  const squares = Array.from(document.getElementsByClassName('square'));
  const target = squares[
    Math.floor(Math.random() * squares.length)
  ];

  if (map.from === sq) {
    map.arrow.setOptions({
      start: LeaderLine.pointAnchor(
        target,
        {
          x: '50%',
          y: '50%',
        }
      )
    });
  } else {
    map.arrow.setOptions({
      end: LeaderLine.pointAnchor(
        target,
        {
          x: '50%',
          y: '50%',
        }
      )
    });
  }
}

function jumpSprite(spriteName, fromCell, toCell, after = null, duration = 1000) {
  const sprite = document.getElementById(spriteName);
  const startRect = fromCell.getBoundingClientRect();
  const endRect = toCell.getBoundingClientRect();
  const startX = startRect.left;
  const startY = startRect.top;
  const endX = endRect.left;
  const endY = endRect.top;

  const peakHeight = -100;
  const startTime = performance.now();

  function animate(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const progress = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const x = startX + (endX - startX) * t;
    const y = startY + (endY - startY) * t + peakHeight * (1 - 4 * (t - 0.5) ** 2);

    sprite.style.left = `${x + 10}px`;
    sprite.style.top = `${y + 15}px`;

    if (t < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
  fight();
}

