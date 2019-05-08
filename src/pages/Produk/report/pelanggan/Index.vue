<template>
    <div class="content-wrapper">
        <div id="report">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Laporan Daftar Pelanggan</h4>
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
                                <div class="input-with-icons clearfix">
                                    <el-input v-model="searchQuery" class="float-left"></el-input>
                                    <img src='~assets/images/icons/search1.png'>
                                </div>
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
                            </div>

                            <el-table 
                                :data="itemDataDetail" 
                                max-height="530" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                @current-change="handleCurrentChange"
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column prop="dataItem.username" label="Username" width="150"></el-table-column>
                                <el-table-column prop="dataItem.fullname" label="Nama" width="150"></el-table-column>
                                <el-table-column prop="dataItem.address" label="Alamat" width="200"></el-table-column>
                                <el-table-column prop="dataItem.phone_number" label="No. Handphone" width="120"></el-table-column>
                                <el-table-column prop="dataItem.points" label="Saldo Poin" width="100"></el-table-column>
                                <el-table-column prop="ItemPertanian.name" label="Jenis Pertanian" width="120"></el-table-column>
                                <el-table-column prop="itemArea.name" label="Area" width="150"></el-table-column>
                                <el-table-column prop="itemPropinsi.name" label="Provinsi" width="100"></el-table-column>
                                <el-table-column label="Dibuat Oleh" width="100">
                                    <template slot-scope="scope">
                                        <div v-if="(scope.row.dataItem.creator != null)">
                                            {{scope.row.dataItem.creator.fullname}}
                                        </div>
                                        <div v-else>system</div>
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column prop="dataItem.created_by" label="Creator" width="200"></el-table-column> -->
                                <el-table-column prop="dataItem.created_at" label="Tanggal join" width="150"></el-table-column>
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

                            <!-- Detail, Edit, Create Forms -->
                            <div class="base-template-sidebar">
                                <!-- loading bar -->
                                <div class="el-loading-mask" v-show="(loadingForm == true)">
                                    <div class="el-loading-spinner">
                                        <svg viewBox="25 25 50 50" class="circular">
                                            <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                                        </svg>
                                    </div>
                                </div>

                                <div class="content" v-if="itemdataPopup.dataItem">
                                    <header class="clearfix">
                                        <h4>Detail Laporan Pelanggan</h4>
                                        <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                                    </header>
                                    <section>                                        
                                        <el-form status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <h5>Info Laporan</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="Username">
                                                                {{itemdataPopup.dataItem.username}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama">
                                                                {{itemdataPopup.dataItem.fullname}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Alamat">
                                                                {{itemdataPopup.dataItem.address}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="No. Handphone">
                                                                {{itemdataPopup.dataItem.phone_number}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Saldo Poin">
                                                                {{itemdataPopup.dataItem.points}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Jenis Pertanian">
                                                                <div v-if="itemdataPopup.ItemPertanian">{{itemdataPopup.ItemPertanian.name}}</div>
                                                                <div v-else>-</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Area">
                                                                <div v-if="itemdataPopup.itemArea">{{itemdataPopup.itemArea.name}}</div>
                                                                <div v-else>-</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Provinsi">
                                                                <div v-if="itemdataPopup.itemPropinsi">{{itemdataPopup.itemPropinsi.name}}</div>
                                                                <div v-else>-</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Tanggal Join">
                                                                {{itemdataPopup.dataItem.created_at}}
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Dibuat Oleh">
                                                                <div v-if="(itemdataPopup.dataItem.creator != null)">
                                                                    {{itemdataPopup.dataItem.creator.fullname}}
                                                                </div>
                                                                <div v-else>system</div>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Close</el-button>
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
    import JQuery from 'jquery'
    import FUNCTIONS from '@/functions'
    

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    export default {
        name: 'report__daftar_pelanggan',
        data () {
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'reportDgwUsers',
                sectionApiReference: 'reference',
                sectionApiUser: 'user',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemArea: [],
                itemPropinsi: [],
                itemPetani: [],
                dataUserAll: [],
                itemdataPopup: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                loadingExcel: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                direction: '',
                dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
                format: 'yyyy-MM-dd',
                grandTotal: '',
                totalPage: '',
                filterQuery: '',
                supplierQuery: '',

                // for autocomplete
                links: [],
                searchLoading: false,

                // for error counting
                countErrorPost: 0,
                countErrorGetExcel: 0,
                countErrorGetReference: 0,
                countErrorGetUserAll: 0,
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['report.item.customer'])
        },
        mounted () {
            this.getUserAll('')
            this.getPosts(this.perPage, this.currentPage, '', '')
            this.searchUserInit()
            this.getReference('Area')
            this.getReference('Propinsi')
            this.getReference('JenisPertanian')
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult(newQuestion)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
        },
        methods: {
            // Build URL
            buildUrl (limit, page, search, spksearch) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=DESC' + '&spk=' + spksearch
            },

            // Get All Post
            getPosts(num, pg, sch, spk){
                this.itemDataDetail = []
                let url = this.buildUrl(num, pg, sch, spk)
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
                        this.grandTotal = response.data.totalPrice

                        // test
                        let itemsData = this.itemsData
                        let itemDataUser = []
                        
                        itemsData.forEach(function(element, index, array) {
                            let areaID = this.searchIteminArray(element.code_area, this.itemArea)
                            let propinsiID = this.searchIteminArray(element.province_id, this.itemPropinsi)
                            let pertanianID = this.searchIteminArray(element.agriculture_category_id, this.itemPetani)

                            // let userDataurl = this.apiURL + this.sectionApiUser + '/' + element.created_by

                            // this.axios.get(userDataurl)
                            // .then(response => {
                            //     itemDataUser = response.data.data
                            // })
                            // .finally(() => {
                                this.itemDataDetail.push({
                                    "dataItem": element,
                                    "itemArea": areaID,
                                    "itemPropinsi": propinsiID,
                                    "ItemPertanian": pertanianID,
                                    // "ItemDataUser": itemDataUser
                                })
                            // })
                        }, this)
                    }
                })
                .catch(error => { 
                    this.countErrorPost++
                    if(this.countErrorPost >= 3){
                        this.errored = true
                    }else{
                        this.getPosts(this.perPage, this.currentPage, this.searchQuery, '')
                    }
                })
                .finally(() => {
                    this.loading = false
                })
            },

            // Get Reference
            getReference(category){
                let url = this.apiURL + this.sectionApiReference + '?category=' + category
                this.axios.get(url)
                .then(response => {
                    if(category == 'Area'){
                        this.itemArea = response.data.data
                    }else if(category == 'Propinsi'){
                        this.itemPropinsi = response.data.data
                    }else if(category == 'JenisPertanian'){
                        this.itemPetani = response.data.data
                    }
                })
                .catch(error => { 
                    this.countErrorGetReference++
                    if(this.countErrorGetReference >= 3){
                        this.errored = true
                    }else{
                        this.getReference('Area')
                        this.getReference('Propinsi')
                        this.getReference('JenisPertanian')
                    }
                })
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
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, usernameData)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },

            // get All Data SPK
            getUserAll(search){
                let userDataurl = this.apiURL + this.sectionApiUser + '?limit=20&direction=ASC&role=4&order=fullname&page=1&username=' + search
                this.searchLoading = true
                this.axios.get(userDataurl)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.links = response.data.data
                        this.searchLoading = false
                    }
                })
                .catch(error => {
                    // this.countErrorGetUserAll++
                    // if(this.countErrorGetUserAll >= 3){
                    //     this.errored = true
                    // }else{
                    //     this.getUserAll('')
                    // }
                })
                .finally(() => {
                    this.searchLoading = false
                })
            },

            // Get Excel Download
            getExcel(){
                if(this.itemsData.length != 0){
                    let databeforeExcel = [];
                    let exportToExcel = [];

                    let url = this.buildUrl(this.totalPage, this.currentPage, this.searchQuery, this.filterQuery)

                    this.loadingExcel = true
                    this.axios.get(url)
                    .then(response => { 
                        if(response.data.status == 'success'){
                            databeforeExcel = response.data.data

                            this.loadingExcel = false

                            let areaName = ''
                            let propinsiName = ''
                            let pertanianName = ''
                            let createdBy = ''

                            databeforeExcel.forEach(function(currentValue, i, arr){
                                let areaID = this.searchIteminArray(currentValue.code_area, this.itemArea)
                                let propinsiID = this.searchIteminArray(currentValue.province_id, this.itemPropinsi)
                                let pertanianID = this.searchIteminArray(currentValue.agriculture_category_id, this.itemPetani)
                                let createdBy = currentValue.creator == null ? 'system' : currentValue.creator.fullname

                                if(areaID){ areaName = areaID.name }else{ areaName = '-' }
                                if(propinsiID){ propinsiName = propinsiID.name }else{ propinsiName = '-' }
                                if(pertanianID){ pertanianName = pertanianID.name }else{ pertanianName = '-' }

                                exportToExcel.push(
                                    {
                                        'Username' : currentValue.username,
                                        'Nama' : currentValue.fullname,
                                        'Alamat' : currentValue.address,
                                        'No. Handphone' : currentValue.phone_number,
                                        'Saldo Poin' : currentValue.points,
                                        'Jenis Pertanian' : pertanianName,
                                        'Area' : areaName,
                                        'Provinsi' : propinsiName,
                                        'Dibuat Oleh' : createdBy,
                                        'Tanggal Join' : currentValue.created_at,
                                    }
                                )
                            }, this)

                            let filename = "daftar-pelanggan-" + this.dateRange[0] + "-to-" + this.dateRange[1]

                            var wscols = [
                                {wch:30},
                                {wch:20},
                                {wch:40},
                                {wch:20},
                                {wch:20},
                                {wch:20},
                                {wch:20},
                                {wch:20},
                                {wch:20},
                                {wch:20},
                            ];

                            var datas = XLSX.utils.json_to_sheet(exportToExcel)
                            datas['!cols'] = wscols;
                            var wb = XLSX.utils.book_new()
                            XLSX.utils.book_append_sheet(wb, datas, 'Laporan Daftar Pelanggan')
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

            // search in array
            searchIteminArray(nameKey, myArray){
                for (var i=0; i < myArray.length; i++) {
                    if (myArray[i].id === nameKey) {
                        return myArray[i];
                    }
                }
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery)
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(newsearch){
                this.getPosts(this.perPage, this.currentPage, newsearch, this.filterQuery)
            }, 300),

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },

            // function for table click for edit and detail
            handleCurrentChange(val){
                if(val){
                    document.querySelector('.base-template-sidebar').classList.add('showing');
                    document.querySelector('.backdrop').classList.add('show');
                    document.querySelector('body').classList.add('no-scroll');
                    this.itemdataPopup = val
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
        },
        computed: {
            // Get Total Price per showing data
            getPriceTotal: function(){
                let total = [];

                this.itemsData.forEach(element => {
                    let price = parseFloat(element.total)
                    total.push(price)
                });

                return total.reduce(function(total, num){ return total + num }, 0);
            },

            parseInt: function(value){
                return parseInt(value)
            }
        },
        beforeDestroy(){
            this.itemsData = []
            this.itemDataDetail = []
            this.itemArea = []
            this.itemPropinsi = []
            this.itemPetani = []
            this.dataUserAll = []
            this.itemdataPopup = []
            this.dateRange = []
            this.links = []
            this.searchQuery = ''
            this.grandTotal = ''
            this.totalPage = ''
            this.filterQuery = ''
            this.supplierQuery = ''
        }
    }
</script>

<style>

</style>
