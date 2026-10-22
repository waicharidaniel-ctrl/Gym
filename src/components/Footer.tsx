import { Dumbbell, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">IRON<span className="text-primary-500">CORE</span></span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Premium gym facility dedicated to transforming lives through fitness, nutrition, and community.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 bg-neutral-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-9 h-9 bg-neutral-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-9 h-9 bg-neutral-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('membership')} className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">Membership Plans</button></li>
              <li><button onClick={() => onNavigate('supplements')} className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">Supplements</button></li>
              <li><button onClick={() => onNavigate('programs')} className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">Fitness Programs</button></li>
              <li><button onClick={() => onNavigate('progress')} className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">Progress Tracker</button></li>
              <li><button onClick={() => onNavigate('revenue')} className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">Revenue Dashboard</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-neutral-400">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <span>123 Fitness Avenue, Westlands, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-neutral-400">
                <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>+254 712 345 678</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-neutral-400">
                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>info@ironcoregym.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Hours</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li className="flex justify-between"><span>Mon - Fri</span><span>5:00 AM - 11:00 PM</span></li>
              <li className="flex justify-between"><span>Saturday</span><span>6:00 AM - 9:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday</span><span>8:00 AM - 6:00 PM</span></li>
              <li className="flex justify-between"><span>Holidays</span><span>9:00 AM - 2:00 PM</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800/50 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500">© 2026 IronCore Gym. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-neutral-500">
            <a href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
