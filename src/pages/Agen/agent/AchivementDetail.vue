<template>
    <div class="content-wrapper">
        <div id="detail-head-target">
            <div class="page-header">
                <div class="page-header-content">
                    <a @click.prevent="$router.go(-1)" class="back-button">
                        <i class="icon icon-caret-left"></i> Target SPK Regional
                    </a>
                    <div class="page-title clearfix">
                        <h4 class="float-left">Detail Pencapaian SPK</h4>
                        <div class="add-actions">
                            <a @click.prevent="getExcel('Month')" class="float-right">
                                <el-button class="button-outline-green" round>
                                    <img src="~assets/images/icons/download-new.png" v-if="(loadingExcelMonth == false)"> 
                                    <div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export Bulanan
                                </el-button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content">
                <section v-if="errored">
                    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
                </section>
                <section v-else>
                    <div>
                        <el-row :gutter="20" class="agentDetailSidebar">
                            <el-col :span="6" :xs="24">
                                <div class="cards">
                                    <div class="head-detail">
                                        <h4>{{itemsDataUser.fullname}}</h4>
                                        <span>SPK</span>
                                        <font-awesome-icon class="fontIcons" :icon="fontsIcons.kepalaAgent" />
                                    </div>
                                    <div class="content-detail">
                                        <ul>
                                            <li><font-awesome-icon class="fontIcons" :icon="fontsIcons.email" /> <div>{{itemsDataUser.email}}</div></li> 
                                            <li><font-awesome-icon class="fontIcons" :icon="fontsIcons.phone" /> <div>{{itemsDataUser.phone_number}}</div></li>
                                            <li><font-awesome-icon class="fontIcons" :icon="fontsIcons.birthday" /> <div>{{itemsDataUser.birthday | moment("DD MMMM YYYY")}}</div></li>
                                            <li><font-awesome-icon class="fontIcons" :icon="fontsIcons.places" /> <div>{{itemsDataUser.address}}</div></li>
                                            <li style="margin-top: 15px;"><font-awesome-icon class="fontIcons" :icon="fontsIcons.since" /> Sejak {{itemsDataUser.updated_at | moment("DD MMMM YYYY")}}</li>
                                        </ul>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="18" :xs="24">
                                <div class="fullcalendar"></div>
                                <span class="help-block">
                                    Keterangan warna background: &nbsp;
                                    <span class="label mb-5" style="background-color:#ffdd7d">...</span> Sudah dicek oleh Admin Regional.
                                    &nbsp;
                                    <span class="label mb-5" style="background-color:#00abde">...</span> Sudah diverifikasi.
                                    &nbsp;
                                    <span class="label" style="background-color:#b9e8bd">...</span> Hari ini.
                                    &nbsp;
                                    <span class="label" style="background-color:#ffc6c6">...</span> Hari libur (Minggu).
                                </span>
                            </el-col>
                        </el-row>

                        <!-- Detail Pencapaian SPK -->
                        <el-dialog 
                            :title="nameModal"
                            :visible.sync="modalItemTransaction" 
                            width="70%"
                            class="mb-dialog nopadding-right point-modal kepala-regional">
                            <div class="content-dialog detail-pencapaian">
                                <div class="filterSearching clearfix">
                                    <div class="input-with-icons clearfix">
                                        <el-input v-model="searchQuery" class="float-left" placeholder="Search by No Transaksi"></el-input>
                                        <img src='~assets/images/icons/search1.png'>
                                    </div>
                                </div>

                                <el-table 
                                    :data="itemTransactionsFilter"
                                    empty-text="No data available in table"
                                    ref="Itemtransactions"
                                    v-loading="loadingTransactions"
                                    class="mobayar-table">
                                    <el-table-column label="No. Transaksi" width="250">
                                        <template slot-scope="scope">
                                            {{scope.row.trx_id}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Pelanggan">
                                        <template slot-scope="scope">
                                            {{scope.row.user}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Total">
                                        <template slot-scope="scope">
                                            Rp. {{formatPrice(scope.row.total)}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Tanggal">
                                        <template slot-scope="scope">
                                            {{scope.row.date}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Detail" align="center">
                                        <template slot-scope="scope">
                                            <a href="#" @click.prevent="detailTransactions(scope.row.id, scope.row.trx_id)" style="margin-top:3px;display:inline-block;">
                                                <font-awesome-icon class="fontIcons" style="color:#39434E;font-size:18px;margin-right:0px;" :icon="fontsIcons.detail" />
                                            </a>
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
                                        <span>Showing results 1 - {{itemTransactionsFilter.length}} of {{parseInt(totalPage)}}</span>
                                        <el-pagination
                                            layout="prev, pager, next"
                                            :total="parseInt(totalPage)"
                                            @current-change="pageChange"
                                            :page-size="parseInt(perPage)">
                                        </el-pagination>
                                    </div>
                                </div>
                            </div>
                            <span slot="footer" class="dialog-footer clearfix" v-show="loadingTransactions == false">
                                <div v-if="$dataRole['agent.target.verificator']">
                                    <div style="float: left; display: inline-block;margin-top: 8px;">
                                        <span class="verifiedStatus">Sudah dicek ulang <font-awesome-icon class="fontIcons" :icon="fontsIcons.check" /></span>
                                    </div>
                                    <el-button class="button-outline-green getExcelModal" round @click.prevent="getExcel('Day')">
                                        <img src="~assets/images/icons/download-new.png" v-if="(loadingExcelDay == false)" style="vertical-align:middle;margin-right:4px;"> 
                                        <div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export Harian
                                    </el-button>
                                    <div v-if="$dataRole['agent.target.verificator']" style="display: inline-block;">
                                        <el-button round class="choose button-white-green" @click="verifikasiPerDay()" type="primary" v-if="dailyStatus != 'verified'">Verifikasi</el-button>
                                        <span class="verifiedStatus" v-show="dailyStatus == 'verified'">Telah Terverifikasi <font-awesome-icon class="fontIcons" :icon="fontsIcons.check" /></span>
                                    </div>    
                                </div>
                                <div v-else-if="$dataRole['agent.target.checker']">
                                    <div style="float: left; display: inline-block;margin-top: 8px;">
                                        <span class="verifiedStatus" v-show="dailyStatus == 'checked'">Sudah dicek ulang <font-awesome-icon class="fontIcons" :icon="fontsIcons.check" /></span>
                                    </div>
                                    <el-button class="button-outline-green getExcelModal" round @click.prevent="getExcel('Day')">
                                        <img src="~assets/images/icons/download-new.png" v-if="(loadingExcelDay == false)" style="vertical-align:middle;margin-right:4px;"> 
                                        <div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export Harian
                                    </el-button>
                                    <el-button class="button-outline-green" @click="verifikasiPerDay('cek')" v-if="dailyStatus != 'checked'" round>Cek</el-button>
                                </div>
                                <div v-else>
                                    <div style="float: left; display: inline-block;margin-top: 8px;">
                                        <span class="verifiedStatus">Sudah dicek ulang <font-awesome-icon class="fontIcons" :icon="fontsIcons.check" /></span>
                                    </div>
                                    <el-button class="button-outline-green getExcelModal" round @click.prevent="getExcel('Day')">
                                        <img src="~assets/images/icons/download-new.png" v-if="(loadingExcelDay == false)" style="vertical-align:middle;margin-right:4px;"> 
                                        <div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export Harian
                                    </el-button>
                                </div>
                            </span>
                        </el-dialog>

                        <!-- Detail Transactions -->
                        <el-dialog 
                            :title="nameModalTransactions"
                            :visible.sync="modalDetailItemTransaction" 
                            width="60%"
                            class="mb-dialog nopadding-right point-modal kepala-regional">
                            
                            <div class="content-dialog detail-pencapaian">
                                <el-table 
                                    :data="itemDetailTransactions"
                                    empty-text="No data available in table"
                                    ref="Itemtransactions"
                                    v-loading="loadingDetailTransactions"
                                    class="mobayar-table">
                                    <el-table-column label="Produk" width="200">
                                        <template slot-scope="scope">
                                            {{scope.row.item_code}}<br>
                                            {{scope.row.item_name}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Harga Satuan">
                                        <template slot-scope="scope">
                                            Rp.{{formatPrice(scope.row.price)}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Jumlah" align="center">
                                        <template slot-scope="scope">
                                            {{scope.row.quantity}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Total Harga">
                                        <template slot-scope="scope">
                                            Rp. {{formatPrice(scope.row.total)}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" v-if="dailyStatus != 'verified'">
                                        <template slot-scope="scope">
                                            <a href="#" @click.prevent="actionsTransactions('edit', scope.row)" style="margin-top:3px;margin-right:10px;display:inline-block;">
                                                <img src="~assets/images/icons/edit.png" alt="img-trash">
                                            </a>
                                            <a href="#" @click.prevent="actionsTransactions('delete', scope.row)" style="margin-top:3px;display:inline-block;">
                                                <img src="~assets/images/icons/trash.png" alt="img-trash">
                                            </a>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="mobayar-actions-bottom clearfix">
                                    <div class="total-report clearfix">
                                        <div class="span-report" style="margin-left: 15px;">
                                            <span>Total: </span>
                                            Rp. {{formatPrice(getTotalTransactions)}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-dialog>

                        <!-- Edit Item Transactions -->
                        <el-dialog 
                            :title="nameEditModalTransactions"
                            :visible.sync="modalEditDetailItemTransaction" 
                            width="25%"
                            class="mb-dialog nopadding-right point-modal kepala-regional">
                            <div class="content-dialog detail-pencapaian">
                                <el-form ref="formspoints" label-width="120px" class="demo-ruleForm">
                                    <el-form-item label="Produk">
                                        <div style="line-height: normal;color:#999;">
                                            {{itemDetailEdit.item_code}}<br>
                                            {{itemDetailEdit.item_name}}
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="Harga Satuan">
                                        <el-input type="number" v-model="forms.satuan"></el-input>
                                    </el-form-item>
                                    <el-form-item label="Jumlah">
                                        <el-input-number type="number" v-model="forms.jumlah"></el-input-number>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="updateTransactions()" round class="choose button-white-green" type="primary" id="editTrasactions">Simpan</el-button>
                            </span>
                        </el-dialog>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import JQuery from 'jquery'
    import fullcalendar from 'fullcalendar'
    import FUNCTIONS from '@/functions'
    
    import { 
        faUserTie, 
        faEnvelope, 
        faMobileAlt, 
        faCalendarAlt, 
        faMapMarkerAlt, 
        faUserCheck,
        faNewspaper,
        faCheck
    } from '@fortawesome/free-solid-svg-icons'

    export default {
        name: 'DetailPencapaianSPK',
        data () {
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                baseUrl: process.env.BASE_URL,
                sectionId: this.$route.params.id,
                sectionMonth: this.$route.params.month,
                sectionApiUser: 'user-profile',
                sectionApiAgentAchievement: 'agentAchievement',
                sectionApiTransactions: 'itemTransaction',

                errored: false,
                loadingExcelMonth: false,
                loadingExcelDay: false,

                // for store data after get api
                itemsDataUser: [],
                itemTransactions: [],
                paginatedTransactionsItems: [],
                filteredItems: [],
                itemDetailTransactions: [],
                itemDetailEdit: [],

                // loading variable
                loadingUser: true,
                loadingCalendar: false,
                loadingTransactions: false,
                loadingDetailTransactions: false,

                // functions
                searchQuery: '',
                currentPage: 1,
                perPage: 10,
                totalPage: '',
                dailyStatus: '',

                // modal
                nameModal: '',
                nameModalTransactions: '',
                nameEditModalTransactions: '',
                monthModal: '',
                modalItemTransaction: false,
                modalDetailItemTransaction: false,
                modalEditDetailItemTransaction: false,
                getTRXID: '',
                getTransactionId: '',

                // Fonts
                fontsIcons: {
                    kepalaAgent: faUserTie,
                    email: faEnvelope,
                    phone: faMobileAlt,
                    birthday: faCalendarAlt,
                    places: faMapMarkerAlt,
                    since: faUserCheck,
                    detail: faNewspaper,
                    check: faCheck,
                },

                forms:{
                    satuan:'',
                    jumlah: '',
                }
            }
        },
        mounted () {
            this.initFullCalendar()
            this.getUserByID()
        },
        watch: {
            // searchQuery: function(newValue){
            //     this.itemTransactionsFilter
            // }
        },
        methods: {
            buildUrlUser(){
                return this.apiUrl + this.sectionApiUser + '?userId=' + this.sectionId
            },

            buildUrlItemTransactions(date){
                return this.apiUrl + this.sectionApiAgentAchievement + '/' + this.sectionId + '/' + this.sectionApiTransactions + '?date=' + date
            },

            getUserByID(){
                let url = this.buildUrlUser()
                this.loadingUser = true
                this.axios.get(url)
                .then(response => {
                    this.itemsDataUser = response.data.data
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.loadingUser = false
                })
            },

            getTransactionsByDate(date){
                let url = this.buildUrlItemTransactions(date)
                this.loadingTransactions = true
                this.axios.get(url)
                .then(response => {
                    this.dailyStatus = response.data.daily_status
                    this.itemTransactions = response.data.data
                    this.totalPage = response.data.totalData
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.loadingTransactions = false
                })
            },

            initFullCalendar(){
                var month = this.$moment(this.sectionMonth).format('YYYY-MM-DD')
                var that = this
                JQuery('.fullcalendar').fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay'
                    },
                    eventLimit: true,
                    defaultDate: month,
                    height: 'auto',
                    events: function (start, end, timezone, callback) {
                        let m = that.$moment(start).add(12, 'days');
                        let url = that.apiUrl + 'agentAchievement/inCalendar/' + that.sectionId + '?month=' + m.format('YYYY-MM-DD')
                        that.axios.get(url)
                        .then(response => {
                            if (response.data.status == 'success') {
                                callback(response.data.data);
                            }else{
                                that.$notify.error({
                                    title: 'Ooups!',
                                    message: response.data.message
                                });
                            }
                        })
                        .catch(error => { 
                            this.errored = true
                            that.$notify.error({
                                title: 'Ooups!',
                                message: error
                            });
                        })
                    },
                    eventClick: function(calEvent, jsEvent, view) {
                        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        const date = new Date(that.sectionMonth)
                        that.nameModal = that.itemsDataUser.fullname + '\n' + monthNames[date.getMonth()] + ' ' + date.getFullYear()
                        that.monthModal = that.$moment(calEvent.start).format('YYYY-MM-DD');
                        that.getTransactionsByDate(that.monthModal)
                        that.modalItemTransaction = true
                    },
                    loading: function (bool) {
                        if (bool)
                            JQuery('.fullcalendar').append('<div class="el-loading-mask"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div>');
                        else
                            setTimeout(function(){
                                JQuery('.fullcalendar .el-loading-mask').remove();
                            }, 500)
                        
                    },
                });
            },

            limitChange(limit){
                let that = this
                this.perPage = limit
                this.loadingTransactions = true
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                setTimeout(function(){ that.loadingTransactions = false }, 500)
                event.target.parentNode.classList.add('active')
            },

            pageChange(page){
                let that = this
                this.loadingTransactions = true
                this.currentPage = page
                setTimeout(function(){ that.loadingTransactions = false }, 500)
            },

            getExcel(value){
                if(value == 'Month'){
                    this.loadingExcelMonth = true
                    let url = this.apiUrl + 'exportAgentAchievement/' + this.sectionId + '?type=month&date=' + this.sectionMonth
                    this.axios({
                        url: url,
                        method: 'GET',
                        responseType: 'blob', // important
                    })
                    .then(response => {
                        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        const date = new Date(this.sectionMonth);
                        let dataMonth = monthNames[date.getMonth()] + ' ' + date.getFullYear()
                        const url = window.URL.createObjectURL(new Blob([response.data]))
                        const link = document.createElement('a')
                        link.href = url
                        link.setAttribute('download', "Pencapaian Agen - " + this.itemsDataUser.fullname + " - " + dataMonth + ".xls")
                        document.body.appendChild(link)
                        link.click()
                        this.loadingExcel = false
                    })
                    .catch(error => {
                        FUNCTIONS.notify('error', 'Error', 'Jaringan Bermasalah')
                    })
                }else{
                    this.loadingExcelDay = true
                    let url = this.apiUrl + 'exportAgentAchievement/' + this.sectionId + '?type=date&date=' + this.monthModal
                    this.axios({
                        url: url,
                        method: 'GET',
                        responseType: 'blob', // important
                    })
                    .then(response => {
                        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        const date = new Date(this.monthModal);
                        let dataMonth = monthNames[date.getMonth()] + ' ' + date.getDate()
                        const url = window.URL.createObjectURL(new Blob([response.data]))
                        const link = document.createElement('a')
                        link.href = url
                        link.setAttribute('download', "Pencapaian Agen - " + this.itemsDataUser.fullname + " - " + dataMonth + ".xls")
                        document.body.appendChild(link)
                        link.click()
                        this.loadingExcelDay = false
                    })
                    .catch(error => {
                        FUNCTIONS.notify('error', 'Error', 'Jaringan Bermasalah')
                    })
                }
            },

            verifikasiPerDay(status){
                if(status == 'cek'){
                    let url = this.apiUrl + this.sectionApiAgentAchievement + '/verifyDaily/' + this.itemsDataUser.id
                    this.axios.post(url,{
                        date: this.monthModal,
                        status: 'checked'
                    })
                    .then(response => {
                        if(response.data.status == 'success'){
                            JQuery('.fullcalendar').fullCalendar( 'refetchEvents' )
                            this.getTransactionsByDate(this.monthModal)
                        }
                    })
                    .catch(error => { 
                        console.log(error);
                        this.errored = true
                    })   
                }else{
                    let url = this.apiUrl + this.sectionApiAgentAchievement + '/verifyDaily/' + this.itemsDataUser.id
                    this.axios.post(url,{
                        date: this.monthModal,
                        status: 'verified'
                    })
                    .then(response => {
                        if(response.data.status == 'success'){
                            JQuery('.fullcalendar').fullCalendar( 'refetchEvents' )
                            this.getTransactionsByDate(this.monthModal)
                        }
                    })
                    .catch(error => { 
                        console.log(error);
                        this.errored = true
                    })   
                }
            },

            detailTransactions(value, trx){
                this.getTRXID = trx
                this.getTransactionId = value
                let url = this.apiUrl + this.sectionApiAgentAchievement + '/detailItemTransaction/' + this.getTransactionId
                this.modalDetailItemTransaction = true
                this.loadingDetailTransactions = true
                this.itemDetailEdit = []
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemDetailTransactions = response.data.data
                        this.nameModalTransactions = "Detail Transaksi #" + this.getTRXID + '\n' + this.$moment(this.monthModal).format('DD MMMM YYYY')
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.loadingDetailTransactions = false
                })
            },

            actionsTransactions(status, value){
                this.itemDetailEdit = value
                if(status == 'edit'){
                    this.nameEditModalTransactions = "Item Transaksi" + '\n' + this.getTRXID
                    this.modalEditDetailItemTransaction = true
                    this.forms.satuan = this.itemDetailEdit.price
                    this.forms.jumlah = this.itemDetailEdit.quantity
                }else{
                    this.$confirm('Data Produk Akan Dihapus', 'Anda Yakin?', {
                        confirmButtonText: 'Ya, hapus!',
                        cancelButtonText: 'Batal',
                        type: 'warning'
                    }).then(() => {
                        let url = this.apiUrl + this.sectionApiAgentAchievement + '/deleteItemTransaction/' + this.itemDetailEdit.id
                        this.axios.delete(url)
                        .then(response => {
                            if(response.data.status == 'success'){
                                this.$notify({
                                    title: 'Sukses',
                                    message: 'Data Berhasil di hapus',
                                    type: 'success'
                                });
                                this.detailTransactions(this.getTransactionId, this.getTRXID)
                            }
                        })
                        .catch(error => { 
                            console.log(error);
                            this.errored = true
                        }) 
                    })
                }
            },

            updateTransactions(){
                let loadingform = FUNCTIONS.svgSpinner;
                document.getElementById('editTrasactions').children[0].innerHTML = loadingform
                let url = this.apiUrl + this.sectionApiAgentAchievement + '/editItemTransaction/' + this.itemDetailEdit.id
                this.axios.put(url, {
                    price: this.forms.satuan,
                    qty: this.forms.jumlah
                })
                .then(response => {
                    if(response.data.status == 'success'){
                        this.$notify({
                            title: 'Sukses',
                            message: response.data.message,
                            type: 'success'
                        });
                        this.detailTransactions(this.getTransactionId, this.getTRXID)
                        document.getElementById('editTrasactions').children[0].innerHTML = 'Simpan'
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.modalEditDetailItemTransaction = false
                })
            },

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
        },
        computed: {
            itemTransactionsFilter:function() {
                if(this.searchQuery == ''){
                    return this.itemTransactions.filter((row, index) => {
                        let start = (this.currentPage-1)*this.perPage;
                        let end = this.currentPage*this.perPage;
                        if(index >= start && index < end) return true;
                        this.totalPage = this.itemTransactions.length
                    })
                }else{
                    return this.itemTransactions.filter((row, index) => {
                        this.totalPage = document.querySelector('.detail-pencapaian').children[1].children[2].children[0].children[1].children.length
                        // for(var i=0; i<this.itemTransactions.length; i++) {
                        //     for(var key in this.itemTransactions[i]) {
                        //         return this.itemTransactions[i][key].toLowerCase().indexOf(this.searchQuery.toLowerCase()) != -1
                        //     }
                        // }
                        // console.log(row.user.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1)
                        // console.log(row)
                        return row.trx_id.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1
                    })
                }
            },

            getTotalTransactions: function(){
                let transactions = [];

                this.itemDetailTransactions.forEach(element => {
                    let price = parseInt(element.total)
                    transactions.push(price)
                });

                return transactions.reduce(function(transactions, nume){ return transactions + nume }, 0);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .detail-pencapaian{
        .filterSearching{
            .input-with-icons{
                width: 250px;       
            }
        }
    }
    .getExcelModal{
        .lds-ring{
            div{
                color: #800080;
            }
        }
    }
    .verifiedStatus{
        margin-left: 5px;
        color: #39B54D;
        background: #fff;
        padding:7.5px 23px;
        border: 1px solid #1A892E;
        border-radius: 20px;
        .fontIcons{
            display: inline-block;
            vertical-align: middle;
            position: relative;
            top: -2px;
            margin-left: 3px;
            color: #39B54D;
        }
    }
</style>