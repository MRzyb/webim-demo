import WebIM from '../config/WebIM'
var rtcCall = null
import { Message } from 'element-ui'


if (WebIM.WebRTC) {
  rtcCall = new WebIM.WebRTC.Call({
    connection: WebIM.conn,
    mediaStreamConstaints: {
      audio: true,
      video: true
    },

    listener: {
      onAcceptCall: function(from, options) {
        console.log('onAcceptCall::', 'from: ', from, 'options: ', options)
      },
      //通过streamType区分视频流和音频流，streamType: 'VOICE'(音频流)，'VIDEO'(视频流)
      onGotRemoteStream: function(stream, streamType) {
        console.log('onGotRemoteStream,stream', stream)
        console.log('onGotRemoteStream,streamType', streamType)
        var video = document.getElementById('remoteVideo')
        console.log('video2222222', video)
        video.srcObject = stream
      },
      onGotLocalStream: function(stream, streamType) {
        console.log('onGotLocalStream,stream', stream)
        console.log('onGotLocalStream,streamType', streamType)
        var video = document.getElementById('localVideo')
        video.srcObject = stream
      },
      onRinging: function(caller, streamType) {
        console.log('onRinging', caller)
        me.channel.ringing(caller, streamType)
      },
      onTermCall: function(reason) {
        console.log('onTermCall::')
        console.log('reason:', reason)
      },
      onIceConnectionStateChange: function(iceState) {
        console.log('onIceConnectionStateChange::', 'iceState:', iceState)
      },
      onError: function(e) {
        console.log(e)
        Message.error(e.message)
      }
    }
  })

  WebIM.conn.registerConfrIQHandler && (WebIM.conn.registerConfrIQHandler())
} else {
  console.warn('不能进行视频通话！您的浏览器不支持webrtc或者协议不是https。')
}

export default rtcCall
