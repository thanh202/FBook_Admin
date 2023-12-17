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

    <div>
      <canvas id="salesChart"></canvas>
    </div>
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
    };
  },
  mounted() {
    this.getDataFromAPI();
  },
  watch: {
    currentYear() {
      this.getDataFromAPI();
    },
  },
  methods: {
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

<style>
.v-container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

canvas {
  max-width: 800px;
  margin-top: 20px;
}
</style>
