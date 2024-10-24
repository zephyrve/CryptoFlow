'use client'

import Image from "next/image"
import {useEffect, useRef, useState} from "react"
import {
    ArrowDownCircle,
    ArrowRightLeft,
    CreditCard,
    DollarSign,
    FileText,
    History,
    Moon,
    RefreshCw,
    Sun,
    TwitterIcon,
    Wallet,
    XCircle,
    YoutubeIcon
} from "lucide-react"
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {VIDEO_DEMO_URL} from "@/config/constants";
import {useRouter} from "next/navigation";
import {useAccount, useConnect, useSwitchChain} from "wagmi";
import useMetaMaskInstalled from "@/hooks/useMetaMaskInstalled";
import {DEFAULT_CHAIN_ID} from "@/utils/chainSettings";
import {useTheme} from "next-themes";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"
import ContactForm from "@/app/(public)/components/contact-form";

const features = [
    {
        id: 0,
        title: 'Deposits',
        text: 'Users can deposit tokens by selecting the amount and token address.',
        icon: Wallet
    },
    {
        id: 1,
        title: 'Recurring Payments',
        text: 'Set up automated payments with parameters such as start date, amount, frequency, and recipients, including a prepaid percentage.',
        icon: RefreshCw
    },
    {
        id: 2,
        title: 'One-Time Payments',
        text: 'Create immediate or scheduled payments, specifying the amount and recipient.',
        icon: CreditCard
    },
    {
        id: 3,
        title: 'Withdrawals',
        text: 'Recipients can withdraw amounts from payment requests based on unlocked funds, easily selecting the desired amount.',
        icon: ArrowDownCircle
    },
    {
        id: 4,
        title: 'Payment Requests',
        text: 'View sent and received payment requests, checking status and available amounts for tracking activities.',
        icon: FileText
    },
    {
        id: 5,
        title: 'Cancel Payments',
        text: 'Cancel active payment requests as permitted, allowing recovery of available funds.',
        icon: XCircle
    },
    {
        id: 6,
        title: 'Transfer Payments',
        text: 'Transfer payment requests to different recipients for flexible transaction management.',
        icon: ArrowRightLeft
    },
    {
        id: 7,
        title: 'Token Balances',
        text: 'Check token balances, including available and locked amounts, for a clear financial overview.',
        icon: DollarSign
    },
    {
        id: 8,
        title: 'Transaction History',
        text: 'View transaction history to track financial activities and monitor the flow of funds.',
        icon: History
    }
];

export default function CryptoFlowHeroAndFeatures() {
    const { setTheme, theme } = useTheme()
    const { switchChain } = useSwitchChain()
    const { connectors, connect } = useConnect()
    const router = useRouter()
    const { status, chainId } = useAccount()
    const { isLoading, isMetaMaskInstalled } = useMetaMaskInstalled()

    const controls = useAnimation()
    const ref = useRef(null)
    const inView = useInView(ref, { once: true })

    useEffect(() => {
        if (inView) {
            controls.start("visible")
        }
    }, [controls, inView])

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    const connectWallet = async () => {
        connect({ connector: connectors[0] })
        switchChain({ chainId: DEFAULT_CHAIN_ID })
    }

    const handleSwitchNetwork = () => {
        if (switchChain) {
            switchChain({ chainId: DEFAULT_CHAIN_ID })
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="overflow-x-clip transition-colors duration-300 bg-purple-100 dark:bg-gray-900 text-gray-900 dark:text-white"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Theme toggle */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="absolute top-4 right-4"
                >
                    <Button
                        onClick={toggleTheme}
                        className="p-2 rounded-full transition-colors duration-300 bg-purple-600 dark:bg-purple-300 text-purple-100 dark:text-gray-900 hover:bg-purple-700 dark:hover:bg-purple-200"
                        aria-label={theme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
                    >
                        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                    </Button>
                </motion.div>

                {/* Hero Section */}
                <section className="min-h-screen flex items-center justify-center py-12 xl:mx-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                            className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0 text-center lg:text-left"
                        >
                            <motion.h1
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 transition-colors duration-300 text-purple-800 dark:text-purple-300"
                            >
                                CryptoFlow
                            </motion.h1>
                            <motion.h2
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6 transition-colors duration-300 text-purple-600 dark:text-gray-300"
                            >
                                Simplifying Crypto Payments for Everyone
                            </motion.h2>
                            <motion.p
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="text-lg mb-8 transition-colors duration-300 text-purple-700 dark:text-gray-400"
                            >
                                CryptoFlow revolutionizes your payment management in the digital world. Our platform
                                simplifies cryptocurrency transactions, allowing you to effortlessly send, receive, and
                                automate payments.
                            </motion.p>
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                                className="flex items-center align-middle gap-4 justify-center lg:justify-start"
                            >
                                <AnimatePresence>
                                    {!isMetaMaskInstalled ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Button className="px-6 py-3 rounded-full font-semibold transition-colors duration-300 bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-400">
                                                Install wallet
                                            </Button>
                                        </motion.div>
                                    ) : status === 'disconnected' || status === 'connecting' ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Button
                                                disabled={isLoading || status === 'connecting'}
                                                isLoading={status === 'connecting'}
                                                className="px-6 py-3 rounded-full font-semibold transition-colors duration-300 bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-400"
                                                onClick={connectWallet}
                                            >
                                                Connect Wallet
                                            </Button>
                                        </motion.div>
                                    ) : chainId !== 1029 ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Button
                                                className="px-6 py-3 rounded-full font-semibold transition-colors duration-300 bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-400"
                                                onClick={handleSwitchNetwork}
                                            >
                                                Switch Network
                                            </Button>
                                        </motion.div>
                                    ) : chainId === 1029 ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Button
                                                className="px-6 py-3 rounded-full font-semibold transition-colors duration-300 bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-400"
                                                onClick={() => router.push("/balance")}
                                            >
                                                Get Started
                                            </Button>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                                <Link href={VIDEO_DEMO_URL} target="_blank">
                                    <Button className="px-6 py-3 rounded-full font-semibold transition-colors duration-300 bg-secondary-foreground dark:bg-secondary text-secondary dark:text-secondary-foreground hover:bg-secondary-foreground/60 dark:hover:bg-secondary/60">
                                        Video Demonstration
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                            className="lg:w-auto flex justify-start"
                        >
                            <Image
                                src="/image1.webp?height=300&width=300"
                                alt="CryptoFlow Illustration"
                                width={400}
                                height={400}
                                className="rounded-lg"
                            />
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section ref={ref} className="py-16 xl:mx-10">
                    <motion.h2
                        initial={{ y: 50, opacity: 0 }}
                        animate={controls}
                        variants={{
                            hidden: { y: 50, opacity: 0 },
                            visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
                        }}
                        className="text-3xl sm:text-4xl font-bold text-center mb-12 text-purple-800 dark:text-purple-300"
                    >
                        Our Features
                    </motion.h2>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={controls}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                className="p-6 rounded-lg shadow-md transition-colors duration-300 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700"
                            >
                                <feature.icon className="w-8 h-8 mb-4 text-purple-600 dark:text-purple-400" />
                                <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-300">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{feature.text}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                <ContactForm/>

                <motion.footer
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                    className="py-8 border-t xl:mx-10 border-purple-200 dark:border-gray-700"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0 flex justify-center align-middle items-center">
                            <Image
                                src="/favicon.webp?height=40&width=40"
                                alt="CryptoFlow Logo"
                                width={40}
                                height={40}
                                className="inline-block mr-2"
                            />
                            <span className="font-bold text-purple-800 dark:text-purple-300">CryptoFlow</span>
                        </div>
                        <nav className="flex gap-4">
                            <Link
                                href="/faq"
                                className="hover:underline text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            >
                                FAQ
                            </Link>
                        </nav>
                        <div className="mt-4 md:mt-0 flex gap-4 text-gray-600 dark:text-gray-400">
                            <Link className="block" target="_blank" href="https://x.com/CryptoFlowApp">
                                <TwitterIcon />
                            </Link>
                            <Link className="block" target="_blank" href={VIDEO_DEMO_URL}>
                                <YoutubeIcon />
                            </Link>
                        </div>
                    </div>
                </motion.footer>
            </div>
        </motion.div>
    )
}