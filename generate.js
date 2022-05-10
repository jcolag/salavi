const fs = require('fs');

const pieces = '♔♕♖♗♘♙♚♛♜♝♞♟︎';
const head = '<!DOCTYPE html><html lang="en"><head>' +
  '<meta charset="utf-8"><title>Snakes and Ladders</title>' +
  '<link rel="stylesheet" href="style.css">' +
  '<script type="text/javascript" src="game.js"></script>' +
  '</head></body><table>';
const foot = '</table><br><button id="roll">Roll Die</button>' +
  '<br><div id="dice-tray">&nbsp;</div></body></html>';
const elements = [];
const channels = [];
let size = 4;

if (!isNaN(process.argv[2])) {
  size = Number(process.argv[2]);
}

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
  const dir = row % 2 === 1 ? 1 : -1;
  const rowClass = row % 2 === 0 ? 'rightward' : 'leftward';
  let number = row % 2 === 1 ? row * size : (row + 1) * size - 1;

  elements.push('</tr>');
  for (let col = 0; col < size; col++) {
    let dest = '';

    for (let i = 0; i < channels.length; i++) {
      const ch = channels[i];

      if (number === ch.from.y * size + ch.from.x) {
        const to = `000${ch.to.y * size + ch.to.x}`.slice(-3);

        dest = ` jump="sq${to}"`;
      }
    }

    id = `000${number}`.slice(-3);
    elements.push(`<td class="square" draagable="false" id="sq${id}" ` +
      `${dest}style="height: ${wd}vw; width: ${wd}vw;"></td>`);
    number += dir;
  }

  elements.push(`<tr class="${rowClass}">`);
}

fs.writeFileSync(
  'ladder.html',
  head + elements.reverse().join('\n') + foot
);

