<template>
    <div class="content-wrapper">
        <div id="permission">
            <div class="page-header">
                <div class="page-header-content">
                    <router-link v-bind:to="'/permission'" class="back-button">
                        <i class="icon icon-caret-left"></i> Permission
                    </router-link>
                    <div class="page-title clearfix">
                        <h4 class="float-left">Ubah Permission - {{itemsData.name}}</h4>
                    </div>
                </div>
            </div>
            <div class="content">
                <section v-if="errored">
                    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
                </section>
                <section v-else>
                    <div>
                        <div class="" v-if="itemsData">
                            <div class="cards clearfix">
                                <div class="el-loading-mask" v-if="(loading == true)">
                                    <div class="el-loading-spinner">
                                        <svg viewBox="25 25 50 50" class="circular">
                                            <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                                        </svg>
                                    </div>
                                </div>
                                <div class="accordion">
                                    <div 
                                        v-for="(dataPermission, indexPermission) in itemsDataHtml"
                                        :key="indexPermission"
                                        class="item-accordion active">
                                        <div class="head">{{dataPermission.label}}</div>
                                        <div class="content">
                                            <div class="item-permission-list">
                                                <div>
                                                    <label 
                                                        role="checkbox" 
                                                        class="el-checkbox custom-checkbox"
                                                        v-for="(dataListPermission, indexListPermission) in dataPermission.data"
                                                        :key="indexListPermission">
                                                        <span aria-checked="mixed" class="el-checkbox__input">
                                                            <span class="el-checkbox__inner"></span>
                                                            <input type="checkbox" :name="dataListPermission.key" class="el-checkbox__original" value="">
                                                        </span>
                                                        <span class="el-checkbox__label">{{dataListPermission.label}}</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <el-button round @click="Submit" v-if="$dataRole['permission.edit']" id="save" class="button-white-green float-right">Submit</el-button>
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
    
    import CryptoJS from 'crypto-js'
    
    export default {
        name: 'permission',
        data () {
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'permission',
                sectionApiData: 'data',
                idData: this.$route.params.id,

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemsDataHtml: [],
                errored: false,
                loading: false,

                // another important variable data
                forms:{},

                // message variable
                messageerror: '',
                messagesuccess: '',
            }
        },
        mounted () {
            this.getHTMLData()
        },
        methods: {
            getPostsbyId(){
                let url = this.apiURL + this.sectionApi + '/' + this.idData
                this.loading = true
                this.axios.get(url)
                .then(response => { 
                    if(response.data.status == 'error'){
                        // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemsData = response.data.data
                        this.forms = this.itemsData.permissions

                        let customCheckboxGet = document.querySelectorAll('.custom-checkbox .el-checkbox__original')

                        if(this.forms){
                            customCheckboxGet.forEach(function(element){
                                let sameName = element.getAttribute("name")
                                let value = this.forms[sameName]
                                if(value == undefined || value == '' || value == false || value == null){
                                    element.setAttribute("value", 'false')
                                }else{
                                    element.setAttribute("value", 'true')
                                    element.parentNode.classList.add('is-checked')
                                }
                            },this);
                        }
                    }
                })
                .catch(error => { 
                    console.log(error)
                    this.errored = true 
                })
                .finally(() => this.loading = false)
            },
            getHTMLData(){
                let url = this.apiURL + this.sectionApi + '/' + this.sectionApiData
                this.loading = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemsDataHtml = response.data.data
                    }
                })
                .catch(error => { 
                    console.log(error)
                    this.errored = true 
                })
                .finally(() => {
                    this.loading = false
                    this.getPostsbyId()

                    this.$nextTick(function () {
                        // Code that will run only after the
                        // entire view has been rendered
                        let customCheckbox = document.querySelectorAll('.custom-checkbox .el-checkbox__original')

                        for(let i = 0; i<=customCheckbox.length; i++){
                            customCheckbox[i].addEventListener('click', function(event){
                                if(customCheckbox[i].parentNode.classList.contains('is-checked')){
                                    customCheckbox[i].setAttribute("value", "false")
                                    customCheckbox[i].parentNode.classList.remove('is-checked')
                                    event.preventDefault();   
                                }else{
                                    customCheckbox[i].setAttribute("value", "true")
                                    customCheckbox[i].parentNode.classList.add('is-checked')
                                    event.preventDefault();   
                                }
                            }, false)
                        }

                    })
                })
            },
            Submit(){
                let loadingform = FUNCTIONS.svgSpinner;
                let url = this.apiURL + this.sectionApi + '/' + this.idData

                let jsonData = {}
                let data
                let customCheckboxsubmit = document.querySelectorAll('.custom-checkbox .el-checkbox__original')
                customCheckboxsubmit.forEach(function(element){
                    let names = element.getAttribute("name");
                    let value = element.getAttribute("value")
                    let valueData

                    if(value === "true" || value === true){
                        valueData = true
                        jsonData[""+names+""] = valueData
                    }else{
                        valueData = false
                        jsonData[""+names+""] = valueData
                    }
                });

                data = jsonData

                document.getElementById('save').children[0].innerHTML = loadingform

                this.axios.put(url, data)
                .then(response => { 
                    let keyPhrase = process.env.KEY_UNLOCK + this.$cookies.get(CryptoJS.MD5('ID-LOG').toString())
                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                    window.location.href = '/permission'

                    if(this.$getRoles == this.idData){
                        let EncriptValuePermission = CryptoJS.AES.encrypt(JSON.stringify(response.data.data.permissions), keyPhrase).toString()
                        this.$localStorage.set(CryptoJS.MD5('permission').toString(), EncriptValuePermission)
                    }
                })
                .catch(error => { this.errored = true })
                .finally(() => this.loading = false)
            }
        },
    }
</script>

<style lang="scss">
    #permission{
        .item-permission-list{
            max-width: 100%;
            .el-checkbox__label{
                font-size: 13px;
                padding-left: 5px;
                white-space: normal;
                vertical-align: top;
            }
            label{
                margin-bottom: 15px;
            }
            &>div{
                label{
                    margin-left: 0;
                    margin-bottom: 15px;
                    margin-right: 15px;
                    width: 310px;
                }
            }
        }
    }
    .accordion{
        .item-accordion{
            margin-bottom: 15px;
            .head{
                background: #f6f8fa;
                padding: 8px 15px;
                border: 1px solid #bfc9d8;
                border-radius: 3px;
                font-size: 14px;
                font-weight: 600;
                .el-checkbox{
                    margin-right: 5px;
                }
                img{
                    float: right;
                    margin-top: 4px;
                    transition: all .4s ease;
                    transform-origin: 70% 50%;
                    display: none;
                }
                &:after{
                    display: block;
                    clear: both;
                    content: "";
                }
            }
            .content{
                transition: max-height .4s ease;
                max-height: 0;
                opacity: 0;
                visibility: hidden;
                border: 1px solid #bfc9d8;
                border-top: none;
                padding-bottom: 0;
                border-bottom-left-radius: 3px;
                border-bottom-right-radius: 3px;
                overflow: hidden;
                .item-permission-list{
                    padding: 15px 5px;
                    padding-bottom: 0;
                }
            }
            &.active{
                .head{
                    border-bottom-left-radius: 0;
                    border-bottom-right-radius: 0;
                    img{
                        transform: scale(-1);
                    }
                }
                .content{
                    max-height: 500px;
                    opacity: 1;
                    visibility: visible;
                }   
            }
        }
    }
</style>
