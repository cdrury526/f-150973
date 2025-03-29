
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ProjectCost } from '../types';
import { fetchContractors } from '../../contractors/api/contractorsApi';

export const exportToPDF = async (costs: ProjectCost[]) => {
  try {
    // Create a container to render the content
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.width = '790px'; // Roughly A4 width
    document.body.appendChild(container);

    // Fetch contractors to get their company names
    const contractors = await fetchContractors();
    const contractorsMap = contractors.reduce((acc, contractor) => {
      acc[contractor.id] = contractor.companyName;
      return acc;
    }, {} as Record<string, string>);

    // Calculate totals for summary
    const quoteTotal = costs.reduce((sum, cost) => sum + (cost.quote_price || 0), 0) || 0;
    const actualTotal = costs.reduce((sum, cost) => sum + (cost.actual_price || 0), 0) || 0;
    const differenceTotal = actualTotal - quoteTotal;
    
    // Create summary section
    const summarySection = document.createElement('div');
    summarySection.style.marginBottom = '20px';
    summarySection.innerHTML = `
      <h2 style="font-size: 18px; margin-bottom: 15px;">Project Costs Summary</h2>
      <div style="display: flex; gap: 20px; margin-bottom: 20px;">
        <div style="flex: 1; padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px;">
          <div style="font-size: 12px; color: #64748b;">Budget</div>
          <div style="font-size: 16px; font-weight: 600;">$${quoteTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style="font-size: 12px; color: #64748b;">${costs.length} categories</div>
        </div>
        <div style="flex: 1; padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px;">
          <div style="font-size: 12px; color: #64748b;">Actual</div>
          <div style="font-size: 16px; font-weight: 600;">$${actualTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style="font-size: 12px; color: #64748b;">${costs.filter(cost => cost.actual_price !== null).length}/${costs.length} complete</div>
        </div>
        <div style="flex: 1; padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px;">
          <div style="font-size: 12px; color: #64748b;">Difference</div>
          <div style="font-size: 16px; font-weight: 600; color: ${differenceTotal > 0 ? '#ef4444' : differenceTotal < 0 ? '#10b981' : '#000'}">
            $${Math.abs(differenceTotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            ${differenceTotal > 0 ? ' over' : differenceTotal < 0 ? ' under' : ''}
          </div>
          <div style="font-size: 12px; color: #64748b;">
            ${differenceTotal > 0 ? 'Over budget' : differenceTotal < 0 ? 'Under budget' : 'On budget'}
          </div>
        </div>
      </div>
    `;
    container.appendChild(summarySection);

    // Create table section
    const tableSection = document.createElement('div');
    tableSection.innerHTML = `
      <h2 style="font-size: 18px; margin-bottom: 15px;">Project Costs Details</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
            <th style="padding: 10px; text-align: left; font-weight: 600;">Category</th>
            <th style="padding: 10px; text-align: right; font-weight: 600;">Quote Price ($)</th>
            <th style="padding: 10px; text-align: right; font-weight: 600;">Actual Price ($)</th>
            <th style="padding: 10px; text-align: right; font-weight: 600;">Difference ($)</th>
            <th style="padding: 10px; text-align: left; font-weight: 600;">Contractor</th>
          </tr>
        </thead>
        <tbody>
          ${costs.map(cost => {
            const difference = (cost.actual_price ?? 0) - cost.quote_price;
            const contractorName = cost.contractor_id ? contractorsMap[cost.contractor_id] || 'Unknown' : 'Not assigned';
            
            return `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px; font-weight: 500;">${cost.category_name}</td>
                <td style="padding: 10px; text-align: right;">${cost.quote_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td style="padding: 10px; text-align: right;">${cost.actual_price !== null ? cost.actual_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</td>
                <td style="padding: 10px; text-align: right; color: ${difference > 0 ? '#ef4444' : difference < 0 ? '#10b981' : '#000'}">
                  ${cost.actual_price !== null ? difference.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'auto' }) : '-'}
                </td>
                <td style="padding: 10px;">${contractorName}</td>
              </tr>
            `;
          }).join('')}
          <tr style="border-bottom: 1px solid #e2e8f0; font-weight: bold;">
            <td style="padding: 10px;">Total</td>
            <td style="padding: 10px; text-align: right;">${quoteTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td style="padding: 10px; text-align: right;">${actualTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td style="padding: 10px; text-align: right; color: ${differenceTotal > 0 ? '#ef4444' : differenceTotal < 0 ? '#10b981' : '#000'}">
              ${differenceTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'auto' })}
            </td>
            <td style="padding: 10px;"></td>
          </tr>
        </tbody>
      </table>
    `;
    container.appendChild(tableSection);

    // Generate PDF from the container
    const canvas = await html2canvas(container, {
      scale: 1,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('project_costs_report.pdf');
    
    // Clean up
    document.body.removeChild(container);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
