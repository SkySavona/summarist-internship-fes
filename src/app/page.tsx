"use client";

import { AiFillFileText, AiFillBulb, AiFillAudio } from "react-icons/ai";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { BiCrown } from "react-icons/bi";
import { RiLeafLine } from "react-icons/ri";
import LoginButton from "@/components/auth/LoginButton";
import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Home() {
  const [highlightIndex1, setHighlightIndex1] = useState(0);
  const [highlightIndex2, setHighlightIndex2] = useState(0);
  const highlights1 = [
    "Enhance your knowledge",
    "Achieve greater success",
    "Improve your health",
    "Develop better parenting skills",
    "Increase happiness",
    "Be the best version of yourself!",
  ];
  const highlights2 = [
    "Expand your learning",
    "Accomplish your goals",
    "Strengthen your vitality",
    "Become a better caregiver",
    "Improve your mood",
    "Maximize your abilities",
  ];

  const [landingRef, landingInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statisticsRef, statisticsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [reviewsRef, reviewsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [numbersRef, numbersInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const intervalId1 = setInterval(() => {
      setHighlightIndex1((prevIndex) => (prevIndex + 1) % highlights1.length);
    }, 2000);

    const intervalId2 = setInterval(() => {
      setHighlightIndex2((prevIndex) => (prevIndex + 1) % highlights2.length);
    }, 2000);

    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
    };
  }, [highlights1.length, highlights2.length]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="h-20 w-full"
      >
        <div className="flex justify-between items-center max-w-[1070px] w-full h-full mx-auto px-6">
          <figure className="max-w-[200px]">
            <img
              className="w-full h-full"
              src="./assets/logo.png"
              alt="logo"
            />
          </figure>
          <ul className="flex gap-6">
            <li>
              <LoginButton className="!bg-transparent !p-0 !h-auto !text-[#032b41] hover:!text-[#2bd97c] transition-colors duration-100">
                Login
              </LoginButton>
            </li>
            <li className="cursor-not-allowed text-[#032b41] md:block hidden">
              About
            </li>
            <li className="cursor-not-allowed text-[#032b41] md:block hidden">
              Contact
            </li>
            <li className="cursor-not-allowed text-[#032b41] md:block hidden">
              Help
            </li>
          </ul>
        </div>
      </motion.nav>

      <motion.section 
        ref={landingRef}
        initial="hidden"
        animate={landingInView ? "visible" : "hidden"}
        variants={stagger}
        className="w-full py-10"
      >
        <div className="max-w-[1070px] w-full mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div variants={fadeInUp} className="text-center md:text-left md:w-1/2">
              <h1 className="text-4xl font-bold text-[#032b41] mb-6">
                Gain more knowledge <br className="hidden md:inline-block" />
                in less time
              </h1>
              <p className="text-xl text-[#394547] font-light mb-6 leading-relaxed">
                Great summaries for busy people,
                <br className="hidden md:inline-block" />
                individuals who barely have time to read,
                <br className="hidden md:inline-block" />
                and even people who don't like to read.
              </p>
              <LoginButton>Login</LoginButton>
            </motion.div>
            <motion.figure 
              variants={fadeInUp}
              className="mt-8 md:mt-0 md:w-1/2 flex justify-end"
            >
              <img
                src="./assets/landing.png"
                alt="landing"
                className="w-full max-w-[400px]"
              />
            </motion.figure>
          </div>
        </div>
      </motion.section>

      <motion.section 
        ref={featuresRef}
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
        variants={stagger}
        className="w-full py-10"
      >
        <div className="max-w-[1070px] w-full mx-auto px-6">
          <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-center text-[#032b41] mb-8">
            Understand books in few minutes
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
            {['Read or listen', 'Find your next read', 'Briefcasts'].map((title, index) => (
              <motion.div key={index} variants={fadeInUp} className="flex flex-col items-center text-center">
                <div className="text-6xl text-[#032b41] mb-2">
                  {index === 0 ? <AiFillFileText /> : index === 1 ? <AiFillBulb /> : <AiFillAudio />}
                </div>
                <h3 className="text-2xl text-[#032b41] font-medium mb-4">{title}</h3>
                <p className="text-lg text-[#394547] font-light">
                  {index === 0
                    ? "Save time by getting the core ideas from the best books."
                    : index === 1
                    ? "Explore book lists and personalized recommendations."
                    : "Gain valuable insights from briefcasts."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        ref={statisticsRef}
        initial="hidden"
        animate={statisticsInView ? "visible" : "hidden"}
        variants={stagger}
        className="w-full py-10"
      >
        <div className="max-w-[1070px] w-full mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-20">
            <motion.div variants={fadeInUp} className="flex flex-col justify-center md:w-1/2">
              {highlights1.map((text, index) => (
                <motion.h3
                  key={index}
                  variants={fadeInUp}
                  className={`text-3xl font-medium mb-4 transition-colors duration-300 ${
                    index === highlightIndex1
                      ? 'text-[#2bd97c]'
                      : 'text-[#6b757b]'
                  }`}
                >
                  {text}
                </motion.h3>
              ))}
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col justify-center bg-[#f1f6f4] p-5 md:w-1/2">
              <div className="mb-6">
                <div className="flex">
                  <div className="text-2xl font-bold text-[#0365f2] mb-2 mr-4">
                    93%{" "}
                  </div>
                  <div className="text-xl text-[#394547]">
                    of Summarist members <b>significantly increase</b> reading
                    frequency.
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex">
                  <div className="text-2xl font-bold text-[#0365f2] mb-2 mr-4">
                    96%
                  </div>
                  <div className="text-xl text-[#394547]">
                    of Summarist members <b>establish better</b> habits.
                  </div>
                </div>
              </div>
              <div>
                <div className="flex">
                  <div className="text-2xl font-bold text-[#0365f2] mb-2 mr-4">
                    90%
                  </div>
                  <div className="text-xl text-[#394547]">
                    have made <b>significant positive</b> change to their
                    lives.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        initial="hidden"
        animate={statisticsInView ? "visible" : "hidden"}
        variants={stagger}
        className="w-full py-10"
      >
        <div className="max-w-[1070px] w-full mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-20">
            <motion.div variants={fadeInUp} className="flex flex-col justify-center bg-[#f1f6f4] p-5 md:w-1/2">
              <div className="mb-6">
                <div className="flex">
                  <div className="text-2xl font-bold text-[#0365f2] mb-2 mr-4">
                    91%{" "}
                  </div>
                  <div className="text-xl text-[#394547]">
                    of Summarist members <b>report feeling more productive</b>{" "}
                    after incorporating the service into their daily routine.
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex">
                  <div className="text-2xl font-bold text-[#0365f2] mb-2 mr-4">
                    94%
                  </div>
                  <div className="text-xl text-[#394547]">
                    of Summarist members have <b>noticed an improvement</b> in
                    their overall comprehension and retention of information.
                  </div>
                </div>
              </div>
              <div>
                <div className="flex">
                  <div className="text-2xl font-bold text-[#0365f2] mb-2 mr-4">
                    88%
                  </div>
                  <div className="text-xl text-[#394547]">
                    of Summarist members <b>feel more informed</b> about
                    current events and industry trends since using the
                    platform.
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col text-right justify-center md:w-1/2">
              {highlights2.map((text, index) => (
                <motion.h3
                  key={index}
                  variants={fadeInUp}
                  className={`text-3xl font-medium mb-4 transition-colors duration-300 ${
                    index === highlightIndex2
                      ? 'text-[#2bd97c]'
                      : 'text-[#6b757b]'
                  }`}
                >
                  {text}
                </motion.h3>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        ref={reviewsRef}
        initial="hidden"
        animate={reviewsInView ? "visible" : "hidden"}
        variants={stagger}
        className="w-full py-10"
      >
        <div className="max-w-[1070px] w-full mx-auto px-6">
          <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-center text-[#032b41] mb-8">
            What our members say
          </motion.h2>
          <div className="max-w-[600px] mx-auto">
            {[
              {
                name: "Hanna M.",
                content: "This app has been a <b>game-changer</b> for me! It's saved me so much time and effort in reading and comprehending books. Highly recommend it to all book lovers."
              },
              {
                name: "David B.",
                content: "I love this app! It provides <b>concise and accurate summaries</b> of books in a way that is easy to understand. It's also very user-friendly and intuitive."
              },
              {
                name: "Nathan S.",
                content: "This app is a great way to get the main takeaways from a book without having to read the entire thing. <b>The summaries are well-written and informative.</b> Definitely worth downloading."
              },
              {
                name: "Ryan R.",
                content: "If you're a busy person who <b>loves reading but doesn't have the time</b> to read every book in full, this app is for you! The summaries are thorough and provide a great overview of the book's content."
              }
            ].map((review, index) => (
              <motion.div key={index} variants={fadeInUp} className="bg-[#fff3d7] p-4 rounded mb-8">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-[#032b41] font-bold">{review.name}</div>
                  <div className="flex text-[#0564f1]">
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                  </div>
                </div>
                <p className="text-[#394547] leading-relaxed" dangerouslySetInnerHTML={{ __html: review.content }}></p>
              </motion.div>
            ))}
         <motion.div variants={fadeInUp} className="flex justify-center">
              <LoginButton>Login</LoginButton>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        ref={numbersRef}
        initial="hidden"
        animate={numbersInView ? "visible" : "hidden"}
        variants={stagger}
        className="w-full py-10"
      >
        <div className="max-w-[1070px] w-full mx-auto px-6">
          <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-center text-[#032b41] mb-8">
            Start growing with Summarist now
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <BiCrown />, number: '3 Million', text: 'Downloads on all platforms' },
              { icon: <><BsStarFill /><BsStarHalf /></>, number: '4.5 Stars', text: 'Average ratings on iOS and Google Play' },
              { icon: <RiLeafLine />, number: '97%', text: 'Of Summarist members create a better reading habit' }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="bg-[#d7e9ff] flex flex-col items-center text-center p-6 rounded-xl"
              >
                <div className="text-6xl text-[#0365f2] mb-4">
                  {item.icon}
                </div>
                <div className="text-4xl font-bold text-[#032b41] mb-4">
                  {item.number}
                </div>
                <div className="text-lg text-[#394547] font-light">
                  {item.text}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full py-10 bg-[#f1f6f4]"
      >
        <div className="max-w-[1070px] w-full text-left py-5 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-32 mb-16 pl-16">
            <motion.div variants={fadeInUp}>
              <h3 className="text-lg font-semibold text-[#032b41] mb-4">
                Actions
              </h3>
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
    </main>
  );
}