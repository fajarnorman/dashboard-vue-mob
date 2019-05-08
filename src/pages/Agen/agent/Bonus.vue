<template>
    <div class="content-wrapper">
        <div id="agent-bonus">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Bonus Agen</h4>
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
                        <div class="filterSearching clearfix">
                            <div class="input-with-icons clearfix">
                                <el-input v-model="searchQuery" class="float-left"></el-input>
                                <img src='~assets/images/icons/search1.png'>
                            </div>
                            <el-date-picker
                                class="date-range-picker"
                                v-model="monthQuery"
                                type="month"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                placeholder="Pick a month">
                            </el-date-picker>
                            <el-select v-model="regionQuery">
                                <el-option value="" label="All Region">All Region</el-option>
                                <el-option 
                                    v-for="(dataRegion, indexRegion) in itemRegional"
                                    :key="indexRegion"
                                    :value="dataRegion.id"
                                    :label="dataRegion.name">{{dataRegion.name}}</el-option>
                            </el-select>
                        </div>
                        <div class="" v-if="itemsData">
                            <div v-if="messagesuccess">
                                <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                            </div>

                            <el-table 
                                :data="itemsData" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                @current-change="handleCurrentChange"
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column prop="fullname" label="Nama Lengkap" width="250"></el-table-column>
                                <el-table-column prop="username" label="Username"></el-table-column>
                                <el-table-column prop="phone_number" label="Nomor Telepon"></el-table-column>
                                <el-table-column prop="region" label="Regional"></el-table-column>
                                <el-table-column label="Total Bonus">
                                    <template slot-scope="scope">
                                        Rp. {{formatPrice(scope.row.total)}}
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
                            <div class="after-checked-section">
                                <div class="page-container">
                                    <div class="page-content">
                                        <div class="sidebar-checked"></div>
                                        <div class="content-wrapper clearfix">
                                            <el-checkbox v-model="afterChecked">{{totalChecked}} akun terpilih</el-checkbox>
                                            <div class="float-right">
                                                <el-button class="button-outline-red" round @click.prevent="deletePost('all', '')">Hapus</el-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <el-dialog 
                        :title="nameModal"
                        :visible.sync="dialogVisible" 
                        width="50%"
                        class="mb-dialog nopadding-right point-modal kepala-regional">
                        <div class="content-dialog">
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-table 
                                        :data="itemDataDetail" 
                                        empty-text="No data available in table"
                                        ref="modalTable"
                                        highlight-current-row
                                        v-loading="loadingForm"
                                        class="mobayar-table">
                                        <el-table-column prop="type" label="Tipe" width="150"></el-table-column>
                                        <el-table-column prop="name" label="Produk" width="200"></el-table-column>
                                        <el-table-column label="Persentase" width="150">
                                            <template slot-scope="scope">
                                                {{scope.row.percentage}}%
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Bonus">
                                            <template slot-scope="scope">
                                                Rp. {{formatPrice(scope.row.bonus_amount)}}
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <div class="mobayar-actions-bottom clearfix">
                                        <div class="total-report clearfix">
                                            <div class="span-report">
                                                <span>Total Bonus: </span>
                                                Rp. {{formatPrice(getBonusTotal)}}
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>                                            
                        </div>
                        <!-- <span slot="footer" class="dialog-footer">
                            <el-button round class="cancel button-outline-black" @click="dialogVisible = false">Cancel</el-button>
                            <el-button @click="assignRegional()" round class="choose button-white-green" type="primary">Simpan</el-button>
                        </span> -->
                    </el-dialog>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import XLSX from 'xlsx'
    import FUNCTIONS from '@/functions'

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    export default {
        name: 'agentBonus',
        data () {
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'agent/bonus',
                sectionApiProduct: 'product',
                sectionApiReference: 'reference',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemiDforDelete: [],
                itemProduk: [],
                itemRegional: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                loadingField: false,
                loadingExcel: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                filterQuery: '',
                totalPage: '',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',
                direction: 'DESC',
                monthQuery: FUNCTIONS.formatDate(firstDay),
                regionQuery: '',
                dialogVisible: false,
                nameModal: '',

                // message variable
                messageerror: '',
                messagesuccess: '',

                // for create, detail, edit forms and validation
                forms:{
                    produk: [],
                },
                rules2:{},
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['agent.bonus'])
        },
        mounted(){
            // Get all Post user
            this.getPosts(this.perPage, this.currentPage, '', this.monthQuery, this.regionQuery)
            this.getReference('RegionalAgen')
            this.getPostProduk()
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
            },
            monthQuery: function(newMonth){
                if(newMonth != null){
                    this.getPosts(this.perPage, this.currentPage, this.searchQuery, newMonth, this.regionQuery)
                }else{
                    this.$notify.info({
                        title: 'Info',
                        message: 'Bulan tidak boleh Kosong'
                    });
                }
            },
            regionQuery: function(newRegion){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.monthQuery, newRegion)
            },

            dialogVisible: function(newValue){
                if(newValue == false){
                    this.$refs.singleTable.setCurrentRow();
                }
            }
        },
        methods: {
            // build url function
            buildUrl (limit, page, search, month, region) {
                return this.apiUrl + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=' + this.direction + '&month=' + month + '&region_code=' + region
            },

            // get all post
            getPosts(num, pg, sch, month, reg){
                let url = this.buildUrl(num, pg, sch, month, reg)
                this.loading = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error'){
                        this.errored = true
                        if(response.data.message == 'Unable to authenticate with invalid API key and token.'){
                            FUNCTIONS.logout('expired-token', response.data.message)
                        }
                    }else{
                        this.itemsData = response.data.data
                        this.totalPage = response.data.totalData
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.loading = false
                })
            },

            // getPost Produk
            getPostProduk(){
                let url = this.apiUrl + this.sectionApiProduct
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error' && response.data.message == "Unable to authenticate with invalid API key and token."){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemProduk = response.data.data                        

                        this.itemsData.forEach(function(element){
                            let name = element.product_name
                            this.itemProduk.splice(this.itemProduk.findIndex(v => v.name === name), 1);
                        }, this)
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.list = this.itemProduk.map(item => {
                        return { value: item.id, label: item.name };
                    });
                })
            },

            // Get Reference
            getReference(category){
                let url = this.apiUrl + this.sectionApiReference + '?category=' + category

                this.axios.get(url)
                .then(response => {
                    if(category == 'RegionalAgen'){
                        this.itemRegional = response.data.data
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.monthQuery, this.regionQuery)
            },

            // Limit Change function
            limitChange(limit, event){
                this.perPage = limit
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.monthQuery, this.regionQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.monthQuery, this.regionQuery)
            }, 300),

            handleCurrentChange(val){
                if(val){
                    this.dialogVisible = true
                    this.loadingForm = true
                    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    const date = new Date(this.monthQuery);
                    this.nameModal = val.fullname + '\n' + monthNames[date.getMonth()] + ' ' + date.getFullYear()

                    let url = this.apiUrl + this.sectionApi + "/" + val.id + '?month=' + this.monthQuery
                    this.axios.get(url)
                    .then(response => {
                        this.itemDataDetail = response.data.data
                    })
                    .catch(error => { 
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => {
                        this.loadingForm = false
                    })
                }
            },

            getExcel(){
                if(this.itemsData.length != 0){
                    let databeforeExcel = [];
                    let exportToExcel = [];

                    let url = this.buildUrl('', this.currentPage, '', this.monthQuery, this.regionQuery)

                    this.loadingExcel = true
                    this.axios.get(url)
                    .then(response => { 
                        databeforeExcel = response.data.data
                    })
                    .catch(error => { this.errored = true })
                    .finally(() => {
                        this.loadingExcel = false

                        databeforeExcel.forEach(function(currentValue, i, arr){
                            exportToExcel.push(
                                {
                                    "Nama Agen" : currentValue.fullname,
                                    "Username" : currentValue.username,
                                    "Nomor Telepon" : currentValue.phone_number,
                                    "Regional" : currentValue.region,
                                    "Bulan" : this.monthQuery,
                                    "Total Bonus" : currentValue.total,
                                }
                            )
                        }, this)

                        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        const date = new Date(this.monthQuery);

                        let filename = "Laporan Bonus Agen - " + monthNames[date.getMonth()] + ' ' + date.getFullYear()

                        var wscols = [
                            {wch:30},
                            {wch:20},
                            {wch:18},
                            {wch:20},
                            {wch:15},
                            {wch:15},
                        ];

                        var datas = XLSX.utils.json_to_sheet(exportToExcel)
                        datas['!cols'] = wscols;
                        var wb = XLSX.utils.book_new()
                        XLSX.utils.book_append_sheet(wb, datas, monthNames[date.getMonth()] + ' ' + date.getFullYear())
                        XLSX.writeFile(wb, filename+'.xlsx')
                    })
                }else{
                    this.$notify.error({
                        title: 'Maaf',
                        message: 'Data Kosong'
                    });
                }
            },

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            },

            getBonusTotal: function(){
                let total = [];

                this.itemDataDetail.forEach(element => {
                    let price = parseFloat(element.bonus_amount)
                    total.push(price)
                });

                return total.reduce(function(total, num){ return total + num }, 0);
            },
        }
    }
</script>