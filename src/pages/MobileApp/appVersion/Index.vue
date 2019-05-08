<template>
    <div class="content-wrapper">
        <div id="appversion">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">App Version</h4>
                        <div class="add-actions">
                            <a @click.prevent="Create" class="float-right" v-if="$dataRole['version.edit']">
                                <el-button class="button-white-green" round>
                                    <img src="~assets/images/icons/edit-white.png"> Edit
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
                    <div v-if="itemsData" style="position: relative;">
                        <div class="el-loading-mask" v-show="(loading == true)">
                            <div class="el-loading-spinner">
                                <svg viewBox="25 25 50 50" class="circular">
                                    <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                                </svg>
                            </div>
                        </div>

                        <div class="list-data">
                            <el-row :gutter="20">
                                <el-col :span="10" :xs="24">
                                    <h5>Lastest Version Info</h5>
                                </el-col>
                                <el-col :span="14" :xs="24">
                                    <div class="cards">
                                        <el-row :gutter="20">
                                            <el-col :span="8">
                                                <span>Version:</span>
                                                <div class="badge primary">{{appVersion.latestVersion}}</div>
                                            </el-col>
                                            <el-col :span="8">
                                                <span>Version Code:</span>
                                                <b>{{appVersion.latestVersionCode}}</b>
                                            </el-col>
                                            <el-col :span="8">
                                                <span>Priority: </span>
                                                <b>{{appVersion.priority}}</b>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-col>
                            </el-row>    
                        </div>
                        <div class="list-data">
                            <el-row :gutter="20">
                                <el-col :span="10" :xs="24">
                                    <h5>Update Rules</h5>
                                </el-col>
                                <el-col :span="14" :xs="24">
                                    <div class="cards">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <span>Force Update:</span>
                                                <b v-if="(appVersion.isForceUpdate == 'true')">Yes</b> <b v-else>No</b>
                                            </el-col>
                                            <el-col :span="12">
                                                <span>Max Out Date Version:</span>
                                                <b>{{appVersion.maxOutDateVersion}}</b>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-col>
                            </el-row>    
                        </div>
                        <div class="list-data">
                            <el-row :gutter="20">
                                <el-col :span="10" :xs="24">
                                    <h5>Release Notes</h5>
                                </el-col>
                                <el-col :span="14" :xs="24">
                                    <div class="cards">
                                        <p>{{appVersion.releaseNotes}}</p>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="list-data">
                            <el-row :gutter="20">
                                 <el-col :span="10" :xs="24">
                                    <h5>Referral Short Description</h5>
                                </el-col>
                                <el-col :span="14" :xs="24">
                                    <div class="cards">
                                        <p>{{reference.referralShortDesc}}</p>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="list-data">
                            <el-row :gutter="20">
                                 <el-col :span="10" :xs="24">
                                    <h5>Referral Detail Title</h5>
                                </el-col>
                                <el-col :span="14" :xs="24">
                                    <div class="cards">
                                        <p>{{reference.referralDetailTitle}}</p>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="list-data">
                            <el-row :gutter="20">
                                 <el-col :span="10" :xs="24">
                                    <h5>Referral Detail Description</h5>
                                </el-col>
                                <el-col :span="14" :xs="24">
                                    <div class="cards">
                                        <p v-html="reference.referralDetailDesc"></p>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>

                        <!-- Detail, Edit, Create Forms -->
                        <div class="base-template-sidebar" id="appversionInfo">

                            <div class="content">
                                <header class="clearfix">
                                    <h4 v-if="tabAppVersion == 'info'">Edit Latest Version Info</h4>
                                    <h4 v-else>Edit Reference</h4>
                                    <el-button @click="closeModal()"><img src="~assets/images/icons/big-close.png"></el-button>
                                </header>
                                <section>
                                    <el-tabs v-model="tabAppVersion" class="tabs-appversions">
                                        <el-tab-pane label="Edit Info" name="info">
                                            <div v-if="(messageerrorinfo != '')">
                                                <el-alert title="Error" type="error" :description="messageerrorinfo" show-icon></el-alert>
                                            </div>
                                            <div class="last-edited">
                                                <img src="~assets/images/icons/time.png"> Updated {{lastupdate}}
                                            </div>
                                            <el-form :model="forms" :rules="rules2" status-icon ref="formsvalidapp" label-width="120px" class="demo-ruleForm">
                                                <div class="item-forms-details">
                                                    <div class="forms-details">
                                                        <el-row :gutter="20">
                                                            <el-col :span="12">
                                                                <el-form-item label="Lastest Version" prop="lastVersion">
                                                                    <el-input v-model="forms.lastVersion" :value="forms.lastVersion"></el-input>
                                                                </el-form-item>
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <el-form-item label="Force Update">
                                                                    <el-radio-group v-model="forms.forceUpdate">
                                                                        <el-radio label="true">Yes</el-radio>
                                                                        <el-radio label="false">No</el-radio>
                                                                    </el-radio-group>
                                                                </el-form-item>
                                                            </el-col>
                                                            <el-col :span="24">
                                                                <el-form-item label="Priority">
                                                                    <el-radio-group v-model="forms.priority">
                                                                        <el-radio label="low">Low</el-radio>
                                                                        <el-radio label="medium">Medium</el-radio>
                                                                        <el-radio label="high">High</el-radio>
                                                                    </el-radio-group>
                                                                </el-form-item>
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <el-form-item label="Latest Version Code" prop="lastVersionCode">
                                                                    <el-input-number v-model="forms.lastVersionCode"></el-input-number>
                                                                </el-form-item>
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <el-form-item label="Max Outdate Version" prop="maxOutDateVersion">
                                                                    <el-input-number v-model="forms.maxOutDateVersion"></el-input-number>
                                                                </el-form-item>
                                                            </el-col>
                                                            <el-col :span="24">
                                                                <el-form-item label="Release Notes" prop="releaseNote">
                                                                    <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" v-model="forms.releaseNote"></el-input>
                                                                </el-form-item>
                                                            </el-col>
                                                        </el-row>
                                                    </div>
                                                </div>
                                            </el-form>
                                        </el-tab-pane>
                                        <el-tab-pane label="Edit Reference" name="reference">
                                            <div v-if="(messageerrorreference != '')">
                                                <el-alert title="Error" type="error" :description="messageerrorreference" show-icon></el-alert>
                                            </div>
                                            <div class="last-edited">
                                                <img src="~assets/images/icons/time.png"> Updated {{lastupdatereference}}
                                            </div>
                                            <el-form :model="forms" :rules="rules2" status-icon ref="formsvalidappreference" label-width="120px" class="demo-ruleForm">
                                                <div class="item-forms-details">
                                                    <div class="forms-details">
                                                        <el-row :gutter="20">
                                                            <el-col :span="24">
                                                                <el-form-item label="Referral Detail Title" prop="referalDetailTitle">
                                                                    <el-input v-model="forms.referalDetailTitle"></el-input>
                                                                </el-form-item>
                                                            </el-col>
                                                            <el-col :span="24">
                                                                <el-form-item label="Referral Short Description" prop="referalShortDesc">
                                                                    <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" v-model="forms.referalShortDesc"></el-input>
                                                                </el-form-item>
                                                            </el-col>
                                                            <el-col :span="24">
                                                                <el-form-item label="Referral Detail Description" prop="referalDetailDesc">
                                                                    <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" v-model="forms.referalDetailDesc"></el-input>
                                                                </el-form-item>
                                                            </el-col>
                                                        </el-row>
                                                    </div>
                                                </div>
                                            </el-form>
                                        </el-tab-pane>
                                    </el-tabs>
                                </section>
                            </div>
                            <div class="actions-button clearfix">
                                <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                                <el-button v-if="tabAppVersion == 'info'" class="button-white-green" id="save" @click.prevent="submitSave('formsvalidapp', 'save')">Simpan</el-button>
                                <el-button v-else class="button-white-green" id="save" @click.prevent="submitSave('formsvalidappreference', 'save')">Simpan</el-button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import timeago from 'timeago.js'
    import FUNCTIONS from '@/functions'

    export default {
        name: 'appVersion',
        data(){
            return{
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'appVersion',

                // for store data after get api
                itemsData: [],
                appVersion: [],
                reference: [],

                // another important variable data
                loading: true,
                errored: false,
                lastupdate: '',
                lastupdatereference: '',
                messageerror: '',
                messageerrorinfo: '',
                messageerrorreference: '',
                tabAppVersion: 'info',

                forms:{
                    lastVersion: '',
                    forceUpdate: '',
                    priority: '',
                    lastVersionCode: '',
                    maxOutDateVersion: '',
                    releaseNote: '',
                    referalShortDesc: '',
                    referalDetailTitle: '',
                    referalDetailDesc: '',
                },
                rules2: {
                    lastVersion: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur'  }],
                    lastVersionCode: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur'  }],
                    maxOutDateVersion: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur'  }],
                    releaseNote: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur'  }],
                    referalDetailTitle: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur'  }],
                    referalShortDesc: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur'  }],
                    referalDetailDesc: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur'  }],
                },
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['version.list'])
        },
        mounted () {
            this.getPosts()
        },
        methods: {
            // build url function
            buildUrl () {
                return this.apiUrl + this.sectionApi
            },

            // Get All Post
            getPosts(){
                let url = this.buildUrl()
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
                        this.appVersion = JSON.parse(this.itemsData.app_version)
                        this.reference = JSON.parse(this.itemsData.reference)

                        // Lastest Version Info
                        this.lastupdate = timeago().format(new Date(this.appVersion.updated_at))
                        this.forms.lastVersion = this.appVersion.latestVersion
                        this.forms.forceUpdate = this.appVersion.isForceUpdate
                        this.forms.priority = this.appVersion.priority
                        this.forms.lastVersionCode = this.appVersion.latestVersionCode
                        this.forms.maxOutDateVersion = this.appVersion.maxOutDateVersion
                        this.forms.releaseNote = this.appVersion.releaseNotes

                        // Referrence Info
                        this.lastupdatereference = timeago().format(new Date(this.reference.updated_at))
                        this.forms.referalShortDesc = this.reference.referralShortDesc
                        this.forms.referalDetailTitle = this.reference.referralDetailTitle
                        this.forms.referalDetailDesc = this.reference.referralDetailDesc
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => this.loading = false)
            },

            // Create Forms function
            Create(){
                document.querySelector('#appversionInfo').classList.add('showing');
                document.querySelector('.backdrop').classList.add('show');
                document.querySelector('body').classList.add('no-scroll');
            },

            // close modal function
            closeModal(row){
                document.querySelector('#appversionInfo').classList.remove('showing');
                document.querySelector('.backdrop').classList.remove('show');
                document.querySelector('body').classList.remove('no-scroll');
            },

            submitSave(formName, formtype){
                let loadingform = FUNCTIONS.svgSpinner;
                this.messageerrorinfo = ''
                this.messageerrorreference = ''
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formtype == 'save'){
                            document.getElementById('save').children[0].innerHTML = loadingform
                            let urlv = this.apiUrl + this.sectionApi + '/' + this.tabAppVersion
                            if(this.tabAppVersion == 'info'){
                                this.axios.put(urlv, {
                                    latestVersion: this.forms.lastVersion,
                                    latestVersionCode: this.forms.lastVersionCode,
                                    isForceUpdate:this.forms.forceUpdate,
                                    maxOutDateVersion: this.forms.maxOutDateVersion,
                                    priority:this.forms.priority,
                                    releaseNotes:  this.forms.releaseNote,
                                })
                                .then(response => {
                                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                                    if(response.data.status == 'error' && response.data.code == '500'){
                                        this.messageerrorinfo = response.data.message
                                    }else{
                                        this.messagesuccess = "AppVersion Berhasil dupdate."
                                        this.getPosts()
                                        this.closeModal();
                                    }
                                })
                                .catch(error => { 
                                    console.log(error)
                                })
                            }else{
                                this.axios.put(urlv, {
                                    referralShortDesc: this.forms.referalShortDesc,
                                    referralDetailTitle: this.forms.referalDetailTitle,
                                    referralDetailDesc: this.forms.referalDetailDesc,
                                })
                                .then(response => {
                                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                                    if(response.data.status == 'error' && response.data.code == '500'){
                                        this.messageerrorreference = response.data.message
                                    }else{
                                        this.messagesuccess = "AppVersion Berhasil dupdate."
                                        this.getPosts()
                                        this.closeModal();
                                    }
                                })
                                .catch(error => { 
                                    console.log(error)
                                })
                            }
                        }
                    } else {
                        document.getElementById('save').children[0].innerHTML = 'Simpan'
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    }
</script>

<style lang="scss">
    #appversion{
        .list-data{
            padding: 24px 0;
            border-top: 1px solid #dfe4e8;
            span{
                display: block;
                margin-bottom: 5px;
                color: #697586;
                font-size: 14px;
            }
            .badge{
                display: inline-block;
                margin-top: 5px;
            }
            b{ 
                font-size: 20px; 
                text-transform: capitalize;
            }
            h5{
                color: #39434e;
                font-size: 16px;
                margin-top: 20px;
            }
            .cards{
                p{
                    white-space: pre-line;
                    margin-top: 0;
                    margin-bottom: 0;
                }
                ul{
                    list-style: none;
                    padding: 0;
                    &:after{
                        clear: both;
                        content: '';
                        display: block;
                    }
                    li{
                        float: left;
                        width: 50%;
                        padding: 0 15px;
                        color: #697586;
                        font-size: 14px;
                        
                    }
                }
            }
        }
        .last-edited{
            background: #f6f8fa;
            color: #1a892e;
            border-radius: 3px;
            padding: 10px;
            text-align: center;
            img{
                display: inline-block;
                max-width: 16px;
                vertical-align: middle;
                margin-right: 10px;
            }
        }
        .tabs-appversions{
            .el-tabs__header{
                margin-bottom: 20px;
            }
        }
    }
</style>