<template>
  <v-container>
    <h1>Thống kê doanh số bán hàng theo tháng</h1>
    <v-btn style="margin: 20px" @click="exportToExcel">Xuất Excel</v-btn>
    <v-row>
      <v-col>
        <v-select
          v-model="currentYear"
          :items="years"
          label="Chọn năm"
        ></v-select>
      </v-col>
    </v-row>

    <div class="q">
      <strong>Tổng số tiền:</strong> {{ formatCurrency(getTotalRevenue()) }}
    </div>
    <div class="q">
      <strong>Số lượng bán được:</strong> {{ getTotalSold() }} quyển
    </div>
    <v-row>
      <v-col class="chart-col" cols="12" md="9">
        <div>
          <canvas id="salesChart"></canvas>
        </div>
        <h2 style="margin-top: 50px">Thống kê doanh thu theo Ngày</h2>

        <v-row justify="center">
          <v-col cols="12" sm="6" md="4" lg="3">
            <v-btn @click="showPicker('start')" color="primary"
              >Chọn ngày BẮT ĐẦU</v-btn
            >
            <v-date-picker
              v-model="selectedDatestart"
              @input="onDateChange('start')"
            ></v-date-picker>
            <div v-if="selectedDatestart" class="text-center">
              Ngày Bắt đầu: {{ selectedDatestart }}
            </div>
          </v-col>

          <!-- Khoảng cách giữa ô chọn ngày -->
          <v-col cols="12" sm="6" md="4" lg="3"></v-col>

          <!-- Ô chọn ngày KẾT THƯC -->
          <v-col cols="12" sm="6" md="4" lg="3">
            <v-btn @click="showPicker('end')" color="primary"
              >Chọn ngày KẾT THƯC</v-btn
            >
            <v-date-picker
              v-model="selectedDateend"
              @input="onDateChange('end')"
            ></v-date-picker>
            <div v-if="selectedDateend" class="text-center">
              Ngày Kết thúc: {{ selectedDateend }}
            </div>
          </v-col>
        </v-row>

        <!-- Nút thống kê -->
        <v-row justify="center">
          <v-col cols="12" md="4">
            <v-btn @click="fetchStatistics" color="primary">Thống kê</v-btn>
          </v-col>
        </v-row>

        <!-- Thống kê -->
        <v-row v-if="statistics" justify="center">
          <v-col cols="12" md="8">
            <v-card>
              <v-card-text>
                <div class="text-center">
                  Doanh thu: {{ formatCurrency(statistics.total.total) }}
                </div>
                <div class="text-center">
                  Tổng số lượng: {{ statistics.total.totalOrders }}
                </div>
                <canvas ref="myChart"></canvas>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <!-- Thống kê -->
      </v-col>

      <v-col class="top-books-list" cols="12" md="3">
        <h2>Top 10 Sách Bán Chạy Nhất</h2>
        <div>
          <strong>Tổng số tiền:</strong>
          {{ formatCurrency(getTotalRevenuesale()) }} VND
        </div>
        <div>
          <strong>Số lượng bán được:</strong> {{ getTotalSoldsale() }} quyển
        </div>
        <v-list>
          <v-list-item-group v-if="topSellingBooks.length">
            <v-list-item v-for="(book, index) in topSellingBooks" :key="index">
              <v-list-item-avatar>
                <v-img
                  style="width: 200px; margin-left: 10%"
                  :src="'http://localhost:5000/' + book.ImageBook"
                  alt="Ảnh bìa sách"
                ></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ book.BookName }}</v-list-item-title>
                <v-list-item-subtitle>
                  Giá: {{ book.PriceBook }} VND | Đã bán:
                  {{ book.TotalSold }} quyển
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-alert v-else>Không có dữ liệu</v-alert>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Chart from "chart.js/auto";
import axios from "axios";
import * as XLSX from "xlsx";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export default {
  data() {
    return {
      chart: null,
      selectedDatestart: null,
      selectedDateend: null,
      statistics: null,
      salesData: {
        labels: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
        datasets: [
          {
            label: "Doanh số bán hàng",
            data: [], // Dữ liệu doanh số bán hàng ở đây
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            yAxisID: "revenue", // Đặt ID cho trục y của doanh số
          },
          {
            label: "Số lượng bán được",
            data: [], // Dữ liệu số lượng bán được ở đây
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            yAxisID: "quantity", // Đặt ID cho trục y của số lượng
          },
        ],
      },
      currentYear: new Date().getFullYear(),
      years: Array.from({ length: 7 }, (_, index) => 2020 + index),
      salesChart: null,
      topSellingBooks: [],
    };
  },
  mounted() {
    this.getDataFromAPI();
    this.getTopSellingBooks();
  },
  watch: {
    currentYear() {
      this.getDataFromAPI();
    },
  },
  methods: {
    drawChart() {
      if (this.$refs.myChart) {
        if (this.chart) {
          this.chart.destroy();
        }

        const ctx = this.$refs.myChart.getContext("2d");
        this.chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Tổng Doanh thu và số lượng "],
            datasets: [
              {
                label: "Doanh thu",
                data: [
                  this.statistics.total.total,
                  this.statistics.total.totalOrders,
                  this.statistics.total.totalOrders, // Thêm vào đây
                ],
                backgroundColor: ["blue", "green", "orange"], // Thêm màu
                yAxisID: "y-axis-0",
              },
              {
                label: "Số lượng",
                data: [this.statistics.total.totalOrders],
                backgroundColor: "red",
                yAxisID: "y-axis-1",
              },
            ],
          },
          options: {
            scales: {
              y: [
                {
                  id: "y-axis-0",
                  type: "linear",
                  position: "left",
                },
                {
                  id: "y-axis-1",
                  type: "linear",
                  position: "right",
                },
              ],
            },
          },
        });
      }
    },

    showPicker(type) {
      this.selectedDatestart = null;
      this.selectedDateend = null;

      this.$nextTick(() => {
        this.$refs[
          type === "start" ? "selectedDatestart" : "selectedDateend"
        ].$refs.input.click();
      });
    },
    onDateChange(type) {
      if (type === "start") {
        // Xử lý khi ngày bắt đầu thay đổi
      } else if (type === "end") {
        // Xử lý khi ngày kết thúc thay đổi
      }
    },
    fetchStatistics() {
      const startDate = this.formatDate(this.selectedDatestart);
      const endDate = this.formatDate(this.selectedDateend);

      const apiUrl = `http://localhost:5000/bill/bydate/${startDate}/${endDate}`;

      axios
        .get(apiUrl)
        .then((response) => {
          this.statistics = response.data;
          this.drawChart();
        })
        .catch((error) => {
          console.error("Lỗi khi truy vấn thống kê:", error);
          toast.success("Bạn chưa chọn ngày bắt đầu hoặc kết thúc");
        });
    },

    formatDate(date) {
      if (date) {
        const formattedDate = new Date(date);
        const year = formattedDate.getFullYear();
        const month = (formattedDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        const day = formattedDate.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
      return null;
    },
    formatCurrency(value) {
      // Sử dụng Intl.NumberFormat để định dạng số theo định dạng tiền tệ
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    getTotalRevenuesale() {
      // Tính tổng số tiền từ danh sách top sách bán chạy
      return this.topSellingBooks.reduce((total, book) => {
        return total + book.PriceBook * book.TotalSold;
      }, 0);
    },

    getTotalSoldsale() {
      // Tính tổng số lượng sách bán được từ danh sách top sách bán chạy
      return this.topSellingBooks.reduce((total, book) => {
        return total + book.TotalSold;
      }, 0);
    },

    getTotalRevenue() {
      // Tính tổng số tiền từ dữ liệu biểu đồ
      return Math.floor(
        this.salesData.datasets[0].data.reduce((total, revenue) => {
          // Kiểm tra xem doanh thu có phải là số trước khi cộng
          const revenueValue = parseFloat(revenue);
          if (!isNaN(revenueValue)) {
            return total + revenueValue;
          }
          return total;
        }, 0)
      );
    },

    getTotalSold() {
      // Tính tổng số lượng sách bán được từ dữ liệu biểu đồ
      return this.salesData.datasets[1].data.reduce((total, quantity) => {
        return total + quantity;
      }, 0);
    },
    async getTopSellingBooks() {
      try {
        const response = await axios.get(
          "http://localhost:5000/bill/get_top_selling_books"
        );
        this.topSellingBooks = response.data.result.slice(0, 10);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu top sách bán chạy", error);
      }
    },
    exportToExcel() {
      try {
        // Lấy dữ liệu từ biểu đồ
        const chartData = this.salesChart.data.datasets;
        const labels = this.salesData.labels;

        // Tạo mảng dữ liệu cho sheet từ dữ liệu biểu đồ
        const data = labels.map((label, index) => ({
          Năm: this.currentYear,
          Tháng: label,
          "Doanh số bán hàng": chartData[0].data[index],
          "Số lượng đặt hàng": chartData[1].data[index],
        }));

        // Tạo sheet từ mảng dữ liệu
        const ws = XLSX.utils.json_to_sheet(data);

        // Tạo workbook và thêm sheet vào workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Thống kê doanh số");

        // Xuất file Excel
        XLSX.writeFile(wb, `thongke_doanhso_${this.currentYear}.xlsx`);
      } catch (error) {
        console.error("Error exporting to Excel", error);
      }
    },

    async getDataFromAPI() {
      try {
        const promises = this.salesData.labels.map(async (label, index) => {
          const response = await axios.get(
            `http://localhost:5000/bill/bymonth/${this.currentYear}/${
              index + 1
            }`
          );
          return {
            total: response.data.total.total,
            totalOrders: response.data.total.totalOrders,
          };
        });

        const data = await Promise.all(promises);

        this.salesData.datasets[0].data = data.map((item) => item.total);
        this.salesData.datasets[1].data = data.map((item) => item.totalOrders);

        this.renderChart();
      } catch (error) {
        console.error("Error fetching data from API", error);
      }
    },
    renderChart() {
      const ctx = document.getElementById("salesChart").getContext("2d");

      if (this.salesChart) {
        this.salesChart.destroy();
      }

      this.salesChart = new Chart(ctx, {
        type: "bar", // Thay đổi loại biểu đồ thành bar để hiển thị cột
        data: this.salesData,
        options: {
          scales: {
            x: {
              type: "category",
              labels: this.salesData.labels,
            },
            y: [
              {
                beginAtZero: true,
                id: "revenue",
                type: "linear",
                position: "right",
                title: {
                  display: true,
                  text: "Doanh số",
                },
              },
              {
                beginAtZero: true,
                id: "quantity",
                type: "linear",
                position: "left",
                title: {
                  display: true,
                  text: "Số lượng",
                },
                ticks: {
                  stepSize: 5,
                  max: 30,
                },
              },
            ],
          },
        },
      });
    },
  },
};
</script>
<style scoped></style>
