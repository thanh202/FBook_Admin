<template>
  <h1>Quản lý Thể Loại</h1>
  <div class="d-flex align-center ma-6" style="flex-direction: row-reverse">
    <v-btn color="primary" dark> Thêm Thể Loại </v-btn>
  </div>

  <div class="d-flex align-center flex-column pa-6">
    <v-card width="70%">
      <v-table hover>
        <thead>
          <tr>
            <th class="text-left">Tên Thể Loại</th>

            <th class="text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in desserts" :key="item.name">
            <td class="text-left">{{ item.name }}</td>

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
const pageCount = ref(5);

const desserts = ref([
  {
    name: "Hài Kịch",
  },
  {
    name: "Lãng Mạn",
  },
  {
    name: "Kinh Dị",
  },
  {
    name: "Trinh Thám",
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
