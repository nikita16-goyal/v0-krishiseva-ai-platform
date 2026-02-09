import { Clock, Sprout, CloudSun } from "lucide-react"

const mockHistory = [
  {
    id: 1,
    date: "2026-02-08",
    type: "Crop Analysis",
    summary: "Analyzed soil data for rice paddy field. Recommended: Rice, Wheat.",
    icon: Sprout,
  },
  {
    id: 2,
    date: "2026-02-05",
    type: "Weather Report",
    summary: "Heavy rainfall predicted for next 3 days. Adjusted irrigation schedule.",
    icon: CloudSun,
  },
  {
    id: 3,
    date: "2026-02-01",
    type: "Crop Analysis",
    summary: "Nutrient deficiency detected in north sector. Added phosphorus supplement.",
    icon: Sprout,
  },
  {
    id: 4,
    date: "2026-01-28",
    type: "Weather Report",
    summary: "Temperature drop alert. Protected sugarcane crops with mulching.",
    icon: CloudSun,
  },
]

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Past analyses and recommendations from your AI assistant.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {mockHistory.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="rounded-xl bg-primary/10 p-2.5">
              <entry.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {entry.type}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {entry.date}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {entry.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
