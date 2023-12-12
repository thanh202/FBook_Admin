<template>
  <h1 class="ma-5">Danh Sách Lịch Sử Giao Dịch</h1>

  <div class="d-flex align-center flex-column pa-6">
    <v-card width="90%">
      <v-table hover>
        <thead>
          <tr>
            <th class="text-left">Ngày Giao Dịch</th>
            <th class="text-left">Tên Khách Hàng</th>
            <th class="text-left">Tên Sách</th>
            <th class="text-left">Loại Sách</th>
            <th class="text-left">Tổng Tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in desserts" :key="item.name">
            <td class="text-left">{{ item.datetime }}</td>
            <td class="text-left">{{ item.customer }}</td>
            <td class="text-left">{{ item.namebook }}</td>
            <td class="text-left">{{ item.category }}</td>
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
    datetime: "23:23 27/11/2023",
    customer: "Vanh Hoa Hoe",
    namebook: "Harry potter và hòn đá phù thủy",
    category: "Tiểu Thuyết",
    price: "100.000đ",
  },
  {
    datetime: "23:23 27/11/2023",
    customer: "Linh Lụa",
    namebook: "Thanh Gươm diệt Lợn",
    category: "Hài Kịch",
    price: "20.000đ",
  },
  {
    datetime: "23:23 27/11/2023",
    customer: "Tung Tinh Tướng",
    namebook: "PepSi trong chai cocacola",
    category: "Lãng mạng",
    price: "30.000đ",
  },
  {
    datetime: "23:23 27/11/2023",
    customer: "Thành dz",
    namebook: "Trạm",
    category: "Trinh Thám",
    price: "300.000đ",
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
