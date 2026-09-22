import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — 0266st / 0168th",
  description: "0266st / 0168th への依頼・問い合わせフォーム。",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="contact-page">
        <div className="container">
          <h1 className="contact-page__title">Contact</h1>
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
