import ContactForm from "@/components/global/contactForm";
import { PageHeader } from "@/components/global/PageHeader";
import { ENV } from "@/config/env";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Contact | Shotrip";
  const description =
    "Have questions or feedback? Contact the Shotrip team for support and inquiries regarding our Japan travel guides and services.";

  return {
    title,
    description,
    alternates: {
      canonical: `${ENV.PROD_URL}/contact`,
    },
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/contact`,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ContactPage() {
  return (
    <>
      <PageHeader />
      <ContactForm />
    </>
  );
}
