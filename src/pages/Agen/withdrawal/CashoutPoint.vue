<template>
    <div class="content-wrapper">
        <div id="withdrawal-review">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Cash Out Point</h4>
                        <div class="add-actions">
                            <a @click.prevent="Create" class="float-right">
                                <el-button class="button-white-green" round>
                                    <i class="icon-plus3"></i> Create
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
                        <div class="">
                            <div v-if="messagesuccess">
                                <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                            </div>
                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                @current-change="handleCurrentChange"
                                @selection-change="handleSelectionChange"
                                ref="singleTable"
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column type="selection" width="55"></el-table-column>
                                <el-table-column label="User" prop="fullname" width="190"></el-table-column>
                                <el-table-column label="Username" prop="username" width="190"></el-table-column>
                                <el-table-column label="Phone" prop="phone_number" width="150"></el-table-column>
                                <el-table-column label="Location">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.agent_location">
                                            {{scope.row.agent_location.address}}
                                        </div>
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

                                <div class="content">
                                    <header class="clearfix">
                                        <h4>{{formsName}}</h4>
                                        <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                                    </header>
                                    <section>
                                        <div v-show="(messageerror != '')">
                                            <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                                        </div>
                                        <el-form ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details" v-if="formsType == 'create'">
                                                <h5>Tambah Cash Out Point</h5>
                                                <div class="forms-details">
                                                    <agent-forms ref="agentForms"></agent-forms>
                                                </div>
                                            </div>
                                            <div class="item-forms-details" v-else>
                                                <h5>Cash Out Point Info</h5>
                                                <div class="forms-details">
                                                    <edit-agent-forms ref="editAgentForms" :iddata="dataId"></edit-agent-forms>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['user.delete']" class="button-outline-black" id="trash" @click.prevent="deletePost('once', dataId)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['user.edit']" class="button-white-green" id="save-edit" @click.prevent="submitSave('edit')">Simpan</el-button>
                                    <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('save')">Simpan</el-button>
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
    

    import AgentForms from './CreateAgentForms.vue'
    import EditAgentForms from './editAgentForms.vue'

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    export default {
        name: 'withDrawalCashoutPoint',
        data () {
            return{
                apiURL: process.env.ROOT_API,
                sectionApi: 'cashoutpoint',
                itemsData: [],
                searchQuery: '',
                loading: true,
                loadingForm: false,
                loadingSelect: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                totalPage: '',
                afterChecked: true,
                totalChecked: '',
                multipleSelection: '',
                itemiDforDelete: '',
                formsType: '',
                formsName: '',
                loadingForm: false,

                // message variable
                messageerror: '',
                messagesuccess: '',

                dataId: '',
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['cashoutpoint.list'])
        },
        mounted() {
            this.getPosts(this.perPage, this.currentPage, '')
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
        },
        methods: {
            buildUrl (limit, page, search) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&order=fullname&direction=ASC'
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

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
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

            handleCurrentChange(val){
                if(val){
                    this.formsType = 'edit'
                    this.formsName = 'Edit Cash Out Point'
                    this.dataId = val.id
                    this.loadingForm = true
                    document.querySelector('.base-template-sidebar').classList.add('showing');
                    document.querySelector('.backdrop').classList.add('show');
                    document.querySelector('body').classList.add('no-scroll');
                    let that = this
                    setTimeout(function(){
                        that.$refs.editAgentForms.getPostCashoutPoint()
                        setTimeout(function(){
                            that.loadingForm = false
                        }, 500)
                    }, 500)
                }
            },

            // function for checkbox multipe select
            handleSelectionChange(val) {
                if(val.length != 0){
                    document.querySelector('.after-checked-section').classList.add('active')
                }else{
                    document.querySelector('.after-checked-section').classList.remove('active')
                }
                this.multipleSelection = val
                this.totalChecked = val.length
                this.itemiDforDelete = val
            },

            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.$refs.singleTable.setCurrentRow(row);
                if(this.formsType == 'create'){
                    this.$refs.agentForms.agentForms = []
                }
            },

            Create(){
                this.formsType = 'create'
                this.formsName = 'Cash Out Point Baru'
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
                this.$refs.agentForms.addField()
            },

            submitSave(formtype){
                this.messagesuccess = ''
                this.messageerror = ''
                let loadingform = FUNCTIONS.svgSpinner;
                if(formtype == 'save'){
                    let that = this
                    let dataAgentForms = this.$refs.agentForms.agentForms
                    let agentId = []
                    let latitute = []
                    let longitute = []
                    let address = []

                    let countError = []

                    if(dataAgentForms.length != 0){
                        dataAgentForms.forEach(function(element){
                            agentId.push(element.userDataId)
                            latitute.push(element.latituteData)
                            longitute.push(element.longituteData)
                            address.push(element.addressData)

                            if(element.userDataId == ''){ countError.push('error') }
                            if(element.latituteData == ''){ countError.push('error') }
                        });

                        if(countError.length == 0){
                            document.getElementById('save').children[0].innerHTML = loadingform
                            let urlv = this.apiURL + this.sectionApi
                            this.axios.post(urlv,{
                                user_id: agentId,
                                latitude: latitute,
                                longitude: longitute,
                                address: address,
                            })
                            .then(response => {
                                document.getElementById('save').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = response.data.message
                                    this.getPosts(this.perPage, this.currentPage, '')
                                    this.closeModal();
                                    this.$refs.agentForms.agentForms = []
                                }
                            })
                            .catch(error => { 
                                console.log(error)
                            })
                        }else{
                            this.$notify.error({
                                title: 'Error',
                                message: 'Mohon cek lagi data anda dan lengkapi kembali'
                            });
                        }
                    }else{
                        this.$notify.error({
                            title: 'Error',
                            message: 'Cashout Point Tidak boleh kosong'
                        });
                    }
                }else{
                    let editdataAgentForms = this.$refs.editAgentForms.dataFormsEdit
                    document.getElementById('save-edit').children[0].innerHTML = loadingform
                    let urlv = this.apiURL + this.sectionApi + '/' + this.dataId
                    this.axios.put(urlv,{
                        latitude: editdataAgentForms.latitude,
                        longitude: editdataAgentForms.longitude,
                        address: editdataAgentForms.address,
                    })
                    .then(response => {
                        document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                        if(response.data.status == 'error'){
                            this.messageerror = response.data.message
                        }else{
                            this.messagesuccess = response.data.message
                            this.getPosts(this.perPage, this.currentPage, '')
                            this.closeModal();
                        }
                    })
                    .catch(error => { 
                        console.log(error)
                    })
                }

            },

            // delete Item
            deletePost(type, valueid){
                this.messagesuccess = ''
                if(type == 'all'){
                    let id = this.itemiDforDelete
                    this.$confirm('Anda yakin akan menghapus '+ id.length +' cash out point dari daftar?', 'Hapus Cash Out Point', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        this.loading = true
                        for(let i = 0; i< id.length; i++){
                            let url = this.apiURL + this.sectionApi + '/' + id[i].id
                            this.axios.delete(url)
                            .then(response => {
                                this.getPosts(this.perPage, this.currentPage, '')
                            })
                            .catch(error => { 
                                console.log(error);
                            })
                            .finally(() => {
                                document.querySelector('.after-checked-section').classList.remove('active')
                                this.messagesuccess = id.length + " Items Berhasil dihapus."
                            })
                        }
                    })
                }else if(type == 'once'){
                    this.$confirm('Anda yakin akan menghapus cash out point dari daftar?', 'Hapus Cash Out Point', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        let url = this.apiURL + this.sectionApi + '/' + valueid
                        this.axios.delete(url)
                        .then(response => {
                            // if(response.data.status == 'success'){
                                this.getPosts(this.perPage, this.currentPage, '')
                                this.messagesuccess = response.data.message
                                this.closeModal();
                            // }
                        })
                        .catch(error => { 
                            console.log(error);
                        })
                    })
                }
            },
            
        },
        components: { AgentForms, EditAgentForms }
    }
</script>

