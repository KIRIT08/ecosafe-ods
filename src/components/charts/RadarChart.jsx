import { Radar } from 'react-chartjs-2'
import { chartColors, createRadarOptions } from '../../utils/chartOptions'

function RadarChart({ labels, values }) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Nivel ODS',
        data: values,
        backgroundColor: 'rgba(34, 197, 94, 0.24)',
        borderColor: chartColors.emerald,
        borderWidth: 2,
        pointBackgroundColor: chartColors.lime,
        pointBorderColor: '#052e16',
        pointHoverRadius: 6,
        pointRadius: 4,
      },
    ],
  }

  return <Radar data={data} options={createRadarOptions()} />
}

export default RadarChart
