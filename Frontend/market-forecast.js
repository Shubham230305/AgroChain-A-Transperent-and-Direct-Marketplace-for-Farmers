// Market Price Forecast JavaScript

// Global Variables
let priceChart = null;
let currentCrop = 'wheat';
let currentTimeRange = '7d';
let chartType = 'price';
let aiRecommendations = {};
let marketData = {};
let priceAlerts = [];

// Sample Data Generator
const generateSampleData = () => {
    const crops = {
        wheat: { basePrice: 25, volatility: 0.15, trend: 'upward', seasonality: 'winter' },
        rice: { basePrice: 35, volatility: 0.12, trend: 'stable', seasonality: 'monsoon' },
        tomato: { basePrice: 20, volatility: 0.25, trend: 'volatile', seasonality: 'summer' },
        potato: { basePrice: 18, volatility: 0.18, trend: 'seasonal', seasonality: 'winter' },
        onion: { basePrice: 30, volatility: 0.30, trend: 'cyclical', seasonality: 'all' },
        cabbage: { basePrice: 15, volatility: 0.20, trend: 'seasonal', seasonality: 'winter' },
        cauliflower: { basePrice: 22, volatility: 0.22, trend: 'seasonal', seasonality: 'winter' },
        brinjal: { basePrice: 25, volatility: 0.16, trend: 'stable', seasonality: 'summer' },
        spinach: { basePrice: 12, volatility: 0.18, trend: 'seasonal', seasonality: 'winter' },
        carrot: { basePrice: 28, volatility: 0.14, trend: 'upward', seasonality: 'winter' },
        radish: { basePrice: 16, volatility: 0.19, trend: 'seasonal', seasonality: 'winter' },
        'bitter-gourd': { basePrice: 32, volatility: 0.21, trend: 'seasonal', seasonality: 'summer' },
        'bottle-gourd': { basePrice: 14, volatility: 0.17, trend: 'seasonal', seasonality: 'summer' },
        okra: { basePrice: 26, volatility: 0.15, trend: 'stable', seasonality: 'summer' },
        chili: { basePrice: 40, volatility: 0.28, trend: 'volatile', seasonality: 'summer' },
        coriander: { basePrice: 80, volatility: 0.35, trend: 'volatile', seasonality: 'winter' },
        apple: { basePrice: 120, volatility: 0.12, trend: 'seasonal', seasonality: 'autumn' },
        banana: { basePrice: 45, volatility: 0.10, trend: 'stable', seasonality: 'all' },
        mango: { basePrice: 60, volatility: 0.25, trend: 'seasonal', seasonality: 'summer' },
        orange: { basePrice: 55, volatility: 0.15, trend: 'seasonal', seasonality: 'winter' }
    };

    const getSeasonalMultiplier = (crop) => {
        const now = new Date();
        const month = now.getMonth();
        const cropData = crops[crop];
        
        if (!cropData.seasonality || cropData.seasonality === 'all') return 1;
        
        const seasonalMultipliers = {
            winter: month >= 10 || month <= 2 ? 1.2 : 0.9,
            summer: month >= 3 && month <= 6 ? 1.3 : 0.8,
            monsoon: month >= 6 && month <= 9 ? 1.1 : 0.95,
            autumn: month >= 9 && month <= 11 ? 1.15 : 0.9
        };
        
        return seasonalMultipliers[cropData.seasonality] || 1;
    };

    const generateTimeSeries = (crop, timeRange) => {
        const cropData = crops[crop];
        const seasonalMultiplier = getSeasonalMultiplier(crop);
        const basePrice = cropData.basePrice * seasonalMultiplier;
        
        let dataPoints = 7;
        let predictionPoints = 7;
        
        switch (timeRange) {
            case '1m':
                dataPoints = 30;
                predictionPoints = 15;
                break;
            case '3m':
                dataPoints = 90;
                predictionPoints = 30;
                break;
            case '6m':
                dataPoints = 180;
                predictionPoints = 60;
                break;
            case '1y':
                dataPoints = 365;
                predictionPoints = 90;
                break;
        }

        const historicalData = [];
        const predictedData = [];
        const labels = [];
        const predictionLabels = [];

        // Generate historical data
        for (let i = dataPoints - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            let price = basePrice;
            
            // Add trend
            if (cropData.trend === 'upward') {
                price += (dataPoints - i) * 0.1;
            } else if (cropData.trend === 'downward') {
                price -= (dataPoints - i) * 0.1;
            }
            
            // Add volatility
            price += (Math.random() - 0.5) * basePrice * cropData.volatility;
            
            // Add some cyclical patterns
            price += Math.sin(i * 0.1) * basePrice * 0.05;
            
            historicalData.push(Math.max(price, basePrice * 0.5));
            labels.push(date.toLocaleDateString('mr-IN', { month: 'short', day: 'numeric' }));
        }

        // Generate predicted data
        const lastPrice = historicalData[historicalData.length - 1];
        
        for (let i = 1; i <= predictionPoints; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            
            let predictedPrice = lastPrice;
            
            // Add trend continuation
            if (cropData.trend === 'upward') {
                predictedPrice += i * 0.15;
            } else if (cropData.trend === 'downward') {
                predictedPrice -= i * 0.15;
            }
            
            // Add some uncertainty
            const uncertainty = (i / predictionPoints) * cropData.volatility;
            predictedPrice += (Math.random() - 0.5) * basePrice * uncertainty;
            
            predictedData.push(Math.max(predictedPrice, basePrice * 0.5));
            predictionLabels.push(date.toLocaleDateString('mr-IN', { month: 'short', day: 'numeric' }));
        }

        return {
            historical: {
                data: historicalData,
                labels: labels
            },
            predicted: {
                data: predictedData,
                labels: predictionLabels
            },
            currentPrice: historicalData[historicalData.length - 1],
            confidence: Math.max(75, 95 - (cropData.volatility * 50))
        };
    };

    return { crops, generateTimeSeries };
};

// Initialize Chart
const initChart = () => {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    const chartConfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'सध्याचा भाव (₹/किलो)',
                    data: [],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2563eb',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'AI अंदाज (₹/किलो)',
                    data: [],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#f59e0b',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'विश्वासार्हता सीमा',
                    data: [],
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 1,
                    fill: '+1',
                    tension: 0.4,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#2563eb',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            return 'तारीख: ' + context[0].label;
                        },
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ₹' + context.parsed.y.toFixed(2) + '/किलो';
                            }
                            return label;
                        },
                        afterBody: function(context) {
                            if (context[0].datasetIndex === 1) {
                                return 'AI अंदाज - ' + getConfidenceText() + '% खात्री';
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        color: '#64748b'
                    }
                },
                y: {
                    display: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        color: '#64748b',
                        callback: function(value) {
                            return '₹' + value.toFixed(0);
                        }
                    },
                    title: {
                        display: true,
                        text: 'किंमत (₹/किलो)',
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        color: '#374151'
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            },
            elements: {
                point: {
                    hoverBackgroundColor: '#ffffff',
                    hoverBorderWidth: 3
                }
            }
        }
    };

    priceChart = new Chart(ctx, chartConfig);
    return priceChart;
};

// Update Chart Data
const updateChart = (crop, timeRange) => {
    const { generateTimeSeries } = generateSampleData();
    const data = generateTimeSeries(crop, timeRange);
    
    marketData[crop] = data;
    
    // Update chart with animation
    priceChart.data.labels = [...data.historical.labels, ...data.predicted.labels];
    
    // Historical data
    priceChart.data.datasets[0].data = data.historical.data;
    
    // Predicted data with confidence intervals
    priceChart.data.datasets[1].data = [...Array(data.historical.data.length).fill(null), ...data.predicted.data];
    
    // Confidence intervals
    const confidenceUpper = data.predicted.data.map(val => val * 1.1);
    const confidenceLower = data.predicted.data.map(val => val * 0.9);
    priceChart.data.datasets[2].data = [...Array(data.historical.data.length).fill(null), ...confidenceUpper];
    priceChart.data.datasets[3] = {
        label: 'खालची सीमा',
        data: [...Array(data.historical.data.length).fill(null), ...confidenceLower],
        borderColor: 'rgba(16, 185, 129, 0.3)',
        backgroundColor: 'transparent',
        borderWidth: 1,
        fill: false,
        tension: 0.4,
        pointRadius: 0
    };
    
    // Update colors based on trend
    const trend = getTrendDirection(data.historical.data);
    updateChartColors(trend);
    
    priceChart.update('active');
    
    // Update UI elements
    updateSummaryCards(data);
    updateAIRecommendations(crop, data);
    
    showToast('भाव अंदाज अद्ययावत झाला!', 'success');
};

// Get Trend Direction
const getTrendDirection = (data) => {
    if (data.length < 2) return 'neutral';
    
    const recent = data.slice(-7);
    const older = data.slice(-14, -7);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (change > 5) return 'profit';
    if (change < -5) return 'risk';
    return 'neutral';
};

// Update Chart Colors
const updateChartColors = (trend) => {
    const colors = {
        profit: {
            historical: '#10b981',
            predicted: '#059669',
            confidence: 'rgba(16, 185, 129, 0.1)'
        },
        risk: {
            historical: '#ef4444',
            predicted: '#dc2626',
            confidence: 'rgba(239, 68, 68, 0.1)'
        },
        neutral: {
            historical: '#2563eb',
            predicted: '#f59e0b',
            confidence: 'rgba(59, 130, 246, 0.1)'
        }
    };
    
    const selectedColors = colors[trend];
    
    priceChart.data.datasets[0].borderColor = selectedColors.historical;
    priceChart.data.datasets[0].backgroundColor = selectedColors.confidence;
    priceChart.data.datasets[1].borderColor = selectedColors.predicted;
    priceChart.data.datasets[2].backgroundColor = selectedColors.confidence;
};

// Update Summary Cards
const updateSummaryCards = (data) => {
    const currentPrice = data.currentPrice;
    const avgPrice = data.historical.data.reduce((a, b) => a + b, 0) / data.historical.data.length;
    const weeklyChange = ((currentPrice - data.historical.data[0]) / data.historical.data[0]) * 100;
    const demandIndex = Math.floor(Math.random() * 40) + 60; // Simulated demand index
    const aiAccuracy = data.confidence;
    
    document.getElementById('avgPrice').textContent = `₹${avgPrice.toFixed(2)}`;
    document.getElementById('weeklyChange').textContent = `${weeklyChange >= 0 ? '+' : ''}${weeklyChange.toFixed(1)}%`;
    document.getElementById('demandIndex').textContent = `${demandIndex}/100`;
    document.getElementById('aiAccuracy').textContent = `${aiAccuracy}%`;
    
    // Update change indicators
    const changeElements = document.querySelectorAll('.card-change');
    changeElements[0].textContent = `₹${(currentPrice - avgPrice).toFixed(2)} (${((currentPrice - avgPrice) / avgPrice * 100).toFixed(1)}%)`;
    changeElements[0].className = `card-change ${weeklyChange >= 0 ? 'positive' : 'negative'}`;
    changeElements[1].className = `card-change ${weeklyChange >= 0 ? 'positive' : 'negative'}`;
    changeElements[2].className = `card-change ${demandIndex > 70 ? 'good' : demandIndex > 40 ? 'moderate' : 'negative'}`;
    changeElements[3].className = `card-change good`;
};

// Update AI Recommendations
const updateAIRecommendations = (crop, data) => {
    const cropNames = {
        wheat: 'गहू',
        rice: 'तांदूळ',
        tomato: 'टोमॅटो',
        potato: 'बटाटा',
        onion: 'कांदा',
        cabbage: 'कोबी',
        cauliflower: 'फ्लॉवर',
        brinjal: 'वांगे',
        spinach: 'पालक',
        carrot: 'गाजर',
        radish: 'मुळा',
        'bitter-gourd': 'कारले',
        'bottle-gourd': 'दुधी भोपळा',
        okra: 'भेंडी',
        chili: 'मिरची',
        coriander: 'कोथिंबीर',
        apple: 'सफरचंद',
        banana: 'केळे',
        mango: 'आंबा',
        orange: 'संत्री'
    };
    
    const cropName = cropNames[crop] || crop;
    const currentPrice = data.currentPrice;
    const avgPrice = data.historical.data.reduce((a, b) => a + b, 0) / data.historical.data.length;
    const trend = getTrendDirection(data.historical.data);
    const confidence = data.confidence;
    
    // Best time to sell
    const bestTimePeriod = trend === 'profit' ? 'पुढील ३-५ दिवस' : '२-३ आठवडे थांबा';
    const expectedPrice = trend === 'profit' 
        ? `₹${(currentPrice * 1.1).toFixed(0)}-${(currentPrice * 1.2).toFixed(0)}/किलो`
        : `₹${(currentPrice * 0.9).toFixed(0)}-${(currentPrice * 1.1).toFixed(0)}/किलो`;
    
    document.getElementById('bestTimePeriod').textContent = bestTimePeriod;
    document.getElementById('expectedPrice').textContent = expectedPrice;
    document.querySelector('.confidence-meter .meter-fill').style.width = `${confidence}%`;
    document.querySelector('.confidence-meter .meter-text').textContent = `${confidence}% खात्री`;
    
    // Market trend
    const trendArrow = document.querySelector('.trend-arrow');
    const trendText = document.querySelector('.trend-text');
    const trendChange = document.querySelector('.trend-change');
    const trendAnalysis = document.querySelector('.trend-analysis p');
    
    if (trend === 'profit') {
        trendArrow.textContent = '↗️';
        trendArrow.className = 'trend-arrow up';
        trendText.textContent = 'सकारात्मक ट्रेंड';
        trendChange.textContent = '+१२.५%';
        trendChange.className = 'trend-change positive';
        trendAnalysis.textContent = 'मागणी वाढत आहे. पुरवठा स्थिर आहे. भाव वाढण्याची शक्यता.';
    } else if (trend === 'risk') {
        trendArrow.textContent = '↘️';
        trendArrow.className = 'trend-arrow down';
        trendText.textContent = 'नकारात्मक ट्रेंड';
        trendChange.textContent = '-८.३%';
        trendChange.className = 'trend-change negative';
        trendAnalysis.textContent = 'मागणी कमी होत आहे. पुरवठा वाढत आहे. भाव कमी होण्याची शक्यता.';
    } else {
        trendArrow.textContent = '→';
        trendArrow.className = 'trend-arrow';
        trendText.textContent = 'स्थिर ट्रेंड';
        trendChange.textContent = '+२.१%';
        trendChange.className = 'trend-change positive';
        trendAnalysis.textContent = 'बाजार स्थिर आहे. मोठ्या बदलाची शक्यता कमी आहे.';
    }
    
    // Risk assessment
    const riskLevel = document.querySelector('.risk-level');
    const riskValue = document.querySelector('.risk-value');
    const riskRecommendation = document.querySelector('.risk-recommendation p');
    
    if (trend === 'profit') {
        riskLevel.className = 'risk-level low';
        riskValue.textContent = 'कमी';
        riskValue.style.color = 'var(--success-color)';
        riskRecommendation.textContent = 'सध्याच्या परिस्थितीत विक्री सुरक्षित आहे.';
    } else if (trend === 'risk') {
        riskLevel.className = 'risk-level high';
        riskValue.textContent = 'जास्त';
        riskValue.style.color = 'var(--danger-color)';
        riskRecommendation.textContent = 'जोखीम टाळण्यासाठी थांबणे योग्य ठरेल.';
    } else {
        riskLevel.className = 'risk-level medium';
        riskValue.textContent = 'मध्यम';
        riskValue.style.color = 'var(--warning-color)';
        riskRecommendation.textContent = 'सावधपणे निर्णय घ्या.';
    }
    
    // Update confidence value
    document.getElementById('confidenceValue').textContent = `${confidence}%`;
};

// Get Confidence Text
const getConfidenceText = () => {
    const confidence = marketData[currentCrop]?.confidence || 80;
    if (confidence >= 90) return 'उच्च';
    if (confidence >= 75) return 'मध्यम';
    return 'कमी';
};

// Event Listeners
const setupEventListeners = () => {
    // Crop selector
    document.getElementById('cropSelector').addEventListener('change', (e) => {
        currentCrop = e.target.value;
        updateChart(currentCrop, currentTimeRange);
        showLoadingOverlay();
        setTimeout(() => hideLoadingOverlay(), 1500);
    });
    
    // Time range buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentTimeRange = e.target.dataset.range;
            updateChart(currentCrop, currentTimeRange);
        });
    });
    
    // Chart type buttons
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            chartType = e.target.dataset.type;
            updateChartType(chartType);
        });
    });
    
    // Refresh button
    document.getElementById('refreshData').addEventListener('click', () => {
        showLoadingOverlay();
        setTimeout(() => {
            updateChart(currentCrop, currentTimeRange);
            hideLoadingOverlay();
            showToast('डेटा रिफ्रेश झाला!', 'success');
        }, 1000);
    });
    
    // Get advice button
    document.getElementById('getAdviceBtn').addEventListener('click', () => {
        showAIAdviceModal();
    });
    
    // Modal controls
    document.getElementById('closeModal').addEventListener('click', hideAIAdviceModal);
    document.getElementById('saveAdviceBtn').addEventListener('click', saveAIAdvice);
    document.getElementById('applyAdviceBtn').addEventListener('click', applyAIAdvice);
    
    // Price alert
    document.getElementById('setAlertBtn').addEventListener('click', showPriceAlertModal);
    document.getElementById('closeAlertModal').addEventListener('click', hidePriceAlertModal);
    document.getElementById('setAlertBtn').addEventListener('click', setPriceAlert);
    document.getElementById('cancelAlertBtn').addEventListener('click', hidePriceAlertModal);
    
    // Quick actions
    document.getElementById('compareCropsBtn').addEventListener('click', () => {
        showToast('पिक तुलना वैशिष्ट्य लवकर येत आहे!', 'info');
    });
    
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
    document.getElementById('shareForecastBtn').addEventListener('click', shareForecast);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideAIAdviceModal();
            hidePriceAlertModal();
        }
        
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'r':
                    e.preventDefault();
                    document.getElementById('refreshData').click();
                    break;
                case 'a':
                    e.preventDefault();
                    document.getElementById('getAdviceBtn').click();
                    break;
            }
        }
    });
    
    // Auto-refresh every 5 minutes
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance to update
            updateChart(currentCrop, currentTimeRange);
        }
    }, 300000);
};

// Update Chart Type
const updateChartType = (type) => {
    let data, labels;
    
    switch (type) {
        case 'trend':
            data = marketData[currentCrop]?.historical.data.map((price, index, arr) => {
                if (index === 0) return 0;
                return ((price - arr[0]) / arr[0]) * 100;
            }) || [];
            labels = marketData[currentCrop]?.historical.labels || [];
            priceChart.data.datasets[0].label = 'भाव बदल (%)';
            priceChart.options.scales.y.title.text = 'बदल (%)';
            break;
            
        case 'volume':
            // Simulated volume data
            data = marketData[currentCrop]?.historical.data.map(() => 
                Math.floor(Math.random() * 1000) + 500
            ) || [];
            labels = marketData[currentCrop]?.historical.labels || [];
            priceChart.data.datasets[0].label = 'व्यापार खंड (क्विंटल)';
            priceChart.options.scales.y.title.text = 'खंड (क्विंटल)';
            break;
            
        default: // price
            data = marketData[currentCrop]?.historical.data || [];
            labels = marketData[currentCrop]?.historical.labels || [];
            priceChart.data.datasets[0].label = 'सध्याचा भाव (₹/किलो)';
            priceChart.options.scales.y.title.text = 'किंमत (₹/किलो)';
    }
    
    priceChart.data.datasets[0].data = data;
    priceChart.data.labels = labels;
    priceChart.update('active');
};

// Modal Functions
const showAIAdviceModal = () => {
    const modal = document.getElementById('aiAdviceModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add animation to modal content
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.add('bounce-in');
    
    setTimeout(() => {
        modalContent.classList.remove('bounce-in');
    }, 600);
};

const hideAIAdviceModal = () => {
    const modal = document.getElementById('aiAdviceModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

const showPriceAlertModal = () => {
    const modal = document.getElementById('priceAlertModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const hidePriceAlertModal = () => {
    const modal = document.getElementById('priceAlertModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

// Save AI Advice
const saveAIAdvice = () => {
    const advice = {
        crop: currentCrop,
        timestamp: new Date().toISOString(),
        recommendations: aiRecommendations,
        confidence: marketData[currentCrop]?.confidence || 80
    };
    
    let savedAdvice = JSON.parse(localStorage.getItem('aiAdvice') || '[]');
    savedAdvice.push(advice);
    localStorage.setItem('aiAdvice', JSON.stringify(savedAdvice));
    
    showToast('AI सल्ला जतन झाला!', 'success');
    hideAIAdviceModal();
};

// Apply AI Advice
const applyAIAdvice = () => {
    showToast('AI सल्ला अमलात आणला आहे!', 'success');
    hideAIAdviceModal();
    
    // Add visual feedback
    document.querySelector('.recommendations-section').classList.add('fade-in');
    setTimeout(() => {
        document.querySelector('.recommendations-section').classList.remove('fade-in');
    }, 1000);
};

// Set Price Alert
const setPriceAlert = () => {
    const alertType = document.getElementById('alertType').value;
    const alertPrice = parseFloat(document.getElementById('alertPrice').value);
    
    if (!alertPrice || alertPrice <= 0) {
        showToast('कृपया योग्य किंमत प्रविष्ट करा', 'error');
        return;
    }
    
    const alert = {
        id: Date.now(),
        crop: currentCrop,
        type: alertType,
        price: alertPrice,
        active: true,
        createdAt: new Date().toISOString()
    };
    
    priceAlerts.push(alert);
    localStorage.setItem('priceAlerts', JSON.stringify(priceAlerts));
    
    showToast('भाव अलर्ट सेट झाला!', 'success');
    hidePriceAlertModal();
    
    // Reset form
    document.getElementById('alertForm').reset();
};

// Export Data
const exportData = () => {
    const data = {
        crop: currentCrop,
        timeRange: currentTimeRange,
        historicalData: marketData[currentCrop]?.historical,
        predictedData: marketData[currentCrop]?.predicted,
        recommendations: aiRecommendations,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentCrop}-market-forecast-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showToast('डेटा एक्सपोर्ट झाला!', 'success');
};

// Share Forecast
const shareForecast = () => {
    if (navigator.share) {
        navigator.share({
            title: `${currentCrop} बाजार भाव अंदाज`,
            text: `AI अंदाजानुसार ${currentCrop} चा सध्याचा भाव ₹${marketData[currentCrop]?.currentPrice.toFixed(2)}/किलो आहे.`,
            url: window.location.href
        }).then(() => {
            showToast('अंदाज शेअर झाला!', 'success');
        }).catch(() => {
            showToast('शेअर करता आले नाही', 'error');
        });
    } else {
        // Fallback - copy to clipboard
        const text = `AI अंदाजानुसार ${currentCrop} चा सध्याचा भाव ₹${marketData[currentCrop]?.currentPrice.toFixed(2)}/किलो आहे.`;
        navigator.clipboard.writeText(text).then(() => {
            showToast('अंदाज क्लिपबोर्डवर कॉपी झाला!', 'success');
        });
    }
};

// Toast Notification
const showToast = (message, type = 'info') => {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');
    
    // Set icon based on type
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toastIcon.textContent = icons[type] || icons.info;
    toastMessage.textContent = message;
    
    // Set color based on type
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
};

// Loading Overlay
const showLoadingOverlay = () => {
    document.getElementById('loadingOverlay').classList.add('active');
};

const hideLoadingOverlay = () => {
    document.getElementById('loadingOverlay').classList.remove('active');
};

// Navigation
const goBack = () => {
    window.history.back();
};

// Initialize Application
const initApp = () => {
    console.log('🚀 Market Price Forecast initializing...');
    
    // Initialize chart
    initChart();
    
    // Load saved data
    loadSavedData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial data load
    setTimeout(() => {
        updateChart(currentCrop, currentTimeRange);
        showToast('AI बाजार अंदाज सज्ज आहे!', 'success');
    }, 500);
    
    // Add page animations
    document.querySelectorAll('.recommendation-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('slide-in-right');
    });
    
    document.querySelectorAll('.summary-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
        card.classList.add('slide-in-left');
    });
    
    console.log('✅ Market Price Forecast initialized successfully!');
};

// Load Saved Data
const loadSavedData = () => {
    // Load price alerts
    const savedAlerts = localStorage.getItem('priceAlerts');
    if (savedAlerts) {
        priceAlerts = JSON.parse(savedAlerts);
    }
    
    // Load user preferences
    const preferences = localStorage.getItem('marketPreferences');
    if (preferences) {
        const prefs = JSON.parse(preferences);
        currentCrop = prefs.crop || 'wheat';
        currentTimeRange = prefs.timeRange || '7d';
        chartType = prefs.chartType || 'price';
        
        // Apply preferences
        document.getElementById('cropSelector').value = currentCrop;
        document.querySelector(`[data-range="${currentTimeRange}"]`).classList.add('active');
        document.querySelector(`[data-type="${chartType}"]`).classList.add('active');
    }
    
    // Save preferences on change
    const savePreferences = () => {
        const preferences = {
            crop: currentCrop,
            timeRange: currentTimeRange,
            chartType: chartType,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('marketPreferences', JSON.stringify(preferences));
    };
    
    // Add preference saving to relevant events
    document.getElementById('cropSelector').addEventListener('change', savePreferences);
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', savePreferences);
    });
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', savePreferences);
    });
};

// Check Price Alerts
const checkPriceAlerts = () => {
    const currentPrice = marketData[currentCrop]?.currentPrice;
    if (!currentPrice) return;
    
    priceAlerts.forEach(alert => {
        if (!alert.active || alert.crop !== currentCrop) return;
        
        let shouldNotify = false;
        
        switch (alert.type) {
            case 'above':
                shouldNotify = currentPrice >= alert.price;
                break;
            case 'below':
                shouldNotify = currentPrice <= alert.price;
                break;
            case 'range':
                shouldNotify = Math.abs(currentPrice - alert.price) <= alert.price * 0.1;
                break;
        }
        
        if (shouldNotify) {
            showToast(`भाव अलर्ट: ${currentCrop} चा भाव ₹${currentPrice.toFixed(2)} आहे!`, 'warning');
            alert.active = false; // Deactivate alert after notification
            localStorage.setItem('priceAlerts', JSON.stringify(priceAlerts));
        }
    });
};

// Periodic alert checking
setInterval(checkPriceAlerts, 60000); // Check every minute

// Service Worker Registration (for offline functionality)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('Service Worker registered');
    }).catch((error) => {
        console.log('Service Worker registration failed:', error);
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page is visible, refresh data
        setTimeout(() => {
            updateChart(currentCrop, currentTimeRange);
        }, 100);
    }
});

// Handle window resize for responsive charts
window.addEventListener('resize', () => {
    if (priceChart) {
        priceChart.resize();
    }
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateSampleData,
        updateChart,
        getTrendDirection,
        showToast,
        showAIAdviceModal,
        hideAIAdviceModal,
        saveAIAdvice,
        applyAIAdvice,
        setPriceAlert,
        exportData,
        shareForecast,
        checkPriceAlerts
    };
}