<template>
    <div class="content-wrapper">
        <div id="slideshow">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Slide Show</h4>
                        <div class="add-actions">
                            <a @click.prevent="Create" class="float-right" v-if="$dataRole['slideshow.create']">
                                <el-button class="button-white-green" round>
                                    <i class="icon-plus3"></i> Create
                                </el-button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content">
                <section>
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
                        
                        <el-table 
                            :data="itemsData" 
                            max-height="530" 
                            empty-text="No data available in table"
                            ref="singleTable"
                            @current-change="handleCurrentChange"
                            @selection-change="handleSelectionChange"
                            v-loading="loading"
                            class="mobayar-table">
                            <el-table-column type="selection" width="50" v-if="$dataRole['slideshow.delete']"></el-table-column>
                            <el-table-column label="Sort" width="50" align="center" v-if="$dataRole['slideshow.edit']">
                                <template slot-scope="scope">
                                    <a href="#" @click.prevent="" :dataId="scope.row.id" class="handle-sort"><font-awesome-icon class="fontIcons" :icon="fontsIcons.drags" /></a>
                                </template>
                            </el-table-column>
                            <el-table-column prop="title" label="Title"></el-table-column>
                            <el-table-column label="Image" width="200">
                                <template slot-scope="scope">
                                    <img v-bind:src="scope.row.url" style="height: 25px; border-radius: 3px;">
                                </template>
                            </el-table-column>
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
                                    <el-form :model="forms" :rules="rules2" status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                        <div class="item-forms-details">
                                            <h5>General Info</h5>
                                            <div class="forms-details">
                                                <el-row :gutter="20">
                                                    <el-col :span="24">
                                                        <el-form-item label="Title" prop="title">
                                                            <el-input v-model="forms.title"></el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <el-form-item label="Description">
                                                            <el-input type="textarea" rows="4" v-model="forms.description"></el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <el-form-item label="Image">
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
                                <el-button v-show="(formsType == 'edit')" v-if="$dataRole['slideshow.delete']" class="button-outline-black" id="trash" @click.prevent="deletePost('once', itemDataDetail.id)">
                                    <img src="~assets/images/icons/trash.png" alt="img-trash">
                                </el-button>
                                <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                <el-button v-show="(formsType == 'edit')" v-if="$dataRole['slideshow.edit']" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                                <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
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
    
    import SortTable from 'sortablejs'
    import { 
        faArrowsAlt, 
        faSortAmountDown
    } from '@fortawesome/free-solid-svg-icons'

    export default {
        name: 'slideshow',
        data(){
            return{
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'slideshow',

                itemsData: [],
                itemiDforDelete: [],
                itemDataDetail: [],

                searchQuery: '',
                loading: true,
                loadingForm: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                totalPage: '',
                titleForms: '',
                formsType: '',
                afterChecked: true,
                totalChecked: '',
                progressShow: false,
                doneProgress: false,
                progressFirst: false,
                dataSortTable: '',

                dragAndDropCapable: false,
                files: '',
                filesEdit: '',
                uploadPercentage: 0,

                // for Popup Image
                imageValue: '',
                imageOpen: false,

                forms:{
                    title: '',
                    description: '',
                    images: '',
                    nameFile: '',
                    positions: '',
                },
                rules2:{
                    title: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                },

                // message variable
                messageerror: '',
                messagesuccess: '',

                // Fonts
                fontsIcons: {
                    drags: faArrowsAlt,
                    sorts: faSortAmountDown,
                }
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['slideshow.list'])
        },
        mounted: function(){
            this.getPosts(this.perPage, this.currentPage, this.searchQuery)
            this.dragInit()
        },
        watch: {
            searchQuery(newSearch) {
                this.getPosts(this.perPage, this.currentPage, newSearch)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },
        },
        methods: {
            // build url function
            buildUrl (limit, page, search) {
                return this.apiUrl + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=DESC'
            },

            getPosts(limit, pg, search){
                let url = this.buildUrl(limit, pg, search)
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
                .finally(() => {
                    this.loading = false
                    let that = this
                    setTimeout(function(){
                        that.sortsItems()
                    }, 500)
                })
            },

            // Pagination Change function
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

            // delete Item
            deletePost(type, valueid){
                if(type == 'all'){
                    let id = this.itemiDforDelete
                    this.$confirm('Anda akan menghapus '+ id.length +' dari daftar.', 'Hapus Slideshow', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        this.loading = true
                        for(let i = 0; i< id.length; i++){
                            let url = this.apiUrl + this.sectionApi + '/' + id[i].id
                            this.axios.delete(url)
                            .then(response => {
                                this.getPosts(this.perPage, this.currentPage, this.searchQuery)
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
                    this.$confirm('Anda akan menghapus slideshow dari daftar.', 'Hapus Slideshow', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        let url = this.apiUrl + this.sectionApi + '/' + valueid
                        this.axios.delete(url)
                        .then(response => {
                            this.getPosts(this.perPage, this.currentPage, this.searchQuery)
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

            // function for table click for edit and detail
            handleCurrentChange(val){
                if(this.$dataRole['slideshow.show']){
                    if(val){
                        document.querySelector('.base-template-sidebar').classList.add('showing');
                        document.querySelector('.backdrop').classList.add('show');
                        document.querySelector('body').classList.add('no-scroll');
                        this.formsType = 'edit'
                        this.loadingForm = true

                        let url = this.apiUrl + this.sectionApi + "/" + val.id
                        this.axios.get(url)
                        .then(response => {
                            this.itemDataDetail = response.data.data
                            this.titleForms = "Edit Slideshow"

                            let url = this.itemDataDetail.url
                            let filename = url.substring(url.lastIndexOf('/')+1);
                            
                            this.forms.title = this.itemDataDetail.title
                            this.forms.description = this.itemDataDetail.description
                            this.forms.positions = this.itemDataDetail.position
                            this.$refs['preview'].src = this.itemDataDetail.url
                            // this.$refs['handleCurrentChange'].env = this.itemDataDetail.Image

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

            getBase64Image(img) {
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL("image/png");
                return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
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

            // close modal function
            closeModal(row){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.$refs.singleTable.setCurrentRow(row);
                this.forms.title = ''
                this.forms.description = ''
                this.files = ''
                this.progressShow = false
                this.doneProgress = false
                this.progressFirst = false
            },

            // Create Forms function
            Create(){
                this.titleForms = "Slide Show Baru"
                this.formsType = 'create'
                document.querySelector('.base-template-sidebar').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
            },

            // Submit Button
            submitSave(formName, formtype){
                let loadingform = FUNCTIONS.svgSpinner;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formtype == 'save'){
                            if(this.files != ''){
                                document.getElementById('save').children[0].innerHTML = loadingform
                                let urlv = this.apiUrl + this.sectionApi
                                
                                const formData = new FormData()
                                formData.append('title', this.forms.title)
                                formData.append('position', this.totalPage + 1)
                                formData.append('description', this.forms.description)
                                formData.append('image', this.files)
                                // console.log(this.files)

                                this.axios.post(urlv, formData)
                                .then(response => {
                                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                                    if(response.data.status == 'error'){
                                        this.messageerror = response.data.message
                                    }else{
                                        this.messagesuccess = "Slideshow Berhasil ditambahkan."
                                        this.getPosts(this.perPage, this.currentPage, '')
                                        this.closeModal();
                                    }
                                })
                                .catch(error => { 
                                    console.log(error)
                                })
                            }else{
                                this.$message.error('Maaf, Images tidak boleh kosong');
                            }
                        }else{
                            document.getElementById('save-edit').children[0].innerHTML = loadingform
                            let urlv = this.apiUrl + this.sectionApi + '/' + this.itemDataDetail.id
                            
                            const formData = new FormData()
                            formData.append('_method', 'put')
                            formData.append('title', this.forms.title)
                            formData.append('position', this.forms.positions)
                            formData.append('description', this.forms.description)
                            if(this.files['type'] != undefined){
                                formData.append('image', this.files)
                            }

                            this.axios.post(urlv, formData)
                            .then(response => {
                                document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                                if(response.data.status == 'error'){
                                    this.messageerror = response.data.message
                                }else{
                                    this.messagesuccess = "Slideshow Berhasil diubah."
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
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            sortsItems(){
                let that = this
                var el = document.querySelector('.el-table__body-wrapper tbody');
                this.dataSortTable = SortTable.create(el,{
                    animation: 150,
                    handle: '.handle-sort',
                    // Element dragging ended
                    onEnd: function (/**Event*/evt) {
                        var itemEl = evt.item;  // dragged HTMLElement
                        evt.to;    // target list
                        evt.from;  // previous list
                        evt.oldIndex;  // element's old index within old parent
                        evt.newIndex;  // element's new index within new parent

                        var newIndexs = evt.newIndex + 1
                        var dataID = itemEl.children[1].children[0].children[0].getAttribute("dataId")
                        // console.log(dataID)
                        // console.log('New Index: '+ newIndexs)
                        that.updatePosition(dataID, newIndexs)
                    },
                });
            },

            updatePosition(id, newPosition){
                let urlv = this.apiUrl + this.sectionApi + '/' + id + '/updatePosition'
                this.loading = true
                this.axios.put(urlv, {
                    position: newPosition
                })
                .then(response => {
                    document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                    if(response.data.status == 'error'){
                        this.messageerror = response.data.message
                    }else{
                        this.messagesuccess = "Slideshow Berhasil diubah."
                    }
                })
                .catch(error => { console.log(error);})
                .finally(() => {
                    this.loading = false
                })
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

            openImage(value){
                document.querySelector('.base-template-sidebar').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
                this.imageValue = value
                this.imageOpen = true
            },
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            }
        },
        beforeDestroy() {
            this.dataSortTable = ''
        }
    }
</script>