<template>
    <div class="grid panel-demo">
	    <ConfirmDialog/>
                <Dialog header="Новое сканирование" @addProject="emitProjectAdd" v-model:visible="showAddVideo" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
					<div class="card p-fluid">
                    <p>
					  сканирование: {{ socketState.id }} {{ socketState.status }} {{ socketState.data }}
					--{{ socketState.complete }}
					</p>
					<p>
					<ProgressBar v-if="socketState.data" :value="socketData" />
					</p>
					<div class="formgrid grid">
							<div class="field col">
								<label for="date">Дата и время</label>
								<InputText id="date" type="text" :value="state.datetime"/>

							
							</div>
							<div class="field col">
	
								<label for="frequency">Частота кадров в сек.</label>
								<InputText id="frequency" type="text" :value="state.frequency"/>								
							</div>
						</div>
						
						<div class="field">
								<label for="link">Ссылка на видео</label>
								<InputText id="link" type="text" :value="state.link"/>
						</div>
						<div class="field">
								<label for="frequency">Загрузка видеофайла вручную</label>
                                <FileUpload name="file[]" :customUpload="true" @uploader="importUploader" mode="basic" ref='file' accept="" :maxFileSize="50000000000" label="Загрузка видео" chooseLabel="Загрузка видео" class="mr-2" />					

						</div>						

					</div>
                    <template #footer>
					    <Button label="Начать сканирование" @click="addVideoSock" icon="pi pi-check" class="p-button-success" />
                        <Button label="Отменить" @click="showAddVideo = !showAddVideo" icon="pi pi-check" class="p-button-secondary" />
                    </template>
                </Dialog>	
                <Dialog header="Новый проект" v-model:visible="showAddProject" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
					<div class="card p-fluid">

					<div class="formgrid grid">
							<div class="field col">
								<label for="name">Наименование</label>
								<InputText id="name" v-model="state.project_name" type="text" class="p-input-sm mb-3" placeholder="Наименование" style="padding:1rem;" />
							</div>
						</div>

					</div>
                    <template #footer>
					    <Button label="Создать" @click="addProject" icon="pi pi-check" class="p-button-success" />
                        <Button label="Отменить" @click="showAddProject = !showAddProject" icon="pi pi-check" class="p-button-secondary" />
                    </template>
                </Dialog>					
        <div class="col-12 md:col-12">
            <Toast />
			<template v-for="(item, index) of projects">
            <Card v-if="projects[index].id" class="mb-2">
                <template v-slot:title>
                    <div class="flex align-items-center justify-content-between mb-0">
                       <h5>Проект # {{ item.name }}</h5>
                   </div>
                </template>

                <template v-slot:content>

                <DataTable
                    :value="item.video"
                    :paginator="true"
                    class="p-datatable-gridlines"
                    :rows="3"
                    dataKey="id"
                    :rowHover="true"
                    :loading="loading"
                    responsiveLayout="scroll"
                >
					<template #header>
					  <div class="flex justify-content-between flex-column sm:flex-row">
						<Button icon="pi pi-plus" label='Добавить сканирование' class="p-button-raised p-button-text" @click="startAddVideo(item.id, index, item)" />
						<Button icon="pi pi-trash" label='Удалить проект' class="p-button-raised p-button-text" @click="confirmDelete(index, 'project', 'проект')" />
					  </div>
				   </template>
                    <template #empty> Ничего не загружено. </template>
                    <template #loading> В процессе... </template>
                    <Column field="id" header="Id сканирования" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.id }} {{ stateuser.last_name }}
                        </template>
                    </Column>
                    <Column field="downloaded" header="Сканирование" data-type="date" style="min-width:2rem" headerStyle="text-align: center" bodyStyle="text-align: center">
                     <template #body="{data}">
                        <span style="width:100%;text-align:center">{{ data.downloaded }} <p>{{ data.video_time }}</p></span>
                     </template>
                    </Column>
					  <Column field="status" header="Статус" :show-filter-match-modes="false" headerStyle="text-align: center" style="min-width: 2rem;" bodyStyle="text-align: center; ">
					<template #body="{data}" class="">
					 <span style="width:100%;text-align:center">
					   {{ data.status }} 
					   <div v-if="data.status != 'Выполнено'" class="preloader-container">
						  <div class="circle circle-1" style="margin-left:3rem"></div>
						  <div class="circle circle-2"></div>
						  <div class="circle circle-3"></div>
						  <div class="circle circle-4"></div>
						  <div class="circle circle-5"></div>
					   </div>
					 </span>
					</template>
					  </Column>					
					
					
					

                    <Column header="Действия">
                        <template #body="{data,index}, slotProps">
							  <a href="javascript:goVideo(data.id);" @click="goVideo(data.id)">
								<i class="pi pi-eye mr-4 p-text" style="font-size: 1.5rem; margin-right: 32px !important;" v-badge="data.founded_anomaly"></i>
							  </a>
							  <router-link to="#" class="mr-2" @click="(event) => fullReport(data.id)">
								<i class="pi pi-file mr-4 p-text-secondary" style="font-size: 1.5rem"></i>
							  </router-link>
							  <router-link to="#" @click="(event) => confirmDelete(data.id, 'video', 'сканирование')" >
								<i class="pi pi-trash mr-4 p-text-danger" style="font-size: 1.5rem"></i>
							  </router-link>
                        </template>
                    </Column>					
                </DataTable>
                </template>
            </Card>
			</template>
        </div>

</div>
</template>
<script setup lang='ts'>
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useCookie } from 'vue-cookie-next'
import fetch from 'cross-fetch'
import { useToast } from 'primevue/usetoast'
import { useRouter, useRoute } from "vue-router"
import { useConfirm } from "primevue/useconfirm"
import { useMenuStore } from '~/stores/menu'

import { Readable } from 'stream'
import * as XLSX from 'xlsx/xlsx.mjs'
import { read, writeFileXLSX } from 'xlsx'
import { set_cptable } from 'xlsx'
import * as cptable from 'xlsx/dist/cpexcel.full.mjs'
import * as cheerio from 'cheerio'
import * as htmlparser2 from 'htmlparser2'
import { useWebSocket } from '@vueuse/core'
set_cptable(cptable)

const props = defineProps({
  foo: String
})
const menustate = useMenuStore()
const route = useRoute()
const router = useRouter()

const emit = defineEmits(['addProject'])
const showAddProject = ref(false)
emit('addProject',showAddProject)
menustate.setMenuEmit(showAddProject)

const emitProjectAdd = () => {
  console.log('Emit',emit('addProject'))
  showAddVideo.value = true
}

menustate.setMenu({menu: 'stuff'})
console.log('menu-state',menustate.usedstate)

watchEffect(() => {
  console.log('Emit',emit('addProject'))
})

const toast = useToast()
const confirm = useConfirm()
const showWatchScan = ref(false)
const socketData = ref(0)
const interval = ref(null)
const { getCookie, setCookie, removeCookie } = useCookie()
const file = ref()
const menu = ref()
const projects = ref()
const stateuser = getCookie('userState')
const showAddVideo = ref(false)

const state = reactive({
  project_id: null,
  project_name:'',
  video_id: null,
  file: null,
  frequency: 10,
  datetime: ''
})

const socketState = reactive({
  id: null,
  status: null,
  complete: 0,
  send: null, //send()
  open: null, //open()
  close: null, //close()
  data: null, //{complete: 0}
})

const display = ref(false)
const loading = ref(false)
const loadingData = ref(false)
const customer = ref(null)
const filters = ref({global: []})
//const deleteProductsDialog = ref(false)
//const toolbarItems = ref()
//const cardMenu = ref()

onMounted (
  () => {
    projects.value = []
	customer.value = []
	clearFilter()
	getProjects()
	const my = getCookie('userState')
    console.log('user',my)	
  }
)

const sheetName = ref()
const addSheet = () => {
console.log('add-sheet')
}

const startAddProjects = (event) => {
  console.log('add-projects',event)
}

const menuSnake = async () => { 
let result = []
projects.value.map((data,key) => {
 result.push({ label: data.name, project_id: data.id, icon: 'pi pi-fw pi-bookmark', class: 'p-list-menu', items: []})
 data.video.map(item => {
   result[key].items.push({ label: `${item.founded_anomaly} Сканирование ${item.downloaded}`, icon: 'pi pi-fw pi-pause', to: `/projects-scans/${item.id}` })
 })
})

router.addMenu(result)
setCookie('userMenu', JSON.stringify(result))
console.log('записали кук-меню',getCookie('userMenu'))
}

const getProjects = async () => {
  loading.value = false
  try {
    const res = await fetch(`http://84.201.177.58:3000/api/cases`,{
	  //method: 'post',
	  headers: {
	  "Content-Type": 'application/json',
	  'Authorization':'Token  '+stateuser.token
	  },
	})
    
    if (res.status >= 400) {
      throw new Error("Bad response from server")
    }
    
    projects.value = await res.json()
	menuSnake() 
    console.log('projects',projects.value)
	loading.value = false
  } catch (err) {
    console.error(err)
  }
  
}

const obj = ref({})
const formData = ref(null)
import fs from 'vite-plugin-fs/browser'

const importUploader = async (event) => {
  console.log('получили файл с кнопки', event)
  formData.value = new FormData()
  let reader = new FileReader()
     
  const fileVideo = event.files[0]
  formData.value.append('file', event.files[0],event.files[0].name)
  toast.add({severity: 'warn', summary: 'Файл подгружен успешно', detail: 'название ' + event.files[0].name, life: 3000})
}

const goVideo = async (id) => {
  state.video_id = id
    router.push(`/projects-scans/${encodeURIComponent(id)}`)
}

const fullReport = async (id) => {  
  console.log(' ..',id)
  
}

const addProject = async () => {  
  loading.value = true
  try {
    const res = await fetch(`http://84.201.177.58:3000/api/cases`,{
	  method: 'post',
	  headers: {
	  "Content-Type": 'application/json',
	  'Authorization':'Token  '+stateuser.token
	  },
	  body: JSON.stringify({ name: state.project_name })
	})
    
    if (res.status >= 400) {
      throw new Error("Bad response from server")
    }
	getProjects()
	showAddProject.value = false
	loading.value = false
  } catch (err) {
    console.error(err)
  }   
}

const startAddVideo = (projectId, index) => {
  state.project_id = projectId
  showAddVideo.value = true
}

const autoUpdate = async () => {
nextTick(() => {
    //let interval = window.setInterval(() => {
      //getProjects()
	//const { status, data, send, open, close } = useWebSocket(`ws://84.201.177.58:3000/ws/ready/${state.frequency}/?token=${stateuser.token}`,{
    const { status, data, send, open, close } = useWebSocket(`ws://84.201.177.58/ws/test/5/?token=d9c02de1db59ca8d07c25dd15ac2de1bb7cb9065`,{

    heartbeat: {
      message: 'ping',
      interval: 1000,
    },
  })
  
  socketState.status = status
  socketState.id = state.frequency
  socketState.data = data  
  
let interval = window.setInterval(() => {
  //socketData.value = data
  console.log('exit',JSON.parse(data._value))
  const raw = JSON.parse(data._value)
  socketData.value = raw.complete
  if(socketState.status === 'CLOSED') window.clearInterval(interval)
},1000)  

  //socketState.complete = data.complete

  
  open()
//},2500)
})
}

const addVideoSock = async () => {
  autoUpdate()
}

const addVideo = async () => {
  formData.value.append('project_id', state.project_id)  
  formData.value.append('freq', state.frequency)  
  loading.value = true
  showAddVideo.value = false
  try {
    const res = await fetch(`http://84.201.177.58:3000/api/videos`,{
	  method: 'post',
	  headers: {
	  'Authorization':'Token  '+stateuser.token
	  },
	  body: formData.value
	})
    
    if (res.status >= 400) {
      throw new Error("Bad response from server")
    }
	autoUpdate()
  } catch (err) {
    console.error(err)
  } 
}

const confirmDelete = (id, action, title) => {
  confirm.require({
    message: 'Необходимо подтверждение операции',
    header: 'Удалить '+title,
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
      accept: () => {
	    if(action == 'project') deleteProject(id)
		if(action == 'video') deleteVideo(id)
        toast.add({severity:'info', summary:'Успех', detail:'Запись удалена успешно', life: 3000})
      },
      reject: () => {
        toast.add({severity:'error', summary:'Неуспех', detail:'Отмена удаления', life: 3000})
      }
  })
}

const deleteProject = async (id) => {
   loading.value = true
  
  try {
    const res = await fetch(`http://84.201.177.58:3000/api/cases/${projects.value[id].id}`,{
	  method: 'delete',
	  headers: {
	  "Content-Type": 'application/json',
	  'Authorization':'Token  '+stateuser.token
	  },
	})
    
    if (res.status >= 400) {
      throw new Error("Bad response from server")
    }
	projects.value[id].id = null
	loading.value = false
  } catch (err) {
    console.error(err)
  }  
}

const deleteVideo = async (id) => {
  loading.value = true
  try {
    const res = await fetch(`http://84.201.177.58:3000/api/videos/${id}`,{
	  method: 'delete',
	  headers: {
	  "Content-Type": 'application/json',
	  'Authorization':'Token  '+stateuser.token
	  },
	  
	})
    
    if (res.status >= 400) {
      throw new Error("Bad response from server")
    }
	getProjects()
  } catch (err) {
    console.error(err)
  }  
}

const open = (event) => {
  display.value = true
}
const close = (event) => {
  display.value = true
}
const toggle = (event) => {
  menu.value.toggle(event)
}

const initFilters = () => {
            filters.value = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                representative: { value: null, matchMode: FilterMatchMode.IN },
                date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
                balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
                verified: { value: null, matchMode: FilterMatchMode.EQUALS },
            }
}
const clearFilter = () => initFilters()
</script>  