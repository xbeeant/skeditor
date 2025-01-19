import { Rect } from '../base/rect';
import { TileBounds, floorBinaryScale, Tile, Priority } from './tile';

import sk, { newStrokePaint } from '../util/canvaskit';
import { TileManager } from './tile-manager';
import { SkColor } from '../model';

const DebugShowCheckBoardGrid = false;
const DebugShowCheckBoardGridLow = false;

/**
 * 一个 checkerboard 只表示一个分辨率下的内容
 * 大部分的 checkerboard 都是 pow 2 scale。 只有一个 ideal scale
 */
export class Checkerboard {
  // pre should have lower scale

  // 高分辨率 checkerboard
  high?: Checkerboard;

  // 更低分辨率的 checkerboard
  low?: Checkerboard;

  // 是否是阶梯分辨率
  isStair = false;

  /**
   * 构造函数
   * @param tileManager 瓦片管理器
   * @param scale 分辨率
   */
  constructor(private tileManager: TileManager, public scale: number) {
    // 判断是否是阶梯分辨率
    this.isStair = floorBinaryScale(scale) === scale;
  }

  /**
   * 清除当前分辨率下的所有瓦片
   */
  clear() {
    this.tileManager.clearScaleTile(this.scale);
  }

  /**
   * 绘制指定瓦片
   * @param x 瓦片x坐标
   * @param y 瓦片y坐标
   */
  drawTile(x: number, y: number) {
    const canvas = this.tileManager.canvas;
    const image = this.tileManager.getTile(this.scale, x, y);
    if (image) {
      canvas.drawImageRect(image, Tile.getRect(0, 0).toSk(), Tile.getRect(x, y).toSk(), null);
    }
  }

  /**
   * 绘制其他分辨率的瓦片
   * @param otherScale 其他分辨率
   * @param x 瓦片x坐标
   * @param y 瓦片y坐标
   * @returns 是否绘制成功
   */
  drawOtherScaleTile(otherScale: number, x: number, y: number): boolean {
    const toLower = otherScale > this.scale; // 借用低分辨率，是否是使用低分辨率绘制高分辨率内容

    // 是否优先申请这个 scale 的 tile
    const highPriority = toLower && otherScale !== floorBinaryScale(otherScale);

    // scale 相对值
    const relScale = this.scale / otherScale;

    // 在 other scale 比例下需要填充的区域
    const otherFillRect = Tile.getRect(x, y);

    const curFillRect = otherFillRect.scale(relScale).roundPixel();

    const { left, top, right, bottom } = new TileBounds().fromRect(curFillRect);

    let missTile = false;

    const canvas = this.tileManager.canvas;

    canvas.save();
    canvas.clipRect(otherFillRect.toSk(), sk.CanvasKit.ClipOp.Intersect, false);

    canvas.scale(1 / relScale, 1 / relScale);

    for (let y = top; y < bottom; y++) {
      for (let x = left; x < right; x++) {
        if (this.tileManager.hasTile(this.scale, x, y)) {
          this.drawTile(x, y);
        } else {
          const checkerboard = toLower ? this.low : this.high;
          missTile = !checkerboard || !checkerboard.drawOtherScaleTile(this.scale, x, y);

          if (highPriority) {
            this.tileManager.requireTile(this.scale, x, y, missTile ? Priority.High : Priority.Middle);
          }
        }
      }
    }
    canvas.restore();
    return !missTile;
  }

  /**
   * 绘制视口
   * @param viewport 视口区域
   */
  drawViewport(viewport: Rect) {
    const { tileManager, scale } = this;

    // 先算出来，在当前 scale 下需要绘制哪些 tile
    const viewTileBounds = new TileBounds().fromRect(viewport);
    //
    const { left, top, right, bottom } = viewTileBounds;
    const contentTileBounds = this.tileManager.getContentTileBounds(this.scale);
    for (let y = top; y < bottom; y++) {
      for (let x = left; x < right; x++) {
        if (!contentTileBounds.contains(x, y)) continue;
        // simple just draw it
        if (tileManager.hasTile(scale, x, y)) {
          this.drawTile(x, y);
        } else {
          // 没有当前 tile 加入到 requirements， 但优先级比较低
          tileManager.requireTile(scale, x, y, Priority.Low);

          // 如果 high 绘制成功了
          if (!this.high?.drawOtherScaleTile(scale, x, y)) {
            this.low?.drawOtherScaleTile(scale, x, y);
          }
        }
      }
    }

    // 存下来，方便 debug
    (this as any).debugContentTileBounds = contentTileBounds;
    (this as any).debugViewportTileBounds = viewTileBounds;

    if (DebugShowCheckBoardGrid) {
      // 绘制下 lower 的 grid
      this.debugDrawViewportGrids(viewport);
      if (this.low && DebugShowCheckBoardGridLow) {
        const { canvas } = tileManager;
        canvas.save();
        const relScale = this.scale / this.low.scale;
        canvas.scale(relScale, relScale);
        this.low?.debugDrawViewportGrids(viewport, sk.CanvasKit.GREEN);
        canvas.restore();
      }
    }
  }

  /**
   * 调试绘制视口网格
   * @param viewport 视口区域
   * @param color 网格颜色
   */
  debugDrawViewportGrids(viewport: Rect, color?: SkColor) {
    const { left, top, right, bottom } = new TileBounds().fromRect(viewport);
    for (let y = top; y < bottom; y++) {
      for (let x = left; x < right; x++) {
        const debugColor =
          color ||
          (this.tileManager.debugHeavyTiles.has(this.tileManager.genKey(this.scale, x, y))
            ? sk.CanvasKit.Color(255, 0, 0, 0.5)
            : sk.CanvasKit.Color(0, 0, 255, 0.5));

        this.tileManager.canvas.drawRect(
          sk.CanvasKit.XYWHRect(x * Tile.width + 2, y * Tile.height + 2, Tile.width - 4, Tile.height - 4),
          newStrokePaint(2, debugColor)
        );
      }
    }
  }
}
