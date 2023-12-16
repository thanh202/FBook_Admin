<template>
  <h1 style="font-size: 30px">Quản lý thông tin người dùng</h1>
  <v-container>
    <v-btn @click="showAddDialog">Thêm mới</v-btn>

    <!-- Bảng để hiển thị danh sách User -->
    <v-data-table :items="list.result" :headers="headers">
      <template v-slot:item="props">
        <tr :key="props.item.IDUser">
          <td>{{ props.item.IDUser }}</td>
          <td>{{ props.item.UserName }}</td>
          <td>{{ props.item.Email }}</td>
          <td>{{ props.item.Birthday }}</td>
          <td>{{ props.item.Phone }}</td>
          <td>
            <v-btn @click="confirmDelete(props.item)">Xóa</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- Hộp thoại Thêm mới user -->
    <v-dialog v-model="isAddDialogVisible">
      <v-card>
        <v-card-text>
          <v-text-field v-model="newUser.UserName" label="Tên "></v-text-field>
          <v-text-field
            v-model="newUser.PassWord"
            label="Mật khẩu"
            type="password"
          ></v-text-field>
          <v-text-field v-model="newUser.Email" label="Email"></v-text-field>
          <v-text-field v-model="newUser.Phone" label="SĐT"></v-text-field>
          <v-text-field
            v-model="newUser.Birthday"
            label="Ngày sinh"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="addNewUser">Thêm</v-btn>
          <v-btn @click="closeAddDialog">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- diloag xoa -->
    <v-dialog v-model="isDeleteDialogVisible">
      <v-card class="d-flex align-center mx-auto">
        <v-card-title>Xác nhận xóa</v-card-title>
        <v-card-text>Bạn có chắc muốn xóa mục này không?</v-card-text>
        <v-card-actions>
          <v-btn @click="deleteUser" color="error">Xóa</v-btn>
          <v-btn @click="closeDeleteDialog">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- thong bao loi -->
    <v-dialog v-model="errorDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline"> Thông Báo Lỗi </v-card-title>
        <v-card-text>{{ errorMessages }}</v-card-text>
        <v-card-actions>
          <v-btn @click="closeErrorDialog">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      list: { result: [] },
      itemToDelete: null,
      isAddDialogVisible: false,
      errorDialog: false,
      errorMessages: null,
      due: null,
      isDeleteDialogVisible: false,
      newUser: {
        UserName: "",
        PassWord: "",
        Email: "",
        Birthday: "",
        Phone: "",
      },

      headers: [
        { text: "IDUser", value: "IDUser" },
        { text: "UserName", value: "UserName" },
        { text: "Email", value: "Email" },
        { text: "Birthday", value: "Birthday" },
        { text: "Phone", value: "Phone" },
        { text: "Thao tác", value: "actions", sortable: false },
      ],
    };
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
      let response = await axios.get("http://localhost:5000/user/get_list");
      this.list = response.data;
    } catch (error) {
      console.error("Lỗi trong quá trình yêu cầu:", error);
    }
  },
  methods: {
    showAddDialog() {
      this.isAddDialogVisible = true;
    },
    closeAddDialog() {
      this.isAddDialogVisible = false;
      this.resetNewUser();
    },
    showErrorDialog(message) {
      this.errorMessages = message;
      this.errorDialog = true;
    },
    closeErrorDialog() {
      this.errorMessages = null;
      this.errorDialog = false;
    },
    showDeleteDialog(item) {
      this.itemToDelete = item;
      this.isDeleteDialogVisible = true;
    },
    closeDeleteDialog() {
      this.isDeleteDialogVisible = false;
      this.itemToDelete = null;
    },
    confirmDelete(item) {
      this.showDeleteDialog(item);
    },
    resetNewUser() {
      this.newUser = {
        UserName: "",
        PassWord: "",
        Email: "",
        Birthday: "",
        Phone: "",
      };
    },
    async addNewUser() {
      if (!this.validateUser()) {
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:5000/user/add",
          this.newUser
        );

        if (response.status === 200) {
          this.isAddDialogVisible = false;
          this.resetNewUser();
          this.fetchUserList();
        }
      } catch (error) {
        console.error("Lỗi khi thêm mới user: ", error);
      }
    },
    validateUser() {
      // Kiểm tra UserName
      if (!this.newUser.UserName) {
        this.showErrorDialog("UserName không được để trống.");
        return false;
      }

      // Kiểm tra Password
      if (this.newUser.PassWord.length < 6) {
        this.showErrorDialog("Password phải có ít nhất 6 ký tự.");
        return false;
      }

      // Kiểm tra Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.newUser.Email)) {
        this.showErrorDialog("Email không hợp lệ.");
        return false;
      }

      // Kiểm tra Birthday (giả sử định dạng là yyyy-mm-dd)
      const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!birthdayRegex.test(this.newUser.Birthday)) {
        this.showErrorDialog(
          "Ngày sinh không hợp lệ. Định dạng phải là yyyy-mm-dd."
        );
        return false;
      }

      // Kiểm tra Phone (giả sử chỉ chấp nhận số điện thoại Việt Nam)
      const phoneRegex = /^\+84\d{9,10}$/;
      if (!phoneRegex.test(this.newUser.Phone)) {
        this.showErrorDialog(
          "Số điện thoại không hợp lệ. Định dạng phải là +840xxxxxxxx."
        );
        return false;
      }

      return true;
    },
    async fetchUserList() {
      try {
        let response = await axios.get("http://localhost:5000/user/get_list");
        this.list = response.data;
      } catch (error) {
        console.error("Lỗi trong quá trình yêu cầu danh sách user:", error);
      }
    },

    async deleteUser() {
      if (this.itemToDelete) {
        try {
          const response = await axios.delete(
            `http://localhost:5000/user/delete/${this.itemToDelete.IDUser}`
          );

          if (response.status === 200) {
            this.list.result = this.list.result.filter(
              (user) => user.IDUser !== this.itemToDelete.IDUser
            );
            this.itemToDelete = null;
          } else {
            this.showErrorDialog(
              "Hay xoa Nguoi dung nay trong Bill va Favotite truoc"
            );
            console.error("Không thể xóa user khỏi cơ sở dữ liệu");
            this.itemToDelete = null;
          }
        } catch (error) {
          this.showErrorDialog(
            "Hay xoa Nguoi dung nay trong Bill va Favotite truoc"
          );
          console.error("Lỗi khi xóa user: ", error);
          this.itemToDelete = null;
        }
      }
      this.closeDeleteDialog();
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
