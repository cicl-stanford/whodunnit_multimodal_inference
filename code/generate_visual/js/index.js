import MarpleScene, { gridName } from "./marple-scene.js";

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 512,
  backgroundColor: "#FFF",
  parent: "game-container",
  pixelArt: true,
  scene: MarpleScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  }
};

const game = new Phaser.Game(config);

/*
 * Sources:
 * https://stackoverflow.com/questions/8126623/downloading-canvas-element-to-an-image
 * https://phaser.discourse.group/t/save-canvas-using-phaser3/2786
 * https://labs.phaser.io/edit.html?src=src\snapshot\snapshot%20game.js
 */
var download = function(canvas, filename){
  // let canvas_elem = document.getElementsByTagName('canvas')[0];
  if (canvas.getContext) {
    game.renderer.snapshot(function(image) {
      console.log('Snapshot!');
      var link = document.createElement('a');
      document.body.appendChild(link);
      link.download = gridName + '.png';
      link.href = image.src;
      link.click();
    });
  }
};

setTimeout(download, 1000, game.canvas);