export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}
/**
 * プレイヤークラスの基本情報
 *
 * @export
 * @interface Player
 */
export interface Player {
  width: number;    // 幅
  height: number;   // 高さ
  position: Point;  // 表示座標
}
