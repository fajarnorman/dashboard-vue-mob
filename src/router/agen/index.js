import AgentList from '@/pages/Agen/agent/Index.vue'
import AgentTransactions from '@/pages/Agen/agent/Transactions.vue'
import AgentHead from '@/pages/Agen/agent/Head.vue'
import AgentHeadDetail from '@/pages/Agen/agent/HeadDetail.vue'
import AgentTarget from '@/pages/Agen/agent/Target.vue'
import AgentTargetDetail from '@/pages/Agen/agent/TargetDetail.vue'
import AgentAchivementDetail from '@/pages/Agen/agent/AchivementDetail.vue'
import AgentBonus from '@/pages/Agen/agent/Bonus.vue'
import AgentProduct from '@/pages/Agen/agent/Product.vue'
import User from '@/pages/Agen/user/Index.vue'
import Kios from '@/pages/Agen/kios/Index.vue'
import kirimBalance from '@/pages/Agen/pengirimanBalance/kirimBalance.vue'
import groupBalance from '@/pages/Agen/pengirimanBalance/group.vue'
import Permisson from '@/pages/Agen/permission/Index.vue'
import PermissonDetail from '@/pages/Agen/permission/Detail.vue'
import PermissionCreate from '@/pages/Agen/permission/Create.vue'
import Reference from '@/pages/Agen/reference/Index.vue'
import Withdrawal from '@/pages/Agen/withdrawal/Index.vue'
import WithdrawalReview from '@/pages/Agen/withdrawal/Reviews.vue'
import WithdrawalCashoutPoint from '@/pages/Agen/withdrawal/CashoutPoint.vue'
import WithdrawalSetting from '@/pages/Agen/withdrawal/Setting.vue'

export default [
    { path: '/agent', name: 'agent', component: AgentList },
    { path: '/agent/transaksi', name: 'agent-transaction', component: AgentTransactions },
    { path: '/agent/head', name: 'agent-head', component: AgentHead },
    { path: '/agent/head/:id', name: 'agent__head__detail', component: AgentHeadDetail },
    { path: '/agent/target', name: 'agent-target', component: AgentTarget },
    { path: '/agent/target-region/:id', name: 'agent__target_detail', component: AgentTargetDetail },
    { path: '/agent/:id/achievements/:month', name: 'agent__achievment_detail', component: AgentAchivementDetail },
    { path: '/agent/bonus', name: 'agent-bonus', component: AgentBonus },
    { path: '/agent/targeted-product', name: 'agent-targeted', component: AgentProduct },
    { path: '/user', name: 'user', component: User },
    { path: '/kios', name: 'Kios', component: Kios },
    { path: '/user/sendBalance', name: 'send-Balance', component: kirimBalance },
    { path: '/users/sendBalanceGroup', name: 'group-Balance', component: groupBalance },
    { path: '/permission', name: 'permission', component: Permisson },
    { path: '/permission/:id/edit', name: 'permission_edit', component: PermissonDetail },
    { path: '/permission/create', name: 'permission-create', component: PermissionCreate },
    { path: '/reference', name: 'reference', component: Reference },
    { path: '/withdrawal', name: 'withdrawal', component: Withdrawal },
    { path: '/withdrawal/review', name: 'withdrawalReviews', component: WithdrawalReview },
    { path: '/withdrawal/cashoutpoint', name: 'withdrawalCashoutPoint', component: WithdrawalCashoutPoint },
    { path: '/withdrawal/setting', name: 'withdrawalSetting', component: WithdrawalSetting },
]