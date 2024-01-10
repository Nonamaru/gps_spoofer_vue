<template>
<div class="container">
  <statusView />
  <Icon v-if="status.isVisible == false" class="info-icon" @mouseover="status.isVisible = true" icon="akar-icons:info-fill" />
  <div class="map">
    <l-map 
      :options="{attributionControl:false, zoomControl:false}"
      :zoom="map.zoom" 
      :center="map.center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
      @click="addmarker"
    >
      <!-- <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer> -->
      <l-tile-layer
        v-for="tileProvider in map.tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
        layer-type="base"
      />
      <l-control-layers />
      <l-marker 
        v-for="(marker) in map.markers" 
        :key="marker" 
        :lat-lng="marker" 
        @click="removemarker(marker)"
      ></l-marker>
      <l-polyline v-if="map.polyline" :lat-lngs="map.polyline" color="#057D9F"></l-polyline>
      <l-circle 
        v-if="map.circleCenter"
        :lat-lng="map.circleCenter"
        :radius="100"
        color="#61B7CF"
      />
      <l-circle 
        v-if="map.circleCenter"
        :lat-lng="map.circleCenter"
        :radius="1"
        color="#057D9F"
      />
    </l-map>
  </div>
  <div class="tools">
    <SpoofingView v-if="page == 'spoofing'" />
    <ReportsView v-if="page == 'reports'" />
    <SystemView v-if="page == 'system'" />
    <SettingsView v-if="page == 'settings'" />
  </div>
</div>
</template>
<script>
import SpoofingView from '@/components/spoofing/SpoofingView.vue';
import ReportsView from '@/components/reports/ReportsView.vue';
import SystemView from '@/components/system/SystemView.vue';
import SettingsView from '@/components/settings/SettingsView.vue';
import statusView from '@/components/statusView.vue';
import "leaflet/dist/leaflet.css";
// import axios from 'axios'
import { 
    LMap, 
    LTileLayer, 
    LMarker, 
    LControlLayers,
    LCircle,
    LPolyline,
    // LIcon, 
    // LPopup,
    // LTooltip
} from "@vue-leaflet/vue-leaflet";
import {useValuesStore} from '@/store/index.js'
import {mapStores} from 'pinia';
import { Icon } from '@iconify/vue';
export default{
  computed:{
    ...mapStores(useValuesStore),
    status(){return this.valuesStore.statusInfo},
    map(){return this.valuesStore.mapOptions},
    create(){return this.valuesStore.createScript}
  },
  props:['page'],
  components:{
    SpoofingView,
    ReportsView,
    SystemView,
    SettingsView,
    LMap,
    LTileLayer,
    LControlLayers,
    LMarker,
    LCircle,
    LPolyline,
    statusView,
    Icon,
  },
  data(){
    return{}
  },
  methods:{
    async boundsUpdated (bounds) {this.bounds = bounds;},
    async zoomUpdated (zoom) {this.zoom = zoom;},
    async centerUpdated (center) {this.center = center;},
    removemarker(index) {
      // this.map.markers.splice(index, 1);
      this.map.markers = this.map.markers.filter(element => element != index)
      this.create.coordinates = null;
      this.map.polyline = [];
    },
    addmarker(event) {
      if (this.map.mode == 'static'){
        this.map.markers = [event.latlng];
        this.create.coordinates = `${event.latlng.lat},${event.latlng.lng}`;
      } else if (this.map.mode == 'dynamic'){
        if (this.map.markers.length < 2){
          this.map.markers.push(event.latlng);
          if (this.map.markers.length == 2) {
            this.map.polyline = [
              [this.map.markers[0].lat, this.map.markers[0].lng],
              [this.map.markers[1].lat, this.map.markers[1].lng]
            ]
          }
        } 
      }
    },
  },
  async mounted(){
    navigator.geolocation.getCurrentPosition((e) => {
      this.map.center = [e.coords.latitude, e.coords.longitude];
      this.map.zoom = 20;
      this.map.circleCenter = [e.coords.latitude, e.coords.longitude];
      alert(`Мы определили ваше местоположение здесь:\nДолгота: ${e.coords.latitude}\nШирота: ${e.coords.longitude}`);
    });
  }
}
</script>
<style scoped lang="scss">
.container{
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 600px;
  position: relative;
  .info-icon{
    position: absolute;
    z-index: 4;
    top: 1%;
    left: 1%;
    font-size: 1.4rem;
    &:hover{
      color: gray;
      cursor: pointer;
    }
  }
  .map{
    grid-column: 1;
    background-color: rgb(212, 146, 45);
    z-index: 2;
  }
  .tools{
    grid-column: 2;
    padding-left: 10px;
    -webkit-box-shadow: -20px 0px 20px -16px rgba(34, 60, 80, 0.2);
    -moz-box-shadow: -20px 0px 20px -16px rgba(34, 60, 80, 0.2);
    box-shadow: -20px 0px 20px -16px rgba(34, 60, 80, 0.2);
  }
}
</style>