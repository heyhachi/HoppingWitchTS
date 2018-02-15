import { game, SCROLL_SPD, TILE_WIDTH, TILE_HEIGHT } from "./Models";
import { PlayerCharactor } from "./PlayerCharactor";
import { Player } from "./Interfaces";

/**
 * ゲームコアクラス
 *
 * @class GameCore
 */
class GameCore {
  readonly map: number[][];
  readonly pcParams: Player;
  state: string;
  scroll: number;
  scrollSpeed: number;
  is_touched: boolean;
  playerCharactor: PlayerCharactor;
  score: number;

  constructor(map: number[][], pcParams: Player) {
    this.map = map;
    this.pcParams = pcParams;
    this.reset();
  }

  /**
   * ゲームのリセット処理
   *
   * @memberof GameCore
   */
  reset(): void {
    this.state = "title";
    this.scroll = 0;
    this.scrollSpeed = SCROLL_SPD;
    this.is_touched = false;
    this.playerCharactor = null;
    this.score = 0;
  }

  /**
   * ゲーム開始処理
   *
   * @memberof GameCore
   */
  start(): void {
    this.state = "playing";
    this.scroll = 0;
    this.scrollSpeed = SCROLL_SPD;
    this.is_touched = false;
    this.playerCharactor = new PlayerCharactor(this.pcParams);
    this.score = 0;
  }

  /**
   * マップとプレイヤー間の当たり判定処理
   *
   * @returns {boolean} trueならば接触あり
   * @memberof GameCore
   */
  checkCollision(): boolean {
    const pc: PlayerCharactor = this.playerCharactor;
    const top: number = Math.floor(pc.position.y / TILE_HEIGHT);
    const bottom: number = Math.floor((pc.position.y + pc.height) / TILE_HEIGHT);
    const left: number = Math.floor((pc.position.x + this.scroll) / TILE_WIDTH);
    const right: number = Math.floor((pc.position.x + this.scroll + pc.width) / TILE_WIDTH);

    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        if (this.map[y][x] !== -1) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * フレームごとの更新処理
   *
   * @memberof GameCore
   */
  update(): void {
    const dt = 1 / game.fps;

    if (this.state !== "result") {
      this.scroll += this.scrollSpeed * dt;
      if (this.scroll <= 0 || this.scroll >= this.map[0].length * TILE_WIDTH - game.width) {
        this.scrollSpeed *= -1;
      }

      if (this.playerCharactor) {
        this.playerCharactor.update(this.is_touched);
        if (this.checkCollision()) {
          this.state = "result";
        } else {
          ++this.score;
        }
      }
    }

    this.is_touched = false;
  }
}

export { GameCore };
