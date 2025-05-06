"use client"

import { useState } from 'react'
import { X } from 'lucide-react'

interface PaymentOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  onOneTimePayment: () => void
  onSubscriptionSelected: (plan: SubscriptionPlan) => void
  subscriptionPlans: SubscriptionPlan[]
}
interface SubscriptionPlan {
    _id: string;
    planType: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    name?: string;
    description?: string;
    features?: string[];
    duration?: string;
  }

export default function PaymentOptionsModal({
  isOpen,
  onClose,
  onOneTimePayment,
  onSubscriptionSelected,
  subscriptionPlans
}: PaymentOptionsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Choose Payment Option</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* One-time payment option */}
            <div 
              className="border border-gray-200 rounded-xl p-6 cursor-pointer hover:border-yellow-500 transition-colors"
              onClick={onOneTimePayment}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">One-Time Payment</h3>
                  <p className="text-gray-600">Pay $50 to post this single job</p>
                </div>
                <div className="text-2xl font-bold text-yellow-600">$50</div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">✓</span>
                    Post this job immediately
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">✓</span>
                    Job will be active for 30 days
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">✓</span>
                    No recurring payments
                  </li>
                </ul>
              </div>
            </div>

            {/* Subscription options */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Or subscribe for unlimited job postings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subscriptionPlans.map((plan) => (
                  <div 
                    key={plan._id}
                    className={`border rounded-xl p-4 cursor-pointer hover:border-yellow-500 transition-colors ${
                      plan.planType === 'quarterly' ? 'border-yellow-500 shadow-md' : 'border-gray-200'
                    }`}
                    onClick={() => onSubscriptionSelected(plan)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900">{plan.name}</h4>
                      {plan.planType === 'quarterly' && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-2">${plan.price}</p>
                    <p className="text-sm text-gray-500 mb-3">for {plan.duration}</p>
                    <ul className="space-y-1 text-xs text-gray-600">
                      {plan.features?.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-600 mr-1">✓</span>
                          {feature}
                        </li>
                      ))}
                      {plan.features && plan.features.length > 3 && (
                        <li className="text-gray-400">+{plan.features.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}