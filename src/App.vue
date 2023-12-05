<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <router-view :page="page" />
  <div class="menu">
    <div class="center">
      <div 
        class="menu-element" 
        :class="{SelectedElement: page == 'spoofing'}"
        @click="page = 'spoofing'"
      >
        <Icon class="icon" icon="mdi:drone" />
        <text v-if="page != 'spoofing'">Спуфинг</text>
      </div>
      <div 
        class="menu-element" 
        :class="{SelectedElement: page == 'reports'}"
        @click="page = 'reports'"
      >
        <Icon class="icon" icon="carbon:report" />
        <text v-if="page != 'reports'">Отчеты</text>
      </div>
      <div 
        class="menu-element" 
        :class="{SelectedElement: page == 'system'}"
        @click="page = 'system'"
      >
        <Icon class="icon" icon="mdi:monitor-eye" />
        <text v-if="page != 'system'">Система</text>
      </div>
      <div 
        class="menu-element" 
        :class="{SelectedElement: page == 'settings'}"
        @click="page = 'settings'"
      >
        <Icon class="icon" icon="material-symbols:settings" />
        <text v-if="page != 'settings'">Настройки</text>
      </div>
    </div>
    <div class="version"><text>v. 1.0</text></div>
  </div>
</template>
<script>
import { Icon } from '@iconify/vue';
export default {
  components:{
    Icon,
  },
  data(){
    return{
      page: 'spoofing',
    }
  }
}
</script>
<style lang="scss">
*{
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  user-select: none;
}

:root{
  --button-all-color: #61B7CF;
  --button-hover: #057D9F;
  --border-radius: 3px;
}

.menu{
  display: grid;
  grid-template-rows: 20% 1fr 20%;
  gap: 2%;
  height: 100vh;
  width: 100px;
  -webkit-box-shadow: -11px 0px 30px -7px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: -11px 0px 30px -7px rgba(34, 60, 80, 0.2);
  box-shadow: -11px 0px 30px -7px rgba(34, 60, 80, 0.2);
  .center{
    grid-row: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .SelectedElement{
      width: 60px;
      height: 60px;
      padding: 5px;
      border-radius: 6px;
      background-color: lightgray;
      pointer-events: none;
    }
    .menu-element{
      // border: 1px solid black;
      width: 60px;
      height: 60px;
      padding: 5px;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 1rem;
      &:hover{
        color: gray;
        cursor: pointer;
      }
      .icon{
        width: 50%;
        height: 50%;
      }
    }
  }
  .version{
    grid-row: 3;
    font-weight: bold;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
}
// nav {
//   padding: 30px;

//   a {
//     font-weight: bold;
//     color: #2c3e50;

//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
