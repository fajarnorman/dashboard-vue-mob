<template>
    <div class="content-wrapper">
        <div id="user">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title">
                        <h4>Komparasi SKU</h4>
                    </div>
                </div>
            </div>
            <div class="content">
                <section v-if="errored">
                    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
                </section>
                <section v-else>
                    <div>
                        <div class="filterSearching clearfix">
                            <div class="input-with-icons clearfix">
                                <el-input v-model="searchQuery" class="float-left" v-on:keyup="searchInTheList(searchItem)"></el-input>
                                <img src='~assets/images/icons/search1.png'>
                            </div>
                        </div>
                        <div class="content-sku-comparison">
                            
                                <div class="el-table mobayar-table el-table--fit el-table--fluid-height el-table--enable-row-transition" style="max-height: 530px;">
                                    <div class="el-loading-mask" v-show="(loading == true)">
                                        <div class="el-loading-spinner">
                                            <svg viewBox="25 25 50 50" class="circular">
                                                <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="el-table__header-wrapper">
                                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 1067px;">
                                            <thead class="has-gutter">
                                                <tr class="">
                                                    <th 
                                                        v-for="(dataHeading, indexHeading) in fieldsTable" 
                                                        :key="indexHeading" :style="{width: dataHeading.width}"
                                                        colspan="1" rowspan="1"
                                                        class="el-table_1_column_1 is-leaf">
                                                        <div class="cell">{{dataHeading.label}}</div>
                                                    </th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                    <div class="el-table__body-wrapper is-scrolling-none">
                                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 1067px;">
                                            <tbody>
                                                <tr 
                                                    v-for="(datafield, indexItemData) in sortedCats" 
                                                    :key="indexItemData"
                                                    class="el-table__row">
                                                    <td width="50" rowspan="1" colspan="1" class="el-table_3_column_13">
                                                        <div class="cell">{{indexItemData + 1}}</div>
                                                    </td>
                                                    <td width="200" rowspan="1" colspan="1" class="el-table_3_column_13">
                                                        <div class="cell">{{datafield[0].name}}</div>
                                                    </td>
                                                    <td width="120" rowspan="1" colspan="1" class="el-table_3_column_13">
                                                        <div class="cell">{{datafield[0].code}}</div>
                                                    </td>
                                                    <td width="150" rowspan="1" colspan="1" class="el-table_3_column_13">
                                                        <div class="cell">Rp.{{formatPrice(datafield[0].price)}}</div>
                                                    </td>
                                                    <td width="400" rowspan="1" colspan="1" class="el-table_3_column_13">
                                                        <div class="cell">
                                                            <div class="custom-radiosku">
                                                                <div v-for="(datasupplier, indexsupplier) in datafield" :key="indexsupplier">
                                                                    <div v-if="(datasupplier.supplier != null)">
                                                                        <label>
                                                                            <input type="radio" 
                                                                                :name="'segment[' + indexItemData + ']'" 
                                                                                :value="datasupplier.id" 
                                                                                @change="supplierChange(datasupplier.id)"
                                                                                :checked="datasupplier.status == 'active'">
                                                                            <span>{{datasupplier.supplier}}</span>
                                                                        </label>
                                                                    </div>
                                                                    <div v-else>
                                                                        <label>
                                                                            <input type="radio" 
                                                                                :name="'segment[' + indexItemData + ']'" 
                                                                                :value="datasupplier.id" 
                                                                                @change="supplierChange(datasupplier.id)"
                                                                                :checked="datasupplier.status == 'active'">
                                                                            <span>NULL</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <!-- <td rowspan="1" colspan="1" class="el-table_3_column_13">
                                                        <div class="cell">
                                                            <div v-if="datafield.length === 1">
                                                                <select name="statusSupplider" v-model="changeSupplier">
                                                                    <option value="active" disabled>Active</option>
                                                                    <option value="inactive">Inactive</option>
                                                                    <option value="maintenance">Maintenance</option>
                                                                </select>
                                                            </div>
                                                            <div v-if="datafield.length === 2">
                                                                <select name="statusSupplider" v-model="changeSupplier">
                                                                    <option value="active" disabled>Active</option>
                                                                    <option value="inactive">Inactive</option>
                                                                    <option value="maintenance">Maintenance</option>
                                                                </select>
                                                            </div>
                                                            <div v-if="datafield.length === 3">
                                                                <select name="statusSupplider" v-model="changeSupplier">
                                                                    <option value="active" disabled>Active</option>
                                                                    <option value="inactive">Inactive</option>
                                                                    <option value="maintenance">Maintenance</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </td> -->
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div class="el-table__empty-block" v-if="sortedCats == '' || sortedCats == null" style="width: 1067px;"><span class="el-table__empty-text">No data available in table</span></div>
                                    </div>
                                </div>
                            
                            <div class="mobayar-actions-bottom clearfix">
                                <div class="showing-page float-left">
                                    <span>View</span>
                                    <ul>
                                        <li class="active"><a href="#" @click.prevent="limitChange('10', $event)">10</a></li>
                                        <li><a href="#" @click.prevent="limitChange('25', $event)">25</a></li>
                                        <li><a href="#" @click.prevent="limitChange('50', $event)">50</a></li>
                                        <li><a href="#" @click.prevent="limitChange('100', $event)">100</a></li>
                                    </ul>
                                </div>
                                <div class="pagination-result float-right">
                                    <span>Showing results 1 - 10 of {{parseInt(totalPage)}}</span>
                                    <el-pagination
                                        layout="prev, pager, next"
                                        :total="parseInt(totalPage)"
                                        @current-change="pageChange"
                                        :page-size="parseInt(perPage)">
                                    </el-pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import { Notification } from 'element-ui';
    import FUNCTIONS from '@/functions'

    export default {
        name: 'sku',
        data () {
            return {
                apiURL: process.env.ROOT_API,
                sectionApi: 'skus',
                supupdate: '',

                itemsData: [],
                filteredItems: [],
                statusChangeModel: [],
                fieldNEW: [],
                messageSuccess: [],

                searchQuery: '',
                loading: true,
                errored: false,
                currentPage: 1,
                perPage: 10,
                totalPage: '',
                dismissSecs: 5,
                dismissCountDown: 0,
                dataModalName: '',
                dataModalSupplier: '',
                currentSort:'name',
                currentSortDir:'asc',
                changeSupplier: '',

                fieldsTable: [
                    { label: 'No', width: '50px' },
                    { label: 'Nama', width: '200px' },
                    { label: 'Kode', width: '120px' },
                    { label: 'Harga', width: '150px' },
                    { label: 'Supplier', width: '400px' },
                    // { label: 'Status' },
                ],

                // for error counting
                countErrorPost: 0,
            }
        },
        ready(){
            this.filteredItems = this.fieldNEW
        },
        watch:{
            searchQuery: function(newSearch){
                this.getPostComparison('', '', newSearch)
                document.querySelector('.el-pagination').children[1].children[0].click()
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['sku.list'])
        },
        mounted () {
            this.getPostComparison('', '', '')
        },
        methods: {
            buildUrl (limit, page, search) {
                return this.apiURL + this.sectionApi + "?limit=" + limit + "&page=" + page + '&search=' + search + '&direction=DESC'
            },

            groupBy(collection, property) {
                var i = 0, val, index, values = [], result = [];
                for (i; i < collection.length; i++) {
                    val = collection[i][property];
                    index = values.indexOf(val);
                    if (index > -1){
                        result[index].push(collection[i]);
                    } else {
                        values.push(val);
                        result.push([collection[i]]);
                    }
                }
                return result;
            },

            // Get Comparison and Grouping by name
            getPostComparison(num, pg, sch){
                let url = this.buildUrl(num, pg, sch)
                this.loading = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'error'){
                        this.errored = true
                        if(response.data.message == 'Unable to authenticate with invalid API key and token.'){
                            FUNCTIONS.logout('expired-token', response.data.message)
                        }
                    }else{
                        this.fieldNEW = this.groupBy(response.data.data, "name")
                        this.totalPage = this.fieldNEW.length
                    }
                })
                .catch(error => { 
                    this.countErrorPost++
                    if(this.countErrorPost >= 3){
                        this.errored = true
                    }else{
                        this.getPostComparison('', '', '')
                    }
                })
                .finally(() => {
                    this.loading = false
                    // console.log(this.fieldNEW)
                    // var filtered = this.fieldNEW.filter(function(el) {
                    //     return el.status === 'active';
                    // });
                })
            },

            // GetBySearch
            // getPostComparisonbySearch: _.debounce(function(sch){
            //     let url = this.buildUrl('', '', sch)
            //     this.loading = true
            //     this.axios.get(url)
            //     .then(response => {
            //         if(response.data.status == 'error'){
            //             // FUNCTIONS.logout('expired-token', response.data.message)
            //         }else{
            //             this.fieldNEW = this.groupBy(response.data.data, "name")
            //             this.totalPage = this.fieldNEW.length
            //         }
            //     })
            //     .catch(error => { 
            //         console.log(error);
            //         this.errored = true
            //     })
            //     .finally(() => this.loading = false)
            // }, 300),

            supplierChange(id){
                let url = this.apiURL + 'skuComparison/' + id
                this.loading = true
                this.axios.put(url, {
                    status: 'active'
                })
                .then(response => { 
                    this.messageSuccess = response.data.data
                    if(response.data.status == 'success' && response.data.code == '200'){
                        this.$notify.success({
                            title: 'Success',
                            message: 'Status SKU '+this.messageSuccess.name+ '(' +  this.messageSuccess.supplier + ')' + ' telah diperbaharui.'
                        });

                        this.getPostComparison('', '', this.searchQuery)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
            },

            // Pagination Change function
            pageChange (page) {
                let that = this
                this.loading = true
                this.currentPage = page
                setTimeout(function(){ that.loading = false }, 500)
            },

            // formatPrice
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },

            // Limit Change function
            limitChange(limit){
                let that = this
                this.perPage = limit
                this.loading = true
                document.querySelector('.el-pagination').children[1].children[0].click()
                document.querySelectorAll('.showing-page ul li').forEach(function(a){a.classList.remove('active')})
                setTimeout(function(){ that.loading = false }, 500)
                event.target.parentNode.classList.add('active')
            },
        },
        computed: {
            parseInt: function(value){
                return parseInt(value)
            },

            sortedCats:function() {
                return this.fieldNEW.filter((row, index) => {
                    let start = (this.currentPage-1)*this.perPage;
                    let end = this.currentPage*this.perPage;
                    if(index >= start && index < end) return true;
                })
            },
        }
    }
</script>