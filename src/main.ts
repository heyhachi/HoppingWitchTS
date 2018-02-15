import { game, TILE_WIDTH, TILE_HEIGHT } from "./Models";
import { GameCore } from "./GameCore";
import { Tile } from "@akashic-extension/akashic-tile";

let gameCore: GameCore;
let globalCntr: number = 0;

/**
 * タイトル画面を生成する
 * @param scene シーンオブジェクト
 */
function createTitleUI(scene: g.Scene): g.E {
  const root: g.E = new g.E({ scene: scene });
  const titlePosY: number = 112;
  const title: g.Sprite = new g.Sprite({
    scene: scene,
    src: scene.assets["title"],
    x: 128, y: titlePosY
  });
  scene.update.add(() => {
    title.y = titlePosY - 24 * Math.abs(Math.sin(10 * globalCntr / 180 * Math.PI));
    title.modified();
  });
  root.append(title);

  const startBtn: g.Sprite = new g.Sprite({
    scene: scene,
    src: scene.assets["button_start"],
    x: 192, y: 272,
    touchable: true
  });

  startBtn.pointDown.add(() => {
    startBtn.x += 4;
    startBtn.y += 4;
  });

  startBtn.pointUp.add(() => {
    startBtn.x -= 4;
    startBtn.y -= 4;
    startBtn.touchable = false;
    startBtn.modified();
    scene.setTimeout(
      () => {
        gameCore.start();
        root.destroy();
      },
      100);
  });

  root.append(startBtn);

  return root;
}

/**
 * 結果画面を生成する
 * @param scene シーンオブジェクト
 */
function createResultUI(scene: g.Scene): g.E {
  const root: g.E = new g.E({ scene: scene });

  const backBtn: g.Sprite = new g.Sprite({
    scene: scene,
    src: scene.assets["button_back"],
    x: 192, y: 272,
    touchable: true
  });

  backBtn.pointDown.add(() => {
    backBtn.x += 4;
    backBtn.y += 4;
    backBtn.modified();
  });

  backBtn.pointUp.add(() => {
    backBtn.x -= 4;
    backBtn.y -= 4;
    backBtn.touchable = false;
    backBtn.modified();
    scene.setTimeout(
      () => {
        gameCore.reset();
        root.destroy();
        scene.append(createTitleUI(scene));
      },
      100);
  });

  let amp: number = game.width / 2;
  let scaleAdd: number = 1;
  const gameover: g.Sprite = new g.Sprite({
    scene: scene,
    src: scene.assets["gameover"],
    x: 80 + amp, y: 160,
    scaleX: 1 + scaleAdd,
    scaleY: 1 + scaleAdd
  });
  gameover.update.add(() => {
    amp *= -0.85;
    scaleAdd *= 0.85;
    if (Math.abs(amp) < 1) {
      amp = 0;
      scaleAdd = 0;
      root.append(backBtn);
      gameover.update.removeAll();
    }
    gameover.x = 80 + amp;
    gameover.scaleX = 1 + scaleAdd;
    gameover.scaleY = 1 + scaleAdd;
    gameover.modified();
  });
  root.append(gameover);

  return root;
}

/**
 * スコア表示用文字列を生成する
 * @param score スコア値
 * @param prefix スコアの前に付与する文字列
 */
function scoreText(score: number, prefix: string): string {
  return (prefix ? prefix : "") + " " + ("0000000" + score).substr(-8);
}

/**
 * エントリーポイント
 * @param param ゲームのエントリポイントに渡される引数。
 */
function main(param: g.GameMainParameterObject): void {
  const scene: g.Scene = new g.Scene({
    game: game,
    assetIds: [
      "background",
      "button_back",
      "button_start",
      "font16",
      "gameover",
      "glyph_area",
      "map",
      "map_data",
      "girl",
      "girl_miss",
      "title",
      "version"
    ]
  });

  /**
   * 初期化処理
   */
  scene.loaded.add(() => {
    // 以下にゲームのロジックを記述します。
    let hiScore: number = 0;

    gameCore = new GameCore(
      JSON.parse((scene.assets["map_data"] as g.TextAsset).data),
      {
        position: {
          x: game.width / 2,
          y: game.height / 2
        },
        width: (scene.assets["girl"] as g.ImageAsset).width,
        height: (scene.assets["girl"] as g.ImageAsset).height
      }
    );

    scene.append(new g.Sprite({
      scene: scene,
      src: scene.assets["background"]
    }));

    const tile: Tile = new Tile({
      scene: scene,
      src: scene.assets["map"],
      tileWidth: TILE_WIDTH,
      tileHeight: TILE_HEIGHT,
      tileData: gameCore.map
    });
    scene.append(tile);

    const pcSpr: g.Sprite = new g.Sprite({
      scene: scene,
      src: scene.assets["girl"],
      hidden: true
    });
    scene.append(pcSpr);

    const fontSize: number = 16;
    const bmpFont: g.BitmapFont = new g.BitmapFont({
      src: scene.assets["font16"],
      map: JSON.parse((scene.assets["glyph_area"] as g.TextAsset).data),
      defaultGlyphWidth: fontSize,
      defaultGlyphHeight: fontSize
    });

    const scoreLabel: g.Label = new g.Label({
      scene: scene,
      text: "",
      font: bmpFont,
      fontSize: fontSize,
      x: 4, y: 4
    });
    scene.append(scoreLabel);

    const hiScoreLabel: g.Label = new g.Label({
      scene: scene,
      text: "",
      font: bmpFont,
      fontSize: fontSize,
      x: game.width - (fontSize * scoreText(0, "HI").length + 4), y: 4
    });
    scene.append(hiScoreLabel);

    const versionText = "ver " + (scene.assets["version"] as g.TextAsset).data.replace(/[\r\n]/g, "");
    const verLabel: g.Label = new g.Label({
      scene: scene,
      text: versionText,
      font: bmpFont,
      fontSize: fontSize,
      x: game.width - (fontSize * versionText.length + 4), y: game.height - (fontSize + 4)
    });
    scene.append(verLabel);

    scene.append(createTitleUI(scene));

    /**
     * フレーム毎の処理
     */
    scene.update.add(() => {
      const prevState: string = gameCore.state;
      globalCntr++;

      // ゲーム状態更新
      gameCore.update();

      // プレイヤーキャラの描画位置など更新
      if (gameCore.playerCharactor) {
        pcSpr.show();
        pcSpr.x = gameCore.playerCharactor.position.x;
        pcSpr.y = gameCore.playerCharactor.position.y;
        pcSpr.scaleX = gameCore.scrollSpeed >= 0 ? 1 : -1;
        pcSpr.modified();
      } else {
        pcSpr.hide();
      }

      // スコア描画更新
      hiScore = Math.max(hiScore, gameCore.score);
      scoreLabel.text = scoreText(gameCore.score, "SCORE");
      scoreLabel.invalidate();
      hiScoreLabel.text = scoreText(hiScore, "HI");
      hiScoreLabel.invalidate();

      // タイル位置更新
      tile.x = -gameCore.scroll;
      tile.modified();

      // バージョンラベル表示状態更新
      gameCore.state === "title" ? verLabel.show() : verLabel.hide();

      if (prevState !== "result" && gameCore.state === "result") {
        scene.append(createResultUI(scene));
      }
    });

    scene.pointDownCapture.add(() => {
      if (gameCore.state === "playing") {
        gameCore.is_touched = true;
      }
    });

  });

  game.pushScene(scene);
}

export = main;
