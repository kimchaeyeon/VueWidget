<template>
    <div class="widget-input">
        <div v-if="this.$parent.isLoginMode">
            <div>Dial</div>
            <input 
                :value="phoneNumber"
                :placeholder="placeholder"
                type="text" 
                @input="phoneNumber = $event.target.value"
                @keypress.enter="onClickDial"
                >
            <button @click="onClickDial">
                <i class="material-icons">call</i>
            </button>
        </div>
        <div v-else>
            <div>Dial</div>
            <input 
                :placeholder="placeholder"
                type="text"
                >
            <button @click="loginCheckAlert">
                <i class="material-icons">call</i>
            </button>
        </div>
    </div>
</template>

<script>
import { dial } from '../assets/js/callAPI'

export default {
    data () {
        return {
            phoneNumber: '',
            placeholder: '               전화번호 입력',
        }
    },
    methods: {
        loginCheckAlert () {
                alert('로그인 후 사용하세요!');
                return;
        },
        onClickDial () {
            const phoneNumber = this.phoneNumber;
            const validatedNumber = phoneNumber && phoneNumber.trim();

            if( !validatedNumber ){
                alert( '전화번호를 정확하게 입력해주세요.' );
                this.phoneNumber = this.phoneNumber.trim();

                return;
            }

            dial( phoneNumber, this.$parent.deviceId );
            this.phoneNumber = '';
            console.log( '전화걸자', phoneNumber );
        }

    }
}
</script>