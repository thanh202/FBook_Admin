<template>

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
          <td>
            <v-btn @click="editItem(props.item)">Sửa</v-btn>
            <v-btn @click="confirmDeleteUser(props.item)">Xóa</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- Hộp thoại Thêm mới user -->
    <v-dialog v-model="isAddDialogVisible">
      <v-card>
        <v-card-text>
          <v-text-field
            v-model="newUser.UserName"
            label="UserName"
          ></v-text-field>
          <v-text-field
            v-model="newUser.PassWord"
            label="Password"
            type="password"
          ></v-text-field>
          <v-text-field v-model="newUser.Email" label="Email"></v-text-field>
          <v-text-field
            v-model="newUser.Birthday"
            label="Birthday"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="addNewUser">Thêm</v-btn>
          <v-btn @click="closeAddDialog">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- Hộp thoại Sửa user -->
    <v-dialog v-model="isEditDialogVisible">
      <v-card>
        <v-card-text>
          <v-text-field
            v-model="editingUser.UserName"
            label="UserName"
          ></v-text-field>
          <v-text-field
            v-model="editingUser.PassWord"
            label="Password"
            type="password"
          ></v-text-field>
          <v-text-field
            v-model="editingUser.Email"
            label="Email"
          ></v-text-field>
          <v-text-field
            v-model="editingUser.Birthday"
            label="Birthday"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="saveEditedUser">Lưu</v-btn>
          <v-btn @click="closeEditDialog">Hủy</v-btn>
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
      newUser: {
        UserName: "",
        PassWord: "",
        Email: "",
        Birthday: "",
      },
      isEditDialogVisible: false,
      editingUser: {
        IDUser: null,
        UserName: "",
        PassWord: "",
        Email: "",
        Birthday: "",
      },
      headers: [
        { text: "IDUser", value: "IDUser" },
        { text: "UserName", value: "UserName" },
        { text: "Email", value: "Email" },
        { text: "Birthday", value: "Birthday" },
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
    resetNewUser() {
      this.newUser = {
        UserName: "",
        PassWord: "",
        Email: "",
        Birthday: "",
      };
    },
    async addNewUser() {
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
    editItem(user) {
      if (user && user.IDUser) {
        this.editingUser = { ...user };
        this.isEditDialogVisible = true;
      }
    },

    closeEditDialog() {
      this.isEditDialogVisible = false;
      this.editingUser = {
        IDUser: null,
        UserName: "",
        PassWord: "",
        Email: "",
        Birthday: "",
      };

    },
    async saveEditedUser() {
      try {
        const response = await axios.put(
          `http://localhost:5000/user/update/${this.editingUser.IDUser}`,
          this.editingUser
        );

        if (response.status === 200) {
          const updatedIndex = this.list.result.findIndex(
            (user) => user.IDUser === this.editingUser.IDUser
          );

          if (updatedIndex !== -1) {
            this.list.result[updatedIndex] = response.data.result;
          }

          this.isEditDialogVisible = false;
          this.editingUser = {
            IDUser: null,
            UserName: "",
            PassWord: "",
            Email: "",
            Birthday: "",
          };
          this.fetchUserList();
        }
      } catch (error) {
        console.error("Lỗi khi lưu sửa user: ", error);
      }
    },
    async fetchUserList() {
      try {
        let response = await axios.get("http://localhost:5000/user/get_list");
        this.list = response.data;
      } catch (error) {
        console.error("Lỗi trong quá trình yêu cầu danh sách user:", error);
      }
    },
    confirmDeleteUser(user) {
      this.itemToDelete = user;
      this.deleteUser();
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
            console.error("Không thể xóa user khỏi cơ sở dữ liệu");
            this.itemToDelete = null;
          }
        } catch (error) {
          console.error("Lỗi khi xóa user: ", error);
          this.itemToDelete = null;
        }
      }
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
