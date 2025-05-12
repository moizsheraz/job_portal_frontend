"use client"

import { useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function LegalPage() {
  const privacyRef = useRef<HTMLDivElement>(null)
  const rulesRef = useRef<HTMLDivElement>(null)
  const transparencyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1))
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }, [])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#00214D] to-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-10 space-y-12">
          <h1 className="text-3xl font-bold text-[#00214D] text-center">Terms and Conditions</h1>
          
          <div className="space-y-8">
            {/* Navigation */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <a 
                href="#privacy-policy" 
                className="px-4 py-2 bg-[#00214D] text-white rounded-full hover:bg-[#042859] transition"
              >
                Privacy Policy
              </a>
              <a 
                href="#our-rules" 
                className="px-4 py-2 bg-[#00214D] text-white rounded-full hover:bg-[#042859] transition"
              >
                Our Rules
              </a>
              <a 
                href="#transparency" 
                className="px-4 py-2 bg-[#00214D] text-white rounded-full hover:bg-[#042859] transition"
              >
                Transparency
              </a>
            </div>

            {/* Privacy Policy */}
            <div id="privacy-policy" ref={privacyRef} className="space-y-4">
              <h2 className="text-2xl font-bold text-[#00214D]">PRIVACY POLICY</h2>
              <p className="text-gray-500">Last Updated: 05/30/2025</p>
              <p className="text-gray-700">
                At Brightway Educational Consult & HR Ltd.- ALLJOBSGH, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you visit our website and use our services.
              </p>
              
              <h3 className="text-xl font-semibold text-[#00214D] mt-6">1. Information We Collect</h3>
              <p className="text-gray-700">
                We may collect information from you when you interact with our site, including:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Personal identification information (name, email address, phone number, etc.)</li>
                <li>Non-personal identification information (browser type, ISP, referring/exit pages, date/time stamps)</li>
                <li>Usage data (information about how you use our website and services)</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#00214D] mt-6">2. How We Use Your Information</h3>
              <p className="text-gray-700">
                We may use the information we collect for various purposes, including to:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Provide and maintain our services</li>
                <li>Improve, customize, and expand our website and services</li>
                <li>Communicate with you, either directly or through one of our partners</li>
                <li>Process your transactions and send you related information</li>
                <li>Send emails about your account or other products and services</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#00214D] mt-6">3. Sharing Your Information</h3>
              <p className="text-gray-700">
                We do not sell your personal information to third parties. We may share your information in the following situations:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>With service providers who assist us in providing our services.</li>
                <li>To comply with legal obligations.</li>
                <li>To protect and defend our rights and property.</li>
                <li>In connection with a merger, sale, or acquisition of all or a portion of our assets.</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#00214D] mt-6">4. Data Security</h3>
              <p className="text-gray-700">
                We take reasonable measures to protect your personal information from loss, theft, and misuse. However, no method of transmission over the internet or method of electronic storage is 100% secure, so we cannot guarantee its absolute security.
              </p>

              <h3 className="text-xl font-semibold text-[#00214D] mt-6">5. Your Rights</h3>
              <p className="text-gray-700">
                You have the right to:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Access the personal information we hold about you.</li>
                <li>Request the correction of inaccurate or incomplete information.</li>
                <li>Request the deletion of your personal data, subject to certain exceptions.</li>
                <li>Object to or restrict the processing of your data.</li>
                <li>You agree to report any issues/conflicts in relation to ALLJOBSGH to us for internal arbitration and resolution without taking legal action.</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#00214D] mt-6">6. Changes to This Privacy Policy</h3>
              <p className="text-gray-700">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
              </p>

              <h3 className="text-xl font-semibold text-[#00214D] mt-6">7. Communications between Employers, Job Seekers, Freelancers, and Consumers</h3>
              <p className="text-gray-700">
                To protect the privacy of our valued customers and users, Brightway Educational Consult & HR Ltd. - Alljobsgh provides AI tools that enable all forms of communications regarding services provided to take place on alljobsgh.com and the Alljobsgh App. Brightway Educational Consult & HR Ltd.- Alljobsgh will not accept legal liability regarding agreements between our users or interactions amongst our users. Furthermore, users of the Alljobsgh website and App exercise complete discretion while interacting with other users on the Alljobsgh website and App for their own security and interests. Brightway Educational Consult & HR Ltd. – Alljobsgh will not be legally liable for any issues concerning any business or interactions on alljobsgh.com and the alljobsgh App. Therefore, users agree to take full responsibility for problems encountered using alljobsgh.com and the alljobsgh App.
              </p>

              <h3 className="text-xl font-semibold text-[#00214D] mt-6">8. Our Services Guarantees</h3>
              <p className="text-gray-700">
                The only function of the Alljobsgh website and app is to connect talented professionals with innovative companies, organizations, and freelance users to create the perfect match by activating AI tools to streamline the hiring process while helping users find the right Freelance services for their needs. Under no circumstances does Brightway Educational Consult & HR Ltd. – Alljobsgh guarantee employment for job seekers and freelancers. Hiring is at the sole discretion of employers and users seeking Freelance services.
              </p>

              <h3 className="text-xl font-semibold text-[#00214D] mt-6">9. Contact Us</h3>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at:
                <br /><br />
                The Brightway Educational & HR Consult - Alljobsgh 
                <br />
                P. O. Box 583 Mamprobi, Accra Ghana W/A.
                <br />
                info@alljobsgh.com
                <br /><br />
                Thank you for trusting Brightway Educational & HR Consult - Alljobsgh with your information. Your privacy is important to us.
              </p>
            </div>

            {/* Our Rules */}
            <div id="our-rules" ref={rulesRef} className="space-y-4 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-[#00214D]">OUR RULES</h2>
              <p className="text-gray-700">
                To ensure satisfaction with ALLJOBSGH services, job posters must comply with our Job Posting Rules, representing employment opportunities, and during the application process. Similarly, Freelancers must not misrepresent their profiles, experiences, and work. Furthermore, job seekers and users of Freelance services must maintain professionalism and truthfulness when communicating and dealing with employers and Freelancers. If these Rules are violated, we may either remove or decrease the visibility of a job advertisement, Job Posting, or suspend or terminate the job poster's account without refunding any fees or subscriptions paid.
              </p>

              <h3 className="text-xl font-semibold text-[#00214D] mt-6">Our Don'ts</h3>
              <p className="text-gray-700">
                ALLJOBSGH is an all-in-one platform connecting talented professionals with innovative companies and Freelancers to create the perfect match through Job Postings for legally paid jobs and should not be used to post:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Political campaigns and political opinions.</li>
                <li>Illegal work or solicitations.</li>
                <li>Multi-level marketing opportunities.</li>
                <li>Unpaid internships or other unpaid positions.</li>
                <li>Any setup that does not qualify as employment.</li>
                <li>Casting calls and auditions for modeling, acting, or talent management services.</li>
                <li>Survey collections, opinion participants, focus groups, etc.</li>
                <li>Franchise and business opportunities.</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#00214D] mt-6">Other Important Rules</h3>
              <p className="text-gray-700">
                It is very important to adhere strictly to the following requirements for each Job Posting/Freelance posting on ALLJOBSGH:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Job seekers must not be required to pay to apply for jobs, as they can register or create an account for free to view the job description and apply for them. On the other hand, freelancers must pay to create a profile to attract clients.</li>
                <li>Job posters should not impose any fees directly on job seekers.</li>
                <li>Job postings/Freelance postings must not contain or link to illegal, offensive, obscene, threatening, exploitative, violent, or otherwise inappropriate content.</li>
                <li>Personal information should never be included in the job description or submission instructions.</li>
                <li>Job posters must refrain from advertising products or services.</li>
                <li>Freelancers must refrain from advertising products and services outside of the description on their profiles.</li>
                <li>All job titles and descriptions should avoid irrelevant keywords.</li>
                <li>Job seekers should not be asked to submit photos or videos as part of their application.</li>
                <li>Job posters/Freelancers must verify that the relevant trademark or copyright owner authorizes the posting of all job content on ALLJOBSGH. ALLJOBSGH and its parent companies will not be responsible for any trademark or copyright infringements.</li>
                <li>Freelance users, employers, and job seekers must beware of fraudsters and scammers seeking to defraud users of the ALLJOBSGH platform and exercise complete discretion. ALLJOBSGH and its parent companies will not be responsible for any issues regarding any interactions or transactions amongst users of the ALLJOBSGH platform.</li>
              </ul>
            </div>

            {/* Transparency and Responsibilities */}
            <div id="transparency" ref={transparencyRef} className="space-y-4 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-[#00214D]">TRANSPARENCY AND RESPONSIBILITIES</h2>
              
              <h3 className="text-xl font-semibold text-[#00214D] mt-6">Transparency Required</h3>
              <p className="text-gray-700">
                We anticipate job posters on our platform providing clear and precise information in their advertisements and throughout the candidate onboarding process. This includes, but is not limited to, ensuring that:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>All aspects of job content and communication with candidates represent the available opportunity.</li>
                <li>Each job posting signifies a genuine and up-to-date job opening.</li>
                <li>Job content employs standard industry terminology so qualified candidates and users can fully understand the job descriptions, qualifications, and compensation associated with the opportunity.</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#00214D] mt-6">Job Posters and Freelancers' Responsibilities</h3>
              <p className="text-gray-700">
                The job posters and freelancers must ensure that the content of their Job Postings and profiles adheres to applicable laws. Users must take steps to ensure that all Job Postings:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Comply with local and state international laws, including but not limited to anti-discrimination, labor and employment, equal employment opportunity, employment eligibility requirements, posting salary ranges, data privacy, data access and use, defamation, consumer protection, and intellectual property law, as well as laws that mandate Job Postings appear in languages other than English or other languages.</li>
                <li>Do not include any job requirements or criteria that discriminate based on race, sex (including gender identity, sexual orientation, and pregnancy), age, physical or mental disability, religion, national origin, citizenship, military or veteran status, genetic information, or any other characteristic protected by applicable law.</li>
                <li>Do not bar applications consideration from individuals with criminal convictions or records unless such a criterion is a legally permissible job requirement or mandated by law.</li>
                <li>Do not mandate citizenship from a specific country or lawful permanent residency as a condition of employment unless required to comply with applicable laws, legal orders, or government contracts.</li>
                <li>Do not feature any screening requirements that are not actual, legitimate, and lawful job requirements.</li>
                <li>Do not include content or links that exploit individuals in a sexual, violent, or other harmful manner or solicit personal information from anyone under 18 years of age.</li>
                <li>Do not list any roles based in countries subject to sanctions imposed by the U.S. or your country of operation.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}