import Produsen from '@/pages/Services/offlineHubs/produsen/Index.vue'
import StorePage from '@/pages/Services/offlineHubs/store/Index.vue'
import OfflineHubAttribute from '@/pages/Services/offlineHubs/masterBarang/Attribute.vue'
import OfflineHubCategoryProduct from '@/pages/Services/offlineHubs/masterBarang/CategoryProduct.vue'
import OfflineHubProduct from '@/pages/Services/offlineHubs/masterBarang/Product.vue'
import OfflineHubBarang from '@/pages/Services/offlineHubs/masterBarang/Barang.vue'
import OfflineHubType from '@/pages/Services/offlineHubs/masterBarang/Type.vue'
import OfflineHubLocations from '@/pages/Services/offlineHubs/locationsHubs/Index.vue'
import OfflineHubApproveBarang from '@/pages/Services/offlineHubs/approveBarang/Index.vue'
import OfflineHubTransactions from '@/pages/Services/offlineHubs/transaction/Index.vue'
import OfflineHubPencairan from '@/pages/Services/offlineHubs/pencarianFee/Index.vue'
import OfflineHubHistoryPencairanFee from '@/pages/Services/offlineHubs/pencarianFee/History.vue'
import OfflinehubLocationsManageStock from '@/pages/Services/offlineHubs/locationsHubs/manageStock.vue'
import OfflinehubLocationsHistoryStock from '@/pages/Services/offlineHubs/locationsHubs/historyStock.vue'
import OfflineHubReportFeeCrew from '@/pages/Services/offlineHubs/reportFee'

export default [
    { path: '/offline-hub/produsen', name: 'produsen', component: Produsen },
    { path: '/offline-hub/atribut', name: 'mb-offline-attribute', component: OfflineHubAttribute },
	{ path: '/offline-hub/kategori-produk', name: 'mb-offline-cat-product', component: OfflineHubCategoryProduct },
    { path: '/offline-hub/produk', name: 'mb-offline-product', component: OfflineHubProduct },
    { path: '/offline-hub/barang', name: 'mb-offline-barang', component: OfflineHubBarang },
    { path: '/offline-hub/tipe', name: 'mb-offline-tipe', component: OfflineHubType },
    { path: '/offline-hub/locations', name: 'mb-offline-locations', component: OfflineHubLocations },
    { path: '/offline-hub/approve/barang', name: 'mb-offline-approve-barang', component: OfflineHubApproveBarang },
    { path: '/offline-hub/transactions', name: 'mb-offline-approve-transaction', component: OfflineHubTransactions },
    { path: '/offline-hub/store', name: 'store', component: StorePage },
    { path: '/offline-hub/fee', name: 'mb-pencairan-fee', component: OfflineHubPencairan },
    { path: '/offline-hub/history/fee', name: 'mb_history_fee', component: OfflineHubHistoryPencairanFee },
    { path: '/offline-hub/hub/manage/:name/:id', name: 'mb_manage_stock', component: OfflinehubLocationsManageStock },
    { path: '/offline-hub/hub/history/:name/:id', name: 'mb_history_stock', component: OfflinehubLocationsHistoryStock },
    { path: '/offline-hub/report/fee', name: 'offlinehub-report-crew', component: OfflineHubReportFeeCrew },
]