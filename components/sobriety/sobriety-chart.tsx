"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register all Chart.js components
Chart.register(...registerables)

interface SobrietyChartProps {
  clients?: any[]
}

export function SobrietyChart({ clients = [] }: SobrietyChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || clients.length === 0) return

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Prepare data for the chart
    const labels = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - 11 + i)
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    })

    // Generate random data for demonstration
    const datasets = [
      {
        label: "Average Days Sober",
        data: Array.from({ length: 12 }, (_, i) => {
          // Calculate average days sober for each month based on client data
          // This is a simplified calculation for demonstration
          const baseValue = 30 + i * 5
          return baseValue + Math.floor(Math.random() * 10)
        }),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "New Check-ins",
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 20) + 5),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ]

    // Create the chart
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Days / Count",
              },
            },
            x: {
              title: {
                display: true,
                text: "Month",
              },
            },
          },
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [clients])

  if (clients.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No client data available to display chart</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <canvas ref={chartRef} />
    </div>
  )
}
