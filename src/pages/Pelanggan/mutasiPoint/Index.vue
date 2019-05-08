<template>
    <div class="content-wrapper">
        <div id="mutation-point">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Mutasi Poin</h4>
                        <div class="add-actions float-right">
                            <a @click.prevent="getExcel" href="#">
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
                        </div>

                        <div class="" v-if="itemsData">
                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                @current-change="handleCurrentChange"
                                highlight-current-row
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column prop="username" label="Username"></el-table-column>
                                <el-table-column prop="email" label="Email"></el-table-column>
                                <el-table-column prop="fullname" label="Full Name"></el-table-column>
                                <el-table-column prop="phone_number" label="Phone Number"></el-table-column>
                                <el-table-column prop="referer" label="Referer"></el-table-column>
                                <el-table-column prop="points" label="User Point Table"></el-table-column>
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
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import XLSX from 'xlsx'
    import FUNCTIONS from '@/functions'
    

    export default {
        name: 'mutasi-point',
        data () {
            return{
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'user',
                role: '',

                 // for store data after get api
                itemsData: [],
                itemDataDetail: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingExcel: false,
                loadingForm: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                filterQuery: '',
                totalPage: '',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['points.mutation'])
        },
        mounted () {
            // Get all Post user
            this.getPosts(this.perPage, this.currentPage, '')
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
            },
        },
        methods: {
            // build url function
            buildUrl (limit, page, search) {
                return this.apiUrl + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&role=' + this.role + '&order=points&direction=DESC'
            },

            // get all post
            getPosts(num, pg, sch){
                let url = this.buildUrl(num, pg, sch)
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
                .finally(() => this.loading = false)
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
            },

            // Limit Change function
            limitChange(limit, event){
                this.perPage = limit
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                let vm = this
                let searchUrl = this.buildUrl(this.perPage, this.currentPage, this.searchQuery)
                this.loading = true
                this.axios.get(searchUrl)
                .then(function (response) {
                    vm.itemsData = response.data.data
                    vm.totalPage = response.data.totalData
                })
                .catch(function (error) {
                    console.log(error);
                    vm.errored = true
                }).finally(() => this.loading = false)
            }, 300),

            // function for table click for edit and detail
            handleCurrentChange(val){
                if(val){
                    this.formsType = 'edit'
                    this.loadingForm = true

                    this.$router.push({ name: 'mutasi-point-detail', params: { id: val.id }})
                }
            },

            // close modal function
            closeModal(row){
                this.$refs.singleTable.setCurrentRow(row);
                this.$refs.formsvalid.resetFields();
            },

            // Get Excel 
            getExcel(){
                let databeforeExcel = [];
                let exportToExcel = [];

                let url = this.buildUrl(this.totalPage, this.currentPage, '')

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
                                'Full Name' : currentValue.fullname,
                                'Username' : currentValue.username,
                                'Email' : currentValue.email,
                                'Phone Number' : currentValue.phone_number,
                                'Referer' : currentValue.referer,
                                'Points' : currentValue.points,
                            }
                        )
                    })

                    let filename = "user-listing-point"

                    var wscols = [
                        {wch:30},
                        {wch:20},
                        {wch:40},
                        {wch:20},
                        {wch:20},
                        {wch:20},
                    ];

                    var datas = XLSX.utils.json_to_sheet(exportToExcel)
                    datas['!cols'] = wscols;
                    var wb = XLSX.utils.book_new()
                    XLSX.utils.book_append_sheet(wb, datas, 'User Listing Point')
                    XLSX.writeFile(wb, filename+'.xlsx')
                })
            },
        }
    }
</script>