<template>
  <div>
    <h1 style="font-size: 30px">Đổi mật khẩu</h1>
    <form @submit.prevent="changePassword">
      <label for="identifier">Email hoặc Số điện thoại:</label>
      <input type="text" v-model="identifier" required />

      <label for="newPassword">Mật khẩu mới:</label>
      <input type="password" v-model="newPassword" required />

      <button type="submit">Đổi mật khẩu</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      identifier: "",
      newPassword: "",
    };
  },
  methods: {
    async changePassword() {
      try {
        const apiUrl = "http://localhost:5000/acount/change_password";
        const requestData = {
          identifier: this.identifier,
          newPassword: this.newPassword,
        };

        // Gửi request PUT đến API
        const response = await axios.put(apiUrl, requestData);

        // Kiểm tra trạng thái của response
        if (response.status === 200) {
          toast.success("Đổi mật khẩu thành công!");
        } else {
          toast.error("Đổi mật khẩu thất bại. Vui lòng thử lại sau.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API đổi mật khẩu:", error);
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    },
  },
};
</script>

<style>
/* Thêm các style cần thiết tại đây */
</style>
