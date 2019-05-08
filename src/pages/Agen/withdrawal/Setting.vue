<template>
    <div class="content-wrapper">
        <div id="withdrawal-setting">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Withdrawal Setting</h4>
                    </div>
                </div>
            </div>
            <div class="content">
                <section v-if="errored">
                    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
                </section>
                 <section v-else>
                    <div>
                        <div class="cards clearfix" style="position: relative;">
                            <div class="el-loading-mask" v-show="(loading == true)">
                                <div class="el-loading-spinner">
                                    <svg viewBox="25 25 50 50" class="circular">
                                        <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                                    </svg>
                                </div>
                            </div>
                            <div v-if="messagesuccess">
                                <el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
                            </div>
                            <div v-if="messageerror">
                                <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                            </div>
                            <el-form :model="forms" status-icon :rules="rules2" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                <el-row :gutter="20" class="divider">
                                    <el-col :span="12">
                                        <el-form-item label="Trial Use" prop="trial">
                                            <el-input v-model="forms.trial" type="number">
                                                <template slot="append">Kali</template>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item label="Max Amount Cashout Per Month" prop="maxAmountCash">
                                            <div class="el-form-item__content custom-price-format">
                                                <div class="el-input el-input-group el-input-group--prepend">
                                                    <div class="el-input-group__prepend">Rp.</div>
                                                    <money v-model="forms.maxAmountCash" v-bind="money" class="el-input__inner"></money>
                                                </div>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="Minimum Balance After Withdrawal" prop="minBalance">
                                            <div class="el-form-item__content custom-price-format">
                                                <div class="el-input el-input-group el-input-group--prepend">
                                                    <div class="el-input-group__prepend">Rp.</div>
                                                    <money v-model="forms.minBalance" v-bind="money" class="el-input__inner"></money>
                                                </div>
                                            </div>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="Bonus Cashout" prop="bonusCashout">
                                            <el-input v-model="forms.bonusCashout" type="number">
                                                <template slot="append">%</template>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item label="Start Date">
                                             <el-row :gutter="20">
                                                <el-col :span="14">
                                                    <el-form-item prop="startDate">
                                                        <el-date-picker 
                                                            :format="format" 
                                                            v-model="forms.startDate" 
                                                            :value-format="format"
                                                            type="date"
                                                            class="datepicker"></el-date-picker>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item prop="startTime">
                                                        <el-time-picker 
                                                            v-model="forms.startTime"
                                                            :format="formatTime"
                                                            :value-format="formatTime"
                                                            class="timepicker">
                                                        </el-time-picker>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item label="End Date">
                                            <el-row :gutter="20">
                                                <el-col :span="14">
                                                    <el-form-item prop="endDate">
                                                        <el-date-picker 
                                                            :format="format" 
                                                            v-model="forms.endDate" 
                                                            :value-format="format"
                                                            type="date"
                                                            class="datepicker"></el-date-picker>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item prop="endTime">
                                                        <el-time-picker 
                                                            v-model="forms.endTime"
                                                            :format="formatTime"
                                                            :value-format="formatTime"
                                                            class="timepicker">
                                                        </el-time-picker>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item label="Max Total Cashout Per Month Getting Bonus" prop="maxTotalCashout">
                                            <div class="el-form-item__content custom-price-format">
                                                <div class="el-input el-input-group el-input-group--prepend">
                                                    <div class="el-input-group__prepend">Rp.</div>
                                                    <money v-model="forms.maxTotalCashout" v-bind="money" class="el-input__inner"></money>
                                                </div>
                                            </div>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row class="divider">
                                </el-row>
                            </el-form>
                            <el-button round class="button-white-green float-right" id="save" @click.prevent="submitSave('formsvalid')">Submit</el-button>
                        </div>
                    </div>
                 </section>
            </div>
        </div>
    </div>
</template>

<script>
    import {Money} from 'v-money'
    import FUNCTIONS from '@/functions'
    
    
    export default {
        name: 'withdrawalSetting',
        components: {Money},
        data () {
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'withdrawal/setting',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                errored: false,
                loading: false,

                // another important variable data
                forms:{
                    trial: '',
                    maxAmountCash: '',
                    minBalance: '',
                    bonusCashout: '',
                    startDate: '',
                    startTime: '',
                    endDate: '',
                    endTime: '',
                    maxTotalCashout: '',
                },
                rules2:{
                    trial: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur' }],
                    maxAmountCash: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur' }],
                    minBalance: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur' }],
                    bonusCashout: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur' }],
                    startDate: [{ required: true, message: 'Inputan harus di isi', trigger: 'change' }],
                    startTime: [{ required: true, message: 'Inputan harus di isi', trigger: 'change' }],
                    endDate: [{ required: true, message: 'Inputan harus di isi', trigger: 'change' }],
                    endTime: [{ required: true, message: 'Inputan harus di isi', trigger: 'change' }],
                    maxTotalCashout: [{ required: true, message: 'Inputan harus di isi', trigger: 'blur' }],
                },

                money: {
                    decimal: ',',
                    thousands: '.',
                    prefix: '',
                    suffix: '',
                    precision: 0,
                    masked: false /* doesn't work with directive */
                },

                // message variable
                messageerror: '',
                messagesuccess: '',

                // for datepicker
                format: 'yyyy-MM-dd',
                formatTime: 'HH:mm',
                formatTimeValue: 'HH:mm:ss',
            }
        },
        created () {
            FUNCTIONS.checkPermissions(this.$dataRole['withdrawal.setting'])
        },
        mounted(){
            this.getPost()
        },
        methods: {
            buildUrl(){
                return this.apiURL + this.sectionApi
            },
            
            getPost(){
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

                        this.forms.trial = this.itemsData.trial_use
                        this.forms.maxAmountCash = (this.itemsData.max_amount_cashout).slice(0, -3)
                        this.forms.minBalance = (this.itemsData.min_balance_after_withdrawal).slice(0, -3)
                        this.forms.bonusCashout = this.itemsData.bonus_cashout
                        this.forms.maxTotalCashout = (this.itemsData.bonus_max_cashout_permonth).slice(0, -3)

                        let dateCreate_1, dateStart, timeStart, dateCreate_2, dateEnd, timeEnd = ''

                        if(this.itemsData.bonus_start_date != null){
                            dateCreate_1 = new Date(this.itemsData.bonus_start_date)
                            dateStart = dateCreate_1.getFullYear() + '-' + (dateCreate_1.getMonth() + 1) + '-' + dateCreate_1.getDate()
                            timeStart = dateCreate_1.getHours() + ':' + dateCreate_1.getMinutes()    
                        }else{
                            dateCreate_1 = new Date()
                            dateStart = dateCreate_1.getFullYear() + '-' + (dateCreate_1.getMonth() + 1) + '-' + dateCreate_1.getDate()
                            timeStart = dateCreate_1.getHours() + ':' + dateCreate_1.getMinutes()    
                        }

                        if(this.itemsData.bonus_end_date != null){
                            dateCreate_2 = new Date(this.itemsData.bonus_end_date)
                            dateEnd = dateCreate_2.getFullYear() + '-' + (dateCreate_2.getMonth() + 1) + '-' + dateCreate_2.getDate()
                            timeEnd = dateCreate_2.getHours() + ':' + dateCreate_2.getMinutes()
                        }else{
                            dateCreate_2 = new Date()
                            dateEnd = dateCreate_2.getFullYear() + '-' + (dateCreate_2.getMonth() + 1) + '-' + dateCreate_2.getDate()
                            timeEnd = dateCreate_2.getHours() + ':' + dateCreate_2.getMinutes()
                        }

                        this.forms.startDate = dateStart
                        this.forms.startTime = timeStart
                        this.forms.endDate = dateEnd
                        this.forms.endTime = timeEnd


                        this.loading = false
                    }
                })
            },

            submitSave(formName){
                this.messagesuccess = ''
                this.messageerror = ''
                let loadingform = FUNCTIONS.svgSpinner;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        document.getElementById('save').children[0].innerHTML = loadingform
                        let startDate = this.forms.startDate + ' ' + this.forms.startTime + ':00'
                        let endDate = this.forms.endDate + ' ' + this.forms.endTime + ':00'

                        let url = this.buildUrl()
                        this.axios.post(url, {
                            trial_use: this.forms.trial,
                            max_amount_cashout: this.forms.maxAmountCash,
                            min_balance_after_withdrawal: this.forms.minBalance,
                            bonus_cashout: this.forms.bonusCashout,
                            bonus_start_date: startDate,
                            bonus_end_date: endDate,
                            bonus_max_cashout_permonth: this.forms.maxTotalCashout,
                        })
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
        }
    }
</script>

<style lang="scss">
    #withdrawal-setting{
        .divider{
            margin-bottom: 25px;
            .el-col-12{
                border-left: 1px solid #ddd;
                &:first-child{
                    border-left: none;
                }
            }
            &:last-child{
                border: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
        }
        .cards{
            .el-form-item{
                margin-bottom: 15px;
                &:last-child{
                    margin-bottom: 0;
                }
            }
        }
        .el-input-group__prepend{
            border-color: #800080;
            background: #800080;
            color: #FFFFFF;
        }
    }
</style>