import { Point } from './point';
import SketchFormat from '@sketch-hq/sketch-file-format-ts';
import sk from '../util/canvaskit';
import { Matrix } from '.';

/**
 * 表示矩形，并提供与矩形相关的各种操作。
 */
export class Rect {
  /**
   * 构造一个矩形，指定其位置和大小。
   * @param x 矩形左上角的 x 坐标，默认为 0。
   * @param y 矩形左上角的 y 坐标，默认为 0。
   * @param width 矩形的宽度，默认为 0。
   * @param height 矩形的高度，默认为 0。
   */
  constructor(public x: number = 0, public y: number = 0, public width: number = 0, public height: number = 0) {}

  /**
   * 从 Sketch 格式的矩形创建一个新的矩形。
   * @param rect Sketch 格式的矩形对象。
   * @returns 新的矩形对象。
   */
  static fromSketchRect(rect: SketchFormat.Rect): Rect {
    return new Rect(rect.x, rect.y, rect.width, rect.height);
  }

  /**
   * 合并多个矩形，返回包含所有矩形的最小矩形。
   * @param rects 要合并的矩形数组。
   * @returns 包含所有矩形的最小矩形。
   * @throws 如果传入的矩形数组为空，则抛出错误。
   */
  static mergeRects(rects: Rect[]): Rect {
    let left = Number.MAX_SAFE_INTEGER,
      right = Number.MIN_SAFE_INTEGER,
      top = Number.MAX_SAFE_INTEGER,
      bottom = Number.MIN_SAFE_INTEGER;

    if (rects.length === 0) {
      throw new Error('参数无效');
    }

    rects.forEach((rect) => {
      const { x, y, width, height } = rect;
      left = Math.min(left, x);
      right = Math.max(right, x + width);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y + height);
    });

    return new Rect(left, top, right - left, bottom - top);
  }

  /**
   * 从 DOMRect 对象创建一个新的矩形。
   * @param rect DOMRect 对象。
   * @returns 新的矩形对象。
   */
  static fromDomRect(rect: DOMRect): Rect {
    return new Rect(rect.left, rect.top, rect.width, rect.height);
  }

  /**
   * 设置矩形的宽度和高度。
   * @param width 新的宽度。
   * @param height 新的高度。
   */
  size(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  /**
   * 判断当前矩形是否等于另一个矩形。
   * @param other 要比较的矩形。
   * @returns 如果两个矩形相等则返回 true，否则返回 false。
   */
  equals(other: Rect): boolean {
    return this.x === other.x && this.y === other.y && this.width === other.width && this.height === other.height;
  }

  /**
   * 克隆当前矩形。
   * @returns 当前矩形的副本。
   */
  clone(): Rect {
    return new Rect(this.x, this.y, this.width, this.height);
  }

  /**
   * 获取矩形的左边坐标。
   */
  get left(): number {
    return this.x;
  }

  /**
   * 获取矩形的右边坐标。
   */
  get right(): number {
    return this.x + this.width;
  }

  /**
   * 获取矩形的顶部坐标。
   */
  get top(): number {
    return this.y;
  }

  /**
   * 获取矩形的底部坐标。
   */
  get bottom(): number {
    return this.y + this.height;
  }

  /**
   * 获取矩形的中心点。
   */
  get center(): Point {
    return new Point(this.x + this.width / 2, this.y + this.height / 2);
  }

  /**
   * 获取矩形的左上角点。
   */
  get leftTop(): Point {
    return new Point(this.x, this.y);
  }

  /**
   * 在给定的 CanvasRenderingContext2D 上绘制填充矩形。
   * @param ctx CanvasRenderingContext2D 对象。
   */
  applyFill(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  /**
   * 判断给定点是否在矩形内。
   * @param pt 要检查的点。
   * @returns 如果点在矩形内则返回 true，否则返回 false。
   */
  containsPoint(pt: Point): boolean {
    return this.x <= pt.x && pt.x < this.right && this.y <= pt.y && pt.y < this.bottom;
  }

  /**
   * 返回一个扩展或收缩后的矩形。
   * @param padding 扩展或收缩的边距。
   * @returns 扩展或收缩后的矩形。
   */
  inflate(padding: number): Rect {
    return new Rect(this.x - padding, this.y - padding, this.width + padding * 2, this.height + padding * 2);
  }

  /**
   * 获取仅包含宽度和高度的矩形。
   */
  get onlySize(): Rect {
    return new Rect(0, 0, this.width, this.height);
  }

  /**
   * 返回一个偏移后的矩形。
   * @param x 水平方向的偏移量。
   * @param y 垂直方向的偏移量。
   * @returns 偏移后的矩形。
   */
  offset(x: number, y: number): Rect {
    return new Rect(this.x + x, this.y + y, this.width, this.height);
  }

  /**
   * 将矩形转换为 Sketch 的 XYWH 格式。
   * @returns Sketch 的 XYWH 格式的矩形。
   */
  toSk(): any {
    return sk.CanvasKit.XYWHRect(this.x, this.y, this.width, this.height);
  }

  /**
   * 返回一个缩放后的矩形。
   * @param s 缩放因子。
   * @returns 缩放后的矩形。
   */
  scale(s: number): Rect {
    return new Rect(this.x * s, this.y * s, this.width * s, this.height * s);
  }

  /**
   * 返回一个像素对齐后的矩形。
   * @returns 像素对齐后的矩形。
   */
  roundPixel(): Rect {
    const left = Math.floor(this.x);
    const top = Math.floor(this.y);
    const right = Math.ceil(this.x + this.width);
    const bottom = Math.ceil(this.y + this.height);
    return new Rect(left, top, right - left, bottom - top);
  }

  /**
   * 判断当前矩形是否与另一个矩形相交。
   * @param other 要比较的矩形。
   * @returns 如果两个矩形相交则返回 true，否则返回 false。
   */
  intersect(other: Rect): boolean {
    const x0 = Math.max(this.x, other.x);
    const x1 = Math.min(this.right, other.right);

    if (x1 <= x0) {
      return false;
    }

    const y0 = Math.max(this.y, other.y);
    const y1 = Math.min(this.bottom, other.bottom);

    return y1 > y0;
  }

  /**
   * 从 Float32Array 创建一个新的矩形。
   * @param arr 包含矩形数据的 Float32Array。
   * @returns 新的矩形对象。
   */
  static fromSk(arr: Float32Array): Rect {
    return new Rect(arr[0], arr[1], arr[2] - arr[0], arr[3] - arr[1]);
  }

  /**
   * 表示一个空矩形。
   */
  static Empty: Rect = new Rect(0, 0, 0, 0);

  /**
   * 从一组点创建一个新的矩形。
   * @param points 点的数组。
   * @returns 包含所有点的最小矩形。
   * @throws 如果点的数量少于 2 个，则抛出错误。
   */
  static fromPoints(points: Point[]): Rect {
    if (points.length < 2) throw new Error('需要至少两个点');

    let left = Number.MAX_SAFE_INTEGER;
    let right = Number.MIN_SAFE_INTEGER;
    let top = Number.MAX_SAFE_INTEGER;
    let bottom = Number.MIN_SAFE_INTEGER;

    points.forEach((pt) => {
      left = Math.min(left, pt.x);
      right = Math.max(right, pt.x);
      top = Math.min(top, pt.y);
      bottom = Math.max(bottom, pt.y);
    });

    return new Rect(left, top, right - left, bottom - top);
  }

  /**
   * 将内容矩形居中放置在当前矩形内，并返回缩放比例和偏移量。
   * 如果内容较小，则适当放大；如果内容较大，则缩小。
   * @param content 要布局的内容矩形。
   * @param padding 可选的内边距，默认为 0。
   * @returns 包含缩放比例和偏移量的对象。
   */
  layoutRectInCenter(content: Rect, padding = 0): { translate: Point; scale: number } {
    const actualContainer = padding ? this.inflate(-padding) : this;

    const scaleW = actualContainer.width / content.width;
    const scaleH = actualContainer.height / content.height;

    const scale = Math.min(scaleH, scaleW);

    const translate = this.center.minus(content.scale(scale).center);

    return {
      translate,
      scale,
    };
  }

  /**
   * 返回矩形的四个顶点。
   */
  toPoints(): Point[] {
    return [
      this.leftTop,
      new Point(this.x + this.width, this.y),
      new Point(this.x + this.width, this.height + this.y),
      new Point(this.x, this.y + this.height),
    ];
  }

  /**
   * 应用矩阵变换到矩形。
   * @param matrix 矩阵对象。
   * @returns 变换后的矩形。
   */
  applyMatrix(matrix: Matrix): Rect {
    return Rect.fromPoints(this.toPoints().map((pt) => matrix.apply(pt, pt)));
  }
}
