<template>
  <div>
    <v-img
      class="mx-auto my-15"
      max-width="228"
      src="/public/logo Fbook.png"
    ></v-img>

    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field
        v-model="email"
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
      ></v-text-field>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Password

        <a
          class="text-caption text-decoration-none text-blue"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Forgot login password?</a
        >
      </div>

      <v-text-field
        v-model="password"
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
      <v-btn block class="mb-8" color="blue" size="large" @click="login">
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

export default {
  data: () => ({
    visible: false,
    email: "",
    password: "",
    loginError: null,
  }),
  methods: {
    async login() {
      try {
        const response = await axios.post(
          "http://localhost:5000/acount/login_admin",
          {
            Email: this.email,
            PassWord: this.password,
          }
        );
        console.log("Server response:", response.data);
        if (response.data.status) {
          const token = response.data.result;
          localStorage.setItem("token", token);

          // Thêm token vào các yêu cầu sau này
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          const storedToken = localStorage.getItem("token");
          if (storedToken) {
            console.log("Đăng nhập thành công");
            console.log("Token:", response.data.result);
            this.$router.push("/list-deltai");
          } else {
            console.error("Lỗi: Token không được lưu vào localStorage.");
          }
        } else {
          this.loginError =
            "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.";
          console.log("Login failed:", response.data.result);
        }
      } catch (error) {
        console.error("Error during login:", error.message);
      }
    },
  },
};
</script>
