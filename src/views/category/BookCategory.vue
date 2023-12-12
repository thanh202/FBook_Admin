<template>
  <div>
    <v-btn @click="showAddDialog" color="primary">Thêm mới</v-btn>
    <v-card class="mt-6" width="100%">
      <v-data-table
        :headers="tableHeaders"
        :items="list.result"
        :items-per-page="perPage"
        :page.sync="page"
      >
        <template v-slot:item.img="{ item }">
          <v-img
            :src="'http://localhost:5000/' + item.img"
            width="50"
            height="50"
          ></v-img>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon @click="editItem(item)" class="mr-2" color="primary">
            mdi-pencil
          </v-icon>
          <v-icon @click="confirmDelete(item)" color="error">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>

      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </v-card>

    <!-- daloig -->

    <v-dialog v-model="isAddDialogVisible">
      <v-card>
        <v-card-title>Thêm mới danh mục</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newCategory.CatName"
            label="CatName"
          ></v-text-field>
          <v-file-input
            @change="handleImageUpload"
            label="Chọn ảnh"
          ></v-file-input>
          <v-img
            v-if="selectedImage"
            :src="'http://localhost:5000/' + selectedImage"
            :width="imageSize"
            :height="imageSize"
          ></v-img>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="addNewCategory" color="primary">Thêm</v-btn>
          <v-btn @click="closeAddDialog">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isEditDialogVisible">
      <v-card>
        <v-card-title>Sửa danh mục</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editingItem.CatName"
            label="CatName"
          ></v-text-field>
          <v-file-input
            @change="handleImageUpload"
            label="Chọn ảnh"
          ></v-file-input>
          <v-img
            v-if="editingItem.img"
            :src="'http://localhost:5000/' + editingItem.img"
            :width="imageSize"
            :height="imageSize"
          ></v-img>
          <v-img
            v-if="selectedImage"
            :src="'http://localhost:5000/' + selectedImage"
            :width="imageSize"
            :height="imageSize"
          ></v-img>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="saveEditedItem" color="primary">Lưu</v-btn>
          <v-btn @click="closeEditDialog">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- xoa -->
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
    <!-- Dialog hiển thị thông báo lỗi -->
    <v-dialog v-model="errorDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline"> Thông Báo Lỗi </v-card-title>
        <v-card-text>{{ errorMessages }}</v-card-text>
        <v-card-actions>
          <v-btn @click="closeErrorDialog">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      list: { result: [] },
      perPage: 10,
      page: 1,
      errorDialog: false,
      errorMessages: null,
      imageSize: 200,
      isDeleteDialogVisible: false,
      pageCount: 0,
      tableHeaders: [
        { text: "CatName", value: "CatName" },
        { text: "Anh", value: "img" },
        { text: "Thao tac", value: "actions", sortable: false },
      ],
      itemToDelete: null,
      selectedImage: null,
      isAddDialogVisible: false,
      newCategory: {
        CatName: "",
      },
      isEditDialogVisible: false,
      editingItem: {
        IDCat: null,
        CatName: "",
        img: "",
      },
    };
  },
  async mounted() {
    try {
      axios.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `${token}`;
          console.log("get token", token);
        }
        return config;
      });
      let response = await axios.get("http://localhost:5000/Category/get_list");
      this.list = response.data;
      this.pageCount = Math.ceil(this.list.result.length / this.perPage);
    } catch (error) {
      console.error("Lỗi trong quá trình yêu cầu:", error);
    }
  },
  methods: {
    // Hiển thị hộp thoại Thêm mới danh mục
    showAddDialog() {
      this.isAddDialogVisible = true;
    },

    // Đóng hộp thoại Thêm mới danh mục
    closeAddDialog() {
      this.isAddDialogVisible = false;
      this.newCategory.CatName = "";
    },
    showErrorDialog(message) {
      this.errorMessages = message;
      this.errorDialog = true;
    },
    // Đóng dialog
    closeErrorDialog() {
      this.errorMessages = null;
      this.errorDialog = false;
    },
    showDeleteDialog(item) {
      this.itemToDelete = item;
      this.isDeleteDialogVisible = true;
    },

    // Đóng hộp thoại xác nhận xóa
    closeDeleteDialog() {
      this.isDeleteDialogVisible = false;
      this.itemToDelete = null;
    },

    // Xác nhận xóa một danh mục
    confirmDelete(item) {
      this.showDeleteDialog(item);
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        // Gửi yêu cầu HTTP POST để tải lên hình ảnh lên server
        axios
          .post("http://localhost:5000/Category/upload", formData)
          .then((response) => {
            if (response.status === 200) {
              // Lưu đường dẫn ảnh đã tải lên
              this.selectedImage = response.data.imageUrl;

              // Hiển thị ảnh đã chọn
              const addDialogImg = this.$refs.addDialogImg;
              const editDialogImg = this.$refs.editDialogImg;
              const editDialogSelectedImg = this.$refs.editDialogSelectedImg;

              if (addDialogImg) {
                addDialogImg.src = response.data.imageUrl;
              }
              if (editDialogImg) {
                editDialogImg.src = response.data.imageUrl;
              }
              if (editDialogSelectedImg) {
                editDialogSelectedImg.src = response.data.imageUrl;
              }
            } else {
              console.error("Lỗi khi tải lên hình ảnh");
            }
          })
          .catch((error) => {
            console.error("Lỗi khi tải lên hình ảnh:", error);
          });
      }
    },

    // Thêm mới một danh mục
    async addNewCategory() {
      try {
        if (!this.newCategory.CatName || !this.selectedImage) {
          this.showErrorDialog("Vui lòng nhập tên và chọn ảnh.");
          return;
        }
        const newData = {
          CatName: this.newCategory.CatName,
          img: this.selectedImage,
        };

        // Gửi yêu cầu HTTP POST để thêm mới một danh mục
        const response = await axios.post(
          "http://localhost:5000/Category/add",
          newData
        );

        // Thêm sau khi thêm mới danh mục thành công
        if (response.status === 200) {
          // Đóng hộp thoại Thêm mới danh mục và cập nhật danh sách danh mục local
          this.isAddDialogVisible = false;
          this.newCategory.CatName = "";
          this.selectedImage = response.data.imageUrl; // Cập nhật đường dẫn ảnh
          this.list.result.push(response.data.result);
          this.editingItem.img = "";
        }
      } catch (error) {
        console.error("Lỗi khi thêm mới: ", error);
      }
    },

    // Thiết lập hộp thoại Sửa danh mục
    editItem(item) {
      this.editingItem.IDCat = item.IDCat;
      this.editingItem.CatName = item.CatName;
      this.editingItem.img = item.img; // Điền vào đường dẫn ảnh hiện tại
      this.isEditDialogVisible = true;
    },

    // Đóng hộp thoại Sửa danh mục
    closeEditDialog() {
      this.isEditDialogVisible = false;
      this.editingItem.IDCat = null;
      this.editingItem.CatName = "";
    },

    // Lưu sửa danh mục
    async saveEditedItem() {
      try {
        if (!this.editingItem.CatName) {
          this.showErrorDialog("Vui lòng nhập tên và chọn ảnh.");
          return;
        }
        const updatedData = {
          IDCat: this.editingItem.IDCat,
          CatName: this.editingItem.CatName,
          img: this.selectedImage || this.editingItem.img, // Sử dụng đường dẫn mới nếu có, ngược lại giữ nguyên đường dẫn hiện tại
        };

        // Gửi yêu cầu HTTP PUT để cập nhật một danh mục tồn tại
        const response = await axios.put(
          `http://localhost:5000/Category/update`,
          updatedData
        );

        if (response.status === 200) {
          // Tìm mục cần cập nhật trong danh sách và cập nhật nó
          const updatedIndex = this.list.result.findIndex(
            (item) => item.IDCat === this.editingItem.IDCat
          );

          if (updatedIndex !== -1) {
            this.list.result[updatedIndex] = response.data.result;
          }

          // Đóng hộp thoại Sửa danh mục
          this.isEditDialogVisible = false;
          this.editingItem.IDCat = null;
          this.editingItem.CatName = "";
          this.editingItem.img = "";
        }
      } catch (error) {
        console.error("Lỗi khi lưu sửa: ", error);
      }
    },

    // Xác nhận xóa một danh mục
    // confirmDelete(item) {
    //   this.itemToDelete = item;
    //   this.deleteItem();
    // },

    // Xóa một danh mục
    async deleteItem() {
      if (this.itemToDelete) {
        try {
          // Gửi yêu cầu HTTP DELETE để xóa một danh mục
          const response = await axios.delete(
            `http://localhost:5000/Category/delete/${this.itemToDelete.IDCat}`
          );

          if (response.status === 200) {
            // Xóa thành công khỏi cơ sở dữ liệu, bây giờ hãy cập nhật danh sách cục bộ
            this.list.result = this.list.result.filter(
              (item) => item.IDCat !== this.itemToDelete.IDCat
            );
            this.itemToDelete = null;
          } else {
            // Xử lý trường hợp xóa khỏi cơ sở dữ liệu thất bại
            console.error("Không thể xóa mục khỏi cơ sở dữ liệu");
            this.showErrorDialog("Loại đang được dùng trong Book");
            this.itemToDelete = null; // Xóa mục khỏi biến itemToDelete để ngăn chặn các thử nghiệm xóa tiếp theo
          }
        } catch (error) {
          this.showErrorDialog("Loại đang được dùng trong Book");
          console.error("Lỗi khi xóa: ", error);
          this.itemToDelete = null; // Xóa mục khỏi biến itemToDelete để ngăn chặn các thử nghiệm xóa tiếp theo
        }
      }
      this.closeDeleteDialog();
    },
    updatePageCount() {
      this.pageCount = Math.ceil(this.list.result.length / this.perPage);
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
#imgs {
  width: 100px;
  height: 100px;
}
#img2 {
  width: 100px;
  height: 100px;
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
