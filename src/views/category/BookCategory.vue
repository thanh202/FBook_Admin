<template>
  <h1 style="font-size: 30px">Quản lý loại sách</h1>
  <div>
    <v-btn @click="showAddDialog" color="primary" style="margin: 20px"
      >Thêm mới</v-btn
    >

    <v-table class="table1">
      <colgroup>
        <col class="a" style="width: 10%" />
        <col class="b" style="width: 20%" />
        <col class="c" style="width: 10%" />
        <col class="d" style="width: 10%" />
      </colgroup>
      <thead>
        <tr>
          <th class="text-left a">STT</th>
          <th class="text-left b">Loại</th>
          <th class="text-left f">Ảnh</th>
          <th class="text-left d">Thao Tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(Category, index) in list.result" :key="Category.IDCat">
          <td>{{ index + 1 }}</td>
          <td>{{ Category.CatName }}</td>

          <td @click="console.log(Category.image)">
            <v-img
              style="width: 6vh"
              :src="'http://localhost:5000/' + Category.img"
              alt="Hình ảnh Loại"
              id="imgs"
            ></v-img>
          </td>
          <td>
            <v-icon @click="editItem(Category)" class="mr-2" color="primary">
              mdi-pencil
            </v-icon>
            <v-icon @click="confirmDelete(Category)" color="error">
              mdi-delete
            </v-icon>
          </td>
        </tr>
      </tbody>

      <!-- dialog -->

      <v-dialog v-model="isAddDialogVisible">
        <v-card>
          <v-card-title>Thêm mới danh mục</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newCategory.CatName"
              label="Tên loại"
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
              label="Tên loại"
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
      <!-- delete -->
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
      <!-- Error dialog -->
      <v-dialog v-model="errorDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline"> Thông Báo Lỗi </v-card-title>
          <v-card-text>{{ errorMessages }}</v-card-text>
          <v-card-actions>
            <v-btn @click="closeErrorDialog">Đóng</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-table>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

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
      toast.success("Bạn chưa đăng nhập!");
    }
  },

  methods: {
    showAddDialog() {
      this.isAddDialogVisible = true;
    },

    closeAddDialog() {
      this.isAddDialogVisible = false;
      this.newCategory.CatName = "";
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

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        axios
          .post("http://localhost:5000/Category/upload", formData)
          .then((response) => {
            if (response.status === 200) {
              this.selectedImage = response.data.imageUrl;

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

        const response = await axios.post(
          "http://localhost:5000/Category/add",
          newData
        );

        if (response.status === 200) {
          toast.success("Thêm mới thành công!");
          this.isAddDialogVisible = false;
          this.newCategory.CatName = "";
          this.selectedImage = response.data.imageUrl;
          this.list.result.push(response.data.result);
          this.editingItem.img = "";
          await this.fetchCatList();
        }
      } catch (error) {
        console.error("Lỗi khi thêm mới: ", error);
      }
    },

    editItem(Category) {
      this.editingItem.IDCat = Category.IDCat;
      this.editingItem.CatName = Category.CatName;
      this.editingItem.img = Category.img;
      this.isEditDialogVisible = true;
    },

    closeEditDialog() {
      this.isEditDialogVisible = false;
      this.editingItem.IDCat = null;
      this.editingItem.CatName = "";
    },

    async saveEditedItem() {
      try {
        if (!this.editingItem.CatName) {
          this.showErrorDialog("Vui lòng nhập tên và chọn ảnh.");
          return;
        }
        const updatedData = {
          IDCat: this.editingItem.IDCat,
          CatName: this.editingItem.CatName,
          img: this.selectedImage || this.editingItem.img,
        };

        const response = await axios.put(
          `http://localhost:5000/Category/update`,
          updatedData
        );

        if (response.status === 200) {
          toast.success("Sửa loại thành công!");
          const updatedIndex = this.list.result.findIndex(
            (item) => item.IDCat === this.editingItem.IDCat
          );
          await this.fetchCatList();
          if (updatedIndex !== -1) {
            this.list.result[updatedIndex] = response.data.result;
          }

          this.isEditDialogVisible = false;
          this.editingItem.IDCat = null;
          this.editingItem.CatName = "";
          this.editingItem.img = "";
        }
      } catch (error) {
        console.error("Lỗi khi lưu sửa: ", error);
      }
    },

    async deleteItem() {
      if (this.itemToDelete) {
        try {
          const response = await axios.delete(
            `http://localhost:5000/Category/delete/${this.itemToDelete.IDCat}`
          );

          if (response.status === 200) {
            toast.success("Xóa loại thành công!");
            this.list.result = this.list.result.filter(
              (item) => item.IDCat !== this.itemToDelete.IDCat
            );

            this.itemToDelete = null;
          } else {
            console.error("Không thể xóa mục khỏi cơ sở dữ liệu");
            this.showErrorDialog("Loại đang được dùng trong Book");
            this.itemToDelete = null;
          }
        } catch (error) {
          this.showErrorDialog("Loại đang được dùng trong Book");
          console.error("Lỗi khi xóa: ", error);
          this.itemToDelete = null;
        }
      }
      this.closeDeleteDialog();
    },
    async fetchCatList() {
      try {
        let response = await axios.get(
          "http://localhost:5000/Category/get_list"
        );
        this.list = response.data;
      } catch (error) {
        console.error("Lỗi trong quá trình yêu cầu danh sách Category:", error);
      }
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
