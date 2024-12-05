import { nextTick, reactive, ref } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { createNamespace } from '@components-ui/utils/components'
import Input from '../src/input.vue'

const { n } = createNamespace('input')

//自动销毁
enableAutoUnmount(afterEach)

describe('Input.vue', () => {
  it('Create', async () => {
    const handleFocus = jest.fn()
    const input = ref('a')
    const wrapper = mount(() => (
      <Input
        placeholder="请输入内容"
        onFocus={handleFocus}
        v-model={input.value}
      />
    ))

    const nativeInput = wrapper.find('input').element
    expect(wrapper.classes()).toContain(n())
    expect(nativeInput.placeholder).toBe('请输入内容')
    expect(nativeInput.value).toBe('a')

    await wrapper.findComponent(Input).vm.$emit('focus')
    expect(handleFocus).toBeCalledTimes(1)
    input.value = 'b'
    await nextTick()
    expect(nativeInput.value).toBe('b')
  })

  it('Props: disabled', async () => {
    const wrapper = mount(() => <Input disabled />)
    expect(wrapper.find('input').element.disabled).toBeTruthy()
    expect(wrapper.findComponent(Input).classes('is-disabled')).toBe(true)
  })

  it('Props: readonly', async () => {
    const wrapper = mount(() => <Input readonly />)
    expect(wrapper.find('input').attributes('readonly')).not.toBe(undefined)
  })

  it('Props: clearable', async () => {
    const handleFocus = jest.fn()
    const input = ref('')
    const wrapper = mount(() => (
      <Input clearable onFocus={handleFocus} v-model={input.value} />
    ))
    const vm = wrapper.findComponent(Input).vm as any
    expect(vm.showClear).toBe(false)

    input.value = 'a'
    await wrapper.find('input').trigger('focus')
    await nextTick()
    expect(handleFocus).toBeCalled()
    expect(vm.focused).toBe(true)
    expect(vm.showClear).toBe(true)
  })

  it('Props: showPassword', async () => {
    const handleFocus = jest.fn()
    const input = ref('123456')
    const wrapper = mount(() => (
      <Input showPassword onFocus={handleFocus} v-model={input.value} />
    ))
    const vm = wrapper.findComponent(Input).vm as any

    expect(wrapper.find('input').element.type).toBe('password')
    expect(vm.showPwdVisible).toBe(true)

    const pswIcon = wrapper.find(`.is-icon.${n('_password')}`)
    expect(pswIcon.exists()).toBeTruthy()
    await pswIcon.trigger('click')
    expect(wrapper.find('input').element.type).toBe('text')
    expect(vm.passwordVisible).toBe(false)
  })

  it('Props: with append button', async () => {
    const input = ref('123')
    const buttonContent = ref('search')
    const handleButtonClick = jest.fn(() => {})
    const wrapper = mount(() => (
      <Input
        showButton={true}
        buttonContent={buttonContent.value}
        v-model={input.value}
        onButtonClick={handleButtonClick}
      />
    ))
    const Ipt = wrapper.findComponent(Input)
    const vm = Ipt.vm as any
    const append = Ipt.find(`.${n('-group__append')}`)
    const appendButton = append.find('button')

    expect(vm.appendVisible).toBe(true)
    expect(Ipt.find(`.${n('-group__append')}`)).toBeTruthy()
    expect(appendButton.exists()).toBe(true)
    expect(Ipt.find(`.${n('-group__append')} .${n('_icon')} `).exists()).toBe(
      false
    )

    await appendButton.trigger('click')
    expect(Ipt.emitted('button-click')).toHaveLength(1)
    expect(handleButtonClick).toBeCalledWith('123')

    await append.trigger('mousedown')
    expect(vm.isClicking).toBe(true)
    expect(append.classes('is-active')).toBe(true)

    await append.trigger('mouseup')
    expect(vm.isClicking).toBe(false)

    buttonContent.value =
      'https://cdn-upload.datav.aliyun.com/upload/download/1666233796787-Qfh6D-SR.svg'
    await nextTick()
    expect(Ipt.find(`.${n('-group__append')} .${n('_icon')} `).exists()).toBe(
      true
    )
  })

  it('Props: with suffixIcon and prefixIcon', async () => {
    const input = ref('123')
    const prefixIcon = ref('')
    const wrapper = mount(() => (
      <Input
        v-model={input.value}
        suffixIcon="https://cdn-upload.datav.aliyun.com/upload/download/1666233796787-Qfh6D-SR.svg"
        prefixIcon={prefixIcon.value}
      />
    ))

    const Ipt = wrapper.findComponent(Input)
    const vm = Ipt.vm as any
    expect(vm.suffixVisible).toBe(true)

    prefixIcon.value =
      'https://cdn-upload.datav.aliyun.com/upload/download/1666233796787-Qfh6D-SR.svg'
    await nextTick()
    expect(vm.prefixVisible).toBe(true)
  })

  it('Props: with suffix slot and prefix slot', async () => {
    const input = ref('123')
    const slots = {
      prefix: () => <span>prefix</span>,
      suffix: () => <span>suffix</span>
    }
    const wrapper = mount(() => <Input v-model={input.value} v-slots={slots} />)

    const Ipt = wrapper.findComponent(Input)
    const vm = Ipt.vm as any
    expect(vm.suffixVisible).toBe(true)
    expect(vm.prefixVisible).toBe(true)
  })

  it('Props: type=textarea', async () => {
    const input = ref('123')
    const type = ref('text')
    const wrapper = mount(() => (
      <Input v-model={input.value} type={type.value} resize="both" />
    ))

    const Ipt = wrapper.findComponent(Input)

    type.value = 'textarea'
    await Ipt.vm.$forceUpdate()
    await nextTick()
    expect(Ipt.find('textarea').exists()).toBe(true)
    expect(Ipt.find('textarea').element.style.resize).toBe('both')
    expect(Ipt.find('textarea').element.value).toBe('123')
  })

  it('Props: styleProps', async () => {
    const input = ref('123')
    const disabled = ref(false)
    const styleProps = reactive({
      wrapper: {
        shadow: {
          show: true
        },
        border: {
          show: true
        },
        hover: {
          border: {
            show: false
          },
          shadow: {
            show: false
          }
        },
        focus: {
          border: {
            show: false
          },
          shadow: {
            show: false
          }
        }
      },
      append: {
        active: {
          show: false
        }
      }
    })
    const wrapper = mount(() => (
      <Input
        v-model={input.value}
        styleProps={styleProps}
        disabled={disabled.value}
      />
    ))

    expect(wrapper.find(`.${n('_wrapper')}`).classes()).toEqual(
      expect.arrayContaining([n('_wrapper'), 'is-border', 'is-shadow'])
    )
  })

  it('Events: click/change/input/focus/blur/mouseenter/mouseleave', async () => {
    const value = '123'
    const input = ref(value)
    const handleClick = jest.fn(() => {})
    const handleChange = jest.fn(() => {})
    const handleInput = jest.fn()
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    const mouseenter = jest.fn()
    const mouseleave = jest.fn()
    const wrapper = mount(() => (
      <Input
        v-model={input.value}
        onClick={handleClick}
        onChange={handleChange}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseenter={mouseenter}
        onMouseleave={mouseleave}
      />
    ))

    const Ipt = wrapper.findComponent(Input)
    const nativeIpt = Ipt.find('input')

    await nativeIpt.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(handleClick).toBeCalled()

    await nativeIpt.trigger('change')
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(handleChange).toBeCalledWith(value)

    await nativeIpt.trigger('input')
    expect(wrapper.emitted()).toHaveProperty('input')
    expect(handleInput).toBeCalled()

    await nativeIpt.trigger('focus')
    expect(Ipt.emitted()).toHaveProperty('focus')
    expect(handleFocus).toBeCalled()

    await nativeIpt.trigger('blur')
    expect(Ipt.emitted('blur')).toHaveLength(1)
    expect(handleBlur).toBeCalled()

    await wrapper.trigger('mouseenter')
    expect(wrapper.emitted()).toHaveProperty('mouseenter')
    expect(mouseenter).toBeCalled()
    expect((Ipt.vm as any).hovering).toBe(true)

    await wrapper.trigger('mouseleave')
    expect(wrapper.emitted()).toHaveProperty('mouseleave')
    expect(mouseleave).toBeCalled()
    expect((Ipt.vm as any).hovering).toBe(false)
  })

  it('Method: updateStyleProperty', async () => {
    const input = ref('123')
    const styleProps = reactive({
      wrapper: {
        border: {
          show: false
        }
      }
    })
    const wrapper = mount(() => (
      <Input v-model={input.value} styleProps={styleProps} />
    ))

    const Ipt = wrapper.findComponent(Input)
    const iptWrapper = wrapper.find(`.${n('_wrapper')}`)
    expect(iptWrapper.classes('is-border')).toBe(false)

    Ipt.vm.updateStyleProperty({
      wrapper: {
        border: {
          show: true,
          top: {
            color: '#000',
            size: 2
          }
        }
      }
    })

    await nextTick()
    expect(iptWrapper.classes('is-border')).toBe(true)
    expect(
      getComputedStyle(wrapper.element).getPropertyValue(
        '--wrapper-border-top-size'
      )
    ).toBe('2')
    expect(
      getComputedStyle(wrapper.element).getPropertyValue(
        '--wrapper-border-top-color'
      )
    ).toBe('#000')
  })

  it('Method: getValue', async () => {
    const input = ref('123')
    const wrapper = mount(() => <Input v-model={input.value} />)

    const Ipt = wrapper.findComponent(Input)
    expect(Ipt.vm.getValue()).toBe('123')
  })

  it('Method: clear', async () => {
    const input = ref('123')
    const wrapper = mount(() => <Input v-model={input.value} />)

    const Ipt = wrapper.findComponent(Input)
    Ipt.vm.clear()
    expect(input.value).toBe('')
    expect(Ipt.emitted('clear')).toHaveLength(1)
  })
})
