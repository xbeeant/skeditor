import invariant from 'ts-invariant';
import { Rect } from './rect';

/**
 * 表示一个具有 x 和 y 坐标的点。
 */
export class Point {
  /**
   * 构造函数，创建一个新的 Point 实例。
   * @param x - 点的 x 坐标，默认为 0。
   * @param y - 点的 y 坐标，默认为 0。
   */
  constructor(public x: number = 0, public y: number = 0) {}

  /**
   * 从鼠标事件中创建一个点。
   * 如果提供了 `pt` 参数，则更新该点的坐标，否则创建一个新的点。
   * @param e - 鼠标事件对象。
   * @param pt - 可选的点对象，如果提供则更新其坐标。
   * @returns 返回更新后的点或新创建的点。
   */
  static clientPointFromMouseEvent(e: MouseEvent, pt?: Point) {
    if (pt !== undefined) {
      pt.x = e.clientX;
      pt.y = e.clientY;
      return pt;
    } else {
      return new Point(e.clientX, e.clientY); // 修复了原代码中的错误：应使用 clientX 和 clientY
    }
  }

  /**
   * 从字符串解析并创建一个点。
   * 字符串格式应为 `{x, y}`。
   * @param str - 表示点的字符串。
   * @returns 返回根据字符串创建的新点。
   * @throws 如果字符串格式不正确，则抛出错误。
   */
  static fromPointString(str: string) {
    const result = /{(.*), (.*)}/.exec(str);
    if (!result) throw Error('无效的点格式: ' + str);
    return new Point(parseFloat(result[1]), parseFloat(result[2]));
  }

  /**
   * 计算三角形 ABC 中角 B 的角度（以弧度为单位）。
   * 使用余弦定理计算角度。
   * @param A - 第一个点。
   * @param B - 中心点。
   * @param C - 第二个点。
   * @returns 返回角 B 的角度（以弧度为单位）。
   */
  static calcAngleABC(A: Point, B: Point, C: Point) {
    const AB = A.distanceTo(B);
    const BC = B.distanceTo(C);
    const AC = C.distanceTo(A);
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
  }

  /**
   * 根据矩形的比例和位置调整点的位置。
   * @param rect - 用于调整点位置的矩形。
   * @returns 返回调整后的点实例。
   */
  applyFrame(rect: Rect) {
    this.x = this.x * rect.width + rect.x;
    this.y = this.y * rect.height + rect.y;
    return this;
  }

  /**
   * 将点平移指定的距离。
   * @param pt - 包含平移距离的点。
   * @returns 返回平移后的点实例。
   */
  translate(pt: Point) {
    this.x += pt.x;
    this.y += pt.y;
    return this;
  }

  /**
   * 移动点到新的位置。
   * @param x - 沿 x 轴移动的距离。
   * @param y - 沿 y 轴移动的距离。
   * @returns 返回移动后的点实例。
   */
  move(x: number, y: number) {
    this.x += x;
    this.y += y;
    return this;
  }

  /**
   * 缩放点的坐标。
   * @param x - 沿 x 轴缩放的比例。
   * @param y - 沿 y 轴缩放的比例。
   * @returns 返回缩放后的点实例。
   */
  scale(x: number, y: number) {
    this.x *= x;
    this.y *= y;
    return this;
  }

  /**
   * 创建一个新的点，并将其缩放。
   * @param x - 沿 x 轴缩放的比例。
   * @param y - 沿 y 轴缩放的比例。
   * @returns 返回新的缩放后的点实例。
   */
  scaleNew(x: number, y: number) {
    return this.clone().scale(x, y);
  }

  /**
   * 克隆当前点，返回一个新的点实例。
   * @returns 返回克隆的点实例。
   */
  clone() {
    return new Point(this.x, this.y);
  }

  /**
   * 将点转换为字符串表示形式。
   * @returns 返回点的字符串表示形式，格式为 `(x, y)`。
   */
  toString() {
    return `(${this.x | 0}, ${this.y | 0})`;
  }

  /**
   * 将点转换为 SVG 或 CSS 中的变换字符串。
   * @returns 返回点的变换字符串，格式为 `translate(x y)`。
   */
  toAttrString() {
    return `translate(${this.x} ${this.y})`;
  }

  /**
   * 将点转换为数组形式。
   * @returns 返回包含 x 和 y 坐标的数组。
   */
  toArray() {
    return [this.x, this.y];
  }

  /**
   * 计算当前点与其他点之间的距离。
   * @param other - 另一个点。
   * @returns 返回两点之间的欧几里得距离。
   */
  distanceTo(other: Point) {
    return Math.hypot(this.x - other.x, this.y - other.y);
  }

  /**
   * 计算点到原点的距离（即向量的长度）。
   * @returns 返回点的长度。
   */
  length() {
    return Math.hypot(this.x, this.y);
  }

  /**
   * 创建一个以当前点为中心的矩形，并扩展指定的填充距离。
   * @param padding - 矩形的填充距离。
   * @returns 返回新的矩形实例。
   */
  inflateRect(padding: number) {
    return new Rect(this.x - padding, this.y - padding, padding * 2, padding * 2);
  }

  /**
   * 创建一个新的点，其坐标为当前点与另一个点的坐标之和。
   * @param pt - 另一个点。
   * @returns 返回新的点实例。
   */
  add(pt: Point) {
    return new Point(this.x + pt.x, this.y + pt.y);
  }

  /**
   * 创建一个新的点，其坐标为当前点与另一个点的坐标之差。
   * @param pt - 另一个点。
   * @returns 返回新的点实例。
   */
  minus(pt: Point) {
    return new Point(this.x - pt.x, this.y - pt.y);
  }

  /**
   * 创建一个新的点，其坐标为当前点的坐标乘以给定的比例。
   * @param d - 缩放比例。
   * @returns 返回新的点实例。
   */
  multiply(d: number) {
    return new Point(this.x * d, this.y * d);
  }

  /**
   * 将点归一化为单位向量。
   * @returns 返回新的单位向量点实例。
   * @throws 如果向量长度为零，则抛出错误。
   */
  norm() {
    const d = Math.hypot(this.x, this.y);
    invariant(d !== 0, '无法对长度为零的向量进行归一化');
    return new Point(this.x / d, this.y / d);
  }

  /**
   * 旋转点，返回新的旋转后的点。
   * @param radian - 旋转的角度（以弧度为单位）。
   * @returns 返回新的旋转后的点实例。
   */
  rotate(radian) {
    const x2 = Math.cos(radian) * this.x - Math.sin(radian) * this.y;
    const y2 = Math.sin(radian) * this.x + Math.cos(radian) * this.y;

    return new Point(x2, y2);
  }

  /**
   * 计算两个点之间的差异，并返回一个新的点表示差异。
   * 如果提供了 `ret` 参数，则更新该点的坐标，否则创建一个新的点。
   * @param from - 起始点。
   * @param to - 目标点。
   * @param ret - 可选的点对象，如果提供则更新其坐标。
   * @returns 返回表示差异的新点或更新后的点。
   */
  static diff(from: Point, to: Point, ret?: Point) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    if (ret !== undefined) {
      ret.x = dx;
      ret.y = dy;
      return ret;
    } else {
      return new Point(dx, dy);
    }
  }
}
