import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://internship.codescaler.com"),
  title: {
    default: "CodeScaler – IT Internship & Coding Training in Jind, Haryana",
    template: "%s | CodeScaler Internship",
  },
  description:
    "Join CodeScaler's internship program in Jind, Haryana. " +
    "Learn Full Stack, Frontend, Backend & Data Analytics. " +
    "Real projects, mentorship, certificate & IT job placement help for B.Tech, BCA, MCA students.",
  keywords: [
    "internship for students in Haryana",
    "IT internship in Jind",
    "coding internship 2026",
    "free internship certificate online",
    "internship for B.Tech students",
    "internship for BCA MCA students",
    "learn web development Jind Haryana",
    "full stack development course Haryana",
    "data analyst course for students",
    "coding training institute Jind",
    "industrial training 6 months BTech",
    "software development training Haryana",
    "GJU internship 2026",
    "Guru Jambheshwar University internship",
    "GJUST student training program",
    "IT jobs for freshers Haryana",
    "get IT job after BTech",
    "placement training for students",
    "React Next.js internship India",
    "Python data analytics internship",
  ],
  authors: [{ name: "CodeScaler", url: "https://internship.codescaler.com" }],
  creator: "CodeScaler",
  publisher: "CodeScaler",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://internship.codescaler.com",
    siteName: "CodeScaler",
    title: "CodeScaler – IT Internship & Coding Training in Jind, Haryana",
    description:
      "Real-world coding internship for B.Tech, BCA & MCA students in Haryana. " +
      "Full Stack, Data Analytics, Frontend & Backend tracks. " +
      "Certificate + IT job placement support. Apply now for May 2026 batch.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeScaler Internship Program 2026 – Jind Haryana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeScaler – IT Internship for Students | Jind, Haryana",
    description:
      "Coding internship for B.Tech / BCA / MCA students. " +
      "Full Stack, Data Analytics & more. Apply before 1 May 2026.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://internship.codescaler.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "education",
};

// ─── JSON-LD schemas ──────────────────────────────────────────────────────────

const BASE_URL = "https://internship.codescaler.com";

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "CodeScaler",
  url: BASE_URL,
  logo: "https://www.codescaler.com/logo.png",
  description:
    "IT internship and coding training institute in Jind, Haryana " +
    "for B.Tech, BCA and MCA students.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2nd Floor, 43, Housing Board Colony, Shiv Colony",
    addressLocality: "Jind",
    addressRegion: "Haryana",
    postalCode: "126102",
    addressCountry: "IN",
  },
  telephone: "+919588161422",
  sameAs: ["https://www.codescaler.com"],
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "IT Internship & Industrial Training 2026",
  description:
    "Hands-on internship in Full Stack Development, Frontend, " +
    "Backend and Data Analytics for engineering students in Haryana. " +
    "1 month, 45 days, and 2 month tracks available.",
  provider: {
    "@type": "Organization",
    name: "CodeScaler",
    url: BASE_URL,
  },
  courseMode: "onsite",
  educationalLevel: "Undergraduate",
  inLanguage: "en",
  offers: {
    "@type": "Offer",
    price: "4999",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    validThrough: "2026-05-01",
    url: BASE_URL,
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "onsite",
    location: {
      "@type": "Place",
      name: "CodeScaler Office, Jind",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jind",
        addressRegion: "Haryana",
        addressCountry: "IN",
      },
    },
    startDate: "2026-05-01",
    endDate: "2026-07-01",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who can apply for CodeScaler internship?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "B.Tech, BCA, MCA and any CS/IT students from Haryana universities including GJU (Guru Jambheshwar University) can apply.",
      },
    },
    {
      "@type": "Question",
      name: "What is the fee for the internship?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The program fee is ₹4999 (GST included) for 1 month, 45 days, and 2 month tracks.",
      },
    },
    {
      "@type": "Question",
      name: "Will I get a certificate after the internship?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all students receive a verified internship completion certificate from CodeScaler.",
      },
    },
    {
      "@type": "Question",
      name: "What domains can I choose?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Full Stack Development, Frontend Development, Backend Development, or Data Analytics.",
      },
    },
    {
      "@type": "Question",
      name: "Is this internship valid for GJU university submission?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the internship certificate is valid for industrial training submission at Guru Jambheshwar University (GJUST) and other Haryana universities.",
      },
    },
  ],
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
