# vue-component-ui

## Installation

1. monorepo项目基础代码框架

> turbo

```sh
npx create-turbo@latest --example with-vue-nuxt
```

```c#
my-component-library/
├── packages/                   # Monorepo 下的各个包
│   ├── components/             # 组件包
│   │   ├── input/              # 存放各个组件的文件夹
│   │   │   ├── src/
│   │   │   │   ├──  input/
│   │   │   └── index.ts        # 组件入口文件
│   │   ├── package.json
│   │   └── index.ts            # 组件入口
│   ├── utils/                  # 公用工具包
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── types/                  # 类型定义包
│   │   ├── src/
│   │   │   └── index.d.ts
│   │   ├── package.json
│   │   └── tsconfig.json
├── scripts/                    # 构建工具、自动化脚本
│   ├── build.ts                # 构建脚本
│   ├── release.ts              # 发布脚本
│   └── dev.ts                  # 本地开发启动脚本
├── public/                     # 存放静态文件
├── demo/                       # 组件库的演示项目
├── .gitignore
├── package.json
├── pnpm-workspace.yaml         # pnpm monorepo 配置
├── tsconfig.json               # 根级 TypeScript 配置
└── vite.config.ts              # Vite 配置
```

2. 引入工作空间内的包

```sh
# 根目录底下 或手动加到package.json 然后 pnpm install
pnpm add @component-ui/components --workspace-root
# 其他子目录
pnpm add @component-ui/utils --workspace
```

```JSON
{
  "devDependencies": {
    "@components-ui/components": "workspace:^",
    "@components-ui/hooks": "workspace:^",
    "@components-ui/utils": "workspace:^",
    "@components-ui/themes": "workspace:^"
  }
}
```

3. 各种lint

**eslint**

```sh
# /packages/eslint-config
pnpm install eslint
```

```json
//.eslintrc.json
{
  "root": true,
  "extends": ["@components-ui/eslint-config"]
}
//.eslintignore
```

**[commitlint](https://commitlint.js.org/guides/getting-started.html)**

```sh
pnpm add --save-dev @commitlint/{cli,config-conventional} husky
```

> husky - Husky 是一个 Git 钩子管理工具，它可以在 Git 提交时自动运行 Commitlint。
>
> `pre-commit` 钩子在执行 `git commit` 命令时触发，**在提交信息输入之前**，即在用户进行实际提交之前。主要用于执行一些在提交前需要完成的操作，例如代码格式化、代码检查（如 ESLint、Prettier）、单元测试等。这些操作是确保代码质量的一个环节，防止提交不符合要求的代码。
>
> `commit-msg` 钩子会在你输入提交信息并且 Git 生成提交时触发，**在提交信息输入后**，即在你写好提交信息并提交时，`commit-msg` 钩子会验证这个提交信息。主要目的是检查提交信息是否符合规定的格式规范。
>
> 当你在 `package.json` 中配置 `"prepare": "husky"`，它的作用是：
>
> - **自动安装 Husky 并设置 Git hook**：在你运行 `npm install` 或 `yarn install` 时，`husky` 会被自动安装，并会根据项目中的配置创建 Git hooks（例如 `pre-commit`、`commit-msg` 等）。

```sh
npx husky install
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
# lint-staged - 检查git暂存区的文件(执行git add后的文件)
npx husky add .husky/pre-commit "pnpm exec lint-staged"
```

**lint-staged**

> 检查git暂存区的文件(执行git add后的文件)

```json
//package.json
{
  "lint-staged": {
    "packages/**/*.{vue,js,ts,jsx,tsx,md,json}": "eslint --config .eslintrc.json --fix"
  }
}
```

**git-cz**

```SH
# 全局安装 使用cz 或 git cz命令调用
npm install -g commitizen
# 项目中
pnpm install -D cz-git
```

## Test

**jest**

```sh
pnpm install jest @types/jest -D -w
# 创建配置
pnpm create jest@latest
√ Would you like to use Typescript for the configuration file? ... yes
√ Choose the test environment that will be used for testing » jsdom (browser-like)
√ Do you want Jest to add coverage reports? ... yes
√ Which provider should be used to instrument code for coverage? » babel
√ Automatically clear mock calls, instances, contexts and results before every test? ... yes
# babel
pnpm add --save-dev babel-jest @babel/core @babel/preset-env -w
# jsdom 要手动安装
pnpm add jest-environment-jsdom -D -w 
```

**@vue/vue3-jest**

> 将 `.vue` 文件转译成 Jest 可以理解的 JavaScript

**jest.config.js**

```js
module.exports = {
  testEnvironment: 'jsdom',
  // Options that will be passed to the testEnvironment
  // NOTE: 解决 `ReferenceError: Vue is not defined`
  // 配置用于调整 Jest 在解析模块时，如何选择模块的导出条件（exports 字段中的条件）。
  testEnvironmentOptions: { customExportConditions: ['node', 'node-addons'] },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest'
  }
}
```

**babel**
babel.config.js

```json
module.exports = () => {
  // const isTest = api.env('test')
  return {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      '@babel/preset-typescript' 
    ],
    plugins: ['@vue/babel-plugin-jsx'] //支持 Vue 3 JSX 的
  }
}
```

**@vue/test-utils**

> 官方提供的一个测试工具库，用于帮助开发者更容易地编写 Vue 组件的单元测试。
>
> **挂载组件**：`@vue/test-utils` 提供了 `mount` 和 `shallowMount` 两种方式来挂载 Vue 组件，用于模拟组件的实际渲染和交互。
>
> **事件触发**：它允许你模拟用户事件（如点击、输入等），并验证组件的响应行为。
>
> **组件状态和数据**：你可以检查组件的 `data`、`props` 和计算属性等状态。
>
> **模拟组件的依赖**：对于子组件，`shallowMount` 可以创建一个浅渲染的版本，只渲染组件本身而不渲染子组件。
>
> **DOM 操作**：可以使用 `wrapper` 对象来查询和操作组件的 DOM 元素。

```sh
pnpm add -D @vue/test-utils
```

类型

让ts识别jsx

```ts
// shims-vue.d.ts
// NOTE: shim 在计算机科学中表示一个适配器或“填充”代码，它用来填补或模拟一些功能
declare namespace JSX {
  // Vue 3 JSX 标签类型
  interface IntrinsicElements {
    [elem: string]: any // 允许 JSX 标签的类型自动推断
  }
}
```



## Build

> 目标类型： ES Module、UMD、commonjs?

````yaml
dist:
  - "dist/*"
  - "dist/*"
  - "packages/*"

````

### gulp 

> JavaScript 自动化构建工具，用于简化前端开发中的各种任务，如文件的压缩、编译、合并、图像优化、测试等。Gulp 使用了 **流（stream）** 的概念，使得任务能够更高效地处理大量的文件，支持任务链式操作并且具有良好的性能。

```sh
pnpm add gulp @types/gulp -D -w
# 使用ts需要依赖ts-node
pnpm add ts-node -D -w
# gulp --require @esbuild-kit/cjs-loader -f gulpfile.ts
# @esbuild-kit/cjs-loader 让 Node.js 同时支持 CommonJS 和 ESM 模块
pnpm add @esbuild-kit/cjs-loader -D -w
```

**rollup**

> 默认 只认识标准的 JavaScript 文件（ESM 格式）
>
> 插件应用常见类别的顺序建议
>
> - 编译阶段：
>   - 确保源文件能被正确解析和转译，例如 Vue、TypeScript、JSX 等。
>   - 插件顺序应遵循文件扩展性和功能依赖性，比如 `vue` 在处理 `.vue` 文件前需运行。
> - 解析和加载阶段：
>   - 解析模块的路径和依赖关系，如 `nodeResolve` 和 `commonjs`。
> - 代码优化阶段：
>   - 压缩和代码替换操作如 `esbuild`、`terser`。

- typescript

> @rollup/plugin-typescript` 或 `rollup-plugin-esbuild



> **Node.js 对 ES 模块的处理**：Node.js 默认对 `.js` 文件使用 CommonJS 模块解析方式。因此，使用 `.mjs` 扩展名能够让 Node.js 明确识别文件是 ESM 格式，避免解析错误。
>
> **浏览器**：浏览器对 ES 模块的支持通常基于 `<script type="module">` 标签，而 ES 模块的文件一般使用 `.mjs` 扩展名，或者在现代浏览器中通过 `type="module"` 来加载 `.js` 文件。





















