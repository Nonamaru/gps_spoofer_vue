<template>
<div class="dynamic">
    <div class="calculate">
        <span>
            <text>Высота (метры)</text>
            <div class="select">
                <div class="option" :class="{selectedOption: valuesStore.calculateScript.height == 1500}" @click="valuesStore.calculateScript.height = 1500; another = false">1500 M</div>
                <div class="option" :class="{selectedOption: valuesStore.calculateScript.height == 500}" @click="valuesStore.calculateScript.height = 500; another = false">500 M</div>
                <div class="option" :class="{selectedOption: valuesStore.calculateScript.height == 10}" @click="valuesStore.calculateScript.height = 10; another = false">10 M</div>
                <div class="option" :class="{selectedOption: another}" @click="valuesStore.calculateScript.height = 1; another = true">Другая</div>
                <input v-if="another" type="text" v-model="valuesStore.calculateScript.height" />
            </div>
        </span>
        <span>
            <text>Скорость</text>
            <div class="select">
                <div class="option" :class="{selectedOption: valuesStore.calculateScript.speed == 0.001}" @click="valuesStore.calculateScript.speed = 0.001" >36 км/ч</div>
                <div class="option" :class="{selectedOption: valuesStore.calculateScript.speed == 0.0015}" @click="valuesStore.calculateScript.speed = 0.0015" >54 км/ч</div>
                <div class="option" :class="{selectedOption: valuesStore.calculateScript.speed == 0.002}" @click="valuesStore.calculateScript.speed = 0.002" >72 км/ч</div>
                <div class="option" :class="{selectedOption: valuesStore.calculateScript.speed == 0.0025}" @click="valuesStore.calculateScript.speed = 0.0025" >86 км/ч</div>
                <div class="option" :class="{selectedOption: valuesStore.calculateScript.speed == 0.003}" @click="valuesStore.calculateScript.speed = 0.003" >102 км/ч</div>
                <div class="option" :class="{selectedOption: valuesStore.calculateScript.speed == 0.0035}" @click="valuesStore.calculateScript.speed = 0.0035" >118 км/ч</div>
                <div class="option" :class="{selectedOption: valuesStore.calculateScript.speed == 0.004}" @click="valuesStore.calculateScript.speed = 0.004" >134 км/ч</div>
                <div class="option" :class="{selectedOption: valuesStore.calculateScript.speed == 0.0045}" @click="valuesStore.calculateScript.speed = 0.0045" >150 км/ч</div>
                <div class="option" :class="{selectedOption: valuesStore.calculateScript.speed == 0.005}" @click="valuesStore.calculateScript.speed = 0.005" >166 км/ч</div>
            </div>
        </span>
        <button @click="calcDistance()" :class="{isCalculating: scriptReady}">
            {{ scriptReady ? "Идет расчет" : "Расчитать" }}
        </button>
    </div>
    <div class="start-stop">
        <button :class="{loopActive: startScript.dynamicLoop}" @click="startScript.dynamicLoop = !startScript.dynamicLoop">Цикличное воспроизведение</button>
        <div>
            <button :class="{ButtonActive: startScript.dynamicIsStarted}">
                <text v-if="!startScript.dynamicIsStarted" @click="startScript.dynamicIsStarted = true; setupScript()">Запустить</text>
                <text v-if="startScript.dynamicIsStarted">Запущено!</text>
            </button>
            <button v-if="startScript.dynamicIsStarted && startScript.dynamicLoop" @click="stopScript()">Остановить</button>
        </div>
    </div>
</div>
</template>
<script>
import {useValuesStore} from '@/store/index.js';
import {mapStores} from 'pinia';
import axios from 'axios';
import {socket} from '@/socket';
export default{
    computed:{
        ...mapStores(useValuesStore),
        requests(){return this.valuesStore.requests},
        startScript(){return this.valuesStore.startScript},
        status(){return this.valuesStore.statusInfo},
    },
    data(){
        return{
            another: false,
            scriptReady: false,
            isKilled: false,
        }
    },
    methods:{
        calcDistance(){
            var latitude1 = this.valuesStore.mapOptions.markers[0].lat;
            var longitude1 = this.valuesStore.mapOptions.markers[0].lng;
            var latitude2 = this.valuesStore.mapOptions.markers[1].lat;
            var longitude2 = this.valuesStore.mapOptions.markers[1].lng;

            latitude1 = parseFloat(latitude1);
            longitude1 = parseFloat(longitude1);
            latitude2 = parseFloat(latitude2);
            longitude2 = parseFloat(longitude2);
        
            var R = 6371; // радиус Земли в км
            function intermediatePoints(lat1, lng1, lat2, lng2, step) {
                var d = getDistance(lat1, lng1, lat2, lng2); // расстояние между точками в км
                var brng = getBearing(lat1, lng1, lat2, lng2); // направление от первой точки к второй в радианах
                var points = [];
                for (var dist = step; dist < d; dist += step) {
                    var latlng = getIntermediatePoint(lat1, lng1, brng, dist, R); // промежуточная точка
                    points.push(latlng);
                }
                return points;
            }

            function getDistance(lat1, lng1, lat2, lng2) {
                var dLat = toRadians(lat2 - lat1);
                var dLng = toRadians(lng2 - lng1);
                var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                        Math.sin(dLng/2) * Math.sin(dLng/2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                var d = R * c;
                return d;
            }

            function getBearing(lat1, lng1, lat2, lng2) {
                var dLng = toRadians(lng2 - lng1);
                var y = Math.sin(dLng) * Math.cos(toRadians(lat2));
                var x = Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
                        Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLng);
                var brng = Math.atan2(y, x);
                return brng;
            }

            function getIntermediatePoint(lat1, lng1, brng, dist, R) {
                var lat2 = Math.asin(Math.sin(toRadians(lat1)) * Math.cos(dist/R) +
                           Math.cos(toRadians(lat1)) * Math.sin(dist/R) * Math.cos(brng));
                var lng2 = toRadians(lng1) + Math.atan2(Math.sin(brng) * Math.sin(dist/R) * Math.cos(toRadians(lat1)),
                           Math.cos(dist/R) - Math.sin(toRadians(lat1)) * Math.sin(lat2));
                return {lat: toDegrees(lat2), lng: toDegrees(lng2)};
            }

            function toRadians(degrees) {return degrees * Math.PI / 180;}
            function toDegrees(radians) {return radians * 180 / Math.PI;}

            //var step = 0.001; // шаг в градусах (примерно 1 метр)
            //var height = 1500; // высота полета
            var height = this.valuesStore.calculateScript.height;
            var step = parseFloat(this.valuesStore.calculateScript.speed);
            var points = intermediatePoints(latitude1, longitude1, latitude2, longitude2, step);
            let num = 0;
            let csvPointsArray = [];
            for(let i=0; i<points.length; i++){
                let csvPoints = [num.toFixed(1), points[i].lat, points[i].lng, height];
                csvPointsArray.push(csvPoints);
                num = num + 0.1;
            }
            
            socket.emit("dynamic", csvPointsArray);
            this.status.name = 'Идет расчет!';
            this.valuesStore.timeOver(true);
            this.scriptReady = true;
        },
        setupScript(){
            if (this.startScript.dynamicLoop == false){
                socket.emit('loop', {script: 'dynamic', loop: false});
                this.status.name = 'Запущен динамический спуфинг!';
                this.valuesStore.timeOver(true);
                this.sendReport(this.startScript.dynamicLoop);
                this.isKilled = false;
            } else {
                socket.emit('loop', {script: 'dynamic', loop: true});
                this.status.name = 'Динамический спуфинг работает циклично!';
                this.valuesStore.timeOver(true);
                this.sendReport(this.startScript.dynamicLoop);
                this.isKilled = false;
            }
        },
        stopScript(){
            socket.emit('kill_loop');
            this.startScript.dynamicIsStarted = false;
            this.sendReport(this.startScript.dynamicLoop);
            this.valuesStore.isDone('Остановлен цикличный спуфинг!');
            this.isKilled = true;
        },
        sendReport(isLoop){
            let desc;
            if (isLoop == 'calculate'){
                desc = "Расчет скрипта";
            } else if(isLoop == true){
                desc = (this.startScript.dynamicLoop && this.startScript.dynamicIsStarted) ? 'Запущен динамический режим (циклично)' : 'Остановлен динамический режим (циклично)'
            } else {
                desc = this.startScript.dynamicIsStarted ? 'Запущен динамический режим' : 'Завершён динамический режим';
            }
            const body = {
                date: `${new Date().toJSON().slice(0, 10)}`, 
                desc: `${desc}`, 
                time: `${new Date().toLocaleTimeString()}`,
            };
            const headers = {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
            axios.post(`${this.requests.host+this.requests.writeReport}`, body, {headers});
        }
    },
    mounted(){
        socket.on("dynamic", (data) => {
            data = new TextDecoder().decode(data);
            if (data.trim() == 'Make simulation completed'){
                this.scriptReady = false;
                this.valuesStore.isDone('Расчет прошел успешно!');
                this.sendReport("calculate");
            } else {
                this.status.systemMessage = data;
                this.status.name = 'Идет расчет!';
                this.status.isStarted = true;
                this.scriptReady = true;
            }
        });
        socket.on('dynamic_sim', (data) => {
            data = new TextDecoder().decode(data);
            if (data.trim() == 'End simulation'){
                this.startScript.dynamicIsStarted = false;
                this.valuesStore.isDone('Работа спуфинга завершена!');
                this.sendReport(this.startScript.dynamicLoop);
            } 
            else {
                this.status.systemMessage = data;
                this.startScript.dynamicIsStarted = true;
                this.status.isStarted = true;
                this.status.name = 'Запущен динамический спуфинг!';
            }
        });
        socket.on('dynamic_loop_sim', (data) => {
            if(!this.isKilled){
                data = new TextDecoder().decode(data);
                this.status.systemMessage = data;
                this.startScript.dynamicIsStarted = true;
                this.status.name = 'Динамический спуфинг работает циклично!';
                this.status.isStarted = true;
                this.startScript.dynamicLoop = true;
            }
        })
    }
}
</script>
<style scoped lang="scss">
.dynamic{
    display: grid;
    grid-template-rows: 50% 50%;
    height: 100%;
    .calculate{
        gap: 20px;
        display: flex;
        flex-direction: column;
        text-align: left;
        .select{
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            width: 100%;
            gap: 20px;
            .option{
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid lightgray;
                color: gray;
                width: 60px;
                height: 30px;
                font-size: .9rem;
                border-radius: var(--border-radius);
                &:hover{
                    cursor: pointer;
                }
            }
            .selectedOption{
                background-color: var(--button-all-color);
                border: 1px solid var(--button-all-color);
                color: white;
                font-weight: bold;
                pointer-events: none;
            }
            input{
                padding: 4px;
                width: 40%;
            }
        }
        button{
            width: 100%;
            padding: 8px 16px;
            border: 1px solid var(--button-all-color);
            background-color: white;
            color: var(--button-all-color);
            font-size: 1rem;
            border-radius: var(--border-radius);
            &:hover{
                cursor: pointer;
                border-color: var(--button-hover);
            }
            &:active{
                font-size: bold;
                border-color: var(--button-all-color);
                background-color: var(--button-all-color);
                color: white;
            }
        }
        .isCalculating{
            background-color: var(--button-all-color);
            color: white;
            font-weight: bold;
            pointer-events: none;
        }
    }
    .start-stop{
        grid-row: 2;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        gap: 5%;
        button{
            border: 1px solid var(--button-all-color);
            background-color: white;
            padding: 8px 16px;
            font-size: 1rem;
            width: 50%;
            color: var(--button-all-color);
            border-radius: var(--border-radius);
            &:hover{
                cursor: pointer;
                border-color: var(--button-hover);
            }
        }
        .loopActive{
            color: white;
            font-weight: bold;
            background-color: var(--button-all-color);
            border: 1px solid var(--button-all-color);
            &:hover{
                border-color: var(--button-hover);
            }
        }
        div{
            width: 100%;
            button{
                width: 100%;
                color: black;
                border: 1px solid black;
                display: flex;
                justify-content: center;
                &:hover{
                    border-color: gray;
                }
                text{width: 100%;}
            }
            .ButtonActive{
                color: white;
                font-weight: bold;
                background-color: black;
                border: 1px solid black;
                pointer-events: none;
                &:hover{
                    border-color: gray;
                }
            }
        }
    }
}
</style>