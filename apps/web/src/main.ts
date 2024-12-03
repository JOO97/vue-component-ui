import { createApp } from 'vue'
import VIInput from '@components-ui/components/input'
import '@components-ui/themes/src/index.scss'
import App from './app.vue'

const app = createApp(App)
app.use(VIInput)
app.mount('#app')
