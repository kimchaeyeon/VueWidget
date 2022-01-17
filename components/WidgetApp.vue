<template>
    <div class="widget-app">
        <widget-login></widget-login>
        <hr style="width: 550px; border: 1px solid #dee2e6;" />
        <widget-status></widget-status>
        <widget-input></widget-input>
        <widget-func></widget-func>
      <div class="col-auto">
      </div>
    </div>

</template>

<script>

//컴포넌트는 상대 경로로 불러옴
import WidgetLogin from './WidgetLogin'
import WidgetStatus from './WidgetStatus'
import WidgetInput from './WidgetInput'
import WidgetFunc from './WidgetFunc'

import { get, post, ready } from '../assets/js/callAPI'


export default {
    components: {
        WidgetLogin,
        WidgetStatus,
        WidgetInput,
        WidgetFunc
    },
    data () {
        return {
            isLoginMode: false,
            csrfHeaderName: '',
            csrfToken: '',
            cometd: '',
            connected: false,
            subscription: '',
            baseUri: 'https://dev.communicationcloud.co.kr',
            widget: {
                username: '',
                password: '',
                extension: '',
                deviceId: '',
                currentCall_id: '',
                deviceState: '',
                device_message_data: '',
                userState: '',
                channel: '',
                call_data: '',
                eventName: '',
                eventData: {
                    participants: '',
                    callType: '',
                    ani: '',
                    dnis: '',
                    id: '',
                    callUuid: '',
                    channelType: '',
                    userData: ''
                }
                
            }
            
        }
    },
    methods: {
        login(id, pw) {
            this.widget.username = id
            this.widget.password = pw
            console.log("[login]")
            this.getMeSubresources(id,pw)
        },

        logout() {
            //endContactCenterSession
            this.cometd.disconnect()
            post({
                uri: "/api/v2/me",
                json: { operationName: "EndContactCenterSession" },
                callback: this.onEndContactCenterSessionComplete
            })
        },  

        getMeSubresources(id,pw) {
            get({
                uri: "/api/v2/me?subresources=features,devices,channels,settings",
                includeCredentials: true,
                username: id,
                password: pw,
                callback: this.connectCometD
            })
        },

        connectCometD(data) {
            this.startWidgetCometD()
            this.widget.deviceId = data.user.devices[0].id
            this.widget.extension = data.user.devices[0].phoneNumber
            console.log(this.widget.extension)
            //  var reqHeaders = {}
            // reqHeaders[this.csrfHeaderName] = this.csrfToken
            this.cometd.unregisterTransport('websocket')
            this.cometd.unregisterTransport('callback-polling')
            this.cometd.configure({
                url: this.baseUri + '/api/v2/notifications',
                 logLevel: "trace",
                // requestHeaders: reqHeaders
            })
            this.cometd.handshake()
        },

        startWidgetCometD() {
            console.log('>> startWidgetCometD')
            this.cometd = $.cometd
            this.cometd.addListener('/meta/handshake', this.onHandshake)
            this.cometd.addListener('/meta/connect', this.onConnect)
            this.cometd.addListener('/meta/disconnect', this.onDisconnect)
        },

        onHandshake(handshake) {
            try {
                console.log("[onHandshake]")
                if (handshake.successful === true) {
                    if (this.subscription) {
                        console.log('unsubscribing: ' + this.subscription)
                        this.cometd.unsubscribe(this.subscription)
                    }
                    console.log('Subscribing to channels...')

                    this.subscription = this.cometd.subscribe('/v2/me/*', this.onMessage)
                }else {
                    console.log("[handshake실패]")
                    }
                } catch (error) {
                    console.log(error)
                    }
        },

        onMessage(message) {
            console.log("[Event][message][" + message.data.messageType + "]")
            console.log(message.data)

            if(message.data.messageType === "DeviceStateChangeMessage") {
                //디바이스 상태 변경 시
                this.widget.deviceState = message.data.devices[0].deviceState
                this.widget.device_message_data =  message.data.devices[0]
                this.widget.userState = message.data.devices[0].userState.displayName
                console.log("[deviceState]:" + this.widget.deviceState)
                console.log("[userState]:" + this.widget.userState)
            }
            try {
                if(message.data.messageType === "CallStateChangeMessage") {
                    this.widget.channel = "voice"
                    this.widget.call_data = message.data.call
                    this.widget.id = message.data.call.id
                    this.widget.call_data.channel = "voice"
                    this.widget.message_data = message.data
                    this.widget.eventName = message.data.call.state
                    this.widget.eventData = {
                        participants: message.data.call.participants,
                        callType: message.data.call.callType,
                        ani: message.data.call.ani,
                        dnis: message.data.call.dnis,
                        id: message.data.call.id,
                        callUuid: message.data.call.callUuid,
                        channelType: this.widget.channel,
                        userData: message.data.call.userData
                    }
                    console.log("this.widget.eventData",this.widget.eventData)
                    
                    switch (message.data.notificationType){
                        case "StatusChange":
                            console.log("[CallEvent][" + message.data.call.state + "]")
                            console.log(message.data.call)

                            switch(message.data.call.state) {
                                case "Dialing": //전화 거는 중
                                    this.widget.currentCall_id = this.widget.id
                                    this.widget.userState = "Dialing"
                                    break;
                                case "Ringing": //전화 울리는 중
                                    if(message.data.call.callType == "Inbound"){
                                        try {
                                            this.widget.currentCall_id = this.widget.id
                                            this.widget.userState = "Ringing"
                                            //화면에 보여주는 메소드 생성하기
                                        } catch (e) {
                                            console.log(e)
                                        } finally {}
                                    } else {
                                        this.widget.currentCall_id = this.widget.id
                                    }
                                    break;
                                case "Released": //상대발 콜의 상태가 끊어짐
                                    this.widget.userState = "Released"
                                    break;
                                case "Established": 
                                    //보류해제인 경우, 전화 연결인 경우 두가지 있음
                                    console.log("[전화연결됨]");
                                    this.widget.userState = "Established"
                                    break;
                                case "Held": //전화 보류
                                    console.log("[전화보류]")
                                    break;
                                default:
                                    console.log("switch:default")

                            }
                            break;
                        case "ParticipantsUpdated":
                            break;
                        case "AttachedDataChanged":
                            break;
                        case "CallRecordingStateChange":
                            break;

                        default:
                            break;

                    }
                }
                
            } catch (error) {
                console.log("[CallStateChangeMessage]Error:")
                console.log(error)
            }
        },

        onConnect(message) {
            if (this.cometd.isDisconnected()) {
                return;
            }
            var wasConnected = this.connected
            this.connected = message.successful
            if (!wasConnected && this.connected) {
                console.log('Cometd connected.')
                this.startContactCenterSession()
            } else if (wasConnected && !this.connected) {
                console.log('Cometd disconnected.')
            }
        },

        onDisconnect(message) {
            if (message.successful) {
                this.connected = false
            }
        },

        startContactCenterSession() {
            post({
                uri: '/api/v2/me',
                json: {
                    operationName: 'StartContactCenterSession',
                    channels: ['voice']
                }
            })
            ready()
        },

        onEndContactCenterSessionComplete() {
            this.csrfHeaderName = null
            this.csrfToken = null
            console.log('[Logout]')
        }

    }
}

</script>

<style lang="scss">
    @import "../scss/style";
</style>