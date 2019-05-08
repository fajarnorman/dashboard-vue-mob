<template>
    <div class="content-wrapper">
        <div id="mutation-point">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Notifikasi</h4>
                        <div class="add-actions float-right">
                            <a @click.prevent="Create" class="float-right" v-if="$dataRole['notification.create']">
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
                                <el-table-column type="index" label="No" width="50"></el-table-column>
                                <el-table-column prop="title" label="Title" width="150"></el-table-column>
                                <el-table-column label="Description" width="250">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.description == null">-</div>
                                        <div v-else class="more-description">
                                            <read-more more-str="read more" :text="scope.row.description" link="#" less-str="read less" :max-chars="80"></read-more>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="link" label="Link" width="120"></el-table-column>
                                <el-table-column label="Image" width="150">
                                    <template slot-scope="scope">
                                        <img v-bind:src="scope.row.image" alt="" style="border-radius: 3px;width: 100%;">
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column prop="creator.fullname" label="Created By"></el-table-column> -->
                                <el-table-column label="Created At" width="150">
                                    <template slot-scope="scope">
                                        {{scope.row.created_at | moment("YYYY-MM-DD, h:mm:ss")}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Action" align="center" v-if="$dataRole['notification.delete']">
                                    <template slot-scope="scope">
                                        <a id="trash" @click.prevent="deletePost('once', scope.row.id)">
                                            <img src="~assets/images/icons/trash.png" alt="img-trash">
                                        </a>
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
                                    <section>
                                        <div v-if="(messageerror != '')">
                                            <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                                        </div>
                                        <div>
                                            <el-alert title="Info!" type="warning" description="Notifikasi yang dibuat akan dikirim ke semua user." show-icon></el-alert>
                                        </div>
                                        <el-form :model="forms" :rules="rules2" status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="24">
                                                            <el-form-item label="Judul" prop="title">
                                                                <el-input v-model="forms.title"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Deskripsi" prop="description">
                                                                <el-input type="textarea" v-model="forms.description" rows="4"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Link" prop="link">
                                                                <el-input v-model="forms.link"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Gambar">
                                                                <form ref="fileform" class="fileForm">
                                                                    <div class="custom-upload-images">
                                                                        <div class="img-first-step" v-show="(progressFirst == false)">
                                                                            <span class="img-upload-tittle"><img src="~assets/images/icons/image.png"></span>
                                                                            <div class="text">Drag and drop your image here or <a href="#" @click.prevent="uploadTrigger">Browse</a></div>
                                                                            <input type="file" accept="image/x-png,image/gif,image/jpeg" @change="handleUpload" class="custom-upload-tag">
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
                                                                                <img class="preview" v-bind:ref="'preview'"/>
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
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
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
    import XLSX from 'xlsx'
    import FUNCTIONS from '@/functions'
    
    import readMore from '@/components/partials/readmore.vue'

    export default {
        name: 'notifications',
        data () {
            var linkValidator = (rule, value, callback) => {
                var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    if(!pattern.test(this.forms.link)) {
                        callback(new Error('Masukkan alamat URL yang valid'));
                    }
                    callback();
                }
            };
            return{
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'notification',
                // sectionApi: 'notification?servicePathUrl=blast/notification',
                role: '',

                 // for store data after get api
                itemsData: [],
                itemDataDetail: [],

                // another important variable data
                searchQuery: '',
                loading: false,
                loadingExcel: false,
                loadingForm: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                filterQuery: '',
                totalPage: '',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',
                progressShow: false,
                doneProgress: false,
                progressFirst: false,

                messageerror: '',
                messagesuccess: '',

                forms:{
                    title: '',
                    link: '',
                    description: '',
                },
                rules2:{
                    title: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    description: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                },

                dragAndDropCapable: false,
                files: '',
                uploadPercentage: 0
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['notification.list'])
        },
        mounted(){
            this.getPosts(this.perPage, this.currentPage, this.searchQuery)
            this.dragInit()
        },
        watch: {
            searchQuery: function (newQuestion) {
                this.getResult()
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
        },
        methods: {
            getPosts(limit, page, search){
                // let url = this.apiUrl + this.sectionApi + "&limit=" + limit + "&page=" + page + '&keyword=' + search + '&direction=DESC'
                let url = this.apiUrl + this.sectionApi + "?limit=" + limit + "&page=" + page + '&keyword=' + search + '&direction=DESC'
                this.loading = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error'){
                        this.errored = true
                        if(response.data.message == 'Unable to authenticate with invalid API key and token.'){
                            FUNCTIONS.logout('expired-token', response.data.message)
                        }
                    }else{
                        // this.itemsData = response.data.data.rows
                        // this.totalPage = response.data.data.total
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
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
            },
            limitChange(limit, event){
                this.perPage = limit
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.perPage, '', this.searchQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },
            getResult: _.debounce(function(){
                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
            }, 300),
            handleCurrentChange(val){
                if(val){
                    this.formsType = 'edit'
                    this.loadingForm = true
                    this.$router.push({ name: 'mutasi-point-detail', params: { id: val.id }})
                }
            },
            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.$refs.singleTable.setCurrentRow(row);
                this.$refs.formsvalid.resetFields();
            },
            Create(){
                this.titleForms = "Kirim Notif Baru"
                this.formsType = 'create'
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
                this.progressShow = false
                this.doneProgress = false
                this.progressFirst = false
                this.forms.title = ''
                this.forms.link = ''
                this.forms.description = ''
                this.files = ''
            },
            deletePost(type, valueid){
                if(type == 'all'){
                    let id = this.itemiDforDelete
                    this.$confirm('Apakah anda yakin akan menghapus '+ id.length +' notifikasi dari daftar?', 'Hapus Notifikasi', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        this.loading = true
                        for(let i = 0; i< id.length; i++){
                            let url = this.apiUrl + this.sectionApi + '/' + id[i].id
                            this.axios.delete(url)
                            .then(response => {
                                this.getPosts(this.perPage, this.currentPage, '', this.filterQuery)
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
                    this.$confirm('Apakah anda yakin akan menghapus notifikasi dari daftar?', 'Hapus Notifikasi', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        let url = this.apiUrl + this.sectionApi + '/' + valueid
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
            submitSave(formName, formtype){
                this.messageerror = ''
                this.messagesuccess = ''
                let loadingform = FUNCTIONS.svgSpinner;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formtype == 'save'){
                            if(this.files != ''){
                                document.getElementById('save').children[0].innerHTML = loadingform
                                // let urlv = this.apiUrl + this.sectionApi + '&multipart=true'
                                let urlv = this.apiUrl + this.sectionApi

                                const formData = new FormData()
                                formData.append('title', this.forms.title)
                                formData.append('link', this.forms.link)
                                formData.append('description', this.forms.description)
                                formData.append('image', this.files)
                                this.axios.post(urlv, formData)
                                .then(response => {
                                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                                    if(response.data.status == 'error'){
                                        this.messageerror = response.data.message
                                    }else{
                                        this.messagesuccess = "Notifikasi Berhasil ditambahkan."
                                        this.getPosts(this.perPage, this.currentPage, '')
                                        this.closeModal();
                                    }
                                })
                                .catch(error => { 
                                    console.log(error)
                                })
                            }else{
                                this.$message.error('Maaf, Images Tidak boleh kosong');
                            }
                        }
                    }
                })
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
        components: { readMore }
    }
</script>