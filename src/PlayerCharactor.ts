import { game, HOPPING_SPD, GRAVITY_ACC } from "./Models";
import { Player, Point, Vector } from "./Interfaces";

/**
 * プレイヤークラス
 *
 * @class PlayerCharactor
 */
class PlayerCharactor implements Player {
  width: number;
  height: number;
  position: Point;
  velocity: Vector;

  constructor(params: Player) {
    this.width = params.width;
    this.height = params.height;
    this.position = { x: params.position.x, y: params.position.y };
    this.velocity = { x: 0, y: 0 };
  }
  /**
   * フレームごとの更新処理
   *
   * @param {boolean} is_hopping trueならばプレイヤーがホップ中
   * @memberof PlayerCharactor
   */
  update(is_hopping: boolean): void {
    const dt: number = 1 / game.fps;

    if (is_hopping) {
      this.velocity.y = HOPPING_SPD;
    } else {
      const a: Vector = { x: 0, y: GRAVITY_ACC };
      this.velocity.x += a.x * dt;
      this.velocity.y += a.y * dt;
    }
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
  }
}

export { PlayerCharactor };
