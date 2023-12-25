<template>
<div class="system">
    <div class="system-header">Система</div>
    <div class="system-info">
        <table>
            <tr>
                <th>IP</th>
                <td>{{valuesStore.systemOpions.ip}}</td>
            </tr>
            <tr>
                <th>Обновление GPS</th>
                <td 
                    @mouseover="isUpdateButton = true"
                    @mouseleave="isUpdateButton = false"
                >
                    <text v-if="!isUpdateButton" style="text-decoration: underline;">
                        {{valuesStore.systemOpions.lastUpdate}}
                    </text>
                    <text class="update-button" v-if="isUpdateButton" @click="updateGps()">{{ updateButtonStatus }}</text>
                </td>
            </tr>
            <tr>
                <th>Свободно памяти</th>
                <td>{{valuesStore.systemOpions.freeSpace}}</td>
            </tr>
            <tr>
                <th>Подключение</th>
                <td>
                    {{isConnected ? "Подключено" : "Нет подключения"}}
                </td>
            </tr>
            <tr>
                <th>Устройство</th>
                <td class="find"><text @click="currentPosition()">Найти устройство</text></td>
            </tr>
        </table>
    </div>
</div>
</template>
<script>
import {useValuesStore} from '@/store/index.js';
import {mapStores} from 'pinia';
import axios from 'axios';
import {state} from "@/socket";
// import socket from 'socket.io-client/lib/socket';
import {socket} from '@/socket';
export default{
    computed:{
        ...mapStores(useValuesStore),
        isConnected(){
            return state.connected;
        }
    },
    data(){
        return{
            isUpdateButton: false,
            updateButtonStatus: 'Обновить'
        }
    },
    methods:{
        currentPosition(){
            navigator.geolocation.getCurrentPosition((e) => {
              this.valuesStore.mapOptions.center = [e.coords.latitude, e.coords.longitude];
              this.valuesStore.mapOptions.zoom = 20;
              this.valuesStore.mapOptions.circleCenter = [e.coords.latitude, e.coords.longitude];
            });
            this.sendReport("search");
        },
        sendReport(isWho){
            let desc;
            if (isWho == 'search'){
                desc = 'Поиск устройства';
            } else if (isWho == 'update'){
                desc = 'Обновление данных GPS';
            }
            const body = {
                date: `${new Date().toJSON().slice(0, 10)}`, 
                desc: desc, 
                time: `${new Date().toLocaleTimeString()}`,
            };
            const headers = {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
            axios.post(`${this.valuesStore.requests.host+this.valuesStore.requests.writeReport}`, body, {headers});
        },
        updateGps(){
            this.updateButtonStatus = "Обновление...";
            socket.emit('update_brdc');
        }
    },
    mounted(){
        this.valuesStore.systemOpions.isConnect = state.connected;
        socket.on('update', (data) => {
            if (data == 0){
                this.updateButtonStatus = 'Успешно!'; 
                this.sendReport("update");
                socket.emit('system_view');
                setTimeout(() => {
                    this.updateButtonStatus = this.valuesStore.systemOpions.lastUpdate; 
                }, 4000)
            }
        });
        socket.emit('system_view');
        socket.on('system', (data) => {
            data = JSON.parse(data);
            this.valuesStore.systemOpions.ip = data.ip;
            this.valuesStore.systemOpions.lastUpdate = data.brdcDate;
            this.valuesStore.systemOpions.freeSpace = data.memory+"GB";
        })
    }
}
</script>
<style scoped lang="scss">
.system{
    width: 100%;
    height: 100%;
    .system-header{
        font-size: 2rem;
        text-align: left;
        padding: 20px;
    }
    .system-info{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        font-size: 1.5rem;
        table{
            width: 90%;
            th{
                text-align: left;
            }
            td{
                text-align: center;
                border: 1px solid black;
                padding: 4px 8px;
                border-radius: var(--border-radius);
                .update-button{
                    font-size: 1.4rem;
                    text-decoration: underline;
                    color: var(--text-color);
                    cursor: pointer;
                }
            }
            .find{
                text-decoration: underline;
                &:hover{
                    cursor: pointer;
                    color: gray;
                }
            }
        }
    }
}
</style>