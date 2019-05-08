<template>
    <div class="content-wrapper">
        <div id="detail-userupgraderequest">
            <div class="page-header">
                <div class="page-header-content clearfix">
                    <router-link v-bind:to="'/users/upgradeRequestList'" class="back-button">
                        <i class="icon icon-caret-left"></i> Back to List
                    </router-link>
                    <div class="page-title clearfix">
                        <h4 class="float-left">User Upgrade Request</h4>
                    </div>
                </div>
            </div>
            <div class="content">
                <section v-if="errored">
                    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
                </section>
                <section v-else>
                    <!-- <pre>{{itemsData}}</pre> -->
                    <div>
                        <h4 style="color: #39434e;">
                            Upgrade Info Request
                            <span v-if="(itemsData.status == 'verified')" class="badge inline success">{{itemsData.status}}</span>
                            <span v-else-if="(itemsData.status == 'waiting')" class="badge inline pending">{{itemsData.status}}</span>
                            <span v-else-if="(itemsData.status == 'rejected')" class="badge inline failed">{{itemsData.status}}</span>
                        </h4>
                        <div class="mutasi-point general-info" style="position: relative;">
                            <div class="el-loading-mask" v-show="(loading == true)">
                                <div class="el-loading-spinner">
                                    <svg viewBox="25 25 50 50" class="circular">
                                        <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                                    </svg>
                                </div>
                            </div>
                            <el-row :gutter="20">
                                <el-col :span="8" :xs="24" class="item-general-info">
                                    <h5>User</h5>
                                    <span v-if="itemsData.user">{{itemsData.user.fullname}} ({{itemsData.user.username}})</span>
                                </el-col>
                                <el-col :span="8" :xs="24" class="item-general-info">
                                    <h5>No identity</h5>
                                    {{itemsData.identity_number}}
                                </el-col>
                                <el-col :span="8" :xs="24" class="item-general-info">
                                    <h5>Full Name</h5>
                                    <span>{{itemsData.fullname}}</span>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="8" :xs="24" class="item-general-info">
                                    <h5>Email</h5>
                                    <span v-if="itemsData.user">{{itemsData.user.email}}</span>
                                </el-col>
                                <el-col :span="8" :xs="24" class="item-general-info">
                                    <h5>Phone Number</h5>
                                    <span v-if="itemsData.user">{{itemsData.user.phone_number}}</span>
                                </el-col>
                                <el-col :span="8" :xs="24" class="item-general-info">
                                    <h5>Date</h5>
                                    <span v-if="itemsData.user">{{itemsData.created_at}}</span>
                                </el-col>
                            </el-row>
                        </div>
                        <el-row :gutter="20" style="position: relative;">
                            <div class="el-loading-mask" v-show="(loading == true)">
                                <div class="el-loading-spinner">
                                    <svg viewBox="25 25 50 50" class="circular">
                                        <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                                    </svg>
                                </div>
                            </div>
                            <el-col :span="12" :xs="24">
                                <div class="items-head-agent">
                                    <div class="items-head clearfix">
                                        <div class="cards">
                                            <h3 class="title">File Info</h3>
                                            <el-form ref="forms-upgradeGambar" class="forms-upgradeGambar" label-width="120px">
                                                <el-form-item label="Foto Identitas">
                                                    <a @click.prevent="openImage(itemsData.photo_identity_url)" :href="itemsData.photo_identity_url" class="photo-thumb">
                                                        <img :src="itemsData.photo_identity_url">
                                                    </a>
                                                </el-form-item>
                                                <el-form-item label="Foto Diri">
                                                    <a  @click.prevent="openImage(itemsData.photo_face_url)" :href="itemsData.photo_face_url" class="photo-thumb">
                                                        <img :src="itemsData.photo_face_url">
                                                    </a>
                                                </el-form-item>
                                                <el-form-item label="Foto Tanda Tangan">
                                                    <a  @click.prevent="openImage(itemsData.photo_signature_url+itemsData.photo_signature)" :href="itemsData.photo_signature_url+itemsData.photo_signature" class="photo-thumb">
                                                        <img :src="itemsData.photo_signature_url+itemsData.photo_signature">
                                                    </a>
                                                </el-form-item>
                                            </el-form>
                                        </div>
                                    </div>
                                 </div>
                            </el-col>
                            <el-col :span="12" :xs="24">
                                 <div class="items-head-agent">
                                    <div class="items-head clearfix">
                                        <div class="cards">
                                            <h3 class="title">
                                                Verification Info
                                                <span v-if="(itemsData.status == 'verified')" class="badge inline success float-right">{{itemsData.status}}</span>
                                                <span v-else-if="(itemsData.status == 'waiting')" class="badge inline pending float-right">{{itemsData.status}}</span>
                                                <span v-else-if="(itemsData.status == 'rejected')" class="badge inline failed float-right">{{itemsData.status}}</span>
                                            </h3>
                                            <div v-if="itemsData.status == 'rejected'">
                                                <el-form 
                                                    ref="forms-upgradeInfo" 
                                                    class="forms-upgradeInfo" 
                                                    label-width="120px">
                                                    <el-form-item label="Rejected at">
                                                        {{itemsData.updated_at}}
                                                    </el-form-item>
                                                    <el-form-item label="Rejected by">
                                                        <span v-if="itemsData.user_updated">{{itemsData.user_updated.fullname}}</span>
                                                    </el-form-item>
                                                    <el-form-item label="Reason">
                                                        <p style="line-height: 1.5;">{{itemsData.reason}}</p>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                            <div v-else-if="itemsData.status == 'verified'">
                                                <el-form 
                                                    ref="forms-upgradeInfo" 
                                                    class="forms-upgradeInfo clearfix" 
                                                    label-width="120px" v-if="formsEdit == false">
                                                    <el-row :gutter="20" class="info-upgrade-akun" v-if="itemsData.user_idcard">
                                                        <el-col :span="12">
                                                            <el-form-item label="Tipe Identitas">
                                                                <div v-if="itemsData.user_idcard">{{itemsData.user_idcard.identity_type}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <div v-if="itemsData.user_idcard.identity_type == 'kk'">
                                                            <el-col :span="12">
                                                                <el-form-item label="No Kartu Keluarga">
                                                                    <div>{{itemsData.user_idcard.no_kk}}</div>
                                                                </el-form-item>
                                                            </el-col>
                                                        </div>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nama Alias">
                                                                <div v-if="itemsData.user_idcard">{{itemsData.user_idcard.aliasname}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Alamat Tempat Tinggal">
                                                                <div v-if="itemsData.user_idcard" style="line-height:normal;">{{itemsData.user_idcard.address}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Tempat/Tgl Lahir">
                                                                <div v-if="itemsData.user_idcard">
                                                                    {{itemsData.user_idcard.birthplace}}, {{itemsData.user_idcard.birthday}}
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kewarganegaraan">
                                                                <div v-if="itemsData.user_idcard">{{itemsData.user_idcard.citizenship}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Nomor Telepon">
                                                                <div v-if="itemsData.user_idcard">{{itemsData.user_idcard.phone_number}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Pekerjaan">
                                                                <div v-if="itemsData.user_idcard">{{itemsData.user_idcard.job}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kota">
                                                                <div v-if="itemsData.user_idcard.kota !== null">{{itemsData.user_idcard.kota}}</div>
                                                                <div v-else>-</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="RT/RW">
                                                                <div v-if="itemsData.user_idcard">{{itemsData.user_idcard.rt}}/{{itemsData.user_idcard.rw}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kecamatan">
                                                                <div v-if="itemsData.user_idcard.kecamatan !== null">{{itemsData.user_idcard.kecamatan}}</div>
                                                                <div v-else>-</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kelurahan">
                                                                <div v-if="itemsData.user_idcard.kelurahan !== null">{{itemsData.user_idcard.kelurahan}}</div>
                                                                <div v-else>-</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Desa">
                                                                <div v-if="itemsData.user_idcard.desa !== null">{{itemsData.user_idcard.desa}}</div>
                                                                <div v-else>-</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Provinsi">
                                                                <div v-if="itemsData.user_idcard.provinsi !== null">{{itemsData.user_idcard.provinsi}}</div>
                                                                <div v-else>-</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Agama">
                                                                <div v-if="itemsData.user_idcard">
                                                                    <span v-if="itemsData.user_idcard.agama !== null">{{itemsData.user_idcard.agama}}</span>
                                                                    <span v-else>-</span>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12" v-if="itemsData.user_idcard">
                                                            <el-form-item label="Golongan Darah" v-if="itemsData.user_idcard.golongan_darah !== null">
                                                                <div>{{itemsData.user_idcard.golongan_darah}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Status Perkawinan">
                                                                <div v-if="itemsData.user_idcard">
                                                                    <span v-if="itemsData.user_idcard.status_perkawinan !== null">{{itemsData.user_idcard.status_perkawinan}}</span>
                                                                    <span v-else>-</span>
                                                                </div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Jenis Kelamin">
                                                                <div v-if="itemsData.user_idcard">{{itemsData.user_idcard.gender}}</div>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Umur">
                                                                <div v-if="itemsData.user_idcard">{{itemsData.user_idcard.age}} Tahun</div>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                    <div class="border-bottom">
                                                        <el-form-item label="Verified at">
                                                            <div v-if="itemsData.updated_at">{{itemsData.updated_at}}</div>
                                                        </el-form-item>
                                                        <el-form-item label="Verified by">
                                                            <div v-if="itemsData.user_updated">{{itemsData.user_updated.fullname}}</div>
                                                        </el-form-item>
                                                    </div>
                                                    <div class="actions-buttons float-right">
                                                        <el-button @click.prevent="formsEdit = true" class="button-outline-green" round>Edit</el-button>
                                                    </div>
                                                </el-form>
                                                <el-form 
                                                    ref="forms-upgradeInfo" 
                                                    class="forms-upgradeInfo forms-details clearfix" 
                                                    label-width="120px"
                                                    :model="forms"
                                                    status-icon 
                                                    :rules="rules2"
                                                    v-else>
                                                    <el-form-item label="Tipe Identitas">
                                                        <el-radio-group v-model="forms.identity_type ">
                                                            <el-radio label="ktp">KTP</el-radio>
                                                            <el-radio label="sim">SIM</el-radio>
                                                            <el-radio label="kk">KK</el-radio>
                                                        </el-radio-group>
                                                    </el-form-item>
                                                    <el-form-item label="No Kartu Keluarga" v-if="forms.identity_type == 'kk'">
                                                        <el-input v-model="forms.no_kk"></el-input>
                                                    </el-form-item>
                                                    <el-form-item label="Nama Alias" prop="alias">
                                                        <el-input v-model="forms.alias"></el-input>
                                                    </el-form-item>
                                                    <el-form-item label="Alamat Tempat Tinggal" prop="address">
                                                        <el-input type="textarea" rows="5" v-model="forms.address"></el-input>
                                                    </el-form-item>
                                                    <el-form-item label="Tempat Lahir" prop="birthplace">
                                                        <el-input v-model="forms.birthplace"></el-input>
                                                    </el-form-item>
                                                    <el-form-item label="Tanggal Lahir" prop="birthday">
                                                        <el-date-picker v-model="forms.birthday" type="date" format="yyyy-MM-d"></el-date-picker>
                                                    </el-form-item>
                                                    <el-form-item label="Kewarganegaraan" prop="citizenship">
                                                        <el-input v-model="forms.citizenship"></el-input>
                                                    </el-form-item>
                                                    <el-form-item label="Pekerjaan" prop="job">
                                                        <el-input v-model="forms.job"></el-input>
                                                    </el-form-item>
                                                    <el-form-item label="Jenis Kelamin" prop="gender">
                                                        <el-radio-group v-model="forms.gender">
                                                            <el-radio label="Laki-Laki">Laki-Laki</el-radio>
                                                            <el-radio label="Perempuan">Perempuan</el-radio>
                                                        </el-radio-group>
                                                    </el-form-item>
                                                    <el-row :gutter="20">
                                                        <el-col :span="12">
                                                            <el-form-item label="RT">
                                                                <el-input v-model="forms.rt"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="RW">
                                                                <el-input v-model="forms.rw"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kelurahan">
                                                                <el-input v-model="forms.kelurahan"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kecamatan">
                                                                <el-input v-model="forms.kecamatan"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Kota">
                                                                <el-input v-model="forms.kota"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Desa">
                                                                <el-input v-model="forms.desa"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Provinsi">
                                                                <el-input v-model="forms.provinsi"></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Agama">
                                                                <el-select v-model="forms.agama">
                                                                    <el-option label="Pilih Agama" value="">Pilih Agama</el-option>
                                                                    <el-option label="-" value="-">-</el-option>
                                                                    <el-option label="Islam" value="Islam">Islam</el-option>
                                                                    <el-option label="Kristen" value="Kristen">Kristen</el-option>
                                                                    <el-option label="Hindu" value="Hindu">Hindu</el-option>
                                                                    <el-option label="Budha" value="Budha">Budha</el-option>
                                                                    <el-option label="Katolik" value="Katolik">Katolik</el-option>
                                                                    <el-option label="Konghucu" value="Konghucu">Konghucu</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Status Perkawinan">
                                                                <el-select v-model="forms.statusKawin">
                                                                    <el-option label="Pilih Status Perkawinan" value="">Pilih Status Perkawinan</el-option>
                                                                    <el-option label="-" value="-">-</el-option>
                                                                    <el-option label="Belum Kawin" value="Belum Kawin">Belum Kawin</el-option>
                                                                    <el-option label="Kawin" value="Kawin">Kawin</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="12">
                                                            <el-form-item label="Golongan Darah">
                                                                <el-select v-model="forms.golDarah" placeholder="Select">
                                                                    <el-option label="Pilih Golongan Darah" value="">Pilih Golongan Darah</el-option>
                                                                    <el-option label="-" value="-">-</el-option>
                                                                    <el-option label="A" value="A">A</el-option>
                                                                    <el-option label="B" value="B">B</el-option>
                                                                    <el-option label="O" value="O">O</el-option>
                                                                    <el-option label="AB" value="AB">AB</el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                    </el-row>
                                                    <div class="actions-buttons float-right">
                                                        <el-button @click.prevent="formsEdit = false" class="button-outline-green" round>Cancel</el-button>
                                                        <el-button @click.prevent="submitUserUpgrade('forms-upgradeInfo')" id="submit-edit" class="button-white-green" round>
                                                            <font-awesome-icon class="fontIcons" :icon="fontsIcons.check" v-if="loadingButtonAccept == false" />
                                                            <div v-html="loadingButtonHTML" v-if="loadingButtonAccept == true" class="loading"></div> Submit
                                                        </el-button>
                                                    </div>
                                                </el-form>
                                            </div>
                                            <div v-else-if="itemsData.status == 'waiting'">
                                                <div class="status-change clearfix" v-if="$dataRole['users.upgraderequestedit']">
                                                    <transition name="fade">
                                                        <el-form 
                                                            ref="forms-upgradeInfo" 
                                                            class="forms-upgradeInfo forms-details" 
                                                            label-width="120px"
                                                            :model="forms"
                                                            status-icon 
                                                            :rules="rules2"
                                                            v-if="forms.status == 'verified'">
                                                            <el-form-item label="Tipe Identitas">
                                                                <el-radio-group v-model="forms.identity_type ">
                                                                    <el-radio label="ktp">KTP</el-radio>
                                                                    <el-radio label="sim">SIM</el-radio>
                                                                    <el-radio label="kk">KK</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                            <el-form-item label="No Kartu Keluarga" v-if="forms.identity_type == 'kk'">
                                                                <el-input v-model="forms.no_kk"></el-input>
                                                            </el-form-item>
                                                            <el-form-item label="Nama Alias" prop="alias">
                                                                <el-input v-model="forms.alias"></el-input>
                                                            </el-form-item>
                                                            <el-form-item label="Alamat Tempat Tinggal" prop="address">
                                                                <el-input type="textarea" rows="5" v-model="forms.address"></el-input>
                                                            </el-form-item>
                                                            <el-form-item label="Tempat Lahir" prop="birthplace">
                                                                <el-input v-model="forms.birthplace"></el-input>
                                                            </el-form-item>
                                                            <el-form-item label="Tanggal Lahir" prop="birthday">
                                                                <el-date-picker v-model="forms.birthday" type="date" format="yyyy-MM-d"></el-date-picker>
                                                            </el-form-item>
                                                            <el-form-item label="Kewarganegaraan" prop="citizenship">
                                                                <el-input v-model="forms.citizenship"></el-input>
                                                            </el-form-item>
                                                            <el-form-item label="Pekerjaan" prop="job">
                                                                <el-input v-model="forms.job"></el-input>
                                                            </el-form-item>
                                                            <el-form-item label="Jenis Kelamin" prop="gender">
                                                                <el-radio-group v-model="forms.gender">
                                                                    <el-radio label="Laki-Laki">Laki-Laki</el-radio>
                                                                    <el-radio label="Perempuan">Perempuan</el-radio>
                                                                </el-radio-group>
                                                            </el-form-item>
                                                            <el-row :gutter="20">
                                                                <el-col :span="12">
                                                                    <el-form-item label="RT">
                                                                        <el-input v-model="forms.rt"></el-input>
                                                                    </el-form-item>
                                                                </el-col>
                                                                <el-col :span="12">
                                                                    <el-form-item label="RW">
                                                                        <el-input v-model="forms.rw"></el-input>
                                                                    </el-form-item>
                                                                </el-col>
                                                                <el-col :span="12">
                                                                    <el-form-item label="Kelurahan">
                                                                        <el-input v-model="forms.kelurahan"></el-input>
                                                                    </el-form-item>
                                                                </el-col>
                                                                <el-col :span="12">
                                                                    <el-form-item label="Kecamatan">
                                                                        <el-input v-model="forms.kecamatan"></el-input>
                                                                    </el-form-item>
                                                                </el-col>
                                                                <el-col :span="12">
                                                                    <el-form-item label="Kota">
                                                                        <el-input v-model="forms.kota"></el-input>
                                                                    </el-form-item>
                                                                </el-col>
                                                                <el-col :span="12">
                                                                    <el-form-item label="Desa">
                                                                        <el-input v-model="forms.desa"></el-input>
                                                                    </el-form-item>
                                                                </el-col>
                                                                <el-col :span="12">
                                                                    <el-form-item label="Provinsi">
                                                                        <el-input v-model="forms.provinsi"></el-input>
                                                                    </el-form-item>
                                                                </el-col>
                                                                <el-col :span="12">
                                                                    <el-form-item label="Agama">
                                                                        <el-select v-model="forms.agama">
                                                                            <el-option label="Pilih Agama" value="">Pilih Agama</el-option>
                                                                            <el-option label="-" value="-">-</el-option>
                                                                            <el-option label="Islam" value="Islam">Islam</el-option>
                                                                            <el-option label="Kristen" value="Kristen">Kristen</el-option>
                                                                            <el-option label="Hindu" value="Hindu">Hindu</el-option>
                                                                            <el-option label="Budha" value="Budha">Budha</el-option>
                                                                            <el-option label="Katolik" value="Katolik">Katolik</el-option>
                                                                            <el-option label="Konghucu" value="Konghucu">Konghucu</el-option>
                                                                        </el-select>
                                                                    </el-form-item>
                                                                </el-col>
                                                                <el-col :span="12">
                                                                    <el-form-item label="Status Perkawinan">
                                                                        <el-select v-model="forms.statusKawin">
                                                                            <el-option label="Pilih Status Perkawinan" value="">Pilih Status Perkawinan</el-option>
                                                                            <el-option label="-" value="-">-</el-option>
                                                                            <el-option label="Belum Kawin" value="Belum Kawin">Belum Kawin</el-option>
                                                                            <el-option label="Kawin" value="Kawin">Kawin</el-option>
                                                                        </el-select>
                                                                    </el-form-item>
                                                                </el-col>
                                                                <el-col :span="12">
                                                                    <el-form-item label="Golongan Darah">
                                                                        <el-select v-model="forms.golDarah" placeholder="Select">
                                                                            <el-option label="Pilih Golongan Darah" value="">Pilih Golongan Darah</el-option>
                                                                            <el-option label="-" value="-">-</el-option>
                                                                            <el-option label="A" value="A">A</el-option>
                                                                            <el-option label="B" value="B">B</el-option>
                                                                            <el-option label="O" value="O">O</el-option>
                                                                            <el-option label="AB" value="AB">AB</el-option>
                                                                        </el-select>
                                                                    </el-form-item>
                                                                </el-col>
                                                            </el-row>
                                                            <div class="actions-buttons float-right">
                                                                <el-button @click.prevent="userUpgrade('')" class="button-outline-green" round>Cancel</el-button>
                                                                <el-button @click.prevent="submitUserUpgrade('forms-upgradeInfo')" id="submit" class="button-white-green" round>
                                                                    <font-awesome-icon class="fontIcons" :icon="fontsIcons.check" v-if="loadingButtonAccept == false" />
                                                                    <div v-html="loadingButtonHTML" v-if="loadingButtonAccept == true" class="loading"></div> Submit
                                                                </el-button>
                                                            </div>
                                                        </el-form>
                                                        <el-form 
                                                            ref="forms-upgradeInfoReject" 
                                                            class="forms-upgradeInfo forms-details" 
                                                            label-width="120px"
                                                            :model="forms"
                                                            status-icon 
                                                            :rules="rules2" v-else-if="forms.status == 'rejected'">
                                                            <el-form-item label="Reason" prop="reason">
                                                                <el-input type="textarea" rows="5" v-model="forms.reason"></el-input>
                                                            </el-form-item>
                                                            <div class="actions-buttons float-right">
                                                                <el-button @click.prevent="userUpgrade('')" class="button-outline-green" round>Cancel</el-button>
                                                                <el-button @click.prevent="submitUserUpgrade('forms-upgradeInfoReject')" id="submit-reject" class="button-white-green" round>
                                                                    <font-awesome-icon class="fontIcons" :icon="fontsIcons.check" v-if="loadingButtonReject == false" />
                                                                    <div v-html="loadingButtonHTML" v-if="loadingButtonReject == true" class="loading"></div> Submit
                                                                </el-button>
                                                            </div>
                                                        </el-form>
                                                    </transition>
                                                    <div class="actions-buttons float-right" v-if="forms.status == ''">
                                                        <el-button @click.prevent="userUpgrade('rejected')" id="reject" class="button-outline-red" round>
                                                            <font-awesome-icon class="fontIcons" :icon="fontsIcons.close" v-if="loadingButtonReject == false" />
                                                            <div v-html="loadingButtonHTML" v-if="loadingButtonReject == true" class="loading"></div> Reject
                                                        </el-button>
                                                        <el-button @click.prevent="userUpgrade('verified')" id="accept" class="button-white-green" round>
                                                            <font-awesome-icon class="fontIcons" :icon="fontsIcons.check" v-if="loadingButtonAccept == false" />
                                                            <div v-html="loadingButtonHTML" v-if="loadingButtonAccept == true" class="loading"></div> Accept
                                                        </el-button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                 </div>
                            </el-col>
                        </el-row>
                    </div>
                    <el-dialog title=""
                        class="imageOpenModal"
                        top="5vh"
                        :visible.sync="imageOpen">
                        <div class="img-container">
                            <img :src="imageValue" class="images-must-rotate">
                        </div>
                        <div class="bottom-actions-modal">
                            <el-button class="button-white-green button-rotate" @click.prevent="rotateImages" round>
                                Rotate
                                <font-awesome-icon class="fontIcons" :icon="fontsIcons.rotate"/>
                            </el-button>
                        </div>
                    </el-dialog>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import JQuery from 'jquery'
    import FUNCTIONS from '@/functions'
    
    import { 
        faCheck,
        faTimes,
        faSync
    } from '@fortawesome/free-solid-svg-icons'

    export default {
        name: 'detail-userupgrade',
        data () {
            return {
                // for get api
                apiURL: process.env.ROOT_API,
                sectionApi: 'userUpgrades',
                idData: this.$route.params.id,

                // for store data after get api
                itemsData: [],
                itemDataDetail: [],
                errored: false,
                loading: false,
                loadingButtonReject: false,
                loadingButtonAccept: false,
                loadingButtonHTML: FUNCTIONS.svgSpinner,
                formsEdit: false,

                imageValue: '',
                imageOpen: false,

                fontsIcons:{
                    check: faCheck,
                    close: faTimes,
                    rotate: faSync,
                },

                forms:{
                    identity_type: 'ktp',
                    no_kk: '',
                    status: '',
                    alias: '',
                    address: '',
                    birthplace: '',
                    birthday: '',
                    citizenship: '',
                    job: '',
                    gender: '',
                    reason: '',
                    // new field
                    rt: '',
                    rw: '',
                    kelurahan: '',
                    kecamatan: '',
                    kota: '',
                    desa: '',
                    provinsi: '',
                    agama: '',
                    statusKawin: '',
                    golDarah: '',
                },
                rules2:{
                    alias: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    address: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    birthplace: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    birthday: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    citizenship: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    job: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    gender: [ { required: true, message: 'Inputan harus di isi', trigger: 'change' } ],
                    reason: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    // new field
                    rt: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    rw: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    kelurahan: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    kecamatan: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    kota: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    desa: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    provinsi: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    agama: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                    statusKawin: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
                },
                rotateNumber: 0,
            }
        },
        mounted () {
            this.getPosts()
        },
        watch: {
            imageOpen(newValue) {
                let that = this
                if(newValue == false){
                    setTimeout(function(){
                        that.rotateNumber = 0
                        JQuery('.images-must-rotate').css('transform', 'rotate(0deg)')
                    }, 500)
                }
            },
        },
        methods: {
            buildUrl () {
                return this.apiURL + this.sectionApi + '/' + this.idData
            },
            getPosts(){
                let url = this.buildUrl()
                this.loading = true
                this.axios.get(url)
                .then(response => {
                    if(response.data.status == 'success'){
                        this.itemsData = response.data.data
                        if(this.itemsData.user_idcard){
                            this.forms.identity_type = this.itemsData.user_idcard.identity_type
                            this.forms.no_kk = this.itemsData.user_idcard.no_kk
                            this.forms.alias = this.itemsData.user_idcard.aliasname
                            this.forms.address = this.itemsData.user_idcard.address
                            this.forms.birthday = this.itemsData.user_idcard.birthday
                            this.forms.birthplace = this.itemsData.user_idcard.birthplace
                            this.forms.citizenship = this.itemsData.user_idcard.citizenship
                            this.forms.job = this.itemsData.user_idcard.job
                            this.forms.gender = this.itemsData.user_idcard.gender
                            this.forms.rt = this.itemsData.user_idcard.rt
                            this.forms.rw = this.itemsData.user_idcard.rw
                            this.forms.kelurahan = this.itemsData.user_idcard.kelurahan
                            this.forms.kecamatan = this.itemsData.user_idcard.kecamatan
                            this.forms.kota = this.itemsData.user_idcard.kota
                            this.forms.desa = this.itemsData.user_idcard.desa
                            this.forms.provinsi = this.itemsData.user_idcard.provinsi
                            this.forms.agama = this.itemsData.user_idcard.agama
                            this.forms.statusKawin = this.itemsData.user_idcard.status_perkawinan
                            this.forms.golDarah = this.itemsData.user_idcard.golongan_darah
                        }
                    }
                })
                .catch(error => { 
                    console.log(error);
                    this.errored = true
                })
                .finally(() => this.loading = false)
            },
            submitUserUpgrade(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.formsEdit == true){
                            this.$confirm('Saat anda klik OK, maka data user akan terupdate.', 'Apakah anda yakin, sudah mengedit dengan teliti ?', {
                                confirmButtonText: 'OK',
                                cancelButtonText: 'Cancel',
                                type: 'warning'
                            }).then(() => {
                                this.loadingButtonAccept = true
                                let url = this.apiURL + this.sectionApi + '/edit/' + this.idData
                                this.axios.put(url,{
                                    identity_type: this.forms.identity_type,
                                    no_kk: this.forms.no_kk,
                                    aliasname: this.forms.alias,
                                    address: this.forms.address,
                                    birthplace: this.forms.birthplace,
                                    birthday: this.forms.birthday,
                                    citizenship: this.forms.citizenship,
                                    job: this.forms.job,
                                    gender: this.forms.gender,
                                    rt: this.forms.rt,
                                    rw: this.forms.rw,
                                    kelurahan: this.forms.kelurahan,
                                    kecamatan: this.forms.kecamatan,
                                    status_perkawinan: this.forms.statusKawin,
                                    agama: this.forms.agama,
                                    golongan_darah: this.forms.golDarah,
                                    desa: this.forms.desa,
                                    kota: this.forms.kota,
                                    provinsi: this.forms.provinsi
                                })
                                .then(response => {
                                    if(response.data.status == 'success'){
                                        this.loadingButtonAccept = false
                                        this.$router.push({ name: 'userUpgradeRequest' })
                                    }else{
                                        this.loadingButtonAccept = false
                                        this.$notify.error({
                                            title: 'Error',
                                            message: response.data.message
                                        });
                                    }
                                })
                                .catch(error => { 
                                    console.log(error);
                                    this.loadingButtonAccept = false
                                    this.errored = true
                                })
                            })
                        }else{
                            if(this.forms.status == 'rejected'){
                                this.$confirm('Saat anda klik OK, maka permintaan ini akan ditolak.', 'Apakah anda yakin, sudah memverifikasi dengan teliti ?', {
                                    confirmButtonText: 'OK',
                                    cancelButtonText: 'Cancel',
                                    type: 'warning'
                                }).then(() => {
                                    this.loadingButtonReject = true
                                    let urlreject = this.apiURL + this.sectionApi + '/verify/' + this.idData
                                    this.axios.put(urlreject,{
                                        status: this.forms.status,
                                        reason: this.forms.reason
                                    })
                                    .then(response => {
                                        if(response.data.status == 'success'){
                                            this.loadingButtonReject = false
                                            this.$router.push({ name: 'userUpgradeRequest' })
                                        }else{
                                            this.loadingButtonReject = false
                                            this.$notify.error({
                                                title: 'Error',
                                                message: response.data.message
                                            });
                                        }
                                    })
                                    .catch(error => { 
                                        console.log(error);
                                        this.errored = true
                                    })
                                })
                            }else{
                                this.$confirm('Saat anda klik OK, maka status user akan di upgrade menjadi terverifikasi.', 'Apakah anda yakin, sudah memverifikasi dengan teliti ?', {
                                    confirmButtonText: 'OK',
                                    cancelButtonText: 'Cancel',
                                    type: 'warning'
                                }).then(() => {
                                    this.loadingButtonAccept = true
                                    let urlAccept = this.apiURL + this.sectionApi + '/verify/' + this.idData
                                    this.axios.put(urlAccept,{
                                        identity_type: this.forms.identity_type,
                                        no_kk: this.forms.no_kk,
                                        status: this.forms.status,
                                        aliasname: this.forms.alias,
                                        address: this.forms.address,
                                        birthplace: this.forms.birthplace,
                                        birthday: this.forms.birthday,
                                        citizenship: this.forms.citizenship,
                                        job: this.forms.job,
                                        gender: this.forms.gender,
                                        rt: this.forms.rt,
                                        rw: this.forms.rw,
                                        kelurahan: this.forms.kelurahan,
                                        kecamatan: this.forms.kecamatan,
                                        status_perkawinan: this.forms.statusKawin,
                                        agama: this.forms.agama,
                                        golongan_darah: this.forms.golDarah,
                                        desa: this.forms.desa,
                                        kota: this.forms.kota,
                                        provinsi: this.forms.provinsi
                                    })
                                    .then(response => {
                                        if(response.data.status == 'success'){
                                            this.loadingButtonAccept = false
                                            this.$router.push({ name: 'userUpgradeRequest' })
                                        }else{
                                            this.loadingButtonAccept = false
                                            this.$notify.error({
                                                title: 'Error',
                                                message: response.data.message
                                            });
                                        }
                                    })
                                    .catch(error => { 
                                        console.log(error);
                                        this.errored = true
                                    })
                                })
                            }
                        }
                    }
                })
            },
            userUpgrade(value){
                this.forms.status = value
                this.forms.alias = ''
                this.forms.address = ''
                this.forms.birthplace = ''
                this.forms.birthday = ''
                this.forms.citizenship = ''
                this.forms.job = ''
                this.forms.gender = ''
                this.forms.reason = ''
                // new field
                this.forms.rt = ''
                this.forms.rw = ''
                this.forms.kelurahan = ''
                this.forms.kecamatan = ''
                this.forms.kota = ''
                this.forms.desa = ''
                this.forms.provinsi = ''
                this.forms.agama = ''
                this.forms.statusKawin = ''
                this.forms.golDarah = ''
            },
            openImage(value){
                this.imageValue = value
                this.imageOpen = true
            },
            rotateImages(){
                this.rotateNumber += 90
                JQuery('.images-must-rotate').css('transform', 'rotate('+this.rotateNumber+'deg)')
            }
        },
    }
</script>

<style lang="scss" scoped>
    .items-head-agent{
        .items-head{
            .title{
                margin-top: 0;
                border-bottom: 1px solid #ddd !important;
                padding-bottom: 10px !important;
                margin-bottom: 10px !important;
            }
        }
    }
    .forms-upgradeInfo{
        .el-form-item{
            margin-bottom: 20px;
            &:last-child{
                margin-bottom: 0;
            }
            .el-form-item__label{
                font-weight: 700;
                display: inline-block;
                width: 180px !important;
                vertical-align: top;
            }
            .el-form-item__content{
                line-height: normal;
                display: inline-block;
                width: auto !important;
                vertical-align: top;
                img{
                    max-width: 100%;
                }
            }
        }
        .border-bottom{
            border-top: 1px solid #ddd;
            padding-top: 10px;
            margin-top: 10px;
        }
    }
    .forms-upgradeGambar{
        .el-form-item{
            margin-bottom: 20px;
            &:last-child{
                margin-bottom: 0;
            }
            .el-form-item__label{
                font-weight: 700;
                display: block;
                width: 100% !important;
                vertical-align: top;
            }
            .el-form-item__content{
                line-height: normal;
                display: block;
                width: auto !important;
                img{
                    max-width: 100%;
                }
            }
        }
    }
    #detail-userupgraderequest{
        .list-data{
            padding: 24px 0;
            border-top: 1px solid #dfe4e8;
            .badge{
                display: inline-block;
                margin-top: 5px;
            }
            b{ 
                font-size: 20px; 
                text-transform: capitalize;
            }
            h5{
                color: #39434e;
                font-size: 16px;
                margin-top: 20px;
            }
            .cards{
                p{
                    white-space: pre-line;
                    margin-top: 0;
                    margin-bottom: 0;
                }
                ul{
                    list-style: none;
                    padding: 0;
                    &:after{
                        clear: both;
                        content: '';
                        display: block;
                    }
                    li{
                        float: left;
                        width: 50%;
                        padding: 0 15px;
                        color: #697586;
                        font-size: 14px;
                        
                    }
                }
            }
        }
        button{
            span{
                position: relative;
                top: -1px;
                .loading{
                    display: inline-block;
                }
            }
            &#accept, &#submit, &#submit-reject, &#submit-edit{
                .fontIcons{
                    color: #fff;
                }        
            }
            &#reject{
                .fontIcons{
                    color: #DC1818;
                }
                .loading{
                    .lds-ring{
                        div{
                            border-color: #DC1818 transparent transparent transparent;
                        }
                    }
                }        
            }
        }
    }
    .status-change{
        .forms-upgradeInfo{
            margin-bottom: 25px;
            display: block;
            .el-form-item__label{
                font-weight: 700;
                display: block;
                width: 100% !important;
                vertical-align: top;
            }
            .el-form-item__content{
                line-height: normal;
                display: block;
                width: auto !important;
                vertical-align: top;
                img{
                    max-width: 100%;
                }
            }
        }        
        .fontIcons{
            margin-left: -5px;
            margin-right: 5px;
            vertical-align: middle;
            position: relative;
            top: 0px;
        }
    }
    .info-upgrade-akun{
        .el-col{
            margin-bottom: 15px;
        }
    }
</style>
