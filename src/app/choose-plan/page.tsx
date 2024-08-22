"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { FaFile, FaHandshake } from "react-icons/fa";
import { RiPlantFill } from "react-icons/ri";
import LoginButton from "@/components/auth/LoginButton";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Add your animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

interface Plan {
  id: number;
  name: string;
  description: string;
  price: string;
}

interface PlanProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: () => void;
}

const Plan: React.FC<PlanProps> = ({ plan, isSelected, onSelect }) => (
  <motion.div
    variants={fadeInUp}
    className={`relative border p-6 rounded-[5px] mb-6 ${
      isSelected ? "border-green-1 bg-green-1 bg-opacity-10" : "border-gray-300"
    }`}
  >
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-6 h-6 border-2 rounded-full mr-4 flex items-center justify-center cursor-pointer ${
          isSelected ? "border-green-1" : "border-gray-300"
        }`}
        onClick={onSelect}
      >
        {isSelected && <div className="w-3 h-3 bg-green-1 rounded-full"></div>}
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-blue-1">{plan.name}</h3>
        <span className="text-2xl font-bold text-blue-1">${plan.price}</span>
      </div>
    </div>
    <p className="text-gray-600">{plan.description}</p>
  </motion.div>
);

const Plans: React.FC<{
  selectedPlan: number;
  setSelectedPlan: (id: number) => void;
}> = ({ selectedPlan, setSelectedPlan }) => {
  const plans: Plan[] = [
    {
      id: 1,
      name: "Premium Plus Yearly",
      description: "7-day free trial included.",
      price: "99.99/year",
    },
    {
      id: 2,
      name: "Premium Monthly",
      description: "No trial included.",
      price: "9.99/month",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {plans.map((plan, index) => (
        <React.Fragment key={plan.id}>
          <Plan
            plan={plan}
            isSelected={selectedPlan === plan.id}
            onSelect={() => setSelectedPlan(plan.id)}
          />
          {index === 0 && (
            <div className="flex items-center justify-center mx-auto my-6">
              <div className="w-1/4 border-t border-gray-300"></div>
              <div className="px-4 text-gray-300 text-sm">or</div>
              <div className="w-1/4 border-t border-gray-300"></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

interface AccordionItem {
  question: string;
  answer: string;
}

const Accordion: React.FC<{ items: AccordionItem[] }> = ({ items }) => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenAccordion((prevState) => (prevState === index ? null : index));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {items.map((item, index) => (
        <div key={index} className="mb-4 border-b border-gray-300">
          <button
            className="flex justify-between items-center w-full bg-white p-4 focus:outline-none"
            onClick={() => toggleAccordion(index)}
          >
            <span className="text-2xl font-bold text-blue-1">
              {item.question}
            </span>
            <div
              className={`transition-transform duration-300 ${
                openAccordion === index ? "rotate-180" : ""
              }`}
            >
              <ChevronDown />
            </div>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openAccordion === index
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-4">
              <p className="text-gray-700">{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ChoosePlan: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<number>(1);
  const [isButtonSticky, setIsButtonSticky] = useState(false);
  const plansSectionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const [plansRef, plansInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [accordionRef, accordionInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [footerRef, footerInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const handleScroll = () => {
      if (plansSectionRef.current && buttonRef.current) {
        const plansRect = plansSectionRef.current.getBoundingClientRect();
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (plansRect.bottom <= windowHeight) {
          setIsButtonSticky(false);
        } else {
          setIsButtonSticky(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const accordionData: AccordionItem[] = [
    {
      question: "How does the free 7-day trial work?",
      answer:
        "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
    },
    {
      question: "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
      answer:
        "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
    },
    {
      question: "What's included in the Premium plan?",
      answer:
        "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.",
    },
    {
      question: "Can I cancel during my trial or subscription?",
      answer:
        "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <motion.section
          ref={plansRef}
          initial="hidden"
          animate={plansInView ? "visible" : "hidden"}
          variants={stagger}
          className="relative bg-blue-1 text-white py-10 pb-32 rounded-b-[250px]"
        >
          <div className="container mx-auto px-4">
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
              <h1 className="text-4xl font-bold mb-4 md:text-5xl">
                Get Unlimited Access To Many Amazing Books To Read
              </h1>
              <p className="text-xl mb-8">
                Turn ordinary moments into amazing learning opportunities.
              </p>
              <div className="relative w-full flex justify-center mb-32">
                <div className="absolute w-full max-w-md mx-auto overflow-hidden scale-[60%] md:scale-75 rounded-t-[250px]">
                  <img
                    src="/assets/pricing-top.png"
                    alt="Pricing illustration"
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          ref={plansSectionRef}
          initial="hidden"
          animate={plansInView ? "visible" : "hidden"}
          variants={stagger}
          className="pt-10 pb-20 relative"
        >
          <div className="container mx-auto px-4 pb-32">
            <motion.div
              variants={fadeInUp}
              className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16 mb-12"
            >
              <div className="text-center max-w-xs">
                <FaFile className="mx-auto mb-4 text-blue-1 text-5xl" />
                <p className="text-md text-gray-1">
                  <span className="font-bold text-blue-1">Key ideas in few min</span>{" "}
                  with many books to read
                </p>
              </div>
              <div className="text-center max-w-xs">
                <RiPlantFill className="mx-auto mb-4 text-blue-1 text-6xl" />
                <p className="text-md text-gray-1">
                  <span className="font-bold text-blue-1">3 million</span>{" "}
                  people growing with Summarist everyday
                </p>
              </div>
              <div className="text-center max-w-xs">
                <FaHandshake className="mx-auto mb-4 text-blue-1 text-6xl" />
                <p className="text-md text-gray-1">
                  <span className="font-bold text-blue-1">Precise recommendations</span>{" "}
                  collections curated by experts
                </p>
              </div>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-center text-blue-1 mb-12">
              Choose The Plan That Fits You
            </motion.h2>
            <motion.div variants={fadeInUp}>
              <Plans selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />
            </motion.div>
          </div>
          <div
            ref={buttonRef}
            className={`bg-white text-center h-28 w-full flex flex-col items-center justify-center ${
              isButtonSticky ? "fixed bottom-0 left-0 right-0" : "absolute bottom-0 left-0 right-0"
            }`}
            style={{
              zIndex: 10,
            }}
          >
            <LoginButton>Start your free 7-day trial</LoginButton>
            <p className="mt-4 text-xs text-gray-2">
              Cancel your trial at any time before it ends, and you won't be charged.
            </p>
          </div>
        </motion.section>

        <motion.section
          ref={accordionRef}
          initial="hidden"
          animate={accordionInView ? "visible" : "hidden"}
          variants={stagger}
          className="py-20"
        >
          <div className="container mx-auto px-4">
            <Accordion items={accordionData} />
          </div>
        </motion.section>
      </main>

      <motion.footer
        ref={footerRef}
        initial="hidden"
        animate={footerInView ? "visible" : "hidden"}
        variants={stagger}
        className="bg-[#f1f6f4] w-full py-10"
      >
        <div className="max-w-[1070px] w-full text-left py-5 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-32 mb-16 pl-16">
            <motion.div variants={fadeInUp}>
              <h3 className="text-lg font-semibold text-[#032b41] mb-4">
                Actions
              </h3>
              <ul>
                <li className="mb-3">
                  <a href="#" className="text-sm text-[#394547]">
                    Summarist Magazine
                  </a>
                </li>
                <li className="mb-3">
                  <a href="#" className="text-sm text-[#394547]">
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
              <h3 className="text-lg font-semibold text-[#032b41] mb-4">
                Useful Links
              </h3>
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
              <h3 className="text-lg font-semibold text-[#032b41] mb-4">
                Company
              </h3>
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
              <h3 className="text-lg font-semibold text-[#032b41] mb-4">
                Other
              </h3>
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
          <motion.div variants={fadeInUp} className="text-center mt-8">
            <p className="text-[#032b41] font-medium">
              Copyright &copy; 2023 Summarist.
            </p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default ChoosePlan;
