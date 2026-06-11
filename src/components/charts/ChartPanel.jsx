import Card from '../ui/Card'

function ChartPanel({ children, footer, title }) {
  return (
    <Card className="min-h-80">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-black tracking-normal text-white">{title}</h2>
      </div>
      <div className="mt-6 h-60">{children}</div>
      {footer && <p className="mt-4 text-xs font-medium text-slate-500">{footer}</p>}
    </Card>
  )
}

export default ChartPanel
