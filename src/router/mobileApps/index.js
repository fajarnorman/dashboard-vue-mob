import appVersion from '@/pages/MobileApp/appVersion/Index.vue'
import userMenu from '@/pages/MobileApp/userMenu/Index.vue'
import kirimNorifikasi from '@/pages/MobileApp/notifications/Index.vue'
import SlideShow from '@/pages/MobileApp/slideShow/Index.vue'
import PoinClaimItem from '@/pages/MobileApp/pointClaimItem/Index.vue'
import InterstitialBanner from '@/pages/MobileApp/interestitialBanner/Index.vue'
import Backlink from '@/pages/MobileApp/backlink/Index.vue'
import MerchantMenu from '@/pages/MobileApp/merchantMenu/Index.vue'

export default [
    { path: '/app-version', name: 'appVersion', component: appVersion },
    { path: '/user/menu', name: 'user-menu', component: userMenu },
    { path: '/kirim-notif', name: 'notifications', component: kirimNorifikasi },
    { path: '/slideshow', name: 'slideshow', component: SlideShow },
    { path: '/poin-klaim-item', name: 'poin-claim-item', component: PoinClaimItem },
    { path: '/interstitialbanner', name: 'interestitial-banner', component: InterstitialBanner },
    { path: '/backlink', name: 'backlink', component: Backlink },
    { path: '/merchant-menu', name: 'merchant-menu', component: MerchantMenu },
]