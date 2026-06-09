import React from 'react';

/*
 ╔══════════════════════════════════════════════════════════════════╗
 ║          CODE SCALER — INTERNSHIP OFFER LETTER TEMPLATE         ║
 ║                    Next.js Component (JSX)                      ║
 ╠══════════════════════════════════════════════════════════════════╣
 ║  PROPS (all required unless marked optional):                   ║
 ║                                                                  ║
 ║  refSequence  → number/string e.g. 1 → generates               ║
 ║                 CS/INT/OFF/2026/001 (auto zero-pads to 3 digits) ║
 ║  name         → Student full name                               ║
 ║  rollNumber   → University roll number                          ║
 ║  course       → Course / Branch name                            ║
 ║  university   → University name (used in T&C clause too)        ║
 ║  domain       → 'Full Stack Web Development' | 'Data Analytics' ║
 ║  date         → Optional. Defaults to today's date              ║
 ║  logoPath     → Path to logo image (see dimensions below)       ║
 ║  stampPath    → Path to stamp+signature image (see below)       ║
 ╠══════════════════════════════════════════════════════════════════╣
 ║  IMAGE DIMENSIONS:                                               ║
 ║                                                                  ║
 ║  LOGO IMAGE (logoPath)                                          ║
 ║    → Recommended source size : 320 × 120 px                     ║
 ║    → Displayed at            : 160 × 60 px (via CSS)            ║
 ║    → Format                  : PNG with transparent background  ║
 ║                                                                  ║
 ║  STAMP + SIGNATURE IMAGE (stampPath)                            ║
 ║    → Recommended source size : 300 × 240 px                     ║
 ║    → Displayed at            : 130 × 104 px (via CSS)           ║
 ║    → Format                  : PNG with transparent background  ║
 ╠══════════════════════════════════════════════════════════════════╣
 ║  USAGE EXAMPLE:                                                  ║
 ║                                                                  ║
 ║  <OfferLetterTemplate                                            ║
 ║    refSequence={1}                                               ║
 ║    name="Amarjeet"                                               ║
 ║    rollNumber="25MBA20084"                                       ║
 ║    course="MBA (Business Analytics)"                             ║
 ║    university="Chandigarh University"                            ║
 ║    domain="Data Analytics"                                       ║
 ║    logoPath="/images/cs-logo.png"                                ║
 ║    stampPath="/images/cs-stamp.png"                              ║
 ║  />                                                              ║
 ╚══════════════════════════════════════════════════════════════════╝
*/

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── A4 TEMPLATE ───────────────────────────────────────────── */
  .ol-page {
    width: 794px;
    background: #ffffff;
    padding: 32px 42px 36px;
    font-family: 'Poppins', 'Calibri', 'Segoe UI', Arial, sans-serif;
    font-size: 9.8pt;
    line-height: 1.6;
    color: #2D2D2D;
  }

  /* ── HEADER ────────────────────────────────────────────────── */
  .ol-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  .ol-logo {
    width: 64px;
    height: 60px;
    object-fit: contain;
    object-position: left center;
    display: block;
  }
  .ol-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ol-brand-name {
    color: #154FA3;
    font-size: 20pt;
    font-weight: 700;
    letter-spacing: -0.5px;
    white-space: nowrap;
  }
  .ol-ref-area {
    text-align: right;
    font-size: 8.2pt;
    color: #555555;
    line-height: 1.75;
  }

  /* ── DIVIDER ───────────────────────────────────────────────── */
  .ol-divider {
    height: 2px;
    background: #154FA3;
    margin: 10px 0 18px;
  }

  /* ── BANNER ────────────────────────────────────────────────── */
  .ol-banner {
    background: #154FA3;
    text-align: center;
    padding: 12px 20px;
    margin-bottom: 22px;
  }
  .ol-banner span {
    color: white;
    font-weight: 700;
    font-size: 13pt;
    letter-spacing: 0.6px;
  }

  /* ── SECTION HEADINGS ──────────────────────────────────────── */
  .ol-section-head {
    color: #154FA3;
    font-size: 10.5pt;
    font-weight: 700;
    margin-top: 20px;
    margin-bottom: 9px;
    padding-bottom: 5px;
    border-bottom: 1px solid #C5D5EE;
  }

  /* ── TABLES ────────────────────────────────────────────────── */
  .ol-table {
    width: 100%;
    border-collapse: collapse;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Student details table */
  .ol-detail-table td {
    padding: 7px 10px;
    border: 1px solid #C5D5EE;
    font-size: 9pt;
    vertical-align: middle;
    line-height: 1.5;
  }
  .ol-detail-table .ol-td-label {
    width: 30%;
    font-weight: 600;
    color: #555555;
  }
  .ol-detail-table .ol-td-value { color: #2D2D2D; }
  .ol-detail-table tr:nth-child(odd)  .ol-td-label { background: #E8EEF8; }
  .ol-detail-table tr:nth-child(odd)  .ol-td-value { background: #EFF4FB; }
  .ol-detail-table tr:nth-child(even) .ol-td-label { background: #F7F9FC; }
  .ol-detail-table tr:nth-child(even) .ol-td-value { background: #FFFFFF; }

  /* Internship details table */
  .ol-int-table td {
    padding: 8px 10px;
    border: 1px solid #C5D5EE;
    font-size: 9pt;
    vertical-align: middle;
    line-height: 1.5;
  }
  .ol-int-table .ol-td-key {
    width: 30%;
    font-weight: 600;
    color: #2D2D2D;
  }
  .ol-int-table .ol-td-val { color: #2D2D2D; }
  .ol-int-table tr:nth-child(odd)  .ol-td-key { background: #E8EEF8; }
  .ol-int-table tr:nth-child(odd)  .ol-td-val { background: #EFF4FB; }
  .ol-int-table tr:nth-child(even) .ol-td-key { background: #F7F9FC; }
  .ol-int-table tr:nth-child(even) .ol-td-val { background: #FFFFFF; }

  /* ── BODY TEXT ─────────────────────────────────────────────── */
  .ol-salutation {
    margin-top: 16px;
    margin-bottom: 6px;
    font-weight: 700;
    font-size: 10pt;
  }
  .ol-body {
    font-size: 9.6pt;
    color: #2D2D2D;
    margin-bottom: 8px;
    text-align: justify;
    line-height: 1.62;
  }

  /* ── TERM BLOCKS ───────────────────────────────────────────── */
  .ol-term-block {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .ol-term-title {
    color: #154FA3;
    font-weight: 700;
    font-size: 9.8pt;
    margin-top: 11px;
    margin-bottom: 3px;
  }
  .ol-term-desc {
    font-size: 9pt;
    color: #555555;
    text-align: justify;
    line-height: 1.58;
    padding-left: 14px;
  }

  /* ── BULLET LIST ───────────────────────────────────────────── */
  .ol-bullet-list {
    list-style: none;
    padding-left: 2px;
    margin-top: 4px;
  }
  .ol-bullet-list li {
    font-size: 9.5pt;
    color: #2D2D2D;
    padding: 3px 0 3px 18px;
    position: relative;
    line-height: 1.55;
  }
  .ol-bullet-list li::before {
    content: '•';
    color: #154FA3;
    font-weight: 900;
    position: absolute;
    left: 2px;
    font-size: 11pt;
    line-height: 1.25;
  }

  /* ── SIGNATURE SECTION ─────────────────────────────────────── */
  .ol-sig-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 26px;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .ol-sig-col {
    width: 47%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 140px;
  }
  .ol-sig-for {
    font-weight: 700;
    font-size: 10pt;
    color: #2D2D2D;
  }
  .ol-sig-bottom {
    margin-top: auto;
    padding-top: 8px;
  }
  .ol-stamp {
    width: 130px;
    height: auto;
    max-height: 104px;
    object-fit: contain;
    display: block;
    margin-bottom: 6px;
  }
  .ol-sig-name {
    color: #154FA3;
    font-weight: 700;
    font-size: 11pt;
    margin-bottom: 2px;
  }
  .ol-sig-title {
    font-size: 8.5pt;
    color: #555555;
    margin-bottom: 1px;
  }
  .ol-sig-contact {
    font-size: 8.5pt;
    color: #555555;
  }
  .ol-sig-lines {
    margin-top: 4px;
  }
  .ol-sig-lines p {
    font-size: 9.5pt;
    color: #2D2D2D;
    margin-bottom: 10px;
    line-height: 1.7;
  }

  /* ── FOOTER ────────────────────────────────────────────────── */
  .ol-footer-divider {
    height: 1.5px;
    background: #154FA3;
    margin: 24px 0 10px;
  }
  .ol-footer-main {
    text-align: center;
    font-size: 8.2pt;
    color: #555555;
    margin-bottom: 4px;
  }
  .ol-footer-note {
    text-align: center;
    font-size: 7.5pt;
    color: #999999;
    font-style: italic;
  }

  /* ── PRINT ─────────────────────────────────────────────────── */
  @media print {
    @page {
      size: A4 portrait;
      margin: 12mm 15mm 14mm 15mm;
    }
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    .ol-page {
      width: 100% !important;
      padding: 0 !important;
      font-size: 9.5pt !important;
    }
    .ol-term-block,
    .ol-sig-section,
    .ol-table {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }
  }
`;

const TERMS = [
  {
    title: 'Roles & Responsibilities',
    text: 'You will be assigned to a live industry project and are expected to contribute actively, take ownership of your tasks, meet deadlines, and maintain a professional standard of work throughout the internship period. Your specific role and project assignment will be communicated to you on or before the date of joining.',
  },
  {
    title: 'Performance-Based Reward',
    text: 'Upon successful completion of the 2-month internship, students who demonstrate consistent effort, strong performance, and quality deliverables will be eligible for a Performance-Based Reward / Stipend as a recognition of their contribution to the organization. The reward will be evaluated and disbursed at the sole discretion of Code Scaler management based on overall performance.',
  },
  {
    title: 'Pre-Placement Offer (PPO)',
    text: 'Interns who exhibit exceptional performance, technical growth, and professional conduct throughout the program may be considered for a Pre-Placement Offer (PPO) and/or a longer-term engagement with Code Scaler or our partner organizations, without going through a full recruitment cycle.',
  },
  {
    title: 'Certificate of Completion',
    text: 'All students who maintain a minimum of 85% attendance and successfully complete and submit their assigned project work will be awarded an official Certificate of Industrial Training Completion by Code Scaler. The certificate will be digitally verifiable and LinkedIn-ready, issued within 7 working days of program completion.',
  },
  {
    title: 'Attendance & Regularity',
    text: 'Interns are expected to attend all sessions regularly and on time. A minimum of 85% attendance is mandatory to be eligible for the Certificate of Completion and Performance-Based Reward. In case of any unavoidable absence, prior intimation to the mentor is required.',
  },
  {
    title: 'Professional Conduct',
    text: 'All interns are expected to conduct themselves with the utmost professionalism throughout the duration of the internship. This includes punctuality, respectful communication with team members and mentors, adherence to organizational norms, and a positive attitude towards learning and collaboration.',
  },
  {
    title: 'Confidentiality',
    text: 'All project-related work, client information, source code, business data, and internal processes of Code Scaler and its clients must be treated as strictly confidential. Interns must not disclose, share, or replicate any such information with any third party during or after the internship period.',
  },
];

const WHAT_YOU_GET = [
  '2 Months of hands-on, industry-level project experience',
  'Weekly mentorship and doubt-clearing sessions with industry professionals',
  'Verifiable Certificate of Industrial Training upon successful completion',
  'Portfolio-ready project to showcase to future employers',
  'Resume review, LinkedIn optimization, and mock interview support',
  'Performance-Based Reward for top contributors',
  'Pre-Placement Offer (PPO) consideration for exceptional performers',
  'Lifetime access to session recordings and study materials',
];

const OfferLetterTemplate = ({
  refSequence   = '001',
  name          = '',
  rollNumber    = '',
  course        = '',
  university    = '',
  domain        = 'Full Stack Web Development',  // or 'Data Analytics'
  date,
  logoPath      = '/images/cs-logo.png',          // → 320 × 120 px recommended
  stampPath     = '/SignandStamp.png',             // → 300 × 240 px recommended
}) => {

  const refNumber  = `CS/INT/OFF/2026/${String(refSequence).padStart(3, '0')}`;
  const letterDate = date || new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  const allTerms = [
    ...TERMS,
    {
      title: 'Compliance with University Norms',
      text: `This internship is being conducted in coordination with the Training & Placement Cell of ${university || 'your university'}. Interns are required to comply with all formalities, documentation, and procedures as stipulated by their university in addition to the requirements of Code Scaler.`,
    },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="ol-page">

        {/* ══ HEADER ══ */}
        <div className="ol-header">
          <div className="ol-brand">
            <img src={logoPath} alt="Code Scaler" className="ol-logo" />
            <span className="ol-brand-name">Code Scaler</span>
          </div>
          <div className="ol-ref-area">
            <p>Ref No: <strong>{refNumber}</strong></p>
            <p>Date: {letterDate}</p>
            <p>www.codescaler.com</p>
            <p>+91 9588161422</p>
          </div>
        </div>

        {/* ══ BLUE LINE ══ */}
        <div className="ol-divider" />

        {/* ══ BANNER ══ */}
        <div className="ol-banner">
          <span>INTERNSHIP OFFER LETTER</span>
        </div>

        {/* ══ STUDENT DETAILS ══ */}
        <h3 className="ol-section-head">Student Details</h3>
        <table className="ol-table ol-detail-table">
          <tbody>
            <tr>
              <td className="ol-td-label">Name</td>
              <td className="ol-td-value">{name}</td>
            </tr>
            <tr>
              <td className="ol-td-label">Roll Number</td>
              <td className="ol-td-value">{rollNumber}</td>
            </tr>
            <tr>
              <td className="ol-td-label">Course / Branch</td>
              <td className="ol-td-value">{course}</td>
            </tr>
            <tr>
              <td className="ol-td-label">University</td>
              <td className="ol-td-value">{university}</td>
            </tr>
          </tbody>
        </table>

        {/* ══ OPENING ══ */}
        <p className="ol-salutation">Dear Student,</p>
        <p className="ol-body">
          On behalf of <strong>Code Scaler, Jind, Haryana</strong>, we are pleased to offer
          this <strong>Internship Offer Letter</strong> to you as part of our{' '}
          <strong>Industrial Internship Program 2026</strong>. After a rigorous evaluation of
          your academic background, technical aptitude, and overall potential, you have been
          found suitable for this opportunity and we are delighted to welcome you to the Code
          Scaler team.
        </p>
        <p className="ol-body">
          This letter serves as your official offer of internship and outlines the terms and
          conditions of your engagement with Code Scaler. Please read this document carefully
          and acknowledge your acceptance by signing at the designated space below.
        </p>
        <p className="ol-body">
          You are requested to coordinate with your T&amp;P Cell as per their internal process
          upon receiving this letter.
        </p>

        {/* ══ INTERNSHIP DETAILS ══ */}
        <h3 className="ol-section-head">Internship Details</h3>
        <table className="ol-table ol-int-table">
          <tbody>
            <tr>
              <td className="ol-td-key">Organization</td>
              <td className="ol-td-val">Code Scaler, Jind, Haryana</td>
            </tr>
            <tr>
              <td className="ol-td-key">Program</td>
              <td className="ol-td-val">Industrial Internship Program 2026</td>
            </tr>
            <tr>
              <td className="ol-td-key">Duration</td>
              <td className="ol-td-val">2 Months (8 Weeks)</td>
            </tr>
            <tr>
              <td className="ol-td-key">Working Schedule</td>
              <td className="ol-td-val">5 Days/Week</td>
            </tr>
            <tr>
              <td className="ol-td-key">Tentative Start</td>
              <td className="ol-td-val">June 2026 (As communicated)</td>
            </tr>
            <tr>
              <td className="ol-td-key">Mode</td>
              <td className="ol-td-val">As Discussed</td>
            </tr>
            <tr>
              {/* ▼ VARIABLE: domain prop */}
              <td className="ol-td-key">Domain</td>
              <td className="ol-td-val">{domain}</td>
            </tr>
            <tr>
              <td className="ol-td-key">Mentor</td>
              <td className="ol-td-val">
                Deepak &amp; Ajay, Co-Founders &amp; Trainers — Code Scaler
              </td>
            </tr>
          </tbody>
        </table>

        {/* ══ TERMS & CONDITIONS ══ */}
        <h3 className="ol-section-head">Terms &amp; Conditions of Internship</h3>
        {allTerms.map((term, i) => (
          <div key={i} className="ol-term-block">
            <p className="ol-term-title">&#9658;&nbsp; {term.title}</p>
            <p className="ol-term-desc">{term.text}</p>
          </div>
        ))}

        {/* ══ WHAT YOU WILL RECEIVE ══ */}
        <h3 className="ol-section-head">What You Will Receive</h3>
        <ul className="ol-bullet-list">
          {WHAT_YOU_GET.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        {/* ══ ACCEPTANCE ══ */}
        <h3 className="ol-section-head">Acceptance &amp; Confirmation</h3>
        <p className="ol-body">
          Kindly acknowledge your acceptance of this internship offer by signing this letter
          and returning a copy to us. You are also requested to inform your Training &amp;
          Placement Cell of this offer and complete any formalities required at the university
          level.
        </p>
        <p className="ol-body">
          For any queries, please feel free to contact us at{' '}
          <strong>+91 9588161422</strong> or visit{' '}
          <strong>internship.codescaler.com</strong>. We look forward to your confirmation
          and are excited to have you as part of the Code Scaler team.
        </p>

        {/* ══ SIGNATURE SECTION ══ */}
        <div className="ol-sig-section">
          <div className="ol-sig-col">
            <p className="ol-sig-for">For Code Scaler</p>
            <div className="ol-sig-bottom">
              <img src={stampPath} alt="Signature &amp; Stamp" className="ol-stamp" />
              <p className="ol-sig-name">Deepak</p>
              <p className="ol-sig-title">Co-Founder &amp; Trainer | Code Scaler</p>
              <p className="ol-sig-contact">Jind, Haryana | +91 9588161422</p>
            </div>
          </div>
          <div className="ol-sig-col">
            <p className="ol-sig-for">Acknowledged by (Student)</p>
            <div className="ol-sig-bottom ol-sig-lines">
              <p>Name: ___________________________</p>
              <p>Sign: &nbsp;&nbsp;___________________________</p>
              <p>Date: ___________________________</p>
            </div>
          </div>
        </div>

        {/* ══ FOOTER ══ */}
        <div className="ol-footer-divider" />
        <p className="ol-footer-main">
          Code Scaler | Jind, Haryana | www.codescaler.com | +91 9588161422
        </p>
        <p className="ol-footer-note">
          This is an official document issued by Code Scaler. Unauthorized reproduction or
          distribution is strictly prohibited.
        </p>

      </div>
    </>
  );
};

export default OfferLetterTemplate;
