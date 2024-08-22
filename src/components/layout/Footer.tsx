"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Footer() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const footerRef = useRef(null);
  const isInView = useInView(footerRef);

  return (
    <motion.footer
      ref={footerRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="w-full py-8 bg-[#f1f6f4]"
    >
      <div className="max-w-[1070px] w-full text-left py-5 mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-32 mb-8 md:mb-16 pl-4 md:pl-16">
          <motion.div variants={fadeInUp}>
            <h3 className="text-lg font-semibold text-[#032b41] mb-4">Actions</h3>
            <ul>
              <li className="mb-3">
                <a href="/" className="text-sm text-[#394547]">
                  Home
                </a>
              </li>
              <li className="mb-3">
                <a href="/settings" className="text-sm text-[#394547]">
                  Cancel Subscription
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-sm text-[#394547]">
                  Help
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#394547]">
                  Contact us
                </a>
              </li>
            </ul>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <h3 className="text-lg font-semibold text-[#032b41] mb-4">Useful Links</h3>
            <ul>
              <li className="mb-3">
                <a href="#" className="text-sm text-[#394547]">
                  Pricing
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-sm text-[#394547]">
                  Summarist Business
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-sm text-[#394547]">
                  Gift Cards
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#394547]">
                  Authors & Publishers
                </a>
              </li>
            </ul>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <h3 className="text-lg font-semibold text-[#032b41] mb-4">Company</h3>
            <ul>
              <li className="mb-3">
                <a href="#" className="text-sm text-[#394547]">
                  About
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-sm text-[#394547]">
                  Careers
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-sm text-[#394547]">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#394547]">
                  Code of Conduct
                </a>
              </li>
            </ul>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <h3 className="text-lg font-semibold text-[#032b41] mb-4">Other</h3>
            <ul>
              <li className="mb-3">
                <a href="#" className="text-sm text-[#394547]">
                  Sitemap
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-sm text-[#394547]">
                  Legal Notice
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-sm text-[#394547]">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#394547]">
                  Privacy Policies
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
        <motion.div variants={fadeInUp} className="text-center mt-4 md:mt-8">
          <p className="text-[#032b41] font-medium">
            Copyright &copy; 2023 Summarist.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
