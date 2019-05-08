import DronePackage from '@/pages/Services/drone/paket.vue'
import DroneLandType from '@/pages/Services/drone/tipeLahan.vue'
import DroneTransactions from '@/pages/Services/drone/transactions.vue'

export default[
    { path: '/drone/package', name: 'dronePackage', component: DronePackage },
    { path: '/drone/type-land', name: 'droneTypeLand', component: DroneLandType },
    { path: '/drone/transactions', name: 'droneTransactions', component: DroneTransactions }
]