# vue-component-ui

## Installation

1. monorepo项目基础代码框架

> turbo

```sh
npx create-turbo@latest --example with-vue-nuxt
```

````c#
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
````

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

```sh
npx husky install
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
# lint-staged - 检查git暂存区的文件(执行git add后的文件)
npx husky add .husky/pre-commit "pnpm exec lint-staged"
```

**git-cz**

```SH
# 全局安装 使用cz 或 git cz命令调用
npm install -g commitizen
# 项目中
pnpm install -D cz-git 
```

