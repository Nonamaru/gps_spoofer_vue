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
                <td>{{valuesStore.systemOpions.lastUpdate}}</td>
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
        <button @click="sending()">send</button>
    </div>
</div>
</template>
<script>
import {useValuesStore} from '@/store/index.js';
import {mapStores} from 'pinia';
import axios from 'axios';
import {state} from "@/socket";
export default{
    computed:{
        ...mapStores(useValuesStore),
        isConnected(){
            return state.connected;
        }
    },
    methods:{
        currentPosition(){
            navigator.geolocation.getCurrentPosition((e) => {
              this.valuesStore.mapOptions.center = [e.coords.latitude, e.coords.longitude];
              this.valuesStore.mapOptions.zoom = 20;
              this.valuesStore.mapOptions.circleCenter = [e.coords.latitude, e.coords.longitude];
            });
        },
        async sending(){
            const sosiska = {date: "10.10.10", desc: "ya tut", time: "10:10"};
            // const headers = {'Content-Type': 'application/json'};
            const response = await axios.post("https://localhost:8081/writeReport", sosiska);
            console.log(response);
        }
    },
    mounted(){
        this.valuesStore.systemOpions.isConnect = state.connected;
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