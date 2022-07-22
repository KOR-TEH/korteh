<template>
<div class="surface-ground px-4 py-5 md:px-6 lg:px-8">
    <div class="grid">
        <div class="col-12 md:col-6 lg:col-4">
            <div class="surface-card shadow-2 p-3 border-round">


			<div class="flex justify-content-between align-items-center mb-3">
				<h5>Профиль пользователя</h5>
				<div>
					<Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu.toggle($event)"></Button>
					<Menu ref="menu" :popup="true" :model="[]"></Menu>
				</div>
			</div>
			<ul class="list-none p-0 m-0">
				<li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
					<div>
						<span class="text-900 font-medium mr-2 mb-1 md:mb-0">ФИО</span>
						<div class="mt-1 text-600">
						{{ state.last_name }}
						{{ state.first_name }}
						</div>
					</div>
					<div class="mt-2 md:mt-0 flex align-items-center"/>
				</li>
				<li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
					<div>
						<span class="text-900 font-medium mr-2 mb-1 md:mb-0">Email</span>
						<div class="mt-1 text-600">
						{{ state.email }}
						</div>
					</div>
					<div class="mt-2 md:mt-0 flex align-items-center"/>
				</li>

			</ul>
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
//const stateuser = ref()
const stateuser = getCookie('userState')// || {last_name: false}
//console.log('user',stateuser)
  onMounted(
    async () => { 
	  if(initState()) init()
	}
  )

const initState = async () => {
if(!stateuser) return false

  state.id = true
  state.last_name = stateuser.last_name
  state.first_name = stateuser.first_name
  state.email = stateuser.email
  state.countVideos = 0
  state.countAnomalies = 0

return true
}
const state = reactive({})

const init = async () => {
   //if(stateuser.value.last_name) 
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
	  //init()  
</script>
<route lang="yaml">
meta:
  layout: default
</route>
