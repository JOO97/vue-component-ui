<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  ref,
  shallowRef,
  useSlots,
  watch
} from 'vue'
import { isNil } from 'lodash-unified'

import { createNamespace } from '@components-ui/utils/components'
import { useStyleProps } from '@components-ui/hooks/use-style-props'

import { defaultStyleProps, icon, inputProps, useCursor } from './input'
import type { StyleValue } from 'vue'

const { n: nIpt, classes: classesIpt } = createNamespace('input') //input
const { n: nT, classes: classesT } = createNamespace('textarea') //textarea

const slots = useSlots()
const props = defineProps(inputProps)
const emit = defineEmits([
  'click',
  'input',
  'change',
  'mouseleave',
  'update:modelValue',
  'clear',
  'focus',
  'blur',
  'compositionstart',
  'compositionupdate',
  'compositionend',
  'mouseleave',
  'mouseenter',
  'button-click'
])

const n = computed(() => {
  return (params = '') =>
    props.type === 'textarea' ? nT(params) : nIpt(params)
})
const classes = computed(() => {
  return (...params: any) =>
    props.type === 'textarea' ? classesT(...params) : classesIpt(...params)
})

/**
 * useStyleProps hook
 */
const {
  refCpn,
  currentStyleProps,
  v,
  loadStyleProperty,
  updateStyleProperty: updateStyle
} = useStyleProps({
  defaultStyleProps
})

const urlRegExp =
  /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/

type TargetElement = HTMLInputElement | HTMLTextAreaElement

//状态
const focused = ref(false)
const hovering = ref(false)
const isClicking = ref(false)
const passwordVisible = ref(true) //密码是否加密显示

const input = shallowRef<HTMLInputElement>()
const textarea = shallowRef<HTMLTextAreaElement>()
const [recordCursor, setCursor] = useCursor(input)

const _ref = computed(() => input.value || textarea.value)

const nativeInputValue = computed(() =>
  isNil(props.modelValue) ? '' : String(props.modelValue)
)

const passwordIcon = computed(() =>
  !passwordVisible.value ? icon!.show : icon!.hide
) //密码切换icon

//  textareaSizes
const textareaSizes = computed(
  () =>
    ({
      width: props.width,
      height: props.height,
      resize: props.disabled || props.readonly ? 'none' : props.resize
    }) as StyleValue
)

//组件事件绑定
const inputEvents = {
  input: (e: Event) => handleInput(e),
  change: (e: Event) => handleChange(e),
  focus: (e: FocusEvent) => handleFocus(e),
  blur: (e: FocusEvent) => handleBlur(e),
  click: (e: Event) => handleClick(e)
}

/**
 * visible
 */

//show clear icon
const showClear = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    !!nativeInputValue.value &&
    (focused.value || hovering.value)
)

//suffix
const suffixVisible = computed(
  () =>
    !!slots.suffix ||
    showClear.value ||
    !!props.suffixIcon ||
    props.showPassword
)

//prefix
const prefixVisible = computed(() => !!slots.prefix || !!props.prefixIcon)

//append
const appendVisible = computed(() => !!slots.append || props.showButton)

const isUrl = computed(() => {
  return (str = '') => urlRegExp.test(str)
})

//密码显示/保密切换按钮
const showPwdVisible = computed(
  () =>
    props.showPassword &&
    !props.disabled &&
    !props.readonly &&
    !!nativeInputValue.value &&
    (!!nativeInputValue.value || focused.value)
)

/**
 * 清除内容 FIXME: 点击清除icon后鼠标样式不会立刻变回指针
 */
const clear = () => {
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
  emit('input', '')
}

const setNativeInputValue = () => {
  const input = _ref.value
  if (!input || input.value === nativeInputValue.value) return
  input.value = nativeInputValue.value
}
/**
 * 事件
 */

const handleClick = (event: Event) => {
  emit('click', event)
}

const handleInput = async (event: Event) => {
  recordCursor()
  const { value } = event.target as TargetElement
  emit('update:modelValue', value)
  emit('input', value)

  await nextTick()
  setNativeInputValue()
  setCursor()
}

const handleChange = (event: Event) => {
  emit('change', (event.target as TargetElement).value)
}

const handleFocus = (event: FocusEvent) => {
  focused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  focused.value = false
  emit('blur', event)
}

const handleMouseLeave = (evt: MouseEvent) => {
  hovering.value = false
  emit('mouseleave', evt)
}

const handleMouseEnter = (evt: MouseEvent) => {
  hovering.value = true
  emit('mouseenter', evt)
}

const handleButtonClick = () => {
  emit('button-click', _ref.value!.value)
}

const focus = async () => {
  await nextTick()
  _ref.value?.focus()
}

const blur = () => _ref.value?.blur()

/**
 * 切换密码
 */
const handlePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value
  focus()
}

/**
 * watcher
 */

watch(nativeInputValue, () => setNativeInputValue())

watch(
  () => props.type,
  async () => {
    await nextTick()
    setNativeInputValue()
  }
)

watch(
  () => props.styleProps,
  (nVal) => {
    loadStyleProperty(nVal, currentStyleProps.value)
  },
  {
    deep: true,
    immediate: true
  }
)

/**
 * mounted
 */
onMounted(() => {
  setNativeInputValue()
})

const updateStyleProperty = (opt: object) => updateStyle(opt, props.styleProps)
const getValue = () => _ref.value?.value || ''
const getBoundingClientRect = () => refCpn.value?.getBoundingClientRect()

/**
 * 需要对外暴露的变量和方法
 */
defineExpose({
  updateStyleProperty,
  clear,
  getValue,
  focus,
  blur,
  getBoundingClientRect
})
</script>

<template>
  <div
    :id="id"
    ref="refCpn"
    :class="
      classes(
        n(),
        [appendVisible, n('-group')],
        [appendVisible, n('-group--append')],
        [disabled, 'is-disabled']
      )
    "
    :style="{ width, height }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- input -->
    <template v-if="type !== 'textarea'">
      <div
        :class="
          classes(
            n('_wrapper'),
            [focused, 'is-focus'],
            [v('wrapper.border'), 'is-border'],
            [v('wrapper.shadow'), 'is-shadow'],
            [!disabled && v('wrapper.hover.border'), 'is-hover-border'],
            [!disabled && v('wrapper.hover.shadow'), 'is-hover-shadow'],
            [
              !disabled && focused && v('wrapper.focus.border'),
              'is-focus-border'
            ],
            [
              !disabled && focused && v('wrapper.focus.shadow'),
              'is-focus-shadow'
            ]
          )
        "
      >
        <!-- prefix -->
        <span v-if="prefixVisible" :class="classes(n('_prefix'))">
          <span :class="classes(n('_prefix-inner'))">
            <i :class="['is-icon', n('_icon')]">
              <slot name="prefix">
                <span :style="{ backgroundImage: `url(${prefixIcon})` }" />
              </slot>
            </i>
          </span>
        </span>
        <!-- input -->
        <input
          ref="input"
          :class="classes(n('_inner'))"
          :type="showPassword ? (passwordVisible ? 'password' : 'text') : type"
          :placeholder="placeholder"
          :readonly="readonly"
          :disabled="disabled"
          v-on="inputEvents"
        />
        <!-- suffix -->
        <span v-if="suffixVisible" :class="classes(n('_suffix'))">
          <span :class="classes(n('_suffix-inner'))">
            <i
              v-if="showClear"
              :class="['is-icon', n('_clear')]"
              @click="clear"
              v-html="icon.close"
            />
            <i
              v-if="showPwdVisible"
              :class="['is-icon', n('_password')]"
              @click="handlePasswordVisible"
              v-html="passwordIcon"
            />
            <i
              v-if="suffixIcon || slots.suffix"
              :class="['is-icon', n('_icon')]"
            >
              <slot name="suffix">
                <span :style="{ backgroundImage: `url(${suffixIcon})` }" />
              </slot>
            </i>
          </span>
        </span>
      </div>
      <!-- append -->
      <div
        v-if="appendVisible"
        :class="
          classes(n('-group__append'), [
            v('append.active') && isClicking,
            'is-active'
          ])
        "
        @mousedown="isClicking = true"
        @mouseup="isClicking = false"
      >
        <slot name="append">
          <button
            v-if="showButton"
            :class="[n('_button')]"
            type="button"
            @click="handleButtonClick"
          >
            <span v-if="isUrl(buttonContent)" :class="n('_icon')">
              <span :style="{ backgroundImage: `url(${buttonContent})` }" />
            </span>
            <span v-else>{{ buttonContent.toString().substring(0, 2) }}</span>
          </button>
        </slot>
      </div>
    </template>
    <!-- textarea -->
    <template v-else>
      <textarea
        ref="textarea"
        :class="
          classes(
            n('_inner'),
            [focused, 'is-focus'],
            [v('wrapper.border'), 'is-border'],
            [v('wrapper.shadow'), 'is-shadow'],
            [!disabled && v('wrapper.hover.shadow'), 'is-hover-shadow'],
            [!disabled && v('wrapper.hover.border'), 'is-hover-border'],
            [!disabled && v('wrapper.hover.border'), 'is-focus-border'],
            [
              !disabled && focused && v('wrapper.focus.border'),
              'is-focus-border'
            ],
            [
              !disabled && focused && v('wrapper.focus.shadow'),
              'is-focus-shadow'
            ]
          )
        "
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :style="textareaSizes"
        v-on="inputEvents"
      />
    </template>
  </div>
</template>
