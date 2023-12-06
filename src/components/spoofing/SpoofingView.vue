<template>
<div class="spoofing">
    <div class="spoofing-header">Спуфинг</div>
    <div class="spoofing-nav">
        <div class="mode" :class="{SelectedMode: valuesStore.mapOptions.mode == 'static'}" @click="switchMode('static')">Статический</div>
        <div class="mode" :class="{SelectedMode: valuesStore.mapOptions.mode == 'dynamic'}" @click="switchMode('dynamic')">Динамический</div>
    </div>
    <div class="spoofing-tool">
        <div 
            class="gpsl2" 
            :class="{gpsl2Active: gpsl2 == true}"
            @click="setGpsL2(gpsl2 = !gpsl2); activateStatus = true; status()"
        >
            Подавление GPS L2
            <text class="status" :class="{statusChange: activateStatus == true}">{{gpsl2 ? "Активно" : "Неактивно"}}</text>
        </div>
        <StaticMode :soloCoordinate="soloCoordinate" v-if="valuesStore.mapOptions.mode == 'static'" />
        <DynamicMode v-if="valuesStore.mapOptions.mode == 'dynamic'" />
    </div>
</div>
</template>
<script>
import StaticMode from '@/components/spoofing/StaticMode.vue';
import DynamicMode from '@/components/spoofing/DynamicMode.vue';
import { useValuesStore } from '@/store/index.js';
import { mapStores } from 'pinia';
import { useCookies } from "vue3-cookies";
import axios from 'axios';
export default{
    setup() {
        const { cookies } = useCookies();
        return { cookies };
    },
    computed: {
        ...mapStores(useValuesStore)
    },
    components:{ 
        StaticMode,
        DynamicMode
    },
    data(){
        return{
            gpsl2: false,
            activateStatus: false,
        }
    },
    methods:{
        status(){
            setTimeout(() => {
                this.activateStatus = false;
                this.sendReport()
            }, 1000);
        },
        switchMode(mode){
            this.valuesStore.mapOptions.mode = mode;
            this.valuesStore.mapOptions.markers = [];
            this.valuesStore.mapOptions.polyline = [];
            this.valuesStore.createScript.coordinates = null;
        },
        setGpsL2(data){
            this.cookies.set("gpsl2", data);
        },
        sendReport(){
            const body = {
                date: `${new Date().toJSON().slice(0, 10)}`, 
                desc: `${this.gpsl2 ? 'Подавление GPS L2 Включено' : 'Подавление GPS L2 Выключено'}`, 
                time: `${new Date().toLocaleTimeString()}`,
            };
            const headers = {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
            axios.post("https://localhost:8081/writeReport", body, {headers});
        }
    },
    mounted(){
        this.gpsl2 = (() => {return(/^true$/i.test(this.cookies.get("gpsl2")))})();
    }
}
</script>
<style scoped lang="scss">
.spoofing{
    display: flex;
    flex-direction: column;
    height: 100%;
    .spoofing-header{
        font-size: 2rem;
        text-align: left;
        padding: 20px;
    }
    .spoofing-nav{
        display: flex;
        flex-direction: row;
        font-size: 1.2rem;
        font-weight: 500;
        color: gray;
        .SelectedMode{
            color: white;
            background-color: black;
            border: none !important;
            font-weight: bold;
            pointer-events: none;
        }
        .mode{
            width: 50%;
            border: 1px solid lightgray;
            padding: 8px;
            &:hover{
                cursor: pointer;
            }
        }
    }
    .spoofing-tool{
        padding: 16px 8px;
        display: flex;
        gap: 20px;
        flex-direction: column;
        height: 100%;
        .gpsl2{
            position: relative;
            cursor: pointer;
            border: 1px solid var(--button-all-color);
            padding: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 250px;
            margin-left: auto;
            margin-right: auto;
            color: var(--button-all-color);
            border-radius: var(--border-radius);
            &:hover{
                border-color: var(--button-hover);
            }
            .status{
                position: absolute;
                top: 110%;
                left: 50%;
                transform: translate(-50%, 0%);
                color: black;
                font-weight: 400;
                font-size: .7rem;
                opacity: 0;
            }
            .statusChange{
                animation: showStatus 2s;
            }
            @keyframes showStatus{
                from{
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        }
        .gpsl2Active{
            color: white;
            font-weight: bold;
            background-color: var(--button-all-color);
            border: 1px solid var(--button-all-color);
            &:hover{
                border-color: var(--button-hover);
            }
        }
    }
}
</style>