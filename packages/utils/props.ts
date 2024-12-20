//组件props相关工具函数
import {
  defaultsDeep,
  isArray,
  isBoolean,
  isElement,
  isEmpty,
  isObject
} from 'lodash-unified'
import { createNamespace } from '@components-ui/utils/components'
const { n } = createNamespace('')
/**
 * 创建唯一标识
 */
export const createUUID = (prefix = n()) => {
  return (
    prefix +
    'xxxxxxxx'.replace(/[xy]/g, (a) => {
      const b = 0 | (16 * Math.random()),
        c = 'x' == a ? b : 8 | (3 & b)
      return c.toString(16)
    })
  )
}

/**
 * 合并对象
 * @param opt 新对象
 * @param defaultOpt 默认对象
 */
export const mergeOptions = (
  opt: Record<string, any>,
  defaultOpt: Record<string, any>
) => {
  if (!opt) return defaultOpt
  return defaultsDeep({}, opt || {}, defaultOpt)
}

/**
 * 深度合并对象
 * @param ...param 合并对象
 */
export const deepAssign = (...param: any[]) => {
  const result = Object.assign({}, ...param)
  for (const item of param) {
    for (const [idx, val] of Object.entries(item)) {
      if (typeof val === 'object') {
        result[idx] = deepAssign(result[idx], val)
      }
    }
  }
  return result
}

export { defaultsDeep }

/**
 * 对象转数组
 * 例：{ text: {color: '#fff', hover: { color: '#000' } }, cursor: "pointer" } 转为
 * [
    {
        "key": "text",
        "pKey": "",
        "isParent": true,
        "value": ""
    },
    { 
        "key": "cursor",
        "pKey": "",
        "isParent": false,
        "value": "pointer"
    },
    {
        "key": "color",
        "pKey": "text",
        "isParent": false,
        "value": "#fff"
    },
    {
        "key": "hover",
        "pKey": "text",
        "isParent": true,
        "value": ""
    },
    {
        "key": "color",
        "pKey": "text-hover",
        "isParent": false,
        "value": "#000"
    }
]
 */

export interface IObjectArr {
  key: string
  pKey?: string
  isParent: boolean
  value: string | number
}

export interface IFilterFn {
  (data: IObjectArr[]): IObjectArr[]
}
export const obj2Array = (
  obj: Record<string, any>,
  pKey: string = ''
): IObjectArr[] => {
  if (!isObject(obj) && !isArray(obj)) return []
  const arr: IObjectArr[] = Object.keys(obj).map((key) => ({
    key: key as keyof typeof obj,
    pKey,
    isParent: false,
    value: ''
  }))

  arr.forEach((item) => {
    const { key, pKey = '' } = item
    const itemValue = obj[key]
    if (isObject(itemValue)) {
      item.isParent = true
      arr.push(...obj2Array(itemValue, `${pKey ? `${pKey}-` : ''}${key}`))
    } else item.value = itemValue
  })
  return arr
}

/**
 * 设置css变量
 * @param source
 * @param el
 * @param keys
 * @param filterFn 结果处理回调
 */
export const setStyleProperty = (
  source: Record<string, any>,
  el: HTMLElement,
  keys: string[] = [],
  filterFn: IFilterFn | undefined = undefined
) => {
  if (!isObject(source)) throw new TypeError(`source is not an object`)
  if (!isElement(el)) throw new TypeError(`el is ${el}`)
  if (!isArray(keys)) throw new TypeError(`keys is not an array`)

  const target: Record<string, any> = {}
  if (!keys.length) keys = Object.keys(source)
  keys.forEach((key) => {
    if (source.hasOwnProperty(key)) target[key] = source[key]
  })

  //过滤选项数组
  let optionsArr = obj2Array(target).filter(
    (item) =>
      !item.isParent &&
      item.key !== 'type' &&
      ['string', 'number'].includes(typeof item.value)
  )

  if (filterFn) {
    optionsArr = filterFn(optionsArr)
  }

  optionsArr.forEach((item) => {
    const { pKey, key, value } = item
    el.style.setProperty(
      `--${[pKey, key].filter((k) => k).join('-')}`,
      `${value}`
    )
  })
}

/**
 * 过滤styleProps
 * 根据对象中的show、type字段进行过滤
 */
export const filterStyleProperty = (
  source: Record<string, any> & {
    show?: boolean
  }
) => {
  if (!(isObject(source) && !isArray(source))) return source
  const r: Record<string, any> = {}
  Object.keys(source).forEach((key) => {
    const value = source[key] as Record<string, any> & {
      show?: boolean
    }
    //value为对象时, 递归处理
    if (isObject(value) && !isArray(value)) {
      let r2: Record<string, any> = {}
      //show: 当前项中有show字段且show字段为false则丢弃当前配置项
      if (isBoolean(value.show) && !value.show) return
      else if (value.type) {
        Object.keys(value).forEach((tKey) => {
          //只保留show、type、value['type']对应项
          if (!['show', 'type', value['type']].includes(tKey)) return
          r2[tKey] = filterStyleProperty(value[tKey])
        })
      } else r2 = filterStyleProperty(value)
      if (Object.keys(r2).length) r[key] = r2
    } else r[key] = value
  })
  return r ?? {}
}

/**
 * 根据options清除对应的css变量
 * @param options
 * @param el
 */
export const clearStyleProperty = (
  options: Record<string, any>,
  el: HTMLElement
) => {
  if (!isElement(el)) throw new TypeError(`el is ${el}`)
  const optionsArr = obj2Array(options).filter(
    (item) =>
      !item.isParent &&
      ['string', 'number'].includes(typeof item.value) &&
      item.key !== 'type'
  )
  optionsArr.forEach((item) => {
    el.style.removeProperty(`--${item.pKey}${item.pKey ? '-' : ''}${item.key}`)
  })
}

/**
 * 字段以xx.xx.xx的形式获取源数据
 * @param key
 * @param source 源数据
 * @param suffixKey
 */
export const getValueByKeyStr = (
  key: string,
  suffixKey: string = 'show',
  source: Record<string, any> = {}
) => {
  source = source ?? {}
  const keys = key.split('.').filter((k) => k)
  suffixKey && keys.push(...suffixKey.split('.'))

  if (isEmpty(keys)) return undefined

  let r = source[keys.shift() as string]

  try {
    for (const key of keys) {
      r = r[key]
    }
    return r
  } catch {
    return undefined
  }
}

/**
 * 查找两个对象的不同
 * @param source 源对象
 * @param comparison 对比对象
 */
export const findDiff = (
  source: Record<string, any> = {},
  comparison: Record<string, any> = {}
) => {
  if (!isObject(source) || !isObject(comparison)) {
    console.error('source or comparison is not an object')
    return null
  }

  const diff: Record<string, any> = {}
  let vChildren

  for (const key in source) {
    if (
      isObject(source[key]) &&
      isObject(comparison[key]) &&
      source[key] &&
      comparison[key]
    ) {
      vChildren = findDiff(source[key], comparison[key])
      if (!isEmpty(vChildren)) diff[key] = vChildren
    } else if (source[key] !== comparison[key]) diff[key] = source[key]
  }

  return diff
}
