import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
)

const gridColor = 'rgba(148, 163, 184, 0.14)'
const tickColor = 'rgba(226, 232, 240, 0.78)'
const legendColor = 'rgba(241, 245, 249, 0.86)'

export const chartColors = {
  emerald: '#22c55e',
  lime: '#86efac',
  sky: '#38bdf8',
  amber: '#facc15',
  orange: '#fb923c',
  red: '#ef4444',
  cyan: '#22d3ee',
}

export function createCartesianOptions({ stacked = false, suggestedMax = 100 } = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        labels: {
          color: legendColor,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(2, 6, 23, 0.92)',
        borderColor: 'rgba(134, 239, 172, 0.24)',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#d1d5db',
        padding: 12,
      },
    },
    scales: {
      x: {
        stacked,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: tickColor,
        },
      },
      y: {
        stacked,
        beginAtZero: true,
        suggestedMax,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: tickColor,
        },
      },
    },
  }
}

export function createDoughnutOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: legendColor,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(2, 6, 23, 0.92)',
        borderColor: 'rgba(134, 239, 172, 0.24)',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#d1d5db',
        padding: 12,
      },
    },
  }
}

export function createRadarOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: legendColor,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(2, 6, 23, 0.92)',
        borderColor: 'rgba(134, 239, 172, 0.24)',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#d1d5db',
        padding: 12,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        suggestedMax: 100,
        angleLines: {
          color: gridColor,
        },
        grid: {
          color: gridColor,
        },
        pointLabels: {
          color: legendColor,
          font: {
            size: 12,
            weight: '700',
          },
        },
        ticks: {
          backdropColor: 'transparent',
          color: tickColor,
        },
      },
    },
  }
}
