<template>
  <div>
    <button @click="showAddDialog">Thêm mới</button>

    <!-- Bảng để hiển thị danh sách admin -->
    <table>
      <thead>
        <tr>
          <th>IDAdmin</th>
          <th>AdminName</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <!-- Lặp qua các admin trong danh sách -->
        <tr v-for="admin in list.result" :key="admin?.IDAdmin">
          <!-- Hiển thị thông tin admin -->
          <td>{{ admin?.IDAdmin }}</td>
          <td>{{ admin?.AdminName }}</td>
          <td>{{ admin?.Email }}</td>
          <td>{{ admin?.Phone }}</td>
          <td>
            <!-- Nút để sửa và xóa admin -->
            <button @click="editItem(admin)">Sửa</button>
            <button @click="confirmDelete(admin)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Hộp thoại Thêm mới admin -->
    <div v-if="isAddDialogVisible">
      <input v-model="newAdmin.AdminName" placeholder="AdminName" />
      <input
        v-model="newAdmin.PassWord"
        type="password"
        placeholder="Password"
      />
      <input v-model="newAdmin.Email" placeholder="Email" />
      <input v-model="newAdmin.Phone" placeholder="Phone" />

      <button @click="addNewAdmin">Thêm</button>
      <button @click="closeAddDialog">Hủy</button>
    </div>

    <!-- Hộp thoại Sửa admin -->
    <div v-if="isEditDialogVisible">
      <input v-model="editingAdmin.AdminName" placeholder="AdminName" />
      <input
        v-model="editingAdmin.PassWord"
        type="password"
        placeholder="Password"
      />
      <input v-model="editingAdmin.Email" placeholder="Email" />
      <input v-model="editingAdmin.Phone" placeholder="Phone" />

      <button @click="saveEditedAdmin">Lưu</button>
      <button @click="closeEditDialog">Hủy</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminManagement",
  data() {
    return {
      // Các thuộc tính dữ liệu ban đầu
      list: { result: [] },
      itemToDelete: null,
      isAddDialogVisible: false,
      newAdmin: {
        AdminName: "",
        PassWord: "",
        Email: "",
        Phone: "",
      },
      isEditDialogVisible: false,
      editingAdmin: {
        IDAdmin: null,
        AdminName: "",
        PassWord: "",
        Email: "",
        Phone: "",
      },
    };
  },
  async mounted() {
    // Lấy danh sách admin ban đầu khi component được mount
    try {
      let response = await axios.get("http://localhost:5000/admin/get_list");
      this.list = response.data;
    } catch (error) {
      console.error("Lỗi trong quá trình yêu cầu:", error);
    }
  },
  methods: {
    // Hiển thị hộp thoại Thêm mới admin
    showAddDialog() {
      this.isAddDialogVisible = true;
    },

    // Đóng hộp thoại Thêm mới admin
    closeAddDialog() {
      this.isAddDialogVisible = false;
      this.resetNewAdmin();
    },

    // Đặt lại giá trị của newAdmin
    resetNewAdmin() {
      this.newAdmin = {
        AdminName: "",
        PassWord: "",
        Email: "",
        Phone: "",
      };
    },

    // Thêm mới một admin
    async addNewAdmin() {
      try {
        const response = await axios.post(
          "http://localhost:5000/admin/add",
          this.newAdmin
        );

        if (response.status === 200) {
          this.isAddDialogVisible = false;
          this.resetNewAdmin();
          this.fetchAdminList(); // Gọi lại API để lấy danh sách mới
        }
      } catch (error) {
        console.error("Lỗi khi thêm mới admin: ", error);
      }
    },
    // Thiết lập hộp thoại Sửa admin
    editItem(admin) {
      if (admin && admin.IDAdmin) {
        this.editingAdmin = { ...admin };
        this.isEditDialogVisible = true;
      }
    },

    // Đóng hộp thoại Sửa admin
    closeEditDialog() {
      this.isEditDialogVisible = false;
      this.editingAdmin = {
        IDAdmin: null,
        AdminName: "",
        PassWord: "",
        Email: "",
        Phone: "",
      };
    },
    // Lưu sửa admin
    async saveEditedAdmin() {
      try {
        const response = await axios.put(
          `http://localhost:5000/admin/update/${this.editingAdmin.IDAdmin}`,
          this.editingAdmin
        );

        if (response.status === 200) {
          const updatedIndex = this.list.result.findIndex(
            (admin) => admin.IDAdmin === this.editingAdmin.IDAdmin
          );

          if (updatedIndex !== -1) {
            // Sử dụng cú pháp thông thường để cập nhật mảng
            this.list.result[updatedIndex] = response.data.result;
          }

          this.isEditDialogVisible = false;
          this.editingAdmin = {
            IDAdmin: null,
            AdminName: "",
            PassWord: "",
            Email: "",
            Phone: "",
          };
          this.fetchAdminList(); // Gọi lại API để lấy danh sách mới
        }
      } catch (error) {
        console.error("Lỗi khi lưu sửa admin: ", error);
      }
    },

    // Gọi lại API để lấy danh sách mới
    async fetchAdminList() {
      try {
        let response = await axios.get("http://localhost:5000/admin/get_list");
        this.list = response.data;
      } catch (error) {
        console.error("Lỗi trong quá trình yêu cầu danh sách admin:", error);
      }
    },

    // Xác nhận xóa một admin
    confirmDelete(admin) {
      this.itemToDelete = admin;
      this.deleteItem();
    },

    // Xóa một admin
    async deleteItem() {
      if (this.itemToDelete) {
        try {
          const response = await axios.delete(
            `http://localhost:5000/admin/delete/${this.itemToDelete.IDAdmin}`
          );

          if (response.status === 200) {
            this.list.result = this.list.result.filter(
              (admin) => admin.IDAdmin !== this.itemToDelete.IDAdmin
            );
            this.itemToDelete = null;
          } else {
            console.error("Không thể xóa admin khỏi cơ sở dữ liệu");
            this.itemToDelete = null;
          }
        } catch (error) {
          console.error("Lỗi khi xóa admin: ", error);
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

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
