<template>
    <div class="content-wrapper">
        <div id="userotp">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4>User OTP</h4>
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
                        <div class="">
                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column prop="phone_number" label="Phone" width="120"></el-table-column>
                                <el-table-column prop="code" label="OTP" width="180"></el-table-column>
                                <el-table-column prop="type" label="Type"></el-table-column>
                                <el-table-column prop="created_at" label="Date"></el-table-column>
                                <el-table-column prop="expired_at" label="Expired"></el-table-column>
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
                                    <span>Showing results 1 - 10 of {{parseInt(totalPage)}}</span>
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
        name: 'userotp',
        data () {
            return{
                apiURL: process.env.ROOT_API,
                sectionApi: 'userOtp',
                itemsData: [],
                searchQuery: '',
                loading: true,
                errored: false,
                currentPage: 1,
                perPage: 10,
                totalPage: ''
            }
        },
        created() {
            FUNCTIONS.checkPermissions(this.$dataRole['user.otp'])
        },
        mounted(){
            this.getPosts(this.perPage, this.currentPage, '')
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
            }
        },
        methods: {
            buildUrl (limit, page, search) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search
            },

            // get all post
            getPosts(section, num, pg, sch){
                let url = this.buildUrl(section, num, pg, sch)
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
        }
    }
</script>