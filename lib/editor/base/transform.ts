import { Matrix } from './matrix';
import { ObservablePoint } from './observable-point';

/**
 * 负责处理其版本的变换类。
 *
 * @class
 * @memberof PIXI
 */
export class Transform {
  /**
   * 默认（单位）变换。
   *
   * @static
   * @constant
   * @member {PIXI.Transform}
   */
  public static readonly IDENTITY = new Transform();

  /**
   * 世界变换矩阵。
   *
   * @member {PIXI.Matrix}
   */
  public worldTransform: Matrix;

  /**
   * 局部变换矩阵。
   *
   * @member {PIXI.Matrix}
   */
  public localTransform: Matrix;

  /**
   * 对象相对于父级局部坐标的坐标。
   *
   * @member {PIXI.ObservablePoint}
   */
  public position: ObservablePoint;

  /**
   * 对象的缩放因子。
   *
   * @member {PIXI.ObservablePoint}
   */
  public scale: ObservablePoint;

  /**
   * 显示对象旋转的中心点（枢轴点）。
   *
   * @member {PIXI.ObservablePoint}
   */
  public pivot: ObservablePoint;

  /**
   * 对象在 x 和 y 轴上的倾斜量。
   *
   * @member {PIXI.ObservablePoint}
   */
  public skew: ObservablePoint;

  /**
   * 父级世界变换的唯一本地 ID，用于计算当前世界变换矩阵。
   *
   * @protected
   * @member {number}
   */
  private _parentID: number;

  /**
   * 世界变换的唯一本地 ID。
   *
   * @protected
   * @member {number}
   */
  private _worldID: number;

  /**
   * 旋转角度。
   *
   * @protected
   * @member {number}
   */
  protected _rotation: number;

  /**
   * 局部 X 轴的标准化 X 坐标值（不带缩放），即局部变换矩阵的第一列。
   *
   * @protected
   * @member {number}
   */
  protected _cx: number;

  /**
   * 局部 X 轴的标准化 Y 坐标值（不带缩放），即局部变换矩阵的第一列。
   *
   * @protected
   * @member {number}
   */
  protected _sx: number;

  /**
   * 局部 Y 轴的标准化 X 坐标值（不带缩放），即局部变换矩阵的第二列。
   *
   * @protected
   * @member {number}
   */
  protected _cy: number;

  /**
   * 局部 Y 轴的标准化 Y 坐标值（不带缩放），即局部变换矩阵的第二列。
   *
   * @protected
   * @member {number}
   */
  protected _sy: number;

  /**
   * 局部变换的唯一本地 ID。
   *
   * @protected
   * @member {number}
   */
  protected _localID: number;

  /**
   * 当前用于计算局部变换矩阵的唯一本地 ID。
   *
   * @protected
   * @member {number}
   */
  protected _currentLocalID: number;

  /**
   * 构造函数，初始化变换对象。
   */
  constructor() {
    this.worldTransform = new Matrix();
    this.localTransform = new Matrix();
    this.position = new ObservablePoint(this.onChange, this, 0, 0);
    this.scale = new ObservablePoint(this.onChange, this, 1, 1);
    this.pivot = new ObservablePoint(this.onChange, this, 0, 0);
    this.skew = new ObservablePoint(this.updateSkew, this, 0, 0);

    this._rotation = 0;
    this._cx = 1;
    this._sx = 0;
    this._cy = 0;
    this._sy = 1;
    this._localID = 0;
    this._currentLocalID = 0;
    this._worldID = 0;
    this._parentID = 0;
  }

  /**
   * 当属性值发生变化时调用。
   *
   * @protected
   */
  protected onChange(): void {
    this._localID++;
  }

  /**
   * 当倾斜或旋转发生变化时调用。
   *
   * @protected
   */
  protected updateSkew(): void {
    this._cx = Math.cos(this._rotation + this.skew.y);
    this._sx = Math.sin(this._rotation + this.skew.y);
    this._cy = -Math.sin(this._rotation - this.skew.x); // cos, added PI/2
    this._sy = Math.cos(this._rotation - this.skew.x); // sin, added PI/2

    this._localID++;
  }

  // #if _DEBUG
  /**
   * 返回变换对象的字符串表示形式，用于调试。
   *
   * @returns 变换对象的字符串表示形式。
   */
  toString(): string {
    return (
      `[@pixi/math:Transform ` +
      `position=(${this.position.x}, ${this.position.y}) ` +
      `rotation=${this.rotation} ` +
      `scale=(${this.scale.x}, ${this.scale.y}) ` +
      `skew=(${this.skew.x}, ${this.skew.y}) ` +
      `]`
    );
  }
  // #endif

  /**
   * 更新局部变换矩阵。
   */
  updateLocalTransform(): void {
    const lt = this.localTransform;

    if (this._localID !== this._currentLocalID) {
      // 根据变换属性设置显示对象的矩阵值。
      lt.a = this._cx * this.scale.x;
      lt.b = this._sx * this.scale.x;
      lt.c = this._cy * this.scale.y;
      lt.d = this._sy * this.scale.y;

      lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
      lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
      this._currentLocalID = this._localID;

      // 强制更新。
      this._parentID = -1;
    }
  }

  /**
   * 更新局部和世界变换矩阵。
   *
   * @param parentTransform - 父级变换对象。
   */
  updateTransform(parentTransform: Transform): void {
    const lt = this.localTransform;

    if (this._localID !== this._currentLocalID) {
      // 根据变换属性设置显示对象的矩阵值。
      lt.a = this._cx * this.scale.x;
      lt.b = this._sx * this.scale.x;
      lt.c = this._cy * this.scale.y;
      lt.d = this._sy * this.scale.y;

      lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
      lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
      this._currentLocalID = this._localID;

      // 强制更新。
      this._parentID = -1;
    }

    if (this._parentID !== parentTransform._worldID) {
      // 将父级矩阵与对象的变换矩阵相乘。
      const pt = parentTransform.worldTransform;
      const wt = this.worldTransform;

      wt.a = lt.a * pt.a + lt.b * pt.c;
      wt.b = lt.a * pt.b + lt.b * pt.d;
      wt.c = lt.c * pt.a + lt.d * pt.c;
      wt.d = lt.c * pt.b + lt.d * pt.d;
      wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
      wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;

      this._parentID = parentTransform._worldID;

      // 更新变换的 ID。
      this._worldID++;
    }
  }

  /**
   * 分解矩阵并根据其设置变换属性。
   *
   * @param matrix - 要分解的矩阵。
   */
  setFromMatrix(matrix: Matrix): void {
    matrix.decompose(this);
    this._localID++;
  }

  /**
   * 获取对象的旋转角度（以弧度为单位）。
   *
   * @member {number}
   */
  get rotation(): number {
    return this._rotation;
  }

  /**
   * 设置对象的旋转角度（以弧度为单位）。
   *
   * @param value - 新的旋转角度。
   */
  set rotation(value: number) {
    if (this._rotation !== value) {
      this._rotation = value;
      this.updateSkew();
    }
  }
}
