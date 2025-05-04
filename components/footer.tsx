import Link from "next/link"
import { Facebook, Instagram, Youtube } from "lucide-react"
import { SiTiktok } from "react-icons/si"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"

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
              <TooltipProvider>
                {/* WhatsApp */}
                <Tooltip>
                  <TooltipTrigger asChild>
                  <a
  href="https://wa.me/233551992919"
  className="text-gray-400 hover:text-white transition-colors"
  target="_blank"
  rel="noopener noreferrer"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    viewBox="0 0 32 32"
  >
    <path d="M16.002 2.002c-7.732 0-14 6.27-14 14 0 2.482.676 4.904 1.957 7.029L2 30l7.181-1.91A13.924 13.924 0 0 0 16.002 30c7.732 0 14-6.27 14-14s-6.268-13.998-14-13.998zm0 2c6.627 0 12 5.373 12 12s-5.373 12-12 12c-2.199 0-4.331-.604-6.182-1.748l-.438-.26-4.381 1.165 1.172-4.257-.285-.445C5.07 20.007 4.002 17.053 4.002 16.002c0-6.627 5.373-12 12-12zm6.52 14.79c-.358-.179-2.113-1.043-2.442-1.162-.329-.12-.57-.179-.812.179-.24.358-.932 1.162-1.144 1.402-.21.24-.42.27-.777.09-.358-.18-1.51-.556-2.874-1.772-1.062-.95-1.777-2.12-1.985-2.478-.208-.358-.022-.55.157-.728.162-.162.358-.42.537-.63.179-.21.239-.358.358-.598.12-.24.06-.449-.03-.629-.09-.18-.812-1.956-1.11-2.678-.29-.696-.584-.6-.812-.61-.21-.008-.449-.01-.69-.01s-.63.09-.96.449c-.329.358-1.26 1.231-1.26 3.002s1.292 3.482 1.472 3.721c.179.24 2.54 3.884 6.157 5.452.86.37 1.53.592 2.05.757.86.274 1.64.236 2.26.143.69-.103 2.113-.862 2.41-1.693.298-.83.298-1.54.21-1.693-.089-.153-.329-.24-.688-.419z" />
  </svg>
</a>

                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-[#00214D] text-white">
                    <p>Chat with us on WhatsApp</p>
                  </TooltipContent>
                </Tooltip>

                {/* TikTok */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://www.tiktok.com/@alljobsgh" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                      <SiTiktok size={20} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-[#00214D] text-white">
                    <p>Follow us on TikTok</p>
                  </TooltipContent>
                </Tooltip>

                {/* Twitter/X */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://x.com/alljobsgh" target="_blank" rel="noopener noreferrer">
                      <img src="/twitter.png" alt="X" className="w-5 h-5 hover:opacity-80 transition" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-[#00214D] text-white">
                    <p>Follow us on X (Twitter)</p>
                  </TooltipContent>
                </Tooltip>

                {/* Facebook */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://www.facebook.com/share/1FCuECskjp/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                      <Facebook size={20} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-[#00214D] text-white">
                    <p>Like us on Facebook</p>
                  </TooltipContent>
                </Tooltip>

                {/* YouTube */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://www.youtube.com/@Alljobsgh" target="_blank" rel="noopener noreferrer">
                      <Youtube size={20} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-[#00214D] text-white">
                    <p>Subscribe on YouTube</p>
                  </TooltipContent>
                </Tooltip>

                {/* Instagram */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://www.instagram.com/alljobsgh/" target="_blank" rel="noopener noreferrer">
                      <Instagram size={20} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-[#00214D] text-white">
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="hover:underline hover:text-white">About Us</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/contact" className="hover:underline hover:text-white">Help Center</Link></li>
              <li><Link href={"/"}  className="hover:underline hover:text-white">Video Demo</Link></li>
              <li><Link href={"http://www.brightwaygroup.org"} className="hover:underline hover:text-white">Events</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 mt-10 text-sm text-gray-400 text-center">
          © {new Date().getFullYear()} AllJobsGH. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
