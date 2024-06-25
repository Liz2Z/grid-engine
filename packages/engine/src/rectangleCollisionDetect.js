/**
 * 矩形碰撞检测
 * @数据格式对应
 * [0,0,3,3] <=> [Top,Left,Height,Width]
 *
 * @碰撞检查
 * rect1: [T1,L1,H1,W1] rect2: [T2,L2,H2,W2]
 *
 * Y轴：
 * rect1中心点：T1 + H1/2
 * rect2中心点：T2 + H2/2
 * 距离：
 * (T2 + H2/2) - (T1 + H1/2)
 * 最小碰撞距离：
 * H1/2 + H2/2
 *
 * */
export default function rectangleCollisionDetect(rect1, rect2) {
  const { top: t1, left: l1, height: h1, width: w1 } = rect1;
  const { top: t2, left: l2, height: h2, width: w2 } = rect2;

  const isYAxisCollision = Math.abs(t2 - t1 + (h2 - h1) / 2) < (h1 + h2) / 2;
  const isXAxisCollision = Math.abs(l2 - l1 + (w2 - w1) / 2) < (w1 + w2) / 2;
  return isYAxisCollision && isXAxisCollision;
}
