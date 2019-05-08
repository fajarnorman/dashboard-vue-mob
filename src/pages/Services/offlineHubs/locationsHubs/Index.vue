<template>
    <div class="content-wrapper">
        <div id="master-barang-attribute">
            <div class="page-header">
                <page-header titleName="Lokasi Hubs" :isCreate="$dataRole['service.offlinehub.post.hub.create']"></page-header>
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
                    max-height="530" 
                    empty-text="No data available in table"
                    ref="singleTable"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column type="index" label="No" width="50"></el-table-column>
                    <el-table-column prop="name" label="Name"></el-table-column>
                    <el-table-column prop="address" label="Alamat"></el-table-column>
                    <el-table-column label="Last Update">
                        <template slot-scope="scope">
                            <div v-if="scope.row.updated_at == null">
                                {{scope.row.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
                            </div>
                            <div v-else>
                                {{scope.row.updated_at | moment("YYYY-MM-DD, H:mm:ss")}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Actions">
                        <template slot-scope="scope">
                            <el-tooltip v-if="$dataRole['service.offlinehub.put.hub.update.*']" class="item" effect="dark" content="Edit Lokasi Hub" placement="top">
                                <a style="margin-right: 15px;" @click.prevent="handleCurrentChange(scope.row)"><font-awesome-icon class="fontIcons" :icon="fontsIcons.edit" /></a>
                            </el-tooltip>
                            <el-tooltip v-if="$dataRole['service.offlinehub.get.stock.hub']" class="item" effect="dark" content="Manage Stock Barang" placement="top">
                                <a style="margin-right: 15px;" @click.prevent="$router.push({ name: 'mb_manage_stock', params: { name: scope.row.name, id: scope.row.id }})"><font-awesome-icon class="fontIcons" :icon="fontsIcons.detail" /></a>
                            </el-tooltip>
                            <el-tooltip v-if="$dataRole['service.offlinehub.get.stock.input.history']" class="item" effect="dark" content="History Stock Barang" placement="top">
                                <a @click.prevent="$router.push({ name: 'mb_history_stock', params: { name: scope.row.name, id: scope.row.id }})"><font-awesome-icon class="fontIcons" :icon="fontsIcons.history" /></a>
                            </el-tooltip>
                            <!-- <el-tooltip class="item" effect="dark" content="Hapus Lokasi Hub" placement="top">
                                <a @click.prevent="deletePost(scope.row.id)"><font-awesome-icon class="fontIcons" :icon="fontsIcons.delete" /></a>
                            </el-tooltip> -->
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
                <div class="base-template-sidebar">
                    <loading-svg :isLoading="loadingForm"></loading-svg>
                    <div class="content" v-if="itemDataDetail">
                        <header class="clearfix">
                            <h4>{{titleForms}}</h4>
                            <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                        </header>
                        <section>
                            <el-form :model="forms" status-icon :rules="rules" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                <div class="item-forms-details">
                                    <h5>Info Lokasi Hubs</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Name" prop="name">
                                                    <el-input v-model="forms.name"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Crew" prop="spkName">
                                                    <div class="input-with-icons clearfix">
                                                        <div class="el-input searchtype">
                                                            <input type="text" v-model="forms.spkName" class="el-input__inner selectUser" placeholder="Select Crew">
                                                            <img src="~assets/images/icons/arrow-down.png">
                                                            <div class="dropdown-filterable dropdown-user">
                                                                <ul>
                                                                    <div v-if="searchLoading == true">
                                                                        <li><a style="text-align:center;pointer-event:none;">Loading Data</a></li>
                                                                    </div>
                                                                    <div v-else>
                                                                        <div v-if="itemsSPK.length !== 0">
                                                                            <li v-for="(itemUser, indexUser) in itemsSPK"
                                                                            :key="indexUser"><a href="#" @click.prevent="filterByUser(itemUser)">{{itemUser.fullname}} ({{itemUser.username}})</a></li>
                                                                        </div>
                                                                        <div v-else><li><a style="text-align:center;pointer-event:none;">No data</a></li></div>
                                                                    </div>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Store" prop="stroreName">
                                                    <div class="input-with-icons clearfix">
                                                        <div class="el-input searchtype">
                                                            <input type="text" v-model="forms.stroreName" class="el-input__inner selectStore" placeholder="Select User">
                                                            <img src="~assets/images/icons/arrow-down.png">
                                                            <div class="dropdown-filterable dropdown-store">
                                                                <ul>
                                                                    <div v-if="searchStore == true">
                                                                        <li><a style="text-align:center;pointer-event:none;">Loading Data</a></li>
                                                                    </div>
                                                                    <div v-else>
                                                                        <div v-if="itemsStore.length !== 0">
                                                                            <li v-for="(itemStore, indexStore) in itemsStore"
                                                                            :key="indexStore"><a href="#" @click.prevent="filterByStore(itemStore)">{{itemStore.fullname}} ({{itemStore.username}})</a></li>
                                                                        </div>
                                                                        <div v-else><li><a style="text-align:center;pointer-event:none;">No data</a></li></div>
                                                                    </div>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Lokasi" prop="address">
                                                    <create-locations-hubs 
                                                        ref="locationsHubForms" 
                                                        :dataForms="forms" 
                                                        :dataFormsAddress="dataAddress" 
                                                        :dataFormsLatitute="dataLatitute"
                                                        :dataFormsLongitute="dataLongitute"
                                                        :typeForms="formsType"></create-locations-hubs>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button v-if="$dataRole['service.offlinehub.delete.hub.delete.*']" v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                            <img src="~assets/images/icons/trash.png" alt="img-trash">
                        </el-button>
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                        <el-button v-if="$dataRole['service.offlinehub.put.hub.update.*']" v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                        <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import JQuery from 'jquery'
import FUNCTIONS from '@/functions'
import pageHeader from '@/components/partials/pageHeader.vue'
import loadingSvg from '@/components/partials/loadingSvg.vue'
import CreateLocationsHubs from './CreateLocationsHubs.vue'
import { faEdit, faTrashAlt, faInfoCircle, faHistory } from '@fortawesome/free-solid-svg-icons'

export default {
    name: 'offline-hubs-locations',
    data(){
        return{
            apiURL: process.env.ROOT_API,
            sectionApi: 'offlinehub?servicePathUrl=hub',
            sectionApiUser: 'user',
            loading: false,
            loadingForm: false,
            searchLoading: false,
            searchStore: false,
            itemsData: [],
            itemDataDetail: [],
            itemsSPK: [],
            itemsStore: [],
            searchQuery: '',
            totalPage: '',
            perPage: 10,
            currentPage: 1,
            titleForms: '',
            formsType: '',
            messagesuccess: '',
            messageerror: '',
            dataTextCreate: 'Buat Lokasi Hubs',
            dataTextUpdate: 'Edit Lokasi Hubs',
            confirmDescDelete: 'Anda yakin akan menghapus data Lokasi Hubs dari daftar?',
            confirmTitleDelete: 'Hapus Hubs',
            textDataCreateSuccess: 'Data Lokasi Hubs Berhasil ditambahkan.',
            textDataUpdateSuccess: 'Data Lokasi Hubs Berhasil diupdate.',
            textDataDeleteSuccess: '1 Items Berhasil dihapus.',
            textMemuatData: 'Masih memuat data',
            textErrorNetwork: 'Jaringan Bermasalah',
            forms:{
                name: '',
                spkId: '',
                spkName: '',
                stroreId: '',
                stroreName: '',
                address: '',
                latitude: '',
                longitude: ''
            },
            rules:{
                name: [ { required: true, message: 'Inputan harus diisi', trigger: 'blur' } ],
                spkName: [ { required: true, message: 'Inputan harus diisi', trigger: 'blur' } ],
                stroreName: [ { required: true, message: 'Inputan harus diisi', trigger: 'blur' } ],
                address: [ { required: true, message: 'Inputan harus diisi', trigger: 'blur' } ],
            },
            dataAddress: '',
            dataLatitute: '',
            dataLongitute: '',
            fontsIcons:{
                edit: faEdit,
                delete: faTrashAlt,
                detail: faInfoCircle,
                history: faHistory
            }
        }
    },
    created(){
        FUNCTIONS.checkPermissions(this.$dataRole['service.offlinehub.get.hub'])
    },
    watch:{
        searchQuery: function(newValue){
            this.getResult(newValue)
            document.querySelector('.el-pagination').children[1].children[0].click()
        }
    },
    mounted(){
        this.getPost(this.searchQuery)
        this.getUserAll('')
        this.getStoreAll('')
        this.initCreateFunction()
    },
    methods:{
        getPost(search){
            this.loading = true
            let url = this.urlService + this.sectionApi + '&limit=' + this.perPage + '&page=' + this.currentPage + '&keyword=' + search + '&direction=DESC' + '&orderBy=createdAt'
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsData = response.data.data.rows
                    this.totalPage = response.data.data.total
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
                    message: 'Gagal mendapatkan data Hubs'
                });
            })
            .finally(() => {
                this.loading = false
            })
        },
        getResult: _.debounce(function(search){ 
            this.getPost(search)
        }, 500),
        getUserAll(search){
            let userDataurl = this.apiURL + this.sectionApiUser + '?limit=20&role=4&direction=ASC&order=fullname&page=1&search=' + search
            this.searchLoading = true
            this.axios.get(userDataurl)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsSPK = response.data.data
                    this.searchLoading = false
                }
            })
            .catch(error => {
                this.$notify.error({
                    title: 'Error Get Store',
                    message: error.response.data.message
                });
            })
            .finally(() => {
                this.searchLoading = false
            })
        },
        getStoreAll(search){
            let userDataurl = this.apiURL + this.sectionApiUser + '?limit=20&role=10&direction=ASC&order=fullname&page=1&search=' + search
            this.searchStore = true
            this.axios.get(userDataurl)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsStore = response.data.data
                    this.searchStore = false
                }
            })
            .catch(error => {
                this.$notify.error({
                    title: 'Error Get Store',
                    message: error.response.data.message
                });
            })
            .finally(() => {
                this.searchStore = false
            })
        },
        submitSave(formName, formtype){
            let loadingform = FUNCTIONS.svgSpinner;
            this.messagesuccess = ''
            this.messageerror = ''
            let dataLocations = this.$refs.locationsHubForms.hubsLocations
            this.forms.address = this.$refs.locationsHubForms.valueAddress
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    if(formtype == 'save'){
                        document.getElementById('save').children[0].innerHTML = loadingform
                        let urlv = this.urlService + this.sectionApi + '/create'
                        this.forms.latitude = ''+ dataLocations.latitute + ''
                        this.forms.longitude = ''+ dataLocations.longitute + ''
                        this.postFunction('post', this.forms, urlv)
                    }else{
                        document.getElementById('save-edit').children[0].innerHTML = loadingform
                        let urlv = this.urlService + this.sectionApi + '/update/' + this.itemDataDetail.id
                        this.forms.latitude = ''+ dataLocations.latitute + ''
                        this.forms.longitude = ''+ dataLocations.longitute + ''
                        this.postFunction('put', this.forms, urlv)
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
                this.loading = true
                let url = this.urlService + this.sectionApi + '/delete/' + id
                this.postFunction('delete', '', url)
                this.initClickCreateFunction('hide')
            })
        },
        getSPKbyId(id){
            let urlUser = this.apiURL + this.sectionApiUser + '/' + id
            this.axios.get(urlUser)
            .then(response => {
                if(response.data.status == 'success'){
                    let dataSPK = response.data.data
                    this.forms.spkId = dataSPK.id
                    this.forms.spkName = dataSPK.fullname + ' / ' + dataSPK.username + ' / ' + dataSPK.phone_number
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        getStorebyId(id){
            let urlUser = this.apiURL + this.sectionApiUser + '/' + id
            this.axios.get(urlUser)
            .then(response => {
                if(response.data.status == 'success'){
                    let dataStore = response.data.data
                    this.forms.stroreId = dataStore.id
                    this.forms.stroreName = dataStore.fullname + ' / ' + dataStore.username + ' / ' + dataStore.phone_number
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        handleCurrentChange(val){
            if(this.$dataRole['service.offlinehub.get.hub.detail.*']){
                if(val){
                    this.titleForms = this.dataTextUpdate
                    this.formsType = 'edit'
                    let url = this.urlService + this.sectionApi + '/detail/' + val.id
                    this.postFunction('getbyid', '', url)
                    this.initClickCreateFunction('show')
                    this.getUserAll('')
                    this.getStoreAll('')
                    this.getSPKbyId(val.spk_id)
                    this.getStorebyId(val.store_id)
                }
            }else{
                this.$notify.error({
                    title: 'Error',
                    message: 'Anda tidak punya akses'
                });
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
            this.forms.spkId = ''
            this.forms.spkName = ''
            this.forms.stroreId = ''
            this.forms.stroreName = ''
            this.forms.address = ''
            this.forms.latitude = ''
            this.forms.longitude = ''
            this.dataAddress = ''
            this.dataLatitute = ''
            this.dataLongitute = ''
            let dataLocations = this.$refs.locationsHubForms.hubsLocations
            dataLocations.address = ''
            dataLocations.latitute = ''
            dataLocations.longitute = ''
            this.itemsSPK = []
            this.itemsStore = []
        },
        initClickCreateFunction(value){
            if(value == 'show'){
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
                this.searchUserInit()
            }else{
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.searchUserInit()
            }
        },
        postFunction(type, credentials, url){
            if(type == 'post'){
                this.axios.post(url, credentials)
                .then(response => {
                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                    if(response.data.status == 'error'){
                        this.messageerror = response.data.message
                        this.$notify.error({
                            title: 'Error',
                            message: response.data.message
                        });
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
                        this.$notify.error({
                            title: 'Error',
                            message: response.data.message
                        });
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
                let that = this
                this.loadingForm = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemDataDetail = response.data.data
                        this.forms.name = this.itemDataDetail.name
                        this.forms.stroreId = this.itemDataDetail.store_id
                        this.dataAddress = this.itemDataDetail.address
                        this.dataLatitute = this.itemDataDetail.latitude
                        this.dataLongitute = this.itemDataDetail.longitude
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
                    this.loading = false
                    this.closeModal();
                })
            }
        },
        searchUserInit(){
            let that = this
            setTimeout(function(){
                if(document.querySelector('.selectUser') !== null){
                    document.querySelector('.selectUser').addEventListener('click', function(){
                        if(document.querySelector('.dropdown-user')){
                            document.querySelector('.dropdown-user').classList.add('dropdown-showing')
                        }
                    });
                    document.addEventListener('click', function(e){
                        if(!JQuery(e.target).closest('.selectUser, .dropdown-user').length){
                            if(document.querySelector('.dropdown-user')){
                                document.querySelector('.dropdown-user').classList.remove('dropdown-showing')
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
                }
            }, 500)
            setTimeout(function(){
                if(document.querySelector('.selectStore') !== null){
                    document.querySelector('.selectStore').addEventListener('click', function(){
                        if(document.querySelector('.dropdown-store')){
                            document.querySelector('.dropdown-store').classList.add('dropdown-showing')
                        }
                    });
                    document.addEventListener('click', function(e){
                        if(!JQuery(e.target).closest('.selectStore, .dropdown-store').length){
                            if(document.querySelector('.dropdown-store')){
                                document.querySelector('.dropdown-store').classList.remove('dropdown-showing')
                            }
                        }
                    })
                    var textInput2 = document.querySelector('.selectStore');
                    var timeout2 = null;
                    textInput2.onkeyup = function (e) {
                        clearTimeout(timeout2);
                        timeout2 = setTimeout(function () {
                            that.getStoreAll(textInput2.value)
                            console.log('Input Value:', textInput2.value);
                        }, 800);
                    };
                }
            }, 500)
        },
        filterByUser(user){
            this.forms.spkId = user.id
            this.forms.spkName = user.fullname + ' / ' + user.username + ' / ' + user.phone_number
            JQuery('.dropdown-user').removeClass('dropdown-showing')
        },
        filterByStore(user){
            this.forms.stroreId = user.id
            this.forms.stroreName = user.fullname + ' / ' + user.username + ' / ' + user.phone_number
            JQuery('.dropdown-store').removeClass('dropdown-showing')
        },
        destroySearchUser(){
            document.querySelector('.selectUser').removeEventListener('click', function(){
                document.querySelector('.dropdown-user').classList.add('dropdown-showing')
            });
            document.removeEventListener('click', function(e){
                if(!JQuery(e.target).closest('.selectUser, .dropdown-user').length){
                    document.querySelector('.dropdown-user').classList.remove('dropdown-showing')
                }
            });
            document.querySelector('.selectUser').onkeyup = ''

            document.querySelector('.selectStore').removeEventListener('click', function(){
                document.querySelector('.dropdown-store').classList.add('dropdown-showing')
            });
            document.removeEventListener('click', function(e){
                if(!JQuery(e.target).closest('.selectStore, .dropdown-store').length){
                    document.querySelector('.dropdown-store').classList.remove('dropdown-showing')
                }
            });
            document.querySelector('.selectStore').onkeyup = ''
        }
    },
    components: { pageHeader, loadingSvg, CreateLocationsHubs },
    beforeDestroy(){
        this.destroySearchUser()
    }
}
</script>