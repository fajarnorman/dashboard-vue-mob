<template>
    <div class="content-wrapper">
        <div id="detail-head-target">
            <div class="page-header">
                <div class="page-header-content">
                    <router-link v-bind:to="'/agent/target'" class="back-button">
                        <i class="icon icon-caret-left"></i> Target & Pencapaian
                    </router-link>
                    <div class="page-title clearfix">
                        <h4 class="float-left">Target SPK Regional</h4>
                    </div>
                </div>
            </div>
            <div class="content">
                <section v-if="errored">
                    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
                </section>
                <section v-else>
                    <div>
                        <el-row :gutter="20" class="agentDetailSidebar" style="margin-bottom: 20px;">
                            <el-col :span="6" :xs="24">
                                <div class="cards targetSidebar">
                                    <div class="head-detail">
                                        <h4>{{itemsDataReference.name}}</h4>
                                        <span>Regional</span>
                                        <font-awesome-icon class="fontIcons" :icon="fontsIcons.mapsAgent" />
                                    </div>
                                    <div class="content-detail">
                                        <ul>
                                            <li><font-awesome-icon class="fontIcons" :icon="fontsIcons.kepalaAgent" /> Kepala SPK <span v-if="itemAgentTarget.info" class="badge primary">{{itemAgentTarget.info.head_total}}</span></li>
                                            <li><font-awesome-icon class="fontIcons" :icon="fontsIcons.totalAgent" /> Total SPK <span v-if="itemAgentTarget.info" class="badge primary">{{itemAgentTarget.info.agent_total}}</span></li>
                                            <li class="list-add-agent" v-if="$dataRole['agent.create']">
                                                <el-button @click.prevent="dialogVisible = true" class="button-white-green"><i class="icon-plus3"></i> Tambah SPK</el-button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="items-head-agent">
                                    <div v-if="messagesuccess">
                                        <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                                    </div>
                                    <div v-if="(messageerror != '')">
                                        <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                                    </div>
                                    <div class="items-head clearfix">
                                        <h3 class="title">Pilih Bulan</h3>
                                        <el-date-picker
                                            class="date-range-picker"
                                            v-model="monthQuery"
                                            type="month"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            :picker-options="pickerOptions"
                                            placeholder="Pick a month">
                                        </el-date-picker>
                                    </div>
                                    <el-table 
                                        :data="itemAgentTarget.data" 
                                        max-height="530" 
                                        empty-text="No data available in table"
                                        ref="kepalaregionalTable"
                                        v-loading="loading"
                                        class="mobayar-table">
                                        <el-table-column prop="name" align="center" label="Produk"></el-table-column>
                                        <el-table-column align="center" label="Target">
                                            <template slot-scope="scope">
                                                {{scope.row.target}} {{scope.row.unit}}
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-col>
                            <el-col :span="18" :xs="24">
                                <div class="items-head-agent pencapaian-spk">
                                    <div class="items-head clearfix">
                                        <h3 class="title float-left">Pencapaian SPK</h3>
                                        <div class="add-actions">
                                            <a @click.prevent="getExcelURL" class="float-right">
                                                <el-button class="button-outline-green" round>
                                                    <img src="~assets/images/icons/download-new.png" v-if="(loadingExcel == false)">
                                                    <div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export
                                                </el-button>
                                            </a>
                                        </div>
                                    </div>
                                    <el-table 
                                        :data="itemsData"
                                        empty-text="No data available in table"
                                        ref="bonusRegionalTable"
                                        v-loading="loadingPencapaian"
                                        class="mobayar-table">
                                        <el-table-column label="Nama Agen" width="175">
                                            <template slot-scope="scope">
                                                <div>{{scope.row.fullname}}</div>
                                                <div v-if="scope.row.highest_achievement.product == null" style="color: #999"><i>{{scope.row.username}}</i></div>
                                                <div v-else style="color: #1e88e5"><i>{{scope.row.username}}</i></div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Pencapaian" width="130" align="center">
                                            <template slot-scope="scope">
                                                <div v-if="scope.row.highest_achievement.product == null" style="color: #999">{{scope.row.total_achievement}}%</div>
                                                <div v-else style="color: #2196f3;">{{scope.row.total_achievement}}%</div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Pencapaian Tertinggi" align="center" width="200">
                                            <template slot-scope="scope">
                                                <div v-if="scope.row.highest_achievement">
                                                    <div v-if="(scope.row.highest_achievement.product != null)">
                                                        {{scope.row.highest_achievement.product}}<br>
                                                        <div>{{scope.row.highest_achievement.total}} Liter ({{scope.row.highest_achievement.percentage}}%)</div>
                                                    </div>
                                                    <div v-else>
                                                        -<br>
                                                        <div style="color: #999">{{scope.row.highest_achievement.total}} Liter ({{scope.row.highest_achievement.percentage}}%)</div>
                                                    </div>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Status" align="center">
                                            <template slot-scope="scope">
                                                <div v-if="(scope.row.verified == false)" style="color: #999">Belum diverifikasi</div>
                                                <div v-else style="color: #4caf50;">Telah terverifikasi</div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Aksi" align="center">
                                            <template slot-scope="scope">
                                                <a href="#" class="ringkasan" @click.prevent="spkActions('ringkasan', scope.row)">
                                                    <el-tooltip class="item" effect="dark" content="Target" placement="left">
                                                        <font-awesome-icon class="fontIcons" :icon="fontsIcons.ringkasan" />
                                                    </el-tooltip>
                                                </a>
                                                <a href="#" class="details" :disabled="scope.row.highest_achievement.product == null" @click.prevent="spkActions('details', scope.row.id)">
                                                    <el-tooltip class="item" effect="dark" content="Details" placement="left">
                                                        <font-awesome-icon class="fontIcons" :icon="fontsIcons.details" />
                                                    </el-tooltip>
                                                </a>
                                                <a href="#" class="verify" :disabled="(disableByDate == true || scope.row.verified == true)" @click.prevent="spkActions('verify', scope.row)">
                                                    <el-tooltip class="item" effect="dark" content="Verifikasi" placement="left">
                                                        <font-awesome-icon class="fontIcons" :icon="fontsIcons.verified" />
                                                    </el-tooltip>
                                                </a>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-col>
                        </el-row>
                    </div>

                    <!-- Assign SPK Region -->
                    <el-dialog 
                        title="Tambah SPK"
                        :visible.sync="dialogVisible" 
                        width="40%"
                        class="mb-dialog nopadding-right point-modal kepala-regional">
                        <div class="content-dialog">
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form ref="formspoints" :model="forms" status-icon :rules="rules2" label-width="120px" class="demo-ruleForm">
                                        <h4 class="title">Regional : <b>{{itemsDataReference.name}}</b></h4>
                                        <el-form-item label="Pilih SPK" prop="agen">
                                            <el-select
                                                v-model="forms.agen"
                                                class="full-width-select"
                                                multiple
                                                filterable>
                                                <el-option
                                                    v-for="(dataAgen, indexAgen) in itemsDataAgen"
                                                    :key="indexAgen"
                                                    :label="dataAgen.fullname"
                                                    :value="dataAgen.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                            </el-row>                                            
                        </div>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="assignAgentRegions()" round class="choose button-white-green" type="primary" id="spkTargetAssign">Simpan</el-button>
                        </span>
                    </el-dialog>

                    <!-- Detail Pencapaian SPK -->
                    <el-dialog 
                        :title="nameModal"
                        :visible.sync="detailTarget" 
                        width="50%"
                        class="mb-dialog nopadding-right point-modal kepala-regional">
                        <div class="content-dialog detail-pencapaian">
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <div class="cards bg-purple" v-if="dataDetailPencapaian.highest_achievement">
                                        <font-awesome-icon class="fontIcons" :icon="fontsIcons.tertinggi" />
                                        <div class="desc-pencapaian">
                                            Tertinggi
                                            <span>{{dataDetailPencapaian.highest_achievement.total}} liter</span>
                                        </div>
                                        <div class="progress-percentage">
                                            <div class="progress">
                                                <span class="progress-bar" :style="{ width: dataDetailPencapaian.highest_achievement.percentage + '%' }"></span>
                                            </div>
                                            <div class="clearfix">
                                                <div class="value-name" v-if="(dataDetailPencapaian.highest_achievement.product == '')">{{dataDetailPencapaian.highest_achievement.product}}</div>
                                                <div class="value-name" v-else>Persentase</div>
                                                <div class="value-percentage">{{dataDetailPencapaian.highest_achievement.percentage}}%</div>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="cards bg-grey" v-if="dataDetailPencapaian.lowest_achievement">
                                        <font-awesome-icon class="fontIcons" flip="vertical" :icon="fontsIcons.tertinggi" />
                                        <div class="desc-pencapaian">
                                            Terendah
                                            <span>{{dataDetailPencapaian.lowest_achievement.total}} liter</span>
                                        </div>
                                        <div class="progress-percentage">
                                            <div class="progress">
                                                <span class="progress-bar" :style="{ width: dataDetailPencapaian.lowest_achievement.percentage + '%' }"></span>
                                            </div>
                                            <div class="clearfix">
                                                <div class="value-name" v-if="(dataDetailPencapaian.lowest_achievement.product == '')">{{dataDetailPencapaian.lowest_achievement.product}}</div>
                                                <div class="value-name" v-else>Persentase</div>
                                                <div class="value-percentage">{{dataDetailPencapaian.lowest_achievement.percentage}}%</div>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="cards bg-green">
                                        <div class="fontIcons customs" v-html="require('../../../assets/images/icons/sigma.svg')"></div>
                                        <div class="desc-pencapaian">
                                            Total
                                            <span>Pencapaian</span>
                                        </div>
                                        <div class="progress-percentage">
                                            <div class="progress">
                                                <span class="progress-bar" :style="{ width: dataDetailPencapaian.total_achievement + '%' }"></span>
                                            </div>
                                            <div class="clearfix">
                                                <div class="value-name">Persentase</div>
                                                <div class="value-percentage">{{dataDetailPencapaian.total_achievement}}%</div>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-table 
                                :data="itemsDetailPencapaianSPK"
                                empty-text="No data available in table"
                                ref="detailPencapaianTable"
                                v-loading="loadingPencapaianSPK"
                                class="mobayar-table">
                                <el-table-column label="Nama Produk">
                                    <template slot-scope="scope">
                                        {{scope.row.name}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Target" align="center">
                                    <template slot-scope="scope">
                                        {{scope.row.target}} {{scope.row.unit}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Pencapaian" align="center">
                                    <template slot-scope="scope">
                                        {{scope.row.achievement}} {{scope.row.unit}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Persentase" align="center">
                                    <template slot-scope="scope">
                                        {{scope.row.percentage}} %
                                    </template>
                                </el-table-column>
                                <el-table-column label="Aksi" align="center">
                                    <template slot-scope="scope">
                                        <a href="#" v-if="$dataRole['agent.target.edit']" @click.prevent="spkActions('editTarget', scope.row)" style="margin-top:3px;display:inline-block;margin-right: 5px;">
                                            <img src="~assets/images/icons/edit.png" alt="img-trash">
                                        </a>
                                        <a href="#" v-if="$dataRole['agent.target.delete']" @click.prevent="deleteAgentTarget(scope.row.id)" style="margin-top:3px;display:inline-block;">
                                            <img src="~assets/images/icons/trash.png" alt="img-trash">
                                        </a>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <span slot="footer" class="dialog-footer">
                            <el-button round v-if="$dataRole['agent.target.create']" class="choose button-white-green" @click="targetTambah = true" type="primary">Tambah Target</el-button>
                        </span>
                    </el-dialog>

                    <!-- Tambah Target -->
                    <el-dialog 
                        title="Tambah Target"
                        :visible.sync="targetTambah" 
                        width="25%"
                        class="mb-dialog nopadding-right point-modal kepala-regional">
                        <div class="content-dialog">
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form ref="formspoints" :model="forms" status-icon :rules="rules2" label-width="120px" class="demo-ruleForm">
                                        <h4 class="title">Target : <b>Regional</b></h4>
                                        <el-form-item label="Produk" prop="product" v-if="editTarget == false">
                                            <!-- <pre>{{itemsProduct}}</pre> -->
                                            <el-select
                                                v-model="forms.product"
                                                class="full-width-select"
                                                filterable>
                                                <el-option
                                                    v-for="(dataAgen, indexAgen) in itemsProduct"
                                                    :key="indexAgen"
                                                    :label="dataAgen.product_name"
                                                    :value="dataAgen.product_id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Produk" v-else>
                                            <div style="color:#000;font-size:20px;font-weight:600;margin-top:-10px;'">{{editProduct.name}}</div>
                                        </el-form-item>
                                        <el-form-item label="Bulan" prop="month" v-if="editTarget == false">
                                            <el-select
                                                v-model="forms.month"
                                                class="full-width-select">
                                                <el-option
                                                    v-for="(dataMonth, indexMonth) in get5month"
                                                    :key="indexMonth"
                                                    :label="dataMonth.label"
                                                    :value="dataMonth.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Bulan" v-else>
                                            <div style="color:#000;font-size:20px;font-weight:600;margin-top:-10px;'">{{monthModal}}</div>
                                        </el-form-item>
                                        <el-form-item label="Target" prop="target">
                                            <el-input v-model="forms.target" class="customvalinum" type="number">
                                                <template slot="append">Liter</template>
                                            </el-input>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                            </el-row>                                            
                        </div>
                        <span slot="footer" class="dialog-footer">
                            <el-button id="saveandeditTarget" @click="saveAgentTarget(editTarget)" round class="choose button-white-green" type="primary">Simpan</el-button>
                        </span>
                    </el-dialog>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import JQuery from 'jquery'
    import FUNCTIONS from '@/functions'
    import { 
        faUserTie, 
        faUsers, 
        faMapMarkedAlt, 
        faNewspaper, 
        faExternalLinkAlt, 
        faCheck, 
        faCalendarAlt,
        faExternalLinkSquareAlt,
        faEdit,
    } from '@fortawesome/free-solid-svg-icons'

    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), 1);
    export default {
        name: 'agent',
        data () {
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                baseUrl: process.env.BASE_URL,
                sectionApi: 'headAgent',
                sectionApiReference: 'reference',
                sectionApiAchievement: 'agentAchievement/',
                sectionApiAgen: 'agent',
                sectionApiAgenTarget: 'agentTarget/',
                sectionApiAgenTargetAssignAgent: 'assignAgentRegion',
                sectionApiProduk: 'targetedProducts',

                sectionId: this.$route.params.id,

                // for store data after get api
                itemsData: [],
                itemAgentTarget: [],
                itemsDataRegions: [],
                itemsDataReference: [],
                itemsDataAgen:[],
                itemsDetailPencapaianSPK: [],
                itemsProduct: [],
                itemsProductAfterFilter: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingForm: false,
                loadingExcel: false,
                loadingPencapaianSPK: false,
                loadingPencapaian: false,
                errored: false,
                currentPage: 1,
                perPage: '',
                filterQuery: '',
                regionQuery: '',
                totalPage: '',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',
                dialogVisible: false,
                detailTarget: false,
                targetTambah: false,
                editTarget: false,
                monthQuery: FUNCTIONS.formatDate(today),

                // message variable
                messageerror: '',
                messagesuccess: '',

                forms:{
                    agen: '',
                    product: '',
                    month: '',
                    target: '',
                },

                rules2:{
                    agen: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    product: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    month: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    target: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                },

                pickerOptions:{
                    // disabledDate(time) {
                    //     return time.getTime() > Date.now();
                    // },
                },
                
                // for modal
                nameModal: '',
                monthModal: '',
                editProduct: '',
                dataDetailPencapaian: [],
                
                // Fonts
                fontsIcons: {
                    kepalaAgent: faUserTie,
                    totalAgent: faUsers,
                    mapsAgent: faMapMarkedAlt,
                    ringkasan: faNewspaper,
                    details: faCalendarAlt,
                    verified: faCheck,
                    tertinggi: faExternalLinkSquareAlt,
                    edits: faEdit
                },
            }
        },
        mounted () {
            this.getPosts()
            this.getPostReference()
            this.getPostAgent()
            this.getPostProduk()
            this.getPostAgentTarget()
        },
        watch: {
            monthQuery: function(newDate){
                this.getPosts(newDate)
                this.getPostAgentTarget()
            },
            targetTambah: function(newValue){
                let that = this
                if(newValue == false){
                    this.editTarget = false
                    this.forms.product = ''
                    this.forms.month = ''
                    this.forms.target = ''
                }
                if(this.editTarget == true){
                    document.querySelectorAll('.kepala-regional .el-form-item__error').forEach(function(e){
                        e.style.display = "none"
                    })
                }
                setTimeout(function(){
                    that.triggerValidateNumber()
                }, 500)
            },
            dialogVisible: function(newValue){
                if(newValue == true){
                    this.forms.agen = ''
                }
            }
        },
        methods: {
            // build url function
            buildUrl (month, limit, page) {
                return this.apiUrl + this.sectionApiAchievement + this.sectionId + '?month=' + month + '&limit=' + limit + '&page=' + page + '&direction=DESC'
            },

            // get all post
            getPosts(month = this.monthQuery, limit = this.perPage, page = this.currentPage){
                let url = this.buildUrl(month, limit, page)
                this.loadingPencapaian = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error' && response.data.message == "Unable to authenticate with invalid API key and token."){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemsData = response.data.data
                        this.totalPage = response.data.totalData
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => this.loadingPencapaian = false)
            },

            getPostReference(){
                let url = this.apiUrl + this.sectionApiReference + '?category=RegionalAgen'
                this.loading = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error' && response.data.message == "Unable to authenticate with invalid API key and token."){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemsDataReference = this.search(this.sectionId, response.data.data)
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.loading = false
                })
            },

            getPostAgent(){
                let url = this.apiUrl + this.sectionApiAgen
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error' && response.data.message == "Unable to authenticate with invalid API key and token."){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemsDataAgen = response.data.data
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.loading = false
                })
            },

            getPostProduk(){
                let url = this.apiUrl + this.sectionApiAgenTarget + this.sectionApiProduk + '?direction=ASC'
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error' && response.data.message == "Unable to authenticate with invalid API key and token."){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemsProduct = response.data.data
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.loading = false
                })
            },

            getPostAgentTarget(){
                let url = this.apiUrl + this.sectionApiAgenTarget + this.sectionId + '?month=' + this.monthQuery + '&order=name&direction=ASC'
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error' && response.data.message == "Unable to authenticate with invalid API key and token."){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemAgentTarget = response.data
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.loading = false
                })
            },
            
            getPostDetailPencapaian(value){
                let url = this.apiUrl + this.sectionApiAgenTarget + value.id + '?month=' + this.monthQuery + '&direction=ASC&order=name'
                this.loadingPencapaianSPK = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error' && response.data.message == "Unable to authenticate with invalid API key and token."){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemsDetailPencapaianSPK = response.data.data
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.loadingPencapaianSPK = false
                })
            },

            triggerValidateNumber(){
                JQuery(".customvalinum .el-input__inner").bind({
                    keydown: function(e) {
                        if (e.shiftKey === true ) {
                            if (e.which == 9) {
                                return true;
                            }
                            return false;
                        }
                        if (e.which > 57) {
                            return false;
                        }
                        if (e.which==32) {
                            return false;
                        }
                        return true;
                    }
                });
            },

            search(nameKey, myArray){
                for (var i=0; i < myArray.length; i++) {
                    if (myArray[i].id == nameKey) {
                        return myArray[i];
                    }
                }
            },

            // Pagination Change function
            pageChange (page) {
                this.currentPage = page
                this.getPosts()
            },

            // Limit Change function
            limitChange(limit, event){
                this.perPage = limit
                this.getPosts()
                document.querySelectorAll('.showing-page ul li').forEach(function(a){
                    a.classList.remove('active')
                })
                event.target.parentNode.classList.add('active')
            },

            spkActions(value ,id){
                if(value == 'ringkasan'){
                    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    const date = new Date(this.monthQuery)
                    this.dataDetailPencapaian = id
                    this.nameModal = id.fullname + '\n' + monthNames[date.getMonth()] + ' ' + date.getFullYear()
                    this.detailTarget = true
                    this.getPostDetailPencapaian(this.dataDetailPencapaian)
                }else if(value == 'details'){
                    this.$router.push({ 
                        name: 'agent__achievment_detail', 
                        params: { 
                            id: id ,
                            month: this.monthQuery
                        }
                    })
                }else if(value == 'verify'){
                    let url = this.apiUrl + this.sectionApiAchievement + 'verifyMonthly/' + id.id
                    let message = 'Agen: ' + id.fullname + '\n' + 'Bulan: ' + this.monthQuery
                    this.$confirm(message, 'Verifikasi Pencapaian Agen?', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        this.axios.post(url, {
                            region : this.sectionId,
                            month : this.monthQuery
                        })
                        .then(response => {
                            if(response.data.status == 'success'){
                                this.$notify({
                                    title: 'Sukes',
                                    message: response.data.message,
                                    type: 'success'
                                });
                                this.getPosts()
                            }
                        })
                        .catch(error => { 
                            console.log(error);
                            this.errored = true
                        })
                        .finally(() => {
                            this.loading = false
                        })
                    })
                }else{
                    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    const date = new Date(this.monthQuery)
                    this.monthModal = monthNames[date.getMonth()] + ' ' + date.getFullYear()
                    this.targetTambah = true
                    this.editTarget = true
                    this.editProduct = id
                    this.forms.target = id.target
                }
            },

            assignAgentRegions(){
                let loadingform = FUNCTIONS.svgSpinner;
                this.$refs['formspoints'].validate((valid) => {
                    if (valid) {
                        document.getElementById('spkTargetAssign').children[0].innerHTML = loadingform
                        let url = this.apiUrl + this.sectionApiAgenTarget + this.sectionApiAgenTargetAssignAgent
                        this.axios.post(url, {
                            regionId: this.sectionId,
                            userId: this.forms.agen
                        })
                        .then(response => {
                            // console.log(response)
                            this.getPosts()
                            this.getPostAgentTarget()
                        })
                        .catch(error => { 
                            console.log(error);
                            this.errored = true
                        })
                        .finally(() => {
                            this.loading = false
                            this.dialogVisible = false
                            document.getElementById('spkTargetAssign').children[0].innerHTML = 'Simpan'
                            this.$notify({
                                title: 'Sukses',
                                message: 'SPK Berhasil ditambahkan',
                                type: 'success'
                            });
                        })
                    } else {
                        document.getElementById('save').children[0].innerHTML = 'Simpan'
                        console.log('error submit!!');
                        return false;
                    }
                })
            },

            saveAgentTarget(value){
                this.$refs['formspoints'].validate((valid) => {
                    if (valid) {
                        let loadingform = FUNCTIONS.svgSpinner;
                        document.getElementById('saveandeditTarget').children[0].innerHTML = loadingform
                        if(value){
                            let url = this.apiUrl + 'agentTarget/' + this.editProduct.id
                            this.axios.put(url, {
                                target: this.forms.target,
                            })
                            .then(response => {
                                // console.log(response)
                                if(response.data.status == 'success'){
                                    this.$notify({
                                        title: 'Sukses',
                                        message: 'Target berhasil diedit',
                                        type: 'success'
                                    });
                                }
                            })
                            .catch(error => { 
                                console.log(error);
                                this.errored = true
                            })
                            .finally(() => {
                                this.loading = false
                                this.getPostDetailPencapaian(this.dataDetailPencapaian)
                                this.getPostAgentTarget()
                                this.targetTambah = false
                                document.getElementById('saveandeditTarget').children[0].innerHTML = 'Simpan'
                            })
                        }else{
                            let url = this.apiUrl + 'agentTarget'
                            this.axios.post(url, {
                                userId : this.dataDetailPencapaian.id,
                                product: this.forms.product,
                                date: this.forms.month,
                                target: this.forms.target,
                            })
                            .then(response => {
                                if(response.data.status == 'success'){
                                    this.$notify({
                                        title: 'Sukses',
                                        message: 'Data Agen Baru sudah di tambahkan',
                                        type: 'success'
                                    });
                                }else{
                                    this.$notify.error({
                                        title: 'Error',
                                        message: response.data.message,
                                    });
                                }
                            })
                            .catch(error => { 
                                console.log(error);
                                this.errored = true
                            })
                            .finally(() => {
                                this.loading = false
                                this.getPostDetailPencapaian(this.dataDetailPencapaian)
                                this.getPostAgentTarget()
                                this.targetTambah = false
                                document.getElementById('saveandeditTarget').children[0].innerHTML = 'Simpan'
                            })
                        }
                    }
                });
            },

            deleteAgentTarget(id){
                this.$confirm('Data akan dihapus permanen!', 'Anda Yakin?', {
                    confirmButtonText: 'Ya, hapus!',
                    cancelButtonText: 'Batal',
                    type: 'warning'
                }).then(() => {
                    let url = this.apiUrl + 'agentTarget/' + id
                    this.axios.delete(url)
                    .then(response => {
                        // console.log(response)
                        if(response.data.status == 'success'){
                            this.$notify({
                                title: 'Sukses',
                                message: 'Target berhasil dihapus',
                                type: 'success'
                            });
                        }
                    })
                    .catch(error => { 
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => {
                        this.loading = false
                        this.getPostAgentTarget()
                        this.getPostDetailPencapaian(this.dataDetailPencapaian)
                    })  
                })
            },

            getExcelURL(){
                this.loadingExcel = true
                let url = this.apiUrl + 'exportRegionAchievement/' + this.sectionId + '?month=' + this.monthQuery
                this.axios({
                    url: url,
                    method: 'GET',
                    responseType: 'blob', // important
                })
                .then(response => {
                    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                    const date = new Date(this.monthQuery)
                    let dataMonth = monthNames[date.getMonth()] + ' ' + date.getFullYear()

                    const url = window.URL.createObjectURL(new Blob([response.data]))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', "Pencapaian Agen - " + dataMonth + " - " + this.itemsDataReference.name + ".xls")
                    document.body.appendChild(link)
                    link.click()
                    this.loadingExcel = false
                })
                .catch(error => {
                    FUNCTIONS.notify('error', 'Error', 'Jaringan Bermasalah')
                })                
            },
        },
        computed: {
            disableByDate : function(){
                let today = new Date()
                let currentMonth = today.getMonth()+1
                let currentYears = today.getFullYear()
                let currentDays = today.getDate()

                let dateQuery = new Date(this.monthQuery)
                let monthPick = dateQuery.getMonth()+1
                let yearsPick = dateQuery.getFullYear()
                let daysPick = dateQuery.getDate()                

                var startDate = new Date(currentYears, (+currentMonth - 1), 1);
                var endDate = new Date(yearsPick, (+monthPick - 1), daysPick);

                if (startDate <= endDate) {
                    return true;
                } else{
                    return false
                }
            },

            get5month: function(){
                let date = new Date()
                let day = date.getDate()
                let month = date.getMonth()+1
                let monthBefore = date.getMonth()
                let year =  date.getFullYear()
                let today = year + '-' + month + '-' + day
                let yesterday = year + '-' + monthBefore + '-' + day
                let arrayDate = []
                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                arrayDate.push(
                    { 'label': monthNames[date.getMonth()-1] + ' ' + year, 'value': yesterday, },
                    { 'label': monthNames[date.getMonth()] + ' ' + year, 'value': today, }
                )

                for(let i = 1;i<=5;i++){
                    let newDate = new Date(date.setMonth(date.getMonth()+1))
                    let getnewYear = newDate.getFullYear()
                    let getnewMonth = newDate.getMonth()+1
                    let dataDate = getnewYear + '-' + getnewMonth + '-' + '1'

                    let dateLabel = monthNames[newDate.getMonth()] + ' ' + getnewYear

                    arrayDate.push({
                        'label': dateLabel,
                        'value': dataDate,
                    })
                }

                return arrayDate;
            },
        }
    }
</script>

<style lang="scss">
    .items-head-agent{
        position: relative;
        margin-bottom: 25px;
        .cards{
            padding: 15px;
        }
        .items-head{
            margin-bottom: 15px;
            .title{
                margin-top: 5px;
                border-bottom: none !important;
                padding-bottom: 0 !important;
                margin-bottom: 0 !important;
            }
        }
        .el-table__empty-text{
            width: 100%;
            font-size: 13px;
        }
    }
    .pencapaian-spk{
        table{
            td{
                a{
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: inline-block;
                    position: relative;
                    &:hover{
                        background: rgba(39, 8, 39, 0.1);
                    }
                    svg{
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    &[disabled]{
                        &.ringkasan, &.verify, &.details{
                            svg{
                                color: #919EAB;
                            }
                        }
                    }
                    &.ringkasan{
                        svg{
                            color: #1A892E;
                        }
                    }
                    &.verify{
                        svg{
                            color: #39B54D;
                        }
                    }
                    &.details{
                        svg{
                            color: #1e88e5;
                        }
                    }
                }
            }
        }
    }
</style>