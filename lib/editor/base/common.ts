/**
 * 定义常量PI_2，等于Math.PI乘以2，用于表示圆的弧度。
 */
export const PI_2 = Math.PI * 2;

/**
 * 定义一个接口IPointData，用于表示具有x和y坐标的数据。
 */
export interface IPointData {
  x: number;
  y: number;
}

/**
 * 定义一个接口IPoint，继承自IPointData，用于表示一个点。
 * 它包含操作点数据的方法。
 */
export interface IPoint extends IPointData {
  /**
   * 从另一个IPointData对象复制数据到当前点对象。
   * @param p 要复制数据的IPointData对象。
   * @returns 返回当前点对象。
   */
  copyFrom(p: IPointData): this;

  /**
   * 将当前点对象的数据复制到另一个IPoint对象。
   * @param p 要复制数据到的IPoint对象。
   * @returns 返回被复制数据的IPoint对象。
   */
  copyTo<T extends IPoint>(p: T): T;

  /**
   * 判断当前点是否与另一个IPointData对象相等。
   * @param p 要比较的IPointData对象。
   * @returns 如果两个点相等则返回true，否则返回false。
   */
  equals(p: IPointData): boolean;

  /**
   * 设置点的坐标。
   * @param x 可选参数，点的x坐标。
   * @param y 可选参数，点的y坐标。
   */
  set(x?: number, y?: number): void;
}

/**
 * 将角度转换为弧度。
 * @param degree 角度值。
 * @returns 返回对应的弧度值。
 */
export function degreeToRadian(degree) {
  return (degree / 180) * Math.PI;
}
