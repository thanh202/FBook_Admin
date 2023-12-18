<template>
  <div class="d-flex align-center flex-column pa-6">
    <h1>Danh sách hóa đơn</h1>

    <v-card width="99%">
      <div class="tk">
        <input
          class="tim"
          v-model="searchKeyword"
          placeholder="Tìm kiếm sách"
        />
        <v-btn class="bnt" color="primary" @click="searill(searchKeyword)"
          >Tìm kiếm</v-btn
        >
      </div>
      <!-- Biểu mẫu Lọc -->
      <form @submit.prevent="searill" class="d-flex">
        <v-row>
          <!-- Ô trạng thái là kiểu select -->
          <v-col cols="12" md="3">
            <v-select
              v-model="searchKeyword"
              :items="statusOptions"
              label="Trạng thái"
            ></v-select>
          </v-col>

          <!-- Nút lọc -->
          <v-col cols="1" md="3">
            <v-btn class="bnt" color="primary" @click="searill(searchKeyword)"
              >loc</v-btn
            >
          </v-col>

          <v-col cols="1" md="3">
            <v-btn class="bnt" color="primary" @click="clear()">Clear</v-btn>
          </v-col>
          <div
            class="d-flex align-center ma-6"
            style="flex-direction: row-reverse"
          >
            <v-btn color="primary" dark @click="exportToExcel"
              >Export Excel</v-btn
            >
          </div>
        </v-row>
      </form>
      <v-table hover>
        <!-- Bảng để hiển thị danh sách sách -->

        <thead>
          <tr>
            <th class="text-left">STT</th>
            <th class="text-left">Trạng thái</th>
            <th class="text-left">Giá(VNĐ)</th>
            <th class="text-left">Khách hàng</th>
            <th class="text-left">Tên sách</th>
            <th class="text-left">Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          <!-- Lặp qua các sách trong danh sách -->
          <tr v-for="(item, index) in list.result" :key="item.IDBill">
            <!-- Hiển thị thông tin sách -->
            <td class="text-left">{{ index + 1 }}</td>
            <td class="text-left">{{ item.Status }}</td>
            <td class="text-left">{{ formatCurrency(item.PriceTotal) }}</td>
            <td class="text-left">{{ item.UserName }}</td>
            <td class="text-left">{{ item.BookName }}</td>
            <td class="text-left">{{ item.Create_at }}</td>
          </tr>
        </tbody>
      </v-table>

      <v-pagination v-model="page" :length="pageCount"> </v-pagination>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import * as XLSX from "xlsx";
export default {
  data() {
    return {
      list: { result: [] },
      searchResultVisible: false,
      statusOptions: ["Đã thanh toán", "Chưa thanh toán"], // Danh sách tùy chọn trạng thái
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.list.total / 10); // Điều chỉnh kích thước trang theo cần thiết
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
      let response = await axios.get("http://localhost:5000/bill/get_list");
      this.list = response.data;
    } catch (error) {
      console.error("Lỗi trong quá trình yêu cầu:", error);
    }
  },
  methods: {
    formatCurrency(value) {
      // Sử dụng Intl.NumberFormat để định dạng số theo định dạng tiền tệ
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    exportToExcel() {
      const data = this.list.result;
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Books");
      XLSX.writeFile(wb, "book_data.xlsx");
    },
    async clear() {
      this.searchKeyword = null; // Đặt giá trị của ô tìm kiếm về rỗng;
      await this.fetchbill();
    },
    async searill(keyword) {
      try {
        if (keyword) {
          const response = await axios.get(
            `http://localhost:5000/bill/search/${keyword}`
          );

          // Kiểm tra log để xem dữ liệu từ server trả về
          console.log("Dữ liệu tìm kiếm:", response.data);

          // Kiểm tra xem response.data có phải là mảng không
          if (Array.isArray(response.data) && response.data.length > 0) {
            this.list.result = response.data;
            this.searchResultVisible = true; // Hiển thị kết quả tìm kiếm
          } else {
            // Nếu không có dữ liệu, ẩn kết quả tìm kiếm
            alert("k cos ");
            this.searchResultVisible = false;
          }
        } else {
          this.searchResultVisible = false; // Ẩn kết quả tìm kiếm
          await this.fetchbill();
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm bill: ", error);
      }
    },
    async fetchbill() {
      try {
        const response = await axios.get("http://localhost:5000/bill/get_list");
        // this.list = response.data;
        this.list.result = response.data.map((item, index) => ({
          ...item,
          index: index + 1,
        }));
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bill: ", error);
      }
    },
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
