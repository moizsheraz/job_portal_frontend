"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function LegalPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#00214D] to-white py-16 px-6 sm:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto text-white">
          <h1 className="text-4xl font-bold text-center mb-12">Legal & Policies</h1>

          <section id="privacy-policy" className="bg-white text-[#00214D] rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
            <p className="text-gray-700">
              We value your privacy. Your personal information is kept secure and is never shared without your consent. We collect data only to improve our services and enhance user experience.
            </p>
          </section>

          <section id="terms-of-service" className="bg-white text-[#00214D] rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
            <p className="text-gray-700">
              By using our platform, you agree to our terms. You are responsible for maintaining the confidentiality of your account. Misuse or violation of terms can result in suspension or termination.
            </p>
          </section>

          <section id="cookie-policy" className="bg-white text-[#00214D] rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Cookie Policy</h2>
            <p className="text-gray-700">
              Our website uses cookies to understand how users interact with our content. Cookies help us personalize content and analyze traffic. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section id="security" className="bg-white text-[#00214D] rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Security</h2>
            <p className="text-gray-700">
              We implement top-grade security practices to protect your data. This includes encryption, secure authentication, and regular audits. We're committed to ensuring your information stays protected.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}