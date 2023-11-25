<template>

  <div>
    <button @click="showAddDialog">Thêm mới</button>

    <!-- Bảng để hiển thị danh sách danh mục -->
    <div class="d-flex align-center flex-column pa-6">
      <v-card width="70%">
        <v-table hover>
          <thead>
            <tr>
              <th class="text-left">CatName</th>
              <th class="text-left">Anh</th>
              <th class="text-left">Thao tac</th>
            </tr>
          </thead>
          <tbody>
            <!-- Lặp qua các danh mục trong danh sách -->
            <tr v-for="item in list.result" :key="item.IDCat">
              <!-- Hiển thị thông tin danh mục -->
              <!-- <td class="text-left">{{ item.IDCat }}</td> -->
              <td class="text-left">{{ item.CatName }}</td>
              <td>
                <!-- Hiển thị hình ảnh danh mục -->
                <img
                  :src="'http://localhost:5000/' + item.img"
                  alt="Hình ảnh danh mục"
                  id="imgs"
                />
              </td>
              <!-- Nút để sửa và xóa danh mục -->
              <!-- <td>
           
            <button @click="editItem(item)">Sửa</button>
            <button @click="confirmDelete(item)">Xóa</button>
          </td> -->
              <td>
                <v-card-actions>
                  <v-icon variant="text" @click="editItem(item)">
                    mdi-pencil
                  </v-icon>

                  <v-icon variant="text" button @click="confirmDelete(item)">
                    mdi-delete
                  </v-icon>
                </v-card-actions>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-pagination v-model="page" :length="pageCount"> </v-pagination>
      </v-card>
    </div>
    <!-- Hộp thoại Thêm mới danh mục -->
    <div v-if="isAddDialogVisible">
      <input v-model="newCategory.CatName" placeholder="CatName" />
      <input type="file" accept="image/*" @change="handleImageUpload" />
      <!-- Hiển thị ảnh đã chọn -->
      <img
        v-if="selectedImage"
        :src="'http://localhost:5000/' + selectedImage"
        alt="Hình ảnh đã chọn"
        id="img2"
      />

      <button @click="addNewCategory">Thêm</button>
      <button @click="closeAddDialog">Hủy</button>
    </div>

    <!-- Hộp thoại Sửa danh mục -->
    <div v-if="isEditDialogVisible">
      <input v-model="editingItem.CatName" placeholder="CatName" />
      <input
        type="file"
        accept="image/*"
        @change="handleImageUpload"
        id="imgs"
      />
      <!-- Hiển thị ảnh hiện tại -->
      <img
        v-if="editingItem.img"
        :src="'http://localhost:5000/' + editingItem.img"
        alt="Hình ảnh hiện tại"
        id="img2"
      />
      <!-- Hiển thị ảnh đã chọn -->
      <img
        v-if="selectedImage"
        :src="'http://localhost:5000/' + selectedImage"
        alt="Hình ảnh đã chọn"
        id="img2"
      />
      <button @click="saveEditedItem">Lưu</button>
      <button @click="closeEditDialog">Hủy</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      // Các thuộc tính dữ liệu ban đầu
      list: { result: [] },
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
        img: "", // Thêm trường img
      },
    };
  },
  async mounted() {
    // Lấy danh sách danh mục ban đầu khi component được mount
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
      let response = await axios.get("http://localhost:5000/Category/get_list");
      this.list = response.data;
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
    confirmDelete(item) {
      this.itemToDelete = item;
      this.deleteItem();
    },

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
            this.itemToDelete = null; // Xóa mục khỏi biến itemToDelete để ngăn chặn các thử nghiệm xóa tiếp theo
          }
        } catch (error) {
          console.error("Lỗi khi xóa: ", error);
          this.itemToDelete = null; // Xóa mục khỏi biến itemToDelete để ngăn chặn các thử nghiệm xóa tiếp theo
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
