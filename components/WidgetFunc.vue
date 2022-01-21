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
                    @click="showAgent('Transfer')">
                    <i class="material-icons">phone_forwarded</i>
                    호전환
                </button>
                <button
                    @click="showAgent('Conference')">
                    <i class="material-icons">groups</i>
                    3자통화
                </button>
            </div>
        </div>
        <agent-status-modal>
            <!-- <div slot="header">
                {{ operation }}
                <button 
                    class="modal-default-button material-icons" 
                    @click="showAgentList = false"
                >close
                </button>
            </div>
            <div slot="body">

            </div> -->
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