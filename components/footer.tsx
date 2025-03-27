import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#042859] text-white px-6">
      <div className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="text-xl font-bold">
                <span className="text-white">ALL</span>
                <span className="text-secondary-red">J</span>
                <span className="text-secondary-green">O</span>
                <span className="text-secondary-yellow">B</span>
                <span className="text-white">S</span>
                <span className="text-white">G</span>
                <span className="text-white">H</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm">Connecting job seekers, employers, and freelancers in one place.</p>
            <div className="flex space-x-4 mt-4">
              <a href="https://x.com/alljobsgh" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
               <img src="/twitter.png" alt="X" className="w-6 h-6" />
              </a>
              <a href="https://www.facebook.com/share/1FCuECskjp/?mibextid=wwXIfr" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <Facebook size={20} />
              </a>
              <a href="https://www.youtube.com/@Alljobsgh" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <Youtube size={20} />
              </a>
              <a href="https://www.instagram.com/alljobsgh/" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/developers" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Developers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} ALLJOBSGH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}