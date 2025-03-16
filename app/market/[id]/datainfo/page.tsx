"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, RefreshCw, Trash2, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Add the BASE_URL constant
const BASE_URL = "http://140.112.29.197:13579"

// Define a type for the article objects
interface Article {
  id: number
  title: string
  content: string
  topic: string
  agentSymbol?: string
  date?: string
  isDefault?: boolean // Add this flag to identify default articles
}

// Define the ChatMessage interface
interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

// Generic request function
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response

  try {
    res = await fetch(url, options)
  } catch (networkError) {
    throw new Error(`Network error: ${String(networkError)}`)
  }

  if (!res.ok) {
    let errorText = ""
    try {
      errorText = await res.text()
    } catch (readError) {
      // swallow any text parsing errors
    }
    throw new Error(`Request failed with status ${res.status}\nServer response: ${errorText}`)
  }

  return (await res.json()) as T
}

// Improved mock data for articles with higher quality content
const defaultMockArticles: Article[] = [
  {
    id: 1,
    title: "Understanding Market Patterns",
    content: `# Understanding Market Patterns

Market patterns emerge from the collective behavior of traders and investors, creating recognizable formations that can help predict future price movements. These patterns represent the psychology of market participants and often repeat themselves, offering valuable insights for strategic decision-making.

## Common Chart Patterns

### Head and Shoulders
This reversal pattern consists of three peaks, with the middle peak (head) being higher than the two surrounding peaks (shoulders). When complete, it often signals a trend reversal from bullish to bearish.

### Double Tops and Bottoms
These patterns form when a price tests the same support or resistance level twice without breaking through. Double tops indicate potential bearish reversals, while double bottoms suggest bullish reversals.

### Cup and Handle
A bullish continuation pattern resembling a cup with a handle, indicating a potential upward breakout after a consolidation period.

## Volume Analysis

Volume is a critical component when confirming pattern validity. Increasing volume during breakouts adds credibility to the pattern's predictive power, while decreasing volume may suggest a false signal.

## Timeframe Considerations

Patterns observed on higher timeframes (daily, weekly) typically carry more significance than those on lower timeframes (hourly, minute-based). However, combining multiple timeframe analyses can provide a more comprehensive market view.

## Risk Management

While patterns offer valuable insights, they should never be used in isolation. Implementing proper risk management strategies, including stop-loss orders and position sizing, remains essential for protecting capital during unexpected market movements.`,
    topic: "analysis",
    date: "2023-11-15",
    isDefault: true,
  },
  {
    id: 2,
    title: "Advanced Trading Strategies",
    content: `# Advanced Trading Strategies

Successful trading requires a systematic approach that combines technical analysis, fundamental research, and disciplined execution. This article explores sophisticated strategies employed by professional traders to navigate complex market conditions.

## Momentum Trading

Momentum trading capitalizes on the continuation of existing market trends. This strategy involves:

### Entry Criteria
- Identifying assets showing strong directional movement
- Confirming trend strength using indicators like RSI, MACD, and ADX
- Looking for breakouts above key resistance levels with increased volume

### Risk Management
- Setting trailing stops that adjust as the trend progresses
- Scaling out of positions at predetermined profit targets
- Reducing position size during periods of high volatility

## Mean Reversion

This strategy is based on the principle that prices tend to revert to their historical average over time.

### Implementation Techniques
- Identifying overbought/oversold conditions using oscillators
- Calculating statistical deviations from moving averages
- Establishing probability-based entry and exit points

### Optimal Market Conditions
- Range-bound markets with clear support and resistance levels
- Assets with historically cyclical price movements
- Periods of low fundamental change in the underlying asset

## Market Microstructure Trading

This advanced approach focuses on order flow dynamics and the structure of market depth.

### Key Components
- Analysis of the order book to identify large buyers and sellers
- Tracking of market maker behavior and institutional footprints
- Utilization of time and sales data to identify aggressive order flow

## Algorithmic Integration

Modern traders increasingly combine discretionary judgment with algorithmic execution:

- Developing rule-based systems for entry and exit decisions
- Implementing automated risk management protocols
- Utilizing machine learning for pattern recognition and anomaly detection

## Psychological Discipline

The most sophisticated strategy will fail without proper psychological preparation:

- Maintaining emotional equilibrium during drawdowns
- Following trading plans despite contradictory market noise
- Conducting regular performance reviews to identify improvement areas`,
    topic: "trading",
    date: "2023-12-03",
    isDefault: true,
  },
  {
    id: 3,
    title: "Data-Driven Decision Making",
    content: `# Data-Driven Decision Making

Modern market analysis relies on comprehensive data interpretation to extract actionable insights. This methodical approach transforms raw information into strategic advantages for traders and investors.

## Fundamental Data Analysis

### Economic Indicators
Economic data provides crucial context for market movements. Key indicators include:
- GDP growth rates and their relationship to asset valuations
- Inflation metrics and their impact on various asset classes
- Employment statistics as leading indicators for economic cycles

### Corporate Metrics
For equity markets, company-specific data offers valuable insights:
- Revenue growth trends compared to sector averages
- Profit margin expansion or contraction patterns
- Cash flow sustainability and capital allocation efficiency

## Technical Data Integration

### Pattern Recognition Algorithms
Advanced systems can identify complex patterns across multiple timeframes:
- Harmonic patterns that suggest potential reversal zones
- Elliot Wave formations indicating cyclical market progression
- Fibonacci relationships between price movements

### Volatility Analysis
Understanding volatility dynamics helps optimize position sizing:
- Historical volatility comparisons across market regimes
- Implied volatility surfaces from options markets
- Volatility clustering phenomena during market transitions

## Alternative Data Sources

### Sentiment Analysis
Modern traders leverage natural language processing to quantify market sentiment:
- Social media monitoring for emerging trends
- News flow analysis for event-driven opportunities
- Institutional research sentiment tracking

### Satellite and Geospatial Data
Physical world observations provide unique insights:
- Retail parking lot occupancy for consumer spending trends
- Shipping traffic analysis for global trade activity
- Agricultural yield estimates from crop monitoring

## Quantitative Modeling

### Factor Analysis
Identifying persistent drivers of returns across asset classes:
- Value, momentum, quality, and low volatility factors
- Cross-asset correlations during different market regimes
- Factor rotation patterns throughout economic cycles

### Machine Learning Applications
Advanced algorithms uncover non-linear relationships:
- Supervised learning for pattern classification
- Reinforcement learning for optimal execution strategies
- Anomaly detection for identifying market dislocations

## Implementation Framework

1. Define clear objectives and hypotheses
2. Gather and clean relevant data sources
3. Apply appropriate analytical methodologies
4. Validate findings through backtesting
5. Implement with proper risk parameters
6. Continuously monitor and refine the approach`,
    topic: "data analysis",
    date: "2024-01-20",
    isDefault: true,
  },
]

// Define custom components for ReactMarkdown with styling
const markdownComponents = {
  // Add styling to all paragraph elements
  p: ({ node, ...props }: any) => <p className="text-white mb-4" {...props} />,
  // Add styling to all heading elements
  h1: ({ node, ...props }: any) => <h1 className="text-white text-2xl font-bold mb-4" {...props} />,
  h2: ({ node, ...props }: any) => <h2 className="text-white text-xl font-bold mb-3" {...props} />,
  h3: ({ node, ...props }: any) => <h3 className="text-white text-lg font-bold mb-2" {...props} />,
  // Add styling to lists
  ul: ({ node, ...props }: any) => <ul className="text-white list-disc pl-5 mb-4" {...props} />,
  ol: ({ node, ...props }: any) => <ol className="text-white list-decimal pl-5 mb-4" {...props} />,
  // Add styling to list items
  li: ({ node, ...props }: any) => <li className="text-white mb-1" {...props} />,
  // Add styling to code blocks
  code: ({ node, ...props }: any) => <code className="text-white bg-gray-800 px-1 rounded" {...props} />,
}

/**
 * Agent-specific DataInfo page component
 */
export default function AgentDataInfoPage() {
  const params = useParams()
  const agentId = params?.id as string

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [agentSymbol, setAgentSymbol] = useState<string | null>(null)
  const [agentName, setAgentName] = useState<string | null>(null)
  const [agentArticles, setAgentArticles] = useState<Article[]>([])
  const [mockArticles, setMockArticles] = useState<Article[]>(defaultMockArticles)
  const [isLoading, setIsLoading] = useState(false)
  const [newArticle, setNewArticle] = useState<Article | null>(null)
  const [showArticleDialog, setShowArticleDialog] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [generationError, setGenerationError] = useState<string | null>(null)

  // Fetch agent details - only once when component mounts
  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        // Check if we already have agent details in localStorage
        const cachedAgentDetails = localStorage.getItem(`agent-details-${agentId}`)
        if (cachedAgentDetails) {
          const parsedDetails = JSON.parse(cachedAgentDetails)
          setAgentSymbol(parsedDetails.symbol)
          setAgentName(parsedDetails.name)

          // Check if we have cached articles
          const cachedArticles = localStorage.getItem(`agent-${agentId}-articles`)
          if (cachedArticles) {
            setAgentArticles(JSON.parse(cachedArticles))
          }

          // Check if we have cached mock articles
          const cachedMockArticles = localStorage.getItem(`mock-articles`)
          if (cachedMockArticles) {
            setMockArticles(JSON.parse(cachedMockArticles))
            return // Skip API call if we have cached data
          }

          return // Skip API call if we have cached agent data
        }

        // If no cached data, fetch from API
        const response = await fetch(`/api/agents/${agentId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch agent details")
        }
        const data = await response.json()
        setAgentSymbol(data.agent.symbol)
        setAgentName(data.agent.name)

        // Cache agent details
        localStorage.setItem(
          `agent-details-${agentId}`,
          JSON.stringify({
            symbol: data.agent.symbol,
            name: data.agent.name,
          }),
        )

        // Generate agent-specific articles
        // In a real app, you would fetch these from an API
        const generatedArticles: Article[] = [
          {
            id: 101,
            title: `${data.agent.symbol} Market Analysis`,
            content: `# ${data.agent.symbol} Market Analysis

This comprehensive analysis examines the market dynamics of ${data.agent.name} (${data.agent.symbol}), providing traders and investors with actionable insights based on technical patterns, fundamental drivers, and market sentiment.

## Current Market Position

${data.agent.name} currently trades at $${data.agent.price || "0.00"} with a market capitalization of $${data.agent.marketCap || "0"}, positioning it within the ${data.agent.marketCap > 1000000000 ? "large-cap" : data.agent.marketCap > 100000000 ? "mid-cap" : "small-cap"} segment of the digital asset ecosystem.

## Technical Structure

### Support and Resistance Levels
${data.agent.symbol} has established critical support at $${(Number.parseFloat(data.agent.price || "0") * 0.85).toFixed(2)} and resistance at $${(Number.parseFloat(data.agent.price || "0") * 1.15).toFixed(2)}. These levels have been tested multiple times, confirming their significance for short-term trading strategies.

### Trend Analysis
The primary trend shows a ${Math.random() > 0.5 ? "bullish" : "bearish"} bias on the daily timeframe, with the 50-day moving average ${Math.random() > 0.5 ? "crossing above" : "remaining below"} the 200-day moving average. This ${Math.random() > 0.5 ? "golden cross" : "death cross"} formation suggests potential ${Math.random() > 0.5 ? "upside momentum" : "continued downward pressure"} in the coming weeks.

### Volume Profile
Trading volume has ${Math.random() > 0.5 ? "increased" : "decreased"} by approximately ${Math.floor(Math.random() * 30) + 10}% over the past month, indicating ${Math.random() > 0.5 ? "growing" : "waning"} market interest. Volume spikes have coincided with major price movements, confirming the validity of recent breakouts.

## Fundamental Catalysts

### Development Activity
GitHub commits and developer engagement metrics show ${Math.random() > 0.5 ? "strong" : "moderate"} activity, placing ${data.agent.symbol} in the ${Math.random() > 0.5 ? "top quartile" : "second quartile"} of comparable projects. Recent protocol upgrades have addressed ${Math.random() > 0.5 ? "scalability challenges" : "security vulnerabilities"}, potentially improving long-term adoption prospects.

### Ecosystem Growth
The ${data.agent.name} ecosystem has expanded to include ${Math.floor(Math.random() * 20) + 5} integrated applications and services, representing a ${Math.floor(Math.random() * 40) + 20}% increase year-over-year. This growth trajectory suggests improving network effects and utility value.

### Tokenomics
With a circulating supply of ${Math.floor(Math.random() * 900000000) + 100000000} tokens out of a total supply of ${data.agent.totalSupply || "N/A"}, the current inflation rate stands at approximately ${(Math.random() * 5 + 1).toFixed(1)}% annually. The token distribution remains relatively ${Math.random() > 0.5 ? "concentrated" : "well-distributed"}, with the top 10 wallets controlling ${Math.floor(Math.random() * 30) + 20}% of the supply.

## Market Sentiment Analysis

Social media engagement metrics indicate ${Math.random() > 0.5 ? "positive" : "neutral"} sentiment, with a sentiment score of ${(Math.random() * 2 + 3).toFixed(1)}/5 based on natural language processing of recent discussions. This represents a ${Math.random() > 0.5 ? "improvement" : "slight decline"} from the previous month's sentiment readings.

## Risk Assessment

The current risk profile for ${data.agent.symbol} is categorized as ${Math.random() > 0.7 ? "moderate" : Math.random() > 0.4 ? "elevated" : "high"}, with key risk factors including:

- Regulatory uncertainty in major markets
- Competition from similar projects
- Technical execution risks associated with the roadmap
- Market correlation with broader crypto assets

## Conclusion

${data.agent.name} presents a ${Math.random() > 0.5 ? "compelling" : "speculative"} opportunity within its sector, with ${Math.random() > 0.5 ? "strong technical fundamentals" : "interesting growth potential"} balanced against ${Math.random() > 0.5 ? "moderate" : "significant"} risk factors. Traders should monitor the $${(Number.parseFloat(data.agent.price || "0") * 0.85).toFixed(2)} support level closely, as a breakdown below this threshold could trigger accelerated selling pressure.`,
            topic: "analysis",
            agentSymbol: data.agent.symbol,
            date: "2024-03-05",
          },
          {
            id: 102,
            title: `Trading Strategies for ${data.agent.symbol}`,
            content: `# Trading Strategies for ${data.agent.symbol}

This comprehensive guide outlines effective trading strategies specifically tailored for ${data.agent.name} (${data.agent.symbol}), based on historical performance patterns, volatility characteristics, and market structure analysis.

## Market Characteristics

${data.agent.symbol} exhibits distinct trading patterns that differentiate it from other digital assets:

- **Volatility Profile**: Historical volatility averages ${Math.floor(Math.random() * 60) + 40}% annualized, placing it in the ${Math.random() > 0.5 ? "upper" : "middle"} range compared to similar assets.
- **Liquidity Depth**: Order book analysis reveals average bid-ask spreads of ${(Math.random() * 0.3 + 0.1).toFixed(2)}%, with sufficient depth to absorb orders up to $${Math.floor(Math.random() * 500000) + 100000} without significant slippage.
- **Trading Hours**: Peak liquidity occurs during ${Math.random() > 0.5 ? "Asian" : "European"} and ${Math.random() > 0.5 ? "North American" : "European"} market hours, with notable volume spikes around ${Math.random() > 0.5 ? "UTC 00:00" : "UTC 12:00"}.

## Momentum Trading Strategy

Momentum strategies capitalize on ${data.agent.symbol}'s tendency to exhibit strong directional movements following key breakouts.

### Entry Criteria
1. Price breaks above/below the 20-day Bollinger Bands with volume exceeding the 20-day average by at least 50%
2. RSI(14) reading above 70 for long positions or below 30 for short positions
3. MACD histogram showing increasing momentum in the direction of the trade

### Position Management
- **Initial Stop Loss**: Place stops at the most recent swing low/high, typically 5-8% from entry
- **Take Profit Levels**: Scale out at 1:1, 2:1, and 3:1 risk-reward ratios
- **Position Sizing**: Limit risk to 1-2% of trading capital per position

### Backtesting Results
This strategy has historically generated a win rate of approximately ${Math.floor(Math.random() * 20) + 55}% with an average risk-reward ratio of ${(Math.random() * 1 + 1.5).toFixed(1)}:1 when applied to ${data.agent.symbol}'s price action over the past 12 months.

## Mean Reversion Strategy

${data.agent.symbol} frequently exhibits mean-reverting behavior following extended price movements away from key moving averages.

### Entry Conditions
1. Price deviates more than 2.5 standard deviations from the 50-day moving average
2. Stochastic oscillator shows oversold (<20) or overbought (>80) conditions
3. Volume declining over the past three sessions, indicating exhaustion

### Trade Management
- **Stop Loss Placement**: Beyond the extreme of the recent move, approximately 4-6% from entry
- **Profit Targets**: Primary target at the 50-day moving average, secondary target at the 20-day moving average
- **Time-Based Exits**: Close positions after 5-7 days if targets aren't reached

### Optimal Market Conditions
This strategy performs best during range-bound markets and tends to underperform during strong trend phases. Implement only when ADX readings are below 25, indicating absence of a strong trend.

## Swing Trading Approach

For traders with longer timeframes, ${data.agent.symbol} offers excellent swing trading opportunities based on multi-week cycles.

### Cycle Identification
Analysis of ${data.agent.symbol}'s price history reveals average cycle lengths of ${Math.floor(Math.random() * 10) + 14} days from trough to peak, with standard deviation of ±${Math.floor(Math.random() * 5) + 3} days.

### Entry Strategy
1. Identify potential cycle bottoms using TD Sequential indicator
2. Confirm with bullish divergence on 4-hour RSI
3. Enter when price reclaims the 5-day EMA with increasing volume

### Risk Management
- **Position Sizing**: Allocate 2-3% of portfolio per swing trade
- **Stop Placement**: Below the most recent swing low with additional buffer of 3%
- **Target Selection**: Previous swing high or Fibonacci extension levels (1.27, 1.62)

## Options-Based Strategies

For advanced traders with options access, ${data.agent.symbol}'s volatility profile supports several options strategies:

### Volatility Plays
- **Long Straddles**: During periods of compressed implied volatility preceding major announcements
- **Iron Condors**: During extended consolidation phases with clear support/resistance boundaries

### Directional Options
- **Call/Put Spreads**: Limit risk while maintaining directional exposure
- **Calendar Spreads**: Capitalize on term structure discrepancies in implied volatility

## Risk Management Framework

Regardless of strategy selection, implement these risk parameters:

1. Maximum portfolio exposure to ${data.agent.symbol}: 15-20%
2. Correlation hedging with related assets to reduce systematic risk
3. Regular drawdown limits: pause trading after 5% account drawdown
4. Volatility-based position sizing: reduce exposure during periods of elevated volatility

## Conclusion

${data.agent.symbol} offers diverse trading opportunities across multiple timeframes and strategies. The optimal approach varies based on prevailing market conditions, with momentum strategies excelling during trending phases and mean-reversion tactics performing better during consolidation periods. Consistent application of risk management principles remains essential regardless of the chosen strategy.`,
            topic: "trading",
            agentSymbol: data.agent.symbol,
            date: "2024-02-18",
          },
          {
            id: 103,
            title: `${data.agent.symbol} Fundamental Analysis`,
            content: `# ${data.agent.symbol} Fundamental Analysis

This comprehensive analysis examines the fundamental factors that influence the value proposition and long-term potential of ${data.agent.name} (${data.agent.symbol}). Understanding these fundamentals is essential for making informed investment decisions beyond short-term price movements.

## Project Overview

${data.agent.name} is designed to ${Math.random() > 0.5 ? "revolutionize decentralized finance through innovative cross-chain liquidity solutions" : "provide enterprise-grade blockchain infrastructure for scalable application development"}. The project aims to address critical challenges in the ${Math.random() > 0.5 ? "DeFi ecosystem" : "Web3 infrastructure space"}, including ${Math.random() > 0.5 ? "fragmented liquidity and high transaction costs" : "scalability limitations and developer experience"}.

## Technology Architecture

### Core Protocol
The ${data.agent.symbol} protocol utilizes a ${Math.random() > 0.5 ? "modified Proof-of-Stake consensus mechanism" : "hybrid consensus model combining Proof-of-Authority and Delegated Proof-of-Stake elements"}. This approach enables:

- Transaction throughput of approximately ${Math.floor(Math.random() * 5000) + 2000} TPS
- Block finality in ${Math.floor(Math.random() * 5) + 1} seconds
- Gas fees averaging $${(Math.random() * 0.1).toFixed(4)} per transaction

### Technical Innovations
Key differentiating features include:

1. ${Math.random() > 0.5 ? "State sharding implementation for horizontal scalability" : "Zero-knowledge proof integration for privacy-preserving transactions"}
2. ${Math.random() > 0.5 ? "Cross-chain interoperability protocol compatible with major blockchains" : "Layer-2 optimistic rollup solution for enhanced throughput"}
3. ${Math.random() > 0.5 ? "Native oracle network for reliable off-chain data integration" : "Modular execution environment supporting multiple programming languages"}

## Team and Development

### Leadership
The project is led by a team with extensive experience in ${Math.random() > 0.5 ? "distributed systems and cryptography" : "financial technology and enterprise software development"}. Key team members include:

- ${Math.random() > 0.5 ? "Former senior engineers from major blockchain projects" : "Experienced entrepreneurs with successful exits"}
- ${Math.random() > 0.5 ? "Academic researchers specializing in distributed consensus" : "Industry veterans from traditional finance and technology sectors"}
- ${Math.random() > 0.5 ? "Open-source contributors with established track records" : "Product specialists from leading technology companies"}

### Development Activity
GitHub metrics indicate:

- ${Math.floor(Math.random() * 500) + 1000} commits in the past 6 months
- ${Math.floor(Math.random() * 30) + 20} active contributors
- Development velocity ranking in the top ${Math.floor(Math.random() * 15) + 5}% of comparable projects

## Tokenomics

### Supply Metrics
- Total Supply: ${data.agent.totalSupply || Math.floor(Math.random() * 900000000) + 100000000}
- Circulating Supply: ${Math.floor(Math.random() * 700000000) + 50000000} (${Math.floor(Math.random() * 40) + 30}% of total)
- Emission Schedule: ${Math.random() > 0.5 ? "Deflationary with token burning mechanism" : "Gradually decreasing inflation rate targeting 2% annual issuance by Year 4"}

### Token Utility
The ${data.agent.symbol} token serves multiple functions within the ecosystem:

1. **Governance**: Token holders can vote on protocol upgrades and parameter adjustments
2. **Staking**: Validators and delegators can earn yields of ${Math.floor(Math.random() * 10) + 5}% APY
3. **Transaction Fees**: Used for gas payments and fee distribution
4. **Protocol Services**: Required for accessing premium features and API limits

### Distribution
Initial token allocation follows this distribution:

- Team and Advisors: ${Math.floor(Math.random() * 10) + 15}% (subject to ${Math.floor(Math.random() * 12) + 24}-month vesting)
- Foundation Reserve: ${Math.floor(Math.random() * 10) + 20}%
- Ecosystem Development: ${Math.floor(Math.random() * 10) + 25}%
- Public Sale: ${Math.floor(Math.random() * 10) + 15}%
- Private Investors: ${Math.floor(Math.random() * 10) + 15}%
- Community Incentives: ${Math.floor(Math.random() * 10) + 10}%

## Market Adoption

### Current Traction
${data.agent.name} has achieved significant milestones in adoption:

- ${Math.floor(Math.random() * 50000) + 10000} daily active addresses
- ${Math.floor(Math.random() * 200) + 50} integrated applications and services
- $${Math.floor(Math.random() * 900) + 100}M in Total Value Locked (TVL)

### Strategic Partnerships
The project has established partnerships with:

- ${Math.random() > 0.5 ? "Major DeFi protocols for liquidity integration" : "Enterprise clients for private blockchain implementations"}
- ${Math.random() > 0.5 ? "Leading exchanges for enhanced market access" : "Research institutions for protocol development"}
- ${Math.random() > 0.5 ? "Complementary blockchain projects for cross-chain functionality" : "Traditional finance entities exploring blockchain adoption"}

## Competitive Landscape

### Direct Competitors
${data.agent.name} competes with several established projects:

1. ${Math.random() > 0.5 ? "Ethereum and EVM-compatible chains" : "Specialized Layer-1 blockchains"}
2. ${Math.random() > 0.5 ? "Layer-2 scaling solutions" : "Cross-chain interoperability protocols"}
3. ${Math.random() > 0.5 ? "Application-specific blockchains" : "Enterprise blockchain solutions"}

### Competitive Advantages
Key differentiators include:

- ${Math.random() > 0.5 ? "Superior transaction throughput and cost efficiency" : "Enhanced developer experience and tooling"}
- ${Math.random() > 0.5 ? "Novel consensus mechanism optimized for security and decentralization" : "Unique approach to cross-chain interoperability"}
- ${Math.random() > 0.5 ? "First-mover advantage in specific use cases" : "Strategic partnerships providing market access"}

## Risk Assessment

### Technical Risks
- ${Math.random() > 0.5 ? "Novel consensus mechanism with limited production testing" : "Complex architecture increasing potential attack vectors"}
- ${Math.random() > 0.5 ? "Scalability challenges as network adoption increases" : "Dependency on external protocols for certain functionalities"}

### Market Risks
- ${Math.random() > 0.5 ? "Intense competition from established projects with larger ecosystems" : "Potential regulatory challenges in key markets"}
- ${Math.random() > 0.5 ? "Dependency on broader crypto market sentiment" : "Adoption barriers for mainstream users"}

### Tokenomic Risks
- ${Math.random() > 0.5 ? "Potential sell pressure from early investors as vesting periods conclude" : "Uncertain long-term demand drivers for token utility"}
- ${Math.random() > 0.5 ? "Governance concentration among large token holders" : "Balancing incentives between different ecosystem participants"}

## Valuation Metrics

### Comparable Analysis
Relative to similar projects, ${data.agent.symbol} currently trades at:

- P/S Ratio: ${(Math.random() * 20 + 5).toFixed(1)}x (vs. industry average of ${(Math.random() * 20 + 10).toFixed(1)}x)
- Market Cap to TVL Ratio: ${(Math.random() * 3 + 0.5).toFixed(2)} (vs. industry average of ${(Math.random() * 3 + 1).toFixed(2)})
- Fully Diluted Valuation: $${Math.floor(Math.random() * 900) + 100}M

### Growth Metrics
- Year-over-year user growth: ${Math.floor(Math.random() * 200) + 50}%
- Developer activity growth: ${Math.floor(Math.random() * 100) + 30}%
- Revenue growth: ${Math.floor(Math.random() * 300) + 100}%

## Conclusion

${data.agent.name} presents a ${Math.random() > 0.5 ? "compelling" : "promising"} value proposition within the evolving blockchain ecosystem. Its ${Math.random() > 0.5 ? "technical innovations" : "strategic positioning"} provide a solid foundation for long-term growth, while its ${Math.random() > 0.5 ? "active development community" : "strategic partnerships"} enhance adoption prospects.

For investors, ${data.agent.symbol} represents a ${Math.random() > 0.5 ? "higher-risk, higher-reward" : "moderate-risk"} opportunity within the digital asset space. The project's success will ultimately depend on execution against its roadmap, competitive differentiation, and ability to capture market share in an increasingly crowded landscape.`,
            topic: "fundamentals",
            agentSymbol: data.agent.symbol,
            date: "2024-01-10",
          },
        ]

        setAgentArticles(generatedArticles)

        // Store agent articles in localStorage for persistence
        localStorage.setItem(`agent-${agentId}-articles`, JSON.stringify(generatedArticles))

        //  JSON.stringify(generatedArticles))

        // Store mock articles in localStorage for persistence
        localStorage.setItem(`mock-articles`, JSON.stringify(defaultMockArticles))
      } catch (error) {
        console.error("Error fetching agent details:", error)
      }
    }

    if (agentId) {
      fetchAgentDetails()
    }
  }, [agentId])

  // Function to enhance content with OpenAI
  const enhanceWithOpenAI = async (
    content: string,
    agentName?: string | null,
    agentSymbol?: string | null,
  ): Promise<string> => {
    try {
      console.log("Enhancing content with OpenAI, content length:", content?.length || 0)

      // Validate content before sending to API
      if (!content || content.trim() === "") {
        console.error("Content is empty or undefined")
        return content || "" // Return original content if it's empty
      }

      const response = await fetch("/api/enhance-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          agentName,
          agentSymbol,
          task: "Create an engaging and creative article that could be about any topic related to finance, technology, culture, or future trends. Feel free to be imaginative and explore interesting concepts. Format with proper markdown and include multiple sections.",
        }),
      })

      // Log the response status
      console.log(`OpenAI API response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text().catch(() => "")
        console.error(`API error (${response.status}): ${errorText}`)
        throw new Error(`Failed to enhance content: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      if (!data.enhancedContent) {
        console.error("API returned no enhanced content:", data)
        throw new Error("API returned no enhanced content")
      }

      return data.enhancedContent
    } catch (error) {
      console.error("Error enhancing content with OpenAI:", error)
      // Return original content if enhancement fails
      return content
    }
  }

  // Function to send topic to external API and generate article
  const sendTopic = async (): Promise<string> => {
    try {
      // Create a more creative topic that's not necessarily related to the agent
      const topics = [
        `Write about the intersection of blockchain technology and art`,
        `Explore the future of decentralized finance beyond cryptocurrencies`,
        `Discuss how emerging technologies might reshape society in the next decade`,
        `Analyze the psychological aspects of trading and investment decisions`,
        `Examine the cultural impact of digital assets and virtual ownership`,
        `Explore the concept of value in digital and physical economies`,
        `Write about the evolution of trust in financial systems`,
        `Discuss the environmental considerations of blockchain technology`,
        `Analyze how AI and blockchain might converge in the future`,
        `Explore the philosophical implications of decentralized systems`,
      ]

      // Select a random topic
      const topic = topics[Math.floor(Math.random() * topics.length)]

      console.log(`Sending topic to external API at ${BASE_URL}/content:`, topic)

      // Send the topic to the external API
      const response = await fetch(`${BASE_URL}/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Important: The API expects just a string, not an object
        body: JSON.stringify(topic),
      })

      console.log(`External API response status: ${response.status}`)

      if (!response.ok) {
        const errorMsg = await response.text().catch(() => "")
        throw new Error(`Request failed with status ${response.status}\n${errorMsg}`)
      }

      // Get the raw response text first for debugging
      const responseText = await response.text()
      console.log("Raw API response:", responseText)

      // Try to parse the response as JSON
      let data
      try {
        data = JSON.parse(responseText)
        console.log("Parsed API response:", data)
      } catch (parseError) {
        console.error("Failed to parse API response as JSON:", parseError)
        // If it's not valid JSON but has content, return the raw text
        if (responseText && responseText.trim().length > 0) {
          return responseText
        }
        throw new Error("API response is not valid JSON and contains no usable content")
      }

      // Check if the response has the expected structure
      if (data && data.response) {
        return data.response
      } else if (data && typeof data === "string" && data.trim().length > 0) {
        // If the API returned a string directly
        return data
      } else if (data && Object.keys(data).length > 0) {
        // If there's some other data structure, try to extract useful content
        console.log("API returned unexpected data structure:", data)
        // Try to find any property that might contain the content
        for (const key of Object.keys(data)) {
          if (typeof data[key] === "string" && data[key].trim().length > 50) {
            console.log(`Using content from '${key}' property`)
            return data[key]
          }
        }

        // If we can't find a suitable property, stringify the whole response
        return JSON.stringify(data, null, 2)
      }

      // If we get here, we couldn't find any usable content
      throw new Error("External API returned no usable content")
    } catch (error) {
      console.error("Error sending topic to external API:", error)

      // Create a fallback article content with creative topics
      const fallbackTopics = [
        {
          title: "The Digital Renaissance: How Blockchain is Transforming Creative Industries",
          content: `# The Digital Renaissance: How Blockchain is Transforming Creative Industries

## A New Era for Creators

The intersection of blockchain technology and creative industries is ushering in what many are calling a Digital Renaissance. Artists, musicians, writers, and other creators are discovering unprecedented opportunities to monetize their work, connect directly with their audiences, and establish verifiable ownership of digital assets.

## Beyond the NFT Hype

While non-fungible tokens (NFTs) captured headlines with multi-million dollar sales, the true revolution lies in the underlying infrastructure that blockchain provides. Smart contracts enable automatic royalty payments, giving creators ongoing revenue streams from secondary sales—something previously impossible in digital markets.

## Community Ownership Models

Decentralized autonomous organizations (DAOs) are enabling new forms of collective ownership and decision-making in creative projects. From community-owned music labels to collaborative film productions, these models are challenging traditional gatekeepers and funding structures.

## Challenges and Considerations

Despite the promise, questions remain about environmental impact, accessibility, and long-term sustainability. The technology continues to evolve, with layer-2 solutions and alternative consensus mechanisms addressing many early concerns.

## The Future Canvas

As these technologies mature, we're likely to see entirely new art forms emerge—interactive, evolving pieces that respond to ownership, community input, or external data. The canvas of possibility continues to expand, limited only by creative imagination and technical innovation.`,
        },
        {
          title: "The Psychology of Digital Scarcity",
          content: `# The Psychology of Digital Scarcity

## Reimagining Value in an Age of Abundance

In a digital world where perfect copies can be created instantly at zero marginal cost, blockchain technology has introduced something previously thought impossible: digital scarcity. This fundamental shift is changing how we perceive value in virtual spaces and challenging our understanding of ownership.

## The Collector's Mindset

Humans have collected rare items throughout history—from ancient artifacts to vintage cars. Digital collectibles tap into these same psychological drivers: the thrill of the hunt, status signaling, community belonging, and the joy of curation. What's changed is merely the medium, not the underlying motivations.

## Artificial Scarcity vs. Programmatic Scarcity

Critics argue that digital scarcity is merely artificial—a technological enforcement of limitations that don't naturally exist in digital environments. Proponents counter that "programmatic scarcity" is no less real than other socially-constructed forms of value, from fiat currency to luxury fashion.

## Identity and Digital Possessions

As we spend more time in digital spaces, our virtual possessions increasingly form part of our identity. The ability to truly own digital assets—rather than merely license them from platforms—represents a profound shift in how we express ourselves online.

## Beyond Speculation

While speculative manias have dominated headlines, the long-term implications of digital scarcity extend far beyond price fluctuations. From digital land in virtual worlds to tokenized access to communities, we're witnessing the emergence of entirely new economic systems with their own rules and social norms.

## The Abundance Paradox

Perhaps most interestingly, digital scarcity exists alongside unprecedented abundance. The same technologies enabling verifiable ownership also facilitate permissionless creation and global distribution at scales previously unimaginable. Navigating this paradox will define the next era of digital culture.`,
        },
        {
          title: "Decentralized Finance: Beyond Cryptocurrencies",
          content: `# Decentralized Finance: Beyond Cryptocurrencies

## Reimagining the Financial System

Decentralized Finance (DeFi) represents one of the most transformative applications of blockchain technology, extending far beyond simple cryptocurrency transactions. By recreating traditional financial services without centralized intermediaries, DeFi is challenging centuries-old assumptions about how money moves through the global economy.

## The Composability Revolution

Often described as "money legos," DeFi protocols can be seamlessly combined in ways traditional financial services cannot. This composability enables rapid innovation and complex financial products that would be impossible in siloed traditional systems.

## Global Access, Local Impact

Perhaps the most profound promise of DeFi is expanding financial access to the estimated 1.7 billion adults worldwide without banking services. By requiring only an internet connection rather than identity documents or credit histories, these systems could enable economic participation at unprecedented scales.

## Risks and Challenges

The rapid evolution of DeFi brings significant risks: smart contract vulnerabilities, regulatory uncertainty, and complex user experiences remain substantial barriers. Critics also question whether these systems truly decentralize power or simply create new forms of concentration.

## Beyond Currency: Real-World Assets

The next frontier involves bringing real-world assets on-chain—from real estate and commodities to intellectual property and carbon credits. These developments could bridge the gap between digital and physical economies, creating entirely new markets and investment opportunities.

## The Path Forward

As these systems mature, they're likely to both challenge and complement traditional finance rather than wholly replacing it. The most promising future may be hybrid models that combine the efficiency and accessibility of decentralized systems with the stability and protections of regulated institutions.`,
        },
      ]

      // Select a random fallback topic
      const fallback = fallbackTopics[Math.floor(Math.random() * fallbackTopics.length)]
      return fallback.content
    }
  }

  // Function to generate a new article
  const generateNewArticle = async () => {
    setIsLoading(true)
    setGenerationError(null)

    try {
      // Step 1: Get initial content from the external API using sendTopic
      console.log("Starting article generation process")
      const externalContent = await sendTopic()

      if (!externalContent || externalContent.trim() === "") {
        throw new Error("Received empty content from external API")
      }

      console.log("External content received, length:", externalContent.length)

      // Step 2: Enhance the content with OpenAI
      const enhancedContent = await enhanceWithOpenAI(externalContent, agentName, agentSymbol)
      console.log("Content enhanced, final length:", enhancedContent.length)

      // Create a new article from the enhanced content
      const article: Article = {
        id: Date.now(), // Use timestamp as unique ID
        title: generateCreativeTitle(),
        content: enhancedContent,
        topic: getRandomTopic(),
        agentSymbol: agentSymbol || undefined,
        date: new Date().toISOString().split("T")[0],
      }

      // Add to agent articles and store in localStorage
      const updatedArticles = [article, ...agentArticles]
      setAgentArticles(updatedArticles)
      localStorage.setItem(`agent-${agentId}-articles`, JSON.stringify(updatedArticles))

      // Set the new article and show dialog
      setNewArticle(article)
      setShowArticleDialog(true)
    } catch (error) {
      console.error("Error generating article:", error)
      setGenerationError(`Failed to generate article: ${error instanceof Error ? error.message : String(error)}`)

      // Create a fallback article if the API fails
      const fallbackArticle: Article = {
        id: Date.now(),
        title: generateCreativeTitle(),
        content: `# ${generateCreativeTitle()}

## The Evolution of Digital Economies

In the rapidly evolving landscape of digital economies, we're witnessing unprecedented transformations in how value is created, exchanged, and stored. From decentralized finance to tokenized assets, the boundaries between traditional and emerging markets continue to blur.

## Technological Convergence

The convergence of blockchain, artificial intelligence, and extended reality technologies is creating entirely new possibilities for human interaction and economic activity. These systems are not merely digitizing existing processes but enabling fundamentally new forms of organization and collaboration.

## Cultural Implications

Beyond the technical infrastructure, we're experiencing profound cultural shifts in how people relate to digital assets, online communities, and virtual identities. The concept of ownership itself is being reimagined in ways that challenge conventional understanding.

## Looking Forward

As these technologies mature and adoption increases, we can expect further disruption across industries ranging from finance and real estate to entertainment and education. The most successful participants will be those who can adapt to these changes while maintaining focus on creating genuine value.

## Navigating Complexity

For individuals and organizations alike, navigating this complex landscape requires both technical understanding and philosophical clarity. The questions of what constitutes value, how trust is established, and who benefits from these systems will remain central to their development.`,
        topic: getRandomTopic(),
        agentSymbol: agentSymbol || undefined,
        date: new Date().toISOString().split("T")[0],
      }

      // Add to agent articles and store in localStorage
      const updatedArticles = [fallbackArticle, ...agentArticles]
      setAgentArticles(updatedArticles)
      localStorage.setItem(`agent-${agentId}-articles`, JSON.stringify(updatedArticles))

      // Set the fallback article and show dialog
      setNewArticle(fallbackArticle)
      setShowArticleDialog(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to generate creative titles
  const generateCreativeTitle = (): string => {
    const titles = [
      "The Digital Horizon: Exploring Tomorrow's Economy",
      "Beyond Bits and Blocks: The New Paradigm of Value",
      "Decentralized Dreams: Reimagining Financial Systems",
      "The Tokenized Future: Assets in the Digital Age",
      "Quantum Finance: Where Technology Meets Money",
      "Digital Renaissance: Art and Technology Converge",
      "The Trust Protocol: Building the New Internet of Value",
      "Sovereign Data: Reclaiming Control in the Digital Era",
      "Metaverse Economics: Virtual Worlds, Real Value",
      "Algorithmic Governance: The Future of Decision Making",
    ]
    return titles[Math.floor(Math.random() * titles.length)]
  }

  // Helper function to get a random topic
  const getRandomTopic = (): string => {
    const topics = ["analysis", "trading", "fundamentals", "data analysis", "technology", "culture", "future"]
    return topics[Math.floor(Math.random() * topics.length)]
  }

  // Function to handle article click
  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article)
    setShowArticleDialog(true)
  }

  // Combine mock articles with agent-specific articles
  const allArticles = [...mockArticles, ...agentArticles]

  // Filter articles based on search term, selected topic, and agent symbol
  const filteredArticles = allArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedTopic === "" || article.topic === selectedTopic) &&
      (!agentSymbol || !article.agentSymbol || article.agentSymbol === agentSymbol),
  )

  // Add a deleteArticle function before the return statement, after the filteredArticles constant
  const deleteArticle = (articleId: number) => {
    // Prevent event bubbling when clicking delete button
    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation()

      // Find the article to check if it's a default article or agent article
      const articleToDelete = allArticles.find((article) => article.id === articleId)

      if (articleToDelete) {
        if (articleToDelete.isDefault) {
          // If it's a default article, update mockArticles
          const updatedMockArticles = mockArticles.filter((article) => article.id !== articleId)
          setMockArticles(updatedMockArticles)
          localStorage.setItem("mock-articles", JSON.stringify(updatedMockArticles))
        } else {
          // If it's an agent article, update agentArticles
          const updatedAgentArticles = agentArticles.filter((article) => article.id !== articleId)
          setAgentArticles(updatedAgentArticles)
          localStorage.setItem(`agent-${agentId}-articles`, JSON.stringify(updatedAgentArticles))
        }
      }

      // Close the dialog if the deleted article is currently selected
      if (selectedArticle?.id === articleId || newArticle?.id === articleId) {
        setShowArticleDialog(false)
        setSelectedArticle(null)
        setNewArticle(null)
      }
    }

    return handleDeleteClick
  }

  const topics = ["analysis", "trading", "fundamentals", "data analysis", "technology", "culture", "future"]

  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white">
      <div className="flex items-center mb-6">
        <Link href={`/market/${agentId}`} className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{agentName ? `${agentName} DataInfo` : "DataInfo"}</h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-[#2F2F2F] border-gray-700 text-white placeholder:text-gray-400"
          />
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="border rounded p-2 bg-[#2F2F2F] border-gray-700 text-white"
          >
            <option value="">All Topics</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={generateNewArticle} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Article...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate New Article
            </>
          )}
        </Button>
      </div>

      {generationError && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-md">
          <p className="text-red-200">{generationError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <div key={article.id} className="relative">
              <Card
                className="bg-[#2F2F2F] border-gray-700 hover:bg-gray-700 transition-colors h-full cursor-pointer"
                onClick={() => handleArticleClick(article)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white pr-8">{article.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hover:bg-transparent"
                      onClick={deleteArticle(article.id)}
                      aria-label="Delete article"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  {article.date && <p className="text-sm text-gray-400">Published: {article.date}</p>}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">Topic: {article.topic}</p>
                  <p className="mt-2 text-gray-300">{article.content.substring(0, 100)}...</p>
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-gray-400">No articles found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4 bg-[#2F2F2F] border-gray-700 text-white hover:bg-gray-600"
              onClick={() => {
                setSearchTerm("")
                setSelectedTopic("")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Article Dialog */}
      <Dialog open={showArticleDialog} onOpenChange={setShowArticleDialog}>
        <DialogContent className="bg-[#2F2F2F] text-white border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <DialogTitle className="text-xl md:text-2xl">{(selectedArticle || newArticle)?.title}</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-red-500 hover:bg-transparent"
                onClick={deleteArticle((selectedArticle || newArticle)?.id || 0)}
                aria-label="Delete article"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
            {(selectedArticle || newArticle)?.date && (
              <p className="text-sm text-gray-400">Published: {(selectedArticle || newArticle)?.date}</p>
            )}
            {(selectedArticle || newArticle)?.topic && (
              <p className="text-sm text-gray-400">Topic: {(selectedArticle || newArticle)?.topic}</p>
            )}
          </DialogHeader>
          <div className="mt-4">
            <ReactMarkdown components={markdownComponents}>
              {(selectedArticle || newArticle)?.content || ""}
            </ReactMarkdown>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

