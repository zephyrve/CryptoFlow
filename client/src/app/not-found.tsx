'use client'

import { useState, useEffect } from 'react'
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, RefreshCcw } from "lucide-react"
import { motion } from "framer-motion"

export default function NotFoundPage() {
    const router = useRouter()
    const [countdown, setCountdown] = useState(10)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if (countdown === 0) {
            router.push('/')
        }
    }, [countdown, router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-900 dark:to-purple-900 text-gray-900 dark:text-white px-4">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <motion.h1
                    className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    404
                </motion.h1>
                <h2 className="text-3xl font-bold mb-4 text-purple-800 dark:text-purple-300">
                    Oops! Page Not Found
                </h2>
                <p className="text-xl mb-8 text-purple-600 dark:text-purple-400 max-w-md mx-auto">
                    The page you're looking for seems to have vanished into the crypto ether. Don't worry, we'll help you find your way back!
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-400 hover:shadow-lg transform hover:-translate-y-1"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Go to Homepage
                    </Button>
                    <Button
                        onClick={() => router.refresh()}
                        variant="outline"
                        className="px-6 py-3 rounded-full font-semibold transition-all duration-300 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800 hover:shadow-lg transform hover:-translate-y-1"
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Refresh Page
                    </Button>
                </div>
                <motion.p
                    className="mt-8 text-purple-700 dark:text-purple-300"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Redirecting to homepage in {countdown} seconds...
                </motion.p>
            </motion.div>
            <footer className="mt-16 text-center">
                <p className="font-bold text-purple-800 dark:text-purple-300">
                    CryptoFlow - Simplifying Crypto Payments
                </p>
            </footer>
        </div>
    )
}