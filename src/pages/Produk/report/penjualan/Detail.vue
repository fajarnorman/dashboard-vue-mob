<template>
    <div class="content-wrapper">
        <div id="report-penjualan">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Laporan Detail Penjualan <span style="display:block;font-size:16px;margin-top:5px;">Periode : {{dateRange[0]}} - {{dateRange[1]}}</span></h4>                        
                        <div class="add-actions">
                            <a @click.prevent="getExcel" class="float-right">
                                <el-button class="button-outline-green" round>
                                    <img src="~assets/images/icons/download-new.png" v-if="(loadingExcel == false)"> 
                                    <div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export
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
                        <div class="" v-if="itemsData">
                            <div class="filterSearching clearfix">
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
                                        <input type="text" v-model="filterQuery" class="el-input__inner selectUser" placeholder="Select SPK">
                                        <img src="~assets/images/icons/arrow-down.png">
                                        <div class="dropdown-filterable">
                                            <ul>
                                                <div v-if="searchLoading == true">
                                                    <li><a href="#" style="text-align:center;">Loading Data</a></li>
                                                </div>
                                                <div v-else>
                                                    <div v-if="links.length !== 0">
                                                        <li><a href="#" @click.prevent="filterByUser('')">All SPK</a></li>
                                                        <li v-for="(itemUser, indexUser) in links"
                                                        :key="indexUser"
                                                        :label="itemUser.fullname"
                                                        :value="itemUser.username"><a href="#" @click.prevent="filterByUser(itemUser)">{{itemUser.fullname}} ({{itemUser.username}})</a></li>
                                                    </div>
                                                    <div v-else><li><a href="#" style="text-align:center;">No data</a></li></div>
                                                </div>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <el-select
                                    v-model="areaQuery"
                                    placeholder="Area SPK">
                                    <el-option
                                        v-for="(itemArea, indexUser) in linksArea"
                                        :key="indexUser"
                                        :label="itemArea.name"
                                        :value="itemArea.id">
                                        {{itemArea.name}}
                                    </el-option>
                                </el-select>
                            </div>

                            <el-table 
                                :data="itemsOtherData"  
                                empty-text="No data available in table"
                                ref="singleTable"
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column prop="trx_id" label="No. Invoice" width="200"></el-table-column>
                                <el-table-column prop="created_at" label="Tgl. Invoice" align="center" width="120"></el-table-column>
                                <el-table-column label="No Induk SPK" width="135">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.created_by !== '' || scope.row.created_by !== null">
                                            {{scope.row.created_by.username}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Nama SPK" width="150">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.created_by !== '' || scope.row.created_by !== null">
                                            {{scope.row.created_by.fullname}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="No Nota" align="center" width="110">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.note">{{scope.row.note}}</div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Nama Barang" width="140">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.details">{{scope.row.details.item.display_name}}</div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Jenis Barang" width="140">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.details">
                                            <div v-if="scope.row.details.item">
                                                <div v-if="scope.row.details.item.product">
                                                    <div v-if="scope.row.details.item.product.category_product">{{scope.row.details.item.product.category_product.name}}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Qty" align="center">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.details">{{scope.row.details.qty}}</div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Harga Barang" width="180">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.details">Rp. {{formatPrice(scope.row.details.price)}}</div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Total Barang" width="180">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.details">Rp. {{formatPrice(scope.row.details.price * scope.row.details.qty)}}</div>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <div class="mobayar-actions-bottom clearfix">
                                <div class="total-report clearfix" style="margin-bottom:0;padding-bottom:0;border-bottom:0;">
                                    <div class="span-report">
                                        <span>Grand Total: </span>
                                        Rp. {{formatPrice(getGrandTotal)}}
                                    </div>
                                </div>
                            </div>

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
    
    import JQuery from 'jquery'

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    export default {
        name: 'report__mutasi_saldo',
        data () {
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'reportDgwSalesDetail',
                sectionApiUser: 'user',
                sectionApiReference: 'reference',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemsOtherData: [],
                itemsOtherData2: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                loadingExcel: false,
                searchLoading: false,
                searchLoading2: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                direction: '',
                dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
                format: 'yyyy-MM-dd',
                grandTotal: '',
                totalPage: '',
                filterQuery: '',
                areaQuery: '',
                supplierQuery: '',
                getUserTotalData: '',

                // for autocomplete
                links: [],
                linksArea: [],
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['report.item.detail'])
        },
        mounted () {
            this.getUserAll('')
            this.getAreaAll('')
            this.getPosts(this.dateRange[0], this.dateRange[1], this.filterQuery, this.areaQuery)
            this.searchUserInit()
        },
        watch: {
            areaQuery: function(newValue){
                this.getPosts(this.dateRange[0], this.dateRange[1], this.filterQuery, newValue)
            },
            dateRange: function(newdaterange){
                this.getPosts(newdaterange[0], newdaterange[1], this.filterQuery, this.areaQuery)
            }
        },
        methods: {
            // Build URL
            buildUrl (datefrom, dateto, username, area) {
                return this.apiURL + this.sectionApi + '?direction=DESC&dateFrom=' + datefrom + '&dateTo=' + dateto + '&spk=' + username + '&code_area=' + area
            },

            // Get All Post
            getPosts(dtfrom, dtto, stat, area){
                let url = this.buildUrl(dtfrom, dtto, stat, area)
                this.loading = true
                this.itemsOtherData = []
                this.axios.get(url)
                .then(response => { 
                    if(response.data.status == 'error'){
                        // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemsData = response.data.data 
                        this.totalPage = response.data.totalData
                        this.grandTotal = response.data.totalPrice

                        this.itemsData.forEach(element => {
                            element.details.forEach(element2 => {
                                this.itemsOtherData.push({
                                    "id": element.id,
                                    "trx_id": element.trx_id,
                                    "user_id": element.user_id,
                                    "note": element.note,
                                    "status": element.status,
                                    "created_by": element.created_by,
                                    "deleted_by": element.deleted_by,
                                    "created_at": element.created_at,
                                    "deleted_at": element.deleted_at,
                                    "deleted_at": element.deleted_at,
                                    "point": element.point,
                                    "details": element2
                                })
                            })
                            // let sum = []
                            // element.details.forEach(element2 => {
                            //     let price2 = parseFloat(element2.price)
                            //     sum.push(price2)
                            // })
                            // let sumArray = sum.reduce(function(accumulator, currentValue){
                            //     return accumulator + currentValue
                            // })
                            // this.itemsOtherData.push({
                            //     "itemData": element,
                            //     "TotalDataDetail": sumArray
                            // })
                        })
                    }
                })
                .catch(error => { this.errored = true })
                .finally(() => this.loading = false)
            },

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },

            // Get Excel Download
            getExcel(){
                let getDateMonth_1 = new Date(this.dateRange[0]).getMonth() + 1
                let getDateMonth_2 = new Date(this.dateRange[1]).getMonth() + 1
                let getYear_1 = new Date(this.dateRange[0]).getFullYear()
                let getYear_2 = new Date(this.dateRange[1]).getFullYear()

                if((getYear_1 - getYear_2) == 0){
                    if((getDateMonth_1 - getDateMonth_2) == 0){
                        let databeforeExcel = [];
                        let datafterExcel  = [];
                        let exportToExcel = [];
                        let that = this
                        this.loadingExcel = true

                        setTimeout(function(){
                            that.loadingExcel = false
                            let noIndukSPK, nameSPK, nameBarang, jenisBarang, qtyBarang, priceBarang

                            that.itemsOtherData.forEach(function(currentValue, i, arr){
                                noIndukSPK = currentValue.created_by == null ? '-' : currentValue.created_by.username
                                nameSPK = currentValue.created_by == null ? '-' : currentValue.created_by.fullname
                                nameBarang = currentValue.details == null ? '-' : currentValue.details.item.display_name
                                jenisBarang = currentValue.details == null ? '-' : currentValue.details.item.product.category_product.name
                                qtyBarang = currentValue.details == null ? '-' : currentValue.details.qty
                                priceBarang = currentValue.details == null ? '-' : currentValue.details.price
                                exportToExcel.push(
                                    {
                                        'No Invoice' : currentValue.trx_id,
                                        'Tgl Invoice' : currentValue.created_at,
                                        'Nomor Induk SPK' : noIndukSPK,
                                        'Nama SPK' : nameSPK,
                                        "Nama Barang": nameBarang,
                                        "Jenis Barang": jenisBarang,
                                        "Jumlah Barang": qtyBarang,
                                        "Harga barang": parseInt(priceBarang),
                                        "Total": parseInt(priceBarang) * qtyBarang
                                    }
                                )
                            })

                            let filename = "transaksi-detail-penjualan-" + that.dateRange[0] + "-to-" + that.dateRange[1]

                            var wscols = [
                                {wch:25},
                                {wch:20},
                                {wch:20},
                                {wch:30},
                                {wch:20},
                                {wch:20},
                                {wch:15},
                                {wch:20},
                                {wch:20},
                            ];

                            var datas = XLSX.utils.json_to_sheet(exportToExcel)
                            datas['!cols'] = wscols;
                            var wb = XLSX.utils.book_new()
                            XLSX.utils.book_append_sheet(wb, datas, 'Laporan Detail Penjualan')
                            XLSX.writeFile(wb, filename+'.xlsx')
                        }, 1000)
                    }else{
                        this.$notify.error({
                            title: 'Maaf',
                            message: 'Export tidak boleh lebih dari 1 bulan'
                        });
                    }
                }else{
                    this.$notify.error({
                        title: 'Maaf',
                        message: 'Export tidak boleh lebih dari 1 bulan'
                    });
                }

            },

            // function for table click for edit and detail
            handleCurrentChange(val){
                if(val){
                    document.querySelector('.base-template-sidebar').classList.add('showing');
                    document.querySelector('.backdrop').classList.add('show');
                    document.querySelector('body').classList.add('no-scroll');
                    this.itemDataDetail = val
                }
            },

            // close modal function
            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.$refs.singleTable.setCurrentRow(row);
                this.$refs.formsvalid.resetFields();
            },

            searchUserInit(){
                let that = this
                setTimeout(function(){
                    document.querySelector('.selectUser').addEventListener('click', function(){
                        if(document.querySelector('.dropdown-filterable') !== null){
                            document.querySelector('.dropdown-filterable').classList.add('dropdown-showing')
                        }
                    });
                    document.addEventListener('click', function(e){
                        if(!JQuery(e.target).closest('.selectUser, .dropdown-filterable').length){
                            if(document.querySelector('.dropdown-filterable') !== null){
                                document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
                            }
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
                    this.filterQuery = ''
                    this.getUserAll('')
                }else{
                    usernameData = user.username
                }
                document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
                this.getPosts(this.dateRange[0], this.dateRange[1], usernameData, this.areaQuery)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },

            // get All Data SPK
            getUserAll(search){
                let userDataurl = this.apiURL + this.sectionApiUser + '?limit=20&role=4&direction=ASC&order=fullname&page=1&username=' + search
                this.searchLoading = true
                this.axios.get(userDataurl)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.links = response.data.data
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

            getAreaAll(search){
                let userDataurl = this.apiURL + this.sectionApiReference + '?direction=ASC&category=Area&search=' + search
                this.searchLoading2 = true
                this.axios.get(userDataurl)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.linksArea = response.data.data
                        this.searchLoading2 = false
                    }
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                    this.searchLoading2 = false
                })
            }

        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            },
            getGrandTotal: function(){
                let total = [];

                this.itemsOtherData.forEach(element => {
                    let price = parseFloat(element.details.qty) * parseFloat(element.details.price)
                    total.push(price)
                });

                return total.reduce(function(total, num){ return total + num }, 0);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .laporan-detail-head{
        text-align: center;
        margin-top: 25px;
        margin-bottom: 25px;
        h4{
            margin-bottom: 5px;
        }
    }
    .mobayar-table{
        table{
            width: 100%;
        }
    }
</style>