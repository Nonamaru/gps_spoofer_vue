<template>
<div class="status" v-if="store.isVisible == true" @mouseleave="store.isVisible = false">
    <div class="info">
        <text :class="{started: store.isStarted}">{{ store.name }}</text>
    </div>
</div>
</template>
<script>
import { useValuesStore } from '@/store';
import { mapStores } from 'pinia';
export default {
    computed:{
        ...mapStores(useValuesStore),
        store(){return this.valuesStore.statusInfo}
    },
};
</script>
<style scoped lang="scss">
.status{
    position: absolute;
    width: 300px;
    top: 1%;
    left: 1%;
    border: 2px solid black;
    // background-color: white;
    border-radius: var(--border-radius);
    z-index: 3;
    padding: 8px;
    color: black;
    backdrop-filter: blur(2px);
    .info{
        font-weight: bold;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        .started{
            animation: 2s sss infinite;
        }
        @keyframes sss {
            0%{
                opacity: .5;
            }
            50% {
                opacity: 1;
            }
            100%{
                opacity: .5;
            }
        }
    }
}
</style>