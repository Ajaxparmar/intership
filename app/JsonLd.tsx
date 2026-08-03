// Drop <JsonLd /> inside your root layout <body> tag
// This gives Google rich results — course cards, organization info,
// and local business listing in Maps / Search

export function JsonLd() {
    const org = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "CodeScaler",
      url: "https://internship.codescaler.com/",
      logo: "hhttps://internship.codescaler.com/logo.png",
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
      email: "info@codescaler.com",
      sameAs: ["https://internship.codescaler.com"],
    };
  
    const course = {
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
        url: "https://internship.codescaler.com",
      },
      courseMode: "onsite",
      educationalLevel: "Undergraduate",
      inLanguage: "en",
      offers: {
        "@type": "Offer",
        price: "3999",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        validThrough: "2026-05-01",
        url: "https://internship.codescaler.com",
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
  
    const faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Who can apply for CodeScaler internship?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "B.Tech, BCA, MCA and any CS/IT students from Haryana " +
                  "universities including GJU (Guru Jambheshwar University) can apply.",
          },
        },
        {
          "@type": "Question",
          name: "What is the fee for the internship?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The program fee is ₹3999 (GST included) for 1 month, 45 days, and 2 month tracks.",
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
            text: "You can choose from Full Stack Development, Frontend Development, Backend Development, or Data Analytics.",
          },
        },
      ],
    };
  
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(course) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
        />
      </>
    );
  }