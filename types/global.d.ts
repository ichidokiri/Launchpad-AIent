interface Window {
  ethereum?: {
    isMetaMask?: boolean
    request: (request: { method: string }) => Promise<string[]>
  }
}

