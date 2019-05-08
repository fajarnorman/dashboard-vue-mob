import NotifySMSProvider from '@/pages/Services/notify/sms/Provider.vue'
import NotifySMSOperator from '@/pages/Services/notify/sms/Operator.vue'
import NotifySMSPricing from '@/pages/Services/notify/sms/Pricing.vue'
import NotifySMSReport from '@/pages/Services/notify/sms/Report.vue'

export default [
    { path: '/notify/sms/provider', name: 'notify-provider', component: NotifySMSProvider },
    { path: '/notify/sms/operator', name: 'notify-operator', component: NotifySMSOperator },
    { path: '/notify/sms/pricing', name: 'notify-pricing', component: NotifySMSPricing },
    { path: '/notify/sms/report', name: 'notify-report', component: NotifySMSReport },
]