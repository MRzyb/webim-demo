<template>
  <div class="video">
    <video ref='localVideo' className={localClassName} muted autoPlay playsInline/>
    <video ref='remoteVideo' className={remoteClassName} autoPlay playsInline/>
  </div>
</template>

<script>
import WebIM from '../config/WebIM'
var rtcCall = null
export default {
  data() {
    return {
        
    }
  },
  mounted() {
      
  }
}
</script>

<style scoped>
</style>
