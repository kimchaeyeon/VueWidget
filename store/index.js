import Vue from 'vue'
import Vuex from 'vuex'

import widgetApp from './modules/widgetApp'

Vue.use(Vuex)//뷰에서 뷰액스를 사용하겠다

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production', //배포시에는 false가 되어있어야 성능 이슈가 생기지 않는다
    modules: {
        widgetApp
    }
})

