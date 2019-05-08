<template>
    <div class="content-wrapper">
        <div id="agent">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Kepala SPK</h4>
                        <div class="add-actions">
                            <a @click.prevent="Create" class="float-right" v-if="$dataRole['agent.create']">
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
                        <div class="" v-if="itemsData">
                            <div v-if="messagesuccess">
                                <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                            </div>

                            <div class="filterstatus">
                                <el-tabs v-model="filterQuery">
                                    <el-tab-pane label="Semua Status" name=""></el-tab-pane>
                                    <el-tab-pane label="Active" name="ACTIVE"></el-tab-pane>
                                    <el-tab-pane label="InActive" name="INACTIVE"></el-tab-pane>
                                    <el-tab-pane label="Pending" name="PENDING"></el-tab-pane>
                                    <el-tab-pane label="Suspended" name="SUSPENDED"></el-tab-pane>
                                </el-tabs>
                            </div>

                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                @current-change="handleCurrentChange"
                                @selection-change="handleSelectionChange"
                                highlight-current-row
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column type="selection" width="55" v-if="$dataRole['agent.head.delete']"></el-table-column>
                                <el-table-column prop="username" label="Username" width="120"></el-table-column>
                                <el-table-column prop="fullname" label="Full Name" width="200"></el-table-column>
                                <el-table-column prop="email" label="Email" width="150"></el-table-column>
                                <el-table-column prop="phone_number" label="Phone Number"></el-table-column>
                                <el-table-column prop="status" label="Status" width="100"></el-table-column>
                                <el-table-column label="Regional">
                                    <template slot-scope="scope">
                                        <div v-if="(scope.row.regions[0] == null)" style="color:#2196f3;">Pusat</div>
                                        <div v-else>
                                            <div 
                                                v-for="(dataRegional, indexRegional) in scope.row.regions" 
                                                :key="indexRegional">{{dataRegional}}</div>
                                        </div>
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
                                        <h4>{{titleForms}}</h4>
                                        <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                                    </header>
                                    <section>
                                        <div v-if="(messageerror != '')">
                                            <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                                        </div>
                                        <el-form :model="forms" status-icon :rules="rules2" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <h5>General Info</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="Email" prop="email">
                                                                <el-input v-model="forms.email"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama Lengkap" prop="fullname">
                                                                <el-input v-model="forms.fullname"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Username" prop="username">
                                                                <el-input v-model="forms.username"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nomor Telepon" prop="no_telp">
                                                                <el-input type="number" class="customvalinum" v-model="forms.no_telp"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Tempat Lahir" prop="birthplace">
                                                                <el-input v-model="forms.birthplace"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Tanggal Lahir" prop="birthdate">
                                                                <el-date-picker v-model="forms.birthdate" type="date" format="d-MM-yyyy"></el-date-picker>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Jenis Kelamin" prop="gender">
                                                                <el-radio-group v-model="forms.gender">
                                                                    <el-radio label="Laki-Laki">Laki-Laki</el-radio>
                                                                    <el-radio label="Perempuan">Perempuan</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                            <div class="item-forms-details">
                                                <h5>Akun Staff</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item v-if="(formsType != 'edit')" label="Password" prop="password">
                                                                <el-input type="password" v-model="forms.password"></el-input>
                                                            </el-form-item>
                                                            <el-form-item v-else-if="(formsType == 'edit')" label="Password">
                                                                <el-input type="password" v-model="forms.password"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Role" prop="role" v-if="(formsType != 'edit')">
                                                                <el-select v-model="forms.role" placeholder="Select">
                                                                    <el-option value="6" label="Kepala SPK">Kepala SPK</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                            <el-form-item label="Role" prop="role" v-else>
                                                                <el-select v-model="forms.role" placeholder="Select">
                                                                    <el-option value="1" label="Super Admin">Super Admin</el-option>
                                                                    <el-option value="2" label="Admin">Admin</el-option>
                                                                    <el-option value="3" label="User">User</el-option>
                                                                    <el-option value="4" label="Agent">Agent</el-option>
                                                                    <el-option value="5" label="Customer">Customer</el-option>
                                                                    <el-option value="6" label="Kepala SPK">Kepala SPK</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Regional Agen" prop="regions">
                                                                <el-select v-model="forms.regions" placeholder="Select">
                                                                    <el-option 
                                                                        v-for="(dataRegionForms, indexRegionForms) in itemRegional"
                                                                        :key="indexRegionForms"
                                                                        :value="dataRegionForms.id"
                                                                        :label="dataRegionForms.name">{{dataRegionForms.name}}</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Status" prop="status">
                                                                <el-select v-model="forms.status" placeholder="Select">
                                                                    <el-option value="ACTIVE">ACTIVE</el-option>
                                                                    <el-option value="INACTIVE">INACTIVE</el-option>
                                                                    <el-option value="PENDING">PENDING</el-option>
                                                                    <el-option value="BANNED">BANNED</el-option>
                                                                    <el-option value="SUSPENDED">SUSPENDED</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                            <div class="item-forms-details">
                                                <h5>Lokasi Staff</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="24">
                                                            <el-form-item label="Alamat" prop="address">
                                                                <el-input v-model="forms.address" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Area" prop="code_area">
                                                                <el-select v-model="forms.code_area" placeholder="Select">
                                                                    <el-option v-for="(areaItem, areaIndex) in itemArea" :key="areaIndex" :value="areaItem.id" :label="areaItem.name">{{areaItem.name}}</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Provinsi" prop="province_id">
                                                                <el-select v-model="forms.province_id" placeholder="Select">
                                                                    <el-option v-for="(provItem, provIndex) in itemPropinsi" :key="provIndex" :value="provItem.id" :label="provItem.name">{{provItem.name}}</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kota" prop="city_id">
                                                                <el-select v-model="forms.city_id" placeholder="Select">
                                                                    <el-option v-for="(cityItem, cityIndex) in itemCity" :key="cityIndex" :value="cityItem.id" :label="cityItem.name">{{cityItem.name}}</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Jenis Petani" prop="agriculture_category_id">
                                                                <el-select v-model="forms.agriculture_category_id" placeholder="Select">
                                                                    <el-option v-for="(petaniItem, petaniIndex) in itemPetani" :key="petaniIndex" :value="petaniItem.id" :label="petaniItem.name">{{petaniItem.name}}</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                                    <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
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
    import _ from 'lodash'
    import JQuery from 'jquery'
    import FUNCTIONS from '@/functions'

    export default {
        name: 'agent',
        data () {
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'headAgent',
                sectionApiAgent: 'agent',
                sectionApiUser: 'user',
                sectionApiReference: 'reference',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemArea: [],
                itemPropinsi: [],
                itemCity: [],
                itemPetani: [],
                itemRegional: [],
                itemiDforDelete: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                filterQuery: '',
                regionQuery: '',
                totalPage: '',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',

                // message variable
                messageerror: '',
                messagesuccess: '',

                // for create, detail, edit forms and validation
                forms:{
                    email: '',
                    fullname: '',
                    username: '',
                    no_telp: '',
                    birthplace: '',
                    birthdate: '',
                    gender: 'Laki-Laki',
                    address: '',
                    password: '',
                    role: '6',
                    regions: '',
                    old_role: '',
                    status: 'ACTIVE',
                    code_area: '',
                    province_id: '',
                    city_id: '',
                    agriculture_category_id: '',
                },
                rules2:{
                    // email: [ 
                    //     { required: true, message: 'Inputan harus di isi', trigger: 'blur' },
                    //     { type: 'email', message: 'Format email tidak sesuai', trigger: ['blur', 'change'] }
                    // ],
                    fullname: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    username: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    no_telp: [ 
                        { required: true, message: 'Inputan harus di isi', trigger: 'blur' },
                        { max: 15, message: 'Maximal inputan 15 character', trigger: 'blur' } 
                    ],
                    birthplace: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    birthdate: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    // address: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    gender: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    password: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    role: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    status: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    // code_area: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    regions: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    // province_id: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    // city_id: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    // agriculture_category_id: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ]
                }
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['agent.head'])
        },
        mounted(){
            // Get all Post user
            this.getPosts(this.perPage, this.currentPage, '', this.filterQuery, this.regionQuery)

            // Get all Reference
            this.getReference('Area')
            this.getReference('Propinsi')
            this.getReference('Kota')
            this.getReference('JenisPertanian')
            this.getReference('RegionalAgen')
            JQuery(".customvalinum .el-input__inner").bind({
                keydown: function(e) {
                    if (e.shiftKey === true ) {
                        if (e.which == 9) {
                            return true;
                        }
                        return false;
                    }
                    if (e.which > 57) {
                        return false;
                    }
                    if (e.which==32) {
                        return false;
                    }
                    return true;
                }
            });
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
            },
            filterQuery: function(newFilter){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, newFilter, this.regionQuery)
            },
            regionQuery: function(newRegion){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery, newRegion)
            }
        },
        methods: {
            // build url function
            buildUrl (limit, page, search, status, regionCode) {
                return this.apiUrl + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&status=' + status + '&region_code=' + regionCode
            },

            // get all post
            getPosts(num, pg, sch, sts, region){
                let url = this.buildUrl(num, pg, sch, sts, region)
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

            // Get Reference
            getReference(category){
                let url = this.apiUrl + this.sectionApiReference + '?category=' + category

                this.axios.get(url)
                .then(response => {
                    if(category == 'Area'){
                        this.itemArea = response.data.data
                    }else if(category == 'Propinsi'){
                        this.itemPropinsi = response.data.data
                    }else if(category == 'Kota'){
                        this.itemCity = response.data.data
                    }else if(category == 'JenisPertanian'){
                        this.itemPetani = response.data.data
                    }else if(category == 'RegionalAgen'){
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
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery, this.regionQuery)
            },

            // Limit Change function
            limitChange(limit, event){
                this.perPage = limit
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery, this.regionQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.perPage, '1', this.searchQuery, this.filterQuery, this.regionQuery)
            }, 300),

            // delete Item
            deletePost(type, valueid){
                this.messageerror = ''
                this.messagesuccess = ''
                if(type == 'all'){
                    let id = this.itemiDforDelete
                    this.$confirm('Anda akan menghapus '+ id.length +' dari daftar staff.', 'Hapus Staff', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        this.loading = true
                        for(let i = 0; i< id.length; i++){
                            let url = this.apiUrl + this.sectionApiUser + '/' + id[i].id
                            this.axios.delete(url)
                            .then(response => {
                                this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery, this.regionQuery)
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
                    this.$confirm('Anda akan menghapus '+ this.itemDataDetail.fullname +' dari daftar staff.', 'Hapus Staff', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        let url = this.apiUrl + this.sectionApiAgent + '/' + valueid
                        this.axios.delete(url)
                        .then(response => {
                            this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery, this.regionQuery)
                        })
                        .catch(error => { 
                            console.log(error);
                        })
                        .finally(() => {
                            this.closeModal();
                            this.messagesuccess = "1 Items Berhasil dihapus."
                        })
                    })
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

            // function for table click for edit and detail
            handleCurrentChange(val){
                if(this.$dataRole['agent.head.show']){
                    if(val){
                        this.$router.push({ name: 'agent__head__detail', params: { id: val.id }})
                    }
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: 'Anda tidak punya akses'
                    });
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

            // Create Forms function
            Create(){
                this.titleForms = "Kepala SPK Baru"
                this.formsType = 'create'
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
                this.forms.email = ''
                this.forms.fullname = ''
                this.forms.username = ''
                this.forms.no_telp = ''
                this.forms.birthplace = ''
                this.forms.birthdate = ''
                this.forms.gender = 'Laki-Laki'
                this.forms.address = ''
                this.forms.password = ''
                this.forms.role = '6'
                this.forms.regions = ''
                this.forms.old_role = ''
                this.forms.status = 'ACTIVE'
                this.forms.code_area = ''
                this.forms.province_id = ''
                this.forms.city_id = ''
                this.forms.agriculture_category_id = ''
            },

            // Submit Button
            submitSave(formName, formtype){
                let loadingform = FUNCTIONS.svgSpinner;
                this.messageerror = ''
                this.messagesuccess = ''
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formtype == 'save'){
                            document.getElementById('save').children[0].innerHTML = loadingform
                            let urlv = this.apiUrl + this.sectionApiAgent
                            this.axios.post(urlv, {
                                fullname: this.forms.fullname,
                                email: this.forms.email,
                                username: this.forms.username,
                                phone_number: this.forms.no_telp,
                                birthplace: this.forms.birthplace,
                                birthday: FUNCTIONS.formatDate(this.forms.birthdate),
                                gender: this.forms.gender,
                                address: this.forms.address,
                                status: this.forms.status,
                                role: this.forms.role,
                                region_code: this.forms.regions,
                                password: this.forms.password,
                                code_area: this.forms.code_area,
                                province_id: this.forms.province_id,
                                city_id: this.forms.city_id,
                                agriculture_category_id: this.forms.agriculture_category_id,
                            })
                            .then(response => {
                                document.getElementById('save').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = response.data.data.fullname + " Berhasil ditambahkan."
                                    this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery, this.regionQuery)
                                    this.closeModal();
                                }
                            })
                            .catch(error => { 
                                console.log(error)
                            })
                        }else{
                            document.getElementById('save-edit').children[0].innerHTML = loadingform
                            let urlv = this.apiUrl + this.sectionApiAgent + '/' + this.itemDataDetail.id

                            this.axios.put(urlv, {
                                email: this.forms.email,
                                fullname: this.forms.fullname,
                                username: this.forms.username,
                                phone_number: this.forms.no_telp,
                                birthplace: this.forms.birthplace,
                                birthday: FUNCTIONS.formatDate(this.forms.birthdate),
                                gender: this.forms.gender,
                                address: this.forms.address,
                                password: this.forms.password,
                                role: this.forms.role,
                                old_role: this.forms.old_role,
                                region_code: this.forms.regions,
                                status: this.forms.status,
                                code_area: this.forms.code_area,
                                province_id: this.forms.province_id,
                                city_id: this.forms.city_id,
                                agriculture_category_id: this.forms.agriculture_category_id,
                            })
                            .then(response => {
                                document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = response.data.data.fullname + " Berhasil diubah."
                                    this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.filterQuery, this.regionQuery)
                                    this.closeModal();
                                }
                            })
                            .catch(error => { 
                                // console.log(error);
                            })
                        }
                    } else {
                        document.getElementById('save').children[0].innerHTML = 'Simpan'
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            }
        }
    }
</script>