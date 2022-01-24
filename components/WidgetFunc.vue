<template>
    <div>
        <div class="widget-func">
            <select
                v-model="selected"
                @change="clickStatus( $event )"   
                >
                <option disabled value="" >상태를 선택하세요</option>
                <option 
                    v-for="(status,index) in statusList"
                    :key="index"
                    :value="status"          
                >{{ status }}</option>
            </select>
            <div class="select__arrow"></div>

            <div class="call-func">
                <button
                    @click="clickAnswerCall">
                    <i class="material-icons">phone_enabled</i>
                    받기
                </button>
                <button
                    @click="clickHangupCall">
                    <i class="material-icons">phone_disabled</i>
                    끊기
                </button>
                <button
                    v-if="holdToggle"
                    @click="clickHoldCall">
                    <i class="material-icons">pause_circle</i>
                    보류
                </button>
                <button
                    v-else
                    @click="clickRetriveCall">
                    <i class="material-icons">play_circle_filled</i>
                    보류해제
                </button>
                <button
                    @click="showAgent('호전환')">
                    <i class="material-icons">phone_forwarded</i>
                    호전환
                </button>
                <button
                    @click="showAgent('3자통화')">
                    <i class="material-icons">groups</i>
                    3자통화
                </button>
            </div>
        </div>
        <agent-status-modal 
            :columns="agentColumns"
            :datas="agentData">
        </agent-status-modal>
    </div>
</template>

<script>
import { answer, reject, hangup, hold, retrieve, ready, notReady, afterCallWork, singleStepTransfer, singleStepConference } from '../assets/js/callAPI'
import AgentStatusModal from './AgentStatusModal'

export default {
    components: {
        AgentStatusModal
    },
    data() {
        return {
            statusList : [ '대기', '휴식', '후처리' ],  
            selected: '',
            holdToggle: true,
            showAgentList: false,
            operation: '',
            agentColumns: [ '상담원명', '상태', '내선번호' ],
            agentData: [
                { 상담원명: '김채연', 상태: '이석', 내선번호: '1026' },
                { 상담원명: '김채채', 상태: '휴식', 내선번호: '1027' },
                { 상담원명: '딤채연', 상태: '대기', 내선번호: '1028' },
            ]
        }
    },
    methods: {
        clickAnswerCall () {
            // console.log("this.$parent.currentCall_id",this.$parent.currentCall_id)
            answer( this.$parent.currentCall_id );
        },
        clickHangupCall () {
            hangup( this.$parent.currentCall_id );
        },
        clickHoldCall () {
            this.holdToggle = !this.holdToggle;
            hold( this.$parent.currentCall_id );
        },
        clickRetriveCall () {
            this.holdToggle = !this.holdToggle;
            retrieve( this.$parent.currentCall_id );
        },
        clickStatus ( event ) {
            if( this.selected === '대기' ){
                ready();
            } else if( this.selected === '휴식' ) {
                notReady();
            } else if( this.selected === '후처리' ) {
                afterCallWork();
            } else {
                console.log( 'statusError' );
            }
        },
        showAgent( op ) {
            this.showAgentList = true;
            this.operation = op;
        }
    }

}
</script>