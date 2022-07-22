<template>
  <!--main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200"-->
  <main>
    <!--router-view />
    <Footer />
    <div class="mt-5 mx-auto text-center opacity-25 text-sm"/-->
    <div :class="containerClass" @click="onWrapperClick">
        <Topbar @menu-toggle="onMenuToggle" />
        <div class="layout-sidebar" @click="onSidebarClick">
            <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
        </div>

        <div class="layout-main-container">
            <div class="layout-main">
                <router-view />
            </div>
            <Footer />
        </div>

        <!--AppConfig :layoutMode="layoutMode" @layout-change="onLayoutChange" /-->
        <transition name="layout-mask">
            <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
        </transition>
		
                <Dialog header="Запрос в техподдержку" v-model:visible="supportDialog" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
					<div class="card p-fluid">

					<div class="formgrid grid">
						<div class="field col">
							<div class="field">
								<label for="name">Тема обращения</label>
								<InputText id="name" v-model="state.subject" type="text" class="p-input-sm mb-3" placeholder="Тема обращения" style="padding:1rem;" />
							</div>
							<div class="field">
								<label for="name">ФИО</label>
								<InputText id="name" v-model="state.fio" type="text" class="p-input-sm mb-3" placeholder="ФИО" style="padding:1rem;" />
							</div>							
							<div class="field">
								<label for="name">Email</label>
								<InputText id="name" v-model="state.email" type="text" class="p-input-sm mb-3" placeholder="Email - введите рабочий" style="padding:1rem;" />
							</div>
                            <div class="field">
                              <Textarea v-model="state.message" :autoResize="true" placeholder="Напишите нам" rows="5" cols="30" />
							</div>
				</div>	
					</div>

					</div>
                    <template #footer>
					    <Button label="Создать обращение" @click="addSupport" icon="pi pi-check" class="p-button-success" />
                        <Button label="Отменить" @click="supportDialog = !supportDialog" icon="pi pi-check" class="p-button-secondary" />
                    </template>
                </Dialog>		
    </div>
  </main>
</template>
<script async setup lang="ts">
//import axios from 'axios'
import { ref, reactive, onMounted, onBeforeUpdate, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCookie } from 'vue-cookie-next'
import { useToast } from 'primevue/usetoast'
import { useMenuStore } from '~/stores/menu'

//import AppTopBar from './AppTopbar.vue'
//import AppMenu from './AppMenu.vue'
//import AppConfig from './AppConfig.vue';
//import AppFooter from './AppFooter.vue'

const route = useRoute()
const router = useRouter()
const { getCookie, setCookie, removeCookie } = useCookie()
const toast = useToast()
const page = ref<any>({})
const menustate = useMenuStore()

const isAuth = ref(false)
const stateuser = ref(null) //
stateuser.value = getCookie('userState')
console.log('menu-state',stateuser.value)
if(!stateuser.value) router.push('/login')

const layoutMode = ref('static')
const staticMenuInactive = ref(false)
const overlayMenuActive = ref(false)
const mobileMenuActive = ref(false)
const menuActive = ref(false)
const menuClick = ref(false)

const menuData = [
                {
                    label: 'Меню',
                    items: [
                        {
                            label: 'Главная страница',
                            icon: 'pi pi-fw pi-home',
                            to: '/',
                        },
						{   label: 'Статус проектов', 
						    icon: 'pi pi-fw pi-sitemap', 
							to: '/projects' 
						},

					
                    ],
                },

                {
                    label: 'Сканирования',
                    icon: 'pi pi-fw pi-search',
                    items: [

                        {
                            label: 'Безымянный проект',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
							/*
                                {
                                    label: 'Submenu 1.1',
                                    icon: 'pi pi-fw pi-bookmark',
                                    items: [
                                        { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                        { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                        { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                                    ],
                                },
                                {
                                    label: 'Submenu 1.2',
                                    icon: 'pi pi-fw pi-bookmark',
                                    items: [
                                        { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' },
                                        { label: 'Submenu 1.2.2', icon: 'pi pi-fw pi-bookmark' },
                                    ],
                                },
							*/	
                            ],
                        },

                    ],
                },
                {
                    label: 'Поддержка',
                    items: [
                        {
                            label: 'Справка',
                            icon: 'pi pi-fw pi-question',
                            to: '/help' 
                        },
                        {
                            label: 'Техническая поддержка',
                            icon: 'pi pi-fw pi-envelope',
                            command: () => {
                                //window.location = 'https://github.com/primefaces/sakai-vue';
								supportDialog.value = true
                            },
                        },
                    ],
                },
]

const menu = ref(menuData)
const state = reactive({
  subject: '',
  fio: '',
  email: null,
  message: null,
})
const supportDialog = ref(false)
const addSupport = () => {
  supportDialog.value = false
}
/*
const fetchPage = async () => {
    console.log('route', route.params)
    const { data } = await axios.get(
        `/api/${route.params.locale}/pages/${route.params.slug}`,
        {
            params: {
                include: 'sections,documents,courses',
            },
        }
    )

    page.value = data.data
}
*/
onMounted(() => {
    //fetchPage()
	
if('menustate' in menustate) console.log('Шаблон запуск',menustate)	
else console.log('Шаблон запуск - проект пуст!')
	
router.addMenu = (items) => {
  console.log('Добавлялка',items)
  menu.value[1].items = items
} 	
})

onBeforeUpdate(() => {
   if (mobileMenuActive.value) addClass(document.body, 'body-overflow-hidden')
   else removeClass(document.body, 'body-overflow-hidden')
})

const containerClass = reactive([
    'layout-wrapper',
    {
      'layout-overlay': layoutMode.value === 'overlay',
      'layout-static': layoutMode.value === 'static',
      'layout-static-sidebar-inactive': staticMenuInactive.value && layoutMode.value === 'static',
      'layout-overlay-sidebar-active': overlayMenuActive.value && layoutMode.value === 'overlay',
      'layout-mobile-sidebar-active': mobileMenuActive.value,
      'p-input-filled': 'filled',//this.$primevue.config.inputStyle === 'filled',
      'p-ripple-disabled': false, //this.$primevue.config.ripple === false,
      'layout-theme-light': true, //this.$appState.theme.startsWith('saga'),
    },  
])

watch(() => {
  //route.params.slug, fetchPage
  console.log('Router+++',router)
  if(router.currentRoute.value.name == 'index'){
    console.log('чиним меню index..')
	//router.addMenu(JSON.parse(getCookie('userMenu')))
	menu.value[1].items = JSON.parse(getCookie('userMenu'))
  }  
  
  if(router.currentRoute.value.name == 'projects-scans-id'){
    console.log('чиним меню..')
	//router.addMenu(JSON.parse(getCookie('userMenu')))
	menu.value[1].items = JSON.parse(getCookie('userMenu'))
  }
  console.log('Menu',menustate) //.usedstate
  console.log('Route+++',route)

	router.params = route.params

  menuActive.value = false
  toast.removeAllGroups()  
 
})
//        AppTopBar: AppTopBar,
//        AppMenu: AppMenu,
        //AppConfig: AppConfig,
//        AppFooter: AppFooter,

const onWrapperClick = () => {
  if (!menuClick.value) {
    overlayMenuActive.value = false
    mobileMenuActive.value = false
  }
  menuClick.value = false
}
const onMenuToggle = (event) => {
  menuClick.value = true
  if (isDesktop()) {
    if (layoutMode.value === 'overlay') {
      if (this.mobileMenuActive === true) {
        overlayMenuActive.value = true
      }
      overlayMenuActive.value = !overlayMenuActive.value
      mobileMenuActive.value = false
    } else if (layoutMode.value === 'static') {
      staticMenuInactive.value = !staticMenuInactive.value
    }
  } else {
    mobileMenuActive.value = !mobileMenuActive.value
  }
  event.preventDefault()
}
const onSidebarClick = () => {
  menuClick.value = true
}
const onMenuItemClick = (event) => {
  if (event.item && !event.item.items) {
    overlayMenuActive.value = false
    mobileMenuActive.value = false
  }
}
const onLayoutChange = (layoutMode) => {
  layoutMode.value = layoutMode
}
const addClass = (element, className) => {
  if (element.classList) element.classList.add(className)
  else element.className += ' ' + className
}
const removeClass = (element, className) => {
  if (element.classList) element.classList.remove(className)
  else element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
}
const isDesktop = () => {
  return true //window.innerWidth >= 992;
}
const isSidebarVisible = () => {
  if (isDesktop()) {
    if (layoutMode.value === 'static') return !staticMenuInactive.value
    else if (layoutMode.value === 'overlay') return overlayMenuActive.value
  }
  return true
}
</script>
<style lang="scss">
/*@import './App.scss';*/
</style>
