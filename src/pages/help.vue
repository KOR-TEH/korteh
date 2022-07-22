<template>
  <div class="grid">
    <div class="col-13 md:col-7">
	<div class="card">	
			<h5>Справка</h5>
			<h5>Номер лицензии:</h5>	
	</div>
    </div>
  </div>	
</template>
<script async setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useCookie } from 'vue-cookie-next'
import { useRoute, useRouter } from 'vue-router'
import fetch from 'cross-fetch'

const router = useRouter()
const toast = useToast()
const { getCookie, setCookie, removeCookie } = useCookie()
//const stateuser = ref(useCookie('stateUser'))

const stateuser = getCookie('userState')

const state = reactive({
  countVideos: 0,
  countAnomalies: 0,
})

  onMounted(
    async () => { 

	}
  )

const init = async () => {
   try {
    const res = await fetch(`http://84.201.177.58:3000/api/videos`,{
	  //method: 'post',
	  headers: {
	  "Content-Type": 'application/json',
	  'Authorization':'Token  '+stateuser.token
	  },
	})
    
    if (res.status >= 400) {
      throw new Error("Bad response from server")
    }
    
    const json = await res.json()
    console.log('video-data',state,json)
	state.countVideos = json.length
	//countAnomalies.value = 0
	json.map(item => state.countAnomalies += parseInt(item.founded_anomaly))
  } catch (err) {
    console.error(err)
  }
}
	  init()  
</script>
<route lang="yaml">
meta:
  layout: false
</route>
