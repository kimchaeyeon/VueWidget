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
                                                @dblclick ="clickOperationCall( data )">
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
            <div slot="body">{{ `'` + AgentName + `' 상담원으로 ` + $parent.operation + ` 하시겠습니까?` }}</div>
            <div slot="left-btn"
                    @click="showAlert = false">
                취소
            </div>
            <div slot="right-btn"
                    @click="acceptOperationCall">확인</div>
        </alert-modal>
    </div>
</template>

<script>

import AlertModal from './AlertModal'
import { OperationCall } from '../assets/js/callAPI'

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
            showAlert: false,
            AgentName: '',
            phoneNumber : ''
        }
    },
    computed: {
    },
    methods: {
        clickOperationCall ( data ) {
            this.phoneNumber = data.내선번호;
            this.AgentName = data.상담원명;
            this.showAlert = true;
        },
        acceptOperationCall () {
            let op = '';
            let num = this.phoneNumber;
            let id = this.$parent.$parent.currentCall_id;
            
            if ( this.$parent.operation === '호전환' ) {
                op = 'SingleStepTransfer';
            } else if ( this.$parent.operation === '3자통화' ) {
                op = 'SingleStepConference';
            }

            OperationCall( id, op, num );
            this.showAlert = false;
            this.$parent.showAgentList = false;
        }
    }
}
</script>
