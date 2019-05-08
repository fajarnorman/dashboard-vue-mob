<template>
    <div class="content-wrapper">
        <div id="master-barang-attribute">
            <div class="page-header">
                <page-header titleName="Merchant Menu" :isCreate="$dataRole['merchant.menu.create']"></page-header>
            </div>
            <div class="content">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img src='~assets/images/icons/search1.png'>
                    </div>
                </div>
                <el-alert 
                    v-if="messagesuccess" 
                    title="" 
                    type="success" 
                    :description="messagesuccess" 
                    show-icon></el-alert>
                <el-table 
                    :data="itemsData" 
                    empty-text="No data available in table"
                    ref="singleTable"
                    @current-change="handleCurrentChange"
                    v-loading="loading"
                    class="mobayar-table">
                    <!-- <el-table-column type="expand">
                        <template slot-scope="props">
                            <div class="detailsValue">
                                <div>
                                    <span>Name : </span>
                                    <el-input v-model="nameSet[props.$index]"></el-input>
                                </div>
                                <div>
                                    <span>Slug : </span>
                                    <el-input v-model="slugSet[props.$index]"></el-input>
                                </div>
                                <div>
                                    <span>Value : </span>
                                    <el-radio-group v-model="valueSet[props.$index]" size="mini">
                                        <el-radio-button label="active">Active</el-radio-button>
                                        <el-radio-button label="inactive">InActive</el-radio-button>
                                        <el-radio-button label="dynamic">Dynamic</el-radio-button>
                                    </el-radio-group>
                                </div>
                                <div 
                                    v-if="valueSet[props.$index] == 'dynamic'">
                                    <span>Dynamic Value : </span>
                                    <el-radio-group v-model="dynamicSet[props.$index]" size="mini">
                                        <el-radio label="role">Role</el-radio>
                                        <el-radio label="cashout">Cashout</el-radio>
                                        <el-radio label="offlinehub">Offline Hub</el-radio>
                                    </el-radio-group>
                                </div>
                                <div 
                                    v-if="dynamicSet[props.$index] == 'role' && valueSet[props.$index] == 'dynamic'">
                                    <span>Role Value : </span>
                                    <el-checkbox-group v-model="roleSet[props.$index]" size="mini">
                                        <el-checkbox 
                                            v-for="(dataValue, indexValue) in itemsDataPermission" 
                                            :label="dataValue.id" 
                                            :key="indexValue">{{dataValue.name}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                                <div>
                                    <el-button class="button-outline-black" id="trash" @click.prevent="deletePost(props.row._id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-white-green" @click.prevent="updateSubmit(props.row._id, props.$index)">Update</el-button>
                                </div>
                            </div>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="name" label="Name"></el-table-column>
                    <el-table-column prop="slug" label="Slug"></el-table-column>
                    <el-table-column prop="value" label="Value"></el-table-column>
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
                <div class="base-template-sidebar">
                    <loading-svg :isLoading="loadingForm"></loading-svg>
                    <div class="content" v-if="itemDataDetail">
                        <header class="clearfix">
                            <h4>{{titleForms}}</h4>
                            <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                        </header>
                        <section>
                            <div v-if="formsType == 'edit'">
                                <el-alert title="Info!" type="warning" description="Perubahan pada slug akan mempengaruhi fitur pada aplikasi mobile" show-icon></el-alert>
                            </div>
                            <el-form :model="forms" status-icon :rules="rules" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                <div class="item-forms-details">
                                    <h5>Info Merchant</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Name" prop="name">
                                                    <el-input v-model="forms.name"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Slug" prop="slug">
                                                    <el-input v-model="forms.slug"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Value" prop="value">
                                                    <el-radio-group v-model="forms.value">
                                                        <el-radio label="active">Active</el-radio>
                                                        <el-radio label="inactive">InActive</el-radio>
                                                        <el-radio label="dynamic">Dynamic</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24" v-if="forms.value == 'dynamic'">
                                                <el-form-item label="Dynamic Value" prop="dynamic_value">
                                                    <el-radio-group v-model="forms.dynamic_value">
                                                        <el-radio label="role">Role</el-radio>
                                                        <el-radio label="cashout">Cashout</el-radio>
                                                        <el-radio label="offlinehub">Offline Hub</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12" v-if="forms.dynamic_value == 'role' && forms.value == 'dynamic'">
                                                <el-form-item label="Role" class="roles-value-set" prop="roles">
                                                    <el-checkbox-group v-model="forms.roles">
                                                        <el-checkbox 
                                                            v-for="(dataValue, indexValue) in itemsDataPermission" 
                                                            :label="dataValue.id" 
                                                            :value="dataValue.id"
                                                            :key="indexValue">{{dataValue.name}}</el-checkbox>
                                                    </el-checkbox-group>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button v-show="(formsType == 'edit')" v-if="$dataRole['merchant.menu.delete']" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail._id)">
                            <img src="~assets/images/icons/trash.png" alt="img-trash">
                        </el-button>
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                        <el-button v-show="(formsType == 'edit')" v-if="$dataRole['merchant.menu.edit']" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                        <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FUNCTIONS from '@/functions'
import pageHeader from '@/components/partials/pageHeader.vue'
import loadingSvg from '@/components/partials/loadingSvg.vue'

export default {
    name: 'offline-hubs-attribute',
    data(){
        return{
            apiUrl: process.env.ROOT_API,
            sectionApi: 'merchantMenu',
            sectionApiPermission: 'permission',
            loading: false,
            loadingForm: false,
            itemsData: [],
            itemsDataPermission: [],
            itemDataDetail: [],
            searchQuery: '',
            totalPage: '',
            perPage: 10,
            currentPage: 1,
            titleForms: '',
            formsType: '',
            messagesuccess: '',
            messageerror: '',
            dataTextCreate: 'Buat Merchant Menu',
            dataTextUpdate: 'Edit Merchant Menu',
            confirmDescDelete: 'Anda yakin akan menghapus data Merchant Menu dari daftar?',
            confirmTitleDelete: 'Hapus Merchant Menu',
            textDataCreateSuccess: 'Data Merchant Menu Berhasil ditambahkan.',
            textDataUpdateSuccess: 'Data Merchant Menu Berhasil diupdate.',
            textDataDeleteSuccess: '1 Items Berhasil dihapus.',
            textMemuatData: 'Masih memuat data',
            textErrorNetwork: 'Jaringan Bermasalah',
            forms:{
                name: '',
                slug: '',
                value: '',
                dynamic_value: '',
                roles: [],
            },
            rules:{
                name: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                slug: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                value: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                dynamic_value: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                roles: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
            },
            nameSet: [],
            slugSet: [],
            valueSet: [],
            dynamicSet: [],
            roleSet: [],
        }
    },
    watch:{
        searchQuery: function(newValue){
            this.getResult(newValue)
            document.querySelector('.el-pagination').children[1].children[0].click()
        }
    },
    created(){
        FUNCTIONS.checkPermissions(this.$dataRole['merchant.menu.list'])
    },
    mounted(){
        this.getPost(this.searchQuery)
        this.getPostPermission()
        this.initCreateFunction()
    },
    methods:{
        getPost(search){
            this.loading = true
            this.nameSet = []
            this.slugSet = []
            this.valueSet = []
            this.dynamicSet = []
            this.roleSet = []
            let url = this.apiUrl + this.sectionApi + '?page=' + this.currentPage + '&search=' + search + '&direction=DESC'
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsData = response.data.data
                    this.totalPage = response.data.totalData
                    this.itemsData.forEach(function(e){
                        this.nameSet.push(e.name)
                        this.slugSet.push(e.slug)
                        this.valueSet.push(e.value)
                        this.dynamicSet.push(e.dynamic_value)
                        this.roleSet.push(e.roles)    
                    }, this)
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: response.data.message
                    });    
                }
            })
            .catch(error => {
                this.$notify.error({
                    title: this.textErrorNetwork,
                    message: 'Gagal mendapatkan data'
                });
            })
            .finally(() => {
                this.loading = false
            })
        },
        getPostPermission(){
            let url = this.apiUrl + this.sectionApiPermission + '?limit=20'+ '&page=' + this.currentPage + '&direction=ASC&order=id'
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsDataPermission = response.data.data
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: response.data.message
                    });    
                }
            })
            .catch(error => {
                this.$notify.error({
                    title: this.textErrorNetwork,
                    message: 'Gagal mendapatkan data'
                });
            })
        },
        getResult: _.debounce(function(search){ 
            this.getPost(search)
        }, 500),
        submitSave(formName, formtype){
            let loadingform = FUNCTIONS.svgSpinner;
            this.messagesuccess = ''
            this.messageerror = ''
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    this.itemsData = []
                    if(formtype == 'save'){
                        document.getElementById('save').children[0].innerHTML = loadingform
                        let urlv = this.apiUrl + this.sectionApi
                        let dataForms
                        if(this.forms.value == 'active' || this.forms.value == 'inactive'){
                            dataForms = {
                                'name': this.forms.name,
                                'slug': this.forms.slug,
                                'value': this.forms.value
                            }
                        }else{
                            if(this.forms.dynamic_value == 'cashout' || this.forms.dynamic_value == 'offlinehub'){
                                dataForms = {
                                    'name': this.forms.name,
                                    'slug': this.forms.slug,
                                    'value': this.forms.value,
                                    'dynamic_value': this.forms.dynamic_value,
                                }
                            }else{
                                dataForms = {
                                    'name': this.forms.name,
                                    'slug': this.forms.slug,
                                    'value': this.forms.value,
                                    'dynamic_value': this.forms.dynamic_value,
                                    'roles': this.forms.roles
                                }
                            }
                        }
                        this.postFunction('post', dataForms, urlv)
                    }else{
                        document.getElementById('save-edit').children[0].innerHTML = loadingform
                        let urlv = this.apiUrl + this.sectionApi + '/' + this.itemDataDetail._id
                        let dataForms
                        if(this.forms.value == 'active' || this.forms.value == 'inactive'){
                            dataForms = {
                                'name': this.forms.name,
                                'slug': this.forms.slug,
                                'value': this.forms.value
                            }
                        }else{
                            if(this.forms.dynamic_value == 'cashout' || this.forms.dynamic_value == 'offlinehub'){
                                dataForms = {
                                    'name': this.forms.name,
                                    'slug': this.forms.slug,
                                    'value': this.forms.value,
                                    'dynamic_value': this.forms.dynamic_value,
                                }
                            }else{
                                dataForms = {
                                    'name': this.forms.name,
                                    'slug': this.forms.slug,
                                    'value': this.forms.value,
                                    'dynamic_value': this.forms.dynamic_value,
                                    'roles': this.forms.roles
                                }
                            }
                        }
                        this.postFunction('put', dataForms, urlv)
                    }
                }
            })
        },
        deletePost(id){
            this.$confirm(this.confirmDescDelete, this.confirmTitleDelete, {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.itemsData = []
                let url = this.apiUrl + this.sectionApi + '/' + id
                this.postFunction('delete', '', url)
                this.initClickCreateFunction('hide')
            })
        },
        handleCurrentChange(val){
            if(val){
                if(this.$dataRole['merchant.menu.show']){
                    this.titleForms = this.dataTextUpdate
                    this.formsType = 'edit'
                    let url = this.apiUrl + this.sectionApi + '/' + val._id
                    this.postFunction('getbyid', '', url)
                    this.initClickCreateFunction('show')
                }
            }
        },
        pageChange (page) {
            this.currentPage = page
            this.getPost(this.searchQuery)
        },
        limitChange(limit){
            this.perPage = limit
            document.querySelector('.el-pagination').children[1].children[0].click()
            this.getPost(this.searchQuery)
            document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
            event.target.parentNode.classList.add('active')
        },
        initCreateFunction(){
            let that = this
            setTimeout(function(){
                document.querySelector('.add-click-forms').addEventListener('click', function(){ 
                    if(that.loading == false){
                        that.titleForms = that.dataTextCreate
                        that.formsType = 'create'
                        that.initClickCreateFunction('show')
                    }else{
                        that.$notify({
                            type: 'warning',
                            title: 'Maaf',
                            message: that.textMemuatData
                        });
                    } 
                })
            }, 500)
        },
        closeModal(row){
            this.initClickCreateFunction('hide')
            this.$refs.singleTable.setCurrentRow(row);
            this.$refs.formsvalid.resetFields();
            this.forms.name = ''
            this.forms.slug = ''
            this.forms.value = ''
            this.forms.dynamic_value = ''
            this.forms.roles = []
        },
        initClickCreateFunction(value){
            if(value == 'show'){
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
            }else{
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
            }
        },
        postFunction(type, credentials, url){
            if(type == 'post'){
                this.axios.post(url, credentials)
                .then(response => {
                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                    if(response.data.status == 'error'){
                        this.messageerror = response.data.message
                    }else{
                        this.messagesuccess = this.textDataCreateSuccess
                        this.getPost('')
                        this.closeModal();
                    }
                })
                .catch(error => { 
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal menyimpan data'
                    });
                })
            }else if(type == 'put'){
                this.axios.put(url, credentials)
                .then(response => {
                    document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                    if(response.data.status == 'error'){
                        this.messageerror = response.data.message
                    }else{
                        this.messagesuccess = this.textDataUpdateSuccess
                        this.getPost('')
                        this.closeModal();
                    }
                })
                .catch(error => { 
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal mengedit data'
                    });
                })
            }else if(type == 'getbyid'){
                this.loadingForm = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemDataDetail = response.data.data
                        this.forms.name = this.itemDataDetail.name
                        this.forms.slug = this.itemDataDetail.slug
                        this.forms.value = this.itemDataDetail.value
                        if(this.itemDataDetail.dynamic_value !== null){
                            this.forms.dynamic_value = this.itemDataDetail.dynamic_value
                        }
                        if(this.itemDataDetail.roles !== null && (this.itemDataDetail.roles).length !== 0 && this.itemDataDetail.roles !== ''){
                            this.itemDataDetail.roles.forEach(function(e){
                                this.forms.roles.push(e)
                            },this)
                        }
                    }
                })
                .catch(error => {
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal mendapatkan data detail'
                    });
                })
                .finally(() => {
                    this.loadingForm = false
                })
            }else if(type == 'delete'){
                this.axios.delete(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.messagesuccess = this.textDataDeleteSuccess
                        this.getPost('')
                        this.closeModal();
                    }
                })
                .catch(error => {
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal menghapus data'
                    });
                })
                .finally(() => {
                    this.closeModal();
                })
            }
        },
    },
    components: { pageHeader, loadingSvg }
}
</script>

<style lang="scss" scoped>
.detailsValue{
    display: block;
    width: 100%;
    &>div{
        margin-bottom: 8px;
        span{
            width: 120px;
            vertical-align: top;
            display: inline-block;
        }
        &:last-child{
            margin-bottom: 0;
        }
        .el-checkbox-group{
            display: inline-block;
            width: 70%;
            .el-checkbox__label{
                font-size: 13px;
            }
            .el-checkbox{
                width: 220px;
                margin-left: 0;
            }
        }
        .el-input{
            display: inline-block;
            width: 250px;
        }
        .el-button{
            margin-left: 15px;
            float: right;
            font-size: 12px;
            padding: 6px 12px;
        }
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner{
        background-color: #800080;
    }
}
</style>
