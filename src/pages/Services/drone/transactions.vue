<template>
    <div class="content-wrapper">
        <div id="drone-transactions">
            <div class="page-header">
                <page-header titleName="Transaksi Drone" :isCreate="false"></page-header>
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
                </div>
                <el-table
                    :data="itemsData"
                    max-height="530"
                    empty-text="No data available in table"
                    @current-change="handleCurrentChange"
                    ref="singleTable"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column prop="trxId" label="Transaction ID" width="200"></el-table-column>
                    <el-table-column label="Status Pemesanan" width="150">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 'survey telepon'" class="badge request">{{scope.row.status}}</span>
                            <span v-else-if="scope.row.status == 'survey lokasi'" class="badge pending">{{scope.row.status}}</span>
                            <span v-else-if="scope.row.status == 'selesai'" class="badge success">{{scope.row.status}}</span>
                            <span v-else-if="scope.row.status == 'gagal'" class="badge failed">{{scope.row.status}}</span>
                            <span v-else class="badge primary">{{scope.row.status}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="paymentStatus" label="Status Pembayaran" width="150">
                        <template slot-scope="scope">
                            <span v-if="scope.row.paymentStatus == 'onprocess'" class="badge request">{{scope.row.paymentStatus}}</span>
                            <span v-else-if="scope.row.paymentStatus == 'waiting_payment'" class="badge pending">{{scope.row.paymentStatus}}</span>
                            <span v-else-if="scope.row.paymentStatus == 'success'" class="badge success">{{scope.row.paymentStatus}}</span>
                            <span v-else-if="scope.row.paymentStatus == 'failed'" class="badge failed">{{scope.row.paymentStatus}}</span>
                            <span v-else class="badge primary">{{scope.row.paymentStatus}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Produk" width="150">
                        <template slot-scope="scope">
                            <div v-if="scope.row.prodcut_id">
                                <value-component :conditions="scope.row.prodcut_id" :value="scope.row.prodcut_id.name"/>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Jenis Pertanian" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.land_id">
                                <value-component :conditions="scope.row.land_id" :value="scope.row.land_id.name"/>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Total Amount" width="150">
                        <template slot-scope="scope">
                            <value-component :conditions="scope.row.total_amount" :value="'Rp. '+formatPrice(scope.row.total_amount)"/>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="Lokasi" width="250">
                        <template slot-scope="scope">
                            <value-component :conditions="scope.row.full_address" :value="scope.row.full_address"/>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="Created At" width="200">
                        <template slot-scope="scope">
                            <value-component :conditions="scope.row.created_at" :value="scope.row.created_at" type="date" />
                        </template>
                    </el-table-column>
                </el-table>
                <div class="mobayar-actions-bottom clearfix">
                    <div class="showing-page float-left">
                        <span>View</span>
                        <ul>
                            <li class="active"><a href="#" @click.prevent="limitChange('10', $event)">10</a></li>
                            <li><a href="#" @click.prevent="limitChange('25', $event)">25</a></li>
                            <li><a href="#" @click.prevent="limitChange('50', $event)" >50</a></li>
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
                        <h4>Detail Transaksi Drone</h4>
                        <el-button id="cancel" @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                    </header>
                    <section>
                        <el-form :model="forms" status-icon :rules="rules" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                            <div v-if="rejectStatus !== true">
                                <div class="item-forms-details">
                                    <h5>Info Pesanan</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Transaction ID">
                                                    <value-component :conditions="itemDataDetail.trxId" :value="itemDataDetail.trxId" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Nama Lengkap">
                                                    <value-component :conditions="itemDataDetailUser" :value="itemDataDetailUser" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Nomor Telepon">
                                                    <value-component :conditions="itemDataDetail.phone_number" :value="itemDataDetail.phone_number" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Jenis Pertanian">
                                                    <value-component v-if="itemDataDetail.land_id" :conditions="itemDataDetail.land_id" :value="itemDataDetail.land_id.name" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12" v-if="itemDataDetail.status !== 'selesai' && itemDataDetail.status !== 'gagal'">
                                                <el-form-item label="Status Pemesanan">
                                                    <el-select v-model="updateStatus" placeholder="Select">
                                                        <el-option label="Survey Telepon" value="survey telepon"></el-option>
                                                        <el-option label="Survey Lokasi" value="survey lokasi"></el-option>
                                                        <el-option label="Selesai" value="selesai"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col v-else :span="12">
                                                <el-form-item label="Status Pemesanan">
                                                    <span v-if="itemDataDetail.status == 'selesai'" style="display: table;padding: 2px 12px;height: auto;line-height: normal;" class="badge success">{{itemDataDetail.status}}</span>
                                                    <span v-else style="display: table;padding: 2px 12px;height: auto;line-height: normal;" class="badge failed">{{itemDataDetail.status}}</span>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12" v-if="itemDataDetail.status !== 'selesai' && itemDataDetail.status !== 'gagal'">
                                                <el-form-item label="Tanggal Penyemprotan">
                                                    <!-- <value-component :conditions="itemDataDetail.spray_date" :value="itemDataDetail.spray_date" type="date-no-time" /> -->
                                                    <el-date-picker autocomplete="off" v-model="sprayDate" type="date" format="yyyy-MM-d" value-format="yyyy-MM-d"></el-date-picker>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12" v-else>
                                                <el-form-item label="Tanggal Penyemprotan">
                                                    <value-component :conditions="itemDataDetail.spray_date" :value="itemDataDetail.spray_date" type="date-no-time" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Ukuran Lahan">
                                                    <value-component :conditions="itemDataDetail.land_size" :value="formatPrice(itemDataDetail.land_size) + ' m'" type="meter" />
                                                </el-form-item>
                                            </el-col>
                                            <!-- <el-col :span="12">
                                                <el-form-item label="Status Deskripsi">
                                                    <value-component :conditions="itemDataDetail.statusDescription" :value="itemDataDetail.statusDescription" />
                                                </el-form-item>
                                            </el-col> -->
                                            <el-col :span="12" v-if="itemDataDetail.status == 'gagal'">
                                                <el-form-item label="Alasan di Tolak">
                                                    <value-component :conditions="itemDataDetail.rejectedReason" :value="itemDataDetail.rejectedReason" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Created At">
                                                    <value-component :conditions="itemDataDetail.created_at" :value="itemDataDetail.created_at" type="date" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Updated At">
                                                    <value-component :conditions="itemDataDetail.updated_at" :value="itemDataDetail.updated_at" type="date" />
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                                <div class="item-forms-details" v-if="itemDataDetail.prodcut_id">
                                    <h5>Info Produk</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Produk Name">
                                                    <value-component :conditions="itemDataDetail.prodcut_id" :value="itemDataDetail.prodcut_id.name" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Price">
                                                    <value-component :conditions="itemDataDetail.prodcut_id" :value="'Rp.' + formatPrice(itemDataDetail.prodcut_id.price)" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Maximal Ukuran Lahan">
                                                    <value-component :conditions="itemDataDetail.prodcut_id" :value="formatPrice(itemDataDetail.prodcut_id.max_landsize) + ' m'" type="meter" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Minimal Ukuran Lahan">
                                                    <value-component :conditions="itemDataDetail.prodcut_id" :value="formatPrice(itemDataDetail.prodcut_id.min_landsize) + ' m'" type="meter" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Product Detail">
                                                    <!-- <value-component :conditions="itemDataDetail.prodcut_id" :value="itemDataDetail.prodcut_id.product_details" /> -->
                                                    <ul style="padding-left:20px;">
                                                        <li style="line-height: normal;" v-for="(dataDetails, indexDetails) in productDetail" :key="indexDetails">
                                                            <div v-html="dataDetails"></div>
                                                        </li>
                                                    </ul>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                                <div class="item-forms-details">
                                    <h5>Info Lokasi</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Alamat Lengkap">
                                                    <value-component :conditions="itemDataDetail.full_address" :value="itemDataDetail.full_address" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Provinsi">
                                                    <value-component v-if="itemDataDetail.province_id" :conditions="itemDataDetail.province_id" :value="itemDataDetail.province_id.name" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Kota">
                                                    <value-component v-if="itemDataDetail.city_id" :conditions="itemDataDetail.city_id" :value="itemDataDetail.city_id.name" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Kecamatan">
                                                    <value-component v-if="itemDataDetail.subdistrict_id" :conditions="itemDataDetail.subdistrict_id" :value="itemDataDetail.subdistrict_id.name" />
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                                <div class="item-forms-details">
                                    <h5>Info Tagihan</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Payment Code">
                                                    <value-component :conditions="itemDataDetail.payment_code" :value="itemDataDetail.payment_code" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Status Pembayaran">
                                                    <span v-if="itemDataDetail.paymentStatus == 'onprocess'" class="inline badge request">{{itemDataDetail.paymentStatus}}</span>
                                                    <span v-else-if="itemDataDetail.paymentStatus == 'waiting_payment'" class="inline badge pending">{{itemDataDetail.paymentStatus}}</span>
                                                    <span v-else-if="itemDataDetail.paymentStatus == 'success'" class="inline badge success">{{itemDataDetail.paymentStatus}}</span>
                                                    <span v-else-if="itemDataDetail.paymentStatus == 'failed'" class="inline badge failed">{{itemDataDetail.paymentStatus}}</span>
                                                    <span v-else class="inline badge primary">{{itemDataDetail.paymentStatus}}</span>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Amount">
                                                    <value-component :conditions="itemDataDetail.amount" :value="'Rp. ' + formatPrice(itemDataDetail.amount)" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Total Amount">
                                                    <value-component :conditions="itemDataDetail.total_amount" :value="'Rp. ' + formatPrice(itemDataDetail.total_amount)" />
                                                </el-form-item>
                                            </el-col>
                                            <!-- <el-col :span="12">
                                                <el-form-item label="Metode Pembayaran">
                                                    <value-component :conditions="itemDataDetail.paymentMethod" :value="itemDataDetail.paymentMethod" />
                                                </el-form-item>
                                            </el-col> -->
                                            <el-col :span="12">
                                                <el-form-item label="Payed At">
                                                    <value-component :conditions="itemDataDetail.payedAt" :value="itemDataDetail.payedAt" type="date" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Biaya Tambahan">
                                                    <div v-if="itemDataDetail.status !== 'selesai' && itemDataDetail.status !== 'gagal'">
                                                        <el-switch v-model="morePayment"></el-switch>
                                                        <div v-if="morePayment == true" style="display:inline-block;margin-left: 10px;">
                                                            <div class="el-form-item__content custom-price-format">
                                                                <div class="el-input">
                                                                    <money v-model="additionalPayment" v-bind="money" class="el-input__inner"></money>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div v-else style="line-height: normal;">
                                                        Rp. {{formatPrice(itemDataDetail.additional_amount)}}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <div class="item-forms-details">
                                    <h5>Alasan di Reject</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="24">
                                                <el-form-item>
                                                    <el-input type="textarea" rows="5" v-model="rejectReason"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </div>
                        </el-form>
                    </section>
                    </div>
                    <div v-if="$dataRole['service.drone.put.transaction.update.*']">
                        <div class="actions-button clearfix" v-if="itemDataDetail.status == 'selesai'">
                            <el-button class="button-outline-black" @click.prevent="closeModal()">Batal</el-button>
                        </div>
                        <div class="actions-button clearfix" v-else-if="itemDataDetail.status == 'gagal'">
                            <el-button class="button-outline-black" @click.prevent="closeModal()">Batal</el-button>
                        </div>
                        <div class="actions-button clearfix" v-else>
                            <el-button class="button-outline-black" v-if="rejectStatus == false" @click.prevent="rejectStatus = true">Reject</el-button>
                            <el-button class="button-outline-black" v-if="rejectStatus == true" @click.prevent="rejectStatus = false">Batal</el-button>
                            <el-button class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Submit</el-button>
                        </div>
                    </div>
                    <div v-else>
                        <el-button class="button-outline-black" @click.prevent="closeModal()">Batal</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Money } from "v-money"
import services from "@/service"
import FUNCTIONS from "@/functions"
import pageHeader from "@/components/partials/pageHeader.vue"
import loadingSvg from "@/components/partials/loadingSvg.vue"
import valueComponent from "@/components/partials/valueComponent.vue"

let date = new Date()
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
export default {
    name: "transactions-drone",
    data() {
        return {
            sectionApi: "drone?servicePathUrl=transaction",
            sectionApiDetail: "getDetailTransaction",
            loading: false,
            loadingForm: false,
            itemsData: [],
            itemDataDetail: [],
            itemDataDetailUser: "",
            searchQuery: "",
            totalPage: "",
            directionQuery: "DESC",
            dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
            format: 'yyyy-MM-dd',
            perPage: 10,
            currentPage: 1,
            messagesuccess: "",
            messageerror: "",
            textDataUpdateSuccess: "Data Transactions Berhasil diupdate.",
            textMemuatData: "Masih memuat data",
            textErrorNetwork: "Jaringan Bermasalah",
            morePayment: false,
            additionalPayment: 0,
            updateStatus: '',
            rejectStatus: false,
            rejectReason: '',
            productDetail: [],
            sprayDate: '',
            sprayDateValidations: false,
            forms: {},
            rules: {},
            money: {
                decimal: ",",
                thousands: ".",
                prefix: "",
                suffix: "",
                precision: 0,
                masked: false /* doesn't work with directive */
            },
        }
    },
    watch: {
        searchQuery: function() {
            this.getResult()
            FUNCTIONS.checkPaginations()
        },
        dateRange: function(){
            this.getPost()
        },
        sprayDate: function(newValue, oldValue){
            if(newValue == null){
                this.sprayDate = oldValue
            }
            let dateNew = new Date(newValue)
            let currentDate = new Date()
            dateNew.setHours(0,0,0,0)
            currentDate.setHours(0,0,0,0)
            if(this.itemDataDetail.status !== 'selesai' && this.itemDataDetail.status !== 'gagal'){
                if(dateNew < currentDate){
                    this.sprayDateValidations = true
                    // FUNCTIONS.notify('warning', 'Maaf', 'Tanggal Penyemprotan tidak boleh kurang dari hari ini')
                }else{
                    this.sprayDateValidations = false
                }
            }
            
        }
    },
    created() {
        FUNCTIONS.checkPermissions(this.$dataRole["service.drone.get.transaction"])
    },
    mounted() {
        this.getPost()
    },
    methods: {
        async getPost() {
            let url = this.urlService + this.sectionApi + '&limit=' + this.perPage + '&page=' + this.currentPage + '&direction=' + this.directionQuery + "&keyword=" + this.searchQuery + '&startDate=' + this.dateRange[0] + '&endDate=' + this.dateRange[1] + '&orderBy=createdAt'
            try{
                this.loading = true
                const response = await services.getList(url)
                this.loading = false
                if(response.data.status == 'success'){
                    this.itemsData = response.data.data.rows
                    this.totalPage = response.data.data.total
                }else{
                    FUNCTIONS.notify('error', 'Error', response.data.message)
                }
            }catch(err){
                this.loading = false
                FUNCTIONS.notify('error', this.textErrorNetwork, "Gagal mendapatkan data")
            }
        },
        async getDetailPost(id) {
            let url = this.urlService + this.sectionApi + '/' + this.sectionApiDetail + '&transactionId=' + id
            try{
                this.loadingForm = true
                const response = await services.getList(url)
                this.loadingForm = false
                if(response.data.status == 'success'){
                    this.itemDataDetail = response.data.data['transaction']
                    this.itemDataDetailUser = response.data.data['fullName']
                    this.updateStatus = this.itemDataDetail.status
                    if(this.itemDataDetail.prodcut_id){
                        this.itemDataDetail.prodcut_id.product_details.split(",").forEach((key, i) => {
                            if(key.includes('note-')){
                                this.productDetail.push('<i>'+key.substr(5)+'</i>')
                            }else if(key.includes('youtube-')){
                                let youtubeSplit = key.split("-")
                                // let myId = this.getIdYoutube(youtubeSplit[1])
                                // let dataYoutube = '<iframe width="560" height="315" src="//www.youtube.com/embed/' + myId + '" frameborder="0" allowfullscreen></iframe>'
                                let dataYoutube = "<a target='_blank' href='"+youtubeSplit[1]+"'>"+youtubeSplit[2]+"</a>"
                                this.productDetail.push(dataYoutube)
                            }else{
                                this.productDetail.push(key)
                            }
                        })
                    }
                    this.sprayDate = this.itemDataDetail.spray_date
                    if(this.itemDataDetail.additional_amount !== 0){
                        this.morePayment = true
                        this.additionalPayment = this.itemDataDetail.additional_amount
                    }
                }else{
                    FUNCTIONS.notify('error', 'Error', response.data.message)
                }
            }catch(err){
                this.loadingForm = false
                FUNCTIONS.notify('error', this.textErrorNetwork, "Gagal mendapatkan data")
            }
        },
        getIdYoutube(url) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);

            if (match && match[2].length == 11) {
                return match[2];
            } else {
                return 'error';
            }
        },
        getResult: _.debounce(function() {
            this.getPost()
        }, 500),
        submitSave(formName, formtype) {
            let loadingform = FUNCTIONS.svgSpinner
            this.messagesuccess = ""
            this.messageerror = ""
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if(formtype == "save") {
                        let url = this.urlService + this.sectionApi + "/update/" + this.itemDataDetail.id + "&needDeviceToken=true&userId=" + this.itemDataDetail.userId
                        let additionalValue, datas, datesSpray, sprayDates, paymentStatus, checkPaymentStatus
                        let checkAdditionalValue = (this.morePayment == true) ? additionalValue = this.additionalPayment : additionalValue = 0
                        datesSpray = new Date(this.sprayDate)
                        sprayDates = ('0' + datesSpray.getDate()).slice(-2) + '/'
                                    + ('0' + (datesSpray.getMonth()+1)).slice(-2) + '/'
                                    + datesSpray.getFullYear()
                        if(this.rejectStatus == false){
                            if(this.sprayDateValidations == false){
                                if(this.updateStatus !== this.itemDataDetail.status){
                                    this.$confirm('Apakah anda yakin untuk mengganti status pemesanan', 'Perhatian', {
                                        confirmButtonText: 'OK',
                                        cancelButtonText: 'Cancel',
                                        type: 'warning'
                                    }).then(() => {
                                        document.getElementById("save").children[0].innerHTML = loadingform
                                        if(this.updateStatus == 'selesai'){
                                            if(this.itemDataDetail.prodcut_id){
                                                checkPaymentStatus = (this.itemDataDetail.prodcut_id.price !== 0) ? paymentStatus = 'waiting_payment' : paymentStatus = 'success'
                                            }
                                            datas = {
                                                additionalAmount: additionalValue,
                                                amount: this.itemDataDetail.amount,
                                                cityId: this.itemDataDetail.city_id.id,
                                                fullAdress: this.itemDataDetail.full_address,
                                                landId: this.itemDataDetail.land_id.id,
                                                landSize: this.itemDataDetail.land_size,
                                                paymentMethod: this.itemDataDetail.paymentMethod,
                                                paymentStatus: paymentStatus,
                                                phoneNumber: this.itemDataDetail.phone_number,
                                                productId: this.itemDataDetail.prodcut_id.id,
                                                provinceId: this.itemDataDetail.province_id.id,
                                                rejectedReason: this.itemDataDetail.rejectedReason,
                                                sprayDate: sprayDates,
                                                status: this.updateStatus,
                                                statusDescription: this.itemDataDetail.statusDescription,
                                                subDistrictId: this.itemDataDetail.subdistrict_id.id,
                                            }
                                        }else{
                                            datas = {
                                                additionalAmount: additionalValue,
                                                amount: this.itemDataDetail.amount,
                                                cityId: this.itemDataDetail.city_id.id,
                                                fullAdress: this.itemDataDetail.full_address,
                                                landId: this.itemDataDetail.land_id.id,
                                                landSize: this.itemDataDetail.land_size,
                                                paymentMethod: this.itemDataDetail.paymentMethod,
                                                paymentStatus: this.itemDataDetail.paymentStatus,
                                                phoneNumber: this.itemDataDetail.phone_number,
                                                productId: this.itemDataDetail.prodcut_id.id,
                                                provinceId: this.itemDataDetail.province_id.id,
                                                rejectedReason: this.itemDataDetail.rejectedReason,
                                                sprayDate: sprayDates,
                                                status: this.updateStatus,
                                                statusDescription: this.itemDataDetail.statusDescription,
                                                subDistrictId: this.itemDataDetail.subdistrict_id.id,
                                            }    
                                        }
                                        this.postFunction("put", datas, url)
                                    })
                                }else{
                                    FUNCTIONS.notify('warning', 'Maaf', 'Status Pemesanan belum di rubah')
                                }
                            }else{
                                FUNCTIONS.notify('warning', 'Maaf', 'Tanggal Penyemprotan tidak boleh kurang dari hari ini')
                            }
                        }else{
                            let datesSprayReject = new Date(this.itemDataDetail.spray_date)
                            let sprayDatesReject = ('0' + datesSprayReject.getDate()).slice(-2) + '/'
                                        + ('0' + (datesSprayReject.getMonth()+1)).slice(-2) + '/'
                                        + datesSprayReject.getFullYear()
                            this.$confirm('Apakah anda yakin untuk menolak pesanan ini', 'Perhatian', {
                                confirmButtonText: 'OK',
                                cancelButtonText: 'Cancel',
                                type: 'warning'
                            }).then(() => {
                                if(this.rejectReason !== ''){
                                    document.getElementById("save").children[0].innerHTML = loadingform
                                    datas = {
                                        additionalAmount: additionalValue,
                                        amount: this.itemDataDetail.amount,
                                        cityId: this.itemDataDetail.city_id.id,
                                        fullAdress: this.itemDataDetail.full_address,
                                        landId: this.itemDataDetail.land_id.id,
                                        landSize: this.itemDataDetail.land_size,
                                        paymentMethod: this.itemDataDetail.paymentMethod,
                                        paymentStatus: 'failed',
                                        phoneNumber: this.itemDataDetail.phone_number,
                                        productId: this.itemDataDetail.prodcut_id.id,
                                        provinceId: this.itemDataDetail.province_id.id,
                                        rejectedReason: this.rejectReason,
                                        sprayDate: sprayDatesReject,
                                        status: 'gagal',
                                        statusDescription: this.itemDataDetail.statusDescription,
                                        subDistrictId: this.itemDataDetail.subdistrict_id.id,
                                    }
                                    this.postFunction("put", datas, url)
                                }else{
                                    FUNCTIONS.notify('warning', 'Maaf', 'Field alasan di reject tidak boleh kosong')
                                }
                            })                                
                        }
                    }  
                }
            })
        },
        formatPrice(value){
            return FUNCTIONS.formatPrice(value)
        },
        handleCurrentChange(val) {
            if(val){
                // this.itemDataDetail = val
                this.getDetailPost(val.id)
                FUNCTIONS.sidebarToggle(true)
            }
        },
        pageChange(page) {
            this.currentPage = page
            this.getPost(this.searchQuery)
        },
        limitChange(limit) {
            this.perPage = limit
            FUNCTIONS.checkPaginations()
            this.getPost(this.searchQuery)
            FUNCTIONS.viewActive()
        },
        closeModal(row) {
            FUNCTIONS.sidebarToggle(false)
            this.$refs.singleTable.setCurrentRow(row)
            this.$refs.formsvalid.resetFields()
            this.itemDataDetail = []
            this.morePayment = false
            this.additionalPayment = 0
            this.updateStatus = ''
            this.rejectStatus = false
            this.rejectReason = ''
            this.productDetail = []
            this.itemDataDetailUser = ''
        },
        postFunction(type, credentials, url) {
            if(type == "put"){
                this.axios.put(url, credentials)
                .then(response => {
                    document.getElementById("save").children[0].innerHTML = "Simpan"
                    if(response.data.status == "error"){
                        FUNCTIONS.notify('error', 'Error', response.data.message)
                    }else{
                        this.messagesuccess = this.textDataUpdateSuccess
                        this.getPost()
                        this.closeModal()
                    }
                })
                .catch(error => {
                    FUNCTIONS.notify('error', this.textErrorNetwork, "Gagal mengedit data")
                })
            }
        },
    },
    components: { pageHeader, loadingSvg, valueComponent, Money }
}
</script>
<style lang="scss">
#drone-transactions{
    .el-date-editor{
        .el-icon-circle-close{
            display: none;
        }
    }
}
</style>
