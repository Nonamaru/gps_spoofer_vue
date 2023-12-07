// import { createStore } from 'vuex'

// export default createStore({
//   state: {
//   },
//   getters: {
//   },
//   mutations: {
//   },
//   actions: {
//   },
//   modules: {
//   }
// })
import {defineStore} from 'pinia'

export const useValuesStore = defineStore('values', {
  state: () => ({ 
    requests:{
      host: 'https://localhost:8081',
      showReports: '/showReports',
      writeReport: '/writeReport'
    },
    createScript: {
      coordinates: null,
      height: 1500,
      time: 180,
    },
    calculateScript:{
      height: 1500,
      speed: 0.001,
    },
    startScript:{
      dynamicIsStarted: false,
      dynamicLoop: false,
      staticIsStarted: false,
      staticLoop: false,
    },
    systemOpions:{
      ip: '192.168.0.121',
      lastUpdate: '22.03.24',
      freeSpace: '24GB',
      isConnect: false,
    },
    mapOptions:{
      zoom: 12,
      center: [55.755864, 37.617698],
      tileProviders: [
        {
          name: 'OpenStreetMap',
          visible: true,
          attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        },
        {
          name: 'OpenTopoMap',
          visible: false,
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        },
      ],
      markers: [],
      polyline: false,
      circleCenter: false,
      mode: 'static',
    },
    statusInfo:{
      isVisible: false,
      name: 'turename',
      isStarted: false,
    }
  }),
  // getters: {
  //   doubleCount: (state) => state.count * 2,
  // },
  actions: {
    timeOver(){
      this.statusInfo.isStarted = true;
      this.statusInfo.isVisible = true;
      setTimeout(() => {
        this.statusInfo.isStarted = false;
        this.statusInfo.isVisible = false;
      }, 2000);
    },
  },
})