<template>
    <div class="content-wrapper">
        <div id="master-barang-attribute">
            <div class="page-header">
                <page-header titleName="Create Permission" :isCreate="false"></page-header>
            </div>
            <div class="content">
                 <div class="cards clearfix" style="position: relative;">
                     <loading-svg :isLoading="loading"></loading-svg>
                     <el-form :model="forms" status-icon :rules="rules" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                        <el-form-item label="Name">
                            <el-input v-model="forms.name"></el-input>
                        </el-form-item>
                     </el-form>
                     <el-button style="margin-top: 15px;" round class="button-white-green float-right" id="save" @click.prevent="submitSave('formsvalid')">Submit</el-button>
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
    name: "permission-create",
    data() {
        return {
            apiURL: process.env.ROOT_API,
            sectionApi: "permission",
            loading: false,
            textErrorNetwork: "Jaringan Bermasalah",
            forms:{
                name: "",
            },
            rules:{
                name: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur' }],
            }
        }
    },
    created () {
        FUNCTIONS.checkRolesIsSuperAdmin(this.$getRoles)
    },
    methods: {
        async postFunction(type, credentials, url) {
            if(type == "post"){
                try{
                    const response = await services.postList(url, this.forms)
                    document.getElementById("save").children[0].innerHTML = "Simpan"
                    if(response.data.status == "success") {
                        FUNCTIONS.notify('success', 'Success', 'Data Berhasil di simpan')
                        this.$router.push({path: '/permission'})
                    }else{
                        FUNCTIONS.notify('error', 'Error', response.data.message)
                    }
                }catch(err){
                    FUNCTIONS.notify('error', this.textErrorNetwork, "Gagal menyimpan data")
                }
            }
        },
        submitSave(formName, formtype) {
            let loadingform = FUNCTIONS.svgSpinner
            this.messagesuccess = ""
            this.messageerror = ""
            this.$refs[formName].validate(valid => {
                if (valid) {
                    document.getElementById("save").children[0].innerHTML = loadingform
                    let url = this.apiURL + this.sectionApi
                    this.postFunction("post", this.forms, url)
                }
            })
        }
    },
    components: { pageHeader, loadingSvg }
};
</script>