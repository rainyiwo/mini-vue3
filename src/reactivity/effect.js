// effect.js
let activeEffect = null
// WeakMap 对象是一组键/值对的集合，其中的键是弱引用的。其键必须是对象，而值可以是任意的。
const targetMap = new WeakMap()

export function track (target, type, key) {
  /*
  * 1、先基于target找到对应的dep
  * 如果是第一次的话，那么就需要初始化
  * */
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 初始化 depsMap 的逻辑
    // depsMap = new Map()
    // targetMap.set(target, depsMap)
    targetMap.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key) || (new Set())
  if (!deps.has(activeEffect) && activeEffect) {
    deps.add(activeEffect)
  }
  depsMap.set(key, deps)
}

export function trigger (target, type, key) {
  // 从targetMap中找到触发的函数，执行他
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // 没找到依赖
    return
  }

  const deps = depsMap.get(key)
  if (!deps) return
  deps.forEach((effectFn) => {
    if (effectFn.scheduler) {
      effectFn.scheduler()
    } else {
      effectFn()
    }
  })
}

export function effect (fn, options = {}) {
  const effectFn = () => {
    try {
      activeEffect = effectFn
      return fn()
    } finally {
      activeEffect = null
    }
  }
  if (!options.lazy) {
    effectFn()
  }
  effectFn.scheduler = options.scheduler
  return effectFn
}