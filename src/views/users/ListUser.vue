<template>
  <h1 style="font-size: 30px">Quản lý thông tin người dùng</h1>
  <v-container>
    <v-table class="table1">
      <colgroup>
        <col class="a" style="width: 10%" />
        <col class="b" style="width: 20%" />
        <col class="c" style="width: 10%" />
        <col class="d" style="width: 20%" />
        <col class="e" style="width: 20%" />
      </colgroup>
      <thead>
        <tr>
          <th class="text-left a">STT</th>
          <th class="text-left b">UserName</th>

          <th class="text-left d">Email</th>
          <th class="text-left e">Birthday</th>
          <th class="text-left f">Phone</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in list.result" :key="user.IDUser">
          <td>{{ index + 1 }}</td>
          <td>{{ user.UserName }}</td>

          <!-- <td @click="console.log(user.image)">
            <v-img
              style="width: 6vh"
              :src="'http://localhost:5000/' + user.img"
              alt="Hình ảnh user"
              id="imgs"
            ></v-img>
          </td> -->

          <td>{{ user.Email }}</td>
          <td>{{ user.Birthday }}</td>
          <td>{{ user.Phone }}</td>
        </tr>
      </tbody>
    </v-table>

    <!-- Hộp thoại Thêm mới user -->
    <!-- <v-dialog v-model="isAddDialogVisible">
      <v-card>
        <v-card-text>
          <v-text-field v-model="newUser.UserName" label="Tên "></v-text-field>
          <v-col cols="6">
            <input type="file" accept="image/*" @change="handleImageUpload" />
            <v-img
              v-if="selectedImage"
              :src="'http://localhost:5000/' + selectedImage"
              alt="Hình ảnh đã chọn"
              id="img2"
            ></v-img>
          </v-col>
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
    </v-dialog> -->
    <!-- diloag xoa -->
    <!-- <v-dialog v-model="isDeleteDialogVisible">
      <v-card class="d-flex align-center mx-auto">
        <v-card-title>Xác nhận xóa</v-card-title>
        <v-card-text>Bạn có chắc muốn xóa mục này không?</v-card-text>
        <v-card-actions>
          <v-btn @click="deleteUser" color="error">Xóa</v-btn>
          <v-btn @click="closeDeleteDialog">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
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
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export default {
  data() {
    return {
      list: { result: [] },
      itemToDelete: null,
      isAddDialogVisible: false,
      errorDialog: false,
      errorMessages: null,
      selectedImage: null,
      due: null,
      isDeleteDialogVisible: false,
      // newUser: {
      //   UserName: "",
      //   PassWord: "",
      //   Email: "",
      //   Birthday: "",
      //   Phone: "",
      // },

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
      toast.success("Bạn chưa đăng nhập!");
    }
  },
  methods: {
    // handleImageUpload(event) {
    //   const file = event.target.files[0];
    //   if (file) {
    //     const formData = new FormData();
    //     formData.append("image", file);

    //     // Gửi yêu cầu HTTP POST để tải lên hình ảnh lên server
    //     axios
    //       .post("http://localhost:5000/user/upload", formData)
    //       .then((response) => {
    //         if (response.status === 200) {
    //           // Lưu đường dẫn ảnh đã tải lên
    //           this.selectedImage = response.data.imageUrl;

    //           // Hiển thị ảnh đã chọn
    //           const addDialogImg = this.$refs.addDialogImg;
    //           const editDialogImg = this.$refs.editDialogImg;
    //           const editDialogSelectedImg = this.$refs.editDialogSelectedImg;

    //           if (addDialogImg) {
    //             addDialogImg.src = response.data.imageUrl;
    //           }
    //           if (editDialogImg) {
    //             editDialogImg.src = response.data.imageUrl;
    //           }
    //           if (editDialogSelectedImg) {
    //             editDialogSelectedImg.src = response.data.imageUrl;
    //           }
    //         } else {
    //           console.error("Lỗi khi tải lên hình ảnh");
    //         }
    //       })
    //       .catch((error) => {
    //         console.error("Lỗi khi tải lên hình ảnh:", error);
    //       });
    //   }
    // },

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
    // resetNewUser() {
    //   this.newUser = {
    //     UserName: "",
    //     PassWord: "",
    //     Email: "",
    //     Birthday: "",
    //     Phone: "",
    //   };
    // },
    // async addNewUser() {
    //   if (!this.validateUser()) {
    //     return;
    //   }
    //   try {
    //     const response = await axios.post(
    //       "http://localhost:5000/user/add",
    //       this.newUser
    //     );

    //     if (response.status === 200) {
    //       toast.success("Thêm người dùng thành công!");
    //       this.isAddDialogVisible = false;
    //       this.resetNewUser();
    //       this.fetchUserList();
    //     }
    //   } catch (error) {
    //     console.error("Lỗi khi thêm mới user: ", error);
    //   }
    // },
    // validateUser() {
    //   // Kiểm tra UserName
    //   if (!this.newUser.UserName) {
    //     this.showErrorDialog("UserName không được để trống.");
    //     return false;
    //   }

    //   // Kiểm tra Password
    //   if (this.newUser.PassWord.length < 6) {
    //     this.showErrorDialog("Password phải có ít nhất 6 ký tự.");
    //     return false;
    //   }

    //   // Kiểm tra Email
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   if (!emailRegex.test(this.newUser.Email)) {
    //     this.showErrorDialog("Email không hợp lệ.");
    //     return false;
    //   }

    //   // Kiểm tra Birthday (giả sử định dạng là yyyy-mm-dd)
    //   const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/;
    //   if (!birthdayRegex.test(this.newUser.Birthday)) {
    //     this.showErrorDialog(
    //       "Ngày sinh không hợp lệ. Định dạng phải là yyyy-mm-dd."
    //     );
    //     return false;
    //   }

    //   // Kiểm tra Phone (giả sử chỉ chấp nhận số điện thoại Việt Nam)
    //   const phoneRegex = /^\+84\d{9,10}$/;
    //   if (!phoneRegex.test(this.newUser.Phone)) {
    //     this.showErrorDialog(
    //       "Số điện thoại không hợp lệ. Định dạng phải là +840xxxxxxxx."
    //     );
    //     return false;
    //   }

    //   return true;
    // },
    async fetchUserList() {
      try {
        let response = await axios.get("http://localhost:5000/user/get_list");
        this.list = response.data;
      } catch (error) {
        console.error("Lỗi trong quá trình yêu cầu danh sách user:", error);
      }
    },

    // async deleteUser() {
    //   if (this.itemToDelete) {
    //     try {
    //       const response = await axios.delete(
    //         `http://localhost:5000/user/delete/${this.itemToDelete.IDUser}`
    //       );

    //       if (response.status === 200) {
    //         toast.success("Xóa người dùng thành công!");
    //         this.list.result = this.list.result.filter(
    //           (user) => user.IDUser !== this.itemToDelete.IDUser
    //         );
    //         this.itemToDelete = null;
    //       } else {
    //         this.showErrorDialog(
    //           "Hay xoa Nguoi dung nay trong Bill va Favotite truoc"
    //         );
    //         console.error("Không thể xóa user khỏi cơ sở dữ liệu");
    //         this.itemToDelete = null;
    //       }
    //     } catch (error) {
    //       this.showErrorDialog(
    //         "Hay xoa Nguoi dung nay trong Bill va Favotite truoc"
    //       );
    //       console.error("Lỗi khi xóa user: ", error);
    //       this.itemToDelete = null;
    //     }
    //   }
    //   this.closeDeleteDialog();
    // },
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
.table1 {
  background-color: #f2f2f2; /* Màu xám nhạt */
  border-collapse: collapse; /* Gộp các đường biên */
  width: 100%; /* Chiều rộng 100% của bảng */
}
.table1 tbody tr:nth-child(odd) {
  background-color: #ffffff; /* Màu nền của dòng chẵn */
}

.table1 tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* Màu nền của dòng lẻ */
}
.table1 td,
.table1 th {
  border: 1px solid #dddddd; /* Màu viền của ô */
  padding: 8px; /* Khoảng cách giữa nội dung và viền */
  text-align: left; /* Căn lề văn bản sang trái */
}
.table1 th {
  color: #333333; /* Màu chữ cho tiêu đề */
}
.table1 v-btn {
  color: #ffffff; /* Màu chữ cho nút */
  background-color: #ff0000; /* Màu nền cho nút (ví dụ: đỏ) */
  border: none; /* Xóa đường viền của nút */
  padding: 8px 16px; /* Kích thước của nút */
  cursor: pointer; /* Hiển thị con trỏ khi rê chuột vào nút */
}
.table1 th {
  font-weight: bold; /* In đậm */
  color: #333333; /* Màu chữ cho tiêu đề */
}
.table1 tbody tr:hover {
  background-color: #e0e0e0; /* Màu nền khi hover */
}
.table1 v-btn {
  transition: background-color 0.3s ease; /* Hiệu ứng chuyển động trong 0.3 giây */
}
.table1 v-btn:hover {
  background-color: #cc0000; /* Màu nền khi hover (đỏ đậm hơn) */
}
.table1 th {
  border-bottom: 2px solid #dddddd; /* Biên dưới cho tiêu đề cột */
}
</style>
