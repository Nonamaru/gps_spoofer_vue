<template>
<div class="static">
    <div class="create">
        <span>
            <text>Координаты</text>
            <input type="text" placeholder="1,1" v-model="valuesStore.createScript.coordinates"/>
        </span>
        <span>
            <text>Высота (метры)</text>
            <div class="select">
                <div class="option" :class="{selectedOption: valuesStore.createScript.height == 1500}" @click="setHeight(1500); another = false">1500 M</div>
                <div class="option" :class="{selectedOption: valuesStore.createScript.height == 500}" @click="setHeight(500); another = false">500 M</div>
                <div class="option" :class="{selectedOption: valuesStore.createScript.height == 10}" @click="setHeight(10); another = false">10 M</div>
                <div class="option" :class="{selectedOption: another}" @click="setHeight(1); another = true">Другая</div>
                <input v-if="another" type="text" v-model="valuesStore.createScript.height" />
            </div>
        </span>
        <span>
            <text>Время выполнения сценария (секунды)</text>
            <input type="number" placeholder="180 минимально" v-model="valuesStore.createScript.time" @keydown="checkTime()" />
        </span>
        <button @click="createScript()">
            {{creating ? "Идет создание сценария" : "Создать сценарий"}}
        </button>
    </div>
    <div class="start-stop">
        <button :class="{loopActive: startScript.staticLoop}" @click="startScript.staticLoop = !startScript.staticLoop">Цикличное воспроизведение</button>
        <div>
            <button :class="{ButtonActive: startScript.staticIsStarted}">
                <text v-if="!startScript.staticIsStarted" @click="startScript.staticIsStarted = true; setupScript()">Запустить</text>
                <text v-if="startScript.staticIsStarted">Запущено!</text>
            </button>
            <button v-if="startScript.staticIsStarted && startScript.staticLoop" @click="stopScript()">Остановить</button>
        </div>
    </div>
</div>
</template>
<script>
import {useValuesStore} from '@/store/index.js';
import {mapStores} from 'pinia';
import {useCookies} from "vue3-cookies";
import axios from 'axios';
import {socket} from '@/socket';
export default{
    setup(){
        const { cookies } = useCookies();
        return { cookies };
    },
    computed:{
        ...mapStores(useValuesStore),
        requests(){return this.valuesStore.requests},
        startScript(){return this.valuesStore.startScript},
        status(){return this.valuesStore.statusInfo}
    },
    data(){
        return{
            another: false,
            creating: false,
            isKilled: false,
        }
    },
    methods:{
        sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms))},
        checkTime(){
            this.sleep(2000).then(() => {
                if (this.valuesStore.createScript.time < 180){
                    this.valuesStore.createScript.time = 180;
                }
            });
        },
        setHeight(height){
            this.valuesStore.createScript.height = height;
        },
        createScript(){
            socket.emit('static', this.valuesStore.createScript);
            this.status.name = 'Создание сценария!';
            this.valuesStore.timeOver(true);
            this.creating = true;
        },
        setupScript(){
            if (this.startScript.staticLoop == false){
                socket.emit('loop', {script: 'static', loop: false});
                this.status.name = 'Запущен статический спуфинг!';
                this.valuesStore.timeOver(true);
                this.sendReport(this.startScript.staticLoop);
                this.isKilled = false;
            } else {
                socket.emit('loop', {script: 'static', loop: true});
                this.status.name = 'Статический спуфинг работает циклично!';
                this.valuesStore.timeOver(true);
                this.sendReport(this.startScript.staticLoop);
                this.isKilled = false;
            }
        },
        stopScript(){
            socket.emit('kill_loop');
            this.startScript.staticIsStarted = false; 
            this.sendReport(this.startScript.staticLoop);
            this.valuesStore.isDone('Остановлен цикличный спуфинг!');
            this.isKilled = true;
        },
        sendReport(isLoop){
            let desc;
            if(isLoop == 'create') {
                desc = "Создание сценария";
            } else if(isLoop == true) {
                desc = (this.startScript.staticLoop && this.startScript.staticIsStarted) ? 'Запущен статический режим (циклично)' : 'Остановлен статический режим (циклично)'
            } else {
                desc = this.startScript.staticIsStarted ? 'Запущен статический режим' : 'Завершён статический режим';
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
        socket.on('static', (data) => {
            data = new TextDecoder().decode(data);
            if (data.trim() == '2024'){
                this.creating = false;
                this.valuesStore.isDone('Сценарий создан!');
                this.sendReport("create");
            }
            else {
                this.status.name = 'Создание сценария!';
                this.status.isStarted = true;
                this.creating = true;
                this.status.systemMessage = data;
            }
        });
        socket.on('static_sim', (data) => {
            data = new TextDecoder().decode(data);
            if (data.trim() == 'End simulation'){
                this.startScript.staticIsStarted = false;
                this.valuesStore.isDone('Работа спуфинга завершена!');
                this.sendReport(this.startScript.staticLoop);
            } 
            else {
                this.status.systemMessage = data;
                this.startScript.staticIsStarted = true;
                this.status.isStarted = true;
                this.status.name = 'Запущен статический спуфинг!';
            }
        });
        socket.on('static_loop_sim', (data) => {
            if(!this.isKilled){
                data = new TextDecoder().decode(data);
                this.status.systemMessage = data;
                this.startScript.staticIsStarted = true;
                this.status.name = 'Cтатический спуфинг работает циклично!';
                this.status.isStarted = true;
                this.startScript.staticLoop = true;
            }
        })
    }
}
</script>
<style scoped lang="scss">
.static{
    display: grid;
    grid-template-rows: 50% 50%;
    height: 100%;
    .create{
        grid-row: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
        span{
            display: flex;
            flex-direction: column;
            text-align: left;
            width: 100%;
        }
        input{ 
            padding: 8px 16px;
            width: 93.5%;
            border: 1px solid lightgray;
            border-radius: var(--border-radius);
            &:focus{
                outline: none;
                border-color: black;
                // background-color: #FF7673;
            }
        }
        .select{
            display: flex;
            flex-direction: row;
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