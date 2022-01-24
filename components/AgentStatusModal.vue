<template>
    <div class="agent-status-modal">
        <transition name="modal">
            <div 
                class="agent-status-modal"
                v-if="$parent.showAgentList">
                <div class="modal-mask">
                    <div class="modal-wrapper">
                        <div class="modal-container">
                            <div class="modal-header">
                                {{ $parent.operation }}
                                <button 
                                    class="modal-default-button material-icons" 
                                    @click="$parent.showAgentList = false">
                                close
                                </button>       
                            </div>
                            <hr style="border: 1px solid #dee2e6;" />
                            <div class="modal-body">
                                <table>
                                    <thead>
                                        <tr>
                                            <th v-for="(col, i) in columns" :key="i">
                                                {{ col }}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(data, i) in datas" :key="i">
                                            <td v-for="(col, i) in columns" :key="i"
                                                @dblclick="showAlert = true">
                                                {{ data[col] }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <alert-modal
            v-if="showAlert">
            <h3 slot="header">{{ $parent.operation }}</h3>
            <div slot="body">{{ $parent.operation + ` 하시겠습니까?` }}</div>
            <div slot="left-btn"
                    @click="showAlert = false">
                취소
            </div>
            <div slot="right-btn">확인</div>
        </alert-modal>
    </div>
</template>

<script>

import AlertModal from './AlertModal'

export default {
    components: {
        AlertModal
    },
    props: {
        columns: Array,
        datas: Array,
    },
    data () {
        return {
            showAlert: false
        }
    },
    computed: {
    },
    methods: {

    }
}
</script>
