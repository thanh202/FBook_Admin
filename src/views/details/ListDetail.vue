<template>
  <h1>Quản lý chi tiết sách</h1>

  <div>
    <!-- Thêm vào template -->

    <div
      class="d-flex align-center ma-6"
      style="flex-direction: row-reverse"
      @click="showAddDialog"
    >
      <v-btn color="primary" dark> Thêm Sách </v-btn>
    </div>
    <div class="d-flex align-center ma-6" style="flex-direction: row-reverse">
      <v-btn color="primary" dark @click="exportToExcel">Export Excel</v-btn>
    </div>

    <div class="tk">
      <input class="tim" v-model="searchKeyword" placeholder="Tìm kiếm sách" />
      <v-btn class="bnt" color="primary" @click="searchBooks(searchKeyword)"
        >Tìm kiếm</v-btn
      >
    </div>

    <div class="d-flex align-center flex-column pa-6">
      <v-card width="99%">
        <v-table hover>
          <!-- Bảng để hiển thị danh sách sách -->
          <table>
            <thead>
              <tr>
                <th class="text-left">IDBook</th>
                <th class="text-left">Ten sách</th>
                <th class="text-left">Tác giả</th>
                <th class="text-left">Năm xuất bản</th>
                <th class="text-left">Gía sách(VNĐ)</th>
                <th class="text-left">Mô tả</th>
                <th class="text-left">Nội dung</th>
                <th class="text-left">Ảnh</th>
                <th class="text-left">Ngày tạo</th>
                <th class="text-left">Chương</th>
                <th class="text-left">Loại</th>
                <th class="text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <!-- Lặp qua các sách trong danh sách -->
              <tr v-for="item in list.result" :key="item.IDBook">
                <!-- Hiển thị thông tin sách -->
                <td class="text-left">{{ item.IDBook }}</td>
                <td class="text-left">{{ item.BookName }}</td>
                <td class="text-left">{{ item.Author }}</td>
                <td class="text-left">{{ item.PublishYear }}</td>
                <td class="text-left">{{ item.PriceBook }}</td>
                <td class="text-left wide-column">
                  <div @click="showDescriptionDialog(item.Discription)">
                    {{ truncateDescription(item.Discription, 2) }}
                    <p class="Info">Chi tiết</p>
                  </div>
                </td>
                <td class="text-left wide-column">
                  <div @click="showDescriptionDialog(item.Content)">
                    {{ truncateDescription(item.Content, 2) }}
                    <p class="Info">Chi tiết</p>
                  </div>
                </td>
                <!-- <td class="text-left">{{ item.Content }}</td> -->
                <!-- Hiển thị hình ảnh sách -->

                <td @click="console.log(item.image)">
                  <v-img
                    :src="'http://localhost:5000/' + item.ImageBook"
                    alt="Hình ảnh sách"
                    id="imgs"
                  ></v-img>
                </td>

                <td class="text-left">{{ item.Create_at }}</td>
                <td class="text-left">{{ item.Chapter }}</td>
                <td class="text-left">{{ item.CatName }}</td>

                <td>
                  <v-card-actions>
                    <v-icon variant="text" @click="editItem(item)">
                      mdi-pencil
                    </v-icon>

                    <v-icon variant="text" @click="confirmDelete(item)">
                      mdi-delete
                    </v-icon>
                  </v-card-actions>
                </td>
              </tr>
            </tbody>
          </table>
        </v-table>

        <v-pagination v-model="page" :length="pageCount"> </v-pagination>
      </v-card>
    </div>
    <!-- các dialog -->
    <v-dialog v-model="isDescriptionDialogVisible" class="description-dialog">
      <v-card class="cart" style="height: 90vh">
        <v-card-title>
          <h1 style="margin: 0">Chi tiết sách</h1>
        </v-card-title>
        <v-card-text>{{ selectedDescription }}</v-card-text>
        <v-card-actions>
          <v-btn @click="closeDescriptionDialog">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isAddDialogVisible" class="add-dialog">
      <v-form ref="form">
        <v-card class="cart">
          <v-card-title>
            <h1 style="margin: 0">Thêm Sách</h1>
          </v-card-title>
          <!-- Các trường nhập liệu -->
          <v-col cols="12">
            <v-text-field
              v-model="newBook.BookName"
              label="Tên sách"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="newBook.Author"
              label="Tác giả"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="newBook.PublishYear"
              label="Năm xuất bản"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="newBook.PriceBook"
              label="Giá sách(VNĐ)"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="newBook.Discription"
              label="Mô tả"
            ></v-textarea>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="newBook.Content"
              label="Nội dung"
              required
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="newBook.Chapter"
              label="Chương"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <input type="file" accept="image/*" @change="handleImageUpload" />
            <v-img
              v-if="selectedImage"
              :src="'http://localhost:5000/' + selectedImage"
              alt="Hình ảnh đã chọn"
              id="img2"
            ></v-img>
          </v-col>
          <v-col cols="12">
            <label for="type">Loại sách:</label>
            <select v-model="newBook.IDCat">
              <option
                v-for="type in types"
                :key="type.IDCat"
                :value="type.IDCat"
              >
                {{ type.CatName }}
              </option>
            </select>
          </v-col>

          <!-- Nút thêm sách và hủy bỏ -->

          <v-card-actions>
            <v-btn @click="addNewBook">Thêm</v-btn>
            <v-btn @click="closeAddDialog">Hủy</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- Hộp thoại Sửa sách -->
    //
    <!-- Hộp thoại Sửa sách -->

    <v-dialog v-model="isEditDialogVisible" class="edit-dialog">
      <v-form ref="form">
        <v-card class="cart">
          <v-card-title>
            <h1 style="margin: 0">Sửa Sách</h1>
          </v-card-title>
          <!-- Các trường nhập liệu -->
          <v-col cols="12">
            <v-text-field
              v-model="editingItem.BookName"
              label="Tên sách"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="editingItem.Author"
              label="Tác giả"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="editingItem.PublishYear"
              label="Năm xuất bản"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="editingItem.PriceBook"
              label="Giá sách"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="editingItem.Discription"
              label="Mô tả"
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="editingItem.Content"
              label="Content"
              required
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="editingItem.Chapter"
              label="Chương"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              id="imgs"
            />
            <!-- Hiển thị ảnh hiện tại -->
            <img
              v-if="editingItem.ImageBook"
              :src="'http://localhost:5000/' + editingItem.ImageBook"
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
          </v-col>
          <v-col cols="12">
            <label for="type">Loại sách:</label>
            <select v-model="editingItem.IDCat">
              <option
                v-for="type in types"
                :key="type.IDCat"
                :value="type.IDCat"
              >
                {{ type.CatName }}
              </option>
            </select>
          </v-col>
          <!-- Nút lưu và hủy bỏ -->

          <v-card-actions>
            <v-btn @click="saveEditedItem">Lưu</v-btn>
            <v-btn @click="closeEditDialog">Hủy</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    //
    <!-- // xóa -->
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
import * as XLSX from "xlsx";

// const page = ref(1);
// const pageCount = ref(8);
export default {
  name: "App",
  data() {
    return {
      // Các thuộc tính dữ liệu ban đầu
      searchResultVisible: false,
      list: { result: [] },
      itemToDelete: null,
      isDeleteDialogVisible: false,
      selectedImage: null,
      errorDialog: false,
      errorMessages: null,
      isDescriptionDialogVisible: false,
      selectedDescription: "",
      isAddDialogVisible: false,
      newBook: {
        BookName: "",
        Author: "",
        PublishYear: "",
        PriceBook: "",
        Discription: "",
        Content: "",
        Chapter: "",
        Create_at: "",
      },
      isEditDialogVisible: false,
      editingItem: {
        IDBook: null,
        BookName: "",
        Author: "",
        PublishYear: "",
        PriceBook: "",
        Discription: "",
        Content: "",
        ImageBook: "",
        Create_at: "",
        Chapter: "",
        IDCat: "",
      },
      types: [], // Danh sách loại
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
      let responseTypes = await axios.get(
        "http://localhost:5000/Category/get_list"
      );
      this.types = responseTypes.data.result;

      let response = await axios.get("http://localhost:5000/Book/get_list");
      console.log("Server Response:", response.data);
      // Log server response
      this.list = response.data;
      this.originalList = JSON.parse(JSON.stringify(response.data)); // Copy data
    } catch (error) {
      console.error("Lỗi trong quá trình yêu cầu:", error);
    }
  },
  methods: {
    exportToExcel() {
      const data = this.list.result;
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Books");
      XLSX.writeFile(wb, "book_data.xlsx");
    },
    async searchBooks(keyword) {
      try {
        if (keyword) {
          const response = await axios.get(
            `http://localhost:5000/book/search/${keyword}`
          );

          // Kiểm tra log để xem dữ liệu từ server trả về
          console.log("Dữ liệu tìm kiếm:", response.data);

          // Kiểm tra xem response.data có phải là mảng không
          if (Array.isArray(response.data) && response.data.length > 0) {
            this.list.result = response.data;
            this.searchResultVisible = true; // Hiển thị kết quả tìm kiếm
          } else {
            // Nếu không có dữ liệu, ẩn kết quả tìm kiếm
            this.searchResultVisible = false;
          }
        } else {
          await this.fetchBookList();
          this.searchResultVisible = false; // Ẩn kết quả tìm kiếm
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sách: ", error);
      }
    },
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

    showDeleteDialog(item) {
      this.itemToDelete = item;
      this.isDeleteDialogVisible = true;
    },
    // Mở dialog và hiển thị thông báo lỗi
    showErrorDialog(message) {
      this.errorMessages = message;
      this.errorDialog = true;
    },
    // Đóng dialog
    closeErrorDialog() {
      this.errorMessages = null;
      this.errorDialog = false;
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

    // Hiển thị hộp thoại Thêm mới sách
    showAddDialog() {
      this.isAddDialogVisible = true;
    },

    // Đóng hộp thoại Thêm mới sách
    closeAddDialog() {
      this.isAddDialogVisible = false;
      this.newBook.BookName = "";
      this.newBook.Author = "";
      this.newBook.PublishYear = "";
      this.newBook.PriceBook = "";
      this.newBook.Discription = "";
      this.newBook.Content = "";
      this.newBook.Chapter = "";
      this.newBook.Create_at = "";
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        // Gửi yêu cầu HTTP POST để tải lên hình ảnh lên server
        axios
          .post("http://localhost:5000/Book/upload", formData)
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
    // Thêm mới một sách
    async addNewBook() {
      if (!this.newBook.BookName) {
        this.showErrorDialog("Vui lòng nhập tên sách.");
        return;
      }

      // Validate if Author is empty
      if (!this.newBook.Author) {
        this.showErrorDialog("Vui lòng nhập tên tác giả.");
        return;
      }
      if (this.newBook.Discription.length <= 50) {
        this.showErrorDialog("Mô tả sách phải có độ dài lớn hơn 50 ký tự.");
        return;
      }
      if (!this.newBook.Discription) {
        this.showErrorDialog("Vui lòng nhập Discription");
        return;
      }
      if (this.newBook.Content.length <= 5000) {
        this.showErrorDialog("Mô tả sách phải có độ dài lớn hơn 5000 ký tự.");
        return;
      }
      if (!this.newBook.Content) {
        this.showErrorDialog("Vui lòng nhập Content");
        return;
      }
      // Validate if PublishYear is a number greater than 0
      if (
        isNaN(Number(this.newBook.PublishYear)) ||
        Number(this.newBook.PublishYear) <= 0
      ) {
        this.showErrorDialog("Vui lòng nhập năm xuất bản hợp lệ.");
        return;
      }

      // Validate if PriceBook is a number greater than 0
      if (
        isNaN(Number(this.newBook.PriceBook)) ||
        Number(this.newBook.PriceBook) <= 0
      ) {
        this.showErrorDialog("Vui lòng nhập giá sách hợp lệ.");
        return;
      }

      // Validate if Chapter is a number greater than 0
      if (
        isNaN(Number(this.newBook.Chapter)) ||
        Number(this.newBook.Chapter) <= 0
      ) {
        this.showErrorDialog("Vui lòng nhập số chương hợp lệ.");
        return;
      }

      // Validate if ImageBook is not empty
      if (!this.selectedImage) {
        this.showErrorDialog("Vui lòng chọn một hình ảnh.");
        return;
      }

      // Validate if IDCat is selected
      if (!this.newBook.IDCat) {
        this.showErrorDialog("Vui lòng chọn loại sách.");
        return;
      }
      try {
        const newData = {
          BookName: this.newBook.BookName,
          Author: this.newBook.Author,
          PublishYear: this.newBook.PublishYear,
          PriceBook: this.newBook.PriceBook,
          Discription: this.newBook.Discription,
          Content: this.newBook.Content,
          ImageBook: this.selectedImage,
          Chapter: this.newBook.Chapter,
          IDCat: this.newBook.IDCat,
          Create_at: this.newBook.Create_at,
        };

        // Gửi yêu cầu HTTP POST để thêm mới một sách
        const response = await axios.post(
          "http://localhost:5000/Book/add",
          newData
        );

        // Thêm sau khi thêm mới sách thành công
        if (response.status === 200) {
          // Đóng hộp thoại Thêm mới sách và cập nhật danh sách sách local
          this.isAddDialogVisible = false;
          this.newBook.BookName = "";
          this.newBook.Author = "";
          this.newBook.PublishYear = "";
          this.newBook.PriceBook = "";
          this.newBook.Discription = "";
          this.newBook.Content = "";
          this.newBook.Chapter = "";
          this.newBook.Create_at = "";
          this.selectedImage = response.data.imageUrl;

          // Gọi lại hàm để lấy danh sách sách mới sau khi thêm mới
          await this.fetchBookList();

          // Cập nhật danh sách loại sách (nếu có)
          const responseTypes = await axios.get(
            "http://localhost:5000/Category/get_list"
          );
          this.types = responseTypes.data.result;

          // Cập nhật hình ảnh (nếu có)
          this.editingItem.ImageBook = "";
        }
      } catch (error) {
        console.error("Lỗi khi thêm mới: ", error);
      }
    },

    editItem(item) {
      this.editingItem.IDBook = item.IDBook;
      this.editingItem.BookName = item.BookName;
      this.editingItem.Author = item.Author;
      this.editingItem.PublishYear = item.PublishYear;
      this.editingItem.PriceBook = item.PriceBook;
      this.editingItem.Discription = item.Discription;
      this.editingItem.Content = item.Content;
      this.editingItem.ImageBook = item.ImageBook;
      this.editingItem.Create_at = item.Create_at;
      this.editingItem.Chapter = item.Chapter;
      this.editingItem.IDCat = item.IDCat;
      this.isEditDialogVisible = true;
    },

    // Đóng hộp thoại Sửa sách
    closeEditDialog() {
      this.isEditDialogVisible = false;
      this.editingItem.IDBook = null;
      this.editingItem.BookName = "";
      this.editingItem.Author = "";
      this.editingItem.PublishYear = "";
      this.editingItem.PriceBook = "";
      this.editingItem.Discription = "";
      this.editingItem.Content = "";
      this.editingItem.ImageBook = "";
      this.editingItem.Create_at = "";
      this.editingItem.Chapter = "";
      this.editingItem.IDCat = "";
    },
    async saveEditedItem() {
      if (!this.editingItem.BookName) {
        this.showErrorDialog("Vui lòng nhập tên sách.");
        return;
      }

      // Validate if Author is empty
      if (!this.editingItem.Author) {
        this.showErrorDialog("Vui lòng nhập tên tác giả.");
        return;
      }
      if (this.editingItem.Discription.length <= 50) {
        this.showErrorDialog("Mô tả sách phải có độ dài lớn hơn 5000 ký tự.");
        return;
      }
      if (!this.editingItem.Discription) {
        this.showErrorDialog("Vui lòng nhập Discription");
        return;
      }
      if (this.editingItem.Content.length <= 5000) {
        this.showErrorDialog("Mô tả sách phải có độ dài lớn hơn 5000 ký tự.");
        return;
      }
      if (!this.editingItem.Content) {
        this.showErrorDialog("Vui lòng nhập Discription");
        return;
      }

      // Validate if PublishYear is a number greater than 0
      if (
        isNaN(Number(this.editingItem.PublishYear)) ||
        Number(this.editingItem.PublishYear) <= 0
      ) {
        this.showErrorDialog("Vui lòng nhập năm xuất bản hợp lệ.");
        return;
      }

      // Validate if PriceBook is a number greater than 0
      if (
        isNaN(Number(this.editingItem.PriceBook)) ||
        Number(this.editingItem.PriceBook) <= 0
      ) {
        this.showErrorDialog("Vui lòng nhập giá sách hợp lệ.");
        return;
      }

      // Validate if Chapter is a number greater than 0
      if (
        isNaN(Number(this.editingItem.Chapter)) ||
        Number(this.editingItem.Chapter) <= 0
      ) {
        this.showErrorDialog("Vui lòng nhập số chương hợp lệ.");
        return;
      }

      // Validate if IDCat is selected
      if (!this.editingItem.IDCat) {
        this.showErrorDialog("Vui lòng chọn loại sách.");
        return;
      }
      try {
        const updatedData = {
          IDBook: this.editingItem.IDBook,
          BookName: this.editingItem.BookName,
          Author: this.editingItem.Author,
          PublishYear: this.editingItem.PublishYear,
          PriceBook: this.editingItem.PriceBook,
          Discription: this.editingItem.Discription,
          Content: this.editingItem.Content,
          ImageBook: this.selectedImage || this.editingItem.ImageBook,
          Create_at: this.editingItem.Create_at,
          Chapter: this.editingItem.Chapter,
          IDCat: this.editingItem.IDCat,
        };

        // Gửi yêu cầu HTTP PUT để cập nhật một sách tồn tại
        const response = await axios.put(
          `http://localhost:5000/Book/update/${this.editingItem.IDBook}`,
          updatedData
        );

        // Cập nhật sau khi sửa sách thành công
        if (response.status === 200) {
          // Đóng hộp thoại Sửa sách
          this.isEditDialogVisible = false;

          // Gọi lại hàm để lấy danh sách sách mới sau khi sửa sách

          const index = this.list.result.findIndex(
            (item) => item.IDBook === this.editingItem.IDBook
          );

          if (
            response.status === 200 &&
            response.data &&
            response.data.result
          ) {
            // Cập nhật thông tin sách trong danh sách local
            this.list.result.splice(index, 1, response.data.result);
            this.selectedImage = null; // Reset ảnh đã chọn
            await this.fetchBookList();
          } else {
            console.error("Dữ liệu không hợp lệ sau khi sửa sách");
          }
        }
      } catch (error) {
        console.error("Lỗi khi lưu sửa sách: ", error);
      }
    },
    // Hàm để lấy danh sách sách từ server
    async fetchBookList() {
      try {
        const response = await axios.get("http://localhost:5000/Book/get_list");
        this.list = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách: ", error);
      }
    },
    // Xác nhận xóa sách
    // confirmDelete(item) {
    //   this.itemToDelete = item;
    //   this.deleteItem();
    // },

    // Xóa sách
    async deleteItem() {
      if (this.itemToDelete) {
        try {
          // Gửi yêu cầu HTTP DELETE để xóa một danh mục
          const response = await axios.delete(
            `http://localhost:5000/book/delete/${this.itemToDelete.IDBook}`
          );

          if (response.status === 200) {
            // Xóa thành công khỏi cơ sở dữ liệu, bây giờ hãy cập nhật danh sách cục bộ
            this.list.result = this.list.result.filter(
              (item) => item.IDBook !== this.itemToDelete.IDBook
            );
            this.itemToDelete = null;
          } else {
            // Xử lý trường hợp xóa khỏi cơ sở dữ liệu thất bại
            console.error("Không thể xóa mục khỏi cơ sở dữ liệu");
            this.showErrorDialog(
              "Sách đang có trong bill và favorite của khách"
            );
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

/* Style cho hộp thoại thêm mới */
.add-dialog {
  background-color: white; /* Màu trắng cho dialog */
  max-width: 60%; /* Đặt kích thước tối đa */
  width: 95%; /* Chiếm toàn bộ chiều rộng của dialog cha */
}
.edit-dialog {
  background-color: white; /* Màu trắng cho dialog */
  max-width: 80%; /* Đặt kích thước tối đa */
  width: 100%; /* Chiếm toàn bộ chiều rộng của dialog cha */
  border-radius: 10px; /* Bo tròn góc */
  overflow: hidden; /* Ẩn phần nằm ngoài dialog */
}
.tim {
  width: 20%;
  border: 1px solid;
  border-radius: 20px;
  padding: 5px;
  margin-right: 10px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
.description-dialog {
  height: 90%;
  border-radius: 10px;
  overflow: hidden;
}
.Info {
  color: #666666;
  font-style: italic;
  margin: 10px;
  text-align: center;
  cursor: pointer;
}
.wide-column {
  width: 200px; /* hoặc bất kỳ giá trị nào bạn muốn */
}
</style>
