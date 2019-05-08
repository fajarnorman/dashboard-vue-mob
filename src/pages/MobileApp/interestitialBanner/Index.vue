<template>
    <div class="content-wrapper">
        <div id="interstitial-banner">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Interstitial Banner</h4>
                    </div>
                </div>
            </div>
            <div class="content">
                <section v-if="errored">
                    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
                </section>
                <section v-else>
                    <div>
                        <div v-if="messagesuccess">
                            <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                        </div>
                        <div v-if="messageerror">
                            <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                        </div>
                        <div v-if="itemsData">
                            <div class="cards clearfix" style="position: relative;">
                                <!-- <pre>{{itemsData}}</pre> -->
                                <div class="el-loading-mask" v-show="(loading == true)">
                                    <div class="el-loading-spinner">
                                        <svg viewBox="25 25 50 50" class="circular">
                                            <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                                        </svg>
                                    </div>
                                </div>
                                <el-form :model="forms" status-icon :rules="rules2" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                    <el-form-item label="Status Available">
                                        <div class="switch-custom">
                                            <el-switch
                                                v-model="forms.status">
                                            </el-switch>
                                            <span v-if="forms.status">On</span>
                                            <span v-else>Off</span>
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="Type (image/url)">
                                        <div class="switch-custom">
                                            <el-switch
                                                v-model="forms.type">
                                            </el-switch>
                                            <span v-if="forms.type">Image</span>
                                            <span v-else>Url</span>
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="Image" v-show="forms.type == true">
                                        <form ref="fileform" class="fileForm">
                                            <div class="custom-upload-images">
                                                <div class="img-first-step" v-show="(progressFirst == false)">
                                                    <span class="img-upload-tittle"><img :src="itemsData.url"></span>
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
                                    <el-form-item label="Url" prop="url" v-show="forms.type == false">
                                        <el-input v-model="forms.url"></el-input>
                                    </el-form-item>
                                    <el-form-item label="Set Temporary Banner">
                                        <div class="switch-custom">
                                            <el-switch
                                                v-model="forms.temporary">
                                            </el-switch>
                                            <span v-if="forms.temporary">On</span>
                                            <span v-else>Off</span>
                                        </div>
                                    </el-form-item>
                                    <div v-if="forms.temporary">
                                        <el-form-item label="Tanggal Mulai Aktif" required>
                                            <el-row :gutter="20">
                                                <el-col :span="14">
                                                    <el-form-item prop="dateStart">
                                                        <el-date-picker 
                                                            :format="format" 
                                                            v-model="forms.dateStart" 
                                                            :value-format="format"
                                                            type="date"
                                                            class="datepicker"></el-date-picker>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item prop="timeStart">
                                                        <el-time-picker 
                                                            v-model="forms.timeStart"
                                                            :format="formatTime"
                                                            :value-format="formatTime"
                                                            class="timepicker">
                                                        </el-time-picker>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item label="Tanggal Berakhir" prop="dateEnd" required>
                                            <el-row :gutter="20">
                                                <el-col :span="14">
                                                    <el-form-item prop="dateEnd">
                                                        <el-date-picker 
                                                            :format="format" 
                                                            v-model="forms.dateEnd" 
                                                            :value-format="format"
                                                            type="date"
                                                            class="datepicker"></el-date-picker>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item prop="timeEnd">
                                                        <el-time-picker 
                                                            v-model="forms.timeEnd"
                                                            :format="formatTime"
                                                            :value-format="formatTime"
                                                            class="timepicker">
                                                        </el-time-picker>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                    </div>
                                </el-form>
                                <el-button round class="button-white-green float-right" id="save" @click.prevent="submitSave('formsvalid')">Submit</el-button>
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
        name: 'interstitial-banner',
        data () {
            var linkValidator = (rule, value, callback) => {
                var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    if(!pattern.test(this.forms.url)) {
                        callback(new Error('Masukkan alamat URL yang valid'));
                    }
                    callback();
                }
            };
            var dateValidatorStart = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    // if(this.forms.timeStart === '') {
                    //     callback(new Error('Inputan harus di isi'));
                    // }
                    callback();
                }
            };
            var dateValidatorEnd = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Inputan harus di isi'));
                }else{
                    // if(this.forms.timeEnd === '') {
                    //     callback(new Error('Inputan harus di isi'));
                    // }
                    callback();
                }
            };
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'interstitialBanner',

                // for store data after get api
                itemsData: [],

                // another important variable data
                loading: true,
                errored: false,

                 // message variable
                messageerror: '',
                messagesuccess: '',

                // for create, detail, edit forms and validation
                forms:{
                    type: false,
                    status: false,
                    url: '',
                    image: '',
                    temporary: '',
                    dateStart: '',
                    timeStart: '00:00',
                    dateEnd: '',
                    timeEnd: '23:59',
                },

                // Rules for forms
                rules2:{
                    url: [{ validator: linkValidator, trigger: 'blur' }],
                    dateStart: [{ required: true, message: 'Inputan harus di isi', trigger: 'change' }],
                    timeStart: [{ required: true, message: 'Inputan harus di isi', trigger: 'change' }],
                    dateEnd: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur' }],
                    timeEnd: [{ required: true, message: 'Inputan harus di isi', trigger: 'change' }],
                },

                // Image Upload 
                progressShow: false,
                doneProgress: false,
                progressFirst: false,
                dragAndDropCapable: false,
                files: '',
                uploadPercentage: 0,

                // for datepicker
                format: 'yyyy-MM-dd',
                formatTime: 'HH:mm',
                formatTimeValue: 'HH:mm:ss',
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['interstitialbanner.list'])
        },
        mounted () {
            this.getPost()
        },
        methods: {
            buildUrl(){
                return this.apiUrl + this.sectionApi
            },

            getPost(){
                let url = this.buildUrl()
                this.loading = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error'){
                        this.$notify.error({
                            title: response.data.status,
                            message: response.data.message
                        });
                        if(response.data.message == 'Unable to authenticate with invalid API key and token.'){
                            FUNCTIONS.logout('expired-token', response.data.message)
                        }
                    }else{
                        this.itemsData = response.data.data
                        this.itemsData.is_available == 1 ? this.forms.status = true : this.forms.status = false
                        this.forms.url = this.itemsData.url
                        this.itemsData.is_temporary_banner == 1 ? this.forms.temporary = true : this.forms.temporary = false

                        let dateCreate_1, dateStart, timeStart, dateCreate_2, dateEnd, timeEnd = ''

                        if(this.itemsData.start_date != null){
                            dateCreate_1 = new Date(this.itemsData.start_date)
                            dateStart = dateCreate_1.getFullYear() + '-' + (dateCreate_1.getMonth() + 1) + '-' + dateCreate_1.getDate()
                            timeStart = dateCreate_1.getHours() + ':' + dateCreate_1.getMinutes()    
                        }else{
                            dateCreate_1 = new Date()
                            dateStart = dateCreate_1.getFullYear() + '-' + (dateCreate_1.getMonth() + 1) + '-' + dateCreate_1.getDate()
                            timeStart = dateCreate_1.getHours() + ':' + dateCreate_1.getMinutes()    
                        }

                        if(this.itemsData.end_date != null){
                            dateCreate_2 = new Date(this.itemsData.end_date)
                            dateEnd = dateCreate_2.getFullYear() + '-' + (dateCreate_2.getMonth() + 1) + '-' + dateCreate_2.getDate()
                            timeEnd = dateCreate_2.getHours() + ':' + dateCreate_2.getMinutes()
                        }else{
                            dateCreate_2 = new Date()
                            dateEnd = dateCreate_2.getFullYear() + '-' + (dateCreate_2.getMonth() + 1) + '-' + dateCreate_2.getDate()
                            timeEnd = dateCreate_2.getHours() + ':' + dateCreate_2.getMinutes()
                        }

                        this.forms.dateStart = dateStart
                        this.forms.timeStart = timeStart
                        this.forms.dateEnd = dateEnd
                        this.forms.timeEnd = timeEnd
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.errored = true
                })
                .finally(() => {
                    this.loading = false
                })
            },

            submitSave(formName){
                this.messagesuccess = ''
                this.messageerror = ''
                let loadingform = FUNCTIONS.svgSpinner;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let media_type = this.forms.type == true ? 'image' : 'url'
                        let startDate = this.forms.dateStart + ' ' + this.forms.timeStart + ':00'
                        let endDate = this.forms.dateEnd + ' ' + this.forms.timeEnd + ':00'

                        const formData = new FormData()
                        formData.append('is_available', this.forms.status)
                        formData.append('type_media', media_type)
                        formData.append('is_temporary_banner', this.forms.temporary)
                        
                        if(this.forms.type == true){
                            if(this.files != ''){
                                formData.append('image', this.files)
                            }else{
                                formData.append('url', this.forms.url)    
                            }
                        }else{
                            formData.append('url', this.forms.url)
                        }

                        if(this.forms.temporary == true){
                            formData.append('start_date', startDate)
                            formData.append('end_date', endDate)
                        }

                        // for(var pair of formData.entries()) {
                        //     // console.log(pair[0]+ ', '+ pair[1]); 
                        // }

                        document.getElementById('save').children[0].innerHTML = loadingform
                        let url = this.buildUrl()
                        this.axios.post(url, formData)
                        .then(response => {
                            document.getElementById('save').children[0].innerHTML = 'Submit'
                            if(response.data.status == 'error'){
                                this.messageerror = response.data.message
                            }else{
                                this.messagesuccess = "Item berhasil disimpan"
                            }
                        })
                        .catch(error => { 
                            console.log(error)
                        })
                        .finally(() => {
                            this.getPost()
                        })
                    }else{
                        document.getElementById('save').children[0].innerHTML = 'Submit'
                        console.log('error submit!!');
                        return false;
                    }
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
        }
    }
</script>

<style lang="scss">
    #interstitial-banner{
        .demo-ruleForm{
            margin-bottom: 15px;
        }
        .el-form-item{
            margin-bottom: 15px;
            &:last-child{
                margin-bottom: 0;
            }
            label{
                display: inline-block;
                vertical-align: middle;
                width: 180px !important;
            }
            .el-form-item__content{
                display: inline-block;
                vertical-align: middle;
                width: 100% !important;
                max-width: 550px;
            }
        }
        .switch-custom{
            & > span{
                position: relative;
                top: 1px;
                margin-left: 10px;
            }
        }
        .custom-upload-images{
            .img-upload-tittle{
                width: auto;
                height: auto;
                max-height: 100px;
                border-radius: 0;
                border: none;
                margin-bottom: 15px;
                img{
                    height: auto;
                    max-width: 100px;
                    position: static;
                    transform: none;
                    opacity: 1;
                }
            }
            .text{
                margin-bottom: 25px;
            }
        }
    }
</style>
