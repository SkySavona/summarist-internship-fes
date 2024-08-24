"use client";

import { AiFillFileText, AiFillBulb, AiFillAudio } from "react-icons/ai";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { BiCrown } from "react-icons/bi";
import { RiLeafLine } from "react-icons/ri";
import LoginButton from "@/components/auth/LoginButton";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { highlights1, highlights2 } from "@/constants/highlights";
import Image from "next/image";
import SignUpButton from "@/components/auth/SignUpButton";

export default function Home() {
  const [highlightIndex1, setHighlightIndex1] = useState(0);
  const [highlightIndex2, setHighlightIndex2] = useState(0);

  const [landingRef, landingInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [statisticsRef, statisticsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [reviewsRef, reviewsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [numbersRef, numbersInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.3, ease: "easeOut" } },
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="h-20 w-full fixed top-0 bg-white z-50"
      >
        <div className="flex justify-between items-center max-w-[1280px] w-full h-full mx-auto px-4 sm:px-8">
          <figure className="max-w-[150px] sm:max-w-[200px]">
            <Image
              className="w-full h-full"
              src="/assets/logo.png"
              alt="logo"
              width={200}
              height={200}
            />
          </figure>
          <ul className="flex gap-4 sm:gap-6 text-base sm:text-lg">
            <li>
              <LoginButton className="!bg-transparent !p-0 !h-auto !text-[#032b41] hover:!text-[#2bd97c] transition-colors duration-300">
                Login
              </LoginButton>
            </li>
            <li className="cursor-not-allowed text-[#032b41] hidden sm:block">
              About
            </li>
            <li className="cursor-not-allowed text-[#032b41] hidden sm:block">
              Books
            </li>
            <li className="text-[#032b41] hidden sm:block">
              <Link
                href="/help"
                className="hover:text-green-1 transition-colors duration-300"
              >
                Help
              </Link>
            </li>
          </ul>
        </div>
      </motion.nav>

      <motion.section
        ref={landingRef}
        initial="hidden"
        animate={landingInView ? "visible" : "hidden"}
        variants={stagger}
        className="w-full min-h-screen flex items-center mt-20 py-12"
      >
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              variants={fadeInUp}
              className="text-center md:text-left md:w-1/2"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-[#032b41] mb-6 sm:pt-0">
                Gain More Knowledge <br className="hidden md:inline-block" />
                in Less Time
              </h1>
              <p className="text-lg sm:text-xl text-[#394547] font-light mb-6 leading-relaxed">
                Great summaries for busy people,&nbsp;
                <br className="hidden md:inline-block" />
                those with little time,&nbsp;
                <br className="hidden md:inline-block" />
                and even those who don't enjoy reading.
              </p>
              <div className="flex justify-center md:justify-start">
                <SignUpButton>Sign Up</SignUpButton>
              </div>
            </motion.div>
            <motion.figure
              variants={fadeInUp}
              className="mt-8 md:mt-0 md:w-1/2 flex justify-center md:justify-end"
            >
              <Image
                src="/assets/landing.png"
                alt="landing"
                className="w-full max-w-[400px] md:max-w-[500px] mr-4"
                width={500}
                height={500}
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
        className="w-full py-16 sm:py-32"
      >
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-8">
          <motion.h2
            variants={fadeInUp}
            className="text-2xl sm:text-3xl font-bold text-center text-[#032b41] mb-12 sm:mb-20"
          >
            Understand Books in a Few Minutes
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-16 mb-16 sm:mb-24">
            {["Read or Listen", "Find Your Next Read", "Briefcasts"].map(
              (title, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex flex-col items-center text-center"
                >
                  <div className="text-4xl sm:text-6xl text-[#032b41] mb-4">
                    {index === 0 ? (
                      <AiFillFileText />
                    ) : index === 1 ? (
                      <AiFillBulb />
                    ) : (
                      <AiFillAudio />
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl text-[#032b41] font-medium mb-4">
                    {title}
                  </h3>
                  <p className="text-base sm:text-lg text-[#394547] font-light">
                    {index === 0
                      ? "Save time by getting the core ideas from the best books."
                      : index === 1
                      ? "Explore book lists and personalized recommendations."
                      : "Gain valuable insights from briefcasts."}
                  </p>
                </motion.div>
              )
            )}
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={statisticsRef}
        initial="hidden"
        animate={statisticsInView ? "visible" : "hidden"}
        variants={stagger}
        className="w-full py-16 bg-[#f1f6f4]"
      >
        <div className="max-w-[1280px] w-full mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-20">
            <motion.div
              variants={fadeInUp}
              className="flex flex-col justify-center md:w-1/2 order-last md:order-first"
            >
              {highlights1.map((text, index) => (
                <motion.h3
                  key={index}
                  variants={fadeInUp}
                  className={`text-3xl font-medium mb-6 transition-colors duration-300 ${
                    index === highlightIndex1
                      ? "text-[#2bd97c]"
                      : "text-[#6b757b]"
                  }`}
                >
                  {text}
                </motion.h3>
              ))}
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col justify-center bg-white p-8 md:w-1/2 rounded-lg order-first md:order-last"
            >
              <div className="mb-8">
                <div className="flex">
                  <div className="text-2xl font-bold text-[#0365f2] mb-2 mr-4">
                    93%
                  </div>
                  <div className="text-xl text-[#394547]">
                    of Summarist members <b>significantly increase</b> reading
                    frequency.
                  </div>
                </div>
              </div>
              <div className="mb-8">
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
                    have made <b>significant positive</b> change to their lives.
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
        className="w-full py-16 bg-[#f1f6f4]"
      >
        <div className="max-w-[1280px] w-full mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-20">
            <motion.div
              variants={fadeInUp}
              className="flex flex-col justify-center bg-white p-8 md:w-1/2 rounded-lg order-last md:order-first"
            >
              <div className="mb-8">
                <div className="flex">
                  <div className="text-2xl font-bold text-[#0365f2] mb-2 mr-4">
                    91%
                  </div>
                  <div className="text-xl text-[#394547]">
                    of Summarist members <b>report feeling more productive</b>{" "}
                    after incorporating the service into their daily routine.
                  </div>
                </div>
              </div>
              <div className="mb-8">
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
                    of Summarist members <b>feel more informed</b> about current
                    events and industry trends since using the platform.
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col justify-center md:w-1/2 order-first md:order-last"
            >
              {highlights2.map((text, index) => (
                <motion.h3
                  key={index}
                  variants={fadeInUp}
                  className={`text-3xl font-medium text-right mb-6 transition-colors duration-300 ${
                    index === highlightIndex2
                      ? "text-[#2bd97c]"
                      : "text-[#6b757b]"
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
        className="w-full py-32 "
      >
        <div className="max-w-[1280px] w-full mx-auto px-8">
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-bold text-center text-[#032b41] mb-8"
          >
            What Our Members Say
          </motion.h2>
          <div className="max-w-[600px] mx-auto">
            {[
              {
                name: "Hanna M.",
                content:
                  "This app has been a <b>game-changer</b> for me! It's saved me so much time and effort in reading and comprehending books. Highly recommend it to all book lovers.",
              },
              {
                name: "David B.",
                content:
                  "I love this app! It provides <b>concise and accurate summaries</b> of books in a way that is easy to understand. It's also very user-friendly and intuitive.",
              },
              {
                name: "Nathan S.",
                content:
                  "This app is a great way to get the main takeaways from a book without having to read the entire thing. <b>The summaries are well-written and informative.</b> Definitely worth downloading.",
              },
              {
                name: "Ryan R.",
                content:
                  "If you're a busy person who <b>loves reading but doesn't have the time</b> to read every book in full, this app is for you! The summaries are thorough and provide a great overview of the book's content.",
              },
            ].map((review, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-[#fff3d7] p-6 rounded-lg mb-8"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="text-[#032b41] font-bold">{review.name}</div>
                  <div className="flex text-[#0564f1]">
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                  </div>
                </div>
                <p
                  className="text-[#394547] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: review.content }}
                ></p>
              </motion.div>
            ))}
            <motion.div
              variants={fadeInUp}
              className="flex justify-center mt-12"
            >
              <SignUpButton>Sign Up</SignUpButton>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={numbersRef}
        initial="hidden"
        animate={numbersInView ? "visible" : "hidden"}
        variants={stagger}
        className="w-full py-16"
      >
        <div className="max-w-[1280px] w-full mx-auto px-8">
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-bold text-center text-[#032b41] mb-8"
          >
            Start Growing With Summarist <span className="italic text-green-1">Now</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                icon: <BiCrown />,
                number: "3 Million",
                text: "Downloads on all platforms",
              },
              {
                icon: (
                  <>
                  <div className="flex-row flex text-[32px] gap-2 p-2">
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarHalf />
                    </div>
                  </>
                ),
                number: "4.5 Stars",
                text: "Average ratings on iOS and Google Play",
              },
              {
                icon: <RiLeafLine />,
                number: "97%",
                text: "Of Summarist members create a better reading habit",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-[#d7e9ff] flex flex-col items-center text-center p-8 mb-8 rounded-lg"
              >
                <div className="text-6xl text-[#0365f2] mb-4">{item.icon}</div>
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

      <Footer />
    </main>
  );
}
