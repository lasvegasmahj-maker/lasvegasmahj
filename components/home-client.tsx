"use client";

import { useState } from "react";
import Nav from "@/components/nav";
import Hero from "@/components/hero";
import StudioBanner from "@/components/studio-banner";
import PressSection from "@/components/press-section";
import WhySection from "@/components/why-section";
import Teacher from "@/components/teacher";
import WhatToExpect from "@/components/what-to-expect";
import Classes from "@/components/classes";
import PrivateEvents from "@/components/private-events";
import Testimonials from "@/components/testimonials";
import FAQ from "@/components/faq";
import Shop from "@/components/shop";
import Instagram from "@/components/instagram";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";
import InquiryModal from "@/components/inquiry-modal";

export default function HomeClient() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <Nav />
      <Hero />
      <StudioBanner />
      <PressSection />
      <WhySection />
      <Teacher />
      <WhatToExpect />
      <Classes />
      <PrivateEvents onInquiryOpen={() => setInquiryOpen(true)} />
      <Testimonials />
      <FAQ />
      <Shop />
      <Instagram />
      <Newsletter />
      <Footer />
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </>
  );
}
