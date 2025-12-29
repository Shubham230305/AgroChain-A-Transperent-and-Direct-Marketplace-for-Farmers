// Analytics & Reports JavaScript

// Global variables
let charts = {};
let currentTimeFilter = 'month';
let currentChartPeriods = {
    earnings: 'daily',
    sales: 'daily',
    demand: 'daily',
    buyers: 'current'
};

// Chart configurations
const chartColors = {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#4caf50',
    warning: '#ff9800',
    danger: '#f44336',
    info: '#2196f3',
    light: '#f5f5f5',
    dark: '#333'
};

const gradientColors = [
    'rgba(102, 126, 234, 0.8)',
    'rgba(118, 75, 162, 0.8)',
    'rgba(76, 175, 80, 0.8)',
    'rgba(255, 152, 0, 0.8)',
    'rgba(244, 67, 54, 0.8)',
    'rgba(33, 150, 243, 0.8)'
];

// Utility functions
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} toast-icon"></i>
        <div class="toast-message">${message}</div>
        <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
    
    // Manual close
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
}

function showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    overlay.querySelector('p').textContent = message;
    overlay.style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-IN').format(number);
}

function generateRandomData(count, min, max, trend = 'stable') {
    const data = [];
    let baseValue = min + (max - min) / 2;
    
    for (let i = 0; i < count; i++) {
        let value;
        switch (trend) {
            case 'upward':
                value = baseValue + (Math.random() - 0.3) * (max - min) * 0.5;
                baseValue += (max - min) * 0.05;
                break;
            case 'downward':
                value = baseValue + (Math.random() - 0.7) * (max - min) * 0.5;
                baseValue -= (max - min) * 0.05;
                break;
            default:
                value = baseValue + (Math.random() - 0.5) * (max - min) * 0.3;
        }
        
        value = Math.max(min, Math.min(max, value));
        data.push(Math.round(value));
    }
    
    return data;
}

// Chart initialization functions
function initEarningsChart() {
    const ctx = document.getElementById('earningsChart').getContext('2d');
    const timeLabels = generateTimeLabels(currentChartPeriods.earnings);
    const earningsData = generateRandomData(timeLabels.length, 50000, 150000, 'upward');
    
    charts.earnings = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Farmer Earnings',
                data: earningsData,
                borderColor: chartColors.primary,
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: chartColors.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: chartColors.primary,
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return 'Earnings: ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function initSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    const timeLabels = generateTimeLabels(currentChartPeriods.sales);
    const salesData = generateRandomData(timeLabels.length, 100, 300, 'upward');
    
    charts.sales = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Crop Sales',
                data: salesData,
                backgroundColor: 'rgba(76, 175, 80, 0.8)',
                borderColor: chartColors.success,
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: chartColors.success,
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return 'Sales: ' + formatNumber(context.parsed.y) + ' units';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initDemandChart() {
    const ctx = document.getElementById('demandChart').getContext('2d');
    const timeLabels = generateTimeLabels(currentChartPeriods.demand);
    const demandData = generateRandomData(timeLabels.length, 80, 250, 'stable');
    
    charts.demand = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Market Demand',
                data: demandData,
                borderColor: chartColors.warning,
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: chartColors.warning,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: chartColors.warning,
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return 'Demand: ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 300,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initBuyersChart() {
    const ctx = document.getElementById('buyersChart').getContext('2d');
    const buyerData = generateBuyerData();
    
    charts.buyers = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: buyerData.labels,
            datasets: [{
                data: buyerData.values,
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(255, 152, 0, 0.8)',
                    'rgba(244, 67, 54, 0.8)'
                ],
                borderColor: [
                    chartColors.primary,
                    chartColors.success,
                    chartColors.warning,
                    chartColors.danger
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + formatNumber(context.parsed) + ' (' + percentage + '%)';
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
    
    updateBuyersLegend(buyerData);
}

function generateTimeLabels(period) {
    const labels = [];
    const now = new Date();
    let count, format;
    
    switch (period) {
        case 'daily':
            count = 7;
            format = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });
            break;
        case 'weekly':
            count = 4;
            format = (date) => 'Week ' + Math.ceil(date.getDate() / 7);
            break;
        case 'monthly':
            count = 12;
            format = (date) => date.toLocaleDateString('en-US', { month: 'short' });
            break;
        default:
            count = 7;
            format = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    
    for (let i = count - 1; i >= 0; i--) {
        const date = new Date(now);
        switch (period) {
            case 'daily':
                date.setDate(date.getDate() - i);
                break;
            case 'weekly':
                date.setDate(date.getDate() - (i * 7));
                break;
            case 'monthly':
                date.setMonth(date.getMonth() - i);
                break;
        }
        labels.push(format(date));
    }
    
    return labels;
}

function generateBuyerData() {
    const categories = ['Retailers', 'Wholesalers', 'Consumers', 'Exporters'];
    const values = [
        Math.floor(Math.random() * 500) + 300,
        Math.floor(Math.random() * 400) + 200,
        Math.floor(Math.random() * 600) + 400,
        Math.floor(Math.random() * 200) + 100
    ];
    
    return { labels: categories, values: values };
}

function updateBuyersLegend(data) {
    const legendContainer = document.getElementById('buyersLegend');
    const colors = ['#667eea', '#4caf50', '#ff9800', '#f44336'];
    
    legendContainer.innerHTML = data.labels.map((label, index) => `
        <div class="legend-item">
            <div class="legend-color" style="background-color: ${colors[index]}"></div>
            <span>${label}</span>
        </div>
    `).join('');
}

// Report generation functions
function generateReports() {
    const reportsGrid = document.getElementById('reportsGrid');
    const reports = [
        {
            title: 'Monthly Earnings Report',
            type: 'earnings',
            date: 'November 2024',
            stats: { value: '₹847,500', change: '+12.5%', transactions: 156 },
            icon: 'fa-money-bill-wave',
            color: '#667eea'
        },
        {
            title: 'Crop Performance Analysis',
            type: 'crops',
            date: 'November 2024',
            stats: { value: '23 varieties', change: '+8.3%', transactions: 89 },
            icon: 'fa-leaf',
            color: '#4caf50'
        },
        {
            title: 'Buyer Behavior Report',
            type: 'buyers',
            date: 'November 2024',
            stats: { value: '486 buyers', change: '+15.2%', transactions: 203 },
            icon: 'fa-users',
            color: '#ff9800'
        },
        {
            title: 'Sales Volume Report',
            type: 'sales',
            date: 'November 2024',
            stats: { value: '1,247 units', change: '+8.3%', transactions: 124 },
            icon: 'fa-shopping-cart',
            color: '#f44336'
        }
    ];
    
    reportsGrid.innerHTML = reports.map(report => `
        <div class="report-card">
            <div class="report-header">
                <div class="report-title">
                    <i class="fas ${report.icon}" style="color: ${report.color}; margin-right: 0.5rem;"></i>
                    ${report.title}
                </div>
                <div class="report-date">${report.date}</div>
            </div>
            <div class="report-stats">
                <div class="report-stat">
                    <div class="report-stat-value">${report.stats.value}</div>
                    <div class="report-stat-label">Total Value</div>
                </div>
                <div class="report-stat">
                    <div class="report-stat-value" style="color: ${report.stats.change.startsWith('+') ? '#4caf50' : '#f44336'}">
                        ${report.stats.change}
                    </div>
                    <div class="report-stat-label">Change</div>
                </div>
            </div>
            <div class="report-actions">
                <button class="btn-small btn-primary" onclick="viewReport('${report.type}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn-small btn-secondary" onclick="downloadReport('${report.type}')">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    `).join('');
}

// Chart update functions
function updateChart(chartName, period) {
    const chart = charts[chartName];
    if (!chart) return;
    
    const timeLabels = generateTimeLabels(period);
    let newData;
    
    switch (chartName) {
        case 'earnings':
            newData = generateRandomData(timeLabels.length, 50000, 150000, 'upward');
            break;
        case 'sales':
            newData = generateRandomData(timeLabels.length, 100, 300, 'upward');
            break;
        case 'demand':
            newData = generateRandomData(timeLabels.length, 80, 250, 'stable');
            break;
    }
    
    chart.data.labels = timeLabels;
    chart.data.datasets[0].data = newData;
    chart.update('active');
}

// PDF Export functionality
async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    try {
        showLoading('Generating PDF Report...');
        
        // Add title
        pdf.setFontSize(20);
        pdf.setTextColor(102, 126, 234);
        pdf.text('AgroChain Analytics Report', 20, 30);
        
        // Add date
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
        
        // Add metrics
        pdf.setFontSize(16);
        pdf.setTextColor(102, 126, 234);
        pdf.text('Key Metrics', 20, 60);
        
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Total Revenue: ₹2,847,500', 20, 70);
        pdf.text('Total Sales: 1,247 units', 20, 78);
        pdf.text('Active Buyers: 486', 20, 86);
        pdf.text('Crop Varieties: 23', 20, 94);
        
        // Add charts as images
        const chartIds = ['earningsChart', 'salesChart', 'demandChart', 'buyersChart'];
        let yPosition = 110;
        
        for (let i = 0; i < chartIds.length; i++) {
            const canvas = document.getElementById(chartIds[i]);
            if (canvas) {
                const imgData = canvas.toDataURL('image/png');
                
                if (i > 0 && i % 2 === 0) {
                    pdf.addPage();
                    yPosition = 20;
                }
                
                pdf.addImage(imgData, 'PNG', 20, yPosition, 170, 85);
                yPosition += 100;
            }
        }
        
        // Save the PDF
        const reportTitle = document.getElementById('reportTitle').value || 'AgroChain Analytics Report';
        pdf.save(`${reportTitle.replace(/\s+/g, '_')}.pdf`);
        
        showToast('PDF report generated successfully!', 'success');
    } catch (error) {
        console.error('PDF generation error:', error);
        showToast('Failed to generate PDF report', 'error');
    } finally {
        hideLoading();
    }
}

// Event handlers
function handleTimeFilterChange() {
    const timeFilter = document.getElementById('timeFilter').value;
    currentTimeFilter = timeFilter;
    
    // Update all charts based on new time filter
    updateAllCharts();
    showToast(`Filter updated to ${timeFilter} view`, 'info');
}

function handleChartPeriodClick(event) {
    const button = event.target;
    if (!button.classList.contains('chart-btn')) return;
    
    const chartName = button.dataset.chart;
    const period = button.dataset.period;
    
    // Update active button
    const container = button.parentElement;
    container.querySelectorAll('.chart-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update chart period
    currentChartPeriods[chartName] = period;
    
    // Update chart
    if (chartName === 'buyers') {
        updateBuyersChart();
    } else {
        updateChart(chartName, period);
    }
}

function updateBuyersChart() {
    const buyerData = generateBuyerData();
    charts.buyers.data.labels = buyerData.labels;
    charts.buyers.data.datasets[0].data = buyerData.values;
    charts.buyers.update('active');
    updateBuyersLegend(buyerData);
}

function updateAllCharts() {
    Object.keys(charts).forEach(chartName => {
        if (chartName !== 'buyers') {
            updateChart(chartName, currentChartPeriods[chartName]);
        }
    });
}

function handleExportClick() {
    document.getElementById('exportModal').style.display = 'block';
}

function handleRefreshClick() {
    showLoading('Refreshing data...');
    
    setTimeout(() => {
        updateAllCharts();
        generateReports();
        hideLoading();
        showToast('Data refreshed successfully!', 'success');
    }, 1500);
}

function handleExportFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const selectedCharts = formData.getAll('charts');
    
    if (selectedCharts.length === 0) {
        showToast('Please select at least one chart to export', 'warning');
        return;
    }
    
    // Close modal
    document.getElementById('exportModal').style.display = 'none';
    
    // Generate PDF
    exportToPDF();
}

function handleModalClose() {
    document.getElementById('exportModal').style.display = 'none';
}

// Report action functions
function viewReport(type) {
    showToast(`Viewing ${type} report details...`, 'info');
}

function downloadReport(type) {
    showToast(`Downloading ${type} report...`, 'success');
}

// Initialize all charts
function initializeCharts() {
    try {
        initEarningsChart();
        initSalesChart();
        initDemandChart();
        initBuyersChart();
        generateReports();
        
        showToast('Analytics dashboard loaded successfully!', 'success');
    } catch (error) {
        console.error('Chart initialization error:', error);
        showToast('Failed to load some charts', 'error');
    }
}

// Service Worker registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    }
}

// Auto-refresh functionality
function startAutoRefresh() {
    setInterval(() => {
        if (!document.hidden) {
            updateAllCharts();
            generateReports();
        }
    }, 300000); // Refresh every 5 minutes
}

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
            case 'r':
                event.preventDefault();
                handleRefreshClick();
                break;
            case 'e':
                event.preventDefault();
                handleExportClick();
                break;
        }
    }
    
    if (event.key === 'Escape') {
        handleModalClose();
    }
});

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    registerServiceWorker();
    startAutoRefresh();
    
    // Time filter
    document.getElementById('timeFilter').addEventListener('change', handleTimeFilterChange);
    
    // Chart period buttons
    document.querySelectorAll('.chart-btn').forEach(button => {
        button.addEventListener('click', handleChartPeriodClick);
    });
    
    // Export and refresh buttons
    document.getElementById('exportPdf').addEventListener('click', handleExportClick);
    document.getElementById('refreshData').addEventListener('click', handleRefreshClick);
    
    // Modal controls
    document.querySelector('.modal-close').addEventListener('click', handleModalClose);
    document.getElementById('cancelExport').addEventListener('click', handleModalClose);
    
    // Export form
    document.getElementById('exportForm').addEventListener('submit', handleExportFormSubmit);
    
    // Close modal when clicking outside
    document.getElementById('exportModal').addEventListener('click', (event) => {
        if (event.target.id === 'exportModal') {
            handleModalClose();
        }
    });
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible, refresh data
        updateAllCharts();
        generateReports();
    }
});

// Export functions for external use
window.AnalyticsReports = {
    refreshData: updateAllCharts,
    exportToPDF: exportToPDF,
    showToast: showToast,
    updateChart: updateChart
};