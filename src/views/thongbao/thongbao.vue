<template>
  <div class="d-flex align-center flex-column pa-6">
    <h1>Quản lý thông báo</h1>

    <v-card width="99%">
      <div class="tk"></div>
      <v-table hover>
        <thead>
          <tr>
            <th class="text-left">STT</th>
            <th class="text-left">Người dùng</th>
            <th class="text-left">Comment</th>
            <th class="text-left">Tên Sách</th>

            <th class="text-left">Ngày Gửi</th>
            <th class="text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fe, index) in displayedList" :key="fe.IDNoti">
            <td class="text-left">{{ index + 1 }}</td>
            <!-- Sử dụng chỉ số để tăng giá trị từ 1 -->
            <td class="text-left">{{ fe.UserName }}</td>
            <td class="text-left">{{ fe.title }}</td>
            <td class="text-left">{{ fe.BookName }}</td>

            <td class="text-left">{{ fe.Create_at }}</td>
            <td>
              <v-card-actions>
                <v-icon variant="text" @click="confirmDelete(fe)">
                  mdi-delete
                </v-icon>
              </v-card-actions>
            </td>
          </tr>
        </tbody>
      </v-table>
      <!-- diloag -->

      <v-dialog v-model="isDeleteDialogVisible">
        <v-card class="d-flex align-center mx-auto">
          <v-card-title>Xác nhận xóa</v-card-title>
          <v-card-text>Bạn có chắc muốn xóa mục này không?</v-card-text>
          <v-card-actions>
            <v-btn @click="deleteItem" color="error">Xóa</v-btn>
            <v-btn @click="closeDeleteDialog">Hủy</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export default {
  data() {
    return {
      searchResultVisible: false,
      isAddDialogVisible: false,
      itemToDelete: null,
      isDeleteDialogVisible: false,
      page: 1, // Trang hiện tại
      itemsPerPage: 10, // Số lượng mục trên mỗi trang
      list: { result: [] },
      types: [], // Danh sách sách
      dialogAdd: false, // Add this line
    };
  },

  computed: {
    displayedList() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.list.result.slice(start, end);
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
      let responseTypes = await axios.get(
        "http://localhost:5000/Book/get_list"
      );
      this.types = responseTypes.data.result;

      let response = await axios.get("http://localhost:5000/Noti/get_list");
      console.log("Server Response:", response.data);

      // Log server response
      this.list = response.data;
      this.originalList = JSON.parse(JSON.stringify(response.data)); // Copy data
    } catch (error) {
      console.error("Lỗi trong quá trình yêu cầu:", error);
      toast.success("Bạn chưa đăng nhập!");
    }
  },
  methods: {
    showDeleteDialog(fe) {
      this.itemToDelete = fe;
      this.isDeleteDialogVisible = true;
    },
    closeDeleteDialog() {
      this.isDeleteDialogVisible = false;
      this.itemToDelete = null;
    },
    confirmDelete(fe) {
      this.showDeleteDialog(fe);
    },
    // Hiển thị hộp thoại Thêm mới danh mục

    // xóa
    async deleteItem() {
      if (this.itemToDelete) {
        try {
          // Gửi yêu cầu HTTP DELETE để xóa một danh mục
          const response = await axios.delete(
            `http://localhost:5000/Noti/delete/${this.itemToDelete.IDNoti}`
          );

          if (response.status === 200) {
            toast.success("Xóa thông báo thành công!");
            // Xóa thành công khỏi cơ sở dữ liệu, bây giờ hãy cập nhật danh sách cục bộ
            this.list.result = this.list.result.filter(
              (fe) => fe.IDBook !== this.itemToDelete.IDNoti
            );
            this.fetchBookList();
            this.itemToDelete = null;
          } else {
            // Xử lý trường hợp xóa khỏi cơ sở dữ liệu thất bại
            console.error("Không thể xóa mục khỏi cơ sở dữ liệu");

            this.itemToDelete = null; // Xóa mục khỏi biến itemToDelete để ngăn chặn các thử nghiệm xóa tiếp theo
          }
        } catch (error) {
          console.error("Lỗi khi xóa: ", error);

          this.itemToDelete = null;

          // Xóa mục khỏi biến itemToDelete để ngăn chặn các thử nghiệm xóa tiếp theo
        }
      }
      this.closeDeleteDialog();
    },

    async fetchBookList() {
      try {
        const response = await axios.get("http://localhost:5000/Noti/get_list");
        this.list = response.data;

        // Thêm đoạn mã sau để cập nhật thuộc tính STT (index)
        this.list.result.forEach((fe, index) => {
          this.$set(fe, "STT", index + 1);
        });
      } catch (error) {
        console.error("Lỗi khi lấy danh sách Noti: ", error);
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
