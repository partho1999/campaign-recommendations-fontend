"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Skeleton
} from "@/components/ui/skeleton"

import {
  Eye,
  Pause,
  Activity,
  Clock,
  AlertCircle,
  BarChart3,
  Target,
} from "lucide-react"

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)

const formatPercentage = (value) =>
  `${(value * 100).toFixed(2)}%`

const getRecommendationColor = (rec) => {
  switch (rec) {
    case "PAUSE":
      return "destructive"
    case "RESTRUCTURE":
      return "destructive"
    case "UNDER OBSERVATION":
      return "secondary"
    case "MONITOR":
      return "blue"
    case "OPTIMIZE":
      return "green"
    default:
      return "default"
  }
}

const getRecommendationIcon = (rec) => {
  switch (rec) {
    case "PAUSE":
      return <Pause className="h-4 w-4" />
    case "UNDER OBSERVATION":
    case "MONITOR":
      return <Eye className="h-4 w-4" />
    case "OPTIMIZE":
      return <Activity className="h-4 w-4" />
    default:
      return <Activity className="h-4 w-4" />
  }
}

export default function AdRecDashboard() {
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://campaign-recommendations-backend.onrender.com/api/prediction-run?hours_back=24")
        const data = await res.json()
        setResponse(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 10800000)
    return () => clearInterval(interval)
  }, [])

  const data = response?.data || []
  const summary = response?.summary || {}

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Loading */}
        {loading && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-40 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {response?.error && (
          <Card className="border border-red-500 bg-red-50">
            <CardContent className="flex items-center space-x-2 p-4 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">Error: {response.error}</p>
            </CardContent>
          </Card>
        )}

        

        {/* Summary */}
        {!loading && response?.success && Object.keys(summary).length > 0 && (
          <>
          <div className="text-center space-y-2">
            {/* <div className="flex justify-center gap-4 mb-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Live
                </Button>
              </Link>
              <Link href="/predictions">
                <Button variant="default" size="sm">
                  <Target className="mr-2 h-4 w-4" />
                  24 Hours
                </Button>
              </Link>
            </div> */}
            <h1 className="text-4xl font-bold text-gray-900">Ad Recommendation Dashboard</h1>
            <p className="text-gray-600">Monitor and optimize your advertising campaigns</p>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="mt-2">
              <Activity className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">📊 Summary Statistics</CardTitle>
              <CardDescription className="text-gray-500">
                Key metrics over the selected time window
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {[
                ["Total Cost", formatCurrency(summary.total_cost)],
                ["Total Revenue", formatCurrency(summary.total_revenue)],
                ["Total Profit/Loss", formatCurrency(summary.total_profit), summary.total_profit >= 0 ? "text-green-600" : "text-red-600"],
                ["Total Clicks", summary.total_clicks],
                ["Total Conversions", summary.total_conversions],
                ["Avg ROI", formatPercentage(summary.average_roi / 100), summary.average_roi >= 0 ? "text-green-600" : "text-red-600"],
                ["Avg Conv. Rate", formatPercentage(summary.average_conversion_rate)],
              ].map(([label, value, color], idx) => (
                <div key={idx}>
                  <h4 className="text-sm font-medium text-gray-600">{label}</h4>
                  <p className={`text-lg font-semibold ${color ?? "text-slate-800"}`}>{value}</p>
                </div>
              ))}
              <div>
                <h4 className="text-sm font-medium text-gray-600">Priority Distribution</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(summary.priority_distribution).map(([priority, count]) => (
                    <Badge key={priority} variant="outline" className="text-xs px-2 py-1 bg-slate-100 border-slate-300 text-slate-800">
                      P{priority}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          </>
        )}

        {/* Campaign Accordion */}
        {!loading && response?.success && data.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-indigo-700">🧠 Campaign Recommendations</CardTitle>
              <CardDescription className="text-gray-500">Grouped by Campaign ID</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={data.slice(0, 2).map((item) => item.sub_id_3)} className="space-y-2">
                {data.map((campaign) => (
                  <AccordionItem key={campaign.sub_id_3} value={campaign.sub_id_3}>
                    <AccordionTrigger className="text-left text-base font-medium text-slate-800 hover:text-indigo-700">
                      {campaign.sub_id_6} <span className="text-sm text-slate-500 ml-2">(ID: {campaign.sub_id_3})</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="border rounded-lg overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-slate-100">
                              <TableHead>Adset</TableHead>
                              <TableHead>Campaign</TableHead>
                              <TableHead>Recommendation</TableHead>
                              <TableHead>Reason</TableHead>
                              <TableHead>Cost</TableHead>
                              <TableHead>Revenue</TableHead>
                              <TableHead>Profit</TableHead>
                              <TableHead>Clicks</TableHead>
                              <TableHead>Conv. Rate</TableHead>
                              <TableHead>ROI</TableHead>
                              <TableHead>Priority</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {campaign.adset.map((ad) => (
                              <TableRow key={ad.sub_id_2}>
                                <TableCell className="whitespace-normal break-words">{ad.sub_id_5}</TableCell>
                                <TableCell className="whitespace-normal break-words" title={ad.campaign}>
                                  {ad.campaign}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={getRecommendationColor(ad.recommendation)}
                                    className="flex items-center gap-1 w-fit capitalize"
                                  >
                                    {getRecommendationIcon(ad.recommendation)}
                                    {ad.recommendation}
                                  </Badge>
                                </TableCell>
                                <TableCell className="whitespace-normal break-words" title={ad.reason}>
                                  {ad.reason}
                                </TableCell>
                                <TableCell>{formatCurrency(ad.cost)}</TableCell>
                                <TableCell>{formatCurrency(ad.revenue)}</TableCell>
                                <TableCell className={ad.profit >= 0 ? "text-green-600" : "text-red-600"}>
                                  {formatCurrency(ad.profit)}
                                </TableCell>
                                <TableCell>{ad.clicks}</TableCell>
                                <TableCell>{formatPercentage(ad.conversion_rate)}</TableCell>
                                <TableCell className={ad.roi_confirmed >= 0 ? "text-green-600" : "text-red-600"}>
                                  {formatPercentage(ad.roi_confirmed / 100)}
                                </TableCell>
                                <TableCell>{ad.priority}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
