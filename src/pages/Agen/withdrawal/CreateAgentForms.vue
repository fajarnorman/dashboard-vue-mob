<template>
    <div id="dataAgentForms" style="position: relative;">
        <el-button round class="button-white-green" @click="addField()" style="position: absolute;top: -43px;right: 0;">
            <i class="icon-plus3"></i>
        </el-button>
        <!-- <a href="#" @click.prevent="setArray()">TestArray</a> -->
        <div class="itemsDataCashoutPoint">
            <div class="items-data-cashoutPoint" v-for="(dataAgent, IndexAgents) in agentForms" :key="IndexAgents">
                <div class="items-list">
                    <span>Agen</span>
                    <el-select 
                        filterable 
                        remote
                        reserve-keyword
                        v-model="dataAgent.userDataId" 
                        placeholder="Select"
                        @focus="setIndexAgent(IndexAgents, 'focus')"
                        @blur="setIndexAgent(IndexAgents, 'blur')"
                        :remote-method="getPostUserbyAutocomplete"
                        :loading="loadingSelect">
                        <el-option
                            v-for="(dataUser, indexUser) in dataAgent.dataUser"
                            :key="indexUser"
                            :label="dataUser.fullname"
                            :value="dataUser.id">
                            <span>{{ dataUser.fullname }} ({{dataUser.username}})</span>
                        </el-option>
                    </el-select>
                </div>
                <div class="items-list">
                    <span>Lokasi</span>
                    <p>{{dataAgent.addressData}}</p>
                    <el-button round class="button-white-green" @click="openLocations(IndexAgents)">Set Lokasi</el-button>
                </div>
                <div class="items-list">
                    <a href="#" class="button-white-green" @click.prevent="removeField(IndexAgents)"><img src="~assets/images/icons/big-close.png" alt=""></a>
                </div>
            </div>
        </div>
        <!-- <pre>{{agentForms}}</pre> -->
        <el-dialog
            title="Cari Lokasi"
            :visible.sync="dialogMaps"
            width="65%"
            top="5vh"
            :modal-append-to-body="false"
            class="mb-dialog nopadding-right point-modal kepala-regional">
            <div class="content-dialog detail-pencapaian">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix">
                        <div class="el-input">
                            <input type="text" class="el-input__inner" id="pac-input" placeholder="Search Place">
                        </div>
                        <img src='~assets/images/icons/search1.png'>
                    </div>
                    <el-button @click="setLocation(indexAgent)" style="margin-top: 3px;" round id="setLocations" type="button" class="button-white-green float-right"><i class="icon-arrow-up13"></i> Tentukan Lokasi Disini </el-button>
                </div>
                <div class="mapsAgentCashout" id="maps"></div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                apiURL: process.env.ROOT_API,
                sectionApi: 'user',
                itemsData: [],
                
                agentForms: [],

                loadingSelect: false,

                dialogMaps: false,

                // for Init Maps
                icon_url: require('assets/images/marker-green.png'),
                marker: '',
                map: '',
                infowindow: '',
                geocoder: '',
                location_name: '',
                agent_latitude: '-6.121435',
                agent_longitude: '106.774124',
                agent_address: '',
                parent_class_active: '',
                section_index: 1,
                indexAgent: '',

                agentObjectnum: '',
            }
        },
        watch:{
            
        },
        methods: {
            buildUrl(search){
                return this.apiURL + this.sectionApi + '?limit=100&search=' + search + '&direction=ASC&order=fullname&type=not_cashout_point'
            },

            getPostUser(index){
                let url = this.buildUrl('')
                this.loadingSelect = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemsData = response.data.data
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.loadingSelect = false
                    this.agentForms[index].dataUser = this.itemsData
                })
            },

            getPostUserbyAutocomplete(search){
                let url = this.buildUrl(search)
                this.loadingSelect = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemsData = response.data.data
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => {
                    this.loadingSelect = false
                    this.agentForms[this.agentObjectnum].dataUser = this.itemsData
                })
            },

            openLocations(index){
                this.dialogMaps = true
                let that = this
                this.indexAgent = index
                setTimeout(function(){ that.initMap() }, 500)
            },

            addField(){
                this.agentForms.push({
                    userDataId: '',
                    latituteData: '',
                    longituteData: '',
                    addressData: '',
                    dataUser: ''
                })
                this.getPostUser(this.agentForms.length - 1)
            },

            removeField(array) {
                this.agentForms.splice(array, 1);
                // console.log(array)
            },

            initMap(){
                let that = this
                this.map = ''

                var centerLatLng = { 
                    lat: parseFloat(this.agent_latitude), 
                    lng: parseFloat(this.agent_longitude) 
                };

                this.geocoder = new google.maps.Geocoder;

                this.infowindow = new google.maps.InfoWindow({
                    maxWidth: 300
                });

                this.map = new google.maps.Map(document.getElementById('maps'), {
                    center: centerLatLng,
                    zoom: 13,
                    mapTypeId: 'roadmap',
                    // disableDefaultUI: true,
                    // mapTypeId: google.maps.MapTypeId.ROADMAP, 
                    gestureHandling: 'greedy',
                });

                // Create the search box and link it to the UI section.
                var input = document.getElementById('pac-input');
                var searchBox = new google.maps.places.SearchBox(input);
                // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

                // Bias the SearchBox results towards current map's viewport.
                this.map.addListener('bounds_changed', function() {
                    searchBox.setBounds(that.map.getBounds());
                });

                this.createMarker(this.map.getCenter());

                // Listen for the event fired when the user selects a prediction and retrieve
                // more details for that place.
                searchBox.addListener('places_changed', function() {
                    var places = searchBox.getPlaces();

                    if (places.length == 0) {
                        return;
                    }

                    // Clear out the old marker.
                    that.marker.setMap(null);
                    that.marker = null;

                    // For each place, get the icon, name and location.
                    var bounds = new google.maps.LatLngBounds();
                    places.forEach(function(place) {
                        if (!place.geometry) {
                            console.log("Returned place contains no geometry");
                            return;
                        } 

                        that.createMarker(place.geometry.location);

                        if (place.geometry.viewport) {
                            // Only geocodes have viewport.
                            bounds.union(place.geometry.viewport);
                        } else {
                            bounds.extend(place.geometry.location);
                        }
                    });
                    that.map.fitBounds(bounds);
                });            
            },

            createMarker(position){
                // Create a marker for each place.
                this.marker = new google.maps.Marker({
                    map: this.map,
                    icon: this.icon_url,
                    // title: place.name,
                    position: position,
                    draggable:true,
                    // animation: google.maps.Animation.DROP,
                }); 

                this.setInfo();
                let that = this
                this.marker.addListener('dragend', function(event){
                    that.setInfo();
                });
            },

            setInfo(){
                var lat = this.marker.getPosition().lat();
                var lng = this.marker.getPosition().lng();

                let that = this
                this.geocoder.geocode({'location': this.marker.getPosition()}, function(results, status) {
                    if (status === 'OK') {
                        if (results[0]) {
                            that.location_name = results[0].formatted_address;
                            var description="";
                            description+="<div class='iw-label'>";
                                description+="<b>Posisi : </b>"+lat+", "+lng;
                            description+="</div>";
                            description+="<div class='iw-label'>";
                                description+="<b>Alamat : </b>"+that.location_name;
                            description+="</div>";

                            // description+="<div class='iw-label text-center'>";
                            //     description+='<button id="setLocations" type="button" class="btn btn-primary btn-sm"><i class="icon-arrow-up13"></i> Tentukan Lokasi Disini </button>';
                            // description+="</div>";
                            that.infowindow.setContent(description);
                            that.infowindow.open(that.map,that.marker);
                        }
                    }
                });
            },

            setLocation(valueIndex){
                let agent_latitude = this.marker.getPosition().lat();
                let agent_longitude = this.marker.getPosition().lng();
                let agent_address = this.location_name;

                this.agentForms[valueIndex].latituteData = agent_latitude
                this.agentForms[valueIndex].longituteData = agent_longitude
                this.agentForms[valueIndex].addressData = agent_address

                this.dialogMaps = false  
            },

            setArray(){
                let agentId = []
                let latitute = []
                let longitute = []
                let address = []
                this.agentForms.forEach(function(element){
                    agentId.push(element.userDataId)
                    latitute.push(element.latituteData)
                    longitute.push(element.longituteData)
                    address.push(element.addressData)
                })

                console.log(agentId)
                console.log(latitute)
                console.log(longitute)
                console.log(address)
            },

            setIndexAgent(value, type){
                if(type == 'blur'){
                    this.agentObjectnum = ''
                }else{
                    this.agentObjectnum = value
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .forms-details{
        button{
            span{
                .icon-plus3{
                    &:before{
                        left: 0;
                        margin-right: 0;
                    }
                }
            }
        }
    }
    .items-data-cashoutPoint{
        border-top: 1px solid #DFE4E8;
        // border-bottom: 1px solid #DFE4E8;
        margin: 10px 0;
        padding: 10px 0;
        position: relative;
        &:first-child{
            border-top: 0;
            margin-top: 0;
            padding-top: 0;
        }
        .items-list{
            display: inline-block;
            vertical-align: top;
            &>span{
                display: block;
                margin-bottom: 10px;
            }
            &:first-child,
            &:nth-last-child(2){
                width: 40%;
            }
            a{
                position: absolute;
                top: 43px;
                right: 25px;
            }
        }
    }
    .mapsAgentCashout{
        width:100%;
        height: 400px;
        display: block;
    }
</style>
