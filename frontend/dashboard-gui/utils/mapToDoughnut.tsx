import { ArcElement, Chart as ChartJS } from 'chart.js';

export function mapToDoughnut(amount: number, dataSetOverrides?: any) {
  ChartJS.register(ArcElement);
  return {
    datasets: [{
      data: [amount, 100 - amount],
      backgroundColor: [
        'rgb(138, 191, 86)',
        'rgb(159, 158, 158)',
      ],
      cutout: "70%",
      // offset: 10,
      spacing: 10,
      borderWidth: 0,
      ...dataSetOverrides
    }]
  }
}
