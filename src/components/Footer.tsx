import React, { useState } from 'react';
import { HKLogo } from './HKLogo';
import { PageId } from '../types';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  Heart,
  CheckCircle,
  Shield,
  GraduationCap,
} from 'lucide-react';
import { saveEnrollment } from '../lib/backend';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenCounsellingModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCounsellingModal }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      const res = await saveEnrollment({
        name: 'Newsletter Subscriber',
        email: newsletterEmail,
        phone: 'N/A',
        program: 'Newsletter Subscription (ICSI Amendments & Strategy Alerts)',
        productId: 'newsletter-subscriber',
      });
      if (!res.success) {
        alert(res.message || 'Subscription could not be completed. Please try again.');
        return;
      }
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#EFECE6] border-t border-[#C8A45D]/40 pt-16 pb-8 text-[#2D2D2D] relative overflow-hidden font-poppins">
      {/* Decorative Gold Accent Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C8A45D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C8A45D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#C8A45D]/30">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <HKLogo size="lg" />
            <p className="text-xs text-[#333333] leading-relaxed max-w-sm mt-3">
              HK Code of Rankers is an elite mentorship platform for Company Secretary (CS) aspirants. We deliver exclusive 25-seat batch personal guidance, evaluated ICSI-pattern test series, and strategic exam readiness.
            </p>
            <div className="p-3.5 bg-white border-l-4 border-[#C8A45D] border border-[#C8A45D]/30 rounded-sm text-xs text-[#1C1917] italic shadow-sm">
              "To walk with every CS aspirant through every phase of their preparation—from anxiety to confidence."
              <span className="block text-right text-[11px] text-[#8A651E] font-bold mt-1 not-italic font-cinzel tracking-wider">
                — Harkiran Kaur Kohli (AIR 3 • CS Professional), Founder
              </span>
            </div>

            {/* Social Channels */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-montserrat font-bold text-[#8A651E] uppercase tracking-wider block">
                Connect With Us:
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/code.of.rankers?igsi=N3lobHJkc3pvN3Nr"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white border border-gray-300 hover:border-[#C8A45D] hover:text-pink-600 text-gray-700 flex items-center justify-center transition-all shadow-sm hover:scale-105"
                  aria-label="Instagram @code.of.rankers"
                  title="Follow on Instagram (@code.of.rankers)"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/hk-code-of-rankers/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white border border-gray-300 hover:border-[#C8A45D] hover:text-blue-700 text-gray-700 flex items-center justify-center transition-all shadow-sm hover:scale-105"
                  aria-label="LinkedIn HK Code of Rankers"
                  title="Connect on LinkedIn (HK Code of Rankers)"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/919284084523"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white border border-gray-300 hover:border-emerald-600 hover:text-emerald-700 text-gray-700 flex items-center justify-center transition-all shadow-sm hover:scale-105"
                  aria-label="WhatsApp Mentorship Desk"
                  title="Chat on WhatsApp (+91 92840 84523)"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-cinzel font-bold uppercase tracking-wider text-[#8A651E]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#8A651E] transition-colors cursor-pointer text-[#333333]">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about-hk')} className="hover:text-[#8A651E] transition-colors cursor-pointer text-[#333333]">
                  About HK Platform
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('founder')} className="hover:text-[#8A651E] transition-colors cursor-pointer text-[#333333]">
                  Founder Harkiran Kaur
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vision-mission')} className="hover:text-[#8A651E] transition-colors cursor-pointer text-[#333333]">
                  Our Vision & Mission
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('why-choose')} className="hover:text-[#8A651E] transition-colors cursor-pointer text-[#333333]">
                  Why Choose HK
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#8A651E] transition-colors cursor-pointer text-[#333333]">
                  FAQs & Help Desk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#8A651E] transition-colors cursor-pointer text-[#333333]">
                  1-on-1 Guidance Desk
                </button>
              </li>
              <li className="pt-1.5 border-t border-gray-200/70">
                <button
                  onClick={() => onNavigate('student-portal')}
                  className="hover:text-[#8A651E] transition-colors cursor-pointer text-[#8A651E] font-semibold flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>Student Portal (My Courses & Invoices)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-[#8A651E] transition-colors cursor-pointer text-gray-600 hover:text-[#8A651E] flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-gray-500" />
                  <span>Admin Portal (Faculty / Director)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Programs Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-cinzel font-bold uppercase tracking-wider text-[#8A651E]">
              Programs & Apps
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('programs')} className="hover:text-[#8A651E] transition-colors cursor-pointer font-semibold text-[#1C1917]">
                  All Mentorship Programs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cseet')} className="hover:text-[#8A651E] transition-colors cursor-pointer text-[#333333]">
                  CSEET Mentorship
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cs-executive')} className="hover:text-[#8A651E] transition-colors cursor-pointer text-[#333333]">
                  CS Executive (Module 1 & 2)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cs-professional')} className="hover:text-[#8A651E] transition-colors cursor-pointer text-[#333333]">
                  CS Professional Mentorship
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('test-series')} className="hover:text-[#8A651E] transition-colors cursor-pointer text-[#333333] flex items-center gap-1.5">
                  <span>Test Series (All 3 Levels)</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/15 text-emerald-800 rounded font-bold">Active</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('test-series')} className="hover:text-[#8A651E] transition-colors cursor-pointer text-[#333333]">
                  Answersheet Analysis Report
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="text-[#8A651E] hover:underline cursor-pointer flex items-center gap-1 font-bold mt-1">
                  ❓ FAQs & Help Desk
                </button>
              </li>
              <li>
                <button onClick={onOpenCounsellingModal} className="text-[#1C1917] hover:text-[#8A651E] cursor-pointer flex items-center gap-1 font-semibold">
                  📞 1-on-1 Free Demo Call
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-cinzel font-bold uppercase tracking-wider text-[#8A651E]">
              Get In Touch
            </h4>
            <div className="space-y-2 text-xs text-[#333333]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8A651E] shrink-0 mt-0.5" />
                <span>HK Code of Rankers Hub, Nashik, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8A651E] shrink-0" />
                <a href="tel:+919284084523" className="hover:text-[#8A651E]">+91 92840 84523</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8A651E] shrink-0" />
                <a href="mailto:support.hkcodeofrankers@gmail.com" className="hover:text-[#8A651E]">support.hkcodeofrankers@gmail.com</a>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[11px] text-gray-700 mb-2 font-medium">Subscribe to ICSI Amendment Alerts & Exam Strategies:</p>
              <form onSubmit={handleNewsletter} className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="bg-white border border-gray-300 focus:border-[#C8A45D] text-xs text-[#0F0F0F] px-3 py-2 rounded-lg w-full focus:outline-none shadow-sm"
                />
                <button
                  type="submit"
                  className="bg-[#C8A45D] text-black hover:bg-[#FFE3A0] p-2 rounded-lg font-bold transition-colors cursor-pointer shadow-sm"
                  title="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1.5 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Subscribed successfully!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sleek Interface Bottom Bar with Live Status Indicators */}
        <div className="pt-8 pb-4 border-t border-[#C8A45D]/20 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#333333] tracking-wider">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#C8A45D]/40 rounded-sm text-[10px] text-[#8A651E] font-bold uppercase tracking-widest shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>DEC 2026 1ST BATCH ADMISSIONS OPEN (LIMITED SEATS)</span>
            </div>
            <p>© {new Date().getFullYear()} HK Code of Rankers. All Rights Reserved.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button onClick={() => onNavigate('resources')} className="hover:text-[#8A651E] transition-colors">
              Resources
            </button>
            <button onClick={() => onNavigate('blog')} className="hover:text-[#8A651E] transition-colors">
              Blog
            </button>
            <button onClick={() => onNavigate('faq')} className="hover:text-[#8A651E] transition-colors">
              FAQ
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-[#8A651E] transition-colors">
              Contact
            </button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-[#8A651E] transition-colors">
              Privacy
            </button>
            <button onClick={() => onNavigate('terms')} className="hover:text-[#8A651E] transition-colors">
              Terms
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => onNavigate('admin')}
              className="hover:text-[#8A651E] transition-colors text-[#8A651E] font-bold flex items-center gap-1"
            >
              <Shield className="w-3 h-3 text-[#C8A45D]" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
