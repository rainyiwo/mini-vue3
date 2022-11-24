import {effect} from '../effect'
import {ref} from '../ref'

describe('ref测试', () => {
  test('ref基本使用', () => {
    const r = ref(0)

    let val
    effect(() => {
      val = r.value
    })
    expect(val).toBe(0)

    r.value++
    expect(val).toBe(1)
  })

  test('ref复杂数据', () => {
    const r = ref({name: 'my name is xcd'})

    let val
    effect(() => {
      val = r.value.name
    })
    expect(val).toBe('my name is xcd')

    r.value.name = 'xcd is me'
    expect(val).toBe('xcd is me')
  })
})