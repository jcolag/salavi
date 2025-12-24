const faces = [ '⚀', '⚁', '⚂', '⚃', '⚄', '⚅' ];
const pieces = [
  '♔', '♕', '♖', '♗', '♘', '♙',
  '♚', '♛', '♜', '♝', '♞', '♟︎'
];
const pow = '💥';
const dropTargets = [];
const arrows = [];
const arrowMap = [];
let dragged = null;
let owlCell = 0;
let piece = null;
let size;

let flipper = setInterval(
  () => {
  },
  5000
);

window.addEventListener('load', (e) => {
  const about = document.getElementById('about-modal');
  const config = document.getElementById('config-modal');
  const stats = document.getElementById('stats-modal');
  const openAbout = document.getElementById('help');
  const closeAbout = document.getElementById('close-about');
  const openConfig = document.getElementById('config');
  const closeConfig = document.getElementById('close-config');
  const openStats = document.getElementById('stats');
  const closeStats = document.getElementById('close-stats');
  const games = localStorage.getItem('gamesPlayed') ?? 0;

  size = localStorage.getItem('salaviBoardSize');
  localStorage.setItem('gamesPlayed', Number(games) + 1);

  if (!size) {
    size = 4;
  }

  openAbout.addEventListener(
    'click', () => {
    game.classList.add('blur');
    about.showModal();
  });
  closeAbout.addEventListener(
    'click', () => {
    game.classList.remove('blur');
    about.close();
  });
  openConfig.addEventListener(
    'click', () => {
    const sizer = document.getElementById('board-size');

    sizer.value = size;
    game.classList.add('blur');
    config.showModal();
  });
  closeConfig.addEventListener(
    'click', () => {
    const board = document.getElementById('game-board');

    game.classList.remove('blur');
    config.close();
    size = localStorage.getItem('salaviBoardSize');
    if (oldSize !== size) {
      removeAllChildren(board);
      createBoard();
      startGame();
    }
  });
  openStats.addEventListener(
    'click', () => {
      populateStats();
      game.classList.add('blur');
      stats.showModal();
    }
  );
  closeStats.addEventListener(
    'click', () => {
    game.classList.remove('blur');
    stats.close();
  });

  createBoard();
  startGame();
});

function removeAllChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.lastChild);
  }
}

function createBoard() {
  const squares = document.getElementsByClassName('square');
  const rows = [];

  arrows.forEach((a) => {
    try {
      a.remove();
    } catch(e) {
    }
  });

  if (squares.length > 0) {
    return;
  }

  const elements = [];
  const channels = [];
  const wd = 50 / size;

  for (let chan = 0; chan < size; chan++) {
    let startY = Math.floor(Math.random() * size);

    channels.push({
      from: {
        x: Math.floor(Math.random() * size),
        y: startY,
      },
      to: {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size / 2)
          + (startY > size / 2 ? 0 : (size / 2)),
      },
    });
  }

  for (let row = 0; row < size; row++) {
    const cells = [];
    const board = document.getElementById('game-board');
    const dir = row % 2 === 1 ? 1 : -1;
    const rowClass = row % 2 === 0 ? 'rightward' : 'leftward';
    const r = document.createElement('tr');
    let number = row % 2 === 1 ? row * size : (row + 1) * size - 1;

    r.classList.add('rowClass');
    for (let col = 0; col < size; col++) {
      const sq = document.createElement('td');
      const id = `000${number}`.slice(-3);
      let dest = '';

      for (let i = 0; i < channels.length; i++) {
        const ch = channels[i];

        if (number === ch.from.y * size + ch.from.x) {
          const to = `000${ch.to.y * size + ch.to.x}`.slice(-3);

          dest = `sq${to}`;
        }
      }

      sq.classList.add('square');
      sq.dragable = false;
      sq.id = `sq${id}`;
      sq.style.height = `${wd}vw`;
      sq.style.width = `${wd}vw`;

      if (dest.length > 0) {
        sq.setAttribute('jump', dest);
      }

      number += dir;
      r.insertBefore(sq, r.firstChild);
    }

    board.insertBefore(r, board.firstChild);
  }
}

function startGame() {
  const roll = document.getElementById('roll');
  const start = document.getElementById('sq000');
  const sprite = document.getElementById('owl');
  const cells = document.querySelectorAll('td');
  const token = document.createElement('div');
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

  const player = document.createTextNode(piece);

  token.classList.add('game-piece');
  token.id = 'player-1';
  token.insertBefore(player, token.firstChild);
  start.insertBefore(token, start.firstChild);
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
}

function rollDie() {
  const tray = document.getElementById('dice-tray');
  const roll = Math.trunc(Math.random() * 6) + 1;
  const button = document.getElementById('roll');
  const p1 = document.getElementById('player-1');
  const sqid = p1.parentElement.id.replace(/^[0a-z]*/g, '');
  const square = sqid.length === 0 ? 0 : Number(sqid);
  const id = 'sq' + `000${square + roll}`.slice(-3);
  const target = document.getElementById(id);
  const player = document.getElementById('player-1');
  const moved = localStorage.getItem('tilesMoved') ?? 0;

  player.innerHTML = piece;
  player.classList.remove('spin');

  dropTargets.length = 0;
  tray.innerHTML = `<b>${faces[roll - 1]}</b>`;
  p1.draggable = true;
  p1.addEventListener('dragstart', dragPiece);

  if (target) {
    button.disabled = true;
    dropTargets.push(id);
    target.classList.add('highlight-box');
    localStorage.setItem('tilesMoved', Number(moved) + roll);
  } else {
    moveOwl();
  }
}

function dragPiece(event) {
  dragged = event.target;
}

function dropPiece(event) {
  const roll = document.getElementById('roll');
  const maxSquare = `000${size * size - 1}`.slice(-3);
  const lastSq = document.getElementById(`sq${maxSquare}`);
  let target = event.target;

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
  fought = moveOwl();

  if (lastSq === target && !fought) {
    const wins = localStorage.getItem('gamesWon') ?? 0;

    localStorage.setItem('gamesWon', Number(wins) + 1);
    alert('🏆');
  }
}

function moveOwl() {
  const owl = document.getElementById('owl');
  const cells = document.querySelectorAll('td');
  const nCells = cells.length;
  const jumpTo = cells[Math.trunc(Math.random() * nCells)];
  const from = owlCell;
  const row = jumpTo.parentElement;

  owlCell = jumpTo.id;
  const fought = jumpSprite('owl', document.getElementById(from), jumpTo);

  if (jumpTo.cellIndex > row.cells.length / 2 - 1) {
    owl.classList.add('reverse');
  } else {
    owl.classList.remove('reverse');
  }

  return fought;
}

function fight() {
  const player = document.getElementById('player-1');
  const home = document.getElementById('sq000');
  const fights = localStorage.getItem('owlFights') ?? 0;

  if (player.parentElement.id === owlCell) {
    player.innerHTML = pow;
    player.classList.add('spin');
    player.parentElement.removeChild(player);
    home.appendChild(player);
    localStorage.setItem('owlFights', Number(fights) + 1);
    return true;
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
  return fight();
}

function changeBoardSize(widget) {
  const board = document.getElementById('game-board');
  const oldSize = size;

  size = widget.value;
  localStorage.setItem('salaviBoardSize', size);
  if (oldSize !== size) {
    while (board.firstChild) {
      board.removeChild(board.lastChild);
    }
function populateSingleStat(id, name) {
  const el = document.getElementById(id);
  const value = localStorage.getItem(name) ?? 0;
  const text = document.createTextNode(value);

  removeAllChildren(el);
  el.appendChild(text);
}

    startGame();
  }
}
