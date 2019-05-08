<template>
    <div class="content-wrapper">
        <div id="permission">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Permission</h4>
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
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column prop="id" label="ID" width="50"></el-table-column>
                                <el-table-column prop="name" label="Name" width="600"></el-table-column>
                                <el-table-column prop="updated_at" label="Last Update"></el-table-column>
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
    import FUNCTIONS from '@/functions'
    
    export default {
        name: 'permission',
        data () {
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'permission',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                direction: '',
                dateRange: '',
                format: 'yyyy-MM-dd',
                grandTotal: '',
                totalPage: '',
                filterQuery: '',
                supplierQuery: '',

                // message variable
                messageerror: '',
                messagesuccess: '',
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['permission.list'])
        },
        mounted () {
            this.getPosts('')
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
            },
        },
         methods: {
            // Build URL
            buildUrl (search) {
                return this.apiURL + this.sectionApi + "?limit=" + this.perPage + "&page=" + this.currentPage + '&search=' + search + '&direction=ASC&order=id'
            },

            // Get All Post
            getPosts(search){
                let url = this.buildUrl(search)
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
                .catch(error => { this.errored = true })
                .finally(() => this.loading = false)
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.searchQuery)
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.searchQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.searchQuery)
            }, 300),

            handleCurrentChange(val){
                if(this.$dataRole['permission.edit']){
                    if(val){
                        this.$router.push({ name: 'permission_edit', params: { id: val.id }})
                    }
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: 'Anda tidak punya akses'
                    });
                }
            },
         },
    }
</script>

<style>

</style>
