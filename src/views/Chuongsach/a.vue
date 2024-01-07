<template>
    <div class="d-flex align-center flex-column pa-6">
      <h1>Quan lý chuong</h1> 
      <v-card width="99%">
        <v-table hover>
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">Tiêu đề</th>
            <th class="text-left">Nội dung</th>
            <th class="text-left">Tên Sách</th>
            <th class="text-left">Ngày Tạo</th>
            <th class="text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="chapter in chapters" :key="chapter.IDchuong">
            <td class="text-left">{{ chapter.IDchuong }}</td>
            <td class="text-left">{{ chapter.title }}</td>
            <td class="text-left">{{ chapter.content }}</td>
            <td class="text-left">{{ chapter.BookName }}</td>
            <td class="text-left">{{ chapter.Create_at }}</td>
            <td>
              <v-button @click="editChapter(chapter)">Sửa</v-button>
              <v-button @click="deleteChapter(chapter.IDchuong)">Xóa</v-button>
            </td>
          </tr>
        </tbody>
      </v-table>

        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </v-card>
    </div>
  </template>
  
  <script>
  import axios from "axios";

  export default {
    data() {
      return {
        page: 1, // Trang hiện tại
        itemsPerPage: 10, // Số lượng mục trên mỗi trang
        list: { result: [] },
      };
    },
  
    computed: {
      startIndex() {
        return (this.page - 1) * this.itemsPerPage;
      },
      endIndex() {
        return this.startIndex + this.itemsPerPage - 1;
      },
      pageCount() {
        return Math.ceil(this.list.result.length / this.itemsPerPage);
      },
    },
    async mounted() {
      try {
        axios.interceptors.request.use(
          (config) => {
            const token = localStorage.getItem("token");
            if (token) {
              config.headers.Authorization = `${token}`;
              console.log("get token", token);
            }
            return config;
          },
          (error) => {
            return Promise.reject(error);
          }
        );
        let response = await axios.get("http://localhost:5000/chuong/get_list");
        this.list = response.data;
      } catch (error) {
        console.error("Lỗi trong quá trình yêu cầu:", error);
      }
    },
    methods: {
    },
  };
  </script>
  <style>
  .tim {
    border: 1px solid;
    /* width: 70%; */
    border-radius: 10px;
    padding: 10px;
    margin: 30px 10px 10px 0px;
  }
  </style>
  