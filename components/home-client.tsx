"use client";

import { useState } from "react";
import Nav from "@/components/nav";
import Hero from "@/components/hero";
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
import ContactModal from "@/components/contact-modal";
import InquiryModal from "@/components/inquiry-modal";

export default function HomeClient() {
  const [contactOpen, setContactOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <Nav onContactOpen={() => setContactOpen(true)} />
      <Hero />
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
      <Footer onContactOpen={() => setContactOpen(true)} />
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </>
  );
}
