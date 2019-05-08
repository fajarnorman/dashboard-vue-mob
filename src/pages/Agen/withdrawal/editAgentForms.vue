<template>
    <div id="dataAgentFormsEdit" style="position: relative;">
        <!-- <pre>{{itemsData}}</pre> -->
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="Email">
                    <div v-if="itemsData.email != null">{{itemsData.email}}</div>
                    <div v-else>-</div>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="Nama Lengkap">
                    <div v-if="itemsData.fullname != null">{{itemsData.fullname}}</div>
                    <div v-else>-</div>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="Username">
                    <div v-if="itemsData.username != null">{{itemsData.username}}</div>
                    <div v-else>-</div>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="Nomor Telepon">
                    <div v-if="itemsData.phone_number != ''">{{itemsData.phone_number}}</div>
                    <div v-else>-</div>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="Lokasi Cashout Point">
                    <div v-if="itemsData.agent_location" style="line-height: normal;">
                        {{dataFormsEdit.address}}
                    </div>
                    <el-button round class="button-white-green" style="margin-top: 15px;" @click="openLocations()">Edit Lokasi</el-button>
                </el-form-item>
            </el-col>
        </el-row>
        <el-dialog
            title="Cari Lokasi"
            :visible.sync="dialogMaps"
            width="65%"
            top="5vh"
            :modal-append-to-body="false"
            class="mb-dialog nopadding-right point-modal kepala-regional">
            <div class="content-dialog detail-pencapaian">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix" style="width: 350px;">
                        <div class="el-input">
                            <input type="text" class="el-input__inner" id="pac-input" placeholder="Search Place">
                        </div>
                        <img src='~assets/images/icons/search1.png'>
                    </div>
                    <el-button @click="setLocation()" style="margin-top: 3px;" round id="setLocations" type="button" class="button-white-green float-right"><i class="icon-arrow-up13"></i> Tentukan Lokasi Disini </el-button>
                </div>
                <div class="mapsAgentCashout" id="maps"></div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: ['iddata'],
        data(){
            return{
                apiURL: process.env.ROOT_API,
                sectionApi: 'cashoutpoint',
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

                dataFormsEdit:{
                    userid: '',
                    latitude: '',
                    longitude: '',
                    address: '',
                }
            }
        },
        methods: {
            buildUrl(){
                return this.apiURL + this.sectionApi + '/' + this.iddata
            },

            getPostCashoutPoint(){
                let url = this.buildUrl()
                this.loadingSelect = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemsData = response.data.data
                        this.agent_latitude = this.itemsData.agent_location.latitude
                        this.agent_longitude = this.itemsData.agent_location.longitude

                        this.dataFormsEdit.userid = this.itemsData.id
                        this.dataFormsEdit.latitude = this.itemsData.agent_location.latitude
                        this.dataFormsEdit.longitude = this.itemsData.agent_location.longitude
                        this.dataFormsEdit.address = this.itemsData.agent_location.address
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
            },

            openLocations(index){
                this.dialogMaps = true
                let that = this
                setTimeout(function(){ that.initMap() }, 500)
            },

            // addField(){
            // //     this.agentForms.push({
            // //         userDataId: '',
            // //         latituteData: '',
            // //         longituteData: '',
            // //         addressData: '',
            // //         dataUser: ''
            // //     })
            // //     this.getPostUser(this.agentForms.length - 1)
            // },

            // removeField(array) {
            //     this.agentForms.splice(array, 1);
            //     // console.log(array)
            // },

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

                this.dataFormsEdit.userid = this.itemsData.id
                this.dataFormsEdit.latitude = agent_latitude
                this.dataFormsEdit.longitude = agent_longitude
                this.dataFormsEdit.address = agent_address

                this.dialogMaps = false  
            },
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
