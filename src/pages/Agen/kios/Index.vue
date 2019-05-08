<template>
    <div class="content-wrapper">
        <div id="master-barang">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Kios</h4>
                        <div class="add-actions float-right">
                            <a @click.prevent="Create" class="float-right" v-if="$dataRole['reference.create']">
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
                                <el-table-column type="selection" width="55" v-if="$dataRole['reference.delete']"></el-table-column>
                                <el-table-column prop="id" label="ID" width="150"></el-table-column>
                                <el-table-column prop="name" label="Name" width="350"></el-table-column>
                                <el-table-column prop="status" label="Status"></el-table-column>
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
                            <div class="after-checked-section">
                                <div class="page-container">
                                    <div class="page-content">
                                        <div class="sidebar-checked"></div>
                                        <div class="content-wrapper clearfix">
                                            <el-checkbox v-model="afterChecked">{{totalChecked}} akun terpilih</el-checkbox>
                                            <div class="float-right">
                                                <el-button class="button-outline-red" round @click.prevent="deletePost('all','')">Hapus</el-button>
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
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="ID" prop="id">
                                                                <el-input v-model="forms.id"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama" prop="name">
                                                                <el-input v-model="forms.name"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Area">
                                                                <el-select v-model="forms.area">
                                                                    <el-option v-for="(areaItem, areaIndex) in itemArea" :key="areaIndex" :value="areaItem.id" :label="areaItem.name">{{areaItem.name}}</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Provinsi">
                                                                <el-select v-model="forms.propinsi">
                                                                    <el-option v-for="(provItem, provIndex) in itemPropinsi" :key="provIndex" :value="provItem.id" :label="provItem.name">{{provItem.name}}</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kota">
                                                                <el-select v-model="forms.kota">
                                                                    <el-option v-for="(cityItem, cityIndex) in itemCity" :key="cityIndex" :value="cityItem.id" :label="cityItem.name">{{cityItem.name}}</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kabupaten">
                                                                <el-input v-model="forms.kabupaten"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kecamatan">
                                                                <el-input v-model="forms.kecamatan"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kelurahan">
                                                                <el-input v-model="forms.kelurahan"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Desa">
                                                                <el-input v-model="forms.desa"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kode Pos">
                                                                <el-input type="number" v-model="forms.code_pos"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Alamat">
                                                                <el-input rows="5" type="textarea" v-model="forms.address"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nomor Telepon">
                                                                <el-input v-model="forms.phone"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nomor Hp">
                                                                <el-input v-model="forms.mobile_phone"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Status">
                                                                <el-radio-group v-model="forms.status">
                                                                    <el-radio label="active">Active</el-radio>
                                                                    <el-radio label="inactive">Inactive</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['reference.delete']" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['reference.edit']" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
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
    import FUNCTIONS from '@/functions'

    export default {
        name: 'MS_Attribut',
        data () {
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'kios',
                sectionApiReference: 'reference',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemiDforDelete: [],
                itemskuBrand: [],
                itemskuCategory: [],
                itemiDforDelete: [],
                itemArea: [],
                itemPropinsi: [],
                itemCity: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                totalPage: '',
                dismissSecs: 5,
                dismissCountDown: 0,
                dataModalName: '',
                dataModalSupplier: '',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',
                changeStatus: '',
                filterQuery: '',

                 // message variable
                messageerror: '',
                messagesuccess: '',

                // for create, detail, edit forms and validation
                forms:{
                    id: '',
                    name: '',
                    area: '',
                    propinsi: '',
                    kota: '',
                    kabupaten: '',
                    kecamatan: '',
                    kelurahan: '',
                    desa: '',
                    code_pos: '',
                    address: '',
                    phone: '',
                    mobile_phone: '',
                    status: 'active'
                },
                rules2:{
                    id: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    name: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                }
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['kios.list'])
        },
        mounted () {
            this.getPosts(this.perPage, this.currentPage, '')

            // Get all Reference
            this.getReference('Area')
            this.getReference('Propinsi')
            this.getReference('Kota')
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
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=DESC'
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

            // Get Reference
            getReference(category){
                let url = this.apiURL + this.sectionApiReference + '?category=' + category

                this.axios.get(url)
                .then(response => {
                    if(category == 'Area'){
                        this.itemArea = response.data.data
                    }else if(category == 'Propinsi'){
                        this.itemPropinsi = response.data.data
                    }else if(category == 'Kota'){
                        this.itemCity = response.data.data
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

            // delete Item
            deletePost(type, valueid){
                if(type == 'all'){
                    let id = this.itemiDforDelete
                    this.$confirm('Anda yakin akan menghapus '+ id.length +' data dari daftar?', 'Hapus Kios', {
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
                    this.$confirm('Anda yakin akan menghapus data kios dari daftar?', 'Hapus Kios', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        let url = this.apiURL + this.sectionApi + '/' + valueid
                        this.axios.delete(url)
                        .then(response => {
                            this.getPosts(this.perPage, this.currentPage, '')
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
                if(this.$dataRole['reference.show']){
                    if(val){
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        this.formsType = 'edit'
                        this.titleForms = "Edit Kios"
                        this.itemDataDetail = val
                        this.messagesuccess = ''
                        this.messageerror = ''
                        this.loadingForm = true
                        let url = this.apiURL + this.sectionApi + '/' + this.itemDataDetail.id

                        this.axios.get(url)
                        .then(response => {
                            if(response.data.status == 'success'){
                                let dataDetail = response.data.data
                                this.forms.id = dataDetail.id  
                                this.forms.name = dataDetail.name 
                                this.forms.area = dataDetail.code_area 
                                this.forms.propinsi = dataDetail.province_id
                                this.forms.kota = dataDetail.city_id
                                this.forms.address = dataDetail.address
                                this.forms.kabupaten = dataDetail.kabupaten
                                this.forms.kecamatan = dataDetail.kecamatan
                                this.forms.kelurahan = dataDetail.kelurahan
                                this.forms.desa = dataDetail.desa
                                this.forms.code_pos = dataDetail.kode_pos
                                this.forms.phone = dataDetail.phone
                                this.forms.mobile_phone = dataDetail.mobile_phone
                                this.forms.status = dataDetail.status
                                this.loadingForm = false
                            }
                        })
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
                this.forms.id = '',
                this.forms.name = '',
                this.forms.area = '',
                this.forms.propinsi = '',
                this.forms.kota = '',
                this.forms.kabupaten = '',
                this.forms.kecamatan = '',
                this.forms.kelurahan = '',
                this.forms.desa = '',
                this.forms.code_pos = '',
                this.forms.address = '',
                this.forms.phone = '',
                this.forms.mobile_phone = '',
                this.forms.status = 'active'
            },

            // Create Forms function
            Create(){
                this.titleForms = "Kios Baru"
                this.formsType = 'create'
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
                this.messagesuccess = ''
                this.messageerror = ''
                
                this.forms.id = '',
                this.forms.name = '',
                this.forms.area = '',
                this.forms.propinsi = '',
                this.forms.kota = '',
                this.forms.kabupaten = '',
                this.forms.kecamatan = '',
                this.forms.kelurahan = '',
                this.forms.desa = '',
                this.forms.code_pos = '',
                this.forms.address = '',
                this.forms.phone = '',
                this.forms.mobile_phone = '',
                this.forms.status = 'active'
            },

            // Submit Button
            submitSave(formName, formtype){
                let loadingform = FUNCTIONS.svgSpinner;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formtype == 'save'){
                            document.getElementById('save').children[0].innerHTML = loadingform
                            let urlv = this.apiURL + this.sectionApi
                            this.axios.post(urlv, {
                                id  : this.forms.id,
                                name : this.forms.name,
                                area : this.forms.area,
                                propinsi: this.forms.propinsi,
                                kota: this.forms.kota,
                                address: this.forms.address,
                                kabupaten: this.forms.kabupaten,
                                kecamatan: this.forms.kecamatan,
                                kelurahan: this.forms.kelurahan,
                                desa: this.forms.desa,
                                kode_pos: this.forms.code_pos,
                                phone: this.forms.phone,
                                mobile_phone: this.forms.mobile_phone,
                                status: this.forms.status,
                            })
                            .then(response => {
                                document.getElementById('save').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Kios Baru Berhasil ditambahkan."
                                    this.getPosts(this.perPage, this.currentPage, '')
                                    this.closeModal();
                                }
                            })
                            .catch(error => { 
                                console.log(error)
                            })
                        }else{
                            document.getElementById('save-edit').children[0].innerHTML = loadingform
                            let urlv = this.apiURL + this.sectionApi + '/' + this.itemDataDetail.id
                            this.axios.put(urlv, {
                                id  : this.forms.id,
                                name : this.forms.name,
                                area : this.forms.area,
                                propinsi: this.forms.propinsi,
                                kota: this.forms.kota,
                                address: this.forms.address,
                                kabupaten: this.forms.kabupaten,
                                kecamatan: this.forms.kecamatan,
                                kelurahan: this.forms.kelurahan,
                                desa: this.forms.desa,
                                kode_pos: this.forms.code_pos,
                                phone: this.forms.phone,
                                mobile_phone: this.forms.mobile_phone,
                                status: this.forms.status,
                            })
                            .then(response => {
                                document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Data Reference Berhasil diubah."
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
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            }
        }
    }
</script>