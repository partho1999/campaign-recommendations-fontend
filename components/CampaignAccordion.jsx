"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Pause, Eye, Activity } from "lucide-react";
import ActionModal from "@/components/ActionModal";
import ConfirmModal from "@/components/ConfirmModal"; // 👈 import modal

const getRecommendationColor = (rec) => {
  switch (rec) {
    case "PAUSE":
    case "RESTRUCTURE":
      return "destructive";
    case "UNDER OBSERVATION":
      return "secondary";
    case "INCREASE_BUDGET":
      return "green";
    case "KEEP_RUNNING":
      return "orange";
    case "MONITOR":
      return "blue";
    case "OPTIMIZE":
      return "yellow";
    default:
      return "default";
  }
};

const getCpcRateColor = (rec) => {
  switch (rec) {
    case "HIGH":
    case "RESTRUCTURE":
      return "destructive";
    case "UNDER OBSERVATION":
      return "secondary";
    case "STANDARD":
      return "blue";
    case "LOW":
      return "green";
    default:
      return "default";
  }
};

const getRecommendationIcon = (rec) => {
  switch (rec) {
    case "PAUSE":
      return <Pause className="h-4 w-4" />;
    case "UNDER OBSERVATION":
    case "MONITOR":
      return <Eye className="h-4 w-4" />;
    case "OPTIMIZE":
    default:
      return <Activity className="h-4 w-4" />;
  }
};

export default function CampaignAccordion({ data = [], loading = false, response = {} }) {
  const [selectedRecommendation, setSelectedRecommendation] = useState("");
  const [openItems, setOpenItems] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // 👈 modal state
  const [selectedAdsetId, setSelectedAdsetId] = useState(null);     // 👈 paused adset id

  useEffect(() => {
    if (data?.length > 0) {
      setOpenItems(data.slice(0, 4).map((item) => item.id?.toString()));
    }
  }, [data]);

  const handlePauseAction = async (subId2) => {
    try {
      const response = await fetch(`https://app.wijte.me/api/adset/pause/${subId2}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to pause adset ${subId2}`);
      }

      const result = await response.json();
      console.log("Pause successful:", result);
      alert(`Adset ${subId2} paused successfully.`);
    } catch (error) {
      console.error("Error pausing adset:", error);
      alert(`Failed to pause Adset ${subId2}`);
    }
  };

  if (loading || !response?.success || data.length === 0) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-indigo-700 text-start">🧠 Campaign Recommendations</CardTitle>
        <CardDescription className="text-gray-500 text-start">Grouped by Campaign ID</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Filter by Recommendation:</span>
          {["", "PAUSE", "INCREASE_BUDGET", "OPTIMIZE", "RESTRUCTURE", "KEEP_RUNNING", "REVIEW"].map((rec) => (
            <button
              key={rec || "all"}
              onClick={() => setSelectedRecommendation(rec)}
              className={`px-3 py-1 text-sm rounded border ${
                selectedRecommendation === rec
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {rec || "All"}
            </button>
          ))}
        </div>

        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={setOpenItems}
          className="space-y-2"
        >
          {data.map((campaign) => {
            const filteredAdsets = selectedRecommendation
              ? campaign.adset.filter((ad) => ad.recommendation === selectedRecommendation)
              : campaign.adset;

            if (filteredAdsets.length === 0) return null;

            return (
              <AccordionItem key={campaign.id} value={campaign.id?.toString()}>
                <AccordionTrigger className="w-full text-left text-base font-medium text-slate-800 hover:text-indigo-700">
                  <div className="w-full grid grid-cols-3 items-end">
                    {/* Column 1: Left-aligned sub_id_6 */}
                    <div className="text-sm text-slate-500 text-left">
                      {campaign.sub_id_6}
                    </div>

                    {/* Column 2: Center-aligned sub_id_3 and day */}
                    <div className="text-sm text-slate-500 text-center">
                      <span>(ID: {campaign.sub_id_3})</span>
                      {campaign.day && (
                        <span className="ml-2">(Date: {campaign.day})</span>
                      )}
                    </div>

                    {/* Column 3: Right-aligned ActionModal */}
                    <div className="text-sm text-slate-500 text-right pr-8">
                      {campaign.recommendation === "INCREASE_BUDGET" && (
                        <div className="inline-block"  onClick={(e) => e.stopPropagation()}>
                          <ActionModal
                            initialCount={campaign.recommendation_percentage}
                            campaign_id={campaign.sub_id_3}
                            recomendations={campaign.recommendation}
                          />
                        </div>
                      )}
                    </div>
                  </div>
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
                          <TableHead>Suggestions</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Revenue</TableHead>
                          <TableHead>Profit</TableHead>
                          <TableHead>Clicks</TableHead>
                          <TableHead>CPC</TableHead>
                          <TableHead>GEO</TableHead>
                          <TableHead>Country</TableHead>
                          <TableHead>CPC Rate</TableHead>
                          <TableHead>Conv. Rate</TableHead>
                          <TableHead>ROI</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAdsets.map((ad) => (
                          <TableRow key={ad.sub_id_2}>
                            <TableCell className="whitespace-normal break-words">{ad.sub_id_5}</TableCell>
                            <TableCell className="whitespace-normal break-words" title={ad.sub_id_6}>
                              {ad.sub_id_6}
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
                            <TableCell className="whitespace-normal break-words" title={ad.suggestion}>
                              {ad.suggestion}
                            </TableCell>
                            <TableCell>{formatCurrency(ad.cost)}</TableCell>
                            <TableCell>{formatCurrency(ad.revenue)}</TableCell>
                            <TableCell className={ad.profit >= 0 ? "text-green-600" : "text-red-600"}>
                              {formatCurrency(ad.profit)}
                            </TableCell>
                            <TableCell>{ad.clicks}</TableCell>
                            <TableCell>{ad.cpc}</TableCell>
                            <TableCell>{ad.geo}</TableCell>
                            <TableCell>{ad.country}</TableCell>
                            <TableCell>
                              <Badge
                                variant={getCpcRateColor(ad.cpc_rate)}
                                className="flex items-center gap-1 w-fit capitalize"
                              >
                                {ad.cpc_rate}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatPercentage(ad.conversion_rate)}</TableCell>
                            <TableCell className={ad.roi_confirmed >= 0 ? "text-green-600" : "text-red-600"}>
                              {formatPercentage(ad.roi_confirmed / 100)}
                            </TableCell>
                            <TableCell>{ad.priority}</TableCell>
                            <TableCell>
                              {ad.recommendation === "PAUSE" ? (
                                <button
                                  onClick={() => {
                                    setSelectedAdsetId(ad.sub_id_2);
                                    setShowConfirmModal(true);
                                  }}
                                  className="bg-destructive text-white px-2 py-1 rounded hover:bg-destructive/80 text-sm"
                                >
                                  PAUSE
                                </button>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>

      {/* Confirm Pause Modal */}
      <ConfirmModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          if (selectedAdsetId) {
            handlePauseAction(selectedAdsetId);
            setShowConfirmModal(false);
          }
        }}
      />
    </Card>
  );
}
