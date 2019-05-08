<template>
    <div class="content-wrapper">
        <div id="locations">
            <div class="page-header">
                <div class="page-header-content">
                    <div class="page-title clearfix">
                        <h4 class="float-left">Lokasi</h4>
                    </div>
                </div>
            </div>
            <div class="content">
                <section v-if="errored">
                    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
                </section>
                <section v-else>
                    <table class="export-table" id="tableau" border="1" style="display: none;">
                        <thead>
                            <tr>
                                <th width="100">Province</th>
                                <th width="150">Total Voucher</th>
                                <th width="150">Total Amount</th>
                                <th width="100">Username</th>
                                <th width="100">Full Name</th>
                                <th width="100">Voucher</th>
                                <th width="100">Amount</th>
                                <th width="100">City</th>
                                <th width="500">Address</th>
                            </tr>
                        </thead>
                        <tbody v-for="(dataExport, indexExport) in itemsDataVoucher" :key="indexExport">
                            <tr v-for="(dataExport2, indexExport2) in dataExport" :key="indexExport2">
                                <td v-if="indexExport2 == 0" :rowspan="dataExport.length">{{indexExport}}</td>
                                <td v-if="indexExport2 == 0" :rowspan="dataExport.length" align="center" valign="center">
                                    {{ totalAmount[indexExport] }}
                                </td>
                                <td v-if="indexExport2 == 0" :rowspan="dataExport.length" align="center" valign="center">
                                    {{ totalPrice[indexExport] }}
                                </td>
                                <td>{{dataExport2.username}}</td>
                                <td>{{dataExport2.fullname}}</td>
                                <td>{{dataExport2.total_voucher}}</td>
                                <td>{{dataExport2.total_amount}}</td>
                                <td>{{dataExport2.city}}</td>
                                <td>{{dataExport2.formatted_address}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <div class="filterSearching clearfix">
                            <el-date-picker
                                class="date-range-picker"
                                v-model="dateRange"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="Start date"
                                end-placeholder="End date"
                                :format="format"
                                :value-format="format"></el-date-picker>
                            <div class="input-with-icons clearfix">
                                <div class="el-input searchtype">
                                    <input type="text" v-model="userQuery" class="el-input__inner selectUser" placeholder="Pilih User">
                                    <img src="~assets/images/icons/arrow-down.png">
                                    <div class="dropdown-filterable">
                                        <ul>
                                            <div v-if="loadingAuto == true">
                                                <li><a href="#" style="text-align:center;">Loading Data</a></li>
                                            </div>
                                            <div v-else>
                                                <div v-if="itemsdataUser.length !== 0">
                                                    <li><a href="#" @click.prevent="filterByUser('')">All User</a></li>
                                                    <li v-for="(itemUser, indexUser) in itemsdataUser"
                                                    :key="indexUser"
                                                    :label="itemUser.fullname"
                                                    :value="itemUser.id"><a href="#" @click.prevent="filterByUser(itemUser)">{{itemUser.fullname}} ({{itemUser.username}})</a></li>
                                                </div>
                                                <div v-else><li><a href="#" style="text-align:center;">No data</a></li></div>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!-- <el-select
                                v-model="userQuery"
                                filterable
                                remote
                                placeholder="Pilih User"
                                :remote-method="getUserAll"
                                :loading="loadingAuto"
                                class="selectUser">
                                <el-option v-if="itemsdataUser.length !== 0" label="Pilih User" value="">All</el-option>
                                <el-option
                                    v-for="(dataUser, indexUser) in itemsdataUser"
                                    :key="indexUser"
                                    :label="dataUser.fullname"
                                    :value="dataUser.id">{{dataUser.fullname}} ({{dataUser.username}})</el-option>
                            </el-select> -->
                            <el-select v-model="typeQuery" placeholder="Semua Transaksi">
                                <el-option value="all" label="All Transaction">All Transaction</el-option>
                                <el-option value="topup" label="All TopupUp Transaction">All TopupUp Transaction</el-option>
                                <el-option value="promo" label="Only TopUp by Promo Code">Only TopUp by Promo Code</el-option>
                                <el-option value="transaction" label="All Transaction Digital">All Transaction Digital</el-option>
                            </el-select>
                            <!-- <el-button @click="exportShow = !exportShow" class="button-export-voucher button-white-green" round>Export Pemakaian Voucher</el-button> -->
                        </div>
                        <transition name="slide-down">
                            <div class="export-locations">
                                <div class="cards export-voucher-container">
                                    <h4 class="title">Export Pemakaian Topup Voucher</h4>
                                    <div class="content-forms clearfix">
                                        <div class="type-export">
                                            <span>View City?</span>
                                            <el-checkbox v-model="typeExport"></el-checkbox>
                                        </div>
                                        <div class="type-export">
                                            <span>Province</span>
                                            <el-select
                                                v-model="provinceall"
                                                multiple
                                                filterable
                                                allow-create
                                                default-first-option
                                                :popper-append-to-body="false"
                                                placeholder="Masukkan Provinsi Anda">
                                            </el-select>
                                            <div class="note">*After typing province for select it press enter</div>
                                        </div>
                                        <el-date-picker
                                            class="date-range-picker"
                                            v-model="dateRangeTopupVoucher"
                                            type="daterange"
                                            range-separator="-"
                                            start-placeholder="Start date"
                                            end-placeholder="End date"
                                            :format="format"
                                            :value-format="format"></el-date-picker>
                                        <el-button @click="ExportTopupVoucher()" class="button-export-voucher button-outline-green" round>
                                            <img src="~assets/images/icons/download-new.png" v-if="(loadingExcelTopup == false)">
                                            <div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export
                                        </el-button>
                                    </div>
                                </div>
                                <div class="cards export-voucher-container">
                                    <h4 class="title">Export Pemakaian Voucher</h4>
                                    <div class="content-forms clearfix">
                                        <el-date-picker
                                            class="date-range-picker"
                                            v-model="dateRangeVoucher"
                                            type="daterange"
                                            range-separator="-"
                                            start-placeholder="Start date"
                                            end-placeholder="End date"
                                            :format="format"
                                            :value-format="format"></el-date-picker>
                                        <el-button @click="getDataVoucher()" class="button-export-voucher button-outline-green" round>
                                            <img src="~assets/images/icons/download-new.png" v-if="(loadingExcel == false)">
                                            <div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </transition>
                        <div class="locations-container">
                            <div class="el-loading-mask" v-show="(loading == true)">
                                <div class="el-loading-spinner">
                                    <svg viewBox="25 25 50 50" class="circular">
                                        <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                                    </svg>
                                </div>
                            </div>

                            <div class="locations-information">
                                <el-row :gutter="20">
                                    <el-col :span="8" :xs="24">
                                        <div class="cards">
                                            <div class="topup-info">
                                                <span v-if="itemsData">{{itemsData.topupPromoWithLocation}}</span>
                                                <span v-else>0</span>
                                                Top Up Promo Terdeteksi Lokasi
                                            </div>
                                            <div class="topup-info">
                                                <span v-if="itemsData">{{itemsData.topupPromoNoLocation}}</span>
                                                <span v-else>0</span>
                                                Top Up Promo Tidak Terdeteksi Lokasi 
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="16" :xs="24">
                                        <div class="cards other-info-locations">
                                            <el-row :gutter="20">
                                                <el-col :span="8" :xs="24">
                                                    <span v-if="itemsData">{{itemsData.topupPromoWithLocationAll}}</span>
                                                    <span v-else>0</span>
                                                    Total Penggunaan Voucher Terdeteksi Lokasi   
                                                </el-col>
                                                <el-col :span="8" :xs="24">
                                                    <span v-if="itemsData">{{itemsData.topupPromoNoLocationAll}}</span>
                                                    <span v-else>0</span>
                                                    Total Penggunaan Voucher Tidak Terdeteksi Lokasi  
                                                </el-col>
                                                <el-col :span="8" :xs="24">
                                                    <span v-if="itemsData">{{itemsData.topupPromoWithLocationAll + itemsData.topupPromoNoLocationAll}}</span>
                                                    <span v-else>0</span>
                                                    Total Penggunaan Voucher Keseluruhan
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>

                            <div class="maps-content">
                                <div id="map"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import XLSX from 'xlsx'
    import JQuery from 'jquery'
    import FUNCTIONS from '@/functions'

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    export default {
        name: 'locations',
        data () {
            return {
                // for get api
                // apiURL: 'http://ecommerce.mobayar.com/v1/cmsapi/',
                apiURL: process.env.ROOT_API,
                sectionApi: 'locations',
                sectionApiVoucherLocations: '/exportPromoCode',
                sectionApiExportTopupVoucherUsage: '/exportTopupVoucherUsage',
                sectionApiUser: 'user',

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                itemsdataUser: [],
                itemsDataVoucher: [],
                voucherDataTest: [],

                // another important variable data
                userQuery: '',
                userQueryId: '',
                typeQuery: '',
                loading: true,
                loadingAuto: false,
                errored: false,
                dateRange: [FUNCTIONS.formatDate(date), FUNCTIONS.formatDate(date)],
                dateRangeVoucher: [FUNCTIONS.formatDate(date), FUNCTIONS.formatDate(date)],
                dateRangeTopupVoucher: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
                format: 'yyyy-MM-dd',
                totalPage: '',
                tablenum: 0,
                exportShow: false,
                loadingExcel: false,
                loadingExcelTopup: false,
                loadingForm: false,

                // variable for maps
                coordinates: [],
                map: '',
                markerCluster: '',
                markerclus: '',
                bounds: new google.maps.LatLngBounds(),
                locked_maps : true,
                clusterMarkerMaps: [],
                infowindow: '',
                geocoder: '',
                markerHover: '',
                icon_url: '',
                marker_class: '',
                markerClusterOption :{
                    zoomOnClick: true,
                    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
                },

                // message variable
                messageerror: '',
                messagesuccess: '',

                typeExport: false,
                provinceall: [],
                urlProvince: [],
            }
        },
        created(){
            FUNCTIONS.checkPermissions(this.$dataRole['location.list'])
        },
        mounted () {
            this.getPosts(this.typeQuery, this.dateRange[0], this.dateRange[1] , this.userQuery)
            this.getUserAll(this.userQuery)
            this.searchUserInit()

            // for close custom autocomplete
            // document.querySelector('body').addEventListener('click', function(e){
            //     let element = document.querySelector('.filterSearching .input-with-icons .el-input__inner')
            //     if(element != null){
            //         if (e.target !== element && !element.contains(e.target)) {
            //             let element2 = document.querySelector('.el-autocomplete-suggestion')
            //             if(element2 != null){
            //                 document.querySelector('.el-autocomplete-suggestion').classList.remove('showing')
            //             }
            //         }
            //     }
            // })
        },
        watch:{
            dateRange: function(newDaterange){
                this.getPosts(this.typeQuery, newDaterange[0], newDaterange[1] , this.userQuery)
            },
            typeQuery: function(newtype){
                if(this.dateRange != null){
                    this.getPosts(newtype, this.dateRange[0], this.dateRange[1], this.userQuery)
                }else{
                    this.$notify.error({
                        title: 'Maaf',
                        message: 'Tanggal tidak boleh kosong'
                    });
                }
            },
        },
        methods: {
            // Build URL
            buildUrl (type, startDate, endDate, userId) {
                return this.apiURL + this.sectionApi + '?type=' + type + '&start_date=' + startDate + '&end_date=' + endDate + '&user_id=' + userId
            },

            buildUrlVoucher(){
                return this.apiURL + this.sectionApi + this.sectionApiVoucherLocations + '?start_date=' + this.dateRangeVoucher[0] + '&end_date=' + this.dateRangeVoucher[1]
            },

            getDataVoucher(){
                if(this.dateRangeVoucher != null){
                    let url = this.buildUrlVoucher()
                    this.loadingExcel = true
                    this.axios.get(url)
                    .then(response => { 
                        if(response.data.code == '500' && response.data.status == 'error'){
                            this.$notify.error({
                                title: 'Maaf',
                                message: response.data.message
                            });
                        }else{
                            this.itemsDataVoucher = response.data.data 
                        }
                    })
                    .catch(error => { 
                        this.errored = true 
                        console.log(error)
                    })
                    .finally(() => {
                        this.loadingExcel = false
                        this.ExportVoucher()
                    })
                }else{
                    this.$notify.error({
                        title: 'Maaf',
                        message: 'Tanggal Export Pemakaian Voucher tidak boleh kosong'
                    });
                }
            },

            ExportVoucher(){
                var wscols = [
                    {wch:15},
                    {wch:15},
                    {wch:15},
                    {wch:12},
                    {wch:12},
                    {wch:10},
                    {wch:13},
                    {wch:15},
                    {wch:80},
                ];
                var datas = XLSX.utils.table_to_sheet(document.getElementById('tableau'))
                datas['!cols'] = wscols;
                var wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, datas, 'Report Pemakaian Promo')
                XLSX.writeFile(wb, 'pemakaian-promo-perlokasi-'+ this.dateRangeVoucher[0] +'-to-'+ this.dateRangeVoucher[1] +'.xlsx')
            },

            ExportTopupVoucher(){
                if(this.dateRangeTopupVoucher == null){
                    this.$notify.error({
                        title: 'Maaf',
                        message: 'Tanggal Export Pemakaian Topup Voucher tidak boleh kosong'
                    });
                }else{
                    let url
                    this.urlProvince = []
                    this.loadingExcelTopup = true
                    if(this.typeExport == true){
                        if((this.provinceall).length != 0){
                            this.provinceall.forEach(function(e, i) {
                                let newUrl = '&province%5B%5D=' + e
                                this.urlProvince.push(newUrl)
                            }, this);
                            let urlData = this.urlProvince.toString().replace(/,/g, '')
                            url = this.apiURL + this.sectionApi + this.sectionApiExportTopupVoucherUsage + '?view=city' + urlData + '&start_date=' + this.dateRangeTopupVoucher[0] + '&end_date=' + this.dateRangeTopupVoucher[1]
                        }else{
                            if(this.dateRangeTopupVoucher !== null){
                                this.provinceall.forEach(function(e, i) {
                                let newUrl = '&province%5B%5D=' + e
                                this.urlProvince.push(newUrl)
                            }, this);
                            let urlData = this.urlProvince.toString().replace(/,/g, '')
                            url = this.apiURL + this.sectionApi + this.sectionApiExportTopupVoucherUsage + '?view=city' + urlData + '&start_date=' + this.dateRangeTopupVoucher[0] + '&end_date=' + this.dateRangeTopupVoucher[1]
                            }else{
                                url = this.apiURL + this.sectionApi + this.sectionApiExportTopupVoucherUsage + '?view=city'
                            }
                        }
                    }else{
                        if((this.provinceall).length != 0){
                            this.provinceall.forEach(function(e, i) {
                                if(i == 0){
                                    let newUrl = '?province%5B%5D=' + e
                                    this.urlProvince.push(newUrl)
                                }else{
                                    let newUrl2 = '&province%5B%5D=' + e
                                    this.urlProvince.push(newUrl2)
                                }
                            }, this);
                            let urlData = this.urlProvince.toString().replace(/,/g, '')
                            url = this.apiURL + this.sectionApi + this.sectionApiExportTopupVoucherUsage + urlData + '&start_date=' + this.dateRangeTopupVoucher[0] + '&end_date=' + this.dateRangeTopupVoucher[1]
                        }else{
                            if(this.dateRangeTopupVoucher !== null){
                                url = this.apiURL + this.sectionApi + this.sectionApiExportTopupVoucherUsage + '?start_date=' + this.dateRangeTopupVoucher[0] + '&end_date=' + this.dateRangeTopupVoucher[1]
                            }else{
                                url = this.apiURL + this.sectionApi + this.sectionApiExportTopupVoucherUsage
                            }
                        }
                    }
                    this.axios({
                        url: url,
                        method: 'GET',
                        responseType: 'blob', // important
                    })
                    .then(response => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'Promo Topup.xls');
                        document.body.appendChild(link);
                        link.click();
                        this.loadingExcelTopup = false
                    })
                    .catch(error => {
                        this.$notify.error({
                            title: 'Jaringan Bermasalah',
                            message: error
                        });
                    })
                }
            },

            initMaps(){
                this.map = ''
                this.clusterMarkerMaps = [] 
                this.markerCluster = ''
                this.markerclus =  ''

                var myOptions = {
                    // disableDefaultUI: true,
                    // mapTypeId: google.maps.MapTypeId.ROADMAP,
                    maxZonn:15,
                    gestureHandling: 'greedy'
                };
                this.map = new google.maps.Map(document.getElementById("map"), myOptions);

                if(this.itemsData){
                    if(Object.keys(this.itemsData.coordinates).length > 0){ 
                        this.setcluster_marker_maps(this.itemsData.coordinates);
                    }else{
                        this.map.setCenter(new google.maps.LatLng(-6.121435, 106.774124));
                        this.map.setZoom(6);
                    }
                }else{
                    this.map.setCenter(new google.maps.LatLng(-6.121435, 106.774124));
                    this.map.setZoom(6);
                }
            },

            setcluster_marker_maps(getData){
                let that = this
                this.geocoder = new google.maps.Geocoder;
                this.infowindow = new google.maps.InfoWindow({
                    maxWidth: 200
                });

                let i = 0;

                let dataCoordinate = getData

                JQuery.each(dataCoordinate, function( key_jenis, coordinates_perjenis ) {
                    JQuery.each(coordinates_perjenis, function( key_lat_lng_userid, trans_data ) {
                        i++;
                        let mapdata = trans_data[0];

                        if(mapdata.jenis=='topup'){
                            that.icon_url = {
                                url: require('assets/images/marker-green.png'),
                                labelOrigin:  new google.maps.Point(25,50),
                            }
                            that.marker_class = "marker-label-custom-green";
                        }else{
                            that.icon_url = {
                                url: require('assets/images/marker-red.png'),
                                labelOrigin:  new google.maps.Point(25,50),
                            }
                            that.marker_class = "marker-label-custom-red";
                        }

                        let latitude_point = Number(mapdata.location.latitude)+Number(that.randomIntFromInterval(-30, 30)/100000);
                        let longitude_point = Number(mapdata.location.longitude)+Number(that.randomIntFromInterval(-30, 30)/100000);

                        that.markerclus = new google.maps.Marker({ // use this google.maps.Marker for the best performance
                            position : new google.maps.LatLng(latitude_point,longitude_point),
                            animation: google.maps.Animation.DROP,
                            icon : that.icon_url,
                            detail : mapdata,
                            label: mapdata.user.fullname,
                        });

                        that.bounds.extend(that.markerclus.position);

                        //fungsi mouse click
                        that.markerclus.addListener('click', (function(markerclus, i) {
                            return function() {

                                let latlng = { lat : latitude_point, lng : longitude_point };

                                that.geocoder.geocode({'location': latlng}, function(results, status) {
                                    if (status === 'OK') {
                                        if (results[0]) {
                                            let description = "";
                                            let index
                                            let location_name = results[0].formatted_address;

                                            if(mapdata.jenis=='topup'){
                                                description+='<div class="minfo-item minfo-header">TOPUP SALDO</div>';
                                            }else{
                                                description+='<div class="minfo-item minfo-header">Trans. Digital</div>';
                                            }

                                            description+='<div class="minfo-item minfo-user">'+mapdata.user.fullname+' ('+mapdata.user.username+')</div>';
                                            description+='<div class="minfo-item minfo-phone">'+mapdata.user.phone_number+'</div>';


                                            description+='<div class="minfo-item minfo-location">'+location_name+'</div>';


                                            description+='<table class="table-sm table-bordered table-trans">';
                                            // description+="<tr><th>Date</th><th>Amount</th></tr>";

                                            for(index in trans_data){
                                                description+="<tr><td>";
                                                description+="<b>Date</b> : "+trans_data[index].created_at;
                                                description+="<br/>";
                                                if(key_jenis=='transaction'){
                                                    description+="<b>Amount</b> : Rp. "+that.convertToRupiah(trans_data[index].total);
                                                }else{
                                                    description+="<b>Amount</b> : Rp. "+that.convertToRupiah(trans_data[index].amount);
                                                }
                                                if(trans_data[index].promo_code!='' && trans_data[index].promo_code!=null){
                                                    description+="<br/>";
                                                    description+="<b>Promo Code</b> :<i>"+trans_data[index].promo_code+"</i>";
                                                }

                                                description+="</td></tr>";
                                            }
                                            description+="</table>";
                                
                                            that.infowindow.setContent(description);
                                            that.infowindow.open(that.map, markerclus);

                                        } else {
                                            window.alert('No results found');
                                        }
                                    } else {
                                        window.alert('Geocoder failed due to: ' + status);
                                    }
                                });

                            }
                        })(that.markerclus, i));

                        that.clusterMarkerMaps.push(that.markerclus);
                    });
                });


                this.map.fitBounds(this.bounds);

                let listener = google.maps.event.addListener(this.map, "idle", function() {
                    google.maps.event.removeListener(listener);
                });

                this.markerCluster = new MarkerClusterer(this.map, this.clusterMarkerMaps, this.markerClusterOption);  
                
            },

            randomIntFromInterval(min,max){
                return Math.floor(Math.random()*(max-min+1)+min);
            },

            closeInfo(){
                this.infowindow.close()
            },

            convertToRupiah(angka) {
                let rev = parseInt(angka, 10).toString().split('').reverse().join('');
                let rev2 = '';
                for (let i = 0; i < rev.length; i++) {
                    rev2 += rev[i];
                    if ((i + 1) % 3 === 0 && i !== (rev.length - 1)) {
                        rev2 += '.';
                    }

                }

                return rev2.split('').reverse().join('');

            },

            searchUserInit(){
                let that = this
                setTimeout(function(){
                    document.querySelector('.selectUser').addEventListener('click', function(){
                        if(document.querySelector('.dropdown-filterable')){
                            document.querySelector('.dropdown-filterable').classList.add('dropdown-showing')
                        }
                    });
                    document.addEventListener('click', function(e){
                        if(!JQuery(e.target).closest('.selectUser, .dropdown-filterable').length){
                            if(document.querySelector('.dropdown-filterable')){
                                document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
                            }
                        }
                    })
                    var textInput = document.querySelector('.selectUser');
                    var timeout = null;
                    textInput.onkeyup = function (e) {
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            that.getUserAll(textInput.value)
                            console.log('Input Value:', textInput.value);
                        }, 800);
                    };
                }, 500)
            },

            filterByUser(user){
                let usernameData
                if(user == ''){
                    usernameData = ''
                    this.userQuery = ''
                    this.getUserAll('')
                }else{
                    usernameData = user.id
                }
                document.querySelector('.dropdown-filterable').classList.remove('dropdown-showing')
                this.getPosts(this.typeQuery, this.dateRange[0], this.dateRange[1] , usernameData)
                document.querySelector('.el-pagination').children[1].children[0].click()
            },

            getUserAll(search){
                let userDataurl = this.apiURL + this.sectionApiUser  + '?limit=30&page=1&direction=ASC&search=' + search
                this.loadingAuto = true
                this.axios.get(userDataurl)
                .then(response => {
                    this.itemsdataUser = response.data.data
                })
                .finally(() => {
                    this.loadingAuto = false
                })
            },

            filterMapsbyUser(name, id) {
                this.userQuery = name
                this.userQueryId = id
                this.getPosts(this.typeQuery, this.dateRange[0], this.dateRange[1] , id)
            },

            // Get All Post
            getPosts(type, startDate, endDate, userId){
                let url = this.buildUrl(type, startDate, endDate, userId)
                this.loading = true
                this.axios.get(url)
                .then(response => { 
                    if(response.data.code == '500' && response.data.status == 'error'){
                        this.$notify.error({
                            title: 'Maaf',
                            message: response.data.message
                        });
                    }else if(response.data.message == 'Unable to authenticate with invalid API key and token.'){
                        FUNCTIONS.logout('expired-token', response.data.message)
                    }else{
                        this.itemsData = response.data.data 
                        this.initMaps()
                    }
                })
                .catch(error => { this.errored = true })
                .finally(() => {
                    this.loading = false
                })
            },
        },
        computed:{
            totalAmount: function(){
                var total
                var object = {}
                JQuery.each(this.itemsDataVoucher, function(index, value){
                    total = []
                    JQuery.each(value, function(indexValue, ValueSecond){
                        let price = parseInt(ValueSecond.total_voucher)
                        total.push(price)
                    })
                    var totalOb = total.reduce(function(total, num){ return total + num }, 0);
                    object[index] = totalOb
                })
                return object;
            },
            totalPrice: function(){
                var total
                var object = {}
                JQuery.each(this.itemsDataVoucher, function(index, value){
                    total = []
                    JQuery.each(value, function(indexValue, ValueSecond){
                        let price = parseInt(ValueSecond.total_amount)
                        total.push(price)
                    })
                    var totalOb = total.reduce(function(total, num){ return total + num }, 0);
                    object[index] = totalOb
                })
                return object;
            },
        },
    }
</script>

<style lang="scss">
    #locations{
        .slide-down-enter-active, .slide-down-leave-active {
            transition: all .4s ease;
        }
        .slide-down-enter, .slide-down-leave-to /* .fade-leave-active below version 2.1.8 */ {
            transform: scaleY(0);
        }
        .button-export-voucher{
            margin-left: 15px;
            img{
                max-width: 16px;
                vertical-align: middle;
                margin-right: 5px;
            }
            .lds-ring{
                margin-right: 5px;
                top: -1px;
                div{
                    border-color: #800080 transparent transparent transparent;
                }
            }
        }
        .export-locations{
            display: flex;
            margin-left: -10px;
            margin-right: -10px;
            margin-bottom: 15px;
        }
        .export-voucher-container{
            margin-bottom: 15px;
            padding: 20px;
            transform-origin: top;
            flex: 1;
            width: 50%;
            margin: 0 10px;
            .type-export{
                margin-bottom: 10px;
                display: block;
                label{
                    margin-bottom: 0;
                }
                .el-select{
                    width: 76%;
                    .el-select-dropdown, .el-input__suffix-inner{
                        display: none !important;
                    }
                }
                .note{
                    font-size: 11px;
                    font-weight: 600;
                    color: #800080;
                    margin-left: 9em;
                }
                &>span{
                    vertical-align: middle;
                    position: relative;
                    top: -3px;
                    margin-right: 5px;
                    width: 90px;
                    display: inline-block;
                    font-weight: 600;
                    font-size: 13px;
                }
            }
            .content-forms{
                & > .el-date-editor{
                    float: left;
                    max-width: 250px;
                }
                & > .el-button{
                    float: left;
                }

            }
        }
        .el-autocomplete-suggestion{
            position: absolute; 
            transform-origin: center top 0px; 
            transition: all .2s ease;
            z-index: 9; 
            width: 250px;
            transform: scaleY(0);
            &.showing{
                display: block;
                transform: scaleY(1);
            }
            li{
                white-space: normal;
                overflow: visible;
                text-overflow: unset;
                line-height: normal;
                padding: 5px 20px;
            }
            .el-autocomplete-suggestion__wrap{
                margin-bottom: -17px; 
                // margin-right: -17px;
            }
        }
        .filterSearching{
            .input-with-icons{
                .el-input{
                    .el-input__inner{
                        background: none;
                        border: none;
                        &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
                            color: #39434E !important;
                        }
                        &::-moz-placeholder { /* Firefox 19+ */
                            color: #39434E !important;
                        }
                        &:-ms-input-placeholder { /* IE 10+ */
                            color: #39434E !important;
                        }
                        &:-moz-placeholder { /* Firefox 18- */
                            color: #39434E !important;
                        }
                        &:focus{
                            border: 2px solid #800080;
                            border-radius: 3px;
                        } 
                    }
                }
            }
        }
    }
    .locations-information{
        .cards{
            padding: 20px;
        }
        .topup-info{
            margin-bottom: 10px;
            color: #697586;
            &:last-child{
                margin-bottom: 0;
            }
            span{
                font-size: 26px;
                color: #39434e;
                font-weight: 600;
                display: inline-block;
                margin-right: 10px;
            }
        }
        .other-info-locations{
            color: #697586;
            span{
                font-size: 26px;
                color: #39434e;
                font-weight: 600;
                display: block;
                margin-bottom: 8px;
            }
        }
    }
    .maps-content{
        margin-top: 15px;
        #map {
            min-height: 500px;
            height: 100%;
            width:100%;
            .gm-style{
                &>div{
                    &>div{
                        div{
                            &:nth-last-child(2){
                                div{
                                    &>div{
                                        &>div{
                                            &>div{
                                                font-size: 14px;
                                                background: #fff;
                                                padding: 5px 9px;
                                                border: 1px solid #BFC9D8;
                                                border-radius: 3px;
                                                margin-top: 10px;
                                                margin-left: -12px;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .locations-container{
        position: relative;
    }
    .marker-label-custom-green {
        width: 50px;
        height: 20px;
        border: 1px solid #00980c;
        background: #00a914;
        color: #ffffff;
        text-align: center;
        line-height: 20px;
        font-size: 14px;
    }
    .marker-label-custom-red {
        width: 50px;
        height: 20px;
        border: 1px solid #ff4e8f;
        background: #ff4e8f;
        color: #ffffff;
        text-align: center;
        line-height: 20px;
        font-size: 14px;
    }
    .minfo-item.minfo-header {
        border-bottom: solid 1px #eaeaea;
        font-size: 14px;
        padding: 10px 0px;
    }
    .minfo-item {
        margin-bottom: 7px;
    }
    .minfo-item.minfo-user {
        font-weight: bold;
    }
    .table-trans{
        margin-top: 10px 0px;
        width: 100%;
    }
    .legend-number {
        font-size: 24px;
        color: #2196f3;
        margin-bottom: 5px;
    }
    .legend-label {
        font-size: 12px;
    }
    .selectUser{
        margin-right: 15px;
    }
</style>