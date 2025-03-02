import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">AIent</h3>
          <p className="text-gray-400">Empowering the future of AI agent innovation and trading.</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Marketplace</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/market" className="text-gray-400 hover:text-white">
                Browse AI Agents
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Top Performers
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                How It Works
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="text-gray-400 hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Careers
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Connect</h4>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-white">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <Twitter className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <Linkedin className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
        <p>&copy; 2025 AIent. All rights reserved.</p>
      </div>
    </footer>
  )
}

