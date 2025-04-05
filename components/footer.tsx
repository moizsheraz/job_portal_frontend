import Link from "next/link"
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react"
import { SiTiktok } from "react-icons/si"


export default function Footer() {
  return (
    <footer className="bg-[#042859] text-white px-6">
      <div className="container-custom py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo + Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-extrabold tracking-wide">
                <span className="text-white">ALL</span>
                <span className="text-secondary-red">J</span>
                <span className="text-secondary-green">O</span>
                <span className="text-secondary-yellow">B</span>
                <span className="text-white">S</span>
                <span className="text-white">G</span>
                <span className="text-white">H</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-2">
              Connecting job seekers, employers, and freelancers in one place.
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Product of Brightway Group of Companies Global
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://wa.me/233551992919" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href="https://www.tiktok.com/@alljobsgh" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
  <SiTiktok size={20} />
</a>
              <a href="https://x.com/alljobsgh" target="_blank" rel="noopener noreferrer">
                <img src="/twitter.png" alt="X" className="w-5 h-5 hover:opacity-80 transition" />
              </a>
              <a href="https://www.facebook.com/share/1FCuECskjp/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                <Facebook size={20} />
              </a>
              <a href="https://www.youtube.com/@Alljobsgh" target="_blank" rel="noopener noreferrer">
                <Youtube size={20} />
              </a>
              <a href="https://www.instagram.com/alljobsgh/" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="hover:underline hover:text-white">About Us</Link></li>
              <li><Link href="/press" className="hover:underline hover:text-white">Press</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/help" className="hover:underline hover:text-white">Help Center</Link></li>
              <li><Link href="/guides" className="hover:underline hover:text-white">Guides</Link></li>
              <li><Link href="/events" className="hover:underline hover:text-white">Events</Link></li>
              <li><Link href="/developers" className="hover:underline hover:text-white">Developers</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/privacy" className="hover:underline hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline hover:text-white">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:underline hover:text-white">Cookie Policy</Link></li>
              <li><Link href="/security" className="hover:underline hover:text-white">Security</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ALLJOBSGH. All rights reserved.
          </p>
          <form className="flex items-center gap-3">
            <input
              type="email"
              placeholder="Subscribe to updates"
              className="px-3 py-2 rounded-md text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-secondary-yellow"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-md bg-secondary-yellow text-black hover:bg-yellow-400 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  )
}
