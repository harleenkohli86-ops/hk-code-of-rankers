import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingButtons } from './components/FloatingButtons';
import { JoinMentorshipModal, BookCounsellingModal } from './components/Modals';
import { StudentSystemGuideModal } from './components/StudentSystemGuideModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { ThankYouModal } from './components/ThankYouModal';
import { SaveErrorBanner } from './components/SaveErrorBanner';

import { HomePage } from './pages/HomePage';
import { AboutHKPage, FounderPage, VisionMissionPage, WhyChoosePage } from './pages/AboutPages';
import { ProgramsPage, CSEETPage, CSExecutivePage, CSProfessionalPage, CareerCounsellingPage, TestSeriesPage } from './pages/CoursePages';
import { ResultsPage, TestimonialsPage, FreeResourcesPage, BlogPage, FAQPage, ContactPage, LegalPages } from './pages/ResourcePages';
import { AdminPage } from './pages/AdminPage';
import { StudentPortalPage } from './pages/StudentPortalPage';

export default function App() {
  // URL <-> Page sync so /admin, /student-portal, /courses etc. work on
  // refresh, direct open, back/forward buttons and email links.
  const pageFromUrl = (): PageId => {
    const path = window.location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
    const map: Record<string, PageId> = {
      '/': 'home',
      '/home': 'home',
      '/about-hk': 'about-hk',
      '/about': 'about-hk',
      '/founder': 'founder',
      '/vision-mission': 'vision-mission',
      '/vision': 'vision-mission',
      '/why-choose': 'why-choose',
      '/why-choose-hk': 'why-choose',
      '/programs': 'programs',
      '/courses': 'programs',
      '/cseet': 'cseet',
      '/cs-executive': 'cs-executive',
      '/executive': 'cs-executive',
      '/cs-professional': 'cs-professional',
      '/professional': 'cs-professional',
      '/career-counselling': 'career-counselling',
      '/counselling': 'career-counselling',
      '/test-series': 'test-series',
      '/results': 'results',
      '/testimonials': 'testimonials',
      '/resources': 'resources',
      '/blog': 'blog',
      '/faq': 'faq',
      '/forum': 'forum',
      '/contact': 'contact',
      '/privacy': 'privacy',
      '/terms': 'terms',
      '/admin': 'admin',
      '/student-portal': 'student-portal',
      '/portal': 'student-portal',
    };
    return map[path] || 'home';
  };

  const pathForPage = (page: PageId): string => {
    const map: Record<PageId, string> = {
      home: '/',
      'about-hk': '/about-hk',
      founder: '/founder',
      'vision-mission': '/vision-mission',
      'why-choose': '/why-choose',
      programs: '/programs',
      cseet: '/cseet',
      'cs-executive': '/cs-executive',
      'cs-professional': '/cs-professional',
      'career-counselling': '/career-counselling',
      'test-series': '/test-series',
      results: '/results',
      testimonials: '/testimonials',
      resources: '/resources',
      blog: '/blog',
      faq: '/faq',
      contact: '/contact',
      privacy: '/privacy',
      terms: '/terms',
      forum: '/faq',
      admin: '/admin',
      'student-portal': '/student-portal',
    };
    return map[page] || '/';
  };

  const [currentPage, setCurrentPage] = useState<PageId>(() =>
    typeof window !== 'undefined' ? pageFromUrl() : 'home'
  );
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [counsellingModalOpen, setCounsellingModalOpen] = useState(false);
  const [systemGuideOpen, setSystemGuideOpen] = useState(false);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    // Keep the browser URL in sync (enables refresh + back/forward + /admin links)
    try {
      const url = pathForPage(page) + window.location.search + window.location.hash;
      window.history.pushState({ page }, '', url);
    } catch {
      // ignore (non-browser / sandboxed env)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const onPopState = () => setCurrentPage(pageFromUrl());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPortalPath =
    typeof window !== 'undefined' &&
    (window.location.pathname.toLowerCase().includes('student-portal') ||
      window.location.pathname.toLowerCase() === '/portal');
  const isAdminRoute = currentPage === 'admin' || currentPage === 'student-portal' || isPortalPath;

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#1C1917] font-poppins flex flex-col selection:bg-[#C8A45D] selection:text-black">
      {/* Sticky Luxury Navbar — hidden inside Admin portal (it has its own header) */}
      {!isAdminRoute && (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenJoinModal={() => setJoinModalOpen(true)}
          onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          onOpenSystemGuide={() => setSystemGuideOpen(true)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'about-hk' && (
          <AboutHKPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'founder' && (
          <FounderPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'vision-mission' && (
          <VisionMissionPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'why-choose' && (
          <WhyChoosePage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'programs' && (
          <ProgramsPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'cseet' && (
          <CSEETPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'cs-executive' && (
          <CSExecutivePage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'cs-professional' && (
          <CSProfessionalPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'career-counselling' && (
          <CareerCounsellingPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'test-series' && (
          <TestSeriesPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'results' && (
          <ResultsPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'testimonials' && (
          <TestimonialsPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'resources' && (
          <FreeResourcesPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'blog' && (
          <BlogPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'faq' && (
          <FAQPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {(currentPage === 'privacy' || currentPage === 'terms') && (
          <LegalPages type={currentPage} />
        )}

        {/* FAQ and Help Desk */}
        {currentPage === 'forum' && (
          <FAQPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}

        {/* Master Admin Portal */}
        {currentPage === 'admin' && (
          <AdminPage onNavigate={handleNavigate} />
        )}

        {/* Student Learning Portal */}
        {currentPage === 'student-portal' && (
          <StudentPortalPage
            onNavigate={handleNavigate}
            onOpenJoinModal={() => setJoinModalOpen(true)}
            onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          />
        )}
      </main>

      {/* Floating Action Buttons — hidden inside Admin portal */}
      {!isAdminRoute && (
        <FloatingButtons
          currentPage={currentPage}
          onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
          onOpenJoinModal={() => setJoinModalOpen(true)}
        />
      )}

      {/* Footer — hidden inside Admin portal */}
      {!isAdminRoute && (
        <Footer
          onNavigate={handleNavigate}
          onOpenCounsellingModal={() => setCounsellingModalOpen(true)}
        />
      )}

      {/* Modals */}
      <JoinMentorshipModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />

      <BookCounsellingModal
        isOpen={counsellingModalOpen}
        onClose={() => setCounsellingModalOpen(false)}
      />

      <StudentSystemGuideModal
        isOpen={systemGuideOpen}
        onClose={() => setSystemGuideOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Cart, Checkout & Auth Modals */}
      <CartDrawer />
      <CheckoutModal />
      <AuthModal onNavigate={handleNavigate} />
      <ThankYouModal onNavigate={handleNavigate} />
      <SaveErrorBanner />
    </div>
  );
}
