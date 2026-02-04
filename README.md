# 🚀 Deriverse Analytics Dashboard

**Professional Trading Analytics for Solana Traders**

![Dashboard Demo](./demo/dashboard-demo.gif)

**Watch the demo video:** [dashboard-demo.mp4](./demo/dashboard-demo.mp4)

A comprehensive trading analytics solution for [Deriverse](https://deriverse.io), the next-gen decentralized trading ecosystem on Solana. Track your performance, analyze patterns, and get AI-powered insights to improve your trading.

---

## ✨ Features

### 📊 Performance Metrics
- **Total PnL** - Track your overall profit and loss
- **Win Rate** - Percentage of profitable trades
- **Long/Short Ratio** - Understand your directional bias
- **Fee Analysis** - See how fees impact your profits
- **Average Trade Duration** - Time-based performance insights
- **Best/Worst Trade** - Identify your largest gains and losses
- **Total Volume** - Track your trading activity

### 📈 Advanced Analytics
- **Equity Curve** - Visualize your portfolio growth over time
- **Drawdown Analysis** - Monitor peak-to-trough declines (red dashed line)
- **Session Performance** - Compare Asian, London, and NY session results
- **Hourly Breakdown** - Find your most profitable trading hours

### 🛠️ Trading Tools
- **Symbol Filtering** - Focus on specific trading pairs
- **Date Range Selection** - Analyze specific time periods
- **Trade Annotations** - Add notes to trades for journaling
- **Order Type Tracking** - Compare market vs limit order performance

### 🤖 AI Trading Coach
Get automated insights about your trading patterns, risks, and areas for improvement powered by AI analysis.

---

## 🖥️ Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Blockchain:** Solana Web3.js + Wallet Adapter
- **AI:** Gemini API for trade analysis

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/HypergoatTheGr8/deriverse-analytics-agent.git
cd deriverse-analytics-agent

# Install dependencies
npm install

# Set environment variables (optional)
cp .env.example .env.local
# Add your HELIUS_API_KEY and GEMINI_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

---

## 📁 Project Structure

```
src/
├── app/
│   └── page.tsx          # Main dashboard page
├── components/
│   ├── StatCard.tsx      # Metric display cards
│   ├── PnLChart.tsx      # Equity curve + drawdown
│   ├── TimeAnalysis.tsx  # Session & hourly breakdown
│   ├── TradeHistory.tsx  # Trade table with annotations
│   ├── FilterBar.tsx     # Symbol & date filters
│   └── AIInsightPanel.tsx# AI-powered insights
├── lib/
│   ├── analytics.ts      # PnL, win rate calculations
│   ├── helius.ts         # Solana transaction fetching
│   └── gemini.ts         # AI insight generation
└── types/
    └── trade.ts          # TypeScript interfaces
```

---

## 🎯 Bounty Submission

Built for the [Superteam Deriverse Bounty](https://superteam.fun/earn/listing/design-trading-analytics-dashboard-with-journal-and-portfolio-analysis).

**🚀 Why This Submission Stands Out:**

### **🌟 Innovation Beyond Requirements**
1. **AI Trading Coach** - Gemini-powered insights identify patterns & suggest improvements
2. **Drawdown Visualization** - Professional red dashed line shows peak-to-trough declines  
3. **Session Analysis** - Compare Asian/London/NY trading performance
4. **Hourly Heatmap** - Find your most profitable trading hours

### **🎨 Professional Polish**
- **Gradient animations** on cards and headers
- **Smooth hover effects** for interactive elements  
- **Responsive design** works on mobile & desktop
- **Visual hierarchy** with clear information architecture

### **🛠️ Production Ready**
- **TypeScript** for type safety
- **Next.js 14** with App Router
- **Build passes** without errors
- **Ready to deploy** to Vercel/Netlify

**✅ All Bounty Requirements Implemented:**
- Total PnL tracking with visual indicators
- Trading volume and fee analysis  
- Win rate and trade count metrics
- Average trade duration calculations
- Long/Short ratio with directional bias
- Largest gain/loss tracking
- Symbol-specific filtering
- Date range selection
- Historical PnL charts with drawdown
- Time-based performance (daily, session, hourly)
- Trade history with annotations
- Order type performance analysis
- AI-powered trading insights

---

## 📜 License

MIT License - feel free to use and modify.

---

**Built with 🤖 by [Moltbot](https://github.com/HypergoatTheGr8) for the Solana ecosystem.**
