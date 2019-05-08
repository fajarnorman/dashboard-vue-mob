<template>
    <div class="content-wrapper">
        <div id="master-barang-attribute">
            <div class="page-header clearfix">
                <div class="float-left">
                    <page-header titleName="Transaksi Offline Hub" :isCreate="false"></page-header>
                </div>
                <div class="add-actions float-right" style="margin-top: 10px;">
                    <a @click.prevent="getExcel">
                        <el-button class="button-outline-green" round>
                            <img src="~assets/images/icons/download-new.png" v-if="(loadingExcel == false)">
                            <div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export
                        </el-button>
                    </a>
                </div>
            </div>
            <div class="content">
                <div class="grand-total">
                    <span>Grand total</span>
                    Rp. {{formatPrice(grandTotal)}}
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
                    <div class="input-with-icons clearfix">
                        <div class="el-input searchtype">
                            <input type="text" v-model="filterSearchQuery" class="el-input__inner selectUser" :placeholder="'Select Hub '">
                            <img src="~assets/images/icons/arrow-down.png">
                            <div class="dropdown-filterable">
                                <ul>
                                    <div v-if="searchLoading == true">
                                        <li><a href="#" style="text-align:center;">Loading Data</a></li>
                                    </div>
                                    <div v-else>
                                        <div v-if="links.length !== 0">
                                            <li><a href="#" @click.prevent="filterByUser('')">All Hub</a></li>
                                            <li v-for="(itemUser, indexUser) in links"
                                            :key="indexUser"
                                            :label="itemUser.fullname"
                                            :value="itemUser.username"><a href="#" @click.prevent="filterByUser(itemUser)">{{itemUser.name}}</a></li>
                                        </div>
                                        <div v-else><li><a href="#" style="text-align:center;">No data</a></li></div>
                                    </div>
                                </ul>
                            </div>
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
                        <el-tab-pane label="Semua Status" name=" "></el-tab-pane>
                        <el-tab-pane label="Success" name="success"></el-tab-pane>
                        <el-tab-pane label="Failed" name="failed"></el-tab-pane>
                        <!-- <el-tab-pane label="Process Payment" name="process_payment"></el-tab-pane> -->
                        <el-tab-pane label="Confirm by Agent" name="confirmed_by_agent"></el-tab-pane>
                        <el-tab-pane label="Waiting Payment" name="waiting_payment"></el-tab-pane>
                        <el-tab-pane label="Request Payment Code" name="request_payment_code"></el-tab-pane>
                    </el-tabs>
                </div>
                <el-table 
                    :data="itemsData" 
                    max-height="530" 
                    empty-text="No data available in table"
                    @current-change="handleCurrentChange"
                    ref="singleTable"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column prop="trx_id" label="Transaction ID" width="200"></el-table-column>
                    <el-table-column label="User" width="150">
                        <template slot-scope="scope">
                            <div v-if="scope.row.user">{{scope.row.user.fullname}}</div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Hub" width="150">
                        <template slot-scope="scope">
                            <div v-if="scope.row.hub">{{scope.row.hub.name}}</div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Crew" width="150">
                        <template slot-scope="scope">
                            <div v-if="scope.row.spk">{{scope.row.spk.fullname}}</div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Total" width="150">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.total)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Status" width="180">
                        <template slot-scope="scope">
                            <span class="badge success" v-if="scope.row.status == 'success'">{{scope.row.status}}</span>
                            <span class="badge failed" v-else-if="scope.row.status == 'failed'">{{scope.row.status}}</span>
                            <span class="badge pending" v-else-if="scope.row.status == 'waiting_payment'">{{scope.row.status}}</span>
                            <span class="badge pending" v-else-if="scope.row.status == 'request_payment_code'">{{scope.row.status}}</span>
                            <span class="badge request" v-else-if="scope.row.status == 'confirmed_by_agent'">{{scope.row.status}}</span>
                            <span v-else>{{scope.row.status}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Created At" width="150">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Expired At" width="150">
                        <template slot-scope="scope">
                            {{scope.row.expired_at | moment("YYYY-MM-DD, H:mm:ss")}}
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
                            <el-form :model="forms" status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm nolineHeight">
                                <div class="item-forms-details" v-if="itemDataDetail">
                                    <h5>Info Transaksi</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Transaction ID">
                                                    {{itemDataDetail.trx_id}}
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Status">
                                                    <span class="badge inline success" v-if="itemDataDetail.status == 'success'">{{itemDataDetail.status}}</span>
                                                    <span class="badge inline failed" v-else-if="itemDataDetail.status == 'failed'">{{itemDataDetail.status}}</span>
                                                    <span class="badge inline pending" v-else-if="itemDataDetail.status == 'waiting_payment'">{{itemDataDetail.status}}</span>
                                                    <span class="badge inline pending" v-else-if="itemDataDetail.status == 'request_payment_code'">{{itemDataDetail.status}}</span>
                                                    <span class="badge inline request" v-else-if="itemDataDetail.status == 'confirmed_by_agent'">{{itemDataDetail.status}}</span>
                                                    <span v-else>{{itemDataDetail.status}}</span>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12" v-if="itemDataDetail.user">
                                                <el-form-item label="User">
                                                    {{itemDataDetail.user.fullname}} ({{itemDataDetail.user.phone_number}})
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12" v-if="itemDataDetail.spk">
                                                <el-form-item label="Crew">
                                                    {{itemDataDetail.spk.fullname}} ({{itemDataDetail.spk.phone_number}})
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Payment Code">
                                                    {{itemDataDetail.payment_code}}
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12" v-if="itemDataDetail.failed_reason !== null">
                                                <el-form-item label="Failed Reason">
                                                    {{itemDataDetail.failed_reason}}
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12" v-if="itemDataDetail.created_at">
                                                <el-form-item label="Created At">
                                                    {{itemDataDetail.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12" v-if="itemDataDetail.expired_at">
                                                <el-form-item label="Expired At">
                                                    {{itemDataDetail.expired_at | moment("YYYY-MM-DD, H:mm:ss")}}
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12" v-if="itemDataDetail.hub">
                                                <el-form-item label="Hub">
                                                    {{itemDataDetail.hub.name}}<br>
                                                    {{itemDataDetail.hub.address}}
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24" v-if="itemDataDetail.details">
                                                <div class="barang-content clearfix">
                                                    <h5>Item Barang</h5>
                                                    <div class="el-table mobayar-table">
                                                        <table cellspacing="0" cellpadding="0">
                                                            <thead>
                                                                <tr>
                                                                    <th>Nama Barang</th>
                                                                    <th style="text-align: center;">Qty</th>
                                                                    <th>Harga</th>
                                                                    <th>Sub Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr 
                                                                    v-for="(itembarang, indexbarang) in itemDataDetail.details" 
                                                                    :key="indexbarang">
                                                                    <td>{{itembarang.item.name}}</td>
                                                                    <td style="text-align: center;">{{itembarang.qty}}</td>
                                                                    <td>Rp. {{formatPrice(itembarang.sell_price)}}</td>
                                                                    <td>Rp. {{formatPrice(itembarang.sell_price * itembarang.qty)}}</td>
                                                                </tr>
                                                            </tbody>
                                                            <tfoot>
                                                                <tr>
                                                                    <td colspan="1"><b>Total</b></td>
                                                                    <td align="center">{{getTotalBarang}}</td>
                                                                    <td></td>
                                                                    <td align="left">Rp. {{formatPrice(getTotalPrice)}}</td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Tutup</el-button>
                        <el-button 
                            class="button-white-green" 
                            id="save" 
                            @click.prevent="actionForceTransactions(itemDataDetail)" 
                            v-if="(filterQuery == 'failed' || itemDataDetail.status == 'failed')
                            || (filterQuery == 'confirmed_by_agent' || itemDataDetail.status == 'confirmed_by_agent')">Cek Status Pembayaran</el-button>
                    </div>
                </div>
                <table border="1" style="width: 100%;display:none;" id="table-export-transactions">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>User</th>
                            <th>Hub</th>
                            <th>Crew</th>
                            <th>Status</th>
                            <th>Total Harga Barang</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Nama Barang</th>
                            <th>Qty</th>
                            <th>Harga</th>
                            <th>SubTotal</th>
                        </tr>
                    </thead>
                    <tbody v-for="(dataOffTrans, indexData) in itemsDataExport" :key="indexData">
                        <tr>
                            <td align="center" :rowspan="(dataOffTrans.details).length + 1">{{dataOffTrans.trx_id}}</td>
                            <td align="center" :rowspan="(dataOffTrans.details).length + 1">
                                <div v-if="dataOffTrans.user">
                                    <div v-if="dataOffTrans.user.fullname !== null">{{String(dataOffTrans.user.fullname)}}</div>
                                    <div v-else>-</div>
                                </div>
                                <div v-else>-</div>
                            </td>
                            <td align="center" :rowspan="(dataOffTrans.details).length + 1">
                                <div v-if="dataOffTrans.hub">
                                    <div v-if="dataOffTrans.hub.name !== null">{{dataOffTrans.hub.name}}</div>
                                    <div v-else>-</div>
                                </div>
                                <div v-else>-</div>
                            </td>
                            <td align="center" :rowspan="(dataOffTrans.details).length + 1">
                                <div v-if="dataOffTrans.spk">
                                    <div v-if="dataOffTrans.spk.fullname !== null">{{dataOffTrans.spk.fullname}}</div>
                                    <div v-else>-</div>
                                </div>
                                <div v-else>-</div>
                            </td>
                            <td align="center" :rowspan="(dataOffTrans.details).length + 1">{{dataOffTrans.status}}</td>
                            <td align="center" :rowspan="(dataOffTrans.details).length + 1">{{dataOffTrans.total}}</td>
                            <td align="center" :rowspan="(dataOffTrans.details).length + 1">
                                {{dataOffTrans.created_at | moment("YYYY-MM-DD, H:mm:ss")}}.
                            </td>
                            <td align="center" :rowspan="(dataOffTrans.details).length + 1">
                                {{dataOffTrans.updated_at | moment("YYYY-MM-DD, H:mm:ss")}}.
                            </td>
                            <td rowspan="2">
                                <div v-if="dataOffTrans.details !== null">
                                    <div v-if="dataOffTrans.details[0].item !== null">
                                        <div v-if="dataOffTrans.details[0].item.name !== null || dataOffTrans.details[0].item.name !== undefined">{{dataOffTrans.details[0].item.name}}</div>
                                        <div v-else>-</div>
                                    </div>
                                    <div v-else>-</div>
                                </div>
                                <div v-else>-</div>
                            </td>
                            <td rowspan="2">
                                <div v-if="dataOffTrans.details">{{dataOffTrans.details[0].qty}}</div>
                            </td>
                            <td rowspan="2">
                                <div v-if="dataOffTrans.details">{{dataOffTrans.details[0].sell_price}}</div>
                            </td>
                            <td rowspan="2">
                                <div v-if="dataOffTrans.details">{{dataOffTrans.details[0].sell_price * dataOffTrans.details[0].qty}}</div>
                            </td>
                        </tr>
                        <tr v-for="(dataDetails, indexDetails) in dataOffTrans.details" :key="indexDetails">
                            <td v-if="indexDetails > 0">
                                <div v-if="dataDetails.item">
                                    <div v-if="dataDetails.item.name !== null">{{dataDetails.item.name}}</div>
                                    <div v-else>-</div>
                                </div>
                                <div v-else>-</div>
                            </td>
                            <td v-if="indexDetails > 0">{{dataDetails.qty}}</td>
                            <td v-if="indexDetails > 0">{{dataDetails.sell_price}}</td>
                            <td v-if="indexDetails > 0">{{dataDetails.sell_price * dataDetails.qty}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import JQuery from 'jquery'
import XLSX from 'xlsx'
import FUNCTIONS from '@/functions'
import pageHeader from '@/components/partials/pageHeader.vue'
import loadingSvg from '@/components/partials/loadingSvg.vue'

let date = new Date();
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

export default {
    name: 'offline-hubs-transactions',
    data(){
        return{
            apiURL: process.env.ROOT_API,
            sectionApi: 'offlinehub?servicePathUrl=transaction',
            sectionApiHub: 'offlinehub?servicePathUrl=hub',
            sectionApiCheckPayment: 'payment',
            sectionApiAll: '/all',
            loading: false,
            loadingForm: false,
            loadingExcel: false,
            searchLoading: false,
            links: [],
            itemsData: [],
            itemDataDetail: [],
            itemsDataExport: [],
            filterQuery: ' ',
            filterSearchQuery: '',
            filterbyHub: '',
            dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
            format: 'yyyy-MM-dd',
            searchQuery: '',
            totalPage: '',
            perPage: 10,
            currentPage: 1,
            titleForms: '',
            formsType: '',
            messagesuccess: '',
            messageerror: '',
            grandTotal: '',
            dataTextUpdate: 'Detail Transaksi Offline Hub',
            textErrorNetwork: 'Jaringan Bermasalah',
            forms:{},
            rules:{}
        }
    },
    created(){
        FUNCTIONS.checkPermissions(this.$dataRole['service.offlinehub.get.transaction.all'])
    },
    watch:{
        searchQuery: function(newValue){
            this.getResult(newValue)
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
        dateRange: function(newValue){
            this.getPost(this.searchQuery)
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
        filterQuery: function(newValue){
            this.getPost(this.searchQuery)
            document.querySelector('.el-pagination').children[1].children[0].click()
        }
    },
    mounted(){
        this.getPost(this.searchQuery)
        this.searchUserInit()
        this.getUserAll('')
    },
    methods:{
        getPost(search){
            this.loading = true
            let url = this.urlService + this.sectionApi + this.sectionApiAll + '&limit=' + this.perPage + '&page=' + this.currentPage + '&keyword=' + search + '&direction=DESC' + '&orderBy=createdAt' + '&startDate=' + this.dateRange[0] + '&endDate=' + this.dateRange[1] + '&status=' + this.filterQuery + '&hubId=' + this.filterbyHub
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsData = response.data.data.rows
                    this.grandTotal = response.data.data.grandTotal
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
            if(this.itemsData.length != 0){
                let databeforeExcel = [];
                let exportToExcel = [];
                let url = this.urlService + this.sectionApi + this.sectionApiAll + '&limit=' + this.totalPage + '&page=1' + '&keyword=' + this.searchQuery + '&direction=DESC' + '&orderBy=createdAt' + '&startDate=' + this.dateRange[0] + '&endDate=' + this.dateRange[1] + '&status=' + this.filterQuery + '&hubId=' + this.filterbyHub + '&export=1'

                this.loadingExcel = true
                this.axios.get(url)
                .then(response => { 
                    if(response.data.status == 'success'){
                        this.itemsDataExport = response.data.data.rows
                        // databeforeExcel.forEach(function(currentValue, i, arr){
                        //     let dataUser = currentValue.user !== null ? currentValue.user.fullname : '-'
                        //     let dataHub = currentValue.hub !== null ? currentValue.hub.name : '-'
                        //     let dataHubLocations = currentValue.hub !== null ? currentValue.hub.address : '-'
                        //     let dataSPK = currentValue.spk !== null ? currentValue.spk.fullname : '-'
                        //     let date = new Date(currentValue.expired_at)
                        //     let dateCreatedAt = new Date(currentValue.created_at)
                        //     let fulldate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
                        //     let fulldateCreateAt = dateCreatedAt.getFullYear() + '-' + (dateCreatedAt.getMonth() + 1) + '-' + dateCreatedAt.getDate() + ' ' + dateCreatedAt.getHours() + ':' + dateCreatedAt.getMinutes() + ':' + dateCreatedAt.getSeconds()

                        //     if(this.filterQuery == 'failed' || this.filterQuery == ' '){
                        //         exportToExcel.push(
                        //             {
                        //                 'Transaksi ID' : currentValue.trx_id,
                        //                 'User': dataUser,
                        //                 'Hub': dataHub,
                        //                 'Hub Locations': dataHubLocations,
                        //                 'Crew': dataSPK,
                        //                 'Total': currentValue.total,
                        //                 'Status': currentValue.status,
                        //                 'Failed Reason': currentValue.failed_reason,
                        //                 'Created At': fulldateCreateAt,
                        //                 'Expired At': fulldate
                        //             }
                        //         )
                        //     }else{
                        //         exportToExcel.push(
                        //             {
                        //                 'Transaksi ID' : currentValue.trx_id,
                        //                 'User': dataUser,
                        //                 'Hub': dataHub,
                        //                 'Hub Locations': dataHubLocations,
                        //                 'Crew': dataSPK,
                        //                 'Total': currentValue.total,
                        //                 'Status': currentValue.status,
                        //                 'Created At': fulldateCreateAt,
                        //                 'Expired At': fulldate
                        //             }
                        //         )
                        //     }
                        // }, this)

                        // let filename = "transaksi-offline-hub-" + this.dateRange[0] + "-to-" + this.dateRange[1]
                        // var wscols
                        // if(this.filterQuery == 'failed' || this.filterQuery == ' '){
                        //     wscols = [
                        //         {wch:30},
                        //         {wch:20},
                        //         {wch:20},
                        //         {wch:60},
                        //         {wch:20},
                        //         {wch:20},
                        //         {wch:20},
                        //         {wch:60},
                        //         {wch:20},
                        //         {wch:20},
                        //     ];
                        // }else{
                        //     wscols = [
                        //         {wch:30},
                        //         {wch:20},
                        //         {wch:20},
                        //         {wch:60},
                        //         {wch:20},
                        //         {wch:20},
                        //         {wch:20},
                        //         {wch:20},
                        //         {wch:20},
                        //     ];
                        // }

                        // var datas = XLSX.utils.json_to_sheet(exportToExcel)
                        // datas['!cols'] = wscols;
                        // var wb = XLSX.utils.book_new()
                        // XLSX.utils.book_append_sheet(wb, datas, 'Laporan Transaksi Offlinehub')
                        // XLSX.writeFile(wb, filename+'.xlsx')
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
                .finally(() => {
                    let that = this
                    let dataTable = document.querySelectorAll('#table-export-transactions td')

                    setTimeout(function(){
                        that.loadingExcel = false
                        var wscols = [
                            {wch:25},
                            {wch:20},
                            {wch:20},
                            {wch:20},
                            {wch:15},
                            {wch:20},
                            {wch:20},
                            {wch:20},
                            {wch:20},
                            {wch:10},
                            {wch:20},
                            {wch:20},
                            {wch:20},
                            {wch:20},
                        ];
                        var datas = XLSX.utils.table_to_sheet(document.getElementById('table-export-transactions'))
                        datas['!cols'] = wscols;
                        var wb = XLSX.utils.book_new()
                        let filename = "transaksi-offline-hub-" + that.dateRange[0] + "-to-" + that.dateRange[1]
                        XLSX.utils.book_append_sheet(wb, datas, 'Laporan Transaksi Offlinehub')
                        XLSX.writeFile(wb, filename+'.xlsx')
                    }, 1000)
                })
            }else{
                this.$notify.error({
                    title: 'Maaf',
                    message: 'Data Kosong'
                });

            }
        },
        handleCurrentChange(val){
            if(this.$dataRole['service.offlinehub.get.transaction.detail.*']){
                if(val){
                    this.titleForms = this.dataTextUpdate
                    this.formsType = 'edit'
                    let url = this.urlService + this.sectionApi + '/detail/' + val.id
                    this.postFunction('getbyid', '', url)
                    this.initClickCreateFunction('show')
                }
            }else{
                this.$notify.error({
                    title: 'Error',
                    message: 'Anda tidak punya akses'
                });
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
        closeModal(row){
            this.initClickCreateFunction('hide')
            this.$refs.singleTable.setCurrentRow(row);
            this.$refs.formsvalid.resetFields();
            this.forms.key = ''
            this.forms.value = ''
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
            if(type == 'getbyid'){
                this.loadingForm = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemDataDetail = response.data.data
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
                        message: 'Gagal mendapatkan data detail'
                    });
                })
                .finally(() => {
                    this.loadingForm = false
                })
            }
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        searchUserInit(){
            let that = this
            setTimeout(function(){
                document.querySelector('.selectUser').addEventListener('click', function(){
                    document.querySelector('.dropdown-filterable').classList.add('dropdown-showing')
                });
                document.addEventListener('click', function(e){
                    if(!JQuery(e.target).closest('.selectUser, .dropdown-filterable').length){
                        document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
                    }
                })
                var textInput = document.querySelector('.selectUser');
                var timeout = null;
                textInput.onkeyup = function (e) {
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        that.getUserAll(textInput.value)
                        console.log('Input Value:', textInput.value);
                    }, 800);
                };
            }, 500)
        },
        filterByUser(user){
            let usernameData
            if(user == ''){
                usernameData = ''
                this.filterSearchQuery = ''
                this.filterbyHub = ''
                this.getUserAll('')
            }else{
                this.filterSearchQuery = user.name
                this.filterbyHub = user.id
            }
            document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
            this.getPost(this.searchQuery)
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
        getUserAll(search){
            let userDataurl = this.urlService + this.sectionApiHub + '&limit=100&page=1' + '&keyword=' + search + '&direction=DESC' + '&orderBy=createdAt'
            this.searchLoading = true
            this.axios.get(userDataurl)
            .then(response => {
                if(response.data.status == 'success'){
                    this.links = response.data.data.rows
                    this.searchLoading = false
                }
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                this.searchLoading = false
            })
        },
        actionForceTransactions(val){
            let loadingform = auth.svgSpinner
            let stringText = 'Cek Status Pembayaran'
            this.$confirm('', 'Cek status Pembayaran', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                document.getElementById('save').children[0].innerHTML = loadingform
                let url = this.apiURL + this.sectionApiCheckPayment + '?code=' + val.payment_code + '&reference_id=' + val.id
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.closeModal()
                        this.getPost(this.searchQuery)
                        this.$notify({
                            type: 'success',
                            title: 'Success',
                            message: 'Pengecekan berhasil di lakukan'
                        })
                        document.getElementById('save').children[0].innerHTML = stringText
                    }else{
                        this.$notify.error({
                            title: 'Error',
                            message: response.data.message
                        })
                        document.getElementById('save').children[0].innerHTML = stringText
                    }
                })
                .catch(error => {
                    document.getElementById('save').children[0].innerHTML = stringText
                    this.$notify.error({
                        title: 'Error',
                        message: 'Jaringan Bermasalah'
                    })
                })
            })
        }
    },
    computed:{
        getTotalBarang: function(){
            let totalBarang = [];
            this.itemDataDetail.details.forEach(element => {
                let qty = parseFloat(element.qty)
                totalBarang.push(qty)
            })
            return totalBarang.reduce(function(total, num){ return total + num }, 0);
        },
        getTotalPrice: function(){
            let totalBarangPrice = [];
            this.itemDataDetail.details.forEach(element => {
                let qtyprice = parseFloat(element.sell_price) * parseFloat(element.qty)
                totalBarangPrice.push(qtyprice)
            })
            return totalBarangPrice.reduce(function(total, num){ return total + num }, 0);
        },
    },
    components: { pageHeader, loadingSvg }
}
</script>

<style lang="scss" scoped>
.offline-hub-content-details{
    .content-details{
        display: inline-block;
        vertical-align: top;
        width: 25%;
        margin-right: 15px;
    }
}
</style>
