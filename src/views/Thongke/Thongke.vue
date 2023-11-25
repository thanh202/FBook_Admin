<template>
  <v-container>
    <h1>Thống kê doanh số bán hàng theo tháng</h1>

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
        ],
      },
      currentYear: new Date().getFullYear(), // Thêm biến để lưu trữ năm
      years: Array.from({ length: 4 }, (_, index) => 2020 + index), // Danh sách năm từ 2020 đến 2023
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
    async getDataFromAPI() {
      try {
        const promises = this.salesData.labels.map(async (label, index) => {
          const response = await axios.get(
            `http://localhost:5000/bill/bymonth/${this.currentYear}/${
              index + 1
            }`
          );
          return response.data.total;
        });

        // Chờ tất cả các yêu cầu hoàn thành trước khi cập nhật dữ liệu
        const data = await Promise.all(promises);

        // Cập nhật dữ liệu biểu đồ
        this.salesData.datasets[0].data = data;

        // Render biểu đồ sau khi có dữ liệu
        this.renderChart();
      } catch (error) {
        console.error("Error fetching data from API", error);
      }
    },
    renderChart() {
      const ctx = document.getElementById("salesChart").getContext("2d");
      // Nếu biểu đồ đã được tạo, hủy và tạo lại
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
