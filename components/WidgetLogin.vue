<template>
    <div class="widget-login">
        <div v-if="!this.$parent.isLoginMode" 
            class="login-input">
            <label>ID
                <input 
                    :value="id"
                    type="text"
                    @input="id = $event.target.value">
            </label>
            <label>PW
                <input 
                    :value="pw"
                    type="text"
                    @input="pw = $event.target.value">
            </label>
            <button v-if="!this.$parent.isLoginMode"
                class="btn"
                @click="onclickLogin">
            Login
            </button>
        </div>

        <div v-else 
            class="login-input">
            상담원 {{this.$parent.agentName}}님, 반갑습니다 👩‍💼
            <button class="btn"
                    @click="onclickLogout">
                Logout
            </button>
        </div>

    </div>
</template>

<script>

export default {
    data () {
        return {
            id: '',
            pw: '',
        }
    },
    methods: {
        onclickLogin(){
            const id = this.id
            const pw = this.pw
            const validatedLogin = id && id.trim() && pw && pw.trim()
            if(!validatedLogin){
                alert( '아이디또는 패스워드를 정확하게 입력해주세요.' );
                this.id = this.id.trim();
                this.pw = this.pw.trim();
                return;
            }
            console.log(`id:${id}, pw:${pw}`);
            this.$parent.login( id, pw );

            if( this.$parent.isLoginMode == false ){
                this.$parent.isLoginMode = !this.$parent.isLoginMode;
            }
            
        },
        onclickLogout(){
            const id = this.id;
            const pw = this.pw;
            console.log(`id:${id}, pw:${pw}`);
            this.$parent.logout();
            this.id = '';
            this.pw = '';
            // 새로고침 기능 넣기
            if( this.$parent.isLoginMode == true ){
                this.$parent.isLoginMode = !this.$parent.isLoginMode;
            }
        }
    }
}


</script>