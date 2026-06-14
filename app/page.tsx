"use client";

import { useState } from "react";
import Nav from "@/components/nav";
import Hero from "@/components/hero";
import WhySection from "@/components/why-section";
import Teacher from "@/components/teacher";
import WhatToExpect from "@/components/what-to-expect";
import Events from "@/components/events";
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
import { homeFaqSchema } from "@/lib/home-faq";

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema).replace(/</g, "\\u003c") }} />
      <Nav onContactOpen={() => setContactOpen(true)} />
      <Hero />
      <WhySection />
      <Teacher />
      <WhatToExpect />
      <Classes onInquiryOpen={() => setInquiryOpen(true)} />
      <Events />
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
