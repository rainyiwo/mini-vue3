// ref.js
import {track, trigger} from './effect'
import {reactive} from './reactive'
import {isObject} from '../shared'

export function ref (val) {
  if (isRef(val)) {
    return val
  }
  return new RefImpl(val)
}

export function isRef(val) {
  return !!(val && val.__v_isRef)
}

class RefImpl {
  constructor(val) {
    this.__v_isRef = true
    this._val = convert(val)
  }
  get value() {
    track(this, 'get', 'value')
    return this._val
  }
  set value(val) {
    if (val !== this._val) {
      this._val = convert(val)
      trigger(this, 'set', 'value')
    }
  }
}

// val是对象型数据时，调用reactive
function convert (val) {
  return isObject(val) ? reactive(val) : val
}