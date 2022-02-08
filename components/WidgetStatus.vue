<template>
    <div>
        <div v-if="this.$parent.isLoginMode" 
            class="widget-status">
            <div class="status__device">
                Device : {{ getExt }}
            </div>
            <div class="status__customer">
                <div>Customers</div> 
                <div style="margin: 0 auto;
                            font-weight: bold;">
                {{ getCustNum }}
                </div>
            </div>

            <div class="status__status">
                <div>Status</div> 
                <div style="margin: 0 auto;
                            font-size: 50px;
                            font-weight: bold;">
                {{ getStatus }}
                </div>
            </div>
        </div>
        <div v-else 
            class="widget-status">
            <div class="widget__main">
                HANSOL INTICUBE
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
    },
    data () {
        return {
            isLoginMode: false,
            extension: '',
            customerNum: '',
            status: '',
        }
    },
    computed: {
        getExt () {
            this.extension = this.$parent.extension;
            return this.extension;
        },

        getCustNum () {
            
            if( this.$parent.call_data.callType == 'Inbound' ){
                this.customerNum = this.$parent.eventData.ani;
            } else if ( this.$parent.call_data.callType == 'Outbound' ) {
                this.customerNum = this.$parent.eventData.dnis;
            }

            if( this.$parent.call_data.state == 'Released' ){
                this.customerNum = '';
                return this.customerNum;
            }

            
            if( this.$parent.participants && this.$parent.participants != this.customerNum ) {
                this.customerNum = this.customerNum + ', ' + this.$parent.participants;
                return this.customerNum;
            }
            return this.customerNum;
        },
        
        getStatus () {
            //대기, 이석, 후처리, 통화 중
            //this.status = this.$parent.userState
            switch( this.$parent.userState ) {
                case 'Ready' :
                    this.status = '대기';
                    break;
                case 'Not Ready':
                    this.status = '휴식';
                    break;
                case 'AfterCallWork':
                    this.status = '후처리';
                    break;
                case 'Dialing':
                    this.status = '전화 발신 중';
                    break;
                case 'Ringing':
                    this.status = '전화 왔습니다';
                    break;
                case 'Released':
                    this.status = '전화 종료';
                    break;
                case 'Established':
                    this.status = '통화 중';
                    break;
                default:
                    this.status = '';
                    break;

            }
            return this.status;
        }
    },

    methods: {

    }
}
</script>
