import { Doughnut } from 'react-chartjs-2'
import { chartColors, createDoughnutOptions } from '../../utils/chartOptions'

function DoughnutChart({ labels, values, colors }) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors?.length
          ? colors
          : [chartColors.emerald, chartColors.lime, chartColors.orange, chartColors.sky],
        borderColor: 'rgba(2, 6, 23, 0.65)',
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  }

  return <Doughnut data={data} options={createDoughnutOptions()} />
}

export default DoughnutChart
