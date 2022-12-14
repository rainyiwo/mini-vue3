// baseHandlers.js
import {track, trigger } from './effect'
import {isObject, hasOwn} from '../shared'
import {
  reactive,
  ReactiveFlags,
  reactiveMap,
  shallowReactiveMap
} from './reactive'

function createGetter (shallow = false) {
  return function get (target, key, receiver) {
    // 是不是已经存在两个map中，实际还会更多 还有readonly啥乱遭的
    const isExistMap = () => key === ReactiveFlags.RAW && (receiver === reactiveMap.get(target) || receiver === shallowReactiveMap.get(target))

    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    } else if (isExistMap()) {
      return target
    }

    // Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。
    // Reflect.get(target, propertyKey[, receiver])
    // 获取对象身上某个属性的值，类似于 target[name]。
    // 如果target对象中指定了getter，receiver则为getter调用时的this值。
    const res = Reflect.get(target, key, receiver)
    track(target, 'get', key)
    if (isObject(res)) {
      // 值也是对象的话，需要嵌套调用reactive
      // res就是target[key]
      // 浅层代理，不需要嵌套
      return shallow ? res : reactive(res)
    }
    return res
  }
}

function createSetter () {
  return function set(target, key, value, receiver) {
    // Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。
    // Reflect.set(target, propertyKey[, receiver])
    // 将值分配给属性的函数。返回一个Boolean，如果更新成功，则返回true。
    // 如果target对象中指定了getter，receiver则为getter调用时的this值。
    const result = Reflect.set(target, key, value, receiver)
    // 在触发set的时候触发依赖
    trigger(target, 'set', key)
    return result
  }
}

function has (target, key) {
  const res = Reflect.has(target, key)
  track(target, 'has', key)
  return res
}

function deleteProperty (target, key) {
  const hadKey = hasOwn(target, key)
  const result = Reflect.deleteProperty(target, key)
  if (result && hadKey) {
    trigger(target, 'delete', key)
  }
  return result
}

const set = createSetter()
const get = createGetter()
const shallowReactiveGet = createGetter(true)

export const mutableHandlers = {
  set,
  get,
  has,
  deleteProperty
}
export const shallowReactiveHandlers = {
  get: shallowReactiveGet,
  set,
  has,
  deleteProperty
}