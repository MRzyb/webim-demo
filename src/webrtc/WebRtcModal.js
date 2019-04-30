import WebIM from '../config/WebIM'
import {Message, MessageBox} from 'element-ui'

function initWebRTC() {
  console.log("InitWebRTC..........")
  if (WebIM.call) {
    return
  }
  console.log("InitWebRTC end..........")

  if (WebIM.WebRTC) {

    WebIM.call = new WebIM.WebRTC.Call({
      connection: WebIM.conn,
      mediaStreamConstaints: {
        audio: true,
        video: true
      },

      listener: {
        onAcceptCall: function (from, options) {
          console.log('onAcceptCall', 'from: ', from, 'options: ', option);
        },
        //通过streamType区分视频流和音频流，streamType: 'VOICE'(音频流)，'VIDEO'(视频流)
        onGotRemoteStream: function (stream, streamType) {
          console.log("onGotRemoteStream", stream, streamType);
          // WebIM.call.caller != "" && WebIM.call.caller == WebIM.conn.context.userId
          let video = document.getElementById('remoteVideo')
          video.srcObject = stream
        },
        onGotLocalStream: function (stream, streamType) {
          console.log("onGotLocalStream ", "Stream Type: ", stream, streamType);
          let video = document.getElementById("localVideo")
          console.log('video', video)
          video.srcObject = stream
        },
        // 应该是被呼叫的时候
        onRinging: function (caller, streamType) {
          let user = caller.split("@")[0].split("_")[1]
          let text = streamType === "VOICE" ? "请求视频通话..." : "请求语音通话..."
          console.log('onRinging', caller.split("@")[0].split("_")[1], streamType)
          // me.channel.ringing(caller, streamType)
          MessageBox.alert(`${user} ${text}`).then(() => {
            WebIM.call.acceptCall()
          }).catch(() => {
            WebIM.call.endCall()
          })
        },
        onTermCall: function (reason) {
          console.log("onTermCall", reason)
          if (reason && (reason === "busy" || reason === "BUSY")) {
            Message.error("Target is busy. Try it later.")
          }
          if (reason && (reason === "timeout" || reason === "NORESPONSE")) {
            Message.error("Target no response. Try it later.")
          }
          if (reason && (reason === "decline" || reason === "REJECT")) {
            Message.error("对方已拒绝");
          }
          if (reason && (reason === "failed-transport" || reason === "FAIL")) {
            Message.error("Call failed. Try it later.")
          }
          if (reason && (reason === "ok" || reason === "success" || reason === "HANGUP")) {
            Message.success("对方已挂断")
          }
          WebIM.call.caller = ""
          WebIM.call.callee = ""

          var videoObjs = document.getElementsByTagName("video");
          if (videoObjs && videoObjs.length > 0) {
            for (var i = 0; i < videoObjs.length; i++) {
              videoObjs[i].srcObject = null
            }
          }

        },

        onIceConnectionStateChange: function (iceState) {
          console.log('onIceConnectionStateChange', 'iceState:', iceState)
        },
        onError: function (e) {
          console.log(e)
          Message.error(e.message)
        }
      }
    })

    WebIM.conn.registerConfrIQHandler && (WebIM.conn.registerConfrIQHandler())
  } else {
    console.warn('不能进行视频通话！您的浏览器不支持webrtc或者协议不是https。')
  }
}

export default initWebRTC
