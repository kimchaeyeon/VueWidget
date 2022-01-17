// export default {

// }

const widgetApp = {
    namespaced: true,
    //Data
    state: () => ({
        extension: ''
    }),
    //Computed
    getters: {
        GE_EXTENSION: state => state.extension
    },
    //Methods
    //실제 값을 변경할 때 사용(비동기 x), state값 변경할 수 있음
    mutations: {
        MU_EXTENSION: (state, payload) => {
            /*
                여기서는 payload를 객체로 받습니다.
                payload를 객체로 받으면, mutation를 조금더 유연하게 사용할 수 있기는 합니다.
            */
            state.extension = payload.extension
        }
    },
    //Methods
    //일반 로직(비동기 O) , state값 변경할 수 없음
    actions: {
        AC_EXTENSION: ({ commit }, payload) => {
            commit('MU_EXTENSION', payload)
        }
    }
}

export default widgetApp