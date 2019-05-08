<template>
    <div class="content-wrapper">
        <div id="userupgraderequest">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4>User Upgrade Request</h4>
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
                        <!-- <pre>{{itemsData}}</pre> -->
                        <div class="">
                            <div class="filterstatus">
                                <el-tabs v-model="filterQuery">
                                    <el-tab-pane label="Semua Status" name=""></el-tab-pane>
                                    <el-tab-pane label="Verified" name="verified"></el-tab-pane>
                                    <el-tab-pane label="Waiting" name="waiting"></el-tab-pane>
                                    <el-tab-pane label="Rejected" name="rejected"></el-tab-pane>
                                </el-tabs>
                            </div>

                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                v-loading="loading"
                                @current-change="handleCurrentChange"
                                class="mobayar-table">
                                <el-table-column label="Username" width="200">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.user">
                                            {{scope.row.user.username}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="fullname" label="Full Name" width="180"></el-table-column>
                                <el-table-column prop="identity_number" label="No. Identity"></el-table-column>
                                <el-table-column label="Upgrade Status">
                                    <template slot-scope="scope">
                                        <span v-if="(scope.row.status == 'verified')" class="badge inline success">{{scope.row.status}}</span>
                                        <span v-else-if="(scope.row.status == 'waiting')" class="badge inline pending">{{scope.row.status}}</span>
                                        <span v-else-if="(scope.row.status == 'rejected')" class="badge inline failed">{{scope.row.status}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="created_at" label="Date"></el-table-column>
                            </el-table>

                            <div class="mobayar-actions-bottom clearfix">
                                <div class="showing-page float-left">
                                    <span>View</span>
                                    <ul>
                                        <li class="active"><a href="#" @click.prevent="limitChange('10', $event)">10</a></li>
                                        <li><a href="#" @click.prevent="limitChange('15', $event)">25</a></li>
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
    import FUNCTIONS from '@/functions'

    export default {
        name: 'userUpgrade',
        data () {
            return{
                apiURL: process.env.ROOT_API,
                sectionApi: 'userUpgrades',
                itemsData: [],
                searchQuery: '',
                filterQuery: '',
                loading: true,
                errored: false,
                currentPage: 1,
                perPage: 10,
                totalPage: ''
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['users.upgraderequestlist'])
        },
        mounted(){
            // this.getPosts(this.perPage, this.currentPage, '')
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
            filterQuery: function(newValue){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
                document.querySelector('.el-pagination').children[1].children[0].click()
            }
        },
        methods: {
            buildUrl (limit, page, search) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&status=' + this.filterQuery
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
                this.loading = true
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                this.loading = true
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                let vm = this
                let searchUrl = this.buildUrl(this.perPage, '', this.searchQuery)
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

            handleCurrentChange(val){
                if(this.$dataRole['users.upgraderequestdetail']){
                    if(val){
                        this.$router.push({ name: 'userUpgradeRequestDetail', params: { id: val.id }})
                    }
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: 'Anda tidak punya akses'
                    });
                }
            },
        }
    }
</script>