import {ref} from '../ref'
import {reactive} from '../reactive'
import {computed} from '../computed'

describe('computed测试', () => {
  test('computed基本用法', () => {
    const ret = reactive({count: 1})
    const num = ref(2)
    const sum = computed(() => ret.count + num.value)
    expect(sum.value).toBe(3)

    ret.count++
    expect(sum.value).toBe(4)

    num.value = 10
    expect(sum.value).toBe(12)
  })

  it('computed属性修改', () => {
    const author = ref('xcd')
    const course = ref('mini-vue')

    const title = computed({
      get() {
        return author.value + ':' + course.value
      },
      set(val) {
        [author.value, course.value] = val.split(':')
      }
    })

    expect(title.value).toBe('xcd:mini-vue')

    author.value = '徐成东'
    course.value = 'vue3-study'
    expect(title.value).toBe('徐成东:vue3-study')

    title.value = 'chengdong.xu:mini-vue3-study'
    expect(author.value).toBe('chengdong.xu')
    expect(course.value).toBe('mini-vue3-study')
  })
})