import ProductStatus from '@/pages/Services/productStatus/Sku.vue'
import MonitoringProductStatus from '@/pages/Services/productStatus/dashboard.vue'

export default [
    { path: '/product-status/dashboard', name: 'monitoringDashboard', component: MonitoringProductStatus },
    { path: '/product-status/sku', name: 'productStatus', component: ProductStatus }
]