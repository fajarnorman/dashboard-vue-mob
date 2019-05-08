<template>
    <div class="content-wrapper">
        <div id="detail-head-agent">
            <div class="page-header">
                <div class="page-header-content">
                    <router-link v-bind:to="'/agent/head'" class="back-button">
                        <i class="icon icon-caret-left"></i> Kepala SPK
                    </router-link>
                    <div class="page-title clearfix">
                        <h4 class="float-left">Detail Kepala SPK</h4>
                    </div>
                </div>
            </div>
            <div class="content">
                <section v-if="errored">
                    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
                </section>
                <section v-else>
                    <div>
                        <el-row :gutter="20" class="agentDetailSidebar">
                            <el-col :span="6" :xs="24">
                                <div class="cards">
                                    <div class="head-detail">
                                        <h4>{{itemsData.fullname}}</h4>
                                        <span>Kepala SPK</span>
                                        <font-awesome-icon class="fontIcons" :icon="fontsIcons.kepalaAgent" />
                                    </div>
                                    <div class="content-detail">
                                        <ul>
                                            <li><font-awesome-icon class="fontIcons" :icon="fontsIcons.email" /> <div>{{itemsData.email}}</div></li>
                                            <li><font-awesome-icon class="fontIcons" :icon="fontsIcons.phone" /> <div>{{itemsData.phone_number}}</div></li>
                                            <li><font-awesome-icon class="fontIcons" :icon="fontsIcons.birthday" /> <div>{{itemsData.birthday | moment("DD MMMM YYYY")}}</div></li>
                                            <li><font-awesome-icon class="fontIcons" :icon="fontsIcons.places" /> <div>{{itemsData.birthplace}}</div></li>
                                            <li style="margin-top: 15px;"><font-awesome-icon class="fontIcons" :icon="fontsIcons.since" /> Sejak {{itemsData.created_at | moment("DD MMMM YYYY")}}</li>
                                        </ul>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="18" :xs="24">
                                <div class="items-head-agent">
                                    <div v-if="messagesuccess">
                                        <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                                    </div>
                                    <div v-if="(messageerror != '')">
                                        <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                                    </div>
                                    <div class="items-head clearfix">
                                        <h3 class="title float-left">Kepala Regional</h3>
                                        <a @click.prevent="dialogVisible = true" class="float-right" v-if="$dataRole['agent.head.assign']">
                                            <el-button class="button-white-green" round>
                                                <i class="icon-plus3"></i> Tetapkan Regional
                                            </el-button>
                                        </a>
                                    </div>

                                    <el-table 
                                        :data="itemsDataRegions" 
                                        max-height="530" 
                                        empty-text="No data available in table"
                                        ref="kepalaregionalTable"
                                        v-loading="loading"
                                        class="mobayar-table">
                                        <el-table-column type="index" label="No" width="50"></el-table-column>
                                        <el-table-column prop="region_code" label="Kode Regional" width="120"></el-table-column>
                                        <el-table-column prop="region_name" label="Regional" width="200"></el-table-column>
                                        <el-table-column label="Target">
                                            <template slot-scope="scope">
                                                <router-link :to="{ name: 'agent__target_detail', params: { id: scope.row.region_code }}">
                                                    Lihat Target
                                                </router-link>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="Total SPK">
                                            <template slot-scope="scope">
                                                <span class="badge primary inline">{{scope.row.agent_total}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Status" align="center" width="80">
                                            <template slot-scope="scope">
                                                <span class="badge success" v-if="(scope.row.status == 'active')">{{scope.row.status}}</span>
                                                <span class="badge failed" v-if="(scope.row.status == 'inactive')">{{scope.row.status}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Actions" align="center" v-if="$dataRole['agent.head.delete']">
                                            <template slot-scope="scope">
                                                <a href="#" @click.prevent="resignRegion(scope.row.id)" style="margin-top: 3px;display: inline-block;">
                                                    <img src="~assets/images/icons/trash.png" alt="img-trash">
                                                </a>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <div class="items-head-agent">
                                    <div class="items-head clearfix">
                                        <h3 class="title float-left">Bonus Kepala SPK</h3>
                                        <el-date-picker
                                            style="max-width: 180px;"
                                            class="date-range-picker float-right"
                                            v-model="monthQuery"
                                            type="month"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="Pick a month">
                                        </el-date-picker>
                                    </div>
                                    <el-table 
                                        :data="itemsDataBonusSPK" 
                                        empty-text="No data available in table"
                                        ref="modalTable"
                                        highlight-current-row
                                        v-loading="loadingBonusSPK"
                                        class="mobayar-table">
                                        <el-table-column prop="type" label="Tipe" width="150"></el-table-column>
                                        <el-table-column prop="product" label="Produk" width="200"></el-table-column>
                                        <el-table-column label="Persentase" width="150" align="center">
                                            <template slot-scope="scope">
                                                {{scope.row.percentage}}%
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Bonus" align="center">
                                            <template slot-scope="scope">
                                                Rp. {{formatPrice(scope.row.bonus)}}
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <div class="mobayar-actions-bottom clearfix">
                                        <div class="total-report clearfix">
                                            <div class="span-report">
                                                <span>Total Bonus: </span>
                                                Rp. {{formatPrice(getBonusTotal)}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                            <el-dialog 
                                title="Kepala Agen Regional"
                                :visible.sync="dialogVisible" 
                                width="50%"
                                class="mb-dialog nopadding-right point-modal kepala-regional">
                                <div class="content-dialog">
                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <div class="panel-body border-radius-top text-center">
                                                <div class="content-group-sm">
                                                    <h5 class="text-semibold no-margin-bottom">{{itemsData.fullname}}</h5>
                                                    <span class="display-block">{{itemsData.email}}</span>
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form ref="formspoints" label-width="120px" class="demo-ruleForm">
                                                <h4 class="title">Pilih Regional</h4>
                                                <el-form-item label="Regional">
                                                    <el-select v-model="forms.regions" placeholder="Select">
                                                        <el-option 
                                                            v-for="(dataRegionForms, indexRegionForms) in itemRegional"
                                                            :key="indexRegionForms"
                                                            :value="dataRegionForms.id"
                                                            :label="dataRegionForms.name">{{dataRegionForms.name}}</el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-form>
                                        </el-col>
                                    </el-row>                                            
                                </div>
                                <span slot="footer" class="dialog-footer">
                                    <el-button round class="cancel button-outline-black" @click="dialogVisible = false">Cancel</el-button>
                                    <el-button @click="assignRegional()" round class="choose button-white-green" type="primary">Simpan</el-button>
                                </span>
                            </el-dialog>
                        </el-row>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import FUNCTIONS from '@/functions'
    import { 
        faUserTie, 
        faEnvelope, 
        faMobileAlt, 
        faCalendarAlt, 
        faMapMarkerAlt, 
        faUserCheck 
    } from '@fortawesome/free-solid-svg-icons'

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    export default {
        name: 'agent',
        data () {
            return {
                // for get api
                apiUrl: process.env.ROOT_API,
                sectionApi: 'headAgent',
                sectionApiReference: 'reference',
                sectionId: this.$route.params.id,

                // for store data after get api
                itemsData: [],
                itemRegional: [],
                itemsDataRegions: [],
                itemsDataBonusSPK: [],

                // another important variable data
                searchQuery: '',
                loading: true,
                loadingBonusSPK: false,
                loadingForm: false,
                errored: false,
                currentPage: 1,
                perPage: 10,
                filterQuery: '',
                regionQuery: '',
                totalPage: '',
                afterChecked: true,
                totalChecked: '',
                titleForms: '',
                formsType: '',
                dialogVisible: false,
                monthQuery: FUNCTIONS.formatDate(firstDay),

                // message variable
                messageerror: '',
                messagesuccess: '',

                forms:{
                    regions: '',
                },

                // Fonts
                fontsIcons: {
                    kepalaAgent: faUserTie,
                    email: faEnvelope,
                    phone: faMobileAlt,
                    birthday: faCalendarAlt,
                    places: faMapMarkerAlt,
                    since: faUserCheck,
                }
            }
        },
        watch: {
            monthQuery: function(newValue){
                this.getPostBonusSPK()
            }
        },
        mounted () {
            this.getPosts()
            this.getPostRegions()
            this.getPostBonusSPK()
            this.getReference('RegionalAgen')
        },
        methods: {
            // build url function
            buildUrl (value) {
                if(value == 'regions'){
                    return this.apiUrl + this.sectionApi + '/' + this.sectionId + '/regions'
                }else if(value == 'bonuses'){
                    return this.apiUrl + this.sectionApi + '/' + this.sectionId + '/bonuses?month=' + this.monthQuery
                }else if(value == 'assignRegion'){
                    return this.apiUrl + this.sectionApi + '/' + this.sectionId + '/assignRegion'
                }else{
                    return this.apiUrl + this.sectionApi + '/' + this.sectionId
                }
            },

            search(nameKey, myArray){
                for (var i=0; i < myArray.length; i++) {
                    if (myArray[i].id == nameKey) {
                        return myArray[i];
                    }
                }
            },

            // get all post
            getPosts(){
                let url = this.buildUrl()
                this.loading = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error' && response.data.message == "Unable to authenticate with invalid API key and token."){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemsData = response.data.data
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => this.loading = false)
            },

            getPostRegions(){
                let url = this.buildUrl('regions')
                this.loading = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error' && response.data.message == "Unable to authenticate with invalid API key and token."){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemsDataRegions = response.data.data
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

            getPostBonusSPK(){
                let url = this.buildUrl('bonuses')
                this.loadingBonusSPK = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error' && response.data.message == "Unable to authenticate with invalid API key and token."){
                        // // FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemsDataBonusSPK = response.data.data
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.loadingBonusSPK = false
                })
            },

            // Get Reference
            getReference(category){
                let url = this.apiUrl + this.sectionApiReference + '?category=' + category

                this.axios.get(url)
                .then(response => {
                    if(category == 'RegionalAgen'){
                        this.itemRegional = response.data.data
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {})
            },

            assignRegional(){
                this.messagesuccess = ''
                this.messageerror = ''
                let url = this.buildUrl('assignRegion')
                this.axios.post(url,{
                    region_code: this.forms.regions
                })
                .then(response => {
                    if(response.data.status == 'error'){
                        this.messageerror = response.data.message
                    }else{
                        let nameRegion = this.search(response.data.data.region_code, this.itemRegional)
                        this.messagesuccess = this.itemsData.fullname + " telah ditetapkan sebagai Kepala Agen regional " + nameRegion.name
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.dialogVisible = false
                    this.getPostRegions()
                })
            },

            resignRegion(id){
                this.messagesuccess = ''
                this.messageerror = ''
                this.$confirm('Data akan dihapus permanen!.', 'Anda Yakin?', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    let url = this.apiUrl + this.sectionApi + '/' + id + '/resignRegion'
                    this.axios.delete(url)
                    .then(response => {
                        if(response.data.status == 'error'){
                            this.messageerror = response.data.message
                        }else{
                            this.messagesuccess = "Data telah dihapus."
                        }
                    })
                    .catch(error => { 
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => {
                        this.getPostRegions()
                    })
                })
            },

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
        },
        computed: {
            getBonusTotal: function(){
                let total = [];

                this.itemsDataBonusSPK.forEach(element => {
                    let price = parseFloat(element.bonus)
                    total.push(price)
                });

                return total.reduce(function(total, num){ return total + num }, 0);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .items-head-agent{
        position: relative;
        margin-bottom: 25px;
        .items-head{
            margin-bottom: 15px;
            .title{
                margin-top: 5px;
                margin-bottom: 0;
            }
        }
    }
    .mobayar-actions-bottom{
        .total-report{
            border-bottom: 0;
            padding-bottom: 0;
            margin-bottom: 0;
        }
    }
</style>