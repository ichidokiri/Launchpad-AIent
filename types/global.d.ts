interface Window {
  ethereum?: {
    isMetaMask?: boolean
    request: (request: { method: string }) => Promise<string[]>
  }
  // Add TradingView type definition
  TradingView?: {
    widget: new (config: any) => any
  }
}

