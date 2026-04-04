import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.svg';

/**
 * Footer Component - Professional SaaS-grade footer
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Features', href: '/#features' },
        { name: 'Get Started', href: '/upload' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' }
      ]
    }
  ];

  return (
    <footer className="relative z-10 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/5 pt-16 pb-8 transition-colors duration-1000 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <img src={logo} alt="Logo" className="w-8 h-8 group-hover:rotate-[-10deg] transition-transform duration-500" />
              </div>
              <span className="text-slate-900 dark:text-white font-black text-2xl tracking-tighter italic uppercase">
                Resume<span className="text-blue-600">Sphere</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm font-medium leading-relaxed italic border-l-2 border-blue-500/30 pl-4">
              ResumeSphere helps students, freshers, and early job seekers analyze resume fit, identify missing skills, and improve job readiness.
            </p>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h4 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => {
                  const isAnchor = link.href.includes('#');

                  return (
                    <li key={link.name}>
                      {isAnchor ? (
                        <a 
                          href={link.href}
                          onClick={(e) => {
                            if (window.location.pathname === '/') {
                              e.preventDefault();
                              const id = link.href.split('#')[1];
                              const element = document.getElementById(id);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                                // Update URL hash without jumping
                                window.history.pushState(null, '', link.href);
                              }
                            }
                          }}
                          className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-black uppercase tracking-widest transition-all hover:translate-x-1 inline-block"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link 
                          to={link.href} 
                          className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-black uppercase tracking-widest transition-all hover:translate-x-1 inline-block"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
            © {currentYear} ResumeSphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

