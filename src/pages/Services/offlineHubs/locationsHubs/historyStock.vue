<template>
    <div class="content-wrapper">
        <div id="manage-stock-hub">
            <div class="page-header" style="margin-top: 15px;">
                <div class="page-header-content">
                    <router-link v-bind:to="'/offline-hub/locations'" class="back-button">
                        <i class="icon icon-caret-left"></i> Lokasi Hubs
                    </router-link>
                    <div class="page-title clearfix">
                        <h4 class="float-left">History Stock Hub {{nameHub}}</h4>
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
                        <div class="input-with-icons clearfix">
                            <el-input v-model="searchQuery" class="float-left"></el-input>
                            <img src='~assets/images/icons/search1.png'>
                        </div>
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
                        v-loading="loading"
                        class="mobayar-table">
                        <el-table-column type="index" label="No" width="50"></el-table-column>
                        <el-table-column label="Items Name" width="130">
                            <template slot-scope="scope">
                                <div v-if="scope.row.item">
                                    {{scope.row.item.name}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="Images" align="center" width="200">
                            <template slot-scope="scope">
                                <div v-if="scope.row.item">
                                    <img v-if="(scope.row.item.images).length !== 0" class="img-auto product-images" :src="scope.row.item.images[0].url + scope.row.item.images[0].image">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="note" label="Note"></el-table-column>
                        <el-table-column label="Created At">
                            <template slot-scope="scope">
                                {{scope.row.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="qty" label="Qty" align="center"></el-table-column>
                    </el-table>

                    <div class="mobayar-actions-bottom clearfix">
                        <div class="showing-page float-left">
                            <span>View</span>
                            <ul>
                                <li class="active"><a href="#" @click.prevent="limitChange('10', $event)">10</a></li>
                                <li><a href="#" @click.prevent="limitChange('25', $event)">25</a></li>
                                <li><a href="#" @click.prevent="limitChange('50', $event)">50</a></li>
                                <li><a href="#" @click.prevent="limitChange('100', $event)">100</a></li>
                            </ul>
                        </div>
                        <div class="pagination-result float-right">
                            <span>Showing results 1 - {{itemsData.length}} of {{parseInt(totalPage)}}</span>
                            <el-pagination
                                layout="prev, pager, next"
                                :total="parseInt(totalPage)"
                                @current-change="pageChange"
                                :page-size="parseInt(perPage)">
                            </el-pagination>
                        </div>
                    </div>

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
            sectionApi: 'offlinehub?servicePathUrl=stock/input/history',
            sectionApiInput: 'offlinehub?servicePathUrl=stock/input',
            loading: false,
            loadingForm: false,
            loadingExcel: false,
            itemsData: [],
            itemDataDetail: [],
            searchQuery: '',
            totalPage: '',
            perPage: 10,
            currentPage: 1,
            dataTextCreate: 'Buat Stock Barang',
            dataTextUpdate: 'Edit Stock Barang',
            confirmDescDelete: 'Anda yakin akan menghapus data Lokasi Hubs dari daftar?',
            confirmTitleDelete: 'Hapus Hubs',
            textDataCreateSuccess: 'Data Stock Barang Berhasil ditambahkan.',
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
        FUNCTIONS.checkPermissions(this.$dataRole['service.offlinehub.get.stock.input.history'])
    },
    mounted(){
        this.getPost()
    },
    watch:{
        searchQuery: function(newValue){
            let that = this
            setTimeout(function(){
                that.getPost(newValue)
            }, 800)
            document.querySelector('.el-pagination').children[1].children[0].click()
        }
    },
    methods:{
        getPost(){
            this.loading = true
            let url = this.urlService + this.sectionApi + '&hubId=' + this.idData + '&limit=' + this.perPage + '&page=' + this.currentPage + '&keyword=' + this.searchQuery + '&direction=DESC' + '&orderBy=createdAt'
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsData = response.data.data.rows
                    this.totalPage = response.data.data.total
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
        getExcel(){
            if(this.itemsData.length !== 0){
                this.loadingExcel = true
                let databeforeExcel = []
                let exportToExcel = []
                let that = this
                let url = this.urlService + this.sectionApi + '&hubId=' + this.idData + '&limit=' + this.totalPage + '&page=1&keyword=' + this.searchQuery + '&direction=DESC' + '&orderBy=createdAt'
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        databeforeExcel = response.data.data.rows
                        this.loadingExcel = false
                        
                        databeforeExcel.forEach(function(currentValue, i, arr){
                            let dateCreatedAt = new Date(currentValue.created_at)
                            let fulldateCreatedAt = dateCreatedAt.getFullYear() + '-' + (dateCreatedAt.getMonth() + 1) + '-' + dateCreatedAt.getDate() + ' ' + dateCreatedAt.getHours() + ':' + dateCreatedAt.getMinutes() + ':' + dateCreatedAt.getSeconds()
                            let productName = (currentValue.item) ? currentValue.item.name : '-'
                            exportToExcel.push(
                                {
                                    'No' : (i + 1).toString(),
                                    'Name Produk' : productName,
                                    'Hub' : that.nameHub,
                                    'Note' : currentValue.note,
                                    'Qty' : currentValue.qty,
                                    'Created At' : fulldateCreatedAt
                                }
                            )
                        })

                        let filename = "history-stock-hub-" + ((this.nameHub).replace(/ /g,"-")).toLowerCase()

                        var wscols = [
                            {wch:5},
                            {wch:25},
                            {wch:25},
                            {wch:40},
                            {wch:10},
                            {wch:20},
                        ]

                        var datas = XLSX.utils.json_to_sheet(exportToExcel)
                        datas['!cols'] = wscols;
                        var wb = XLSX.utils.book_new()
                        XLSX.utils.book_append_sheet(wb, datas, 'Laporan History Stok Barang')
                        XLSX.writeFile(wb, filename+'.xlsx')
                    }else{
                        this.$notify.error({
                            title: 'Error',
                            message: response.data.message
                        });
                    }
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
            if(val){
                this.itemDataDetail = val
                this.initClickCreateFunction('show')
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
                        this.messagesuccess = this.textDataCreateSuccess
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
            }
        },
        submitSave(formName, formtype){
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
        pageChange (page) {
            this.currentPage = page
            this.getPost()
        },
        limitChange(limit){
            this.perPage = limit
            document.querySelector('.el-pagination').children[1].children[0].click()
            this.getPost()
            document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
            event.target.parentNode.classList.add('active')
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
