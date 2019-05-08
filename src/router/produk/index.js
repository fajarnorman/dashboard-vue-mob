import Dashboard from '@/pages/Produk/dashboard/'
import ReportTRDigital from '@/pages/Produk/report/PPOB/Index.vue'
import ReportTRClaim from '@/pages/Produk/report/claim/Index.vue'
import ReportTRTransfer from '@/pages/Produk/report/transfer/Index.vue'
import ReportPenjualan from '@/pages/Produk/report/penjualan/Index.vue'
import ReportDetailPenjualan from '@/pages/Produk/report/penjualan/Detail.vue'
import ReportDaftarPelanggan from '@/pages/Produk/report/pelanggan/Index.vue'
import ReportMutasiSaldo from '@/pages/Produk/report/mutasi/Index.vue'
import ReportUsePromo from '@/pages/Produk/report/usePromo/Index.vue'
import ReportTopUp from '@/pages/Produk/report/topUp/Index.vue'
import MSBarang from '@/pages/Produk/masterBarang/Index.vue'
import MSAttribut from '@/pages/Produk/masterBarang/Attribut.vue'
import MSProduct from '@/pages/Produk/masterBarang/Produk.vue'
import MSKategory from '@/pages/Produk/masterBarang/CategoryProduct.vue'
import Skus from '@/pages/Produk/productDigital/skus/Index.vue'
import SkuBrand from '@/pages/Produk/productDigital/skuBrand/Index.vue'
import SkuComparison from '@/pages/Produk/productDigital/skuComparison/Index.vue'
import SkuLimit from '@/pages/Produk/productDigital/skuLimit/Index.vue'
import TransferPulsa from '@/pages/Produk/transferTransaksi/transferPulsa.vue'
import TransaksiPulsa from '@/pages/Produk/transferTransaksi/transaksiPulsa.vue'
import TransaksiPenjualan from '@/pages/Produk/transferTransaksi/transaksiPenjualan.vue'

export default [
    { path: '/', name: 'dashboard', component: Dashboard },
    { path: '/report/transaksi-digital', name: 'report-transaksi-digital', component: ReportTRDigital },
    { path: '/report/transaksi-claim', name: 'report-transaksi-claim', component: ReportTRClaim },
    { path: '/report/transaksi-transfer', name: 'report-transaksi-transfer', component: ReportTRTransfer },
    { path: '/report/penjualan', name: 'report-penjualan', component: ReportPenjualan },
    { path: '/report/penjualan/detail-penjualan', name: 'report-detail-penjualan', component: ReportDetailPenjualan },
    { path: '/report/daftar-pelanggan', name: 'report-daftar-pelanggan', component: ReportDaftarPelanggan },
    { path: '/report/mutasi-saldo', name: 'report-mutasi-saldo', component: ReportMutasiSaldo },
    { path: '/report/pemakaian-promo', name: 'report-usepromo', component: ReportUsePromo },
    { path: '/report/topup', name: 'report-topup', component: ReportTopUp },
    { path: '/barang', name: 'ms-barang', component: MSBarang },
    { path: '/atribut', name: 'ms-attribut', component: MSAttribut },
    { path: '/product', name: 'ms-product', component: MSProduct },
    { path: '/category-product', name: 'ms-category', component: MSKategory },
    { path: '/sku', name: 'sku', component: Skus },
    { path: '/skubrand', name: 'skubrand', component: SkuBrand },
    { path: '/sku-comparison', name: 'skucomparison', component: SkuComparison },
    { path: '/sku-limit', name: 'skulimit', component: SkuLimit },
    // { path: '/ppob/transfer', name: 'transfer-pulsa', component: Transfer__Pulsa },
    { path: '/transaction-pulsa', name: 'transaksi-ppob', component: TransaksiPulsa },
    { path: '/transaction-item', name: 'transaksi-items', component: TransaksiPenjualan },
]