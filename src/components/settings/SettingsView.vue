<template>
<div class="settings">
    <div class="settings-header">Настройки</div>
    <div class="settings-view">
        <div class="setting">
            <text>Настройки сети</text>
            <input type="text" placeholder="192.168.0.121" />
            <button @click="saveFunc('net')">
                <text v-if="!network">Сохранить</text>
                <text v-if="network">Сохранено!</text>
            </button>
        </div>
        <div class="setting">
            <text>Выбор места хранения</text>
            <input type="text" placeholder="/save" />
            <button @click="saveFunc('stor')">
                <text v-if="!storage">Сохранить</text>
                <text v-if="storage">Сохранено!</text>
            </button>
        </div>
        <div class="setting">
            <text>Обновление системы</text>
            <text>{{status ? "Доступны обновления" : "Новых обновлений нет!"}}</text>
            <button :class="{buttonDisabled: !status}" @click="console.log(123)">Обновить</button>
        </div>
    </div>
</div>
</template>
<script>
export default{
    data(){
        return{
            status: false,
            network: false,
            storage: false,
        }
    },
    methods:{
        saveFunc(whatSave){
            if(whatSave == 'net'){
                this.network = true;
                setTimeout(() => this.network = false, 2000);
            } else if(whatSave == 'stor'){
                this.storage = true;
                setTimeout(() => this.storage = false, 2000);
            }
        }
    }
}
</script>
<style scoped lang="scss">
.settings{
    width: 99%;
    height: 100%;
    .settings-header{
        font-size: 2rem;
        text-align: left;
        padding: 20px;
    }
    .settings-view{
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        gap: 20px;
        input{ 
            padding: 8px 16px;
            width: 93.5%;
            border: 1px solid lightgray;
            border-radius: var(--border-radius);
            margin-bottom: 10px;
            font-size: 1rem;
            &:focus{
                outline: none;
                border-color: black;
            }
        }
        button{
            width: 100%;
            color: black;
            border: 1px solid black;
            display: flex;
            justify-content: center;
            padding: 8px 16px;
            background-color: white;
            font-size: 1rem;
            border-radius: var(--border-radius);
            &:hover{
                border-color: gray;
                cursor: pointer;
            }
            &:active{
                font-size: bold;
                border-color: black;
                background-color: black;
                color: white;
            }
        }
        .buttonDisabled{
            pointer-events: none;
            color: gray;
            border-color: gray;
        }
        .setting{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
    }
}
</style>