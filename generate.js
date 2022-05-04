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
let size = 4;

if (!isNaN(process.argv[2])) {
  size = Number(process.argv[2]);
}

const wd = 50 / size;

for (let row = 0; row < size; row++) {
  const dir = row % 2 === 1 ? 1 : -1;
  const rowClass = row % 2 === 0 ? 'rightward' : 'leftward';
  let number = row % 2 === 1 ? row * size : (row + 1) * size - 1;

  elements.push('</tr>');
  for (let col = 0; col < size; col++) {
    id = `000${number}`.slice(-3);
    elements.push(`<td class="square" draagable="false" id="sq${id}" ` +
      `style="height: ${wd}vw; width: ${wd}vw;"></td>`);
    number += dir;
  }

  elements.push(`<tr class="${rowClass}">`);
}

fs.writeFileSync(
  'ladder.html',
  head + elements.reverse().join('\n') + foot
);

