<template>
    <div class="content-wrapper">
        <div id="user">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Store</h4>
                        <div class="add-actions">
                            <a @click.prevent="Create" class="float-right" v-if="$dataRole['store.create']">
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
                                highlight-current-row
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column prop="username" label="Username" width="120" context="123" class-name="testing123"></el-table-column>
                                <el-table-column prop="email" label="Email" width="210"></el-table-column>
                                <el-table-column prop="fullname" label="Full Name"></el-table-column>
                                <el-table-column prop="phone_number" label="Phone Number"></el-table-column>
                                <el-table-column prop="status" label="Status" width="100"></el-table-column>
                                <el-table-column prop="created_at" label="Created At"></el-table-column>
                                <el-table-column label="Action" align="center" width="70">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark" content="Get QR Code" placement="top">
                                            <a href="#" @click.prevent="handleCurrentChange(scope.row)" style="margin-right: 10px;">
                                                <font-awesome-icon class="fontIcons" :icon="fontsIcons.detail" />
                                            </a>
                                        </el-tooltip>
                                        <el-tooltip v-if="$dataRole['store.delete']" class="item" effect="dark" content="Hapus Store" placement="top">
                                            <a href="#" @click.prevent="deletePost(scope.row.id)">
                                                <font-awesome-icon class="fontIcons" :icon="fontsIcons.delete" />
                                            </a>
                                        </el-tooltip>
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
                                    <section v-if="formsType !== 'edit'">
                                        <div v-if="(messageerror != '')">
                                            <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                                        </div>
                                        <el-form :model="forms" status-icon :rules="rules2" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="24">
                                                            <el-form-item label="User" prop="userId">
                                                                <div class="input-with-icons clearfix">
                                                                    <div class="el-input searchtype">
                                                                        <input type="text" v-model="filterQuery" class="el-input__inner selectUser" placeholder="Select User">
                                                                        <img src="~assets/images/icons/arrow-down.png">
                                                                        <div class="dropdown-filterable">
                                                                            <ul>
                                                                                <div v-if="searchLoading == true">
                                                                                    <li><a style="text-align:center;pointer-event:none;">Loading Data</a></li>
                                                                                </div>
                                                                                <div v-else>
                                                                                    <div v-if="itemsUser.length !== 0">
                                                                                        <li v-for="(itemUser, indexUser) in itemsUser"
                                                                                        :key="indexUser"
                                                                                        :label="itemUser.fullname"
                                                                                        :value="itemUser.username"><a href="#" @click.prevent="filterByUser(itemUser)">{{itemUser.fullname}} ({{itemUser.username}})</a></li>
                                                                                    </div>
                                                                                    <div v-else><li><a style="text-align:center; pointer-event:none;">No data</a></li></div>
                                                                                </div>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                    <section v-else>
                                        <div class="item-forms-details">
                                            <div class="forms-details">
                                                <el-row :gutter="20">
                                                    <!-- <div class="qr-code-user" v-if="itemDataDetail.length !== 0"> -->
                                                    <div class="qr-code-user">
                                                        <div class="qr-code-container">
                                                            <qr-code :text="qrCode" :size="350" bg-color="#fff"></qr-code>
                                                            <div class="img-logo">
                                                                <img src="~assets/images/kode_qr.png">
                                                            </div>
                                                            <!-- <img :src="itemDataDetail.fullurl"> -->
                                                        </div>
                                                        <div class="button-actions clearfix">
                                                            <el-button @click.prevent="downloadQRCode" class="button-white-green" round>Download</el-button>
                                                            <el-button @click.prevent="printFunction" class="button-outline-green" round>Print</el-button>
                                                        </div>
                                                    </div>
                                                    <!-- <div v-else>
                                                        <el-col :span="24">
                                                            <div style="font-weight: bold;text-align:center;">Failed to load QR Code</div>
                                                        </el-col>
                                                    </div> -->
                                                </el-row>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Tutup</el-button>
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
import services from '@/service'
import JQuery from 'jquery'
import FUNCTIONS from '@/functions'
import { faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import html2canvas from 'html2canvas'

export default {
    name: 'user-store',
    data () {
        return {
            // for get api
            apiUrl: process.env.ROOT_API,
            sectionApi: 'user',
            sectionApiQRCode: 'qr/info',
            role: '10',
            output: null,
            roleQuery: '',
            itemsData: [],
            itemsUser: [],
            itemDataDetail: [],
            staticDataDetail: [],
            searchQuery: '',
            loading: true,
            loadingForm: false,
            searchLoading: false,
            errored: false,
            currentPage: 1,
            perPage: 10,
            filterQuery: '',
            totalPage: '',
            afterChecked: true,
            totalChecked: '',
            titleForms: '',
            formsType: '',
            qrCode: '',
            messageerror: '',
            messagesuccess: '',
            messagesuccessPoint: '',
            pointAddError: false,
            pointReduceError: false,
            itemReduceError: false,
            textMemuatData: 'Masih memuat data',
            textErrorNetwork: 'Jaringan Bermasalah',
            fontsIcons: {
                delete: faTrash,
                detail: faInfoCircle
            },
            forms:{
                userId: '',
            },
            rules2:{
                userId: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
            }
        }
    },
    created(){
        FUNCTIONS.checkPermissions(this.$dataRole['store.create'])
    },
    mounted () {
        this.getUserAll('')
        this.searchUserInit()
        this.getPosts(this.perPage, this.currentPage, '', this.role)
    },
    watch: {
        searchQuery: function (newQuestion) {
            this.getResult()
            document.querySelector('.el-pagination').children[1].children[0].click()
        },
    },
    methods: {
        getPosts(limit, page, search, role){
            let url = this.apiUrl + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&role=' + role + '&direction=DESC&order=created_at'
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
                this.$notify.error({
                    title: this.textErrorNetwork,
                    message: 'Gagal mendapatkan data store'
                });
                this.errored = true
            })
            .finally(() => this.loading = false)
        },
        searchUserInit(){
            let that = this
            setTimeout(function(){
                document.querySelector('.selectUser').addEventListener('click', function(){
                    if(document.querySelector('.dropdown-filterable')){
                        if(document.querySelector('.dropdown-filterable') !== null){
                            document.querySelector('.dropdown-filterable').classList.add('dropdown-showing')
                        }
                    }
                });
                document.addEventListener('click', function(e){
                    if(!JQuery(e.target).closest('.selectUser, .dropdown-filterable').length){
                        if(document.querySelector('.dropdown-filterable')){
                            if(document.querySelector('.dropdown-filterable') !== null){
                                document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
                            }
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
            }, 500)
        },
        filterByUser(user){
            document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
            this.filterQuery = user.fullname
            this.forms.userId = user.id
        },
        getUserAll(search){
            let userDataurl = this.apiUrl + this.sectionApi + '?limit=20&role=5&direction=ASC&order=fullname&page=1&search=' + search
            this.searchLoading = true
            this.axios.get(userDataurl)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsUser = response.data.data
                    this.searchLoading = false
                }
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                this.searchLoading = false
            })
        },
        pageChange (page) {
            this.currentPage = page
            this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.role)
        },
        limitChange(limit, event){
            this.perPage = limit
            document.querySelector('.el-pagination').children[1].children[0].click()
            this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.role)
            document.querySelectorAll('.showing-page ul li').forEach(function(a){
                a.classList.remove('active')
            })
            event.target.parentNode.classList.add('active')
        },
        getResult: _.debounce(function(){
            this.getPosts(this.perPage, this.currentPage, this.searchQuery, this.role)
        }, 300),
        async getDetailQRCode(id){
            this.loadingForm = true
            let url = this.apiUrl + this.sectionApiQRCode + "?user_id=" + id + "&type=merchant"
            try{
                const response = await services.getList(url)
                this.loadingForm = false
                if(response.data.status == 'success'){
                    this.itemDataDetail = response.data.data
                }else{
                    FUNCTIONS.notify('error', 'Error', response.data.message)
                }
            }catch(err){
                this.loadingForm = false
                FUNCTIONS.notify('error', this.textErrorNetwork, 'Gagal Mendapatkan data')
            }
        },
        handleCurrentChange(val){
            if(val){
                document.querySelector('.base-template-sidebar').classList.add('showing')
                document.querySelector('.backdrop').classList.add('show')
                document.querySelector('body').classList.add('no-scroll')
                this.titleForms = 'Get QR Code - ' + val.username
                this.formsType = 'edit'
                this.staticDataDetail = val
                // this.getDetailQRCode(val.id)
                let dataQR = 'MRC#' + val.id
                this.itemDataDetail = val
                this.qrCode = window.btoa(dataQR)
                setTimeout(function(){
                    if(document.querySelector('.qr-code-user .qr-code-container > div[title]')){
                        document.querySelector('.qr-code-user .qr-code-container > div[title]').removeAttribute('title')
                    }
                }, 200)
            }
        },
        closeModal(row){
            window.location.hash = ''
            document.querySelector('.base-template-sidebar').classList.remove('showing');
            document.querySelector('.backdrop').classList.remove('show');
            document.querySelector('body').classList.remove('no-scroll');
            this.messageerror = ''
            this.messagesuccess = ''
            this.forms.userId = ''
            this.filterQuery = ''
            this.itemDataDetail = []
            this.$refs.singleTable.setCurrentRow(row);
        },
        Create(){
            if(this.loading == false){
                this.titleForms = "Create Store"
                this.formsType = 'create'
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
            }else{
                this.$notify({
                    type: 'warning',
                    title: 'Maaf',
                    message: this.textMemuatData
                });
            } 
        },
        submitSave(formName, formtype){
            let loadingform = FUNCTIONS.svgSpinner;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(formtype == 'save'){
                        document.getElementById('save').children[0].innerHTML = loadingform
                        let urlv = this.apiUrl + 'store'
                        this.axios.post(urlv, {
                            user_id: this.forms.userId
                        })
                        .then(response => {
                            document.getElementById('save').children[0].innerHTML = 'Simpan'
                            if(response.data.status == 'error'){
                                this.messageerror = response.data.message
                            }else{
                                this.roleQuery = this.forms.role
                                this.messagesuccess = response.data.data.fullname + " Berhasil ditambahkan."
                                this.getPosts(this.perPage, this.currentPage, '', this.role)
                                this.closeModal();
                            }
                        })
                        .catch(error => { 
                            this.$notify.error({
                                title: this.textErrorNetwork,
                                message: 'Gagal meyimpan data'
                            });
                        })
                    }
                } else {
                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        destroySearchUser(){
            document.querySelector('.selectUser').removeEventListener('click', function(){
                document.querySelector('.dropdown-filterable').classList.add('dropdown-showing')
            });
            document.removeEventListener('click', function(e){
                if(!JQuery(e.target).closest('.selectUser, .dropdown-filterable').length){
                    document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
                }
            })
            document.querySelector('.selectUser').onkeyup = ''
        },
        deletePost(valueid){
            this.$confirm('Apakah anda yakin akan menghapus user store dari daftar?', 'Hapus User Store', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                let url = this.apiUrl + this.sectionApi + '/' + valueid
                this.axios.delete(url)
                .then(response => {
                    this.getPosts(this.perPage, this.currentPage, '', this.role)
                })
                .catch(error => { 
                    console.log(error);
                })
                .finally(() => {
                    this.closeModal();
                    this.messagesuccess = "1 Items Berhasil dihapus."
                })
            })
        },
        downloadQRCode(){
            // with canvas //
            let that = this
            setTimeout(function(){
                html2canvas(document.querySelector('.qr-code-container')).then(function(canvas) {
                    canvas.setAttribute('id', 'canvas-images')
                    document.body.appendChild(canvas)
                    var canvasImages = document.getElementById("canvas-images");
                    var img = canvasImages.toDataURL("image/png");
                    let btn = document.createElement("a")
                    btn.setAttribute('class', 'download-qr')
                    btn.setAttribute('download', 'QR Code - '+ that.itemDataDetail.username)
                    btn.setAttribute('href', img)
                    document.body.appendChild(btn)
                    btn.click()
                    document.querySelector('.download-qr').remove() 
                    document.querySelector('#canvas-images').remove() 
                });
            }, 500)

            // with no canvas //
            // let dataImages = document.querySelector('.qr-code-user img').getAttribute('src')
            // let btn = document.createElement("a")
            // btn.setAttribute('class', 'download-qr')
            // btn.setAttribute('download', 'QR Code - '+ this.staticDataDetail.username + '.png')
            // btn.setAttribute('href', dataImages)
            // document.body.appendChild(btn)
            // btn.click()
            // document.querySelector('.download-qr').remove()
        },
        printFunction(){
            window.print()
        }
    },
    computed: {
        parseInt: function(value){
            return parseInt(value)
        },
        itemUserDevice:function() {
            return this.itemsDevice.filter((row, index) => {
                if(row.imei !== null){
                    return row.imei.toLowerCase().indexOf(this.searchDevice.toLowerCase()) > -1
                }
            })
        },
    },
    beforeDestroy(){
        this.destroySearchUser()
    }
}
</script>

<style lang="scss">
#canvas-images{
    display: none;
}
.qr-code-user{
    .qr-code-container{
        &.hided{
            &.hide{
                display: none;
            }
            .img-logo{
                img{
                    width: 200px;
                }
            }
        }
        &.downloaded{
            display: block;
        }
        position: relative;
        // width: 60%;
        margin: 0 auto;
        // padding: 20px;
        .img-logo{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            img{
                width: 100px;
            }
        }
    }
    .button-actions{
        margin-top: 15px;
        // margin-bottom: -15px;
        text-align: center;
        position: relative;
        z-index: 10;
    }
    img{
        margin: 0 auto;
        display: block;
    }   
}
@media print{
    .sidebar-main, #Header, .filterSearching, .mobayar-table, .page-header, .mobayar-actions-bottom, .actions-button{
        display: none !important;
    }
    .base-template-sidebar{
        width: 100%;
        .content{
            height: auto;
            overflow-y: initial;
            header{
                display: none;
            }
            .item-forms-details{
                border-bottom: none;
            }
            .qr-code-user{
                transform: translate(0%, 25%);
                .qr-code-container{
                    &.downloaded{
                        display: none;
                    }
                }
                .button-actions{
                    display: none;
                }
            }
        }
    }
    .content-wrapper{
        & > div{
            padding: 0;
        }
    }
}
</style>
