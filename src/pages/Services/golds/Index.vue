<template>
    <div class="content-wrapper">
        <div id="gold-transactions">
            <div class="page-header clearfix">
                <div class="float-left">
                    <page-header titleName="Report Transaksi Emas" :isCreate="false"></page-header>
                </div>
                <div class="add-actions" style="margin-top: 10px;">
                    <a @click.prevent="getExcel" class="float-right">
                        <el-button class="button-outline-green" round>
                            <img src="~assets/images/icons/download-new.png" v-if="(loadingExcel == false)">
                            <div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export
                        </el-button>
                    </a>
                </div>
            </div>
            <div class="content">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img src='~assets/images/icons/search1.png'>
                    </div>
                    <el-date-picker
                        class="date-range-picker"
                        v-model="dateRange"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                        :format="format"
                        :value-format="format"></el-date-picker>
                    <div class="another-metode" style="margin-left: 0;">
                        <div>
                            <span>Type</span>
                            <el-select v-model="typeFilter" :popper-append-to-body="false">
                                <el-option value="buy" label="Buy">Buy</el-option>
                                <el-option value="sell" label="Sell">Sell</el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <el-alert 
                    v-if="messagesuccess" 
                    title="" 
                    type="success" 
                    :description="messagesuccess" 
                    show-icon></el-alert>
                <div class="filterstatus">
                    <el-tabs v-model="filterQuery">
                        <el-tab-pane label="Success" name="success"></el-tab-pane>
                        <el-tab-pane label="Pending" name="pending"></el-tab-pane>
                        <el-tab-pane label="Failed" name="failed"></el-tab-pane>
                    </el-tabs>
                </div>
                <el-table 
                    :data="itemsData" 
                    max-height="530" 
                    empty-text="No data available in table"
                    ref="singleTable"
                    v-loading="loading"
                    @current-change="handleCurrentChange"
                    class="mobayar-table">
                    <el-table-column prop="trxId" label="Transaction ID" width="200"></el-table-column>
                    <el-table-column prop="supplier" label="Supplier" width="100"></el-table-column>
                    <el-table-column label="Customer">
                        <template slot-scope="scope">
                            <div v-if="scope.row.customer">
                                {{scope.row.customer.name}} <br>
                                {{scope.row.customer_phone}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Gram" width="100" align="center">
                        <template slot-scope="scope">
                            {{scope.row.gram}} gr
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="Type" width="100"></el-table-column>
                    <el-table-column label="Total Price">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.total_price)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Created At">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
                        </template>
                    </el-table-column>
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
                            <h4>{{titleForms}}</h4>
                            <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                        </header>
                        <section>
                            <el-form :model="forms" status-icon :rules="rules" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                <div class="item-forms-details">
                                    <h5>Info Emas</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Transaction ID">
                                                    <div style="line-height: normal;">
                                                        {{itemDataDetail.trxId}}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Supplier">
                                                    <div style="line-height: normal;">
                                                        {{itemDataDetail.supplier}}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Nomor Kontrak">
                                                    <div style="line-height: normal;">
                                                        {{itemDataDetail.contract_number}}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Gram">
                                                    <div style="line-height: normal;">
                                                        {{itemDataDetail.gram}} gr
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Status">
                                                    <div style="line-height: normal;">
                                                        <span class="inline badge success" v-if="itemDataDetail.status == 'success'">{{itemDataDetail.status}}</span>
                                                        <span class="inline badge pending" v-else-if="itemDataDetail.status == 'pending'">{{itemDataDetail.status}}</span>
                                                        <span class="inline badge failed" v-if="itemDataDetail.status == 'failed'">{{itemDataDetail.status}}</span>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Created At">
                                                    <div style="line-height: normal;">
                                                        {{itemDataDetail.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                                <div class="item-forms-details">
                                    <h5>Info Harga Emas</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Base Price">
                                                    <div style="line-height: normal;">
                                                       Rp. {{formatPrice(itemDataDetail.base_price)}}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Price">
                                                    <div style="line-height: normal;">
                                                        Rp. {{formatPrice(itemDataDetail.price)}}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Total Price">
                                                    <div style="line-height: normal;">
                                                        Rp. {{formatPrice(itemDataDetail.total_price)}}
                                                    </div>
                                                </el-form-item>
                                            </el-col>                                            
                                        </el-row>
                                    </div>
                                </div>
                                <div class="item-forms-details" v-if="itemDataDetail.customer">
                                    <h5>Info Customer</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Name">
                                                    <div style="line-height: normal;">
                                                        {{itemDataDetail.customer.name}}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Phone Number">
                                                    <div style="line-height: normal;">
                                                        {{itemDataDetail.customer.phone}}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Email">
                                                    <div style="line-height: normal;" v-if="itemDataDetail.customer.email !== null">
                                                        {{itemDataDetail.customer.email}}
                                                    </div>
                                                    <div style="line-height: normal;" v-else>-</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Pekerjaan">
                                                    <div style="line-height: normal;" v-if="itemDataDetail.customer.job !== null">
                                                        {{itemDataDetail.customer.job}}
                                                    </div>
                                                    <div style="line-height: normal;" v-else>-</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Kode Pos">
                                                    <div style="line-height: normal;" v-if="itemDataDetail.customer.postal_code !== null && itemDataDetail.customer.postal_code !== ''">
                                                        {{itemDataDetail.customer.postal_code}}
                                                    </div>
                                                    <div style="line-height: normal;" v-else>-</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Sync">
                                                    <div style="line-height: normal;" v-if="itemDataDetail.customer.sync !== null && itemDataDetail.customer.sync !== ''">
                                                        <span class="inline badge success" v-if="itemDataDetail.customer.sync == true">{{itemDataDetail.customer.sync}}</span>
                                                        <span class="inline badge failed" v-else>{{itemDataDetail.customer.sync}}</span>
                                                    </div>
                                                    <div style="line-height: normal;" v-else>-</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Alamat">
                                                    <div style="line-height: normal;" v-if="itemDataDetail.customer.address !== null">
                                                        {{itemDataDetail.customer.address}}
                                                    </div>
                                                    <div style="line-height: normal;" v-else>-</div>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                                <div class="item-forms-details" v-if="$getRoles == 1">
                                    <h5>Info Inquiry</h5>
                                    <div class="forms-details">
                                        <pre>{{itemDataDetail.inquiry}}</pre>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import XLSX from 'xlsx'
import FUNCTIONS from '@/functions'
import pageHeader from '@/components/partials/pageHeader.vue'
import loadingSvg from '@/components/partials/loadingSvg.vue'
import readMore from '@/components/partials/readmore.vue'
import { faEdit, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

let date = new Date();
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

export default {
    name: 'goldTransactions',
    data(){
        return{
            sectionApi: 'gold?servicePathUrl=cms/transactions',
            loading: false,
            loadingForm: false,
            loadingExcel: false,
            itemsData: [],
            itemDataDetail: [],
            itemsDataProvider: [],
            searchQuery: '',
            totalPage: '',
            perPage: 10,
            currentPage: 1,
            titleForms: '',
            formsType: '',
            dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
            format: 'yyyy-MM-dd',
            filterQuery: 'success',
            typeFilter: 'buy',
            messagesuccess: '',
            messageerror: '',
            dataTextCreate: 'Buat Operator Baru',
            dataTextUpdate: 'Detail Transaksi Emas',
            confirmDescDelete: 'Anda yakin akan menghapus data Operator dari daftar?',
            confirmTitleDelete: 'Hapus Operator',
            textDataCreateSuccess: 'Data Operator Berhasil ditambahkan.',
            textDataUpdateSuccess: 'Data Operator Berhasil diupdate.',
            textDataDeleteSuccess: '1 Items Berhasil dihapus.',
            textMemuatData: 'Masih memuat data',
            textErrorNetwork: 'Jaringan Bermasalah',
            forms:{
                name: '',
                sender_slug: '',
            },
            rules:{
                name: [ { required: true, message: 'Inputan Harus diisi', trigger: 'blur' } ],
                sender_slug: [ { required: true, message: 'Inputan Harus diisi', trigger: 'blur' } ],
            },
            fontsIcons:{
                edit: faEdit,
                detail: faInfoCircle,
            }
        }
    },
    created(){
        FUNCTIONS.checkPermissions(this.$dataRole['service.gold.get.cms.transactions'])
    },
    watch:{
        searchQuery: function(newValue){
            this.getResult(newValue)
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
        dateRange: function(newValue, oldValue){
            if(newValue !== null){
                this.getPost(this.searchQuery)
                document.querySelector('.el-pagination').children[1].children[0].click()
            }else{
                this.dateRange = oldValue
            }
        },
        filterQuery: function(newValue){
            this.getPost(this.searchQuery)
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
        typeFilter: function(newValue){
            this.getPost(this.searchQuery)
            document.querySelector('.el-pagination').children[1].children[0].click()
        }
    },
    mounted(){
        this.getPost(this.searchQuery)
    },
    methods:{
        getPost(search){
            this.loading = true
            let url = this.urlService + this.sectionApi + '&limit=' + this.perPage + '&page=' + this.currentPage + '&keyword=' + search + '&direction=DESC' + '&orderBy=createdAt' + '&date_start=' + this.dateRange[0] + '&date_end=' + this.dateRange[1] + '&status=' + this.filterQuery + '&type=' + this.typeFilter
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
                    message: 'Gagal mendapatkan data'
                });
            })
            .finally(() => {
                this.loading = false
            })
        },
        getResult: _.debounce(function(search){ 
            this.getPost(search)
        }, 500),
        getExcel(){
            if(this.dateRange !== null){
                if(this.itemsData.length != 0){
                    let databeforeExcel = [];
                    let exportToExcel = [];
                    let url = this.urlService + this.sectionApi + '&limit=' + this.totalPage + '&page=1&keyword=' + this.searchQuery + '&direction=DESC' + '&orderBy=createdAt' + '&date_start=' + this.dateRange[0] + '&date_end=' + this.dateRange[1] + '&status=' + this.filterQuery + '&type=' + this.typeFilter

                    this.loadingExcel = true
                    this.axios.get(url)
                    .then(response => { 
                        if(response.data.status == 'success'){
                            databeforeExcel = response.data.data.rows

                            this.loadingExcel = false

                            databeforeExcel.forEach(function(currentValue, i, arr){
                                let dateCreatedAt = new Date(currentValue.created_at)
                                let fulldateCreateAt = dateCreatedAt.getFullYear() + '-' + (dateCreatedAt.getMonth() + 1) + '-' + dateCreatedAt.getDate() + ' ' + dateCreatedAt.getHours() + ':' + dateCreatedAt.getMinutes() + ':' + dateCreatedAt.getSeconds()
                                let customerName = (currentValue.customer) ? currentValue.customer.name : '-'
                                let customerPhone = (currentValue.customer) ? currentValue.customer.phone : '-'
                                exportToExcel.push(
                                    {
                                        'Transaction ID' : currentValue.trxId,
                                        'Supplier' : currentValue.supplier,
                                        'Customer Name' : customerName,
                                        'Customer Phone' : customerPhone,
                                        'Status' : currentValue.status,
                                        'Contract Number': currentValue.contract_number,
                                        'Gram' : currentValue.gram,
                                        'Type' : currentValue.type,
                                        'Total Price' : parseInt(currentValue.total_price),
                                        'Created At' : fulldateCreateAt
                                    }
                                )
                            })

                            let filename = "laporan-transaction-gold-" + this.dateRange[0] + "-to-" + this.dateRange[1]

                            var wscols = [
                                {wch:30},
                                {wch:20},
                                {wch:25},
                                {wch:20},
                                {wch:15},
                                {wch:20},
                                {wch:10},
                                {wch:10},
                                {wch:20},
                                {wch:20},
                            ];

                            var datas = XLSX.utils.json_to_sheet(exportToExcel)
                            datas['!cols'] = wscols;
                            var wb = XLSX.utils.book_new()
                            XLSX.utils.book_append_sheet(wb, datas, 'Laporan Transaksi Gold')
                            XLSX.writeFile(wb, filename+'.xlsx')
                        }else{
                            this.loadingExcel = false
                            this.$notify.error({
                                title: 'Error',
                                message: response.data.message
                            });
                        }
                    })
                    .catch(error => { 
                        this.$notify.error({
                            title: 'Error',
                            message: error.response.data.message
                        });
                    })                    
                }else{
                    this.$notify.error({
                        title: 'Maaf',
                        message: 'Data Kosong'
                    });

                }
            }else{
                this.$notify.error({
                    title: 'Maaf',
                    message: 'Tanggal Tidak Boleh Kosong'
                });
            }
        },
        submitSave(formName, formtype){
            let loadingform = FUNCTIONS.svgSpinner;
            this.messagesuccess = ''
            this.messageerror = ''
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    this.itemsData = []
                    if(formtype == 'save'){
                        document.getElementById('save').children[0].innerHTML = loadingform
                        let urlv = this.urlService + this.sectionApi
                        this.postFunction('post', this.forms, urlv)
                    }else{
                        document.getElementById('save-edit').children[0].innerHTML = loadingform
                        let urlv = this.urlService + this.sectionApi + '/' + this.itemDataDetail.id
                        this.postFunction('put', this.forms, urlv)
                    }
                }
            })
        },
        deletePost(id){
            this.$confirm(this.confirmDescDelete, this.confirmTitleDelete, {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.itemsData = []
                let url = this.urlService + this.sectionApi + '/' + id
                this.postFunction('delete', '', url)
                this.initClickCreateFunction('hide')
            })
        },
        handleCurrentChange(val){
            if(val){
                this.titleForms = this.dataTextUpdate
                this.formsType = 'edit'

                this.itemDataDetail = val
                this.initClickCreateFunction('show')
            }
        },
        pageChange (page) {
            this.currentPage = page
            this.getPost(this.searchQuery)
        },
        limitChange(limit){
            this.perPage = limit
            document.querySelector('.el-pagination').children[1].children[0].click()
            this.getPost(this.searchQuery)
            document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
            event.target.parentNode.classList.add('active')
        },
        initCreateFunction(){
            let that = this
            setTimeout(function(){
                document.querySelector('.add-click-forms').addEventListener('click', function(){ 
                    if(that.loading == false){
                        that.titleForms = that.dataTextCreate
                        that.formsType = 'create'
                        that.initClickCreateFunction('show')
                    }else{
                        that.$notify({
                            type: 'warning',
                            title: 'Maaf',
                            message: that.textMemuatData
                        });
                    } 
                })
            }, 500)
        },
        closeModal(row){
            this.initClickCreateFunction('hide')
            this.$refs.singleTable.setCurrentRow(row);
            this.$refs.formsvalid.resetFields();
            this.forms.name = ''
            this.forms.sender_slug = ''
            this.itemDataDetail = []
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
        postFunction(type, credentials, url){
            if(type == 'post'){
                this.axios.post(url, credentials)
                .then(response => {
                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                    if(response.data.status == 'error'){
                        this.messageerror = response.data.message
                    }else{
                        this.messagesuccess = this.textDataCreateSuccess
                        this.getPost('')
                        this.closeModal();
                    }
                })
                .catch(error => { 
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal menyimpan data'
                    });
                })
            }else if(type == 'put'){
                this.axios.put(url, credentials)
                .then(response => {
                    document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                    if(response.data.status == 'error'){
                        this.messageerror = response.data.message
                    }else{
                        this.messagesuccess = this.textDataUpdateSuccess
                        this.getPost('')
                        this.closeModal();
                    }
                })
                .catch(error => { 
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal mengedit data'
                    });
                })
            }else if(type == 'getbyid'){
                this.loadingForm = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemDataDetail = response.data.data
                        this.forms = this.itemDataDetail
                    }
                })
                .catch(error => {
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal mendapatkan data detail'
                    });
                })
                .finally(() => {
                    this.loadingForm = false
                })
            }else if(type == 'delete'){
                this.axios.delete(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.messagesuccess = this.textDataDeleteSuccess
                        this.getPost('')
                        this.closeModal();
                    }
                })
                .catch(error => {
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal menghapus data'
                    });
                })
                .finally(() => {
                    this.closeModal();
                })
            }
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
    },
    components: { pageHeader, loadingSvg, readMore }
}
</script>