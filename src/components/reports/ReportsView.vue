<template>
<div class="reports">
    <div class="reports-header">Отчеты</div>
    <div class="reports-show">
        <div class="string" v-for="i in reports" :key="i">
            <text class="date">{{i.date}}</text>
            <text class="status-desc" :class="{statusRed: status}">{{i.desc}}</text>
            <text class="openbox">
                {{i.time}}
                <!-- <Icon icon="raphael:arrowdown" v-if="(boxOpen == false) || (boxOpen != i)" @click="boxOpen = i" />
                <Icon icon="raphael:arrowdown" :rotate="2" v-if="boxOpen == i" @click="boxOpen = false" /> -->
            </text>
            <!-- <div class="opened-box" v-if="boxOpen == i">
                Box {{ i }} is open!
                <text v-for="u in 'Hello world!'" :key="u">{{ u }}</text>
            </div> -->
        </div>
    </div>
</div>
</template>
<script>
import axios from "axios";
export default{
    data(){
        return{
            status: false,
            reports:[],
        }
    },
    async mounted(){
        const response = await axios.get('https://localhost:8081/showReports');
        this.reports = response.data;
    }
}
</script>
<style scoped lang="scss">
.reports{
    width: 100%;
    height: 100%;
    .reports-header{
        font-size: 2rem;
        text-align: left;
        padding: 20px;
    }
    .reports-show{
        overflow: scroll;
        width: 99%;
        height: 90vh;
        display: flex;
        flex-direction: column;
        gap: 10px;
        .string{
            border: 1px solid var(--button-all-color);
            padding: 8px;
            border-radius: var(--border-radius);
            width: 92%;
            display: grid;
            grid-template-columns: 12% 1fr 8%;
            position: relative;
            .date{
                grid-column: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: .7rem;
            }
            .status-desc{
                grid-column: 2;
                display: flex;
                justify-content: left;
                align-items: center;
                color: var(--button-hover);
            }
            .statusRed{color: #A60000}
            .openbox{
                grid-column: 3;
                display: flex;
                justify-content: center;
                align-items: center;
                // font-size: 1.5rem;
                font-size: .7rem;
            }
            .opened-box{
                position: absolute;
                border: 1px solid var(--button-all-color);
                top: 95%;
                left: -1px;
                width: 100%;
                height: 300px;
                background-color: white;
                border-top: none;
                // backdrop-filter: blur(15px);
                border-radius: 0px 0px 6px 6px;
                z-index: 3;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                overflow: scroll;
                text{
                    margin-left: 10px; 
                    flex-wrap: wrap;
                }
            }
        }
    }
}
</style>