<template>
    <div class="content-wrapper">
        <div id="master-barang-attribute">
            <div class="page-header">
                <page-header titleName="Tipe Produk" :isCreate="$dataRole['service.offlinehub.post.type.create']"></page-header>
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
                    @current-change="handleCurrentChange"
                    ref="singleTable"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column prop="title" label="Title"></el-table-column>
                    <el-table-column prop="slug" label="Slug" width="150"></el-table-column>
                    <el-table-column prop="tag" label="Tag" width="100"></el-table-column>
                    <el-table-column label="Subtitle">
                        <template slot-scope="scope">
                            <less-text :text="scope.row.subtitle" :max-chars="50"></less-text>
                        </template>
                    </el-table-column>
                    <el-table-column label="Deskripsi">
                        <template slot-scope="scope">
                            <less-text :text="scope.row.description" :max-chars="50"></less-text>
                        </template>
                    </el-table-column>
                    <el-table-column label="Icon" width="100">
                        <template slot-scope="scope">
                            <img :src="scope.row.icon" style="max-width: 50px;">
                        </template>
                    </el-table-column>
                    <el-table-column label="Created At" width="160">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
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
                                    <h5>Info Tipe Produk</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Title" prop="title">
                                                    <el-input v-model="forms.title"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Tag" prop="tag">
                                                    <el-input v-model="forms.tag"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Subtitle" prop="subtitle">
                                                    <el-input v-model="forms.subtitle"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Slug" prop="slug">
                                                    <el-input v-model="forms.slug"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Deskripsi" prop="description">
                                                    <el-input v-model="forms.description" type="textarea" rows="5"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Icon">
                                                    <form ref="fileform" class="fileForm">
                                                        <div class="custom-upload-images">
                                                            <div class="img-first-step" v-show="(progressFirst == false)">
                                                                <span class="img-upload-tittle"><img src="~assets/images/icons/image.png"></span>
                                                                <div class="text">Drag and drop your image here or <a href="#" @click.prevent="uploadTrigger">Browse</a></div>
                                                                <input id="imagesFilesUpload" type="file" accept="image/x-png,image/gif,image/jpeg" @change="handleUpload" class="custom-upload-tag">
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
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button v-if="$dataRole['service.offlinehub.delete.type.delete.*']" v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                            <img src="~assets/images/icons/trash.png" alt="img-trash">
                        </el-button>
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                        <el-button v-if="$dataRole['service.offlinehub.post.type.update.*']" v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
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
import lessText from '../lessText.vue'

export default {
    name: 'offline-hubs-type',
    data(){
        return{
            sectionApi: 'offlinehub?servicePathUrl=type',
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
            dataTextCreate: 'Buat Tipe Barang Offline Hub',
            dataTextUpdate: 'Edit Tipe Barang Offline Hub',
            confirmDescDelete: 'Anda yakin akan menghapus data Tipe dari daftar?',
            confirmTitleDelete: 'Hapus Tipe',
            textDataCreateSuccess: 'Data Tipe Berhasil ditambahkan.',
            textDataUpdateSuccess: 'Data Tipe Berhasil diupdate.',
            textDataDeleteSuccess: '1 Items Berhasil dihapus.',
            textMemuatData: 'Masih memuat data',
            textErrorNetwork: 'Jaringan Bermasalah',
            forms:{
                title: '',
                tag: '',
                subtitle: '',
                slug: '',
                description: '',
            },
            rules:{
                title: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                // tag: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                // subtitle: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                slug: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                description: [ { max: 225, message: 'Maximal inputan 225 character', trigger: 'blur' }  ],
            },
            dragAndDropCapable: false,
            files: '',
            filesEdit: '',
            uploadPercentage: 0,
            progressShow: false,
            doneProgress: false,
            progressFirst: false,
        }
    },
    watch:{
        searchQuery: function(newValue){
            this.getResult(newValue)
            document.querySelector('.el-pagination').children[1].children[0].click()
        }
    },
    created(){
        FUNCTIONS.checkPermissions(this.$dataRole['service.offlinehub.get.type'])
    },
    mounted(){
        this.getPost(this.searchQuery)
        this.initCreateFunction()
        this.dragInit()
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
                    message: 'Gagal mendapatkan data'
                });
            })
            .finally(() => {
                this.loading = false
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
                    if(formtype == 'save'){
                        document.getElementById('save').children[0].innerHTML = loadingform
                        let urlv = this.urlService + this.sectionApi + '/create&multipart=true'

                        const formData = new FormData()
                        formData.append('title', this.forms.title)
                        formData.append('tag', this.forms.tag)
                        formData.append('subtitle', this.forms.subtitle)
                        formData.append('slug', this.forms.slug)
                        formData.append('description', this.forms.description)
                        formData.append('icon', this.files)

                        this.postFunction('post', formData, urlv)
                    }else{
                        document.getElementById('save-edit').children[0].innerHTML = loadingform
                        let urlv = this.urlService + this.sectionApi + '/update/' + this.itemDataDetail.id + '&multipart=true'

                        const formData = new FormData()
                        formData.append('title', this.forms.title)
                        formData.append('tag', this.forms.tag)
                        formData.append('subtitle', this.forms.subtitle)
                        formData.append('slug', this.forms.slug)
                        formData.append('description', this.forms.description)
                        if(this.files['type'] != undefined){
                            formData.append('icon', this.files)
                        }

                        this.postFunction('put', formData, urlv)
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
                let url = this.urlService + this.sectionApi + '/delete/' + id
                this.postFunction('delete', '', url)
                this.initClickCreateFunction('hide')
            })
        },
        handleCurrentChange(val){
            if(this.$dataRole['service.offlinehub.get.type.detail.*']){
                if(val){
                    this.titleForms = this.dataTextUpdate
                    this.formsType = 'edit'
                    let url = this.urlService + this.sectionApi + '/detail/' + val.id
                    this.postFunction('getbyid', '', url)
                    this.initClickCreateFunction('show')
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
            this.forms.title = ''
            this.forms.tag = ''
            this.forms.subtitle = ''
            this.forms.slug = ''
            this.forms.description = ''
            this.files = ''
            this.progressShow = false
            this.doneProgress = false
            this.progressFirst = false
            document.getElementById("imagesFilesUpload").value = "";
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
                this.axios.post(url, credentials)
                .then(response => {
                    document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                    if(response.data.status == 'error'){
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
                this.loadingForm = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemDataDetail = response.data.data
                        this.forms = this.itemDataDetail

                        this.forms.title = this.itemDataDetail.title
                        this.forms.tag = this.itemDataDetail.tag
                        this.forms.subtitle = this.itemDataDetail.subtitle
                        this.forms.slug = this.itemDataDetail.slug
                        this.forms.description = this.itemDataDetail.description

                        if(this.itemDataDetail.icon !== null){
                            let url = this.itemDataDetail.icon
                            let filename = url.substring(url.lastIndexOf('/')+1);
                            this.$refs['preview'].src = this.itemDataDetail.icon
                            this.files = {
                                name: filename
                            }
                            this.progressFirst = true
                            this.doneProgress = true
                        }
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
                        message: 'Gagal menghapus data'
                    });
                })
                .finally(() => {
                    this.closeModal();
                })
            }
        },
        uploadTrigger(){
            if(document.querySelector('.custom-upload-tag').length != 0){
                document.querySelector('.custom-upload-tag').click('click')
            }
        },
        handleUpload(event){
            if ( /\.(jpe?g|png|gif)$/i.test( event.target.files[0].name ) ) {
                if(event.target.files[0].size < 512000){
                    this.files = event.target.files[0]
                    this.progressFirst = true
                    this.move()
                }else{
                    this.$message.error('Maaf, Ukuran Images tidak boleh lebih dari 512KB');
                }
            }else{
                this.$message.error('Maaf, yang boleh di upload hanya images');
            }
        },
        getImagePreviews(){
            if ( /\.(jpe?g|png|gif)$/i.test( this.files.name ) ) {
                let reader = new FileReader();
                reader.addEventListener("load", function(){
                    this.$refs['preview'].src = reader.result;
                }.bind(this), false);
                reader.readAsDataURL( this.files);
            }
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
                    if ( /\.(jpe?g|png|gif)$/i.test( e.dataTransfer.files[0].name ) ) {
                        if(e.dataTransfer.files[0].size < 512000){
                            this.files = e.dataTransfer.files[0];
                            this.progressFirst = true
                            this.move()
                        }else{
                            this.$message.error('Maaf, Ukuran Images tidak boleh lebih dari 512KB');
                        }
                    }else{
                        this.$message.error('Maaf, yang boleh di upload hanya images');
                    }
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
    },
    components: { pageHeader, loadingSvg, lessText }
}
</script>