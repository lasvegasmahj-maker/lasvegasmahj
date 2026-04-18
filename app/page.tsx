"use client";

import { useState } from "react";
import Nav from "@/components/nav";
import Hero from "@/components/hero";
import WhySection from "@/components/why-section";
import Teacher from "@/components/teacher";
import Events from "@/components/events";
import Classes from "@/components/classes";
import Testimonials from "@/components/testimonials";
import Shop from "@/components/shop";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";
import ContactModal from "@/components/contact-modal";
import InquiryModal from "@/components/inquiry-modal";

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <Nav onContactOpen={() => setContactOpen(true)} />
      <Hero />
      <WhySection onInquiryOpen={() => setInquiryOpen(true)} />
      <Teacher onInquiryOpen={() => setInquiryOpen(true)} />
      <Events />
      <Classes onInquiryOpen={() => setInquiryOpen(true)} />
      <Testimonials />
      <Shop />
      <Newsletter />
      <Footer />
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
