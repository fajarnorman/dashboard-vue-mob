<template>
    <div class="content-wrapper">
        <div id="monitor-product-status">
            <div class="page-header">
                <page-header titleName="Monitoring Product Status SKU" :isCreate="false"></page-header>
            </div> 
            <div class="content-monitoring clearfix">
                <div class="tab-menu-header">
                    <ul>
                        <li><a class="active" @click.prevent="showingTab('product-status-content')" href="#">Produk Status</a></li>
                        <li v-if="$dataRole['service.product-status.get.cms.monitoring.statistics']"><a @click.prevent="showingTab('product-statistik')" href="#">Statistik</a></li>
                    </ul>
                </div>
                <div class="tabbing-product-status active" id="product-status-content">
                    <loading-svg :isLoading="loading"></loading-svg>
                    <div v-if="dataGroupOperator.length !== 0">
                        <div
                            class="cards"
                            v-for="(dataOperator, indexOperator) in dataGroupOperator"
                            :key="indexOperator">
                            <h4 class="cards-open" @click.prevent="cardOpens">
                                {{dataOperator['operator']}}
                                <font-awesome-icon class="fontIcons down" :icon="fontsIcons.down" />
                            </h4>
                            <div class="datamonitoring">
                                <table>
                                    <tr>
                                        <th class="first-cell">Name</th>
                                        <th v-for="(dataSupplier, indexSupplier) in dataSupplier" 
                                            :key="indexSupplier">{{dataSupplier}}</th>
                                    </tr>
                                    <tr v-for="(dataPut, indexPut) in dataOperator['data']" :key="indexPut">
                                        <td>{{indexPut}}</td>
                                        <td v-for="(dataSuppliertb, indexSuppliertb) in dataSupplier"
                                            :key="indexSuppliertb">
                                            <div v-for="(dataStatus, indexStatus) in dataPut" :key="indexStatus">
                                                <div v-if="dataStatus.supplier == dataSuppliertb">
                                                    <span class="badge inline success" v-if="dataStatus.status == 'active'">Open</span>
                                                    <span class="badge inline failed" v-if="dataStatus.status == 'inactive'">Close</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <p class="nodata">{{noData}}</p>
                    </div>
                </div>
                <div class="tabbing-product-status" id="product-statistik">
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
                    </div>
                    <el-row :gutter="20" class="content-chart">
                        <loading-svg :isLoading="loadingStatistik"></loading-svg>
                        <!-- <pre>{{statistikdata}}</pre> -->
                        <el-col :span="24" v-if="(statistikdata).length !== 0">
                            <div class="cards charts-items" v-for="(dataChart, indexChart) in statistikdata" :key="indexChart">
                                <div class="header-chart clearfix">
                                    <h4 style="text-transform: capitalize;">
                                        Statistik Produk : {{dataChart['operator']}}
                                    </h4>
                                </div>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <canvas :id="'chart-product-status'+indexChart" height="80"></canvas>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-col>
                        <el-col :span="24" v-else>
                            <p class="nodata">{{noData}}</p>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Chart from 'chart.js'
import services from "@/service"
import FUNCTIONS from "@/functions"
import pageHeader from "@/components/partials/pageHeader.vue"
import loadingSvg from "@/components/partials/loadingSvg.vue"
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

let date = new Date()
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

export default {
    name: "monitor-productStatus-sku",
    components: { pageHeader, loadingSvg },
    data() {
        return {
            sectionApi: "product-status?servicePathUrl=cms/monitoring/sku",
            sectionApiStatistik: "product-status?servicePathUrl=cms/monitoring/statistics",
            loading: false,
            loadingStatistik: false,
            itemsData: [],
            messagesuccess: "",
            messageerror: "",
            textMemuatData: "Masih memuat data",
            textErrorNetwork: "Jaringan Bermasalah",
            noData: "No data available",
            dataOperator: [],
            dataSupplier: [],
            dataGroupOperator: [],
            dataStatistik: [],
            dateRange: [FUNCTIONS.formatDate(firstDay), FUNCTIONS.formatDate(lastDay)],
            format: 'yyyy-MM-dd',
            fontsIcons:{
                down: faChevronDown,
            },
            statistikdata: [],
            statistikdatasakala: [],
            myChart: "",
        };
    },
    created() {
        FUNCTIONS.checkPermissions(this.$dataRole["service.product-status.get.cms.sku"])
    },
    mounted() {
        this.getPost()
        this.createChart()
    },
    watch: {
        dateRange() {
            this.getPostStatisik()
        },
    },
    methods: {
        async getPost(){
            let url = this.urlService + this.sectionApi
            try{
                this.loading = true
                const response = await services.getList(url)
                this.loading = false
                if(response.data.status == 'success'){
                    this.itemsData = response.data.data

                    let dataSupplier = []
                    this.itemsData.forEach(function(e){
                        dataSupplier.push(e.supplier)
                    }, this)

                    this.dataSupplier = FUNCTIONS.removeDupplicateValueArray(dataSupplier)

                    let arrList = this.itemsData
                    let result = _(arrList).groupBy('operator').map((v, operator) => ({
                        operator,
                        data: _.groupBy(v, 'name')
                    })).value()
                    this.dataGroupOperator = result

                    setTimeout(function(){
                        if(document.querySelector('.content-monitoring .cards')){
                            document.querySelector('.content-monitoring .cards').classList.add('showing')
                        }
                    }, 200)
                }else{
                    FUNCTIONS.notify('error', 'Error', response.data.message)
                }
            }catch(err){
                this.loading = false
                FUNCTIONS.notify('error', this.textErrorNetwork, "Gagal mendapatkan data")
            }
        },
        async getPostStatisik(){
            let url = this.urlService + this.sectionApiStatistik + '&date_start=' + this.dateRange[0] + '&date_end=' + this.dateRange[1]
            try{
                let that = this
                this.dataStatistik = []
                this.statistikdata = []
                this.loadingStatistik = true
                const response = await services.getList(url)
                this.loadingStatistik = false
                if(response.data.status == 'success'){
                    this.dataStatistik = response.data.data
                    this.createChart()
                }else{
                    this.dataStatistik = []
                    FUNCTIONS.notify('error', 'Error', response.data.message)
                }
            }catch(err){
                this.loadingStatistik = false
                FUNCTIONS.notify('error', this.textErrorNetwork, "Gagal mendapatkan data")
            }
        },
        cardOpens(){
            if(event.target.parentNode.classList.contains('showing')){
                event.target.parentNode.classList.remove('showing')
            }else{
                event.target.parentNode.classList.add('showing')
            }
        },
        createChart() {
            if(this.dataStatistik.length !== 0){
                let that = this
                let result = _(this.dataStatistik).groupBy('operator').map((v, operator) => ({
                    operator,
                    data: _(v).groupBy('name').map((vv, name) => ({
                        name,
                        data : _.groupBy(vv, 'supplier')
                    }))
                })).value()
                this.statistikdata = result

                this.statistikdata.forEach(function(e, i){
                    let dataEntriesLabel = []
                    let dataTotalNarindo = []
                    let dataTotalSakalaguna = []
                    let dataSupplier = []
                    let dataRealSupplier = []
                    var customTooltips = ''
                    let number = i
                    e.data.forEach(function(ee){
                        dataEntriesLabel.push(ee.name)
                        for (var key in ee.data) {
                            if(Object.keys(ee.data).length == 1){
                                if(key == 'narindo'){
                                    ee.data[key].forEach(function(eev){
                                        dataTotalNarindo.push(eev.total)
                                    })
                                    dataTotalSakalaguna.push(0)
                                }
                                if(key == 'sakalaguna'){
                                    ee.data[key].forEach(function(eev){
                                        dataTotalSakalaguna.push(eev.total)
                                    })
                                    dataTotalNarindo.push(0)
                                }
                            }else{
                                ee.data[key].forEach(function(eev){
                                    if(eev.supplier == 'narindo'){
                                        if(key == eev.supplier){
                                            dataTotalNarindo.push(eev.total)
                                        }
                                    }
                                    if(eev.supplier == 'sakalaguna'){
                                        if(key == eev.supplier){
                                            dataTotalSakalaguna.push(eev.total)
                                        }
                                    }
                                })
                            }
                        }
                    })
                    setTimeout(function(){
                        var ctx = document.getElementById('chart-product-status'+number)
                        var myChart = new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: dataEntriesLabel,
                                datasets: [
                                    {
                                        label: 'Narindo',
                                        data: dataTotalNarindo,
                                        fill: false,
                                        backgroundColor: '#800080',
                                        borderColor: '#36495d',
                                        borderWidth: 0
                                    },
                                    {
                                        label: 'Sakalaguna',
                                        data: dataTotalSakalaguna,
                                        fill: false,
                                        backgroundColor: '#ffcf1f',
                                        borderColor: '#36495d',
                                        borderWidth: 0
                                    }
                                ]
                            },
                            options: {
                                responsive: true,
                                lineTension: 0,
                                scales: {
                                    xAxes: [{
                                        categoryPercentage: 0.8,
                                        barPercentage: 0.7,
                                        gridLines: {
                                            display: false
                                        }
                                    }],
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true
                                        },
                                        gridLines: {
                                            display: true,
                                            drawBorder: false,
                                            borderDash: [15]
                                        }
                                    }]
                                },
                                tooltips: {
                                    enabled: true,
                                    // mode: 'index',
                                    // position: 'nearest',
                                    // custom: customTooltips
                                },
                                legend: {
                                    display: true,
                                }
                            }
                        })
                        myChart.update()
                    }, 200)
                })
            }
        },
        showingTab(value){
            let data = document.querySelectorAll('.tabbing-product-status')
            let dataMenu = document.querySelectorAll('.tab-menu-header li a')
            data.forEach(function(e){ e.classList.remove('active') })
            dataMenu.forEach(function(e){ e.classList.remove('active') })
            document.getElementById(value).classList.add('active')
            event.target.classList.add('active')
            let dataValue = (value == 'product-status-content') ? this.getPost() : this.getPostStatisik()
        }
    }
};
</script>

<style lang="scss">
.content-monitoring{
    padding: 0 8px;
    position: relative;
    .nodata{
        display: block;
        text-align: center;
        padding: 12px;
        background: #fff;
        border: 1px solid #ddd;
        font-weight: 600;
        border-radius: 4px;
    }
    .tab-menu-header{
        ul{
            list-style: none;
            padding: 0;
            margin: 0;
            margin-top: -10px;
            margin-bottom: 20px;
            li{
                display: inline-block;
                a{
                    display: block;
                    padding: 10px 12px;
                    margin-right: 10px;
                    position: relative;
                    color: #000;
                    &.active{
                        &:after{
                            content: '';
                            display: block;
                            width: 100%;
                            height: 3px;
                            background: #800080;
                            position: absolute;
                            bottom: 0;
                            left: 50%;
                            transition: all .4s ease;
                            transform: translate(-50%);
                        }
                    }
                }
            }
        }
    }
    .tabbing-product-status{
        display: none;
        &.active{
            display: block;
        }
    }
    .content-chart{
        position: relative;
    }
    #chartjs-tooltip{
        table{
            padding: 0;
            margin: 0;
            tr{
                td, th{
                    padding: 5px 10px;
                    border: 0;
                }
            }
        }
    }
    .cards{
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 4px;
        padding-bottom: 0;
        &:last-child{
            margin-bottom: 0;
        }
        h4{
            font-size: 14px;
            margin-top: -15px;
            padding: 15px;
            margin-left: -15px;
            margin-right: -15px;
            background: #f6f8fa;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            margin-bottom: 0;
            cursor: pointer;
            .fontIcons{
                &.down{
                    float: right;
                    margin-right: 5px;
                    font-size: 18px;
                    transition: all .3s ease;
                }
            }
        }
        &.showing{
            .datamonitoring{
                visibility: visible;
                max-height: 350px;
                opacity: 1;
            }
            h4{
                border-bottom: 1px solid #DFE4E8;
                .fontIcons{
                    &.down{
                        transform: scaleY(-1);
                    }
                }
            }
        }
        .datamonitoring{
            overflow: auto;
            margin-left: -15px;
            margin-right: -15px;
            padding: 0 15px;
            visibility: hidden;
            max-height: 0;
            transition: all .3s ease;
            transition-delay: .1s;
            opacity: 0;
        }
        table{
            width: 100%;
            border: 1px solid #DFE4E8;
            margin: 15px 0;
            tr{
                th{
                    background: #f6f8fa;
                    border-top: 1px solid #DFE4E8;
                    border-bottom: 1px solid #DFE4E8;
                    padding: 10px 12px;
                    &.first-cell{
                        width: 30%;
                        border-left: 1px solid #DFE4E8;
                    }
                    &:last-child{
                        border-right: 1px solid #DFE4E8;
                    }
                }
                td{
                    padding: 10px 12px;
                    border-bottom: 1px solid #DFE4E8;
                    span{
                        &.badge{
                            text-transform: capitalize;
                        }
                    }
                }
            }
        }
    }
}
canvas{
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}
#chartjs-tooltip {
    opacity: 1;
    position: absolute;
    background: #fff;
    color: #000;
    box-shadow: 0 7px 15px rgba(0, 0, 0, .12);
    border-radius: 3px;
    border: 1px solid #eee;
    -webkit-transition: all .1s ease;
    transition: all .1s ease;
    pointer-events: none;
    -webkit-transform: translate(-50%, 0);
    transform: translate(-50%, 0);
    padding: 10px;
    width: 15%;
}
.chartjs-tooltip-key {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 10px;
}
</style>
