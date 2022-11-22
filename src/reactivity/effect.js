let activeEffect = null

const targetMap = new WeakMap()

export function track (target, type, key) {

  /*
  * 1、先基于target找到对应的dep
  * 如果是第一次的话，那么就需要初始化
  * */
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key) || (new Set())
  if (!deps.has(activeEffect) && activeEffect) {
    deps.add(activeEffect)
  }
  depsMap.set(key, deps)
}

export function trigger (target, type, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

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