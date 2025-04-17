export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black/40 backdrop-blur-md border-t border-purple-500/20 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">3D</span>
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                2D to 3D Converter
              </span>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">&copy; {currentYear} Steven Barsam. All rights reserved.</p>
            <p className="text-gray-500 text-xs mt-1">Transforming 2D images into 3D models for games and printing</p>
          </div>
        </div>

        {/* <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-purple-300 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-purple-300 mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-purple-300 mb-3">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div> */}
      </div>
    </footer>
  )
}
