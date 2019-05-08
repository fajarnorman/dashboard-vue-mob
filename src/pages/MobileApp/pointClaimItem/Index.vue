<template>
    <div class="content-wrapper">
        <div id="poinClaimItem">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Klaim Item</h4>
                        <div class="add-actions">
                            <a @click.prevent="Create" class="float-right" v-if="$dataRole['claimitem.create']">
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

                        <div v-if="messagesuccess">
                            <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                        </div>

                        <div class="" v-if="itemsData">
                            <el-table 
                                :data="itemsData" 
                                max-height="530" 
                                empty-text="No data available in table"
                                ref="singleTable"
                                @selection-change="handleSelectionChange"
                                @current-change="handleCurrentChange"
                                v-loading="loading"
                                class="mobayar-table">
                                <el-table-column type="selection" width="55" v-if="$dataRole['claimitem.delete']"></el-table-column>
                                <el-table-column type="index" label="No" width="50"></el-table-column>
                                <el-table-column prop="name" label="Name"></el-table-column>
                                <el-table-column prop="title" label="Title" width="150"></el-table-column>
                                <el-table-column prop="url" label="Url" width="240"></el-table-column>
                                <el-table-column label="Start Date">
                                    <template slot-scope="scope">
                                        {{scope.row.start_date | moment("DD MMMM YYYY")}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="End Date">
                                    <template slot-scope="scope">
                                        {{scope.row.end_date | moment("DD MMMM YYYY")}}
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
                                        <h4>{{titleForms}}</h4>
                                        <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                                    </header>
                                    <section>
                                        <el-form :model="forms" :rules="rules2" status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                            <div class="item-forms-details">
                                                <div class="forms-details">
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama Item" prop="name">
                                                                <el-input v-model="forms.name"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Judul" prop="title">
                                                                <el-input v-model="forms.title"></el-input>
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
                                                        <el-col :span="24">
                                                            <el-form-item label="Tanggal Mulai Aktif" prop="dateStart">
                                                                <div class="datepicker-content">
                                                                    <el-date-picker 
                                                                        :format="format" 
                                                                        v-model="forms.dateStart" 
                                                                        :value-format="format"
                                                                        type="date"
                                                                        class="datepicker"></el-date-picker>
                                                                    <el-time-picker 
                                                                        v-model="forms.timeStart"
                                                                        :format="formatTime"
                                                                        :value-format="formatTime"
                                                                        class="timepicker">
                                                                    </el-time-picker>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="24">
                                                            <el-form-item label="Tanggal Berakhir" prop="dateEnd">
                                                                <div class="datepicker-content">
                                                                    <el-date-picker 
                                                                        :format="format" 
                                                                        v-model="forms.dateEnd" 
                                                                        :value-format="format"
                                                                        type="date"
                                                                        class="datepicker"></el-date-picker>
                                                                    <el-time-picker 
                                                                        v-model="forms.timeEnd"
                                                                        :format="formatTime"
                                                                        :value-format="formatTime"
                                                                        class="timepicker">
                                                                    </el-time-picker>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                            </div>
                                        </el-form>
                                    </section>
                                </div>
                                <div class="actions-button clearfix">
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['claimitem.delete']" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail.id)">
                                        <img src="~assets/images/icons/trash.png" alt="img-trash">
                                    </el-button>
                                    <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                    <el-button v-show="(formsType == 'edit')" v-if="$dataRole['claimitem.edit']" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
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
        name: 'pointClaimItems',
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
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'claimItem',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemiDforDelete: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                direction: '',
                dateRange: '',
                format: 'yyyy-MM-dd',
                formatTime: 'HH:mm',
                formatTimeValue: 'HH:mm:ss',
                grandTotal: '',
                totalPage: '',
                filterQuery: '',
                supplierQuery: '',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',
                progressShow: false,
                doneProgress: false,
                progressFirst: false,
                value1:'',

                // message variable
                messageerror: '',
                messagesuccess: '',

                forms:{
                    name: '',
                    title: '',
                    link: '',
                    dateStart: '',
                    timeStart: '00:00',
                    dateEnd: '',
                    timeEnd: '23:59',
                },
                rules2:{
                    name: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    title: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    link: [ { required: true, validator: linkValidator, trigger: 'blur' } ],
                    dateStart: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    dateEnd: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                },

                dragAndDropCapable: false,
                files: '',
                uploadPercentage: 0
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['claimitem.list'])
        },
        mounted () {
            this.getPosts('')
        },
        watch: {
            // always watch this function for change
            searchQuery: function (newQuestion) {
                this.getResult()
            },
        },
         methods: {
            // Build URL
            buildUrl (search) {
                return this.apiURL + this.sectionApi + "?limit=" + this.perPage + "&page=" + this.currentPage + '&search=' + search + '&direction=DESC'
            },

            // Get All Post
            getPosts(search){
                let url = this.buildUrl(search)
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
                .catch(error => { this.errored = true })
                .finally(() => this.loading = false)
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts(this.searchQuery)
            },

            // Limit Change function
            limitChange(limit){
                this.perPage = limit
                document.querySelector('.el-pagination').children[1].children[0].click()
                this.getPosts(this.searchQuery)
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            // Get Result data from searchbar
            getResult: _.debounce(function(){
                this.getPosts(this.searchQuery)
            }, 300),

            // function for table click for edit and detail
            handleCurrentChange(val){
                if(this.$dataRole['claimitem.show']){
                    if(val){
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        this.formsType = 'edit'
                        this.loadingForm = true

                        let url = this.apiURL + this.sectionApi + "/" + val.id
                        this.axios.get(url)
                        .then(response => {
                            this.itemDataDetail = response.data.data
                            this.titleForms = "Ubah Klaim Item"

                            let url = this.itemDataDetail.image_url
                            let filename = url.substring(url.lastIndexOf('/')+1)
                            
                            this.forms.name = this.itemDataDetail.name
                            this.forms.title = this.itemDataDetail.title
                            this.forms.link = this.itemDataDetail.url
                            
                            let dateCreate_1 = new Date(this.itemDataDetail.start_date)
                            let dateStart = dateCreate_1.getFullYear() + '-' + (dateCreate_1.getMonth() + 1) + '-' + dateCreate_1.getDate()
                            let timeStart = dateCreate_1.getHours() + ':' + dateCreate_1.getMinutes()

                            let dateCreate_2 = new Date(this.itemDataDetail.end_date)
                            let dateEnd = dateCreate_2.getFullYear() + '-' + (dateCreate_2.getMonth() + 1) + '-' + dateCreate_2.getDate()
                            let timeEnd = dateCreate_2.getHours() + ':' + dateCreate_2.getMinutes()

                            this.forms.dateStart = dateStart
                            this.forms.timeStart = timeStart
                            this.forms.dateEnd = dateEnd
                            this.forms.timeEnd = timeEnd

                            this.$refs['preview'].src = this.itemDataDetail.image_url

                            this.files = {
                                name: filename
                            }

                            this.progressFirst = true
                            this.doneProgress = true
                        })
                        .catch(error => { 
                            console.log(error);
                            this.errored = true
                        })
                        .finally(() => {
                            this.loadingForm = false
                        })
                    }
                }else{
                    this.$notify.error({
                        title: 'Error',
                        message: 'Anda tidak punya akses'
                    });
                }
            },

            // delete Item
            deletePost(type, valueid){
                this.messagesuccess = ''
                if(type == 'all'){
                    let id = this.itemiDforDelete
                    this.$confirm('Apakah anda yakin akan menghapus '+ id.length +' item klaim dari daftar?', 'Hapus Item Klaim', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        this.loading = true
                        for(let i = 0; i< id.length; i++){
                            let url = this.apiURL + this.sectionApi + '/' + id[i].id
                            this.axios.delete(url)
                            .then(response => {
                                this.getPosts('')
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
                    this.$confirm('Apakah anda yakin akan menghapus item klaim dari daftar?', 'Hapus Item Klaim', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        let url = this.apiURL + this.sectionApi + '/' + valueid
                        this.axios.delete(url)
                        .then(response => {
                            this.getPosts('')
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

            // close modal function
            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.$refs.singleTable.setCurrentRow(row);
                this.$refs.formsvalid.resetFields();

                this.forms.name = ''
                this.forms.title = ''
                this.forms.link = ''
                this.forms.dateStart = ''
                this.forms.timeStart = '00:00'
                this.forms.dateEnd = ''
                this.forms.timeEnd = '23:59'
                this.files = ''
                this.progressShow = false
                this.doneProgress = false
                this.progressFirst = false
            },

            // Create Forms function
            Create(){
                this.titleForms = "Klaim Item Baru"
                this.formsType = 'create'
                this.messagesuccess = ''
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
            },

            uploadTrigger(){
                if(document.querySelector('.custom-upload-tag').length != 0){
                    document.querySelector('.custom-upload-tag').click('click')
                }
            },

            handleUpload(event){
                this.messageerror = ''
                this.messagesuccess = ''
                if ( /\.(jpe?g|png|gif)$/i.test( event.target.files[0].name ) ) {
                    if(event.target.files[0].size < 512000){
                        this.files = event.target.files[0]
                        this.progressFirst = true
                        this.move()
                    }else{
                        this.$message.error('Maaf, Ukuran Images tidak boleh lebih dari 512KB')
                    }
                }else{
                    this.$message.error('Maaf, yang boleh di upload hanya images')
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

            submitSave(formName, formtype){
                this.messageerror = ''
                this.messagesuccess = ''
                let loadingform = FUNCTIONS.svgSpinner;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formtype == 'save'){
                            if(this.files != ''){
                                document.getElementById('save').children[0].innerHTML = loadingform
                                let urlv = this.apiURL + this.sectionApi

                                let startDate = this.forms.dateStart + ' ' + this.forms.timeStart + ':00'
                                let endDate = this.forms.dateEnd + ' ' + this.forms.timeEnd + ':00'

                                const formData = new FormData()
                                formData.append('name', this.forms.name)
                                formData.append('title', this.forms.title)
                                formData.append('url', this.forms.link)
                                formData.append('start_date', startDate)
                                formData.append('end_date', endDate)
                                formData.append('image', this.files)

                                this.axios.post(urlv, formData)
                                .then(response => {
                                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                                    if(response.data.status == 'error'){
                                        this.messageerror = response.data.message
                                    }else{
                                        this.messagesuccess = "Item berhasil disimpan"
                                        this.getPosts('')
                                        this.closeModal()
                                    }
                                })
                                .catch(error => { 
                                    console.log(error)
                                })
                            }else{
                                this.$message.error('Maaf, Images Tidak boleh kosong');
                            }
                        }else{
                            document.getElementById('save-edit').children[0].innerHTML = loadingform
                            let urlv = this.apiURL + this.sectionApi + '/' + this.itemDataDetail.id

                            let startDate = this.forms.dateStart + ' ' + this.forms.timeStart + ':00'
                            let endDate = this.forms.dateEnd + ' ' + this.forms.timeEnd + ':00'

                            const formData = new FormData()
                            formData.append('_method', 'put')
                            formData.append('name', this.forms.name)
                            formData.append('title', this.forms.title)
                            formData.append('url', this.forms.link)
                            formData.append('start_date', startDate)
                            formData.append('end_date', endDate)
                            if(this.files.type != undefined){
                                formData.append('image', this.files)
                            }

                            // // Display the keys
                            // for (var key of formData.keys()) {
                            //     console.log(key); 
                            // }

                            this.axios.post(urlv, formData)
                            .then(response => {
                                document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Claim Item Berhasil diubah."
                                    this.getPosts('')
                                    this.closeModal();
                                }
                            })
                            .catch(error => { 
                                // console.log(error);
                            })
                        }
                    }
                })
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
         },
    }
</script>