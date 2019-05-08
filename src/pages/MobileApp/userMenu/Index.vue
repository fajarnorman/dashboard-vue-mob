<template>
    <div class="content-wrapper">
        <div id="user-menu">
            <div class="page-header">
                <page-header titleName="Manage User Menu" :isCreate="true"></page-header>
            </div>
            <div class="content">
                <section v-if="errored">
                    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
                </section>
                <section v-else>
                    <div>
                        <div class="" v-if="itemsData">
                            <div class="content-userMenu">
                                <el-row :gutter="20">
                                    <el-col :span="12" style="position: relative;">
                                        <loading-svg :isLoading="loading"></loading-svg>
                                        <!-- <div class="filterSearching clearfix">
                                            <div class="input-with-icons clearfix">
                                                <el-input v-model="searchQuery" class="float-left"></el-input>
                                                <img src='~assets/images/icons/search1.png'>
                                            </div>
                                        </div> -->
                                        <div v-if="messagesuccess !== ''">
                                            <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                                        </div>
                                        <div class="content-user-drags" v-if="(itemsData).length !== 0">
                                            <div
                                                v-for="(dataCat, indexCat) in itemsData" 
                                                :key="indexCat"
                                                class="item-kategori">
                                                <div class="item-head clearfix">
                                                    <h5 class="float-left">
                                                        <a href="#" @click.prevent="" :dataId="dataCat.id" class="handle-sort"><font-awesome-icon class="fontIcons" :icon="fontsIcons.drags" /></a>
                                                        {{dataCat.name}}
                                                        <span class="inline badge success" v-if="dataCat.status == 'active'">{{dataCat.status}}</span>
                                                        <span class="inline badge failed" v-else>{{dataCat.status}}</span>
                                                    </h5>
                                                    <div class="actions-buttons float-right">
                                                        <el-tooltip class="item" effect="dark" content="Edit Kategori" placement="top">
                                                            <a @click.prevent="handleCurrentChange('category', dataCat)" style="margin-right: 15px;"><font-awesome-icon class="fontIcons" :icon="fontsIcons.edit" /></a>
                                                        </el-tooltip>
                                                        <el-tooltip class="item" effect="dark" content="Create Menu" placement="top">
                                                            <a @click.prevent="handleCurrentChange('menu-create', dataCat)" style="margin-right: 15px;"><font-awesome-icon class="fontIcons" :icon="fontsIcons.create" /></a>
                                                        </el-tooltip>
                                                    </div>
                                                </div>
                                                <div class="content-items" v-if="(dataCat.menus).length !== 0">
                                                    <ul class="content-menu-items-inside">
                                                        <li 
                                                            class="clearfix"
                                                            v-for="(dataMenu, indexMenu) in dataCat.menus"
                                                            :key="indexMenu">
                                                            <span class="float-left">
                                                                <a href="#" @click.prevent="" :dataId="dataMenu.id" class="handle-sort-insidemenu"><font-awesome-icon class="fontIcons" :icon="fontsIcons.drags" /></a>
                                                                {{dataMenu.label}}
                                                            </span>
                                                            <div class="actions-button float-right">
                                                                <el-tooltip class="item" effect="dark" content="Edit Menu" placement="top">
                                                                    <a @click.prevent="handleCurrentChange('menu-edit', dataMenu)" style="margin-right: 15px;"><font-awesome-icon class="fontIcons" :icon="fontsIcons.editv2" /></a>
                                                                </el-tooltip>
                                                                <el-tooltip v-show="dataMenu.favorite == 0" class="item" effect="dark" content="Set Favorit" placement="top">
                                                                    <a @click.prevent="setFavorit(dataMenu.id, '1')" style="margin-right: 10px;"><font-awesome-icon class="fontIcons" :icon="fontsIcons.favorite" /></a>
                                                                </el-tooltip>
                                                                <el-tooltip class="item" effect="dark" content="Version Menu" placement="top">
                                                                    <span class="badge inline primary">{{dataMenu.min_version}}</span>
                                                                </el-tooltip>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="content-user-drags" v-else>
                                            <div class="nodatas">No Data available</div>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <h4>List Favorit Menu</h4>
                                        <el-table 
                                            :data="itemsDataFavorit" 
                                            max-height="530" 
                                            empty-text="No data available in table"
                                            ref="singleTable"
                                            v-loading="loadingFavorit"
                                            class="mobayar-table">
                                            <el-table-column label="Sort" width="50" align="center">
                                                <template slot-scope="scope">
                                                    <a href="#" @click.prevent="" :dataId="scope.row.id" class="handle-sort-fav"><font-awesome-icon class="fontIcons" :icon="fontsIcons.drags" /></a>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="Icon" width="50">
                                                <template slot-scope="scope">
                                                    <img :src="scope.row.icon_url" style="max-width: 30px;">
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="label" label="Label"></el-table-column>
                                            <el-table-column label="Actions" align="center" width="80">
                                                <template slot-scope="scope">
                                                    <el-tooltip class="item" effect="dark" content="Delete Favorit" placement="top">
                                                        <a href="#" @click.prevent="setFavorit(scope.row.id, '0')" ><font-awesome-icon class="fontIcons" :icon="fontsIcons.delete" /></a>
                                                    </el-tooltip>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-col>
                                </el-row>
                            </div>
                            
                            <!-- Detail, Edit, Create Forms -->
                            <div class="base-template-sidebar">
                                <!-- loading bar -->
                                <loading-svg :isLoading="loadingForm"></loading-svg>

                                <div class="content">
                                    <header class="clearfix">
                                        <h4>{{titleForms}}</h4>
                                        <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                                    </header>
                                    <section>
                                        <div v-if="(messageerror != '')">
                                            <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                                        </div>
                                        <el-form v-show="formsTypeMenu == false" :model="forms" status-icon :rules="rules2" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <h5>Info Category Menu</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="24">
                                                            <el-form-item label="Nama" prop="name">
                                                                <el-input v-model="forms.name"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <!-- <el-col :span="12">
                                                            <el-form-item label="Sequence" prop="sequence">
                                                                <el-input v-model="forms.sequence"></el-input>
                                                            </el-form-item>
                                                        </el-col> -->
                                                        <el-col :span="24">
                                                            <el-form-item label="Status" prop="status">
                                                                <el-radio-group v-model="forms.status">
                                                                    <el-radio label="active">Active</el-radio>
                                                                    <el-radio label="inactive">InActive</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                        <el-form v-show="formsTypeMenu == true" :model="formsMenu" :rules="rules2Menu" ref="formsvalidMenu" label-width="120px" class="demo-ruleFormMenu">
                                            <div class="item-forms-details">
                                                <h5>Info Menu</h5>
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="24">
                                                            <el-form-item label="Label" :class="{'is-error' : errorFormsMenuLabel}">
                                                                <el-input v-model="formsMenu.label"></el-input>
                                                                <div class="el-form-item__error" v-if="errorFormsMenuLabel">
                                                                    Inputan harus di isi
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Slug" :class="{'is-error' : errorFormsMenuSlug}">
                                                                <el-input v-model="formsMenu.slug"></el-input>
                                                                <div class="el-form-item__error" v-if="errorFormsMenuSlug">
                                                                    Inputan harus di isi
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Favorit">
                                                                <el-radio-group v-model="formsMenu.favorite">
                                                                    <el-radio label="1">Ya</el-radio>
                                                                    <el-radio label="0">Tidak</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Tag">
                                                                <el-input v-model="formsMenu.tag" placeholder="BETA, NEW"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Minimum Version" :class="{'is-error' : errorFormsMenuVersion}">
                                                                <el-input v-model="formsMenu.min_version" type="number"></el-input>
                                                                <div class="el-form-item__error" v-if="errorFormsMenuVersion">
                                                                    Inputan harus di isi
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Status">
                                                                <el-radio-group v-model="formsMenu.status">
                                                                    <el-radio label="active">Active</el-radio>
                                                                    <el-radio label="inactive">InActive</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Additional Data">
                                                                <a @click.prevent="incrementMenuAdditional" class="incrementAdditionalData"><font-awesome-icon class="fontIcons" :icon="fontsIcons.create" /></a>
                                                                <el-row :gutter="20">
                                                                    <div 
                                                                        v-for="(data, index) in formsMenu.additionalData"
                                                                        :key="index">
                                                                        <el-col :span="11">
                                                                            <el-input v-model="formsMenu.additional_key[index]" placeholder="Key"></el-input>
                                                                        </el-col>
                                                                        <el-col :span="11">
                                                                            <el-input v-model="formsMenu.additional_value[index]" placeholder="Value"></el-input>
                                                                        </el-col>
                                                                        <el-col :span="2">
                                                                            <a href="#" @click.prevent="removeAdditionalData(index)"><font-awesome-icon class="fontIcons" :icon="fontsIcons.delete" /></a>
                                                                        </el-col>
                                                                    </div>
                                                                </el-row>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Icon">
                                                                <form ref="fileform" class="fileForm">
                                                                    <div class="custom-upload-images">
                                                                        <div class="img-first-step" v-show="(progressFirst == false)">
                                                                            <span class="img-upload-tittle"><img src="~assets/images/icons/image.png"></span>
                                                                            <div class="text">Drag and drop your image here or <a href="#" @click.prevent="uploadTrigger">Browse</a></div>
                                                                            <input type="file" id="imagesIcons" accept="image/*" @change="handleUpload" class="custom-upload-tag">
                                                                        </div>
                                                                        <div class="progressbar-content" v-show="(progressShow == true)">
                                                                            <h4>Uploading your image</h4>
                                                                            <div class="progressbar">
                                                                                <div class="myBar" id="myBar"></div>
                                                                            </div>
                                                                            <div class="file-info">
                                                                                <span class="percentage"></span> of {{formatBytes(files.size)}} uploaded
                                                                            </div>
                                                                        </div>
                                                                        <div class="result-upload-img" v-show="(doneProgress == true)">
                                                                            <div class="file-listing">
                                                                                <img class="preview" id="previews" v-bind:ref="'preview'"/>
                                                                                <span v-if="files">{{ files.name }}</span>
                                                                                <div class="status-container" @click.prevent="uploadTrigger">Edit</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                                <div class="el-form-item__error" v-if="errorFormsMenuIcons">
                                                                    Inputan harus di isi
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix" v-if="formsTypeMenu == false">
                                    <el-button v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                                    <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                                </div>
                                <div class="actions-button clearfix" v-else>
                                    <el-button v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalidMenu', 'edit')">Simpan</el-button>
                                    <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalidMenu', 'save')">Simpan</el-button>
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
import JQuery from 'jquery'
import SortTable from 'sortablejs'

import FUNCTIONS from '@/functions'
import pageHeader from '@/components/partials/pageHeader.vue'
import loadingSvg from '@/components/partials/loadingSvg.vue'
import { 
    faEdit, 
    faPlusCircle, 
    faPencilAlt, 
    faArrowsAlt, 
    faSortAmountDown,
    faHeart, 
    faStar,
    faTimes
} from '@fortawesome/free-solid-svg-icons'

export default {
    name: 'userMenu',
    components: { pageHeader, loadingSvg },
    data () {
        return {
            // for get api
            apiUrl: process.env.ROOT_API,
            sectionApi: 'categoryMenu',
            sectionApiMenu: 'userMenu',

            // for store data after get api
            itemsData: [],
            itemsDataMenu: [],
            itemsDataFavorit: [],
            itemDataDetail: [],

            // another important variable data
            searchQuery: '',
            loading: true,
            loadingFavorit: false,
            loadingForm: false,
            errored: false,
            currentPage: 1,
            perPage: 50,
            totalPage: '',
            afterChecked: true,
            totalChecked: '',
            titleForms: '',
            formsType: '',
            formsTypeMenu: false,
            dataSortTable: '',
            dataSortTableMenu: '',
            dataSortTableFav: '',
            checkedfav: [],
            typeSetMenu: false,

            // message variable
            messageerror: '',
            messagesuccess: '',

            dataTextCreate: 'Buat Kategori Menu',
            dataTextUpdate: 'Edit Kategori Menu',
            confirmDescDelete: 'Anda yakin akan menghapus data dari daftar?',
            confirmDescEdit: 'Anda yakin akan mengganti data dari daftar?',
            confirmTitleDelete: 'Hapus?',
            textDataCreateSuccess: 'Item Berhasil ditambahkan.',
            textDataUpdateSuccess: 'Item Berhasil diupdate.',
            textDataDeleteSuccess: '1 Items Berhasil dihapus.',
            textMemuatData: 'Masih memuat data',
            textErrorNetwork: 'Jaringan Bermasalah',

            // for create, detail, edit forms and validation
            forms:{
                name: '',
                status: 'active'
            },
            formsMenu:{
                label: '',
                slug: '',
                mobile_category_menus_id: '',
                favorite: '1',
                tag: '',
                status: 'active',
                min_version: '',
                additionalData: 0,
                additional_key: [],
                additional_value: [],
            },
            rules2:{
                name: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                status: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
            },
            rules2Menu:{
                label: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                slug: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
            },
            fontsIcons: {
                edit: faEdit,
                editv2: faPencilAlt,
                create: faPlusCircle,
                drags: faArrowsAlt,
                sorts: faSortAmountDown,
                favorite: faStar,
                delete: faTimes
            },
            progressShow: false,
            doneProgress: false,
            progressFirst: false,
            dragAndDropCapable: false,
            files: '',
            filesEdit: '',
            uploadPercentage: 0,
            errorFormsMenuLabel: false,
            errorFormsMenuSlug: false,
            errorFormsMenuIcons: false,
            errorFormsMenuVersion: false,
        }
    },
    created (){
        FUNCTIONS.checkRolesIsSuperAdmin(this.$getRoles)
    },
    mounted () {
        if(this.$getRoles == 1){
            let that = this
            this.initCreateFunction()
            this.initNumberValidation()
            this.getPosts(this.searchQuery)
            this.getPostsFavorit()
            setTimeout(function(){
                that.dragInit()
            }, 500)
        }else{
            this.$notify.error({
                title: 'Error',
                message: 'Anda tidak punya akses'
            });
        }
    },
    watch: {
        searchQuery: function (newQuestion) {
            this.getResult()
            document.querySelector('.el-pagination').children[1].children[0].click()
        }
    },
    methods: {
        getPosts(search){
            let url = this.apiUrl + this.sectionApi + "?limit=" + this.perPage + "&page=" + this.currentPage + '&search=' + search + '&direction=ASC&order=sequence'
            this.loading = true
            this.itemsData = []
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'error'){
                    this.errored = true
                    if(response.data.message == 'Unable to authenticate with invalid API key and token.'){
                        FUNCTIONS.logout('expired-token', response.data.message)
                    }
                }else{
                    this.itemsData = response.data.data
                    this.itemsData.forEach(function(e){
                        this.itemsDataMenu.push(e.menus)
                    }, this)


                }
            })
            .catch(error => { 
                this.$notify.error({
                    title: 'Error',
                    message: this.textErrorNetwork
                }); 
            })
            .finally(() => {
                this.loading = false
                let that = this
                setTimeout(function(){
                    that.sortsItems('category')
                }, 500)
            })
        },
        getPostsFavorit(){
            let url = this.apiUrl + this.sectionApiMenu + '/favorite' + "?limit=" + this.perPage + "&page=" + this.currentPage + '&direction=ASC&order=sequence_favorite'
            this.loadingFavorit = true
            this.itemsDataFavorit = []
            this.axios.get(url)
            .then(response => {
                if(response.data.status == 'error'){
                    this.errored = true
                    if(response.data.message == 'Unable to authenticate with invalid API key and token.'){
                        FUNCTIONS.logout('expired-token', response.data.message)
                    }
                }else{
                    this.itemsDataFavorit = response.data.data
                }
            })
            .catch(error => { 
                this.$notify.error({
                    title: 'Error',
                    message: this.textErrorNetwork
                }); 
            })
            .finally(() => {
                this.loadingFavorit = false
                let that = this
                setTimeout(function(){
                    that.sortsItems('favorit')
                }, 500)
            })
        },
        getResult: _.debounce(function(){
            this.getPosts(this.searchQuery)
        }, 500),
        submitSave(formName, formtype){
            let loadingform = FUNCTIONS.svgSpinner;
            this.messagesuccess = ''
            this.messageerror = ''            
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    if(this.files !== null){
                        if(this.formsTypeMenu == false){
                            if(formtype == 'save'){
                                document.getElementById('save').children[0].innerHTML = loadingform
                                let url = this.apiUrl + this.sectionApi
                                this.postFunction('post', this.forms, url)
                            }else{
                                document.getElementById('save-edit').children[0].innerHTML = loadingform
                                let url = this.apiUrl + this.sectionApi + '/' + this.itemDataDetail.id
                                this.postFunction('put', this.forms, url)
                            }
                        }else{
                            let dataError = []
                            let validationLabel = (this.formsMenu.label == '') ? (dataError.push('error'), this.errorFormsMenuLabel = true) : this.errorFormsMenuLabel = false
                            let validationSlug = (this.formsMenu.slug == '') ? (dataError.push('error'), this.errorFormsMenuSlug = true) : this.errorFormsMenuSlug = false
                            let validationIcons = (this.files == null || this.files == '') ? (dataError.push('error'), this.errorFormsMenuIcons = true) : this.errorFormsMenuIcons = false
                            let validationVersion = (this.formsMenu.min_version == '') ? (dataError.push('error'), this.errorFormsMenuVersion = true) : this.errorFormsMenuVersion = false
                            if(dataError.length == 0){
                                if(formtype == 'save'){
                                    document.getElementById('save').children[0].innerHTML = loadingform
                                    let url = this.apiUrl + this.sectionApiMenu
                                    const formData = new FormData()
                                    formData.append('label', this.formsMenu.label)
                                    formData.append('slug', this.formsMenu.slug)
                                    formData.append('mobile_category_menus_id', this.formsMenu.mobile_category_menus_id)
                                    formData.append('favorite', this.formsMenu.favorite)
                                    formData.append('min_version', this.formsMenu.min_version)
                                    formData.append('icon', this.files)
                                    formData.append('tag', this.formsMenu.tag)
                                    formData.append('status', this.formsMenu.status)
                                    for(let i=0;i<this.formsMenu.additionalData;i++){
                                        formData.append('additional_key['+i+']', this.formsMenu.additional_key[i])
                                        formData.append('additional_value['+i+']', this.formsMenu.additional_value[i])
                                    }
                                    this.postFunction('post', formData, url)
                                }else{
                                    document.getElementById('save-edit').children[0].innerHTML = loadingform
                                    let url = this.apiUrl + this.sectionApiMenu + '/' + this.itemDataDetail.id
                                    const formDataUpdate = new FormData()
                                    formDataUpdate.append('label', this.formsMenu.label)
                                    formDataUpdate.append('slug', this.formsMenu.slug)
                                    formDataUpdate.append('mobile_category_menus_id', this.formsMenu.mobile_category_menus_id)
                                    formDataUpdate.append('favorite', this.formsMenu.favorite)
                                    formDataUpdate.append('min_version', this.formsMenu.min_version)
                                    if(this.files['type'] != undefined){
                                        formDataUpdate.append('icon', this.files)
                                    }
                                    formDataUpdate.append('tag', this.formsMenu.tag)
                                    formDataUpdate.append('status', this.formsMenu.status)
                                    for(let i=0;i<this.formsMenu.additionalData;i++){
                                        formDataUpdate.append('additional_key['+i+']', this.formsMenu.additional_key[i])
                                        formDataUpdate.append('additional_value['+i+']', this.formsMenu.additional_value[i])
                                    }
                                    this.postFunction('post', formDataUpdate, url)
                                }
                            }
                        }
                    }else{
                        this.$notify.error({
                            title: 'Error',
                            message: 'Icons Tidak boleh kosong'
                        });
                    }
                } else {
                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                    document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        deletePost(id){
            this.$confirm(this.confirmDescDelete, this.confirmTitleDelete, {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.loading = true
                if(this.formsTypeMenu == false){
                    let url = this.apiUrl + this.sectionApi + '/' + id
                    this.postFunction('delete', '', url)
                }else{
                    let url = this.apiUrl + this.sectionApiMenu + '/' + id
                    this.postFunction('delete', '', url)
                }
                this.initClickCreateFunction('hide')
            })
        },
        handleCurrentChange(type, val){
            if(val){
                if(type == 'menu-create'){
                    this.titleForms = 'Buat Menu di Kategori : ' + val.name
                    this.formsType = 'save'
                    this.formsTypeMenu = true
                    this.loadingForm = false
                    this.formsMenu.mobile_category_menus_id = val.id
                    this.initClickCreateFunction('show')
                }else if(type == 'menu-edit'){
                    this.titleForms = 'Edit Menu'
                    this.formsType = 'edit'
                    this.formsTypeMenu = true
                    this.loadingForm = false
                    let url = this.apiUrl + this.sectionApiMenu + "/" + val.id
                    this.initClickCreateFunction('show')
                    this.postFunction('getbyid', '', url)
                }else{
                    this.titleForms = this.dataTextUpdate
                    this.formsType = 'edit'
                    this.formsTypeMenu = false
                    this.loadingForm = true
                    let url = this.apiUrl + this.sectionApi + "/" + val.id
                    this.initClickCreateFunction('show')
                    this.postFunction('getbyid', '', url)
                }
            }
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
        initCreateFunction(){
            let that = this
            setTimeout(function(){
                document.querySelector('.add-click-forms').addEventListener('click', function(){ 
                    if(that.loading == false){
                        that.titleForms = that.dataTextCreate
                        that.formsType = 'create'
                        that.formsTypeMenu = false
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
        closeModal(){
            document.querySelector('.base-template-sidebar').classList.remove('showing');
            document.querySelector('.backdrop').classList.remove('show');
            document.querySelector('body').classList.remove('no-scroll');
            this.forms.name = ''
            this.forms.status = 'active'
            this.formsMenu.label = ''
            this.formsMenu.slug = ''
            this.formsMenu.mobile_category_menus_id = ''
            this.formsMenu.favorite = '1'
            this.formsMenu.tag = ''
            this.formsMenu.status = 'active'
            this.formsMenu.min_version = ''
            this.formsMenu.additionalData = 0
            this.formsMenu.additional_key = []
            this.formsMenu.additional_value = []
            this.files = ''
            this.progressShow = false
            this.doneProgress = false
            this.progressFirst = false
            if(document.getElementById('imagesIcons')){
                document.getElementById('imagesIcons').value = ""
            }
            this.$refs['formsvalid'].resetFields();
            this.$refs['formsvalidMenu'].resetFields();
            this.errorFormsMenuLabel = false
            this.errorFormsMenuSlug = false
        },
        postFunction(type, credentials, url){
            if(type == 'post'){
                this.axios.post(url, credentials)
                .then(response => {
                    if(response.data.status == 'error'){
                        this.$notify.error({
                            title: 'Error',
                            message: response.data.message
                        });
                    }else{
                        if(this.formsType == 'edit'){
                            this.messagesuccess = this.textDataUpdateSuccess
                            if(document.getElementById('save-edit')){
                                document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                            }
                        }else{
                            this.messagesuccess = this.textDataCreateSuccess
                            if(document.getElementById('save')){
                                document.getElementById('save').children[0].innerHTML = 'Simpan'
                            }
                        }
                        this.getPosts('')
                        this.getPostsFavorit()
                        this.closeModal()
                    }
                })
                .catch(error => { 
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal menyimpan data'
                    });
                    if(document.getElementById('save-edit')){
                        document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                    }
                    if(document.getElementById('save')){
                        document.getElementById('save').children[0].innerHTML = 'Simpan'
                    }
                })
            }else if(type == 'put'){
                this.axios.put(url, credentials)
                .then(response => {
                    document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                    if(response.data.status == 'error'){
                        this.messageerror = response.data.message
                    }else{
                        this.messagesuccess = this.textDataUpdateSuccess
                        this.getPosts('')
                        this.closeModal();
                    }
                })
                .catch(error => { 
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: 'Gagal mengedit data'
                    });
                    if(document.getElementById('save-edit')){
                        document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                    }
                    if(document.getElementById('save')){
                        document.getElementById('save').children[0].innerHTML = 'Simpan'
                    }
                })
            }else if(type == 'getbyid'){
                this.loadingForm = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemDataDetail = response.data.data
                        if(this.formsTypeMenu == false){
                            this.forms.name = this.itemDataDetail.name
                            this.forms.status = this.itemDataDetail.status
                        }else{
                            this.formsMenu.label = this.itemDataDetail.label
                            this.formsMenu.slug = this.itemDataDetail.slug
                            this.formsMenu.mobile_category_menus_id = this.itemDataDetail.mobile_category_menus_id
                            this.formsMenu.favorite = (this.itemDataDetail.favorite).toString()
                            this.formsMenu.min_version = this.itemDataDetail.min_version
                            this.formsMenu.tag = this.itemDataDetail.tag
                            this.formsMenu.status = this.itemDataDetail.status
                            if(this.itemDataDetail.additional_data !== null){
                                this.formsMenu.additionalData = Object.keys(this.itemDataDetail.additional_data).length
                                Object.keys(this.itemDataDetail.additional_data).forEach(function(key){
                                    this.formsMenu.additional_key.push(key)
                                    this.formsMenu.additional_value.push(this.itemDataDetail.additional_data[key])
                                }, this)
                            }
                            let url = this.itemDataDetail.icon_url
                            let filename = url.substring(url.lastIndexOf('/')+1)
                            this.$refs['preview'].src = this.itemDataDetail.icon_url
                            this.files = {
                                name: filename
                            }
                            this.progressFirst = true
                            this.doneProgress = true
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
                        this.getPosts('')
                        this.getPostsFavorit()
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
            }else if(type == 'updateSequence'){
                this.axios.put(url, credentials)
                .then(response => {
                    if(response.data.status == 'error'){
                        this.$notify.error({
                            title: 'Error',
                            message: response.data.message
                        });
                    }else{
                        this.$notify({
                            type: 'success',
                            title: 'Success',
                            message: "Posisi Berhasil diubah."
                        });
                    }
                })
                .catch(error => {
                    this.$notify({
                        title: this.textErrorNetwork,
                        message: 'Gagal mengedit data'
                    });
                })
                .finally(() => {
                    this.loading = false
                    this.loadingFavorit = false
                    this.getPosts('')
                    this.getPostsFavorit()
                })
            }else if(type == 'setFavorite'){
                this.axios.post(url, credentials)
                .then(response => {
                    if(response.data.status == 'error'){
                        this.$notify.error({
                            title: 'Error',
                            message: response.data.message
                        });
                    }else{
                        if(this.typeSetMenu == true){
                            this.$notify({
                                type: 'success',
                                title: 'Success',
                                message: "Menu Berhasil di jadikan Favorit"
                            });
                        }else{
                            this.$notify({
                                type: 'success',
                                title: 'Success',
                                message: "Menu Favorit Berhasil dihapus"
                            });
                        }
                        this.getPosts(this.searchQuery)
                        this.getPostsFavorit()
                    }
                })
                .catch(error => {
                    this.$notify({
                        title: this.textErrorNetwork,
                        message: 'Gagal mengedit data'
                    });
                })
            }
        },
        initNumberValidation(){
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
        sortsItems(type){
            let that = this
            if(type == 'category'){
                var el = document.querySelector('.content-user-drags');
                this.dataSortTable = SortTable.create(el,{
                    animation: 150,
                    handle: '.handle-sort',
                    group: 'a',
                    ghostClass: 'ghost',
                    forceFallback: true,
                    scroll: true,
                    bubbleScroll: true,
                    onEnd: function (evt) {
                        var itemEl = evt.item;
                        var newIndexs = evt.newIndex + 1
                        var dataID = itemEl.children[0].children[0].children[0].getAttribute("dataId")
                        that.updatePosition('category-menu' , dataID, newIndexs)
                    },
                });

                var elmenu = document.querySelectorAll('.content-menu-items-inside');
                elmenu.forEach(function(e){
                    that.dataSortTableMenu = SortTable.create(e,{
                        animation: 150,
                        handle: '.handle-sort-insidemenu',
                        onEnd: function (evt) {
                            var itemEl = evt.item;
                            var newIndexs = evt.newIndex + 1
                            var dataID = itemEl.children[0].children[0].getAttribute("dataId")
                            that.updatePosition('menu' , dataID, newIndexs)
                        },
                    });
                })
            }else{
                var elfav = document.querySelector('.el-table__body-wrapper tbody');
                this.dataSortTableFav = SortTable.create(elfav,{
                    animation: 150,
                    handle: '.handle-sort-fav',
                    onEnd: function (evt) {
                        var itemEl = evt.item;
                        var newIndexs = evt.newIndex + 1
                        var dataID = itemEl.children[0].children[0].children[0].getAttribute("dataId")
                        that.updatePosition('menufav' , dataID, newIndexs)
                    },
                });
            }
        },
        updatePosition(type, id, value){
            if(type == 'category-menu'){
                let urlv = this.apiUrl + this.sectionApi + '/setSequence/' + id
                this.loading = true
                let dataSequece = {
                    sequence: value
                }
                this.postFunction('updateSequence', dataSequece, urlv)
            }else if(type == 'menu'){
                let urlv = this.apiUrl + this.sectionApiMenu + '/setSequence/' + id
                this.loading = true
                let dataSequece = {
                    sequence: value
                }
                this.postFunction('updateSequence', dataSequece, urlv)
            }else{
                let urlv = this.apiUrl + this.sectionApiMenu + '/setSequenceFavorite/' + id
                this.loadingFavorit = true
                let dataSequece = {
                    sequence: value
                }
                this.postFunction('updateSequence', dataSequece, urlv)
            }
        },
        setFavorit(id, value){
            let url = this.apiUrl + this.sectionApiMenu + '/setFavorite/' + id
            this.loading = true
            this.loadingFavorit = true
            let dataForms = {
                favorite: value
            }
            this.typeSetMenu = (value == '1') ? true : false
            this.postFunction('setFavorite', dataForms, url)
        },
        removeAdditionalData(index){
            this.formsMenu.additional_key.splice(index, 1)
            this.formsMenu.additional_value.splice(index, 1)
            this.formsMenu.additionalData--
        },
        uploadTrigger(){
            if(document.querySelector('.custom-upload-tag').length != 0){
                document.querySelector('.custom-upload-tag').click('click')
            }
        },
        handleUpload(event){
            // if ( /\.(jpe?g|png|gif)$/i.test( event.target.files[0].name ) ) {
                if(event.target.files[0].size < 512000){
                    this.files = event.target.files[0]
                    this.progressFirst = true
                    this.move()
                }else{
                    this.$message.error('Maaf, Ukuran Images tidak boleh lebih dari 512KB');
                }
            // }else{
                // this.$message.error('Maaf, yang boleh di upload hanya images');
            // }
        },
        getImagePreviews(){
            // if ( /\.(jpe?g|png|gif)$/i.test( this.files.name ) ) {
                let reader = new FileReader();
                reader.addEventListener("load", function(){
                    this.$refs['preview'].src = reader.result;
                }.bind(this), false);
                reader.readAsDataURL( this.files);
            // }
        },
        formatBytes(bytes,decimals) {
            if(bytes == 0) return '0 Bytes';
            var k = 1024,
                dm = decimals || 2,
                sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        },
        move() {
            let elem = document.getElementById("myBar");
            let percentageTag = document.querySelector('.file-info .percentage');
            let that = this
            let width = 1;
            this.progressShow = true
            this.doneProgress = false
            let id = setInterval(frame, 10);
            function frame() {
                if (width >= 100) {
                    clearInterval(id);
                    that.getImagePreviews()
                    that.progressShow = false
                    that.doneProgress = true
                } else {
                    width++; 
                    percentageTag.innerHTML = width + '%'
                    elem.style.width = width + '%'; 
                }
            }
        },
        dragInit(){
            this.dragAndDropCapable = this.determineDragAndDropCapable();
            if( this.dragAndDropCapable ){
                ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( function( evt ) {
                    this.$refs.fileform.addEventListener(evt, function(e){
                        console.log(evt)
                        if(evt == 'dragenter'){
                            document.querySelector('.fileForm').classList.add("dragging");
                        }
                        if(evt == 'drop'){
                            document.querySelector('.fileForm').classList.remove("dragging");
                        }
                        e.preventDefault();
                        e.stopPropagation();
                    }.bind(this), false);
                }.bind(this));

                this.$refs.fileform.addEventListener('drop', function(e){
                    // if ( /\.(jpe?g|png|gif)$/i.test( e.dataTransfer.files[0].name ) ) {
                        if(e.dataTransfer.files[0].size < 512000){
                            this.files = e.dataTransfer.files[0];
                            this.progressFirst = true
                            this.move()
                        }else{
                            this.$message.error('Maaf, Ukuran Images tidak boleh lebih dari 512KB');
                        }
                    // }else{
                    //     this.$message.error('Maaf, yang boleh di upload hanya images');
                    // }
                }.bind(this));
            }
        },
        determineDragAndDropCapable(){
            var div = document.createElement('div');
            return ( ( 'draggable' in div )
                    || ( 'ondragstart' in div && 'ondrop' in div ) )
                    && 'FormData' in window
                    && 'FileReader' in window;
        },
        incrementMenuAdditional(){
            this.formsMenu.additionalData++
        }
    },
}
</script>

<style lang="scss" scoped>
// .content-user-drags{
//     height: 500px;
//     overflow: auto;
// }
.incrementAdditionalData{
    position: absolute;
    left: 8em;
    top: -35px;
    z-index: 10;
    svg{
        font-size: 18px;
    }
}
.nodatas{
    text-align: center;
    font-weight: 600;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #DFE4E8;
}
.item-kategori{
    background: #fff;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 4px;
    border: 1px solid #DFE4E8;
    .actions-buttons{
        .fontIcons{
            font-size: 13px;
        }
    }
    &:last-child{
        margin-bottom: 0;
    }
    h5{
        padding: 0;
        margin: 0;
        margin-top: 3px;
        font-size: 13px;
        span{
            margin-top: -3px;
            margin-left: 5px;
            font-size: 10px;
            padding: 0px 11px;
            line-height: 21px;
            height: 21px;
        }
        .handle-sort{
            margin-right: 5px;
            top: -1px;
            position: relative;
            font-size: 13px;
        }
    }
    .content-items{
        ul{
            list-style: none;
            padding: 0;
            padding-left: 25px;
            margin-top: 15px;
            margin-bottom: 0;
            li{
                background: #fafafa;
                border-radius: 4px;
                margin-bottom: 10px;
                padding: 7px 12px;
                border: 1px solid #DFE4E8;
                .handle-sort-insidemenu{
                    margin-right: 5px;
                    position: relative;
                    top: -1px;
                }
                span{
                    margin-top: 2px;
                    font-size: 12px;
                }
                .actions-button{
                    text-align: left;
                    & > span{
                        font-size: 10px;
                        vertical-align: middle;
                    }
                    .fontIcons{
                        font-size: 12px;
                    }
                }
                .el-checkbox{
                    margin-bottom: 0;
                }
                &:last-child{
                    margin-bottom: 0;
                }
            }
        }
    }
}
</style>
