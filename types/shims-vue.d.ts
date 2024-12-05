declare namespace JSX {
  // Vue 3 JSX 标签类型
  interface IntrinsicElements {
    [elem: string]: any // 允许 JSX 标签的类型自动推断
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<any, any, any>
  export default component
}
