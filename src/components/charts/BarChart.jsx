import { Bar } from 'react-chartjs-2'
import { chartColors, createCartesianOptions } from '../../utils/chartOptions'

function BarChart({ labels, values }) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Toneladas de CO2',
        data: values,
        backgroundColor: 'rgba(56, 189, 248, 0.72)',
        borderColor: chartColors.sky,
        borderRadius: 8,
        borderWidth: 1,
      },
    ],
  }

  return <Bar data={data} options={createCartesianOptions({ suggestedMax: 60 })} />
}

export default BarChart
