import Pelanggan from '@/pages/Pelanggan/pelanggan/Index.vue'
import UserOTP from '@/pages/Pelanggan/userOtp/Index.vue'
import UserUpgradeRequest from '@/pages/Pelanggan/userUpgradeRequest/Index.vue'
import UserUpgradeRequestDetail from '@/pages/Pelanggan/userUpgradeRequest/Detail.vue'
import BalanceTopup from '@/pages/Pelanggan/balance/topup/Index.vue'
import BalanceWithdraw from '@/pages/Pelanggan/balance/withdraw/Index.vue'
import MutasiPoint from '@/pages/Pelanggan/mutasiPoint/Index.vue'
import MutasiPointDetail from '@/pages/Pelanggan/mutasiPoint/Detail.vue'
import KonfirmasiTopUp from '@/pages/Pelanggan/konfirmasiTopup/Index.vue'
import UserCheckValidReferar from '@/pages/Pelanggan/userCheckValidreferar/Index.vue'
import KodePromo from '@/pages/Pelanggan/kodePromo/Index.vue'
import Lokasi from '@/pages/Pelanggan/lokasi/Index.vue'
import Gamifications from '@/pages/Pelanggan/gamifications/Index.vue'
import TopupBonus from '@/pages/Pelanggan/topUpBonus/Index.vue'
import TopupBonusUsage from '@/pages/Pelanggan/topUpBonus/Detail.vue'

export default [
    { path: '/pelanggan', name: 'pelanggan', component: Pelanggan },
    { path: '/user/pin', name: 'userotp', component: UserOTP },
    { path: '/users/upgradeRequestList', name: 'userUpgradeRequest', component: UserUpgradeRequest },
    { path: '/users/upgradeRequestDetail/:id', name: 'userUpgradeRequestDetail', component: UserUpgradeRequestDetail },
    { path: '/agent/topup', name: 'balance-topup', component: BalanceTopup},
    { path: '/agent/withdraw', name: 'balance-withdraw', component: BalanceWithdraw },
    { path: '/mutasi-point', name: 'mutasi-point', component: MutasiPoint },
    { path: '/mutasi-point/:id', name: 'mutasi-point-detail', component: MutasiPointDetail },
    { path: '/konfirmasi-topup', name: 'konfirmasi-topup', component: KonfirmasiTopUp },
    { path: '/user/referer', name: 'user__referer', component: UserCheckValidReferar },
    { path: '/kode-promo', name: 'kode__promo', component: KodePromo },
    { path: '/lokasi', name: 'locations', component: Lokasi },
    { path: '/gamification', name: 'gamifications', component: Gamifications },
    { path: '/topupbonus', name: 'topupbonus', component: TopupBonus },
    { path: '/topupbonus/usage/:id', name: 'topupbonususage', component: TopupBonusUsage },
]