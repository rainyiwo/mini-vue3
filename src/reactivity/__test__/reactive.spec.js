import {effect} from '../effect'
import {reactive} from '../reactive'

describe('测试响应式', () => {
  test('reactive基本用法', () => {
    const ret = reactive({num: 0})
    // // console.log('ret', ret.num)
    let val

    effect(() => {
      val = ret.num
    })
    expect(val).toBe(0)

    ret.num++
    expect(val).toBe(1)

    ret.num = 10
    expect(val).toBe(10)

    const state = reactive({count: 0})
    let res
    effect(() => {
      res = state.count * 2
    })
    expect(res).toBe(0)

    state.count = 5
    expect(res).toBe(10)

    state.count = 99
    expect(res).toBe(198)
  })
})