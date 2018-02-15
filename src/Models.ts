export const game: g.Game = g.game;
// タイルの幅
export const TILE_WIDTH: number = 32;
// タイルの高さ
export const TILE_HEIGHT: number = 32;
// 重力加速度
export const GRAVITY_ACC: number = 500;
// ホップ初速度
export const HOPPING_SPD: number = -Math.sqrt((TILE_HEIGHT * 2) * 2 * GRAVITY_ACC);
// スクロール速度
export const SCROLL_SPD = (TILE_WIDTH * 2) / (Math.abs(HOPPING_SPD) / GRAVITY_ACC * 2);
