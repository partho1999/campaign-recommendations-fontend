import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Pause } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import ActionModal from "@/components/ActionModal";

const ExpendableTable = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAdsetId, setSelectedAdsetId] = useState(null);

  const handlePauseAction = async (subId2) => {
    try {
      const response = await fetch(
        `https://app.wijte.me/api/adset/pause/${subId2}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`Failed to pause adset ${subId2}`);

      await response.json();
      alert(`Adset ${subId2} paused successfully.`);
    } catch (error) {
      alert(`Failed to pause Adset ${subId2}`);
    }
  };

  const handleExpand = (campaignId) => {
    setExpandedRows((prev) =>
      prev.includes(campaignId)
        ? prev.filter((id) => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const isExpanded = (campaignId) => expandedRows.includes(campaignId);

  const getRows = (campaign) => {
    const rows = [];

    // Campaign row
    rows.push(
      <TableRow
        key={campaign.id}
        className="cursor-pointer hover:bg-gray-100 border-b text-sm"
        onClick={() => handleExpand(campaign.id)}
      >
        <TableCell className="px-4 py-1 flex items-center text-left">
          <span
            className={`mr-2 transform transition-transform duration-200 ${
              isExpanded(campaign.id) ? "rotate-90" : ""
            }`}
          >
            &gt;
          </span>
          {campaign.sub_id_6}
        </TableCell>
        <TableCell className="px-2 py-1 text-left">{campaign.sub_id_3}</TableCell>
        <TableCell className="px-2 py-1 text-left">
          {campaign.total_cost.toFixed(2)}
        </TableCell>
        <TableCell className="px-2 py-1 text-left">
          {campaign.total_revenue.toFixed(2)}
        </TableCell>
        <TableCell className="px-2 py-1 text-left">
          {campaign.total_profit.toFixed(2)}
        </TableCell>
        <TableCell className="px-2 py-1 text-left">{campaign.total_clicks}</TableCell>
        <TableCell className="px-2 py-1 text-left">
          {campaign.total_cpc.toFixed(2)}
        </TableCell>
        <TableCell className="px-2 py-1 text-left">
          {campaign.geo}
        </TableCell>
        <TableCell className="px-2 py-1 text-left">
          {campaign.country}
        </TableCell>
        <TableCell className="px-2 py-1 text-left">
          {campaign.total_roi.toFixed(2)}
        </TableCell>
        <TableCell className="px-2 py-1 text-left">
          {campaign.total_conversion_rate.toFixed(2)}
        </TableCell>
        <TableCell className="px-2 py-1 text-left">{campaign.recommendation}</TableCell>
        <TableCell className="px-2 py-1 text-left">
          {campaign.recommendation_percentage}
        </TableCell>
        <TableCell className="px-2 py-1 text-left">
          {campaign.recommendation === "INCREASE_BUDGET" && (
            <div
              className="inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              <ActionModal
                initialCount={campaign.recommendation_percentage}
                campaign_id={campaign.sub_id_3}
                recomendations={campaign.recommendation}
              />
            </div>
          )}
        </TableCell>
      </TableRow>
    );

    // Expanded adset rows
    if (isExpanded(campaign.id)) {
      rows.push(
        <TableRow
          key={campaign.id + "-adset-header"}
          className="bg-gray-200 text-gray-800 text-xs font-medium border-b"
        >
          <TableHead className="px-8 py-1 text-left">Adset</TableHead>
          <TableHead className="px-2 py-1 text-left">Recommendation</TableHead>
          <TableHead className="px-2 py-1 text-left">Reason</TableHead>
          <TableHead className="px-2 py-1 text-left">Suggestion</TableHead>
          <TableHead className="px-2 py-1 text-left">Cost</TableHead>
          <TableHead className="px-2 py-1 text-left">Revenue</TableHead>
          <TableHead className="px-2 py-1 text-left">Profit</TableHead>
          <TableHead className="px-2 py-1 text-left">Clicks</TableHead>
          <TableHead className="px-2 py-1 text-left">CPC</TableHead>
          <TableHead className="px-2 py-1 text-left">GEO</TableHead>
          <TableHead className="px-2 py-1 text-left">Country</TableHead>
          <TableHead className="px-2 py-1 text-left">CPC Rate</TableHead>
          <TableHead className="px-2 py-1 text-left">ROI (%)</TableHead>
          <TableHead className="px-2 py-1 text-left">Conv. Rate</TableHead>
          <TableHead className="px-2 py-1 text-left">Priority</TableHead>
          <TableHead className="px-2 py-1 text-left">Action</TableHead>
        </TableRow>
      );

      campaign.adset.forEach((ad) => {
        rows.push(
          <TableRow
            key={ad.sub_id_2}
            className="bg-gray-50 text-xs text-gray-700 border-b"
          >
            <TableCell className="px-8 py-1 text-left">{ad.sub_id_5}</TableCell>
            <TableCell className="px-2 py-1 text-left">{ad.recommendation}</TableCell>
            <TableCell className="px-2 py-1 text-left">{ad.reason}</TableCell>
            <TableCell className="px-2 py-1 text-left">{ad.suggestion}</TableCell>
            <TableCell className="px-2 py-1 text-left">{ad.cost.toFixed(2)}</TableCell>
            <TableCell className="px-2 py-1 text-left">{ad.revenue.toFixed(2)}</TableCell>
            <TableCell className="px-2 py-1 text-left">{ad.profit.toFixed(2)}</TableCell>
            <TableCell className="px-2 py-1 text-left">{ad.clicks}</TableCell>
            <TableCell className="px-2 py-1 text-left">{ad.cpc.toFixed(2)}</TableCell>
            <TableCell className="px-2 py-1 text-left">{ad.geo}</TableCell>
            <TableCell className="px-2 py-1 text-left">{ad.country}</TableCell>
            <TableCell className="px-2 py-1 text-left">{ad.cpc_rate}</TableCell>
            <TableCell className="px-2 py-1 text-left">{ad.roi_confirmed.toFixed(2)}</TableCell>
            <TableCell className="px-2 py-1 text-left">{ad.conversion_rate.toFixed(2)}</TableCell>
            <TableCell className="px-2 py-1 text-left">{ad.priority}</TableCell>
            <TableCell className="px-2 py-1 text-left">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAdsetId(ad.sub_id_2);
                  setShowConfirmModal(true);
                }}
                className="text-destructive"
              >
                <Pause className="h-4 w-4" />
              </button>
            </TableCell>
          </TableRow>
        );
      });
    }

    return rows;
  };

  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle className="text-indigo-700 text-start">
          🧠 Campaign Recommendations
        </CardTitle>
        <CardDescription className="text-gray-500 text-start">
          Grouped by Campaign ID
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-full border border-gray-200 text-sm">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="px-4 py-1 text-left">Campaign</TableHead>
                <TableHead className="px-4 py-1 text-left">ID</TableHead>
                <TableHead className="px-2 py-1 text-left">Cost</TableHead>
                <TableHead className="px-2 py-1 text-left">Revenue</TableHead>
                <TableHead className="px-2 py-1 text-left">Profit</TableHead>
                <TableHead className="px-2 py-1 text-left">Clicks</TableHead>
                <TableHead className="px-2 py-1 text-left">CPC</TableHead>
                <TableHead className="px-2 py-1 text-left">GEO</TableHead>
                <TableHead className="px-2 py-1 text-left">Country</TableHead>
                <TableHead className="px-2 py-1 text-left">ROI (%)</TableHead>
                <TableHead className="px-2 py-1 text-left">Conv. Rate</TableHead>
                <TableHead className="px-2 py-1 text-left">Recommendation</TableHead>
                <TableHead className="px-2 py-1 text-left">Budget Change %</TableHead>
                <TableHead className="px-2 py-1 text-left">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{data.map((campaign) => getRows(campaign))}</TableBody>
          </Table>
        </div>
      </CardContent>

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
};

export default ExpendableTable;
