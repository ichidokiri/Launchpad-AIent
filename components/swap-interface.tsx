"use client"

import { useState, useEffect } from "react"

export function SwapInterface() {
    const [iframeHeight, setIframeHeight] = useState(550)

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            if (width < 640) {
                // Adjust for mobile screens
                setIframeHeight(650)
            } else {
                setIframeHeight(550)
            }
        }

        handleResize() // Initial call
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div className="w-full rounded-xl overflow-hidden">
            <iframe
                src="https://www.okx.com/web3/dex-widget?tradeType=swap&theme=dark&walletType=phantom&widgetVersion=1&sdkVersion=1.4.0-beta.1&inputChain=501&outputChain=501&inputCurrency=So11111111111111111111111111111111111111112&outputCurrency=Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
                className="w-full"
                scrolling="no"
                style={{
                    border: "none",
                    height: `${iframeHeight}px`,
                    minHeight: `${iframeHeight}px`,
                }}
            />
        </div>
    )
}

