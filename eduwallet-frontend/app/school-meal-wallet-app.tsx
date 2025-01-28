"use client"

import type React from "react"
import { useState, useContext, createContext } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet, Users, ShieldCheck } from "lucide-react"

// Context for Authentication and Wallet Management
const WalletContext = createContext<any>(null)

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Array<{ type: string; amount: number; date: string }>>([])
  const [isEligible, setIsEligible] = useState(false)

  const distributeVouchers = (amount: number) => {
    setBalance((prevBalance) => prevBalance + amount)
    setTransactions((prev) => [
      ...prev,
      {
        type: "Credit",
        amount,
        date: new Date().toLocaleString(),
      },
    ])
  }

  const useVoucher = (amount: number) => {
    if (balance >= amount) {
      setBalance((prevBalance) => prevBalance - amount)
      setTransactions((prev) => [
        ...prev,
        {
          type: "Debit",
          amount,
          date: new Date().toLocaleString(),
        },
      ])
      return true
    }
    return false
  }

  const checkEligibility = (studentData: { age: number; familyIncome: number }) => {
    // Sample eligibility check logic
    const isSchoolAgeChild = studentData.age >= 5 && studentData.age <= 18
    const isLowIncomeFamily = studentData.familyIncome < 30000

    setIsEligible(isSchoolAgeChild && isLowIncomeFamily)
    return isEligible
  }

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isEligible,
        distributeVouchers,
        useVoucher,
        checkEligibility,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

const MealVoucherWallet = () => {
  const { balance, transactions, distributeVouchers, useVoucher } = useContext(WalletContext)

  const [voucherAmount, setVoucherAmount] = useState(10)
  const [useVoucherAmount, setUseVoucherAmount] = useState(10) // Added state for useVoucher amount

  const handleUseVoucher = () => {
    useVoucher(useVoucherAmount)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>School Meal Voucher Wallet</CardTitle>
        </div>
        <Wallet className="h-6 w-6 text-primary" />
      </CardHeader>

      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label>Current Meal Credit Balance</Label>
            <span className="text-2xl font-bold text-primary">${balance.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <Label>Distribute Vouchers</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={voucherAmount}
                onChange={(e) => setVoucherAmount(Number(e.target.value))}
                min={1}
                max={50}
                className="w-full"
              />
              <Button onClick={() => distributeVouchers(voucherAmount)} className="shrink-0">
                Distribute
              </Button>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Use Meal Voucher</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Meal Voucher Usage</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to use a ${useVoucherAmount} meal voucher?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleUseVoucher}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>

      <CardFooter>
        <div className="w-full">
          <h4 className="text-sm font-medium mb-2">Recent Transactions</h4>
          <div className="space-y-1">
            {transactions.slice(-3).map((transaction, index) => (
              <div
                key={index}
                className={`flex justify-between text-sm ${
                  transaction.type === "Credit" ? "text-green-600" : "text-red-600"
                }`}
              >
                <span>{transaction.type}</span>
                <span>${transaction.amount.toFixed(2)}</span>
                <span className="text-gray-500">{transaction.date}</span>
              </div>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

// Main Application Component
const SchoolMealWalletApp = () => {
  return (
    <WalletProvider>
      <div className="container mx-auto p-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <MealVoucherWallet />
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Program Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Supports School Children Ages 5-18</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <span>Income-Based Eligibility</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WalletProvider>
  )
}

export default SchoolMealWalletApp

