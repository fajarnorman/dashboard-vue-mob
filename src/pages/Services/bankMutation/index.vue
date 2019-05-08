<template>
    <div class="content-wrapper">
        <div id="bank-mutation">
            <div class="page-header clearfix">
                <div class="float-left">
                    <page-header titleName="Report Mutasi Bank" :isCreate="false"></page-header>
                </div>
                <div class="add-actions" style="margin-top: 10px;">
                    <a @click.prevent="getExcel" class="float-right">
                        <el-button class="button-outline-green" round>
                            <img src="~assets/images/icons/download-new.png" v-if="(loadingExcel == false)">
                            <div v-else v-html="loadingHTML" class="inline"></div> Export
                        </el-button>
                    </a>
                </div>
            </div>
            <div class="content">
                <div class="grand-total" v-if="$dataRole['topup.auto.approve']">
                    <span>Auto Approve</span>
                    <div class="switch-custom">
                        <el-switch
                            v-model="switchOnOff"
                            @change="setAvailable">
                        </el-switch>
                        <span class="inline-auto-approve" v-if="switchOnOff">Status On</span>
                        <span class="inline-auto-approve" v-else>Status Off</span>
                    </div>
                </div>
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
                    <el-select v-model="paymentBank" placeholder="Pilih Bank" :popper-append-to-body="false">
                        <el-option value="" label="Semua Bank">Semua Bank</el-option>
                        <el-option value="bni" label="BNI">BNI</el-option>
                        <el-option value="bca" label="BCA">BCA</el-option>
                        <el-option value="bri" label="BRI">BRI</el-option>
                        <el-option value="permata" label="Permata">Permata</el-option>
                        <el-option value="mandiri" label="Mandiri">Mandiri</el-option>
                    </el-select>
                </div>
                <el-table 
                    :data="itemsData" 
                    max-height="530" 
                    empty-text="No data available in table"
                    ref="singleTable"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column prop="transaction_name" label="Transaction Name" width="170"></el-table-column>
                    <el-table-column label="Amount" width="150">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.transaction_amount)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="transaction_type" label="Type" width="80"></el-table-column>
                    <el-table-column prop="branch_code" label="Branch Code" width="100"></el-table-column>
                    <el-table-column prop="bank" label="Bank" width="80"></el-table-column>
                    <el-table-column prop="slug" label="Slug" width="280"></el-table-column>
                    <el-table-column prop="trailer" label="Trailer" width="200"></el-table-column>
                    <el-table-column prop="value" label="Created At" width="180">
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
            </div>
        </div>
    </div>
</template>

<script>
import XLSX from 'xlsx'
import FUNCTIONS from '@/functions'
import services from '@/service'
import pageHeader from '@/components/partials/pageHeader.vue'

let date = new Date()
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

export default {
    name: 'bank-mutation',
    components: { pageHeader },
    data(){
        return{
            apiURL: process.env.ROOT_API,
            sectionApi: 'banking?servicePathUrl=cms/report',
            sectionApiAutoTopup: 'autoApproveTopup',
            loading: false,
            loadingExcel: false,
            loadingHTML: FUNCTIONS.svgSpinner,
            itemsData: [],
            itemDataDetail: [],
            dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
            format: 'yyyy-MM-dd',
            searchQuery: '',
            paymentBank: '',
            totalPage: '',
            perPage: 10,
            currentPage: 1,
            textErrorNetwork: 'Jaringan Bermasalah',
            switchOnOff: false,
        }
    },
    created(){
        FUNCTIONS.checkPermissions(this.$dataRole['service.banking.get.cms.report'])
    },
    watch:{
        searchQuery: function(){
            this.getResult()
            FUNCTIONS.checkPaginations()
        },
        dateRange: function(newValue){
            this.getPost(this.searchQuery)
            FUNCTIONS.checkPaginations()
        },
        paymentBank: function(){
            this.getPost(this.searchQuery)
            FUNCTIONS.checkPaginations()
        }
    },
    mounted(){
        this.getPost(this.searchQuery)
        this.getAvailable()
    },
    methods:{
        buildUrl(value){
            if(value == true){
                return this.urlService + this.sectionApi + '&limit=' + this.totalPage + '&page=1' + '&keyword=' + this.searchQuery + '&direction=DESC' + '&date_start=' + (this.dateRange[0] + ' ' + '00:00:00') + '&date_end=' + (this.dateRange[1] + ' ' + '23:59:59') + '&bank=' + this.paymentBank
            }else{
                return this.urlService + this.sectionApi + '&limit=' + this.perPage + '&page=' + this.currentPage + '&keyword=' + this.searchQuery + '&direction=DESC' + '&date_start=' + (this.dateRange[0] + ' ' + '00:00:00') + '&date_end=' + (this.dateRange[1] + ' ' + '23:59:59') + '&bank=' + this.paymentBank 
            }
        },
        async getPost(){
            let url = this.buildUrl(false)
            try{
                this.loading = true
                const response = await services.getList(url)
                if(response.data.status == 'success'){
                    this.loading = false
                    this.itemsData = response.data.data.rows
                    this.totalPage = response.data.data.total
                }else{
                    FUNCTIONS.notify('error', 'Error', response.data.message)
                }
            }catch(err){
                FUNCTIONS.notify('error', this.textErrorNetwork, 'Gagal mendapatkan data')
            }
        },
        async getAvailable(){
            if(this.$dataRole['topup.auto.approve']){
                let url = this.apiURL + this.sectionApiAutoTopup
                try{
                    const response = await services.getList(url)
                    let dataResponse = response.data.data
                    if(response.data.status == 'success'){
                        let checkDataAutoApprove = (dataResponse.autoApprove == false) ? this.switchOnOff = false : this.switchOnOff = true
                    }else{
                        FUNCTIONS.notify('error', 'Error', response.data.message)
                    }
                }catch(err){
                    FUNCTIONS.notify('error', this.textErrorNetwork, 'Gagal mendapatkan data')
                }
            }
        },
        async setPostAvailable(value){
            let url = this.apiURL + this.sectionApiAutoTopup
            try{
                const response = await services.postList(url, { status: value })
                if(response.data.status == "success"){
                    FUNCTIONS.notify('success', 'Sukses', 'Auto approve topup bank berhasil di rubah')
                    this.getPost(this.searchQuery)
                    this.getAvailable()
                }else{
                    FUNCTIONS.notify('error', 'Error', response.data.message)
                }
            }catch(err){
                FUNCTIONS.notify('error', this.textErrorNetwork, "Gagal menyimpan data")
            }
        },
        setAvailable(){
            let statusApprove = ''
            let checkStatusApprove = (this.switchOnOff == true) ? statusApprove = 'on' : statusApprove = 'off'
            this.$confirm('Apakah anda yakin?', 'Auto Approve', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.setPostAvailable(statusApprove)
            }).catch(() => {
                this.getAvailable()
            })
        },
        getExcel(){
            if(this.itemsData.length != 0){
                let databeforeExcel = [];
                let exportToExcel = [];
                let url = this.buildUrl(true)
                this.loadingExcel = true
                this.axios.get(url)
                .then(response => { 
                    if(response.data.status == 'success'){
                        databeforeExcel = response.data.data.rows
                        this.loadingExcel = false
                        databeforeExcel.forEach(function(currentValue, i, arr){
                            let dateCreatedAt = new Date(currentValue.created_at)
                            let dateUpdatedAt = new Date(currentValue.updated_at)
                            let transactionDate = (currentValue.transaction_date !== null) ? currentValue.transaction_date : '-'
                            let fulldateCreateAt = dateCreatedAt.getFullYear() + '-' + (dateCreatedAt.getMonth() + 1) + '-' + dateCreatedAt.getDate() + ' ' + dateCreatedAt.getHours() + ':' + dateCreatedAt.getMinutes() + ':' + dateCreatedAt.getSeconds()
                            let fulldataUpdateAt = dateUpdatedAt.getFullYear() + '-' + (dateUpdatedAt.getMonth() + 1) + '-' + dateUpdatedAt.getDate() + ' ' + dateUpdatedAt.getHours() + ':' + dateCreatedAt.getMinutes() + ':' + dateUpdatedAt.getSeconds()
                            exportToExcel.push(
                                {
                                    'Transaction Name' : currentValue.transaction_name,
                                    'Transaction Amount' : currentValue.transaction_amount,
                                    'Transaction Type' : currentValue.transaction_type,
                                    'Transaction Date' : transactionDate,
                                    'Branch Code' : currentValue.branch_code,
                                    'Bank' : currentValue.bank,
                                    'Slug' : currentValue.slug,
                                    'Trailer' : currentValue.trailer,
                                    'Created At' : fulldateCreateAt,
                                    'Updated At' : fulldataUpdateAt,
                                }
                            )
                        })
                        let filename = "laporan-mutasi-bank"
                        var wscols = [
                            {wch:30},
                            {wch:25},
                            {wch:15},
                            {wch:20},
                            {wch:20},
                            {wch:10},
                            {wch:60},
                            {wch:60},
                            {wch:20},
                            {wch:20},
                        ];
                        var datas = XLSX.utils.json_to_sheet(exportToExcel)
                        datas['!cols'] = wscols;
                        var wb = XLSX.utils.book_new()
                        XLSX.utils.book_append_sheet(wb, datas, 'Laporan Mutasi Bank')
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
        },
        getResult: _.debounce(function(){ 
            this.getPost()
        }, 500),
        pageChange (page) {
            this.currentPage = page
            this.getPost()
        },
        limitChange(limit){
            this.perPage = limit
            FUNCTIONS.checkPaginations()
            this.getPost()
            FUNCTIONS.viewActive()
        },
        formatPrice(value) {
            return FUNCTIONS.formatPrice(value)
        }
    },
}
</script>
<style lang="scss" scoped>
.inline-auto-approve{
    display: inline-block;
    vertical-align: middle;
}
</style>
