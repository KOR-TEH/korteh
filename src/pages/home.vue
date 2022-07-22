<template>
<div class="surface-ground px-4 py-5 md:px-6 lg:px-8">
    <div class="grid">
        <div class="col-12 md:col-6 lg:col-3">
            <div class="surface-card shadow-2 p-3 border-round">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Профиль</span>
                        <div class="text-900 font-medium text-xl">152</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">24 new </span>
                <span class="text-500">since last visit</span>
            </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
            <div class="surface-card shadow-2 p-3 border-round">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Количество обработанных видео</span>
                        <div class="text-900 font-medium text-xl">{{ state.countVideos }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">520  </span>
                <span class="text-500">за месяц</span>
            </div>
        </div>
        <div class="col-12 md:col-6 lg:col-3">
            <div class="surface-card shadow-2 p-3 border-round">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Количество выявленных дефектов</span>
                        <div class="text-900 font-medium text-xl">{{ state.countAnomalies }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-comment text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">85 </span>
                <span class="text-500">подтверждено</span>
            </div>
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
