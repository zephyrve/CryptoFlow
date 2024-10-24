'use client'

import Image from "next/image"
import React, {useEffect, useRef, useState} from "react"
import {Home, Moon, Sun} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import Link from "next/link";
import {useTheme} from "next-themes";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"


const FaqData = [
    {
        title: 'How to Set Up a One-Time Payment on CryptoFun?',
        descriptions: [
            'To make a one-time payment, start by selecting the option designated for one-time payments within the payment section of the app. You will then need to enter the recipient’s details, either by typing in their name (if saved in your address book) or inputting their wallet address directly. Next, specify the amount you wish to send.',
            'After entering the amount, you’ll have the option to select the exact date and time you want the funds to be released. This flexibility allows you to manage your payments according to your needs, whether you want it to go through immediately or at a later date.',
            'Once you’ve filled in all the necessary details, simply submit the payment. If you selected a specific date and time for the transaction, it will be saved and monitored in the payment history for both the sender and the recipient.',
        ],
        images: [
            '/docs/new-one-time-payment.png'
        ]
    },
    {
        title: 'How to Set Up a Recurring Payment on CryptoFun?',
        descriptions: [
            'The recurring payment feature in CryptoFun enables users to automate regular transactions, making it perfect for subscriptions, ongoing services, or any situation where consistent payments are required. This is particularly beneficial for freelancers receiving monthly payments from clients or individuals subscribing to services that require regular fees.',
            'To set up a recurring payment, start by selecting the option designated for recurring payments within the payment section of the app. You\'ll need to enter the recipient’s details, either by choosing their name from your address book or inputting their wallet address directly. Then, specify the amount you wish to send.',
            'Next, choose the start date for your recurring payment. You can decide how often the payment should be made—whether it’s daily, weekly, or monthly. This flexibility allows you to tailor the payment schedule to suit your needs, ensuring that payments are sent automatically without the need for manual intervention each time.',
            'Once you’ve filled in all the necessary details, simply submit the payment. The app will handle the rest, processing the payment according to the schedule you’ve set. Each transaction will be saved and monitored in the payment history for both the sender and the recipient, allowing you to keep track of all your recurring payments.',
        ],
        images: [
            '/docs/new-recurring-payment.png'
        ]
    },
    {
        title: 'How to use Address Book in CryptoFun?',
        descriptions: [
            'The address book feature in CryptoFun allows users to save and manage recipient details efficiently. This functionality streamlines the payment process by enabling quick access to frequently used wallet addresses, saving you time and reducing the risk of errors.',
            'To use the address book, begin by adding a new recipient. You can do this by entering the recipient\'s name and wallet address. Once saved, the recipient will appear in your address book for easy reference in future transactions.',
            'When you want to make a payment, simply select the recipient’s name from your address book. The corresponding wallet address will be auto-filled, ensuring accuracy and eliminating the need for manual entry. This is especially helpful for users who handle multiple transactions, as it simplifies the payment process.',
            'You also have the ability to manage your entries, allowing you to update or remove recipients as needed. This keeps your address book current and ensures you have quick access to the right information.',
            'By using the address book, you can streamline your payment workflow, making transactions faster and more secure, allowing you to focus on what matters most.',
        ],
        images: [
            '/docs/address-book.png'
        ]
    },
    {
        title: 'How to Make a Deposit?',
        descriptions: [
            'The deposit feature in CryptoFun allows users to transfer cryptocurrency into their account with ease. To make a deposit, start by selecting the amount you wish to deposit and the cryptocurrency you want to use. Once you have made your selections, submit the transaction.',
            'Your funds are then transmitted directly to a smart contract that securely holds them until you choose to withdraw. This streamlined approach ensures your deposits are quick and secure, allowing you to focus on managing your finances effectively.'
        ],
        images: [
            '/docs/balance.png'
        ]
    },
    {
        title: 'How to Make a Withdrawal?',
        descriptions: [
            'Withdrawing funds from your CryptoFun account is a straightforward process that allows you to access your funds whenever you need them. To initiate a withdrawal, begin by selecting the amount you wish to withdraw and the cryptocurrency you want to receive.',
            'After entering the necessary details, submit your withdrawal request. The funds will be transferred from the smart contract back to your designated wallet address.',
        ],
        images: [
            '/docs/balance.png'
        ]
    },
    {
        title: 'How to Create an Invoice?',
        descriptions: [
            'Creating an invoice in CryptoFun is an efficient way to request payments for your services or products. This feature allows you to generate detailed invoices that you can send directly to your clients.',
            'To create an invoice, you will need to provide the client address, which is the wallet address of the person or business you are invoicing, ensuring that the funds are directed to the correct location. Next, you need to select the token for payment, which represents the cryptocurrency you will accept.',
            'You will also specify the invoice category, helping to classify the type of services or products provided. Invoice tags can be added for easier organization and tracking, allowing you to label invoices based on specific projects or clients.',
            'In the description field, provide a brief summary of the services or products being invoiced. This helps the recipient understand what they are being billed for. You will also need to enter the quantity of items or services provided, along with the unit price for each. If applicable, you can apply a discount and specify the tax rate to ensure accurate billing. The amount field will automatically calculate the total due based on the information you input.',
            'Once you\'ve filled in all the necessary details, submit the invoice. Your client will receive a notification along with the invoice, making it easy for them to review and process the payment. You can track the status of the invoice through the app, ensuring you stay updated on pending payments and maintain clear communication with your clients. This feature streamlines the invoicing process, allowing you to focus on your work while efficiently managing your financial transactions.',
        ],
        images: [
            '/docs/new-invoice.png'
        ]
    },
    {
        title: 'How Does the Transaction Cancellation Option Work?',
        descriptions: [
            'The transaction cancellation option in CryptoFun is available exclusively for recurring payments. When creating a recurring payment, the sender has the flexibility to decide who can cancel the transaction. The sender can select whether only the recipient can cancel the transaction, only the sender can cancel it, both parties can cancel it, or neither party can cancel it.',
            'When a transaction is canceled, the recipient can choose where to send the unlocked funds. They can either return the unlocked money to their own wallet or send it back to the sender’s wallet. If the sender cancels the request, any unlocked funds will automatically go to the original recipient’s wallet. This feature enhances flexibility and control for users, allowing them to manage their funds easily while ensuring transparency and security.',
        ],
        images: [
            '/docs/receive-payments.png'
        ]
    },
    {
        title: 'How Does the Payment Request Transfer Method Work?',
        descriptions: [
            'The Payment Request Transfer Method in CryptoFun allows users to resend a payment request to a different address, available only for recurring payments. When creating a payment request, the sender can specify who is allowed to initiate the transfer of the request: the recipient, the sender, both, or neither.',
            'If the sender initiates the transfer, any unlocked funds will automatically be sent to the original recipient\'s wallet, while the payment request containing the remaining locked amount will be transferred to the new recipient\'s address.',
            'If the recipient initiates the transfer to a new address, they will have the option to choose where the unlocked funds are sent. The unlocked funds can either be transferred together with the request to the new recipient\'s address, or they can remain in the original recipient\'s wallet, with only the remaining locked funds being sent to the new recipient.',
        ],
        images: [
            '/docs/receive-payments.png'
        ]
    },
    {
        title: 'How to Withdraw Funds from a Payment Request?',
        descriptions: [
            'When a one-time payment is created with a specific date and time set for fund transfer, the recipient will not be able to withdraw the payment until that specified date arrives. Until then, the funds are locked in the smart contract. Once the set date and time arrive, the funds are unlocked, and the recipient can withdraw the full amount from the contract.',
            'For recurring payments, the funds are unlocked in portions at scheduled intervals, as determined by the sender during the creation of the payment request. This setup allows the recipient to withdraw portions of the funds as they are unlocked, without needing to wait for the entire payment schedule to complete. Each interval unlocks a specific portion, giving the recipient access to the funds incrementally.',
            'This system provides flexibility for the recipient, allowing them to gradually withdraw funds as they are unlocked, ensuring they can access their money sooner without having to wait for the full payment period to elapse.',
        ],
    },
    {
        title: 'How to Manage and Update Invoices?\n',
        descriptions: [
            'In CryptoFun, invoice management allows both the sender and recipient to have control over the payment process. The sender can cancel the invoice, making it inactive and preventing any further actions. They also have the option to pause the invoice, temporarily stopping the recipient from making payments, and can reactivate it when necessary.',
            'The recipient, on their end, can reject the invoice, which closes it. If they agree to the terms, they can proceed with paying the invoice, but payments are made from the funds deposited in the contract, not directly from their wallet.',
            'Each action updates the status of the invoice, keeping both parties informed of its current state and ensuring that the payment process remains transparent and manageable.',
        ],
        images: [
            '/docs/receive-invoices.png'
        ]
    },
]

export default function FAQPage() {
    const { setTheme, theme } = useTheme()
    const [selectedImage, setSelectedImage] = useState('')
    const [isOpenImageModal, setIsOpenImageModal] = useState(false)

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
            className="min-h-screen transition-colors duration-300 bg-purple-100 dark:bg-gray-900 text-gray-900 dark:text-white"
        >
            <AnimatePresence>
                {isOpenImageModal && (
                    <Dialog open={isOpenImageModal} onOpenChange={setIsOpenImageModal}>
                        <DialogContent className="min-w-full md:min-w-[80%]">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                {selectedImage !== '' && (
                                    <Image
                                        src={selectedImage}
                                        alt="Selected image"
                                        width={10000}
                                        height={10000}
                                        className="rounded-lg mt-4 w-full"
                                    />
                                )}
                            </motion.div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="absolute top-4 left-4 flex space-x-2"
                >
                    <Link href="/">
                        <Button
                            className="p-2 rounded-full transition-colors duration-300 bg-purple-600 dark:bg-purple-300 text-purple-100 dark:text-gray-900 hover:bg-purple-700 dark:hover:bg-purple-200"
                            aria-label="Go to Home"
                        >
                            <Home size={24} />
                        </Button>
                    </Link>
                </motion.div>

                {/* Theme toggle */}
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
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

                {/* FAQ Section */}
                <section className="max-w-3xl mx-auto mt-8">
                    <motion.h1
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="md:text-4xl text-3xl font-bold mb-8 text-center text-purple-800 dark:text-purple-300"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <motion.div
                        ref={ref}
                        variants={containerVariants}
                        initial="hidden"
                        animate={controls}
                    >
                        <Accordion type="single" collapsible className="w-full">
                            {FaqData.map((faq, index) => (
                                <motion.div key={index} variants={itemVariants}>
                                    <AccordionItem value={`item-${index}`}>
                                        <AccordionTrigger className="text-xl text-start text-md md:text-[20px] font-semibold text-purple-700 dark:text-purple-300">
                                            {faq.title}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                                className="space-y-4"
                                            >
                                                {faq.descriptions.map((description, descIndex) => (
                                                    <p key={descIndex} className="text-gray-600 dark:text-gray-300">
                                                        {description}
                                                    </p>
                                                ))}
                                                {faq.images && faq.images.map((image, imgIndex) => (
                                                    <motion.div
                                                        key={imgIndex}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Image
                                                            onClick={() => {
                                                                setIsOpenImageModal(true)
                                                                setSelectedImage(image)
                                                            }}
                                                            src={image}
                                                            alt={`Illustration for ${faq.title}`}
                                                            width={10000}
                                                            height={10000}
                                                            className="rounded-lg mt-4 w-full cursor-pointer"
                                                        />
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </motion.div>
                            ))}
                        </Accordion>
                    </motion.div>
                </section>

                {/* Footer */}
                <motion.footer
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                    className="mt-12 py-8 border-t border-purple-200 dark:border-gray-700"
                >
                    <div className="flex justify-center items-center">
                        <Image
                            src="/favicon.webp?height=40&width=40"
                            alt="CryptoFlow Logo"
                            width={40}
                            height={40}
                            className="inline-block mr-2"
                        />
                        <span className="font-bold text-purple-800 dark:text-purple-300">CryptoFlow</span>
                    </div>
                </motion.footer>
            </div>
        </motion.div>
    )
}