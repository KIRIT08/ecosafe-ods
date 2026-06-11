import { Line } from 'react-chartjs-2'
import { chartColors, createCartesianOptions } from '../../utils/chartOptions'

function LineChart({ labels, values }) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Avance ODS (%)',
        data: values,
        borderColor: chartColors.emerald,
        backgroundColor: 'rgba(34, 197, 94, 0.16)',
        pointBackgroundColor: chartColors.lime,
        pointBorderColor: '#052e16',
        pointHoverRadius: 7,
        pointRadius: 4,
        tension: 0.42,
        fill: true,
      },
      {
        label: 'Meta educativa (85%)',
        data: labels.map(() => 85),
        borderColor: 'rgba(134, 239, 172, 0.45)',
        borderDash: [6, 6],
        pointRadius: 0,
      },
    ],
  }

  return <Line data={data} options={createCartesianOptions({ suggestedMax: 100 })} />
}

export default LineChart
