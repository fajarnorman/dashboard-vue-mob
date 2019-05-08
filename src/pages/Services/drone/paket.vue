<template>
    <div class="content-wrapper">
        <div id="package-drone">
            <div class="page-header">
                <page-header titleName="Paket Drone" :isCreate="$dataRole['service.drone.post.product.create']"></page-header>
            </div>
            <div class="content">
                <!-- <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img src='~assets/images/icons/search1.png'>
                    </div>
                </div> -->
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
                    <el-table-column prop="name" label="Name"></el-table-column>
                    <el-table-column label="Price">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.price)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Max Land Size">
                        <template slot-scope="scope">
                            {{formatPrice(scope.row.max_landsize)}} m<sup>2</sup>
                        </template>
                    </el-table-column>
                    <el-table-column label="Min Land Size">
                        <template slot-scope="scope">
                            {{formatPrice(scope.row.min_landsize)}} m<sup>2</sup>
                        </template>
                    </el-table-column>
                    <el-table-column label="Updated At">
                        <template slot-scope="scope">
                            <div v-if="scope.row.updated_at !== null">{{scope.row.updated_at | moment("YYYY-MM-DD, H:mm:ss")}}</div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                </el-table>
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
                                <h5>Info Paket</h5>
                                <div class="forms-details">
                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <el-form-item label="Nama Produk" prop="productName">
                                                <el-input v-model="forms.productName"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="Price" prop="productPrice">
                                                <div class="el-form-item__content custom-price-format">
                                                    <div class="el-input">
                                                        <money v-model="forms.productPrice" v-bind="money" class="el-input__inner"></money>
                                                    </div>
                                                </div>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="Maximal Ukuran Lahan" prop="maxLandsize">
                                                <el-input-number :min="0" v-model="forms.maxLandsize"></el-input-number>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="Minimal Ukuran Lahan" prop="minLandsize">
                                                <el-input-number :min="0" v-model="forms.minLandsize"></el-input-number>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="Details" style="position: relative;">
                                                <a href="#" @click.prevent="productDetailCount++" style="position: absolute;top: -36px;z-index: 10;left: 55px;" class="add-details"><font-awesome-icon class="fontIcons" :icon="fontsIcons.plus" /></a>
                                                <div style="line-height: normal;margin-bottom:10px;position:relative;" v-for="(data, index) in productDetailCount" :key="index">
                                                    <div style="display:inline-block; width: 95%;">
                                                        <el-input v-model="productDetailArray[index]" :disabled="(productFormat[index] == 'youtube') || productFormat[index] == null">
                                                            <el-select class="cursor-is-allowed" v-model="productFormat[index]" slot="prepend" placeholder="Select" @change="changeProductFormat(index)">                                                            
                                                                <el-option label="Normal" value="normal"></el-option>
                                                                <el-option label="Youtube" value="youtube"></el-option>
                                                                <el-option label="Italic" value="italic"></el-option>
                                                            </el-select>
                                                        </el-input>
                                                    </div>
                                                    <a href="#" @click.prevent="changeProductFormat(index)" v-if="productFormat[index] == 'youtube'" class="change-youtube">Change Link</a>
                                                    <a href="#" @click.prevent="removeDetails(index)" style="margin-left: 10px;" class="close-details"><font-awesome-icon class="fontIcons" :icon="fontsIcons.close" /></a>
                                                </div>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
                                <span style="font-weight: 600; font-size: 12px; color: rgb(128, 0, 128);">*Note : satuan ukuran lahan adalah meter persegi (m<sup>2</sup>) </span>
                            </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button v-if="$dataRole['service.drone.delete.product.delete.*']" v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                            <img src="~assets/images/icons/trash.png" alt="img-trash">
                        </el-button>
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                        <el-button v-if="$dataRole['service.drone.put.product.update.*']" v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                        <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                    </div>
                </div>
                <el-dialog
                    title="Youtube Link"
                    :visible.sync="dialogProductDetailYoutube"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    class="mb-dialog nopadding-right point-modal kepala-regional"
                    width="40%">
                    <div class="content-dialog">
                         <el-row :gutter="20">
                            <el-col :span="24">
                                <div class="youtube-field">
                                    <span>Link</span>
                                    <el-input v-model="formsYoutube.link"></el-input>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="youtube-field">
                                    <span>Deskripsi</span>
                                    <el-input type="textarea" rows="5" v-model="formsYoutube.deskripsi"></el-input>
                                </div>
                            </el-col>
                         </el-row>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click.prevent="confirmYoutubeLink(productYoutubeIndex)" round class="button-white-green" type="primary">Confirm</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { Money } from "v-money"
import services from "@/service"
import FUNCTIONS from "@/functions"
import pageHeader from "@/components/partials/pageHeader.vue"
import loadingSvg from "@/components/partials/loadingSvg.vue"
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'

export default {
    name: "package-drone",
    data() {
        var validatorMinNumberValue = (rule, value, callback) => {
            if(value === "" || value === 0){
                callback(new Error("Inputan harus di isi"))
            }else{
                if(this.forms.minLandsize > this.forms.maxLandsize){
                    callback(new Error("Min Land Size tidak boleh lebih dari Max Land Size"))
                }
                callback()
            }
        }
        var validatorMaxNumberValue = (rule, value, callback) => {
            if(value === "" || value === 0){
                callback(new Error("Inputan harus di isi"))
            }else{
                callback()
            }
        }
        return {
            sectionApi: "drone?servicePathUrl=product",
            loading: false,
            loadingForm: false,
            dialogProductDetailYoutube: false,
            itemsData: [],
            itemDataDetail: [],
            searchQuery: "",
            directionQuery: "DESC",
            perPage: 1000,
            currentPage: 1,
            titleForms: "",
            formsType: "",
            messagesuccess: "",
            messageerror: "",
            dataTextCreate: "Buat Paket Drone",
            dataTextUpdate: "Edit Paket Drone",
            confirmDescDelete: "Anda yakin akan menghapus data Paket dari daftar?",
            confirmTitleDelete: "Hapus Paket",
            textDataCreateSuccess: "Data Paket Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data Paket Berhasil diupdate.",
            textDataDeleteSuccess: "1 Items Berhasil dihapus.",
            textMemuatData: "Masih memuat data",
            textErrorNetwork: "Jaringan Bermasalah",
            productDetailCount: 1,
            productDetailArray: [],
            productFormat: [],
            productYoutubeIndex: '',
            forms: {
                productName: "",
                productPrice: 0,
                maxLandsize: 0,
                minLandsize: 0,
                productDetails: "test",
            },
            formsYoutube:{
                link: '',
                deskripsi: '',
            },
            rules: {
                productName: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
                maxLandsize: [ { required: true, validator: validatorMaxNumberValue, trigger: "blur" } ],
                minLandsize: [ { required: true, validator: validatorMinNumberValue, trigger: "blur" } ]
            },
            money: {
                decimal: ",",
                thousands: ".",
                prefix: "",
                suffix: "",
                precision: 0,
                masked: false /* doesn't work with directive */
            },
            fontsIcons: {
                close: faTimes,
                plus: faPlus
            }
        }
    },
    watch: {
        searchQuery: function() {
            this.getResult()
            FUNCTIONS.checkPaginations()
        },
        dialogProductDetailYoutube: function(newValue){
            if(newValue == false){
                this.formsYoutube.link = ''
                this.formsYoutube.deskripsi = ''
            }
        }
    },
    created() {
        // FUNCTIONS.checkRolesIsSuperAdmin(this.$getRoles)
        FUNCTIONS.checkPermissions(this.$dataRole["service.drone.get.product"])
    },
    mounted() {
        this.getPost()
        this.initCreateFunction()
    },
    methods: {
        async getPost() {
            let url = this.urlService + this.sectionApi + '&limit=' + this.perPage + '&page=' + this.currentPage + '&direction=' + this.directionQuery + "&keyword=" + this.searchQuery + '&orderBy=createdAt'
            try{
                this.loading = true
                const response = await services.getList(url)
                this.loading = false
                if(response.data.status == 'success'){
                    this.itemsData = response.data.data
                }else{
                    FUNCTIONS.notify('error', 'Error', response.data.message)
                }
            }catch(err){
                this.loading = false
                FUNCTIONS.notify('error', this.textErrorNetwork, "Gagal mendapatkan data")
            }
        },
        getResult: _.debounce(function() {
            this.getPost()
        }, 500),
        submitSave(formName, formtype) {
            let loadingform = FUNCTIONS.svgSpinner
            this.messagesuccess = ""
            this.messageerror = ""
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if(this.productDetailArray.length !== 0){
                        this.productFormat.forEach((key, i) => {
                            if(key == 'italic'){
                                this.productDetailArray[i] = 'note-' + this.productDetailArray[i]
                            }
                        })
                        if(formtype == "save") {
                            document.getElementById("save").children[0].innerHTML = loadingform
                            let url = this.urlService + this.sectionApi + "/create"
                            let datas = {
                                productName: this.forms.productName,
                                productPrice: this.forms.productPrice,
                                maxLandsize: this.forms.maxLandsize,
                                minLandsize: this.forms.minLandsize,
                                productDetails: (this.productDetailArray).toString(),
                            }
                            this.postFunction("post", datas, url)
                        }else{
                            document.getElementById("save-edit").children[0].innerHTML = loadingform
                            let urlv = this.urlService + this.sectionApi + "/update/" + this.itemDataDetail.id
                            let datas = {
                                productName: this.forms.productName,
                                productPrice: this.forms.productPrice,
                                maxLandsize: this.forms.maxLandsize,
                                minLandsize: this.forms.minLandsize,
                                productDetails: (this.productDetailArray).toString(),
                            }
                            this.postFunction("put", datas, urlv)
                        }
                    }else{
                        FUNCTIONS.notify('error', 'Error', 'Maaf Details tidak boleh kosong')
                    }
                }
            })
        },
        deletePost(id) {
            this.$confirm(this.confirmDescDelete, this.confirmTitleDelete, {
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                type: "warning"
            }).then(() => {
                let url = this.urlService + this.sectionApi + "/delete/" + id
                this.postFunction("delete", "", url)
            });
        },
        handleCurrentChange(val) {
            if (val) {
                this.titleForms = this.dataTextUpdate
                this.formsType = "edit"
                this.itemDataDetail = val
                FUNCTIONS.sidebarToggle(true)

                this.forms.productName = this.itemDataDetail.name
                this.forms.productPrice = this.itemDataDetail.price
                this.forms.productDetails = this.itemDataDetail.product_details
                this.forms.minLandsize = this.itemDataDetail.min_landsize
                this.forms.maxLandsize = this.itemDataDetail.max_landsize

                if(this.itemDataDetail.product_details !== null){
                    let datasDetailsArray = this.itemDataDetail.product_details.split(",")
                    this.productDetailCount = datasDetailsArray.length
                    datasDetailsArray.forEach(function(e, i){
                        if(e.includes('youtube-')){
                            this.productFormat[i] = 'youtube'
                            this.productDetailArray[i] = e
                        }else if(e.includes('note-')){
                            this.productFormat[i] = 'italic'
                            this.productDetailArray[i] = e.substr(5)
                        }else{
                            this.productFormat[i] = 'normal'
                            this.productDetailArray[i] = e
                        }
                    }, this)
                }
            }
        },
        initCreateFunction() {
            let that = this
            setTimeout(function() {
                document.querySelector(".add-click-forms").addEventListener("click", function() {
                    if(that.loading == false){
                        that.titleForms = that.dataTextCreate
                        that.formsType = "create"
                        FUNCTIONS.sidebarToggle(true)
                    }else{
                        FUNCTIONS.notify('warning', 'Maaf', that.textMemuatData)
                    }
                })
            }, 500)
        },
        closeModal(row) {
            FUNCTIONS.sidebarToggle(false)
            this.$refs.singleTable.setCurrentRow(row)
            this.$refs.formsvalid.resetFields()
            this.itemDataDetail = []
            this.productDetailArray = []
            this.productFormat = []
            this.productDetailCount = 1
            this.productYoutubeIndex = ''
            this.formsYoutube.link = ''
            this.formsYoutube.deskripsi = ''
        },
        postFunction(type, credentials, url) {
            if(type == "post"){
                this.axios.post(url, credentials)
                .then(response => {
                    document.getElementById("save").children[0].innerHTML = "Simpan"
                    if(response.data.status == "error") {
                        FUNCTIONS.notify('error', 'Error', response.data.message)
                    }else{
                        this.messagesuccess = this.textDataCreateSuccess
                        this.getPost()
                        this.closeModal()
                    }
                }).catch(error => {
                    FUNCTIONS.notify('error', this.textErrorNetwork, "Gagal menyimpan data")
                })
            }else if(type == "put"){
                this.axios.put(url, credentials)
                .then(response => {
                    document.getElementById("save-edit").children[0].innerHTML = "Simpan"
                    if(response.data.status == "error"){
                        FUNCTIONS.notify('error', 'Error', response.data.message)
                    }else{
                        this.messagesuccess = this.textDataUpdateSuccess
                        this.getPost()
                        this.closeModal()
                    }
                })
                .catch(error => {
                    FUNCTIONS.notify('error', this.textErrorNetwork, "Gagal mengedit data")
                });
            }else if (type == "delete"){
                this.axios.delete(url)
                .then(response => {
                    if(response.data.status == "success"){
                        this.messagesuccess = this.textDataDeleteSuccess
                        this.getPost()
                        this.closeModal()
                    }else{
                        FUNCTIONS.notify('error', 'Error', response.data.message)
                    }
                })
                .catch(error => {
                    FUNCTIONS.notify('error', this.textErrorNetwork, "Gagal menghapus data")
                })
                .finally(() => {
                    this.closeModal()
                })
            }
        },
        formatPrice(value){
            return FUNCTIONS.formatPrice(value)
        },
        changeProductFormat(index){
            this.productYoutubeIndex = index
            if(this.productFormat[index] == 'youtube'){
                this.dialogProductDetailYoutube = true
                if(this.productDetailArray[index] !== ''){
                    let youtubeSplit = this.productDetailArray[index].split("-")
                    this.formsYoutube.link = youtubeSplit[1]
                    this.formsYoutube.deskripsi = youtubeSplit[2]
                }
            }else{
                this.productDetailArray[index] = ''
            }
        },
        confirmYoutubeLink(index){
            if(this.formsYoutube.link !== '' && this.formsYoutube.deskripsi !== ''){
                if(FUNCTIONS.validURL(this.formsYoutube.link)){
                    let value = 'youtube-'+this.formsYoutube.link + '-' + this.formsYoutube.deskripsi
                    this.productDetailArray[index] = value
                    this.dialogProductDetailYoutube = false
                }else{
                    FUNCTIONS.notify('warning', 'Maaf', 'Link tidak valid')
                }
            }else{
                FUNCTIONS.notify('warning', 'Maaf', 'Inputan Youtube harus diisi lengkap')
            }
        },
        removeDetails(index){
            this.productDetailArray.splice(index, 1)
            this.productFormat.splice(index, 1)
            this.productDetailCount--
        }
    },
    components: { pageHeader, loadingSvg, Money }
};
</script>
<style lang="scss">
.youtube-field{
    margin-bottom: 15px;
    span{
        font-weight: 600;
    }
}
#package-drone{
    .el-input-group__prepend{
        width: 105px;
        .el-select__caret{
            &:before{
                margin-top: 0 !important;
            }
        }
    }
    .change-youtube{
        position: absolute;
        right: 33px;
        background: #fff;
        padding: 8px;
        bottom: 0;
        border-right: 1px solid #ddd;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        color: #697586;
    }
}
</style>
