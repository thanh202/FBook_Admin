<!-- Các đoạn mã khác không thay đổi -->

<template>
  <div class="d-flex align-center flex-column pa-6">
    <h1>Quản lý Feedback</h1>

    <v-card width="99%">
      <div class="tk">
        <input
          class="tim"
          v-model="searchKeyword"
          placeholder="Tìm kiếm sách"
        />
        <v-btn class="bnt" color="primary" @click="search(searchKeyword)"
          >Tìm kiếm</v-btn
        >
      </div>
      <v-table hover>
        <thead>
          <tr>
            <th class="text-left">STT</th>
            <!-- <th class="text-left">averageRating</th> -->
            <th class="text-left">Nguoi dung</th>
            <th class="text-left">Comment</th>
            <th class="text-left">Rate</th>
            <th class="text-left">Tên Sách</th>
            <th class="text-left">Ngày Tạo</th>
            <th class="text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fe, index) in list.result" :key="fe.IDFeedBack">
            <td class="text-left">{{ index + 1 }}</td>
            <!-- <td class="text-left">{{ fe.averageRating }}</td> -->
            <td class="text-left">{{ fe.UserName }}</td>
            <td class="text-left">{{ fe.Comment }}</td>
            <td class="text-left">{{ fe.Rate }}</td>
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
      page: 1,
      itemsPerPage: 30,
      list: { result: [] },
      types: [],
      dialogAdd: false,
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

      await this.fetchBookList();
    } catch (error) {
      console.error("Lỗi trong quá trình yêu cầu:", error);
      toast.success("Bạn chưa đăng nhập!");
    }
  },

  methods: {
    async search(keyword) {
      try {
        if (keyword) {
          const response = await axios.get(
            `http://localhost:5000/FeedBack/search/${keyword}`
          );

          if (Array.isArray(response.data) && response.data.length > 0) {
            this.list.result = response.data;
            this.searchResultVisible = true;
          } else {
            alert("Không có dữ liệu");
            this.searchResultVisible = false;
          }
        } else {
          this.searchResultVisible = false;
          await this.fetchBookList();
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm bill: ", error);
      }
    },

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

    async deleteItem() {
      if (this.itemToDelete) {
        try {
          const response = await axios.delete(
            `http://localhost:5000/FeedBack/delete/${this.itemToDelete.IDFeedBack}`
          );

          if (response.status === 200) {
            toast.success("Xóa chuong thành công!");
            this.list.result = this.list.result.filter(
              (fe) => fe.IDBook !== this.itemToDelete.IDFeedBack
            );
            await this.fetchBookList();
            this.itemToDelete = null;
          } else {
            console.error("Không thể xóa mục khỏi cơ sở dữ liệu");
            this.showErrorDialog("chuong đang có trong sách ");
            this.itemToDelete = null;
          }
        } catch (error) {
          console.error("Lỗi khi xóa: ", error);
          this.showErrorDialog("Sách đang có trong bill và favorite của khách");
          this.itemToDelete = null;
        }
      }
      this.closeDeleteDialog();
    },

    async getAverageRating(idBook) {
      try {
        const response = await axios.get(
          `http://localhost:5000/FeedBack/average_rating/${idBook}`
        );
        return response.data.averageRating;
      } catch (error) {
        console.error("Lỗi khi lấy averageRating: ", error);
        return "0.0000";
      }
    },

    async fetchBookList() {
      try {
        const response = await axios.get(
          "http://localhost:5000/FeedBack/get_list"
        );
        this.list = response.data;

        // for (const fe of this.list.result) {
        //   fe.averageRating = await this.getAverageRating(fe.IDBook);
        // }

        this.list.result.forEach((fe, index) => {
          this.$set(fe, "STT", index + 1);
        });
      } catch (error) {
        console.error("Lỗi khi lấy danh sách FeedBack: ", error);
      }
    },
  },
};
</script>

<style>
.tim {
  border: 1px solid;
  border-radius: 10px;
  padding: 10px;
  margin: 30px 10px 10px 0px;
}
</style>
