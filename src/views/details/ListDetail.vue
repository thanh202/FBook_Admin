<template>
  <h1>Quản lý chi tiết sách</h1>
  <div class="d-flex align-center ma-6" style="flex-direction: row-reverse">
    <v-btn color="primary" dark> Thêm Sách </v-btn>
  </div>

  <div class="d-flex align-center flex-column pa-6">
    <v-card width="99%">
      <v-table hover>
        <thead>
          <tr>
            <th class="text-left">Tên Sách</th>
            <th class="text-left">Ảnh</th>
            <th class="text-left">Giá</th>
            <th class="text-left">Tên Tác Giả</th>
            <th class="text-left">Quốc Gia</th>
            <th class="text-left">Thể Loại</th>
            <th class="text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in desserts" :key="item.name">
            <td class="text-left">{{ item.name }}</td>
            <td @click="console.log(item.image)">
              <v-img
                :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/${item.image}`"
              ></v-img>
            </td>

            <td class="text-left">{{ item.price }}</td>
            <td class="text-left">{{ item.author }}</td>
            <td class="text-left">{{ item.country }}</td>
            <td class="text-left">{{ item.type }}</td>
            <td>
              <v-card-actions>
                <v-icon variant="text" @click="close"> mdi-pencil </v-icon>

                <v-icon variant="text" @click="save"> mdi-delete </v-icon>
              </v-card-actions>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-pagination v-model="page" :length="pageCount"> </v-pagination>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
const page = ref(1);
const pageCount = ref(8);

const desserts = ref([
  {
    name: "Nebula GTX 3080",
    image: "1.png",
    price: 699.99,
    author: "Tùng Tinh Tướng",
    country: "Viet Nam",
    type: "Hài Kịnh",
  },
  {
    name: "Galaxy RTX 3080",
    image: "2.png",
    price: 799.99,
    author: "Linh Lụa",
    country: "Nhật Bản",
    type: "Lãng Xẹt",
  },
  {
    name: "Orion RX 6800 XT",
    image: "3.png",
    price: 799.99,
    author: "Giang jj đó",
    country: "Đức",
    type: "Kinh Dị",
  },
  {
    name: "Vortex RTX 3090",
    image: "4.png",
    price: 1499.99,
    author: "Thành dz",
    country: "Anh Quốc",
    type: "Trinh Thám",
  },
  {
    name: "Cosmos GTX 1660 Super",
    image: "5.png",
    price: 299.99,
    author: "Long Xing Gái",
    country: "Hàn Xẻng",
    type: "Tiểu Thuyết",
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
