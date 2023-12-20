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

            <div v-if="this.$parent.isLoginMode"
                class="call-func">
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
            <div v-else
                class="call-func">
                <button
                    @click="loginCheckAlert">
                    <i class="material-icons">phone_enabled</i>
                    받기
                </button>
                <button
                    @click="loginCheckAlert">
                    <i class="material-icons">phone_disabled</i>
                    끊기
                </button>
                <button
                    @click="loginCheckAlert">
                    <i class="material-icons">pause_circle</i>
                    보류
                </button>
                <button
                    @click="loginCheckAlert">
                    <i class="material-icons">phone_forwarded</i>
                    호전환
                </button>
                <button
                    @click="loginCheckAlert">
                    <i class="material-icons">groups</i>
                    3자통화
                </button>
            </div>
        </div>
        <agent-status-modal 
            :columns="agentColumns"
            :datas="getAgentList">
        </agent-status-modal>
    </div>
</template>

<script>
import { answer, reject, hangup, hold, retrieve, ready, notReady, afterCallWork, getAgentListFromGws } from '../assets/js/callAPI'
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
            agentColumns: [ '상담원명', '내선번호', '상태' ],
            agentData: [],
            agentStatusList: [],
        }
    },
    computed: {
        getAgentList () {
            this.agentData = this.agentStatusList.map( ( data ) => {
                 return {
                    '상담원명' : data.name,
                    '내선번호' : data.phoneNumber,
                    '상태' : data.userState
                }
            });
            return this.agentData;
        }
    },
    methods: {
        loginCheckAlert () {
                alert('로그인 후 사용하세요!');
                return;
        },
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
            if( this.$parent.isLoginMode == false ) {
                alert('로그인 후 사용하세요!');
                this.selected = ''
                return;
            }

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
            let getAgentListCallback = (res) => {
                res.then((data) => {
                    let agentList = data.contacts;
                    let channel_info;

                    this.agentStatusList = agentList.map(( agent_info ) => { 
                        
                        let userState;
                        let phoneNumber;
                        if ( agent_info.availability ) {
                            channel_info = agent_info.availability.channels;
                            if ( channel_info.length > 0) {
                                channel_info.map((c)=> {
                                    if (c.channel === "voice"){
                                        userState = c.userState.displayName;
                                    }
                                });
                            } 
                        }
                        if ( agent_info.phoneNumbers ) {
                            phoneNumber = agent_info.phoneNumbers[0].phoneNumber;
                        }
                        return {
                            id: agent_info.id,
                            name: agent_info.firstName,
                            phoneNumber: phoneNumber,
                            userState: channel_info ? userState : ''
                        }
                    });
                });
            }
            getAgentListFromGws(getAgentListCallback); 
        }
    }

}
</script>