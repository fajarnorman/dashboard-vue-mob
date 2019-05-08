<template>
    <div class="content-wrapper">
        <div id="master-barang-attribute">
            <div class="page-header">
                <page-header titleName="Jenis Pertanian" :isCreate="$dataRole['service.drone.post.land.create']"></page-header>
            </div>
            <div class="content">
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
                    <el-table-column type="index" label="No"></el-table-column>
                    <el-table-column prop="name" label="Name"></el-table-column>
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
                                <h5>Info Jenis Pertanian</h5>
                                <div class="forms-details">
                                    <el-row :gutter="20">
                                        <el-col :span="24">
                                            <el-form-item label="Nama Jenis Pertanian" prop="landName">
                                                <el-input v-model="forms.landName"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </el-form>
                    </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button v-if="$dataRole['service.drone.delete.land.delete.*']" v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                            <img src="~assets/images/icons/trash.png" alt="img-trash">
                        </el-button>
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                        <el-button v-if="$dataRole['service.drone.put.land.update.*']" v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                        <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import services from "@/service"
import FUNCTIONS from "@/functions"
import pageHeader from "@/components/partials/pageHeader.vue"
import loadingSvg from "@/components/partials/loadingSvg.vue"

export default {
    name: "typeland-drone",
    data() {
        return {
            sectionApi: "drone?servicePathUrl=land",
            loading: false,
            loadingForm: false,
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
            dataTextCreate: "Buat Jenis Pertanian",
            dataTextUpdate: "Edit Jenis Pertanian",
            confirmDescDelete: "Anda yakin akan menghapus data jenis pertanian dari daftar?",
            confirmTitleDelete: "Hapus Jenis Pertanian",
            textDataCreateSuccess: "Data Jenis Pertanian Berhasil ditambahkan",
            textDataUpdateSuccess: "Data Jenis Pertanian Berhasil diubah",
            textDataDeleteSuccess: "Data Jenis Pertanian Berhasil dihapus",
            textMemuatData: "Masih memuat data",
            textErrorNetwork: "Jaringan Bermasalah",
            forms: {
                landName: ""
            },
            rules: {
                landName: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ]
            }
        }
    },
    watch: {
        searchQuery: function() {
            this.getResult()
            FUNCTIONS.checkPaginations()
        }
    },
    created() {
        FUNCTIONS.checkPermissions(this.$dataRole["service.drone.get.land"])
    },
    mounted() {
        this.getPost()
        this.initCreateFunction()
    },
    methods: {
        async getPost() {
            let url = this.urlService + this.sectionApi + '&limit=' + this.perPage + '&page=' + this.currentPage + '&direction=' + this.directionQuery + "&keyword=" + this.searchQuery + "&orderBy=createdAt"
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
        async postFunction(type, credentials, url) {
            if(type == "post"){
                try{
                    const response = await services.postList(url, this.forms)
                    document.getElementById("save").children[0].innerHTML = "Simpan"
                    if(response.data.status == "success") {
                        this.messagesuccess = this.textDataCreateSuccess
                        this.getPost()
                        this.closeModal()
                    }else{
                        FUNCTIONS.notify('error', 'Error', response.data.message)
                    }
                }catch(err){
                    FUNCTIONS.notify('error', this.textErrorNetwork, "Gagal menyimpan data")
                }
            }else if(type == "put"){
                try{
                    const response = await services.putList(url, this.forms)
                    document.getElementById("save-edit").children[0].innerHTML = "Simpan"
                    if(response.data.status == "success") {
                        this.messagesuccess = this.textDataUpdateSuccess
                        this.getPost()
                        this.closeModal()
                    }else{
                        FUNCTIONS.notify('error', 'Error', response.data.message)
                    }
                }catch(err){
                    FUNCTIONS.notify('error', this.textErrorNetwork, "Gagal mengedit data")
                }
            }else if (type == "delete"){
                try{
                    const response = await services.deleteList(url)
                    if(response.data.status == "success") {
                        this.messagesuccess = this.textDataDeleteSuccess
                        this.getPost()
                        this.closeModal()
                    }else{
                        FUNCTIONS.notify('error', 'Error', response.data.message)
                    }
                }catch(err){
                    FUNCTIONS.notify('error', this.textErrorNetwork, "Gagal menghapus data")
                }
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
                    if(formtype == "save") {
                        document.getElementById("save").children[0].innerHTML = loadingform
                        let url = this.urlService + this.sectionApi + "/create"
                        this.postFunction("post", this.forms, url)
                    }else{
                        document.getElementById("save-edit").children[0].innerHTML = loadingform
                        let urlv = this.urlService + this.sectionApi + "/update/" + this.itemDataDetail.id
                        this.postFunction("put", this.forms, urlv)
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
                this.forms.landName = this.itemDataDetail.name
                FUNCTIONS.sidebarToggle(true)
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
        }
    },
    components: { pageHeader, loadingSvg }
};
</script>