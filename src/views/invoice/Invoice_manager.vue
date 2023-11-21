<template>
  <h1 class="ma-5">Danh Sách Hóa Đơn</h1>

  <div class="d-flex align-center flex-column pa-6">
    <v-card width="90%">
      <v-table hover>
        <thead>
          <tr>
            <th class="text-left">Mã Hóa Đơn</th>
            <th class="text-left">Tên Sách</th>
            <th class="text-left">Tên Loại Sách</th>
            <th class="text-left">Ngày Mua</th>
            <th class="text-left">Tổng Tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in desserts" :key="item.name">
            <td class="text-left">{{ item.id }}</td>
            <td class="text-left">{{ item.namebook }}</td>
            <td class="text-left">{{ item.category }}</td>
            <td class="text-left">{{ item.datetime }}</td>
            <td class="text-left">{{ item.price }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
    <v-pagination v-model="page" :length="pageCount"> </v-pagination>
  </div>
</template>

<script setup>
import { ref } from "vue";
const page = ref(1);
const pageCount = ref(8);
const desserts = ref([
  {
    id: "PH24242",
    namebook: "Harry potter và hòn đá phù thủy",
    category: "Tiểu Thuyết",
    datetime: "23:23 27/11/2023",
    price: "100.000đ",
  },
  {
    id: "PH24242",
    namebook: "Harry potter và hòn đá phù thủy",
    category: "Tiểu Thuyết",
    datetime: "23:23 27/11/2023",
    price: "100.000đ",
  },
  {
    id: "PH24242",
    namebook: "Harry potter và hòn đá phù thủy",
    category: "Tiểu Thuyết",
    datetime: "23:23 27/11/2023",
    price: "100.000đ",
  },
  {
    id: "PH24242",
    namebook: "Harry potter và hòn đá phù thủy",
    category: "Tiểu Thuyết",
    datetime: "23:23 27/11/2023",
    price: "100.000đ",
  },
  {
    id: "PH24242",
    namebook: "Harry potter và hòn đá phù thủy",
    category: "Tiểu Thuyết",
    datetime: "23:23 27/11/2023",
    price: "100.000đ",
  },
]);
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
