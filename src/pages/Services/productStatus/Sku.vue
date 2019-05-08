<template>
    <div class="content-wrapper">
        <div id="master-barang-attribute">
            <div class="page-header">
                <page-header titleName="Product Status SKU" :isCreate="$dataRole['service.product-status.post.cms.sku']"></page-header>
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
                <div class="filterstatus">
                    <el-tabs v-model="filterQuery">
                        <el-tab-pane label="Active" name="active"></el-tab-pane>
                        <el-tab-pane label="Inactive" name="inactive"></el-tab-pane>
                    </el-tabs>
                </div>
                <el-table
                    :data="itemsData"
                    max-height="530"
                    empty-text="No data available in table"
                    @current-change="handleCurrentChange"
                    ref="singleTable"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column type="index" label="No" width="50"></el-table-column>
                    <el-table-column prop="name" label="Name"></el-table-column>
                    <el-table-column prop="code" label="Code"></el-table-column>
                    <el-table-column prop="operator" label="Operator"></el-table-column>
                    <el-table-column prop="supplier" label="Supplier"></el-table-column>
                    <el-table-column prop="status" label="Status"></el-table-column>
                    <el-table-column prop="priority" label="Priority"></el-table-column>
                </el-table>
                <div class="mobayar-actions-bottom clearfix">
                    <div class="showing-page float-left">
                        <span>View</span>
                        <ul>
                            <li class="active"><a href="#" @click.prevent="limitChange('10', $event)">10</a></li>
                            <li><a href="#" @click.prevent="limitChange('25', $event)">25</a></li>
                            <li><a href="#" @click.prevent="limitChange('50', $event)" >50</a></li>
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
                                <h5>Info Sku</h5>
                                <div class="forms-details">
                                    <el-row :gutter="20">
                                        <el-col :span="24">
                                            <el-form-item label="SKU">
                                                <div class="input-with-icons clearfix">
                                                    <div class="el-input searchtype">
                                                        <input type="text" v-model="skuChanger" class="el-input__inner selectUser" placeholder="Select SKU">
                                                        <img src="~assets/images/icons/arrow-down.png">
                                                        <div class="dropdown-filterable dropdown-user">
                                                            <ul>
                                                                <div v-if="searchLoading == true">
                                                                    <li><a style="text-align:center;pointer-event:none;">Loading Data</a></li>
                                                                </div>
                                                                <div v-else>
                                                                    <div v-if="itemsDataSKU.length !== 0">
                                                                        <li v-for="(itemUser, indexUser) in itemsDataSKU"
                                                                        :key="indexUser"><a href="#" @click.prevent="filterByUser(itemUser)">{{itemUser.name}} ({{itemUser.supplier}})</a></li>
                                                                    </div>
                                                                    <div v-else><li><a style="text-align:center;pointer-event:none;">No data</a></li></div>
                                                                </div>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- <el-select v-model="skuChanger" placeholder="Select">
                                                <el-option 
                                                    v-for="(dataSKU, indexSKU) in itemsDataSKU"
                                                    :key="indexSKU"
                                                    :value="dataSKU"
                                                    :label="dataSKU.name">{{dataSKU.name}} ({{dataSKU.supplier}})</el-option>
                                                </el-select> -->
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="Kode" prop="code">
                                                <el-input v-model="forms.code"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="Nama" prop="name">
                                                <el-input v-model="forms.name"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="Operator" prop="operator">
                                                <el-input v-model="forms.operator"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="Price" prop="price">
                                                <div class="el-form-item__content custom-price-format">
                                                    <div class="el-input">
                                                        <money v-model="forms.price" v-bind="money" class="el-input__inner"></money>
                                                    </div>
                                                </div>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="Priority" prop="priority">
                                                <el-input type="number" v-model="forms.priority"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="Status" prop="status">
                                                <el-radio-group v-model="forms.status">
                                                    <el-radio label="active">Active</el-radio>
                                                    <el-radio label="inactive">InActive</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="Supplier">
                                                <el-select v-model="forms.supplier" placeholder="Select">
                                                    <el-option 
                                                        v-for="(dataFilterSup, indexSup) in $dataSupplier"
                                                        :key="indexSup"
                                                        :value="(dataFilterSup).toUpperCase()"
                                                        :label="(dataFilterSup).toUpperCase()">{{(dataFilterSup).toUpperCase()}}</el-option>
                                                    </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </el-form>
                    </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button v-if="$dataRole['service.product-status.delete.cms.sku.*']" v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                            <img src="~assets/images/icons/trash.png" alt="img-trash">
                        </el-button>
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                        <el-button v-if="$dataRole['service.product-status.put.cms.sku.*']" v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                        <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import JQuery from "jquery"
import { Money } from "v-money"
import services from "@/service"
import FUNCTIONS from "@/functions"
import pageHeader from "@/components/partials/pageHeader.vue"
import loadingSvg from "@/components/partials/loadingSvg.vue"

export default {
    name: "productStatus-sku",
    data() {
        return {
            apiURL: process.env.ROOT_API,
            sectionApi: "product-status?servicePathUrl=cms/sku",
            sectionApiSKU: "skus",
            loading: false,
            loadingForm: false,
            itemsData: [],
            itemDataDetail: [],
            itemsDataSKU: [],
            searchQuery: "",
            totalPage: "",
            filterQuery: "active",
            perPage: 10,
            currentPage: 1,
            titleForms: "",
            formsType: "",
            messagesuccess: "",
            messageerror: "",
            dataTextCreate: "Buat Sku Baru",
            dataTextUpdate: "Edit Sku",
            confirmDescDelete: "Anda yakin akan menghapus data Sku dari daftar?",
            confirmTitleDelete: "Hapus Sku",
            textDataCreateSuccess: "Data Sku Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data Sku Berhasil diupdate.",
            textDataDeleteSuccess: "1 Items Berhasil dihapus.",
            textMemuatData: "Masih memuat data",
            textErrorNetwork: "Jaringan Bermasalah",
            forms: {
                code: "",
                name: "",
                priority: 0,
                status: "active",
                price: 0,
                operator: "",
                supplier: "",
            },
            rules: {
                name: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
                code: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ]
            },
            money: {
                decimal: ",",
                thousands: ".",
                prefix: "",
                suffix: "",
                precision: 0,
                masked: false /* doesn't work with directive */
            },
            dataOperator: [],
            dataSupplier: [],
            dataGroupOperator: [],
            dataReal: [],
            dataReal2: [],
            searchLoading: false,
            skuChanger: '',
        };
    },
    watch: {
        searchQuery: function(newValue) {
            this.getResult(newValue);
            document.querySelector(".el-pagination").children[1].children[0].click();
        },
        filterQuery: function(){
            this.getPost(this.searchQuery)
        }
    },
    created() {
        // FUNCTIONS.checkRolesIsSuperAdmin(this.$getRoles)
        FUNCTIONS.checkPermissions(this.$dataRole["service.product-status.get.cms.sku"]);
    },
    mounted() {
        this.getPostSKU('')
        this.getPost(this.searchQuery)
        this.initCreateFunction()
    },
    methods: {
        async getPostSKU(search) {
            let url = this.apiURL + this.sectionApiSKU + "?limit=20&page=1&search=" + search + '&direction=ASC'
            try{
                this.searchLoading = true
                const response = await services.getList(url)
                this.searchLoading = false
                if(response.data.status == 'success'){
                    this.itemsDataSKU = response.data.data
                }else{
                    FUNCTIONS.notify('error', 'Error', response.data.message)
                }
            }catch(err){
                this.searchLoading = false
                FUNCTIONS.notify('error', this.textErrorNetwork, "Gagal mendapatkan data")
            }
        },
        searchUserInit(){
            let that = this
            setTimeout(function(){
                if(document.querySelector('.selectUser') !== null){
                    document.querySelector('.selectUser').addEventListener('click', function(){
                        if(document.querySelector('.dropdown-user')){
                            document.querySelector('.dropdown-user').classList.add('dropdown-showing')
                        }
                    });
                    document.addEventListener('click', function(e){
                        if(!JQuery(e.target).closest('.selectUser, .dropdown-user').length){
                            if(document.querySelector('.dropdown-user')){
                                document.querySelector('.dropdown-user').classList.remove('dropdown-showing')
                            }
                        }
                    })
                    var textInput = document.querySelector('.selectUser')
                    var timeout = null;
                    textInput.onkeyup = function (e) {
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            that.getPostSKU(textInput.value)
                            console.log('Input Value:', textInput.value)
                        }, 800);
                    };
                }
            }, 500)
        },
        filterByUser(value){
            this.skuChanger = value.name + ' (' + value.supplier + ')'
            this.forms.code = value.code
            this.forms.name = value.name
            this.forms.status = value.status
            this.forms.price = parseInt(value.price)
            this.forms.supplier = value.supplier
            // this.forms.operator = value.operator_code
            // console.log(value.supplier)
            JQuery('.dropdown-user').removeClass('dropdown-showing')
        },
        getPost(search) {
            this.loading = true;
            let url = this.urlService + this.sectionApi + '&limit=' + this.perPage + '&page=' + this.currentPage + '&status=' + this.filterQuery
            this.axios
            .get(url).then(response => {
                if(response.data.status == "success"){
                    this.itemsData = response.data.data.rows
                    this.totalPage = response.data.data.total
                    this.loading = false
                }else{
                    this.$notify.error({
                        title: "Error",
                        message: response.data.message
                    })
                }
            })
            .catch(error => {
                this.$notify.error({
                    title: this.textErrorNetwork,
                    message: "Gagal mendapatkan data"
                });
            })
        },
        getResult: _.debounce(function(search) {
            this.getPost(search)
        }, 500),
        submitSave(formName, formtype) {
            let loadingform = FUNCTIONS.svgSpinner
            this.messagesuccess = ""
            this.messageerror = ""
            this.$refs[formName].validate(valid => {
                if(valid){
                    this.itemsData = []
                    if(formtype == "save"){
                        document.getElementById("save").children[0].innerHTML = loadingform
                        let urlv = this.urlService + this.sectionApi
                        this.postFunction("post", this.forms, urlv)
                    }else{
                        document.getElementById("save-edit").children[0].innerHTML = loadingform
                        let urlv = this.urlService + this.sectionApi + "/" + this.itemDataDetail.id
                        this.postFunction("put", this.forms, urlv)
                    }
                }
            });
        },
        deletePost(id) {
            this.$confirm(this.confirmDescDelete, this.confirmTitleDelete, {
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                type: "warning"
            }).then(() => {
                this.itemsData = []
                let url = this.urlService + this.sectionApi + "/" + id
                this.postFunction("delete", "", url)
                this.initClickCreateFunction("hide")
            });
        },
        handleCurrentChange(val) {
            if(val){
                this.titleForms = this.dataTextUpdate
                this.formsType = "edit"

                this.itemDataDetail = val
                this.forms.code = this.itemDataDetail.code
                this.forms.name = this.itemDataDetail.name
                this.forms.priority = this.itemDataDetail.priority
                this.forms.status = this.itemDataDetail.status
                this.forms.supplier = this.itemDataDetail.supplier
                this.forms.price = this.itemDataDetail.price
                this.forms.operator = this.itemDataDetail.operator
                this.skuChanger = this.itemDataDetail.name
                this.getPostSKU(this.itemDataDetail.name)
                this.initClickCreateFunction("show")
            }
        },
        pageChange(page) {
            this.currentPage = page
            this.getPost(this.searchQuery)
        },
        limitChange(limit) {
            this.perPage = limit
            document.querySelector(".el-pagination").children[1].children[0].click()
            this.getPost(this.searchQuery)
            document.querySelectorAll(".showing-page ul li").forEach(function(a) { a.classList.remove("active") })
            event.target.parentNode.classList.add("active")
        },
        initCreateFunction() {
            let that = this
            setTimeout(function() {
                document.querySelector(".add-click-forms").addEventListener("click", function() {
                    if(that.loading == false){
                        that.titleForms = that.dataTextCreate
                        that.formsType = "create"
                        that.getPostSKU('')
                        that.initClickCreateFunction("show")
                    }else{
                        that.$notify({
                            type: "warning",
                            title: "Maaf",
                            message: that.textMemuatData
                        })
                    }
                })
            }, 500)
        },
        closeModal(row) {
            this.initClickCreateFunction("hide")
            this.$refs.singleTable.setCurrentRow(row)
            this.$refs.formsvalid.resetFields()
            this.forms.base_url = ""
            this.forms.name = ""
            this.forms.slug = ""
            this.skuChanger = ""
        },
        initClickCreateFunction(value) {
            if(value == "show"){
                document.querySelector(".base-template-sidebar").classList.add("showing")
                document.querySelector(".backdrop").classList.add("show")
                document.querySelector("body").classList.add("no-scroll")
                this.searchUserInit()
            }else{
                document.querySelector(".base-template-sidebar").classList.remove("showing")
                document.querySelector(".backdrop").classList.remove("show")
                document.querySelector("body").classList.remove("no-scroll")
                this.searchUserInit()
            }
        },
        postFunction(type, credentials, url) {
            if(type == "post"){
                this.axios.post(url, credentials)
                .then(response => {
                    document.getElementById("save").children[0].innerHTML = "Simpan"
                    if(response.data.status == "error"){
                        this.messageerror = response.data.message
                    }else{
                        this.messagesuccess = this.textDataCreateSuccess
                        this.getPost("")
                        this.closeModal()
                    }
                })
                .catch(error => {
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: "Gagal menyimpan data"
                    })
                })
            }else if(type == "put"){
                this.axios.put(url, credentials)
                .then(response => {
                    document.getElementById("save-edit").children[0].innerHTML = "Simpan"
                    if(response.data.status == "error"){
                        this.messageerror = response.data.message
                    }else{
                        this.messagesuccess = this.textDataUpdateSuccess
                        this.getPost("")
                        this.closeModal()
                    }
                })
                .catch(error => {
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: "Gagal mengedit data"
                    })
                })
            }else if(type == "getbyid"){
                this.loadingForm = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == "success"){
                        this.itemDataDetail = response.data.data
                        this.forms = this.itemDataDetail
                    }
                })
                .catch(error => {
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: "Gagal mendapatkan data detail"
                    })
                })
                .finally(() => {
                    this.loadingForm = false
                });
            }else if(type == "delete"){
                this.axios.delete(url)
                .then(response => {
                    if(response.data.status == "success"){
                        this.messagesuccess = this.textDataDeleteSuccess
                        this.getPost("")
                        this.closeModal()
                    }
                })
                .catch(error => {
                    this.$notify.error({
                        title: this.textErrorNetwork,
                        message: "Gagal menghapus data"
                    })
                })
                .finally(() => {
                    this.closeModal()
                })
            }
        }
    },
    components: { pageHeader, loadingSvg, Money }
};
</script>