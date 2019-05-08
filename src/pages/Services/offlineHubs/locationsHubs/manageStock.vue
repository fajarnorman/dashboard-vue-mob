<template>
    <div class="content-wrapper">
        <div id="manage-stock-hub">
            <div class="page-header" style="margin-top: 15px;">
                <div class="page-header-content">
                    <router-link v-bind:to="'/offline-hub/locations'" class="back-button">
                        <i class="icon icon-caret-left"></i> Lokasi Hubs
                    </router-link>
                    <div class="page-title clearfix">
                        <h4 class="float-left">Manage Stock Hub {{nameHub}}</h4>
                        <div class="add-actions float-right">
                            <a @click.prevent="getExcel">
                                <el-button class="button-outline-green" round>
                                    <img src="~assets/images/icons/download-new.png" v-if="(loadingExcel == false)">
                                    <div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div>
                                    Export
                                </el-button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content">
                <section>
                    <div class="filterSearching clearfix">
                        <el-select v-model="typeSearch">
                            <el-option value="" label="Pilih Tipe Produk">All Tipe</el-option>
                            <el-option 
                                v-for="(dataType, indexType) in itemsDataType" 
                                :key="indexType" 
                                :value="dataType.id" 
                                :label="dataType.title">
                                {{dataType.title}}
                            </el-option>
                        </el-select>
                    </div>
                    <el-alert 
                        v-if="messagesuccess" 
                        title="" 
                        type="success" 
                        :description="messagesuccess" 
                        show-icon></el-alert>
                    <el-table 
                        :data="itemsData" 
                        empty-text="No data available in table"
                        ref="singleTables"
                        @current-change="handleCurrentChange"
                        v-loading="loading"
                        class="mobayar-table">
                        <el-table-column type="index" label="No" width="50"></el-table-column>
                        <el-table-column prop="name" label="Name"></el-table-column>
                        <el-table-column label="Images" align="center">
                            <template slot-scope="scope">
                                <div v-if="(scope.row.images).length !== 0">
                                    <img v-if="scope.row.images[0].url !== null" class="img-auto product-images" :src="scope.row.images[0].url + scope.row.images[0].image">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="stock" label="Stock" align="center"></el-table-column>
                    </el-table>

                    <div class="base-template-sidebar">
                        <loading-svg :isLoading="loadingForm"></loading-svg>
                        <div class="content" v-if="itemDataDetail">
                            <header class="clearfix">
                                <h4>Manage Stock</h4>
                                <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                            </header>
                            <section>
                                <el-form :model="forms" status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm nolineHeight">
                                    <div class="item-forms-details" v-if="itemDataDetail">
                                        <div class="forms-details">
                                            <el-row :gutter="20">
                                                <el-col :span="24">
                                                    <el-form-item label="Action">
                                                        <el-radio-group v-model="forms.actions">
                                                            <el-radio label="increase">Tambah</el-radio>
                                                            <el-radio label="decrease">Kurang</el-radio>
                                                        </el-radio-group>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="24">
                                                    <el-form-item label="Qty">
                                                        <el-input-number v-model="forms.qty" :min="0"></el-input-number>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </div>
                                </el-form>
                            </section>
                        </div>
                        <div class="actions-button clearfix">
                            <el-button class="button-outline-black" id="cancel" @click="closeModal()">Tutup</el-button>
                            <el-button class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import XLSX from 'xlsx'
import FUNCTIONS from '@/functions'
import pageHeader from '@/components/partials/pageHeader.vue'
import loadingSvg from '@/components/partials/loadingSvg.vue'

export default {
    name: 'offline-hub-manage-stock',
    components: { pageHeader, loadingSvg },
    data(){
        return{
            nameHub:this.$route.params.name, 
            idData: this.$route.params.id,
            sectionApi: 'offlinehub?servicePathUrl=stock/hub',
            sectionApiType: 'offlinehub?servicePathUrl=type',
            sectionApiInput: 'offlinehub?servicePathUrl=stock/input',
            loading: false,
            loadingForm: false,
            loadingExcel: false,
            testingData: [],
            itemsData: [],
            itemDataDetail: [],
            itemsDataType: [],
            searchQuery: '',
            typeSearch: '',
            totalPage: '',
            perPage: 10,
            currentPage: 1,
            dataTextCreate: 'Buat Stock Barang',
            dataTextUpdate: 'Edit Stock Barang',
            confirmDescDelete: 'Anda yakin akan menghapus data Lokasi Hubs dari daftar?',
            confirmTitleDelete: 'Hapus Hubs',
            textDataCreateSuccess: 'Data Stock Barang Berhasil ditambahkan.',
            textDataCreateMinusSuccess: 'Data Stock Barang Berhasil dikurangkan.',
            textDataUpdateSuccess: 'Data Stock Barang Berhasil diupdate.',
            textDataDeleteSuccess: '1 Items Berhasil dihapus.',
            textMemuatData: 'Masih memuat data',
            textErrorNetwork: 'Jaringan Bermasalah',
            messageerror: '',
            messagesuccess: '',
            forms: {
                actions: 'increase',
                qty: 0,
            }
        }
    },
    created(){
        FUNCTIONS.checkPermissions(this.$dataRole['service.offlinehub.get.stock.hub'])
    },
    watch: {
        typeSearch(newValue, oldValue) {
            this.getPost()    
        },
    },
    mounted(){
        this.getPost()
        this.getPostType()
    },
    methods:{
        getPost(){
            this.loading = true
            let url = this.urlService + this.sectionApi + '&hubId=' + this.idData + '&typeId=' + this.typeSearch
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsData = response.data.data.rows
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: response.data.message
                    });
                }
            })
            .catch(error => {
                this.$notify.error({
                    title: this.textErrorNetwork,
                    message: 'Gagal mendapatkan data Hubs'
                });
            })
            .finally(() => {
                this.loading = false
            })
        },
        getPostType(){
            let url = this.urlService + this.sectionApiType + '&limit=100&page=1&direction=DESC&orderBy=createdAt'
            this.postFunction('get_type', '', url)
        },
        getExcel(){
            if(this.itemsData.length !== 0){
                this.loadingExcel = true
                let databeforeExcel = []
                let exportToExcel = []
                let that = this
                let url = this.urlService + this.sectionApi + '&hubId=' + this.idData + '&typeId=' + this.typeSearch
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        databeforeExcel = response.data.data.rows
                        this.loadingExcel = false
                        databeforeExcel.forEach(function(currentValue, i, arr){
                            let typeProduct = (currentValue.type) ? currentValue.type.title : '-'
                            exportToExcel.push(
                                {
                                    'No' : (i + 1).toString(),
                                    'Name Produk' : currentValue.name,
                                    'Stok Barang' : currentValue.stock,
                                    // 'Tipe Produk' : typeProduct,
                                    'Hub' : that.nameHub
                                }
                            )
                        })

                        let filename = "stock-hub-" + ((this.nameHub).replace(/ /g,"-")).toLowerCase()

                        var wscols = [
                            {wch:5},
                            {wch:25},
                            {wch:10},
                            // {wch:20},
                            {wch:25},
                        ]

                        var datas = XLSX.utils.json_to_sheet(exportToExcel)
                        datas['!cols'] = wscols;
                        var wb = XLSX.utils.book_new()
                        XLSX.utils.book_append_sheet(wb, datas, 'Laporan Stok Barang')
                        XLSX.writeFile(wb, filename+'.xlsx')
                    }else{
                        this.$notify.error({
                            title: 'Error',
                            message: response.data.message
                        });
                    }
                })
                .catch(error => {
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal mendapatkan data'
                    });
                })
                .finally(() => {
                    this.loadingExcel = false
                })
            }else{
                this.$notify.error({
                    title: 'Maaf',
                    message: 'Data Kosong'
                });
            }
        },
        initClickCreateFunction(value){
            if(value == 'show'){
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
            }else{
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
            }
        },
        handleCurrentChange(val){
            if(this.$dataRole['service.offlinehub.post.stock.input']){
                if(val){
                    this.itemDataDetail = val
                    this.initClickCreateFunction('show')
                }
            }else{
                FUNCTIONS.notify('error', 'Error', 'Anda tidak punya akses')
            }
        },
        closeModal(){
            this.initClickCreateFunction('hide')
            this.$refs.singleTables.setCurrentRow('');
            this.forms.actions = 'increase'
            this.forms.qty = 0
        },
        postFunction(type, credentials, url){
            if(type == 'post'){
                // this.loadingForm = true
                this.axios.post(url, credentials)
                .then(response => {
                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                    if(response.data.status == 'error'){
                        this.messageerror = response.data.message
                        this.$notify.error({
                            title: 'Error',
                            message: response.data.message
                        });
                    }else{
                        if(this.forms.actions == 'increase'){
                            this.messagesuccess = this.textDataCreateSuccess
                        }else{
                            this.messagesuccess = this.textDataCreateMinusSuccess
                        }
                        this.getPost()
                        this.closeModal();
                    }
                })
                .catch(error => { 
                    console.log(error)
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal meyimpan data'
                    });
                })
            }else if(type == 'get_type'){
                this.loading = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemsDataType = response.data.data.rows
                    }else{
                        this.$notify.error({
                            title: 'Error',
                            message: response.data.message
                        });
                    }
                })
                .catch(error => {
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal mendapatkan data Hubs'
                    });
                })
                .finally(() => {
                    this.loading = false
                })
            }
        },
        submitSave(formName, formtype){
            this.messagesuccess = ''
            let loadingform = FUNCTIONS.svgSpinner;
            this.$refs[formName].validate((valid) => {
                if(valid){
                    document.getElementById('save').children[0].innerHTML = loadingform
                    let url = this.urlService + this.sectionApiInput
                    const formData = new FormData()
                    formData.append('action', this.forms.actions)
                    formData.append('hubId', this.idData)
                    formData.append('itemId', this.itemDataDetail.id)
                    formData.append('qty', this.forms.qty)
                    this.postFunction('post', formData, url)
                }else{
                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    }
}
</script>

<style lang="scss" scoped>
.product-images{
    max-height: 85px;
    display: block;
    margin: 0 auto;
}
</style>
