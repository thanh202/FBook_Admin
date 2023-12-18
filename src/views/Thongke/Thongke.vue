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
                  style="width: 300px; margin-left: 10%"
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
export default {
  data() {
    return {
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
            data: [],
            fill: false,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: "rgba(75, 192, 192, 1)",
          },
          {
            label: "Số đơn đặt hàng",
            data: [],
            fill: false,
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: "rgba(255, 99, 132, 1)",
          },
        ],
      },
      currentYear: new Date().getFullYear(),
      years: Array.from({ length: 4 }, (_, index) => 2020 + index),
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
  // async mounted() {
  //   await this.getDataFromAPI();

  //   this.renderChart();
  // },
  methods: {
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
          "Số đơn đặt hàng": chartData[1].data[index],
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
        type: "line",
        data: this.salesData,
        options: {
          scales: {
            x: {
              type: "category",
              labels: this.salesData.labels,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
};
</script>
<style scoped>
.chart-col {
  order: -1;
}

.top-books-list {
  order: 1;
}

/* Tùy chỉnh kiểu dáng */
.top-books-list h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.top-books-list v-list-item-content {
  line-height: 1.4;
}
.q {
  margin: 20px;
}
.q strong {
  font-weight: bolder;
}
</style>
