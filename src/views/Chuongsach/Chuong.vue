<template>
  <div class="d-flex align-center flex-column pa-6">
    <h1>Quản lý chuong</h1>
    <v-btn @click="showAddDialog" color="primary">Thêm mới</v-btn>
    <v-card width="99%">
      <v-table hover>
        <thead>
          <tr>
            <th class="text-left">STT</th>
            <th class="text-left">Tiêu đề</th>
            <th class="text-left">Nội dung</th>
            <th class="text-left">Tên Sách</th>
            <th class="text-left">Ngày Tạo</th>
            <th class="text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(chapter, index) in list.result" :key="chapter.IDchuong">
            <td class="text-left">{{ index + 1 }}</td>
            <!-- Sử dụng chỉ số để tăng giá trị từ 1 -->
            <td class="text-left">{{ chapter.title }}</td>
            <!-- <td class="text-left">{{ chapter.content }}</td> -->
            <td class="text-left wide-column">
              <div @click="showDescriptionDialog(chapter.content)">
                {{ truncateDescription(chapter.content, 4) }}
                <p class="Info">Chi tiết</p>
              </div>
            </td>
            <td class="text-left">{{ chapter.BookName }}</td>
            <td class="text-left">{{ chapter.Create_at }}</td>
            <td>
              <v-card-actions>
                <v-icon variant="text" @click="editItem(chapter)">
                  mdi-pencil
                </v-icon>

                <v-icon variant="text" @click="confirmDelete(chapter)">
                  mdi-delete
                </v-icon>
              </v-card-actions>
            </td>
          </tr>
        </tbody>
      </v-table>
      <!-- diloag -->
      <v-dialog v-model="isDescriptionDialogVisible" class="description-dialog">
        <v-card class="cart" style="height: 140vh">
          <v-card-title>
            <h1 style="margin-left: 43%">Chi tiết sách</h1>
          </v-card-title>
          <v-card-text>{{ selectedDescription }}</v-card-text>
          <v-card-actions>
            <v-btn @click="closeDescriptionDialog">Đóng</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="isAddDialogVisible">
        <v-card>
          <v-card-title>Thêm mới danh mục</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newChapter.title"
              label="Mo ta"
            ></v-text-field>
          </v-card-text>

          <v-card-text>
            <v-textarea
              v-model="newChapter.content"
              label="Noi dung"
            ></v-textarea>
          </v-card-text>

          <v-col cols="12">
            <label for="type">Sách:</label>
            <select v-model="newChapter.IDBook">
              <option disabled value="">Chọn sách</option>
              <option
                v-for="type in types"
                :key="type.IDBook"
                :value="type.IDBook"
              >
                {{ type.BookName }}
              </option>
            </select>
          </v-col>
          <v-card-text>
            <v-text-field
              v-model="newChapter.chuongso"
              label="chuong so"
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="addNewchuong" color="primary">Thêm</v-btn>
            <v-btn @click="closeAddDialog">Hủy</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- // dialog sửa -->
      <v-dialog v-model="isEditDialogVisible" class="edit-dialog">
        <v-form ref="form">
          <v-card class="cart">
            <v-card-title>
              <h1 style="margin: 0">Sửa Chương</h1>
            </v-card-title>
            <!-- Các trường nhập liệu -->
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="editingItem.title"
                  label="Tên chương"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-textarea
                  v-model="editingItem.content"
                  label="Nội dung chương"
                  required
                ></v-textarea>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="editingItem.chuongso"
                  label="Chương số"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <label for="type">Sách:</label>
                <select v-model="editingItem.IDBook">
                  <option
                    v-for="type in types"
                    :key="type.IDBook"
                    :value="type.IDBook"
                  >
                    {{ type.BookName }}
                  </option>
                </select>
              </v-col>
            </v-row>

            <!-- Nút lưu và hủy bỏ -->
            <v-card-actions>
              <v-btn @click="saveEditedItem">Lưu</v-btn>
              <v-btn @click="closeEditDialog">Hủy</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>

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

      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export default {
  data() {
    return {
      isAddDialogVisible: false,
      itemToDelete: null,
      isDeleteDialogVisible: false,
      isDescriptionDialogVisible: false,
      selectedDescription: "",
      page: 1, // Trang hiện tại
      itemsPerPage: 30, // Số lượng mục trên mỗi trang
      list: { result: [] },
      newChapter: {
        title: "",
        content: "",
        // IDBook: "",
        chuongso: "",
        Create_at: "",
      },
      isEditDialogVisible: false,
      editingItem: {
        IDchuong: null,
        title: "",
        content: "",
        chuongso: "",
        IDBook: "",
        Create_at: "",
      },
      types: [], // Danh sách sách
      dialogAdd: false, // Add this line
    };
  },

  computed: {
    startIndex() {
      return (this.page - 1) * this.itemsPerPage;
    },
    endIndex() {
      return this.startIndex + this.itemsPerPage - 1;
    },
    pageCount() {
      return Math.ceil(this.list.result.length / this.itemsPerPage);
    },
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
      let responseTypes = await axios.get(
        "http://localhost:5000/Book/get_list"
      );
      this.types = responseTypes.data.result;

      let response = await axios.get("http://localhost:5000/chuong/get_list");
      console.log("Server Response:", response.data);

      // Log server response
      this.list = response.data;
      this.originalList = JSON.parse(JSON.stringify(response.data)); // Copy data
    } catch (error) {
      console.error("Lỗi trong quá trình yêu cầu:", error);
      toast.success("Bạn chưa đăng nhập!");
    }
  },
  methods: {
    showDescriptionDialog(description) {
      this.selectedDescription = description;
      this.isDescriptionDialogVisible = true;
    },
    closeDescriptionDialog() {
      this.isDescriptionDialogVisible = false;
      this.selectedDescription = "";
    },
    truncateDescription(description, lines) {
      const words = description.split(" ");
      if (words.length <= lines * 10) {
        return description;
      }
      const truncatedWords = words.slice(0, lines * 10);
      return truncatedWords.join(" ") + "...";
    },

    showDeleteDialog(chapter) {
      this.itemToDelete = chapter;
      this.isDeleteDialogVisible = true;
    },
    closeDeleteDialog() {
      this.isDeleteDialogVisible = false;
      this.itemToDelete = null;
    },
    confirmDelete(chapter) {
      this.showDeleteDialog(chapter);
    },
    // Hiển thị hộp thoại Thêm mới danh mục
    showAddDialog() {
      this.isAddDialogVisible = true;
    },
    // xóa
    async deleteItem() {
      if (this.itemToDelete) {
        try {
          // Gửi yêu cầu HTTP DELETE để xóa một danh mục
          const response = await axios.delete(
            `http://localhost:5000/chuong/delete/${this.itemToDelete.IDchuong}`
          );

          if (response.status === 200) {
            toast.success("Xóa chuong thành công!");
            // Xóa thành công khỏi cơ sở dữ liệu, bây giờ hãy cập nhật danh sách cục bộ
            this.list.result = this.list.result.filter(
              (chapter) => chapter.IDBook !== this.itemToDelete.IDchuong
            );
            this.fetchBookList();
            this.itemToDelete = null;
          } else {
            // Xử lý trường hợp xóa khỏi cơ sở dữ liệu thất bại
            console.error("Không thể xóa mục khỏi cơ sở dữ liệu");
            this.showErrorDialog("chuong đang có trong sách ");
            this.itemToDelete = null; // Xóa mục khỏi biến itemToDelete để ngăn chặn các thử nghiệm xóa tiếp theo
          }
        } catch (error) {
          console.error("Lỗi khi xóa: ", error);

          this.showErrorDialog("Sách đang có trong bill và favorite của khách");
          this.itemToDelete = null;

          // Xóa mục khỏi biến itemToDelete để ngăn chặn các thử nghiệm xóa tiếp theo
        }
      }
      this.closeDeleteDialog();
    },
    async addNewchuong() {
      try {
        const newData = {
          title: this.newChapter.title,
          content: this.newChapter.content,
          IDBook: this.newChapter.IDBook,
          chuongso: this.newChapter.chuongso,
          Create_at: this.newChapter.Create_at,
        };

        // Gửi yêu cầu HTTP POST để thêm mới một sách
        const response = await axios.post(
          "http://localhost:5000/chuong/add",
          newData
        );

        // Thêm sau khi thêm mới sách thành công
        if (response.status === 200) {
          toast.success("Thêm sách thành công!");
          // Đóng hộp thoại Thêm mới sách và cập nhật danh sách sách local
          this.isAddDialogVisible = false;
          this.newChapter.title = "";
          this.newChapter.content = "";
          this.newChapter.chuongso = "";
          this.newChapter.Create_at = "";
          // Gọi lại hàm để lấy danh sách sách mới sau khi thêm mới
          await this.fetchBookList();

          // Cập nhật danh sách loại sách (nếu có)
          const responseTypes = await axios.get(
            "http://localhost:5000/book/get_list"
          );
          this.types = responseTypes.data.result;

          // Cập nhật hình ảnh (nếu có)
        }
      } catch (error) {
        console.error("Lỗi khi thêm mới: ", error);
      }
    },
    // sửa

    editItem(chapter) {
      this.editingItem.IDchuong = chapter.IDchuong;
      this.editingItem.title = chapter.title;
      this.editingItem.content = chapter.content;
      this.editingItem.chuongso = chapter.chuongso;
      this.editingItem.IDBook = chapter.IDBook;
      this.editingItem.Create_at = chapter.Create_at;
      this.isEditDialogVisible = true;
    },

    // Đóng hộp thoại Sửa sách
    closeEditDialog() {
      this.isEditDialogVisible = false;
      this.editingItem.IDchuong = null;
      this.editingItem.title = "";
      this.editingItem.content = "";
      this.editingItem.chuongso = "";
      this.editingItem.IDBook = "";
      this.editingItem.Create_at = "";
    },
    async saveEditedItem() {
      try {
        const updatedData = {
          IDchuong: this.editingItem.IDchuong,
          title: this.editingItem.title,
          content: this.editingItem.content,
          chuongso: this.editingItem.chuongso,
          Create_at: this.editingItem.Create_at,
          IDBook: this.editingItem.IDBook,
        };

        // Gửi yêu cầu HTTP PUT để cập nhật một sách tồn tại
        const response = await axios.put(
          `http://localhost:5000/chuong/update/${this.editingItem.IDchuong}`,
          updatedData
        );

        // Cập nhật sau khi sửa sách thành công
        if (response.status === 200) {
          // Đóng hộp thoại Sửa sách

          toast.success("Sửa chuong thành công!");
          this.isEditDialogVisible = false;
          await this.fetchBookList();
          // Gọi lại hàm để lấy danh sách sách mới sau khi sửa sách

          const index = this.list.result.findIndex(
            (chapter) => chapter.IDchuong === this.editingItem.IDchuong
          );

          if (
            response.status === 200 &&
            response.data &&
            response.data.result
          ) {
            // Cập nhật thông tin sách trong danh sách local
            this.list.result.splice(index, 1, response.data.result);
            // await this.fetchBookList();
          } else {
            console.error("Dữ liệu không hợp lệ sau khi sửa sách");
          }
        }
      } catch (error) {
        console.error("Lỗi khi lưu sửa sách: ", error);
      }
    },
    async fetchBookList() {
      try {
        const response = await axios.get(
          "http://localhost:5000/chuong/get_list"
        );
        this.list = response.data;

        // Thêm đoạn mã sau để cập nhật thuộc tính STT (index)
        this.list.result.forEach((chapter, index) => {
          this.$set(chapter, "STT", index + 1);
        });
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chuong: ", error);
      }
    },
  },
};
</script>

<style>
.tim {
  border: 1px solid;
  /* width: 70%; */
  border-radius: 10px;
  padding: 10px;
  margin: 30px 10px 10px 0px;
}
.Info {
  color: #666666;
  font-style: italic;
  margin: 10px;
  text-align: center;
  cursor: pointer;
}
</style>
