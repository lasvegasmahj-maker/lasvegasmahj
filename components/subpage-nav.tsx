"use client";

import { useState } from "react";
import Nav from "@/components/nav";
import ContactModal from "@/components/contact-modal";

export default function SubpageNav() {
  const [contactOpen, setContactOpen] = useState(false);
  return (
    <>
      <Nav onContactOpen={() => setContactOpen(true)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
