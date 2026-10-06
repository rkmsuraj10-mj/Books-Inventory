const SUPABASE_URL = 'https://hkvzvvkkojqhrkylbfie.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dBhFFI7qAl_vj0T0uAjp1A_1jZxuGS_';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let activeUserProfile = null;
let booksData = [];
let transactionsData = [];
let computedInventory = [];
let stockDistChart = null;
let monthlyChart = null;
let anSalesChartInstance = null;
let anCategoryChartInstance = null;
let anDemandChartInstance = null;

// AUTHENTICATION CHECK
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = 'login.html'; 
    } else {
        await loadUserProfile(session.user);
    }
});

async function loadUserProfile(authUser) {
    try {
        const { data: profile, error } = await supabaseClient.from('users').select('*, roles(name)').eq('id', authUser.id).single();
        if (error) throw error;
        if (profile.status === 'Inactive') {
            await supabaseClient.auth.signOut();
            throw new Error("Your account has been deactivated.");
        }

        activeUserProfile = profile;
        renderSecureInterface();
        await logAuditAction('Login', 'Authentication', 'User entered dashboard');

        document.getElementById('boot-loader').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        fetchData();

    } catch (err) {
        alert(err.message);
        window.location.href = 'login.html';
    }
}

async function handleLogout() {
    await logAuditAction('Logout', 'Authentication', 'User signed out');
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
}

function renderSecureInterface() {
    const roleName = activeUserProfile.roles.name;
    document.getElementById('ui-user-name').textContent = activeUserProfile.full_name;
    document.getElementById('ui-avatar').textContent = activeUserProfile.full_name.charAt(0).toUpperCase();
    document.getElementById('ui-user-role').textContent = roleName;
    
    const roleBadge = document.getElementById('ui-user-role');
    if (roleName === 'Administrator') roleBadge.className = "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-red-500 mt-1 uppercase shadow-sm tracking-widest";
    if (roleName === 'Staff') roleBadge.className = "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-blue-500 mt-1 uppercase shadow-sm tracking-widest";
    if (roleName === 'Viewer') roleBadge.className = "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-slate-500 mt-1 uppercase shadow-sm tracking-widest";

    if (roleName !== 'Administrator') document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    if (roleName === 'Viewer') {
        document.querySelectorAll('.staff-admin-only').forEach(el => el.style.display = 'none');
        const txList = document.getElementById('container-tx-list');
        if (txList) txList.className = 'bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col lg:col-span-3';
    }
}

// ==========================================
// INVENTORY LOGIC & CALCULATION ENGINE
// ==========================================
async function fetchData() {
    try {
        const [booksRes, txsRes] = await Promise.all([supabaseClient.from('books').select('*'), supabaseClient.from('transactions').select('*')]);
        if (booksRes.error) throw booksRes.error; if (txsRes.error) throw txsRes.error;

        booksData = booksRes.data || []; transactionsData = txsRes.data || [];
        transactionsData.sort((a, b) => {
            const dateA = new Date(a.date).getTime(); const dateB = new Date(b.date).getTime();
            return dateA === dateB ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : dateA - dateB;
        });
        computeInventory();
    } catch (error) { showToast("Error loading data: " + error.message, "error"); }
}

function computeInventory() {
    computedInventory = booksData.map(book => {
        const bookTxs = transactionsData.filter(t => t.bookId == book.id);
        let currentStock = Number(book.openingStock) || 0;
        let totalReceived = 0, totalIssued = 0, totalDamaged = 0, totalReturns = 0, totalComplimentary = 0;
        
        bookTxs.forEach(tx => {
            const qty = Number(tx.quantity);
            switch(tx.type) {
                case 'receipt': currentStock += qty; totalReceived += qty; break;
                case 'issue': currentStock -= qty; totalIssued += qty; break;
                case 'complimentary': currentStock -= qty; totalComplimentary += qty; break;
                case 'return': currentStock += qty; totalReturns += qty; break;
                case 'damaged': currentStock -= qty; totalDamaged += qty; break;
                case 'adjustment': currentStock += qty; break;
            }
        });

        const minStockVal = Number(book.minStock || 5);
        let status = currentStock <= 0 ? 'Out of Stock' : currentStock <= minStockVal ? 'Low Stock' : 'In Stock';
        const lang = book.language ? book.language.toLowerCase() : 'others';

        // Cost and Profit Calculation per Book
        const price = Number(book.price) || 0;
        const costPrice = book.cost_price !== undefined && book.cost_price !== null 
            ? Number(book.cost_price) 
            : (price * 0.80); // Fallback to 80% cost (20% margin) if older record

        return { 
            ...book, 
            language: lang, 
            cost_price: costPrice,
            currentStock, 
            totalReceived, 
            totalIssued, 
            totalComplimentary,
            totalDamaged, 
            totalReturns, 
            status, 
            bookTxs 
        };
    });
    updateUI();
}

window.refreshData = function() { showToast("Fetching latest data...", "info"); fetchData(); }

function updateUI() {
    renderDashboard(); 
    renderBooksTable(); 
    renderTransactionFormDropdown(); 
    renderRecentTransactions();
    renderAnalyticsSuite();
    
    const activeFilter = document.querySelector('.report-filter-btn.bg-slate-800, .report-filter-btn.bg-white.text-slate-800.shadow-sm');
    const langFilterVal = document.getElementById('report-lang-filter') ? document.getElementById('report-lang-filter').value : 'all';
    renderReportsTable(activeFilter ? activeFilter.dataset.filter : 'all', langFilterVal);
}

// --- LANGUAGE FORMATTER HELPER ---
function formatLanguageName(book) {
    const lang = (book.language || 'others').toLowerCase();
    const styles = {
        marathi: 'bg-blue-100/50 text-blue-700 border-blue-200',
        hindi: 'bg-orange-100/50 text-orange-700 border-orange-200',
        'ub-marathi': 'bg-indigo-100/50 text-indigo-700 border-indigo-200',
        'ub-hindi': 'bg-amber-100/50 text-amber-700 border-amber-200',
        kokani: 'bg-purple-100/50 text-purple-700 border-purple-200',
        english: 'bg-emerald-100/50 text-emerald-700 border-emerald-200',
        bangla: 'bg-teal-100/50 text-teal-700 border-teal-200',
    };
    const defaultStyle = 'bg-slate-100 text-slate-700 border-slate-200';
    const style = styles[lang] || defaultStyle;
    
    let label = lang === 'ub-marathi' ? 'UB Marathi' : lang === 'ub-hindi' ? 'UB Hindi' : lang.charAt(0).toUpperCase() + lang.slice(1);
    if (lang === 'others' && book.other_language) label += ` (${book.other_language})`;
    
    return `<span class="px-2.5 py-1 ${style} border rounded-md font-bold text-[10px] uppercase tracking-wider inline-block">${label}</span>`;
}

// --- DASHBOARD ---
function renderDashboard() {
    let totalBooks = 0, totalValue = 0, outOfStockCount = 0;
    let stockCats = { inStock: 0, lowStock: 0, outOfStock: 0 };
    let monthlyData = {};
    
    const langStats = {
        marathi: { titles: 0, stock: 0 },
        hindi: { titles: 0, stock: 0 },
        'ub-marathi': { titles: 0, stock: 0 },
        'ub-hindi': { titles: 0, stock: 0 },
        kokani: { titles: 0, stock: 0 },
        english: { titles: 0, stock: 0 },
        bangla: { titles: 0, stock: 0 },
        others: { titles: 0, stock: 0 }
    };

    computedInventory.forEach(book => {
        totalBooks += book.currentStock; 
        totalValue += (book.currentStock * Number(book.price || 0));
        if(book.status === 'Out of Stock') { outOfStockCount++; stockCats.outOfStock++; }
        else if(book.status === 'Low Stock') { stockCats.lowStock++; } else { stockCats.inStock++; }

        const lKey = langStats[book.language] ? book.language : 'others';
        langStats[lKey].titles += 1;
        langStats[lKey].stock += book.currentStock;
    });

    transactionsData.forEach(tx => {
        if(tx.date) {
            const monthKey = tx.date.substring(0, 7); 
            if(!monthlyData[monthKey]) monthlyData[monthKey] = { rec: 0, iss: 0 };
            if(tx.type === 'receipt') monthlyData[monthKey].rec += Number(tx.quantity);
            if(tx.type === 'issue' || tx.type === 'complimentary') monthlyData[monthKey].iss += Number(tx.quantity);
        }
    });

    document.getElementById('kpi-total-books').textContent = totalBooks; 
    document.getElementById('kpi-total-titles').textContent = computedInventory.length;
    document.getElementById('kpi-out-of-stock').textContent = outOfStockCount; 
    document.getElementById('kpi-inventory-value').textContent = "₹" + totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    
    renderLanguageSummaryCards(langStats);
    renderCharts(stockCats, monthlyData);
}

function renderLanguageSummaryCards(langStats) {
    const container = document.getElementById('language-summary-cards');
    const langConfig = [
        { key: 'marathi', label: 'Marathi', border: 'border-blue-200', bgHover: 'group-hover:bg-blue-50/50', text: 'text-blue-600', fill: 'bg-blue-500' },
        { key: 'hindi', label: 'Hindi', border: 'border-orange-200', bgHover: 'group-hover:bg-orange-50/50', text: 'text-orange-500', fill: 'bg-orange-500' },
        { key: 'ub-marathi', label: 'UB Marathi', border: 'border-indigo-200', bgHover: 'group-hover:bg-indigo-50/50', text: 'text-indigo-600', fill: 'bg-indigo-500' },
        { key: 'ub-hindi', label: 'UB Hindi', border: 'border-amber-200', bgHover: 'group-hover:bg-amber-50/50', text: 'text-amber-600', fill: 'bg-amber-500' },
        { key: 'kokani', label: 'Kokani', border: 'border-purple-200', bgHover: 'group-hover:bg-purple-50/50', text: 'text-purple-600', fill: 'bg-purple-500' },
        { key: 'english', label: 'English', border: 'border-emerald-200', bgHover: 'group-hover:bg-emerald-50/50', text: 'text-emerald-600', fill: 'bg-emerald-500' },
        { key: 'bangla', label: 'Bangla', border: 'border-teal-200', bgHover: 'group-hover:bg-teal-50/50', text: 'text-teal-600', fill: 'bg-teal-500' },
        { key: 'others', label: 'Others', border: 'border-slate-200', bgHover: 'group-hover:bg-slate-50/50', text: 'text-slate-600', fill: 'bg-slate-400' }
    ];

    container.innerHTML = langConfig.map(cfg => {
        const stat = langStats[cfg.key] || { titles: 0, stock: 0 };
        const barWidth = Math.min((stat.stock / 500) * 100, 100);
        
        return `
            <div class="bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
                <div class="absolute inset-0 transition-colors duration-300 ${cfg.bgHover}"></div>
                <div class="relative z-10 flex flex-col h-full justify-between">
                    <div class="flex justify-between items-center mb-3">
                        <p class="text-[11px] font-bold text-slate-500 uppercase tracking-widest group-hover:${cfg.text} transition-colors truncate">${cfg.label}</p>
                    </div>
                    <div class="space-y-1">
                        <div class="flex justify-between items-center text-xs">
                            <span class="font-semibold text-slate-500">Titles</span>
                            <span class="font-extrabold text-slate-800">${stat.titles}</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="font-semibold text-slate-500">Stock</span>
                            <span class="font-extrabold ${cfg.text}">${stat.stock}</span>
                        </div>
                    </div>
                    <div class="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div class="${cfg.fill} h-1.5 rounded-full" style="width: ${barWidth}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderCharts(stockCats, monthlyData) {
    const ctxDist = document.getElementById('stockDistributionChart').getContext('2d');
    if (stockDistChart) stockDistChart.destroy();
    stockDistChart = new Chart(ctxDist, {
        type: 'doughnut', 
        data: { 
            labels: ['In Stock', 'Low Stock', 'Out of Stock'], 
            datasets: [{ 
                data: [stockCats.inStock, stockCats.lowStock, stockCats.outOfStock], 
                backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'], 
                borderWidth: 0,
                hoverOffset: 4
            }] 
        },
        options: { 
            responsive: true, maintainAspectRatio: false, 
            plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: {family: "'Inter', sans-serif", weight: '600', size: 12}, color: '#475569' } } }, 
            cutout: '75%',
            borderRadius: 5
        }
    });

    const ctxMove = document.getElementById('monthlyMovementChart').getContext('2d');
    if (monthlyChart) monthlyChart.destroy();
    const sortedMonths = Object.keys(monthlyData).sort().slice(-6);
    const labels = sortedMonths.map(m => new Date(m + "-01").toLocaleDateString('default', { month: 'short', year: '2-digit' }));
    const recData = sortedMonths.map(m => monthlyData[m].rec); const issData = sortedMonths.map(m => monthlyData[m].iss);

    monthlyChart = new Chart(ctxMove, {
        type: 'bar',
        data: { 
            labels: labels.length ? labels : ['No Data'], 
            datasets: [ 
                { label: 'Received', data: labels.length ? recData : [0], backgroundColor: '#3b82f6', borderRadius: 6, maxBarThickness: 40 }, 
                { label: 'Issued / Out', data: labels.length ? issData : [0], backgroundColor: '#ef4444', borderRadius: 6, maxBarThickness: 40 } 
            ] 
        },
        options: { 
            responsive: true, maintainAspectRatio: false, 
            plugins: { legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8, font: {family: "'Inter', sans-serif", weight: '600'}, color: '#475569' } } }, 
            scales: { 
                y: { beginAtZero: true, grid: { color: '#f1f5f9' }, border: { display: false }, ticks: { color: '#64748b', font: {weight: '500'} } }, 
                x: { grid: { display: false }, border: { display: false }, ticks: { color: '#64748b', font: {weight: '500'} } } 
            } 
        }
    });
}

// =========================================================
// COMPREHENSIVE 16-DIMENSION ANALYTICS SUITE ENGINE
// =========================================================
window.switchAnalyticsTab = function(tabId) {
    document.querySelectorAll('.an-tab-panel').forEach(panel => panel.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');

    document.querySelectorAll('.an-tab-btn').forEach(btn => {
        btn.className = "an-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-white text-slate-600 hover:bg-slate-100 border border-slate-200";
    });
    const activeBtn = document.getElementById('an-btn-' + tabId);
    if (activeBtn) {
        activeBtn.className = "an-tab-btn active px-4 py-2 rounded-xl text-xs font-bold transition-all bg-blue-600 text-white";
    }
};

function renderAnalyticsSuite() {
    let totalTitles = computedInventory.length;
    let totalStock = 0;
    let totalReceived = 0;
    let totalIssued = 0;
    let totalComplimentary = 0;
    let totalDamaged = 0;
    let totalReturns = 0;
    let totalOpening = 0;
    let totalRevenue = 0;
    let totalActualCostInvested = 0;
    let totalProfitRealized = 0;
    let lowStockCount = 0;
    let outStockCount = 0;
    let fastMovingCount = 0;
    let slowMovingCount = 0;

    const categoryBreakdown = {};
    const authorBreakdown = {};
    const centreBreakdown = {};
    const monthlyFinancials = {};

    computedInventory.forEach(book => {
        totalStock += book.currentStock;
        totalOpening += Number(book.openingStock || 0);
        totalReceived += book.totalReceived;
        totalIssued += book.totalIssued;
        totalComplimentary += (book.totalComplimentary || 0);
        totalDamaged += book.totalDamaged;
        totalReturns += book.totalReturns;

        const price = Number(book.price || 0);
        const costPrice = Number(book.cost_price || 0);

        // Revenue is earned only from standard issues/sales (Complimentary is ₹0 revenue)
        const bookRevenue = book.totalIssued * price;
        const bookCostOfSold = book.totalIssued * costPrice;
        const bookProfit = bookRevenue - bookCostOfSold;

        totalRevenue += bookRevenue;
        totalProfitRealized += bookProfit;
        totalActualCostInvested += (book.currentStock * costPrice);

        if (book.status === 'Low Stock') lowStockCount++;
        if (book.status === 'Out of Stock') outStockCount++;

        // Movement Velocity
        const totalInflow = Number(book.openingStock || 0) + book.totalReceived;
        const totalDispatched = book.totalIssued + (book.totalComplimentary || 0);
        const movementRatio = totalInflow > 0 ? (totalDispatched / totalInflow) : 0;
        if (movementRatio >= 0.20 && totalDispatched >= 5) fastMovingCount++;
        if (movementRatio < 0.05 && totalInflow > 0) slowMovingCount++;

        // Category aggregate
        const cat = book.category || 'General';
        if (!categoryBreakdown[cat]) categoryBreakdown[cat] = { titles: 0, stock: 0, issued: 0, revenue: 0 };
        categoryBreakdown[cat].titles += 1;
        categoryBreakdown[cat].stock += book.currentStock;
        categoryBreakdown[cat].issued += book.totalIssued;
        categoryBreakdown[cat].revenue += bookRevenue;

        // Author aggregate
        const author = (book.author && book.author !== '-' && book.author.trim() !== '') ? book.author : 'Editorial Staff';
        if (!authorBreakdown[author]) authorBreakdown[author] = { titles: 0, stock: 0, issued: 0, revenue: 0 };
        authorBreakdown[author].titles += 1;
        authorBreakdown[author].stock += book.currentStock;
        authorBreakdown[author].issued += book.totalIssued;
        authorBreakdown[author].revenue += bookRevenue;
    });

    // Transactions Scan for Centre Distribution and Monthly Series
    transactionsData.forEach(tx => {
        const qty = Number(tx.quantity || 0);
        if (tx.remarks && (tx.type === 'issue' || tx.type === 'complimentary')) {
            const match = tx.remarks.trim();
            const centreKey = match.length > 2 ? match : 'Central Dispatch';
            if (!centreBreakdown[centreKey]) centreBreakdown[centreKey] = { txs: 0, qty: 0, value: 0 };
            centreBreakdown[centreKey].txs += 1;
            centreBreakdown[centreKey].qty += qty;
            const b = computedInventory.find(x => x.id == tx.bookId);
            const pr = tx.type === 'complimentary' ? 0 : (b ? Number(b.price || 0) : 0);
            centreBreakdown[centreKey].value += (qty * pr);
        }

        if (tx.date && tx.type === 'issue') {
            const mKey = tx.date.substring(0, 7);
            if (!monthlyFinancials[mKey]) monthlyFinancials[mKey] = { qty: 0, revenue: 0 };
            const b = computedInventory.find(x => x.id == tx.bookId);
            const pr = b ? Number(b.price || 0) : 0;
            monthlyFinancials[mKey].qty += qty;
            monthlyFinancials[mKey].revenue += (qty * pr);
        }
    });

    // Financial & Stock Turnover Formulas
    const turnoverRate = totalStock > 0 ? (totalIssued / ((totalOpening + totalStock) / 2 || 1)).toFixed(2) : '0.00';
    const returnRate = totalIssued > 0 ? ((totalReturns / totalIssued) * 100).toFixed(1) : 0;
    const netFlow = totalReceived - (totalIssued + totalComplimentary) - totalDamaged;

    // Render KPI Scorecard
    document.getElementById('kpi-an-titles').textContent = totalTitles;
    document.getElementById('kpi-an-stock').textContent = totalStock;
    document.getElementById('kpi-an-received').textContent = totalReceived;
    document.getElementById('kpi-an-issued').textContent = `${totalIssued} ${totalComplimentary > 0 ? '(+' + totalComplimentary + ' comp)' : ''}`;
    document.getElementById('kpi-an-revenue').textContent = "₹" + totalRevenue.toLocaleString('en-IN');
    document.getElementById('kpi-an-margin').textContent = "₹" + totalProfitRealized.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    document.getElementById('kpi-an-low').textContent = lowStockCount;
    document.getElementById('kpi-an-out').textContent = outStockCount;
    document.getElementById('kpi-an-fast').textContent = fastMovingCount;
    document.getElementById('kpi-an-slow').textContent = slowMovingCount;
    document.getElementById('kpi-an-turnover').textContent = `${turnoverRate}x`;
    document.getElementById('kpi-an-returns').textContent = `${returnRate}%`;
    document.getElementById('kpi-an-cost').textContent = "₹" + totalActualCostInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    document.getElementById('kpi-an-damaged').textContent = totalDamaged;
    document.getElementById('kpi-an-netflow').textContent = (netFlow >= 0 ? `+${netFlow}` : `${netFlow}`);

    // Balance Formula Banner (Section 13)
    document.getElementById('eq-opening').textContent = totalOpening;
    document.getElementById('eq-receipts').textContent = totalReceived;
    document.getElementById('eq-returns').textContent = totalReturns;
    document.getElementById('eq-issued').textContent = (totalIssued + totalComplimentary);
    document.getElementById('eq-damaged').textContent = totalDamaged;
    document.getElementById('eq-closing').textContent = totalStock;

    // Render Charts for Analytics Suite
    renderAnalyticsCharts(monthlyFinancials, categoryBreakdown);

    // Render Lists & Tables
    renderBestAndSlowSellers();
    renderStockMovementTable();
    renderPrintingAnalysis();
    renderDemandAnalysis();
    renderDistributionTable(centreBreakdown);
    renderAuthorAndCategoryTables(authorBreakdown, categoryBreakdown);
    populateBookProfileSelector();
}

function renderAnalyticsCharts(monthlyFinancials, categoryBreakdown) {
    const mKeys = Object.keys(monthlyFinancials).sort().slice(-8);
    const mLabels = mKeys.map(k => new Date(k + "-01").toLocaleDateString('default', { month: 'short', year: '2-digit' }));
    const mRev = mKeys.map(k => monthlyFinancials[k].revenue);

    const ctxSales = document.getElementById('anSalesChart').getContext('2d');
    if (anSalesChartInstance) anSalesChartInstance.destroy();
    anSalesChartInstance = new Chart(ctxSales, {
        type: 'line',
        data: {
            labels: mLabels.length ? mLabels : ['No Data'],
            datasets: [{
                label: 'Sales Revenue (₹)',
                data: mRev.length ? mRev : [0],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                borderWidth: 2.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: '#f8fafc' }, ticks: { color: '#64748b' } },
                x: { grid: { display: false }, ticks: { color: '#64748b' } }
            }
        }
    });

    const catLabels = Object.keys(categoryBreakdown);
    const catValues = catLabels.map(k => categoryBreakdown[k].revenue);
    const ctxCat = document.getElementById('anCategoryRevenueChart').getContext('2d');
    if (anCategoryChartInstance) anCategoryChartInstance.destroy();
    anCategoryChartInstance = new Chart(ctxCat, {
        type: 'pie',
        data: {
            labels: catLabels.length ? catLabels : ['General'],
            datasets: [{
                data: catValues.some(v => v > 0) ? catValues : [1],
                backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#14b8a6']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right' } }
        }
    });

    const catDemand = catLabels.map(k => categoryBreakdown[k].issued);
    const ctxDemand = document.getElementById('anDemandChart').getContext('2d');
    if (anDemandChartInstance) anDemandChartInstance.destroy();
    anDemandChartInstance = new Chart(ctxDemand, {
        type: 'bar',
        data: {
            labels: catLabels.length ? catLabels : ['General'],
            datasets: [{
                label: 'Books Issued/Sold',
                data: catDemand.length ? catDemand : [0],
                backgroundColor: '#6366f1',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: '#f8fafc' } },
                x: { grid: { display: false } }
            }
        }
    });
}

function renderBestAndSlowSellers() {
    const sortedBySales = [...computedInventory].sort((a,b) => b.totalIssued - a.totalIssued);
    const top5 = sortedBySales.slice(0, 5);
    const topContainer = document.getElementById('an-top-selling-list');
    topContainer.innerHTML = top5.map((b, i) => `
        <div class="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/60">
            <div class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">${i+1}</span>
                <div>
                    <p class="text-xs font-bold text-slate-800">${b.name}</p>
                    <p class="text-[10px] text-slate-500 font-mono">${b.code} • ₹${Number(b.price).toFixed(2)}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-xs font-extrabold text-emerald-700">${b.totalIssued} sold</p>
                <p class="text-[10px] text-slate-500">₹${(b.totalIssued * Number(b.price)).toLocaleString('en-IN')}</p>
            </div>
        </div>
    `).join('');

    const slowList = [...computedInventory].filter(b => b.totalIssued <= 2 && (Number(b.openingStock) + b.totalReceived) > 10).slice(0, 5);
    const slowContainer = document.getElementById('an-slow-selling-list');
    slowContainer.innerHTML = (slowList.length > 0 ? slowList : sortedBySales.slice(-5)).map(b => `
        <div class="flex items-center justify-between p-3 rounded-2xl bg-orange-50/50 border border-orange-100/60">
            <div>
                <p class="text-xs font-bold text-slate-800">${b.name}</p>
                <p class="text-[10px] text-slate-500 font-mono">${b.code} • Current: ${b.currentStock} in stock</p>
            </div>
            <div class="text-right">
                <span class="px-2 py-0.5 bg-orange-200 text-orange-800 text-[10px] font-bold rounded-md">Low Velocity</span>
                <p class="text-[10px] text-slate-500 mt-1">${b.totalIssued} issued</p>
            </div>
        </div>
    `).join('');
}

function renderStockMovementTable() {
    const tbody = document.getElementById('an-stock-movement-table-body');
    tbody.innerHTML = computedInventory.slice(0, 20).map(b => {
        const totalIn = Number(b.openingStock || 0) + b.totalReceived;
        const totalOut = b.totalIssued + (b.totalComplimentary || 0);
        const rate = totalIn > 0 ? ((totalOut / totalIn) * 100).toFixed(0) : 0;
        const minThresh = Number(b.minStock || 5);
        const condition = b.currentStock > minThresh * 2 ? '<span class="text-emerald-600 font-bold text-xs">Healthy</span>' : b.currentStock > 0 ? '<span class="text-amber-600 font-bold text-xs">Tight</span>' : '<span class="text-red-600 font-bold text-xs">Exhausted</span>';
        return `
            <tr>
                <td class="px-4 py-3"><p class="font-bold text-slate-800 text-xs">${b.name}</p><p class="text-[10px] text-slate-400 font-mono">${b.code} • ${b.category || 'General'}</p></td>
                <td class="px-4 py-3 text-center text-slate-500 font-semibold">${b.openingStock}</td>
                <td class="px-4 py-3 text-center text-emerald-600 font-bold">+${b.totalReceived}</td>
                <td class="px-4 py-3 text-center text-red-500 font-bold">-${totalOut}</td>
                <td class="px-4 py-3 text-center text-amber-500 font-bold">-${b.totalDamaged}</td>
                <td class="px-4 py-3 text-center font-extrabold text-blue-700 bg-blue-50/50">${b.currentStock}</td>
                <td class="px-4 py-3 text-center text-xs font-semibold">${rate}%</td>
                <td class="px-4 py-3 text-center">${condition}</td>
            </tr>
        `;
    }).join('');
}

function renderPrintingAnalysis() {
    const tbody = document.getElementById('an-printing-analysis-table-body');
    tbody.innerHTML = computedInventory.slice(0, 15).map(b => {
        const printed = Number(b.openingStock || 0) + b.totalReceived;
        const ratio = printed > 0 ? ((b.totalIssued / printed) * 100).toFixed(0) : 0;
        const needsReprint = b.currentStock <= Number(b.minStock || 5) && b.totalIssued > 5;
        const badge = needsReprint 
            ? '<span class="px-2.5 py-1 bg-red-100 text-red-700 border border-red-200 rounded-md text-[10px] font-bold">Reprint Urgently</span>' 
            : '<span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold">Adequate Run</span>';
        return `
            <tr>
                <td class="px-4 py-3 font-semibold text-xs text-slate-800">${b.code} - ${b.name} <span class="text-[10px] text-slate-400">(${b.edition || '1st Run'})</span></td>
                <td class="px-4 py-3 text-center font-bold text-slate-600">${printed}</td>
                <td class="px-4 py-3 text-center font-bold text-blue-600">${b.totalIssued}</td>
                <td class="px-4 py-3 text-center font-bold">${ratio}%</td>
                <td class="px-4 py-3 text-center font-extrabold text-slate-800">${b.currentStock}</td>
                <td class="px-4 py-3 text-center">${badge}</td>
            </tr>
        `;
    }).join('');
}

function renderDemandAnalysis() {
    const list = document.getElementById('an-unmet-demand-list');
    const unmet = computedInventory.filter(b => b.currentStock === 0 && b.totalIssued > 0);
    if (unmet.length === 0) {
        list.innerHTML = `<p class="text-xs text-slate-400 py-4 text-center">No unfulfilled demand alerts recorded.</p>`;
        return;
    }
    list.innerHTML = unmet.slice(0, 6).map(b => `
        <div class="p-3 bg-red-50/70 border border-red-100 rounded-2xl flex justify-between items-center">
            <div>
                <p class="text-xs font-bold text-slate-800">${b.name}</p>
                <p class="text-[10px] text-red-600 font-semibold font-mono">${b.code} • 0 Available</p>
            </div>
            <span class="text-xs font-black text-red-600">${b.totalIssued} past buyers</span>
        </div>
    `).join('');
}

function renderDistributionTable(centreBreakdown) {
    const tbody = document.getElementById('an-distribution-table-body');
    const keys = Object.keys(centreBreakdown);
    if (keys.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-6 text-slate-400 text-xs">No distribution centres designated in remarks yet. Enter destination in transaction remarks.</td></tr>`;
        return;
    }
    tbody.innerHTML = keys.map(k => `
        <tr>
            <td class="px-4 py-3 font-bold text-slate-800 text-xs"><i class="fa-solid fa-location-dot text-indigo-500 mr-2"></i> ${k}</td>
            <td class="px-4 py-3 text-center text-slate-600 text-xs">${centreBreakdown[k].txs} shipments</td>
            <td class="px-4 py-3 text-right font-extrabold text-slate-800">${centreBreakdown[k].qty} books</td>
            <td class="px-4 py-3 text-right font-bold text-emerald-600">₹${centreBreakdown[k].value.toLocaleString('en-IN')}</td>
        </tr>
    `).join('');
}

function renderAuthorAndCategoryTables(authorBreakdown, categoryBreakdown) {
    const authBody = document.getElementById('an-author-table-body');
    authBody.innerHTML = Object.keys(authorBreakdown).map(a => `
        <tr>
            <td class="px-4 py-3 font-bold text-xs text-slate-800">${a}</td>
            <td class="px-4 py-3 text-center text-xs">${authorBreakdown[a].titles}</td>
            <td class="px-4 py-3 text-center text-xs font-semibold">${authorBreakdown[a].stock}</td>
            <td class="px-4 py-3 text-right text-xs font-extrabold text-emerald-600">₹${authorBreakdown[a].revenue.toLocaleString('en-IN')}</td>
        </tr>
    `).join('');

    const catBody = document.getElementById('an-category-table-body');
    catBody.innerHTML = Object.keys(categoryBreakdown).map(c => `
        <tr>
            <td class="px-4 py-3 font-bold text-xs text-slate-800">${c}</td>
            <td class="px-4 py-3 text-center text-xs">${categoryBreakdown[c].titles}</td>
            <td class="px-4 py-3 text-center text-xs font-semibold">${categoryBreakdown[c].stock}</td>
            <td class="px-4 py-3 text-right text-xs font-extrabold text-blue-600">${categoryBreakdown[c].issued}</td>
        </tr>
    `).join('');
}

function populateBookProfileSelector() {
    const select = document.getElementById('an-profile-book-select');
    if (!select) return;
    select.innerHTML = '<option value="">-- Choose Book for 360° Profile --</option>';
    computedInventory.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.id;
        opt.textContent = `${b.code} - ${b.name}`;
        select.appendChild(opt);
    });
    if (computedInventory.length > 0 && !select.value) {
        select.value = computedInventory[0].id;
        renderIndividualBookProfile(computedInventory[0].id);
    }
}

window.renderIndividualBookProfile = function(bookId) {
    const book = computedInventory.find(b => b.id == bookId);
    const container = document.getElementById('an-book-profile-display');
    if (!book) {
        container.innerHTML = `<p class="text-sm text-slate-500 py-6 text-center">Select a book to inspect lifecycle.</p>`;
        return;
    }

    const price = Number(book.price || 0);
    const costPrice = Number(book.cost_price || 0);
    const marginPct = price > 0 ? (((price - costPrice) / price) * 100).toFixed(1) : 0;
    const revenue = book.totalIssued * price;
    const costOfSold = book.totalIssued * costPrice;
    const realizedProfit = revenue - costOfSold;

    container.innerHTML = `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div><span class="text-[10px] font-bold text-slate-400 uppercase">Title & Edition</span><h5 class="text-sm font-extrabold text-slate-800 mt-0.5">${book.code} - ${book.name} <span class="text-xs font-normal text-slate-500">(${book.edition || '1st Run'})</span></h5></div>
            <div><span class="text-[10px] font-bold text-slate-400 uppercase">Author & Category</span><h5 class="text-sm font-bold text-slate-700 mt-0.5">${book.author || 'Editorial'} / <span class="text-blue-600">${book.category || 'General'}</span></h5></div>
            <div><span class="text-[10px] font-bold text-slate-400 uppercase">Retail / Print Cost</span><h5 class="text-sm font-extrabold text-emerald-600 mt-0.5">₹${price.toFixed(2)} <span class="text-xs text-slate-500 font-semibold">(Cost: ₹${costPrice.toFixed(2)}, ${marginPct}%)</span></h5></div>
            <div><span class="text-[10px] font-bold text-slate-400 uppercase">Stock & Status</span><h5 class="text-sm font-extrabold mt-0.5 ${book.status === 'In Stock' ? 'text-emerald-600' : 'text-red-500'}">${book.currentStock} in stock (${book.status})</h5></div>
        </div>

        <div class="p-5 bg-white border border-slate-100 shadow-sm rounded-2xl">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Section 7 Lifecycle Tracking Equation</p>
            <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-center text-xs">
                <div class="p-3 bg-slate-50 rounded-xl"><p class="text-slate-400 font-bold">Opening</p><p class="text-base font-extrabold text-slate-800 mt-1">${book.openingStock}</p></div>
                <div class="p-3 bg-emerald-50 rounded-xl"><p class="text-emerald-600 font-bold">+ Receipts</p><p class="text-base font-extrabold text-emerald-700 mt-1">${book.totalReceived}</p></div>
                <div class="p-3 bg-red-50 rounded-xl"><p class="text-red-600 font-bold">- Issued/Sold</p><p class="text-base font-extrabold text-red-700 mt-1">${book.totalIssued}</p></div>
                <div class="p-3 bg-purple-50 rounded-xl"><p class="text-purple-600 font-bold">- Complimentary</p><p class="text-base font-extrabold text-purple-700 mt-1">${book.totalComplimentary || 0}</p></div>
                <div class="p-3 bg-blue-50 rounded-xl"><p class="text-blue-600 font-bold">+ Returns</p><p class="text-base font-extrabold text-blue-700 mt-1">${book.totalReturns}</p></div>
                <div class="p-3 bg-amber-50 rounded-xl"><p class="text-amber-600 font-bold">- Damaged</p><p class="text-base font-extrabold text-amber-700 mt-1">${book.totalDamaged}</p></div>
                <div class="p-3 bg-indigo-50 rounded-xl"><p class="text-indigo-600 font-bold">= Closing</p><p class="text-base font-extrabold text-indigo-700 mt-1">${book.currentStock}</p></div>
                <div class="p-3 bg-emerald-100 rounded-xl"><p class="text-emerald-800 font-bold">Realized Profit</p><p class="text-base font-black text-emerald-800 mt-1">₹${realizedProfit.toLocaleString('en-IN')}</p></div>
            </div>
        </div>
    `;
};

// --- BOOK MASTER & FILTERS ---
function renderBooksTable() {
    const tbody = document.getElementById('books-table-body');
    const searchQ = document.getElementById('book-search').value.toLowerCase();
    const langFilter = document.getElementById('book-lang-filter').value;
    tbody.innerHTML = '';
    
    const filtered = computedInventory.filter(book => {
        const matchesSearch = book.name.toLowerCase().includes(searchQ) || book.code.toLowerCase().includes(searchQ) || (book.author && book.author.toLowerCase().includes(searchQ));
        const matchesLang = langFilter === 'all' || book.language === langFilter;
        return matchesSearch && matchesLang;
    });

    filtered.forEach(book => {
        let statusBadge = book.status === 'In Stock' 
            ? '<span class="px-2.5 py-1 bg-green-100/60 border border-green-200 text-green-700 rounded-lg text-[10px] uppercase font-bold tracking-widest">In Stock</span>' 
            : book.status === 'Low Stock' 
            ? '<span class="px-2.5 py-1 bg-yellow-100/60 border border-yellow-200 text-yellow-700 rounded-lg text-[10px] uppercase font-bold tracking-widest">Low Stock</span>' 
            : '<span class="px-2.5 py-1 bg-red-100/60 border border-red-200 text-red-700 rounded-lg text-[10px] uppercase font-bold tracking-widest">Out of Stock</span>';
        
        let editBtnHtml = activeUserProfile && activeUserProfile.roles.name === 'Administrator' 
            ? `<button onclick="editBook('${book.id}')" class="text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-bold transition-all"><i class="fa-solid fa-pen mr-1"></i> Edit</button>` 
            : '';

        tbody.innerHTML += `
            <tr>
                <td class="px-6 py-4 font-mono text-xs font-bold text-slate-400">${book.code}</td>
                <td class="px-6 py-4">
                    <p class="font-bold text-slate-800">${book.name}</p>
                    <p class="text-[11px] text-slate-400 font-medium">${book.author || 'Editorial'} • <span class="text-blue-500">${book.category || 'General'}</span></p>
                </td>
                <td class="px-6 py-4">${formatLanguageName(book)}</td>
                <td class="px-6 py-4 text-right font-medium text-slate-600">
                    <div>₹${Number(book.price).toFixed(2)}</div>
                    <div class="text-[10px] text-slate-400">Cost: ₹${Number(book.cost_price).toFixed(2)}</div>
                </td>
                <td class="px-6 py-4 text-center text-slate-400 font-medium">${book.openingStock}</td>
                <td class="px-6 py-4 text-center font-extrabold text-slate-800 text-base">${book.currentStock}</td>
                <td class="px-6 py-4 text-center">${statusBadge}</td>
                <td class="px-6 py-4 text-right space-x-2">
                    ${editBtnHtml}
                    <button onclick="viewHistory('${book.id}')" class="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-bold transition-all"><i class="fa-solid fa-clock-rotate-left mr-1"></i> History</button>
                </td>
            </tr>
        `;
    });
    if(tbody.innerHTML === '') tbody.innerHTML = `<tr><td colspan="8" class="text-center py-12 text-slate-500 font-medium">No books found matching criteria.</td></tr>`;
}

document.getElementById('book-search').addEventListener('input', renderBooksTable);
document.getElementById('book-lang-filter').addEventListener('change', renderBooksTable);

window.resetBookFilters = function() {
    document.getElementById('book-search').value = '';
    document.getElementById('book-lang-filter').value = 'all';
    renderBooksTable();
}

// --- DYNAMIC PROFIT MARGIN & PRINTING COST CALCULATOR ---
function calculatePrintingCostFromMargin() {
    const price = parseFloat(document.getElementById('bk-price').value) || 0;
    const margin = parseFloat(document.getElementById('bk-profit-margin').value) || 0;
    if (price > 0) {
        const cost = price * (1 - (margin / 100));
        document.getElementById('bk-cost-price').value = Math.max(0, cost).toFixed(2);
    }
}

function calculateMarginFromPrintingCost() {
    const price = parseFloat(document.getElementById('bk-price').value) || 0;
    const cost = parseFloat(document.getElementById('bk-cost-price').value) || 0;
    if (price > 0) {
        const margin = ((price - cost) / price) * 100;
        document.getElementById('bk-profit-margin').value = margin.toFixed(1);
    }
}

document.getElementById('bk-price').addEventListener('input', calculatePrintingCostFromMargin);
document.getElementById('bk-profit-margin').addEventListener('input', calculatePrintingCostFromMargin);
document.getElementById('bk-cost-price').addEventListener('input', calculateMarginFromPrintingCost);

// Language toggle
document.getElementById('bk-language').addEventListener('change', function() {
    const otherContainer = document.getElementById('other-language-container');
    const otherInput = document.getElementById('bk-other-language');
    if (this.value === 'others') {
        otherContainer.classList.remove('hidden');
        otherInput.required = true;
    } else {
        otherContainer.classList.add('hidden');
        otherInput.required = false;
        otherInput.value = '';
    }
});

window.openAddBookModal = function() {
    document.getElementById('add-book-form').reset();
    document.getElementById('edit-bk-id').value = '';
    document.getElementById('modal-book-title').innerHTML = '<i class="fa-solid fa-book text-blue-500"></i> Add New Book Catalogue';
    document.getElementById('other-language-container').classList.add('hidden');
    document.getElementById('bk-profit-margin').value = "20";
    openModal('add-book-modal');
}

window.editBook = function(id) {
    if (activeUserProfile.roles.name !== 'Administrator') return showToast("Permission Denied.", "error");
    const book = computedInventory.find(b => b.id == id);
    if (!book) return;

    document.getElementById('edit-bk-id').value = book.id;
    document.getElementById('modal-book-title').innerHTML = '<i class="fa-solid fa-pen text-blue-500"></i> Edit Book Details';

    document.getElementById('bk-code').value = book.code || '';
    document.getElementById('bk-edition').value = book.edition || '';
    document.getElementById('bk-name').value = book.name || '';
    document.getElementById('bk-author').value = book.author || '';
    document.getElementById('bk-category').value = book.category || 'General';

    const langSelect = document.getElementById('bk-language');
    const standardLangs = ['marathi', 'hindi', 'ub-marathi', 'ub-hindi', 'kokani', 'english', 'bangla'];
    if (standardLangs.includes(book.language)) {
        langSelect.value = book.language;
        document.getElementById('other-language-container').classList.add('hidden');
    } else {
        langSelect.value = 'others';
        document.getElementById('other-language-container').classList.remove('hidden');
        document.getElementById('bk-other-language').value = book.other_language || book.language;
    }

    document.getElementById('bk-price').value = book.price || '';
    document.getElementById('bk-cost-price').value = book.cost_price || '';
    document.getElementById('bk-opening').value = book.openingStock || 0;
    document.getElementById('bk-minstock').value = book.minStock || 5;

    // Trigger margin calculation
    calculateMarginFromPrintingCost();

    openModal('add-book-modal');
}

window.submitBookForm = async function() {
    if (activeUserProfile.roles.name !== 'Administrator') return showToast("Permission Denied.", "error");
    
    const editId = document.getElementById('edit-bk-id').value;
    const code = document.getElementById('bk-code').value.trim(); 
    const name = document.getElementById('bk-name').value.trim();
    const edition = document.getElementById('bk-edition').value.trim() || '1st Edition';
    const author = document.getElementById('bk-author').value.trim() || 'Editorial Staff';
    const category = document.getElementById('bk-category').value;
    const language = document.getElementById('bk-language').value;
    const otherLanguage = document.getElementById('bk-other-language').value.trim();
    const price = parseFloat(document.getElementById('bk-price').value); 
    const costPrice = parseFloat(document.getElementById('bk-cost-price').value) || (price * 0.80);
    const opening = document.getElementById('bk-opening').value;
    const minStock = parseInt(document.getElementById('bk-minstock').value) || 5;

    if(!code || !name || !language || isNaN(price) || !opening) return showToast("Please fill all required fields.", "error");
    if(language === 'others' && !otherLanguage) return showToast("Please specify the other language name.", "error");
    
    if (!editId && booksData.some(b => b.code.toLowerCase() === code.toLowerCase())) return showToast("Book code already exists.", "error");
    if (editId && booksData.some(b => b.code.toLowerCase() === code.toLowerCase() && b.id != editId)) return showToast("Book code already exists for another book.", "error");

    const bookData = { 
        code, 
        name, 
        language,
        other_language: language === 'others' ? otherLanguage : null,
        author,
        category,
        edition,
        price: Number(price),
        cost_price: Number(costPrice),
        openingStock: Number(opening), 
        minStock: Number(minStock)
    };

    try {
        if (editId) {
            const { error } = await supabaseClient.from('books').update(bookData).eq('id', editId);
            if (error) throw error;
            await logAuditAction('Edit Book', 'Inventory', `Updated book details: ${code} - ${name}`);
            showToast("Book updated successfully!", "success");
        } else {
            bookData.publisher = 'Publication Dept';
            bookData.createdAt = new Date().toISOString();
            const { error } = await supabaseClient.from('books').insert([bookData]);
            if (error) throw error;
            await logAuditAction('Add Book', 'Inventory', `Added new book: ${code} - ${name} (${category})`);
            showToast("Book added successfully!", "success");
        }
        
        closeModal('add-book-modal'); 
        document.getElementById('add-book-form').reset(); 
        document.getElementById('bk-profit-margin').value = "20";
        document.getElementById('other-language-container').classList.add('hidden');
        document.getElementById('edit-bk-id').value = "";
        fetchData(); 
    } catch(e) { showToast("Failed to save book: " + e.message, "error"); }
}

// --- TRANSACTIONS ---
function renderTransactionFormDropdown() {
    const datalist = document.getElementById('tx-books-list'); 
    const searchInput = document.getElementById('tx-book-input');
    const hiddenInput = document.getElementById('tx-book');
    const currentVal = hiddenInput.value;
    
    datalist.innerHTML = '';
    [...computedInventory].sort((a,b) => a.name.localeCompare(b.name)).forEach(b => {
        const opt = document.createElement('option'); 
        opt.value = `${b.code} - ${b.name} (${b.language.toUpperCase()}, Stock: ${b.currentStock})`;
        opt.dataset.id = b.id;
        datalist.appendChild(opt);
    });
    
    if(currentVal) {
        const book = computedInventory.find(b=>b.id == currentVal);
        if(book) searchInput.value = `${book.code} - ${book.name} (${book.language.toUpperCase()}, Stock: ${book.currentStock})`;
    }
}

document.getElementById('tx-book-input').addEventListener('input', function(e) {
    const val = this.value;
    const options = document.getElementById('tx-books-list').options;
    const hiddenInput = document.getElementById('tx-book');
    const hint = document.getElementById('tx-current-stock-hint');
    
    hiddenInput.value = ''; 
    hint.classList.add('hidden');

    for(let i = 0; i < options.length; i++) {
        if(options[i].value === val) {
            const bookId = options[i].dataset.id;
            hiddenInput.value = bookId;
            const book = computedInventory.find(b => b.id == bookId);
            if(book) {
                document.getElementById('tx-hint-val').textContent = book.currentStock;
                document.getElementById('tx-hint-val').className = book.currentStock > 0 ? "font-extrabold text-emerald-600 ml-1" : "font-extrabold text-red-600 ml-1";
                hint.classList.remove('hidden');
            }
            break;
        }
    }
});

document.getElementById('tx-date').valueAsDate = new Date();

document.getElementById('transaction-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (activeUserProfile.roles.name === 'Viewer') return showToast("Permission Denied.", "error");

    const editTxId = document.getElementById('edit-tx-id').value;
    const type = document.getElementById('tx-type').value; 
    const bookId = document.getElementById('tx-book').value;
    const date = document.getElementById('tx-date').value; 
    let qty = Number(document.getElementById('tx-quantity').value);
    const remarks = document.getElementById('tx-remarks').value;

    if(!bookId || !date || !qty) return showToast("Please fill all required fields or select a valid book.", "error");
    const book = computedInventory.find(b => b.id == bookId); if(!book) return;

    // Accurate stock validation (accounts for edit revisions)
    let effectiveStock = book.currentStock;
    if (editTxId) {
        const originalTx = transactionsData.find(t => t.id == editTxId);
        if (originalTx && originalTx.bookId == bookId) {
            if (['issue', 'complimentary', 'damaged'].includes(originalTx.type)) effectiveStock += Number(originalTx.quantity);
            else if (['receipt', 'return'].includes(originalTx.type)) effectiveStock -= Number(originalTx.quantity);
        }
    }

    if ((type === 'issue' || type === 'complimentary' || type === 'damaged') && qty > effectiveStock) {
        return showToast(`Insufficient Stock! Maximum available stock is ${effectiveStock}`, "error");
    }

    const txData = { bookId, bookCode: book.code, bookName: book.name, type, date, quantity: qty, remarks };
    const btn = document.getElementById('tx-submit-btn'); 
    const originalBtnText = btn.textContent;
    btn.disabled = true; 
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try {
        if (editTxId) {
            const { error } = await supabaseClient.from('transactions').update(txData).eq('id', editTxId);
            if (error) throw error;
            await logAuditAction('Edit TX', 'Inventory', `Updated transaction ${editTxId} for ${book.code}`);
            showToast("Transaction updated successfully!", "success");
        } else {
            txData.createdAt = new Date().toISOString();
            const { error } = await supabaseClient.from('transactions').insert([txData]);
            if (error) throw error;
            await logAuditAction('Transaction', 'Inventory', `Recorded ${type} of ${qty} for ${book.code}`);
            showToast("Transaction saved successfully!", "success");
        }
        
        cancelEditTransaction();
        fetchData(); 
    } catch(error) { 
        showToast("Transaction failed: " + error.message, "error"); 
        btn.disabled = false; 
        btn.textContent = originalBtnText;
    }
});

window.editTransaction = function(txId) {
    if (activeUserProfile.roles.name !== 'Administrator') return showToast("Permission Denied.", "error");
    const tx = transactionsData.find(t => t.id == txId);
    if (!tx) return;
    
    document.getElementById('edit-tx-id').value = tx.id;
    document.getElementById('tx-form-title').innerHTML = '<i class="fa-solid fa-pen-to-square text-amber-500"></i> Edit Entry';
    document.getElementById('tx-cancel-edit-btn').classList.remove('hidden');
    
    document.getElementById('tx-type').value = tx.type;
    
    const bookInput = document.getElementById('tx-book-input');
    const hiddenBookInput = document.getElementById('tx-book');
    hiddenBookInput.value = tx.bookId;
    
    const book = computedInventory.find(b => b.id == tx.bookId);
    if(book) {
        bookInput.value = `${book.code} - ${book.name} (${book.language.toUpperCase()}, Stock: ${book.currentStock})`;
        document.getElementById('tx-hint-val').textContent = book.currentStock;
        document.getElementById('tx-hint-val').className = book.currentStock > 0 ? "font-extrabold text-emerald-600 ml-1" : "font-extrabold text-red-600 ml-1";
        document.getElementById('tx-current-stock-hint').classList.remove('hidden');
    } else {
        bookInput.value = `${tx.bookCode} - ${tx.bookName}`; 
    }
    
    document.getElementById('tx-date').value = tx.date;
    document.getElementById('tx-quantity').value = tx.quantity;
    document.getElementById('tx-remarks').value = tx.remarks || '';
    
    document.getElementById('tx-submit-btn').textContent = 'Update Transaction';
    document.getElementById('container-tx-form').scrollIntoView({ behavior: 'smooth' });
}

window.cancelEditTransaction = function() {
    document.getElementById('transaction-form').reset();
    document.getElementById('edit-tx-id').value = '';
    document.getElementById('tx-book').value = '';
    document.getElementById('tx-current-stock-hint').classList.add('hidden');
    document.getElementById('tx-date').valueAsDate = new Date();
    
    document.getElementById('tx-form-title').innerHTML = '<i class="fa-solid fa-pen-to-square text-blue-500"></i> New Entry';
    document.getElementById('tx-cancel-edit-btn').classList.add('hidden');
    
    const submitBtn = document.getElementById('tx-submit-btn');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Transaction';
}

window.deleteTransaction = async function(txId) {
    if (activeUserProfile.roles.name !== 'Administrator') return showToast("Permission Denied.", "error");
    if(!confirm("Are you sure you want to permanently delete this transaction?")) return;

    try {
        const { error } = await supabaseClient.from('transactions').delete().eq('id', txId);
        if (error) throw error;
        await logAuditAction('Delete TX', 'Inventory', `Deleted transaction record ${txId}`);
        showToast("Transaction deleted.", "success"); fetchData(); 
    } catch(error) { showToast("Failed to delete: " + error.message, "error"); }
}

// --- SEARCH INTEGRATION ---
document.getElementById('tx-search')?.addEventListener('input', renderRecentTransactions);

function renderRecentTransactions() {
    const tbody = document.getElementById('recent-tx-body'); tbody.innerHTML = '';
    const searchQ = (document.getElementById('tx-search')?.value || '').toLowerCase();
    
    let filteredTxs = transactionsData;
    if (searchQ) {
        filteredTxs = transactionsData.filter(tx => 
            (tx.bookName && tx.bookName.toLowerCase().includes(searchQ)) || 
            (tx.bookCode && tx.bookCode.toLowerCase().includes(searchQ))
        );
    }
    
    const displayLimit = searchQ ? 50 : 15;
    const recent = [...filteredTxs].reverse().slice(0, displayLimit);
    
    recent.forEach(tx => {
        let icon = ''; let color = ''; let sign = '';
        switch(tx.type) {
            case 'receipt': icon = 'fa-arrow-down'; color = 'text-emerald-600 bg-emerald-100/50 border border-emerald-200'; sign = '+'; break;
            case 'issue': icon = 'fa-arrow-up'; color = 'text-red-600 bg-red-100/50 border border-red-200'; sign = '-'; break;
            case 'complimentary': icon = 'fa-gift'; color = 'text-purple-600 bg-purple-100/50 border border-purple-200'; sign = '-'; break;
            case 'return': icon = 'fa-arrow-rotate-left'; color = 'text-blue-600 bg-blue-100/50 border border-blue-200'; sign = '+'; break;
            case 'damaged': icon = 'fa-ban'; color = 'text-orange-600 bg-orange-100/50 border border-orange-200'; sign = '-'; break;
            case 'adjustment': icon = 'fa-sliders'; color = 'text-slate-600 bg-slate-100/80 border border-slate-200'; sign = '±'; break;
        }

        let actionsHtml = activeUserProfile.roles.name === 'Administrator' 
            ? `<td class="px-4 py-3 text-center admin-only">
                <button onclick="editTransaction('${tx.id}')" class="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors mr-1" title="Edit Transaction"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteTransaction('${tx.id}')" class="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete Transaction"><i class="fa-solid fa-trash"></i></button>
               </td>` 
            : '';

        tbody.innerHTML += `
            <tr>
                <td class="px-5 py-4 text-slate-500 font-medium text-xs">${new Date(tx.date).toLocaleDateString('en-GB')}</td>
                <td class="px-4 py-4"><span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${color}"><i class="fa-solid ${icon}"></i> ${tx.type}</span></td>
                <td class="px-4 py-4"><p class="font-bold text-slate-800 text-sm truncate max-w-[160px]">${tx.bookName}</p><p class="text-[10px] font-bold text-slate-400 font-mono mt-0.5">${tx.bookCode}</p></td>
                <td class="px-4 py-4 text-right font-black text-slate-700 text-base">${sign}${tx.quantity}</td>
                <td class="px-4 py-4 text-xs text-slate-500 font-medium truncate max-w-[150px]">${tx.remarks || '-'}</td>
                ${actionsHtml}
            </tr>
        `;
    });
    if(recent.length === 0) tbody.innerHTML = `<tr><td colspan="${activeUserProfile.roles.name === 'Administrator' ? 6 : 5}" class="text-center py-10 text-slate-500 font-medium text-sm">No transactions found.</td></tr>`;
}

// --- REPORTS & HISTORY ---
document.querySelectorAll('.report-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.report-filter-btn').forEach(b => { 
            b.classList.remove('bg-white', 'text-slate-800', 'shadow-sm'); 
            b.classList.add('text-slate-500'); 
        });
        this.classList.remove('text-slate-500'); 
        this.classList.add('bg-white', 'text-slate-800', 'shadow-sm'); 
        const langFilterVal = document.getElementById('report-lang-filter').value;
        renderReportsTable(this.dataset.filter, langFilterVal);
    });
});

document.getElementById('report-lang-filter').addEventListener('change', function() {
    const activeFilterBtn = document.querySelector('.report-filter-btn.bg-white.text-slate-800');
    renderReportsTable(activeFilterBtn ? activeFilterBtn.dataset.filter : 'all', this.value);
});

document.getElementById('report-search')?.addEventListener('input', function() {
    const activeFilterBtn = document.querySelector('.report-filter-btn.bg-white.text-slate-800');
    const langFilterVal = document.getElementById('report-lang-filter') ? document.getElementById('report-lang-filter').value : 'all';
    renderReportsTable(activeFilterBtn ? activeFilterBtn.dataset.filter : 'all', langFilterVal);
});

function renderReportsTable(filterType = 'all', langFilter = 'all') {
    const tbody = document.getElementById('reports-table-body'); tbody.innerHTML = '';
    const searchQ = (document.getElementById('report-search')?.value || '').toLowerCase();
    
    let filtered = computedInventory;
    
    if(filterType === 'low') filtered = computedInventory.filter(b => b.status === 'Low Stock'); 
    if(filterType === 'out') filtered = computedInventory.filter(b => b.status === 'Out of Stock');
    if(langFilter !== 'all') filtered = filtered.filter(b => b.language === langFilter);
    
    if(searchQ) {
        filtered = filtered.filter(b => 
            (b.name && b.name.toLowerCase().includes(searchQ)) || 
            (b.code && b.code.toLowerCase().includes(searchQ))
        );
    }

    filtered.forEach(book => {
        const totalOut = book.totalIssued + (book.totalComplimentary || 0);
        tbody.innerHTML += `
            <tr>
                <td class="px-6 py-4"><p class="font-bold text-slate-800">${book.code}</p><p class="text-xs font-medium text-slate-500 truncate max-w-[220px] mt-0.5">${book.name}</p></td>
                <td class="px-4 py-4">${formatLanguageName(book)}</td>
                <td class="px-4 py-4 text-center text-slate-500 font-bold">${book.openingStock}</td>
                <td class="px-4 py-4 text-center text-emerald-600 font-bold">${book.totalReceived}</td>
                <td class="px-4 py-4 text-center text-red-500 font-bold">${totalOut}</td>
                <td class="px-4 py-4 text-center text-orange-500 font-bold">${book.totalDamaged}</td>
                <td class="px-6 py-4 text-center text-lg font-black text-slate-800 bg-slate-50/50 border-l border-slate-100">${book.currentStock}</td>
            </tr>
        `;
    });
    if(filtered.length === 0) tbody.innerHTML = `<tr><td colspan="7" class="text-center py-16 text-slate-500 font-medium">No data available for selected filters.</td></tr>`;
}

window.viewHistory = function(bookId) {
    const book = computedInventory.find(b => b.id == bookId); if(!book) return;
    document.getElementById('hist-title').innerHTML = `<i class="fa-solid fa-clock-rotate-left text-indigo-500 mr-2"></i> ${book.code} - ${book.name}`;
    
    let formulaStr = `<span class="text-slate-500">Opening:</span> <span class="font-bold">${book.openingStock}</span>`;
    if(book.totalReceived > 0) formulaStr += ` <span class="text-emerald-500 mx-1">+</span> Rec: <span class="font-bold">${book.totalReceived}</span>`; 
    if(book.totalIssued > 0) formulaStr += ` <span class="text-red-500 mx-1">-</span> Iss: <span class="font-bold">${book.totalIssued}</span>`;
    if(book.totalComplimentary > 0) formulaStr += ` <span class="text-purple-500 mx-1">-</span> Comp: <span class="font-bold">${book.totalComplimentary}</span>`;
    if(book.totalDamaged > 0) formulaStr += ` <span class="text-orange-500 mx-1">-</span> Dmg: <span class="font-bold">${book.totalDamaged}</span>`;
    
    document.getElementById('hist-formula').innerHTML = formulaStr;
    document.getElementById('hist-balance').textContent = book.currentStock; 
    document.getElementById('hist-balance').className = book.currentStock > 0 ? "text-3xl font-black text-blue-700 tracking-tight" : "text-3xl font-black text-red-600 tracking-tight";

    const tbody = document.getElementById('hist-table-body'); tbody.innerHTML = '';
    let runningBalance = Number(book.openingStock);
    tbody.innerHTML += `<tr class="bg-slate-50/50"><td class="px-5 py-4 text-xs font-medium text-slate-400">-</td><td class="px-4 py-4 font-bold text-slate-700">Opening Stock</td><td class="px-4 py-4 text-right font-medium text-slate-500">${book.openingStock}</td><td class="px-4 py-4 text-right font-black text-slate-800">${runningBalance}</td><td class="px-4 py-4 text-xs font-medium text-slate-400">Initial Setup</td></tr>`;

    [...book.bookTxs].sort((a,b) => { const dA = new Date(a.date).getTime(); const dB = new Date(b.date).getTime(); return dA === dB ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : dA - dB; }).forEach(tx => {
        let qty = Number(tx.quantity); let displayQty = ''; let colorClass = '';
        if (['receipt', 'return'].includes(tx.type)) { runningBalance += qty; displayQty = `+${qty}`; colorClass = 'text-emerald-600'; } 
        else if (['issue', 'complimentary', 'damaged'].includes(tx.type)) { runningBalance -= qty; displayQty = `-${qty}`; colorClass = 'text-red-500'; } 
        else if (tx.type === 'adjustment') { runningBalance += qty; displayQty = `±${qty}`; colorClass = 'text-slate-600'; }

        tbody.innerHTML += `<tr><td class="px-5 py-4 text-xs font-medium text-slate-500 whitespace-nowrap">${new Date(tx.date).toLocaleDateString('en-GB')}</td><td class="px-4 py-4 text-sm font-bold capitalize text-slate-800">${tx.type}</td><td class="px-4 py-4 text-right font-black ${colorClass}">${displayQty}</td><td class="px-4 py-4 text-right font-black text-slate-800">${runningBalance}</td><td class="px-4 py-4 text-xs font-medium text-slate-500">${tx.remarks || '-'}</td></tr>`;
    });
    openModal('history-modal');
}

// ==========================================
// ADMIN & UI UTILITIES
// ==========================================
async function loadAdminUsersTable() {
    const { data: users, error } = await supabaseClient.from('users').select('*, roles(name)').order('created_at', { ascending: false });
    if (error) return showToast(error.message, 'error');

    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = users.map(u => `
        <tr>
            <td class="px-6 py-4 font-bold text-slate-800">${u.full_name}</td>
            <td class="px-6 py-4 font-medium text-slate-500">${u.email}</td>
            <td class="px-6 py-4"><span class="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest">${u.roles.name}</span></td>
            <td class="px-6 py-4 text-center"><span class="px-3 py-1 ${u.status === 'Active' ? 'bg-emerald-100/60 border border-emerald-200 text-emerald-700' : 'bg-red-100/60 border border-red-200 text-red-700'} rounded-lg text-[10px] uppercase font-bold tracking-widest">${u.status}</span></td>
            <td class="px-6 py-4 text-right space-x-3">
                <button onclick="toggleUserStatus('${u.id}', '${u.status}')" class="text-sm font-bold ${u.status === 'Active' ? 'text-red-500 hover:text-red-700' : 'text-emerald-600 hover:text-emerald-800'} transition-colors">${u.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                <button onclick="deleteSystemUser('${u.id}', '${u.email}')" class="text-sm font-bold text-slate-400 hover:text-red-600 transition-colors bg-slate-50 hover:bg-red-50 p-2 rounded-lg" title="Delete User"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

document.getElementById('add-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating securely...';
    btn.disabled = true;

    const fullName = document.getElementById('new-user-name').value;
    const email = document.getElementById('new-user-email').value;
    const password = document.getElementById('new-user-password').value;
    const roleId = document.getElementById('new-user-role').value;

    try {
        const response = await supabaseClient.functions.invoke('swift-function', {
            method: 'POST',
            body: { email, password, fullName, roleId }
        });

        if (response.error) {
            let errorMsg = response.error.message || 'Failed to create user';
            if (response.error.context) {
                try {
                    const errBody = await response.error.context.json();
                    if (errBody && errBody.error) errorMsg = errBody.error;
                } catch (ex) {}
            }
            throw new Error(errorMsg);
        }

        showToast("User created successfully!", "success");
        const modal = document.getElementById('add-user-modal');
        if (modal) modal.classList.add('hidden');
        e.target.reset();
        await loadAdminUsersTable();
        
        if (typeof logAuditAction === 'function') {
            await logAuditAction('Create', 'Users', `Created new user account for ${email}`);
        }
    } catch (err) {
        console.error("Error creating user:", err);
        showToast(err.message || 'Failed to create user', 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});

window.deleteSystemUser = async function(userId, userEmail) {
    if (activeUserProfile && activeUserProfile.id === userId) {
        return showToast("You cannot delete your own active administrator account.", "error");
    }
    if (!confirm(`Are you sure you want to permanently delete user: ${userEmail}? This action cannot be undone.`)) return;

    try {
        const response = await supabaseClient.functions.invoke('swift-function', {
            method: 'DELETE',
            body: { userId }
        });

        if (response.error) {
            let errorMsg = response.error.message || 'Failed to delete user';
            if (response.error.context) {
                try {
                    const errBody = await response.error.context.json();
                    if (errBody && errBody.error) errorMsg = errBody.error;
                } catch (ex) {}
            }
            throw new Error(errorMsg);
        }

        showToast("User deleted successfully.", "success");
        if (typeof logAuditAction === 'function') {
            await logAuditAction('Delete', 'Users', `Permanently deleted user account for ${userEmail}`);
        }
        await loadAdminUsersTable();
    } catch (err) {
        console.error("Error deleting user:", err);
        showToast(err.message || 'Failed to delete user', 'error');
    }
}

window.toggleUserStatus = async function(userId, currentStatus) {
    if (!confirm(`Are you sure you want to ${currentStatus === 'Active' ? 'deactivate' : 'activate'} this user?`)) return;
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const { error } = await supabaseClient.from('users').update({ status: newStatus }).eq('id', userId);
    if (error) { showToast(error.message, 'error'); } else { showToast(`User successfully ${newStatus.toLowerCase()}.`, 'success'); await logAuditAction('Update', 'Users', `Changed user status to ${newStatus}`); loadAdminUsersTable(); }
}

async function logAuditAction(action, module, description) {
    if (!activeUserProfile) return;
    await supabaseClient.from('audit_logs').insert([{ user_id: activeUserProfile.id, action, module, description }]);
}

const navLinks = document.querySelectorAll('.nav-link'); 
const sections = document.querySelectorAll('.content-section'); 
const sidebar = document.getElementById('sidebar');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');

function closeSidebarMobile() {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.add('hidden');
}

function openSidebarMobile() {
    sidebar.classList.remove('-translate-x-full');
    sidebarBackdrop.classList.remove('hidden');
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); const target = link.dataset.target;
        navLinks.forEach(l => { l.classList.remove('nav-active'); l.classList.add('nav-item'); });
        link.classList.remove('nav-item'); link.classList.add('nav-active');
        sections.forEach(sec => sec.classList.add('hidden')); document.getElementById(`sec-${target}`).classList.remove('hidden');
        if(target === 'users') loadAdminUsersTable();
        if(window.innerWidth < 768) { closeSidebarMobile(); }
    });
});

document.getElementById('open-sidebar-btn').addEventListener('click', openSidebarMobile);
document.getElementById('close-sidebar-btn').addEventListener('click', closeSidebarMobile);
sidebarBackdrop.addEventListener('click', closeSidebarMobile);

window.openModal = function(id) { 
    const modal = document.getElementById(id); 
    modal.classList.remove('hidden'); 
    setTimeout(() => modal.firstElementChild.classList.add('scale-100'), 10);
}
window.closeModal = (id) => {
    const modal = document.getElementById(id); 
    modal.firstElementChild.classList.remove('scale-100');
    setTimeout(() => modal.classList.add('hidden'), 150);
}
window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toast-container'); const toast = document.createElement('div');
    let color = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-slate-800'; let icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    toast.className = `flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-bold ${color} transition-all duration-300 transform translate-y-4 opacity-0`;
    toast.innerHTML = `<i class="fa-solid ${icon} text-lg"></i> <span>${message}</span>`;
    container.appendChild(toast); 
    setTimeout(() => { toast.classList.remove('translate-y-4', 'opacity-0'); }, 10);
    setTimeout(() => { 
        toast.classList.add('translate-y-4', 'opacity-0'); 
        setTimeout(() => toast.remove(), 300); 
    }, 4000);
}
