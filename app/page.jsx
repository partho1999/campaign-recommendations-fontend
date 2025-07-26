"use client"

import { useEffect, useState } from "react"
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
  Eye,
  Pause,
  Activity,
  DollarSign,
  TrendingUp,
  Server,
  BarChart3,
  Target,
  Clock,
  AlertCircle,
} from "lucide-react"

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)

const formatPercentage = (value) => `${(value * 100).toFixed(2)}%`

const getRecommendationColor = (rec) => {
  switch (rec) {
    case "PAUSE":
      return "destructive"
    case "UNDER OBSERVATION":
      return "secondary"
    case "MONITOR":
    case "OPTIMIZE":
      return "default"
    case "RESTRUCTURE":
      return "destructive"
    default:
      return "default"
  }
}

const getRecommendationIcon = (rec) => {
  switch (rec) {
    case "PAUSE":
      return <Pause className="h-4 w-4" />
    case "UNDER OBSERVATION":
      return <Eye className="h-4 w-4" />
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
        const res = await fetch(
          "http://127.0.0.1:8000/api/prediction-run?hours_back=24"
        )
        const data = await res.json()
        setResponse(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const data = response?.data || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Summary Cards or header can go here */}

        {loading && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-6 w-6 animate-spin" />
                <p>Loading campaign recommendations...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {response?.error && (
          <Card variant="destructive">
            <CardContent>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <p>
                  <strong>Error:</strong> {response.error}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && response?.success && data.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Campaign Recommendations</CardTitle>
              <CardDescription>Grouped by Campaign (sub_id_3)</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full space-y-2">
                {data.map((campaign) => (
                  <AccordionItem key={campaign.sub_id_3} value={campaign.sub_id_3}>
                    <AccordionTrigger className="text-left text-lg font-semibold">
                      {campaign.sub_id_6} (ID: {campaign.sub_id_3})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="rounded-md border mt-2 overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Adset</TableHead>
                              <TableHead>Campaign</TableHead>
                              <TableHead>Recommendation</TableHead>
                              <TableHead>Cost</TableHead>
                              <TableHead>Revenue</TableHead>
                              <TableHead>Profit</TableHead>
                              <TableHead>Conv. Rate</TableHead>
                              <TableHead>ROI</TableHead>
                              <TableHead>Priority</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {campaign.adset.map((ad) => (
                              <TableRow key={ad.sub_id_2}>
                                <TableCell>{ad.sub_id_5}</TableCell>
                                <TableCell className="max-w-xs truncate" title={ad.campaign}>
                                  {ad.campaign}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={getRecommendationColor(ad.recommendation)}
                                    className="flex items-center gap-1 w-fit"
                                  >
                                    {getRecommendationIcon(ad.recommendation)}
                                    {ad.recommendation}
                                  </Badge>
                                </TableCell>
                                <TableCell>{formatCurrency(ad.cost)}</TableCell>
                                <TableCell>{formatCurrency(ad.revenue)}</TableCell>
                                <TableCell className={ad.profit >= 0 ? "text-green-600" : "text-red-600"}>
                                  {formatCurrency(ad.profit)}
                                </TableCell>
                                <TableCell>{formatPercentage(ad.conversion_rate)}</TableCell>
                                <TableCell
                                  className={
                                    ad.roi_confirmed >= 0 ? "text-green-600" : "text-red-600"
                                  }
                                >
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
