<template>
  <v-layout>
    <v-navigation-drawer
      v-model="drawer"
      color="#232D3F"
      class="px-0"
      permanent
      :rail="rail"
      ><v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        title="FBook Admin"
      ></v-list-item>
      <v-divider></v-divider>
      <v-list nav class="text-start">
        <router-link to="/list-deltai">
          <v-list-item
            prepend-icon="mdi-bookmark-box"
            @click="console.log('clicked')"
          >
            <v-list-item-title style="margin-left: 10px; font-weight: bold"
              >Quản lý chi tiết sách</v-list-item-title
            >
          </v-list-item>
        </router-link>
      </v-list>
      <v-list nav class="text-start">
        <router-link to="/book-category">
          <v-list-item
            prepend-icon="mdi-book-open"
            @click="console.log('clicked')"
          >
            <v-list-item-title style="margin-left: 10px; font-weight: bold"
              >Quản lý loại sách</v-list-item-title
            >
          </v-list-item>
        </router-link>
      </v-list>
      <v-list nav class="text-start">
        <router-link to="/list-user">
          <v-list-item
            prepend-icon="mdi-account-group"
            @click="console.log('clicked')"
          >
            <v-list-item-title style="margin-left: 10px; font-weight: bold"
              >Quản lý thông tin user</v-list-item-title
            >
          </v-list-item>
        </router-link>
      </v-list>
      <v-list nav class="text-start">
        <router-link to="/aaa">
          <v-list-item
            prepend-icon="mdi-calendar-range"
            @click="console.log('clicked')"
          >
            <v-list-item-title style="margin-left: 10px; font-weight: bold"
              >Quản lý hóa đơn</v-list-item-title
            >
          </v-list-item>
        </router-link>
      </v-list>
      <v-list nav class="text-start">
        <router-link to="/aaa">
          <v-list-item
            prepend-icon="mdi-message-badge-outline"
            @click="console.log('clicked')"
          >
            <v-list-item-title style="margin-left: 10px; font-weight: bold"
              >Quản lý thông báo</v-list-item-title
            >
          </v-list-item>
        </router-link>
      </v-list>
      <v-list nav class="text-start">
        <router-link to="/aaa">
          <v-list-item
            prepend-icon="mdi-clipboard-text-clock"
            @click="console.log('clicked')"
          >
            <v-list-item-title style="margin-left: 10px; font-weight: bold"
              >Lịch sử giao dịch</v-list-item-title
            >
          </v-list-item>
        </router-link>
      </v-list>
      <v-list nav class="text-start">
        <router-link to="/aaa">
          <v-list-item
            prepend-icon="mdi-calendar-text"
            @click="console.log('clicked')"
          >
            <v-list-item-title style="margin-left: 10px; font-weight: bold"
              >Thống Kê</v-list-item-title
            >
          </v-list-item>
        </router-link>
      </v-list>
      <template v-slot:append>
        <div class="pa-0">
          <router-link to="/">
            <v-list-item
              prepend-icon="mdi-logout"
              @click="console.log('clicked')"
            >
              <v-list-item-title style="margin-right: 40px"
                >Đăng Xuất</v-list-item-title
              >
            </v-list-item>
          </router-link>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar color="blue" density="compact">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      <template v-slot:append>
        <v-btn icon="mdi-bell"></v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref } from "vue";
const drawer = ref(true);
</script>

<style lang="scss">
#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  a {
    text-decoration: none;
    color: #ffffff;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
