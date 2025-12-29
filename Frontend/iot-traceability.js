// IoT Traceability JavaScript

// Global Variables
let currentCrop = '';
let sensorData = {};
let timelineData = {};
let iotChart = null;
let selectedTimePeriod = '24h';

// Sensor Data Simulation
const sensorTypes = {
    temperature: {
        min: 15,
        max: 30,
        optimal: [20, 25],
        unit: '°C',
        icon: 'fa-thermometer-half',
        color: '#f39c12'
    },
    humidity: {
        min: 40,
        max: 80,
        optimal: [60, 70],
        unit: '%',
        icon: 'fa-tint',
        color: '#3498db'
    },
    gps: {
        icon: 'fa-map-marker-alt',
        color: '#e74c3c'
    },
    airQuality: {
        levels: ['Good', 'Moderate', 'Poor', 'Unhealthy'],
        icon: 'fa-wind',
        color: '#9b59b6'
    }
};

// Timeline Stages
const timelineStages = [
    {
        id: 'harvest',
        name: 'Harvest',
        icon: 'fa-hand-holding-seedling',
        status: 'completed',
        date: 'Nov 15, 2024',
        details: {
            harvester: 'Rajesh Kumar',
            location: 'Field A, Block 3, Nashik',
            quantity: '500kg',
            quality: 'Grade A'
        },
        iotData: {
            temperature: 24,
            humidity: 65
        }
    },
    {
        id: 'storage',
        name: 'Storage',
        icon: 'fa-warehouse',
        status: 'active',
        date: 'Nov 16, 2024 - Present',
        details: {
            storageUnit: 'Storage Unit A, Warehouse 1',
            storedBy: 'Priya Sharma',
            storageId: 'ST-2024-001',
            security: 'Monitored 24/7'
        },
        iotData: {
            temperature: 22.5,
            humidity: 65,
            airQuality: 'Good'
        }
    },
    {
        id: 'transport',
        name: 'Transport',
        icon: 'fa-truck',
        status: 'pending',
        date: 'Scheduled: Nov 20, 2024',
        details: {
            vehicle: 'MH-12-AB-1234',
            driver: 'Arjun Patel',
            route: 'Nashik → Mumbai',
            eta: '6 hours'
        },
        iotData: {
            gps: 'Live GPS',
            monitoring: 'Active'
        }
    },
    {
        id: 'delivery',
        name: 'Delivery',
        icon: 'fa-shipping-fast',
        status: 'pending',
        date: 'Scheduled: Nov 20, 2024',
        details: {
            destination: 'Mumbai Wholesale Market',
            receiver: 'Suresh Enterprises',
            deliveryNote: 'DN-2024-456',
            signature: 'Digital signature required'
        },
        iotData: {
            qrCode: 'QR Code',
            photoProof: 'Photo Proof'
        }
    }
];

// Utility Functions
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('i');
    
    toastMessage.textContent = message;
    
    // Update icon based on type
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toastIcon.className = `fas ${icons[type]}`;
    toastIcon.style.color = type === 'success' ? 'var(--success-color)' : 
                           type === 'error' ? 'var(--danger-color)' :
                           type === 'warning' ? 'var(--warning-color)' : 'var(--info-color)';
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading(message = 'Processing...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = loadingOverlay.querySelector('p');
    loadingText.textContent = message;
    loadingOverlay.classList.add('show');
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('show');
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function copyHash(hash) {
    navigator.clipboard.writeText(hash).then(() => {
        showToast('Hash copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy hash', 'error');
    });
}

function generateRandomHash() {
    return '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function generateSensorData(type) {
    const sensor = sensorTypes[type];
    if (type === 'temperature' || type === 'humidity') {
        const value = Math.random() * (sensor.max - sensor.min) + sensor.min;
        const isOptimal = value >= sensor.optimal[0] && value <= sensor.optimal[1];
        return {
            value: value.toFixed(1),
            unit: sensor.unit,
            optimal: isOptimal,
            percentage: ((value - sensor.min) / (sensor.max - sensor.min)) * 100
        };
    } else if (type === 'air-quality') {
        const levelIndex = Math.floor(Math.random() * sensorTypes.airQuality.levels.length);
        return {
            level: sensorTypes.airQuality.levels[levelIndex],
            aqi: Math.floor(Math.random() * 200) + 1
        };
    } else if (type === 'gps') {
        return {
            lat: (19 + Math.random() * 0.1).toFixed(4) + '° N',
            lng: (72 + Math.random() * 0.1).toFixed(4) + '° E',
            location: 'Mumbai, Maharashtra',
            accuracy: '±' + Math.floor(Math.random() * 10 + 1) + 'm'
        };
    }
}

function getTrendIcon(current, previous) {
    if (current > previous) return 'fa-arrow-up';
    if (current < previous) return 'fa-arrow-down';
    return 'fa-minus';
}

function getTrendClass(current, previous) {
    if (current > previous) return 'increasing';
    if (current < previous) return 'decreasing';
    return 'stable';
}

// Sensor Card Functions
function updateSensorCard(sensorType, data) {
    const card = document.querySelector(`.sensor-card.${sensorType}`);
    if (!card || !data) return;
    
    if (sensorType === 'temperature' || sensorType === 'humidity') {
        const valueElement = card.querySelector('.current-value .value');
        const unitElement = card.querySelector('.current-value .unit');
        const rangeFill = card.querySelector('.range-fill');
        const trendIcon = card.querySelector('.trend-indicator i');
        const trendIndicator = card.querySelector('.trend-indicator');
        
        valueElement.textContent = data.value;
        unitElement.textContent = data.unit;
        rangeFill.style.width = data.percentage + '%';
        
        // Simulate trend
        const previousValue = parseFloat(valueElement.textContent);
        const trendClass = getTrendClass(parseFloat(data.value), previousValue);
        trendIndicator.className = `trend-indicator ${trendClass}`;
        trendIcon.className = `fas ${getTrendIcon(parseFloat(data.value), previousValue)}`;
        
        // Update last updated time
        const lastUpdated = card.querySelector('.last-updated');
        lastUpdated.innerHTML = '<i class="fas fa-clock"></i> Updated just now';
    } else if (sensorType === 'gps') {
        const latElement = card.querySelector('.lat');
        const lngElement = card.querySelector('.lng');
        const locationElement = card.querySelector('.location-address');
        const accuracyElement = card.querySelector('.accuracy');
        
        latElement.textContent = data.lat;
        lngElement.textContent = data.lng;
        locationElement.textContent = data.location;
        accuracyElement.textContent = 'Accuracy: ' + data.accuracy;
    } else if (sensorType === 'air-quality') {
        const valueElement = card.querySelector('.current-value .value');
        const aqiElement = card.querySelector('.current-value .aqi');
        const qualityFill = card.querySelector('.quality-fill');
        
        valueElement.textContent = data.level;
        aqiElement.textContent = 'AQI: ' + data.aqi;
        
        let qualityClass = 'good';
        if (data.aqi > 100) qualityClass = 'moderate';
        if (data.aqi > 150) qualityClass = 'poor';
        
        qualityFill.className = `quality-fill ${qualityClass}`;
        qualityFill.style.width = Math.min(data.aqi / 200 * 100, 100) + '%';
    }
}

function refreshAllSensors() {
    const sensors = ['temperature', 'humidity', 'gps', 'air-quality'];
    sensors.forEach(sensor => {
        const data = generateSensorData(sensor);
        updateSensorCard(sensor, data);
    });
    
    showToast('IoT sensors refreshed successfully!', 'success');
}

// Timeline Functions
function updateTimelineStage(stageId, status) {
    const stageElement = document.querySelector(`[data-stage="${stageId}"]`);
    if (!stageElement) return;
    
    // Remove all status classes
    stageElement.classList.remove('completed', 'active', 'pending');
    stageElement.classList.add(status);
    
    // Update status badge
    const statusElement = stageElement.querySelector('.stage-status');
    const statusIcon = statusElement.querySelector('i');
    const statusText = statusElement.querySelector('span');
    
    const statusConfig = {
        completed: { icon: 'fa-check-circle', text: 'Completed', class: 'completed' },
        active: { icon: 'fa-clock', text: 'In Progress', class: 'active' },
        pending: { icon: 'fa-hourglass-half', text: 'Pending', class: 'pending' }
    };
    
    const config = statusConfig[status];
    statusIcon.className = `fas ${config.icon}`;
    statusText.textContent = config.text;
    statusElement.className = `stage-status ${config.class}`;
}

function animateTimelineProgress() {
    const stages = document.querySelectorAll('.timeline-stage');
    stages.forEach((stage, index) => {
        setTimeout(() => {
            stage.style.opacity = '0';
            stage.style.transform = 'translateY(20px)';
            setTimeout(() => {
                stage.style.opacity = '1';
                stage.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
}

// IoT Chart Functions
function initIoTChart() {
    const ctx = document.getElementById('iotChart');
    if (!ctx) return;
    
    const data = generateChartData(selectedTimePeriod);
    
    iotChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: data.temperature,
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Humidity (%)',
                    data: data.humidity,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'IoT Sensor Data Trends'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        }
    });
}

function generateChartData(period) {
    const now = new Date();
    const data = {
        labels: [],
        temperature: [],
        humidity: []
    };
    
    let points, interval;
    switch (period) {
        case '24h':
            points = 24;
            interval = 60 * 60 * 1000; // 1 hour
            break;
        case '7d':
            points = 7;
            interval = 24 * 60 * 60 * 1000; // 1 day
            break;
        case '30d':
            points = 30;
            interval = 24 * 60 * 60 * 1000; // 1 day
            break;
        default:
            points = 10;
            interval = 24 * 60 * 60 * 1000; // 1 day
    }
    
    for (let i = points - 1; i >= 0; i--) {
        const time = new Date(now.getTime() - i * interval);
        data.labels.push(period === '24h' ? 
            time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) :
            time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        );
        
        data.temperature.push(Math.random() * 10 + 20); // 20-30°C
        data.humidity.push(Math.random() * 20 + 60); // 60-80%
    }
    
    return data;
}

function updateChartPeriod(period) {
    selectedTimePeriod = period;
    
    // Update button states
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-period="${period}"]`).classList.add('active');
    
    // Update chart data
    if (iotChart) {
        const data = generateChartData(period);
        iotChart.data.labels = data.labels;
        iotChart.data.datasets[0].data = data.temperature;
        iotChart.data.datasets[1].data = data.humidity;
        iotChart.update('active');
    }
}

// Blockchain Verification Functions
function verifyAuthenticity() {
    showModal('verificationModal');
    
    // Simulate verification process
    const steps = document.querySelectorAll('.process-step');
    let currentStep = 0;
    
    const verificationInterval = setInterval(() => {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            step.classList.remove('pending', 'active');
            step.classList.add('completed');
            step.querySelector('i').className = 'fas fa-check';
            
            if (currentStep + 1 < steps.length) {
                steps[currentStep + 1].classList.remove('pending');
                steps[currentStep + 1].classList.add('active');
                steps[currentStep + 1].querySelector('i').className = 'fas fa-spinner fa-spin';
            }
            
            currentStep++;
        } else {
            clearInterval(verificationInterval);
            
            // Show success result
            setTimeout(() => {
                document.getElementById('verificationResult').style.display = 'block';
                document.getElementById('downloadCertificate').style.display = 'flex';
                showToast('Blockchain verification completed successfully!', 'success');
            }, 500);
        }
    }, 1500);
}

function viewCertificate() {
    showModal('certificateModal');
}

function downloadCertificate() {
    showToast('Certificate download started...', 'info');
    
    // Simulate certificate download
    setTimeout(() => {
        showToast('Certificate downloaded successfully!', 'success');
        hideModal('certificateModal');
    }, 2000);
}

function downloadQR() {
    showToast('QR code download started...', 'info');
    
    // Simulate QR download
    setTimeout(() => {
        showToast('QR code downloaded successfully!', 'success');
    }, 1500);
}

function shareQR() {
    if (navigator.share) {
        navigator.share({
            title: 'AgroChain Crop Traceability',
            text: 'Verify the authenticity of this crop batch',
            url: window.location.href
        }).then(() => {
            showToast('QR code shared successfully!', 'success');
        }).catch(() => {
            showToast('Failed to share QR code', 'error');
        });
    } else {
        // Fallback: copy link to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Link copied to clipboard!', 'success');
        });
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initIoTChart();
    animateTimelineProgress();
    
    // Set up auto-refresh for sensors
    setInterval(refreshAllSensors, 30000); // Refresh every 30 seconds
    
    // Crop selection
    const cropSelect = document.getElementById('cropSelect');
    if (cropSelect) {
        cropSelect.addEventListener('change', function() {
            currentCrop = this.value;
            if (currentCrop) {
                showLoading('Loading crop data...');
                setTimeout(() => {
                    hideLoading();
                    refreshAllSensors();
                    showToast('Crop data loaded successfully!', 'success');
                }, 1000);
            }
        });
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            refreshAllSensors();
        });
    }
    
    // Chart period buttons
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const period = this.getAttribute('data-period');
            updateChartPeriod(period);
        });
    });
    
    // Verification buttons
    const verifyBtn = document.getElementById('verifyAuthenticity');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', verifyAuthenticity);
    }
    
    const viewCertBtn = document.getElementById('viewCertificate');
    if (viewCertBtn) {
        viewCertBtn.addEventListener('click', viewCertificate);
    }
    
    const downloadCertBtn = document.getElementById('downloadCertificate');
    if (downloadCertBtn) {
        downloadCertBtn.addEventListener('click', downloadCertificate);
    }
    
    // QR buttons
    const downloadQRBtn = document.getElementById('downloadQR');
    if (downloadQRBtn) {
        downloadQRBtn.addEventListener('click', downloadQR);
    }
    
    const shareQRBtn = document.getElementById('shareQR');
    if (shareQRBtn) {
        shareQRBtn.addEventListener('click', shareQR);
    }
    
    // Modal close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.closest('.modal-overlay').id;
            hideModal(modalId);
        });
    });
    
    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this.id);
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.show').forEach(modal => {
                hideModal(modal.id);
            });
        }
        
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            refreshAllSensors();
        }
    });
    
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }).catch(function(err) {
            console.log('ServiceWorker registration failed');
        });
    }
    
    // Simulate real-time updates
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every 5 seconds
            const sensorTypes = ['temperature', 'humidity'];
            const randomSensor = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
            const data = generateSensorData(randomSensor);
            updateSensorCard(randomSensor, data);
        }
    }, 5000);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause updates
        console.log('Page hidden - pausing updates');
    } else {
        // Page is visible, resume updates
        console.log('Page visible - resuming updates');
        refreshAllSensors();
    }
});

// Export functions for external use
window.IoTTraceability = {
    refreshSensors: refreshAllSensors,
    updateChartPeriod: updateChartPeriod,
    verifyAuthenticity: verifyAuthenticity,
    showToast: showToast,
    hideModal: hideModal
};