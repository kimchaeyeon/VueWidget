<template>
    <div class="widget-input">
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
</template>

<script>
import { dial } from "../assets/js/callAPI"


export default {
    data () {
        return {
            phoneNumber: "",
            placeholder: "               전화번호 입력",
        }
    },
    methods: {
        onClickDial () {
            const phoneNumber = this.phoneNumber;
            const validatedNumber = phoneNumber && phoneNumber.trim();

            if( !validatedNumber ){
                alert( "전화번호를 정확하게 입력해주세요." );
                this.phoneNumber = this.phoneNumber.trim();

                return;
            }

            dial( phoneNumber, this.$parent.deviceId );
            this.phoneNumber = "";
            console.log( "전화걸자", phoneNumber );
        }
    }
}
</script>