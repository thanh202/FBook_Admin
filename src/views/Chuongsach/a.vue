<template>
  <div>
    <v-img
      class="mx-auto my-15"
      max-width="228"
      src="../assets/favicon.ico"
    ></v-img>

    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        v-model="identifier"
        required
      ></v-text-field>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Password

        <a
          class="text-caption text-decoration-none text-blue"
          rel="noopener noreferrer"
          target="_blank"
        >
          Forgot login password?</a
        >
      </div>

      <v-text-field
        v-model="newPassword"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
      ></v-text-field>
      <!-- <router-link to="/admin">
        <v-btn block class="mb-8" color="blue" size="large"> Log In </v-btn>
      </router-link> -->
      <v-btn
        block
        class="mb-8"
        color="blue"
        size="large"
        @click="changePassword"
      >
        Log In
      </v-btn>
    </v-card>
    <v-alert v-if="loginError" type="error">
      {{ loginError }}
    </v-alert>
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
