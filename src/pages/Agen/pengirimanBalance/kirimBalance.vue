<template>
    <div class="content-wrapper">
        <div id="kode-promo">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Kirim Balance</h4>
                    </div>
                </div>
            </div>
            <div class="content">
                <section v-if="errored">
                    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
                </section>
                <section v-else>
                    <div>
                        <div class="grand-total">
                            <span>Kirim balance ke:</span>
                        </div>

                        <div class="filterSearching clearfix">
                            <div class="groupmetode">
                                <div>
                                    <span>Pilih Group</span>
                                    <el-select v-model="sendGroup" style="margin-right: 15px;">
                                        <el-option value="" label="SELECT A GROUP">SELECT A GROUP</el-option>
                                        <el-option v-for="(dataGroup, indexGroup) in itemsBalanceData"
                                            :key="indexGroup"
                                            :label="dataGroup.name"
                                            :value="dataGroup.id">{{dataGroup.name}}</el-option>
                                    </el-select>
                                </div>
                                <div class="input-desc">
                                    <span>Deskripsi</span>
                                    <el-input v-model="descriptionGroup"></el-input>
                                </div>
                                <div>
                                    <el-button 
                                        class="button-white-green" 
                                        round 
                                        style="margin-left: 10px;float:left;"
                                        @click.prevent="sendBalance()">Kirim</el-button>
                                </div>
                            </div>
                        </div>

                        <div class="" v-if="itemsData">

                            <div v-if="messagesuccess">
                                <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                            </div>

                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                highlight-current-row
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column type="index" label="No" width="55"></el-table-column>
                                <el-table-column prop="user.username" label="Username"></el-table-column>
                                <el-table-column prop="created_by_user.username" label="Sender"></el-table-column>
                                <el-table-column label="Amount">
                                    <template slot-scope="scope">
                                        {{formatPrice(scope.row.amount)}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="created_at" label="Created At"></el-table-column>
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
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import FUNCTIONS from '@/functions'
    

    export default {
        name: 'sendBalance',
        data () {
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'sendBalance',
                sectionApiBalanceGroup: 'sendBalanceGroup',

                // for store data after get api
                itemsData: [],
                itemsBalanceData: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                format: 'yyyy-MM-dd',
                formatTime: 'HH:mm',
                formatTimeValue: 'HH:mm:ss',
                totalPage: '',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',
                sendGroup: '',
                descriptionGroup: 'Bonus saldo dari Admin',
                countManager: '',

                // message variable
                messageerror: '',
                messagesuccess: '',

                testing: '',
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['manager.list'])
        },
        mounted () {
            this.getPosts(this.perPage, this.currentPage, '')
            this.getGroup()


            let string = '1. Balance bertambah 100 untuk adm_jambi'+
                            '2. Balance bertambah 100 untuk hello'+
                            '3. Balance bertambah 100 untuk harunnorman'+
                            '4. Balance bertambah 100 untuk willyanto_ws';

            this.testing = string
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
            }
        },
        methods: {
            // build url function
            buildUrl (limit, page, search) {
                return this.apiUrl + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=DESC'
            },

            // Get All Post
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

            getGroup(){
                let url = this.apiUrl + this.sectionApiBalanceGroup
                this.axios.get(url)
                .then(response => {
                    this.itemsBalanceData = response.data.data
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
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
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
            }, 300),

            // Submit Button
            submitSave(formName, formtype){
                let loadingform = FUNCTIONS.svgSpinner;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formtype == 'save'){
                            document.getElementById('save').children[0].innerHTML = loadingform
                            let urlv = this.apiUrl + this.sectionApi
                            this.axios.post(urlv, {
                                name: this.forms.name,
                                status: this.forms.status
                            })
                            .then(response => {
                                document.getElementById('save').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = response.data.data.name + " Berhasil ditambahkan."
                                    this.getPosts(this.perPage, this.currentPage, '')
                                    this.closeModal();
                                }
                            })
                            .catch(error => { 
                                console.log(error)
                            })
                        }else{
                            document.getElementById('save-edit').children[0].innerHTML = loadingform
                            let urlv = this.apiUrl + this.sectionApi + '/' + this.itemDataDetail.id
                            this.axios.put(urlv, {
                                name: this.forms.name,
                                status: this.forms.status
                            })
                            .then(response => {
                                document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = response.data.data.name + " Berhasil diubah."
                                    this.getPosts(this.perPage, this.currentPage, '')
                                    this.closeModal();
                                }
                            })
                            .catch(error => { 
                                // console.log(error);
                            })
                        }
                    } else {
                        document.getElementById('save').children[0].innerHTML = 'Simpan'
                        document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },

            getPostbyUserId(id){
                this.messagesuccess = ''
                let url = this.apiUrl + this.sectionApiBalanceGroup + '/users/' + id
                this.loadingForm = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.code == 500){
                        this.$notify.error({
                            title: 'Gagal',
                            message: response.data.message
                        });
                    }else{
                        this.countManager = response.data.data
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.$confirm('Anda akan memberikan balance kepada ' + this.countManager.length + ' orang user. Apakah anda yakin?', 'Kirim Balance', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        let url = this.apiUrl + this.sectionApi
                        this.axios.post(url,{
                            group_id: this.sendGroup,
                            description: this.descriptionGroup,
                        })
                        .then(response => {
                            this.messagesuccess = response.data.data.managers
                        })
                        .catch(error => { 
                            console.log(error);
                            this.errored = true
                        })
                        .finally(() => {
                            this.getPosts(this.perPage, this.currentPage, '')
                        })
                    })
                })
            },

            sendBalance(){
                if(this.sendGroup != ''){
                    this.getPostbyUserId(this.sendGroup)
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: 'Group tidak boleh kosong'
                    });
                }
            },
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            }
        }
    }
</script>