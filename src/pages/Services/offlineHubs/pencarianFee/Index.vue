<template>
    <div class="content-wrapper">
        <div id="master-barang-attribute">
            <div class="clearfix">
                <div class="page-header float-left">
                    <page-header titleName="Pencairan Fee" :isCreate="false"></page-header>
                </div>
            </div>
            <div class="content">
                <div class="filterSearching clearfix">
                    <el-date-picker
                        class="date-range-picker"
                        v-model="dateRange"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                        :format="format"
                        :value-format="format"></el-date-picker>
                    <div style="float:left;">
                        <el-radio v-model="typeFee" label="spk" border>Crew</el-radio>
                        <el-radio v-model="typeFee" label="store" border>Store</el-radio>
                    </div>
                    <div class="input-with-icons clearfix">
                        <div class="el-input searchtype">
                            <input v-if="typeFee == 'spk'" type="text" v-model="filterQuery" class="el-input__inner selectUser" :placeholder="'Select User by Crew'">
                            <input v-else type="text" v-model="filterQuery" class="el-input__inner selectUser" :placeholder="'Select User by Store'">
                            <img src="~assets/images/icons/arrow-down.png">
                            <div class="dropdown-filterable">
                                <ul>
                                    <div v-if="searchLoading == true">
                                        <li><a href="#" style="text-align:center;">Loading Data</a></li>
                                    </div>
                                    <div v-else>
                                        <div v-if="links.length !== 0">
                                            <li><a href="#" @click.prevent="filterByUser('')">All User</a></li>
                                            <li v-for="(itemUser, indexUser) in links"
                                            :key="indexUser"
                                            :label="itemUser.fullname"
                                            :value="itemUser.username"><a href="#" @click.prevent="filterByUser(itemUser)">
                                                {{itemUser.fullname}} <span v-if="typeFee == 'store'">({{itemUser.username}})</span>
                                            </a></li>
                                        </div>
                                        <div v-else><li><a href="#" style="text-align:center;">No data</a></li></div>
                                    </div>
                                </ul>
                            </div>
                        </div>
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
                    @selection-change="handleSelectionChange"
                    class="mobayar-table">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="User">
                        <template slot-scope="scope">
                            <div v-if="scope.row.user">
                                {{scope.row.user.fullname}}<br>
                                {{scope.row.user.phone_number}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Total">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.total)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Actions" v-if="$dataRole['service.offlinehub.post.fee.claim']">
                        <template slot-scope="scope">
                            <div v-if="scope.row.user">
                                <el-button 
                                    style="font-size:12px;" 
                                    class="button-white-green" 
                                    @click.prevent="ClaimFee(scope.row.user.user_id, scope.row.user.fullname)" 
                                    round>
                                        <font-awesome-icon style="color:#fff;margin-right:3px;" class="fontIcons" :icon="fontsIcons.claim" />
                                        Claim
                                </el-button>
                            </div>
                            <div v-else>
                                <el-button 
                                    style="font-size:12px;" 
                                    class="button-white-green" 
                                    @click.prevent="ClaimFee(scope.row.user.user_id, null)" 
                                    round>
                                        <font-awesome-icon style="color:#fff;margin-right:3px;" class="fontIcons" :icon="fontsIcons.claim" />
                                        Claim
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="mobayar-actions-bottom clearfix">
                    <div class="pagination-result float-right">
                        <span>Showing results 1 - {{itemsData.length}}</span>
                    </div>
                </div>
                <div class="after-checked-section">
                    <div class="page-container">
                        <div class="page-content">
                            <div class="sidebar-checked"></div>
                            <div class="content-wrapper clearfix">
                                <el-checkbox v-model="afterChecked">{{totalChecked}} user terpilih</el-checkbox>
                                <div class="float-right">
                                    <el-button 
                                        class="button-white-green" 
                                        @click.prevent="ClaimFee('all', 'all')" 
                                        round>Claim All</el-button>
                                </div>
                            </div>
                        </div>
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
                                    <h5>Info Attribute</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="24">
                                                <el-form-item label="Key" prop="key">
                                                    <el-input v-model="forms.key"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Value" prop="value">
                                                    <el-input v-model="forms.value"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                            <img src="~assets/images/icons/trash.png" alt="img-trash">
                        </el-button>
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                        <el-button v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
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

import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

let date = new Date();
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

export default {
    name: 'offline-hubs-pencairanfee',
    data(){
        return{
            apiURL: process.env.ROOT_API,
            sectionApi: 'offlinehub?servicePathUrl=fee',
            sectionUnPaid: '/unpaid',
            sectionClaim: '/claim',
            sectionApiUser: 'user',
            sectionApiUserSpkHub: 'offlinehub?servicePathUrl=hub/spk',
            loading: false,
            loadingForm: false,
            itemsData: [],
            itemDataDetail: [],
            searchQuery: '',
            totalPage: '',
            perPage: 10,
            currentPage: 1,
            titleForms: '',
            formsType: '',
            messagesuccess: '',
            messageerror: '',
            dataTextCreate: 'Buat Attribute Barang Offline Hub',
            textMemuatData: 'Masih memuat data',
            textErrorNetwork: 'Jaringan Bermasalah',
            dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
            format: 'yyyy-MM-dd',
            typeFee: 'spk',
            userIdFee: [],
            urlUserId: [],
            afterChecked: true,
            totalChecked: '',
            filterQuery: '',
            links: [],
            searchLoading: false,
            idUser: '',
            forms:{
                key: '',
                value: '',
            },
            rules:{},
            fontsIcons: {
                claim: faExclamationCircle,
            }
        }
    },
    created(){
        FUNCTIONS.checkPermissions(this.$dataRole['service.offlinehub.get.fee.unpaid'])
    },
    watch:{
        dateRange: function(newValue){
            this.getPost(this.idUser)
        },
        typeFee: function(newValue){
            this.getPost('')
            this.getUserAll('', newValue)
            this.filterQuery = ''
            this.idUser = ''
        }
    },
    mounted(){
        this.getPost(this.idUser)
        this.searchUserInit()
        this.getUserAll('', this.typeFee)
    },
    methods:{
        getPost(userid){
            let url
            this.userIdFee = []
            this.loading = true
            if((this.dateRange).length !== 0){
                url = this.urlService + this.sectionApi + this.sectionUnPaid + '&type=' + this.typeFee + '&startDate=' + this.dateRange[0] + '&endDate=' + this.dateRange[1] + '&userId=' + userid
            }else{
                url = this.urlService + this.sectionApi + this.sectionUnPaid + '&type=' + this.typeFee + '&userId=' + userid
            }
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'success'){
                    this.itemsData = response.data.data
                    // this.totalPage = response.data.data.total
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
        searchUserInit(){
            let that = this
            setTimeout(function(){
                document.querySelector('.selectUser').addEventListener('click', function(){
                    if(document.querySelector('.dropdown-filterable')){
                        document.querySelector('.dropdown-filterable').classList.add('dropdown-showing')
                    }
                });
                document.addEventListener('click', function(e){
                    if(!JQuery(e.target).closest('.selectUser, .dropdown-filterable').length){
                        if(document.querySelector('.dropdown-filterable')){
                            document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
                        }
                    }
                })
                var textInput = document.querySelector('.selectUser');
                var timeout = null;
                textInput.onkeyup = function (e) {
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        that.getUserAll(textInput.value, that.typeFee)
                        console.log('Input Value:', textInput.value);
                    }, 800);
                };
            }, 500)
        },
        filterByUser(user){
            let usernameData
            if(user == ''){
                usernameData = ''
                this.filterQuery = ''
                this.idUser = ''
                this.getUserAll('', this.typeFee)
            }else{
                this.filterQuery = user.fullname
                if(this.typeFee == 'spk'){
                    usernameData = user.user_id
                    this.idUser = user.user_id
                }else{
                    usernameData = user.id
                    this.idUser = user.id
                }
            }
            document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
            this.getPost(usernameData)
        },
        getUserAll(search, types){
            let userDataurl
            if(types == 'spk'){
                userDataurl = this.urlService + this.sectionApiUserSpkHub + '&limit=100&direction=ASC&page=1&keyword=' + search
            }else{
                userDataurl = this.apiURL + this.sectionApiUser + '?limit=100&direction=ASC&order=fullname&page=1&search=' + search + '&role=10'
            }
            this.searchLoading = true
            this.axios.get(userDataurl)
            .then(response => {
                if(response.data.status == 'success'){
                    if(types == 'spk'){
                        this.links = response.data.data.rows
                    }else{
                        this.links = response.data.data
                    }
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
        ClaimFee(value, name){
            this.userIdFee = []
            if(value == 'all'){
                this.$confirm('Apakah anda yakin akan menyetujui semua pencairan fee '+this.typeFee+' ?', 'Claim Fee', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.loading = true
                    let url = this.urlService + this.sectionApi + this.sectionClaim
                    this.urlUserId.forEach(function(e){
                        this.userIdFee.push(e.user.user_id)
                    }, this)
                    let dataForms = {
                        endDate: this.dateRange[1],
                        startDate: this.dateRange[0],
                        type: this.typeFee,
                        userId: this.userIdFee,
                    }
                    this.postFunction('post', dataForms, url)
                })
            }else{
                let nameUser
                if(name !== null){
                    nameUser = name
                }else{
                    nameUser = 'user ini'
                }
                this.$confirm('Apakah anda yakin akan menyetujui pencairan fee '+nameUser+'?', 'Claim Fee', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.loading = true
                    let url = this.urlService + this.sectionApi + this.sectionClaim
                    let dataForms = {
                        endDate: this.dateRange[1],
                        startDate: this.dateRange[0],
                        type: this.typeFee,
                        userId: [value],
                    }
                    this.postFunction('post', dataForms, url)
                })
            }
        },
        submitSave(formName, formtype){
            let loadingform = FUNCTIONS.svgSpinner;
            this.messagesuccess = ''
            this.messageerror = ''
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    this.itemsData = []
                    if(formtype == 'save'){
                        document.getElementById('save').children[0].innerHTML = loadingform
                        let urlv = this.urlService + this.sectionApi + '/create'
                        this.postFunction('post', this.forms, urlv)
                    }else{
                        document.getElementById('save-edit').children[0].innerHTML = loadingform
                        let urlv = this.urlService + this.sectionApi + '/update/' + this.itemDataDetail.id
                        this.postFunction('put', this.forms, urlv)
                    }
                }
            })
        },
        closeModal(row){
            this.initClickCreateFunction('hide')
            this.$refs.singleTable.setCurrentRow(row);
            this.$refs.formsvalid.resetFields();
            this.forms.key = ''
            this.forms.value = ''
        },
        postFunction(type, credentials, url){
            if(type == 'post'){
                this.axios.post(url, credentials)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.messagesuccess = 'Pencairan telah di setujui '
                        this.getPost('')
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
                    this.userIdFee = []
                    this.urlUserId = []
                })
            }
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        handleSelectionChange(val) {
            if(val.length != 0){
                document.querySelector('.after-checked-section').classList.add('active')
            }else{
                document.querySelector('.after-checked-section').classList.remove('active')
            }
            this.totalChecked = val.length
            this.urlUserId = val
        },
    },
    components: { pageHeader, loadingSvg }
}
</script>