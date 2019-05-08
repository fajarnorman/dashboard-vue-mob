import Vue from 'vue'
import VueRouter from 'vue-router'
import produkRouter from './produk'
import pelangganRouter from './pelanggan'
import agenRouter from './agen'
import mobileAppsRouter from './mobileApps'
import serviceOfflineHubRouter from './services/offlineHubs'
import serviceNotificationsRouter from './services/notifications'
import serviceGold from './services/gold'
import serviceMutationBank from './services/mutationBank'
import serviceProductStatus from './services/productStatus'
import serviceDrone from './services/drone'

Vue.use(VueRouter)

const baseRoutes = [];
const routes = baseRoutes.concat(produkRouter)
                         .concat(pelangganRouter)
                         .concat(agenRouter)
                         .concat(mobileAppsRouter)
                         .concat(serviceOfflineHubRouter)
                         .concat(serviceNotificationsRouter)
                         .concat(serviceGold)
                         .concat(serviceMutationBank)
                         .concat(serviceProductStatus)
                         .concat(serviceDrone)

const VueRouters = new VueRouter({
    // use this in server if you place this project inside a folder
    base: '/',
    routes,
    mode: 'history',
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
})

VueRouters.beforeEach((to, from, next) => {
    next()
    if(window.innerWidth <= 768){
        setTimeout(function(){
            document.getElementsByClassName('sidebar')[0].classList.remove('showing')
        }, 200)
    }
})

export default VueRouters;