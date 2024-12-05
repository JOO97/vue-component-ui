import type { App, Plugin } from 'vue'

const INSTALLED_KEY = 'INSTALLED_KEY'
//FIXME:
// const INSTALLED_KEY = Symbol.for('INSTALLED_KEY')

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App & Record<typeof INSTALLED_KEY, boolean>) => {
    if (app[INSTALLED_KEY]) return
    app[INSTALLED_KEY] = true
    components.forEach((c) => app.use(c))
  }
  return {
    install
  }
}
