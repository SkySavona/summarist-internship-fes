"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { FaFile, FaHandshake } from "react-icons/fa";
import { RiPlantFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/services/firebaseConfig";
import { User } from "firebase/auth";
import { loadStripe } from "@stripe/stripe-js";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";
import AuthModal from "@/components/auth/AuthModal";
import Footer from "@/components/layout/Footer";
import { accordionData, AccordionItem } from "@/constants/accordion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

interface Plan {
  stripeProductId: any;
  id: number;
  name: string;
  description: string;
  price: string;
  stripePriceId: string;
}

interface PlanProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: () => void;
}

const Plan: React.FC<PlanProps> = ({ plan, isSelected, onSelect }) => (
  <motion.div
    variants={fadeInUp}
    className={`relative border p-6 md:p-8 rounded-[5px] mb-6 ${
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
        <h3 className="text-lg md:text-xl font-bold text-blue-1">
          {plan.name}
        </h3>
        <span className="text-xl md:text-2xl font-bold text-blue-1">
          ${plan.price}
        </span>
      </div>
    </div>
    <p className="text-gray-600">{plan.description}</p>
  </motion.div>
);

const Plans: React.FC<{
  plans: Plan[];
  selectedPlan: number;
  setSelectedPlan: (id: number) => void;
}> = ({ plans, selectedPlan, setSelectedPlan }) => {
  return (
    <div className="max-w-3xl mx-auto px-4">
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

const Accordion: React.FC<{ items: AccordionItem[] }> = ({ items }) => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenAccordion((prevState) => (prevState === index ? null : index));
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {items.map((item, index) => (
        <div key={index} className="mb-4 border-b border-gray-300">
          <button
            className="flex justify-between items-center w-full bg-white p-4 focus:outline-none"
            onClick={() => toggleAccordion(index)}
          >
            <span className="text-xl md:text-2xl font-bold text-blue-1 text-left">
              {item.question}
            </span>
            <div
              className={`transition-transform duration-500 ease-out ${
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const [plansRef, plansInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [accordionRef, accordionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [footerRef, footerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const plans: Plan[] = [
    {
      id: 1,
      name: "Premium Plus Yearly",
      description: "7-day free trial included.",
      price: "99.99/year",
      stripeProductId: "prod_Qh49vea9psPMhn",
      stripePriceId: "price_1Ppg1XRpLrmHfjrMuDkIbZGr",
    },
    {
      id: 2,
      name: "Premium Monthly",
      description: "No trial included.",
      price: "9.99/month",
      stripeProductId: "prod_Qh4Ak2lhk3ZvIi",
      stripePriceId: "price_1Ppg2VRpLrmHfjrMN3kq31Ux",
    },
  ];

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  const handleSubscription = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const selectedPlanData = plans.find((plan) => plan.id === selectedPlan);

      if (!selectedPlanData) {
        throw new Error("Selected plan not found");
      }

      const bookData = JSON.parse(localStorage.getItem("selectedBook") || "{}");

      const requestBody: any = {
        priceId: selectedPlanData.stripePriceId,
        success_url: window.location.origin + "/confirmation",
        cancel_url: window.location.origin + "/canceled",
        uid: user.uid,
      };

      if (bookData && bookData.id && bookData.title) {
        requestBody.bookData = {
          id: bookData.id,
          title: bookData.title,
        };
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { sessionId } = await response.json();

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          setError(error.message || null);
        }
      } else {
        throw new Error("Failed to load Stripe");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const onLoginSuccess = () => {
    setShowAuthModal(false);
    handleSubscription();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center ">
        <LoadingSpinner />
      </div>
    );
  }

  const buttonText =
    selectedPlan === 2 ? "Subscribe Now" : "Start your free 7-day trial";

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <motion.section
          ref={plansRef}
          initial="hidden"
          animate={plansInView ? "visible" : "hidden"}
          variants={stagger}
          className="relative bg-blue-1 text-white py-10 pb-32 md:pb-32 lg:pb-32 rounded-b-[250px] custom-padding"
        >
          <div className="container mx-auto px-4">
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center text-center px-4"
            >
              <h1 className="text-2xl md:text-4xl font-bold mb-4">
                Get Unlimited Access To Many Amazing Books To Read
              </h1>
              <p className="text-md md:text-xl mb-8">
                Turn ordinary moments into amazing learning opportunities.
              </p>
              <div className="relative w-full flex justify-center mb-40 md:mb-32 xs:mb-20">
                <div className="absolute bottom-100 w-full max-w-md mx-auto overflow-hidden mt-12 md:mt-0 scale-50 md:scale-75 rounded-t-[250px]">
                  <Image
                    src="/assets/pricing-top.png"
                    alt="Pricing illustration"
                    width={500}
                    height={300}
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
                <FaFile className="mx-auto mb-4 text-blue-1 text-4xl md:text-5xl" />
                <p className="text-sm md:text-md text-gray-1">
                  <span className="font-bold text-blue-1">
                    Key ideas in few min
                  </span>{" "}
                  with many books to read
                </p>
              </div>
              <div className="text-center max-w-xs">
                <RiPlantFill className="mx-auto mb-4 text-blue-1 text-5xl md:text-6xl" />
                <p className="text-sm md:text-md text-gray-1">
                  <span className="font-bold text-blue-1">3 million</span>{" "}
                  people growing with Summarist everyday
                </p>
              </div>
              <div className="text-center max-w-xs">
                <FaHandshake className="mx-auto mb-4 text-blue-1 text-5xl md:text-6xl" />
                <p className="text-sm md:text-md text-gray-1">
                  <span className="font-bold text-blue-1">
                    Precise recommendations
                  </span>{" "}
                  collections curated by experts
                </p>
              </div>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold text-center text-blue-1 mb-12"
            >
              Choose The Plan That Fits You
            </motion.h2>
            <motion.div variants={fadeInUp}>
              <Plans
                plans={plans}
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
              />
            </motion.div>
          </div>
          <div
            ref={buttonRef}
            className={`bg-white text-center h-28 w-full flex flex-col items-center justify-center ${
              isButtonSticky
                ? "fixed bottom-0 left-0 right-0"
                : "absolute bottom-0 left-0 right-0"
            }`}
            style={{
              zIndex: 10,
            }}
          >
            <button
              onClick={() => handleSubscription()}
              className="bg-green-1 text-white hover:bg-green-2 transition-colors duration-300 ease-in-out px-6 py-3 rounded-lg text-lg md:text-xl font-semibold"
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : buttonText}
            </button>
            <p className="mt-4 text-xs md:text-sm text-gray-2">
              {selectedPlan === 2
                ? "Subscribe now and start your journey!"
                : "Cancel your trial at any time before it ends, and you won't be charged."}
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

      <Footer />

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={onLoginSuccess}
        />
      )}
    </div>
  );
};

export default ChoosePlan;
