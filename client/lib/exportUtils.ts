// CSV Export utility function
export function exportToCSV(data: any[], filename: string = "export.csv"): void {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const csvRows: string[] = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] ?? '';
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export recovery queue data
export const exportRecoveryQueue = (assets: any[]) => {
  const exportData = assets.map(asset => ({
    'Asset Tag': asset.asset_tag,
    'User Name': asset.user_name,
    'Asset Type': asset.asset_type,
    'Recovery Type': asset.recovery_type,
    'Status': asset.status,
    'Recovery Age (Days)': asset.recovery_age,
    'SLA Stage': asset.sla_stage,
    'Created Date': asset.created_date,
    'Last Updated': asset.last_updated
  }));
  
  exportToCSV(exportData, `recovery_queue_${new Date().toISOString().split('T')[0]}.csv`);
};

// Export SLA breach data
export const exportSLABreaches = (assets: any[]) => {
  const slaBreaches = assets.filter(asset => asset.sla_stage === 'Breach');
  const exportData = slaBreaches.map(asset => ({
    'Asset Tag': asset.asset_tag,
    'User Name': asset.user_name,
    'Asset Type': asset.asset_type,
    'Recovery Type': asset.recovery_type,
    'Recovery Age (Days)': asset.recovery_age,
    'Created Date': asset.created_date,
    'Last Updated': asset.last_updated
  }));
  
  exportToCSV(exportData, `sla_breaches_${new Date().toISOString().split('T')[0]}.csv`);
};

// Export general report data
export const exportReportData = (data: any[], reportName: string) => {
  exportToCSV(data, `${reportName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
};
