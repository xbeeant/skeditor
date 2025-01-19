// 导入RxJS的Subscription类，用于处理流订阅
import { Subscription } from 'rxjs';

/**
 * Disposable类用于管理资源的释放，以确保在对象不再使用时正确地释放资源
 * 它可以包含多个需要被释放的资源或子资源（例如订阅或函数），并在dispose方法被调用时统一释放这些资源
 */
export class Disposable {
  // 存储需要被释放的资源或子资源的数组
  protected _disposables: ((() => void) | Subscription | Disposable)[] = [];
  // 标记当前实例是否已经被释放
  protected _disposed = false;

  /**
   * 释放所有注册的资源或子资源
   * 如果资源是一个函数，则调用该函数
   * 如果资源是一个Disposable实例，则调用其dispose方法
   * 如果资源是一个Subscription实例，则调用其unsubscribe方法
   * 最后清空资源数组，并将_disposed标记为true
   */
  dispose() {
    this._disposables.forEach((fn) => {
      if (typeof fn === 'function') {
        // 如果资源是一个函数，执行该函数以释放资源
        fn();
      } else if (fn instanceof Disposable) {
        // 如果资源是一个Disposable实例，调用其dispose方法释放资源
        fn.dispose();
      } else {
        // 如果资源是一个Subscription实例，调用其unsubscribe方法释放资源
        fn.unsubscribe();
      }
    });
    // 清空资源数组
    this._disposables.length = 0;
    // 将_disposed标记为true，表示资源已释放
    this._disposed = true;
  }
}
