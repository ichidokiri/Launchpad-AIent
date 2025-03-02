"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)

    // Log to error reporting service
    this.logError(error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })
  }

  private logError(error: Error, errorInfo: ErrorInfo) {
    // TODO: Implement error logging service
    // This could be Sentry, LogRocket, etc.
    console.error({
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    })
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    })
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="rounded-lg bg-white dark:bg-gray-800 p-8 text-center shadow-xl max-w-lg w-full mx-4">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Something went wrong</h2>
              <div className="mb-4 text-left">
                <p className="text-gray-600 dark:text-gray-300 mb-2">{this.state.error?.message}</p>
                {process.env.NODE_ENV === "development" && (
                  <pre className="text-xs text-red-600 dark:text-red-400 bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                )}
              </div>
              <div className="flex justify-center gap-4">
                <Button onClick={this.handleReset} variant="default">
                  Try again
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Reload page
                </Button>
              </div>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

