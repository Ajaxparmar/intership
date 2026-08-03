import React from 'react';

/*
 ╔══════════════════════════════════════════════════════════════════╗
 ║           CODE SCALER — FEE SLIP / PAYMENT RECEIPT TEMPLATE     ║
 ║                    Next.js Component (JSX)                      ║
 ╠══════════════════════════════════════════════════════════════════╣
 ║  PROPS (all required unless marked optional):                   ║
 ║                                                                  ║
 ║  refSequence   → number/string e.g. 1 → generates              ║
 ║                  CS/FEE/2026/001 (auto zero-pads to 3 digits)   ║
 ║  name          → Student full name                              ║
 ║  fatherName    → Student father's name                          ║
 ║  rollNumber    → University roll number                         ║
 ║  course        → Course / Branch name                           ║
 ║  university    → University name                                ║
 ║  address       → Student address                                ║
 ║  domain        → 'Full Stack Web Development' | 'Data Analytics'║
 ║  batchDateTime → e.g. '16 June 2026 | 10:00 AM'               ║
 ║  amount        → Fee amount as number e.g. 4999                 ║
 ║  paymentMode   → 'UPI' | 'Cash' | 'Bank Transfer'              ║
 ║  paymentDate   → Optional. JS Date object or ISO string.        ║
 ║                  Defaults to today's date                       ║
 ║  logoPath      → Path to logo image (see dimensions below)      ║
 ║  stampPath     → Path to stamp+signature image (see below)      ║
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
 ║  <FeeSlipTemplate                                                ║
 ║    refSequence={1}                                               ║
 ║    name="Amarjeet Singh"                                         ║
 ║    fatherName="Suresh Kumar"                                     ║
 ║    rollNumber="25MBA20084"                                       ║
 ║    course="MBA (Business Analytics)"                             ║
 ║    university="Chandigarh University"                            ║
 ║    address="Jind, Haryana"                                       ║
 ║    domain="Data Analytics"                                       ║
 ║    batchDateTime="16 June 2026 | 10:00 AM"                      ║
 ║    amount={4999}                                                 ║
 ║    paymentMode="UPI"                                             ║
 ║    paymentDate={new Date()}                                      ║
 ║    logoPath="/images/cs-logo.png"                                ║
 ║    stampPath="/images/cs-stamp.png"                              ║
 ║  />                                                              ║
 ╚══════════════════════════════════════════════════════════════════╝
*/

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── A4 PAGE ───────────────────────────────────────────────── */
  .fs-page {
    width: 794px;
    background: #ffffff;
    padding: 32px 42px 36px;
    font-family: 'Poppins', 'Calibri', 'Segoe UI', Arial, sans-serif;
    font-size: 9.8pt;
    line-height: 1.6;
    color: #2D2D2D;
  }

  /* ── HEADER ────────────────────────────────────────────────── */
  .fs-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  .fs-logo {
    width: 64px;
    height: 60px;
    object-fit: contain;
    object-position: left center;
    display: block;
  }
  .fs-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .fs-brand-name {
    color: #154FA3;
    font-size: 20pt;
    font-weight: 700;
    letter-spacing: -0.5px;
    white-space: nowrap;
  }
  .fs-ref-area {
    text-align: right;
    font-size: 8.2pt;
    color: #555555;
    line-height: 1.75;
  }

  /* ── DIVIDER ───────────────────────────────────────────────── */
  .fs-divider {
    height: 2px;
    background: #154FA3;
    margin: 10px 0 18px;
  }

  /* ── BANNER ────────────────────────────────────────────────── */
  .fs-banner {
    background: #154FA3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    margin-bottom: 22px;
  }
  .fs-banner-title {
    color: white;
    font-weight: 700;
    font-size: 13pt;
    letter-spacing: 0.6px;
  }
  .fs-status-paid {
    background: #22c55e;
    color: #ffffff;
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 1.2px;
    padding: 4px 12px;
    border-radius: 20px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* ── SECTION HEADINGS ──────────────────────────────────────── */
  .fs-section-head {
    color: #154FA3;
    font-size: 10.5pt;
    font-weight: 700;
    margin-top: 20px;
    margin-bottom: 9px;
    padding-bottom: 5px;
    border-bottom: 1px solid #C5D5EE;
  }

  /* ── TWO-COLUMN CARD GRID ──────────────────────────────────── */
  .fs-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }
  .fs-card {
    background: #F5F8FE;
    border: 1px solid #C5D5EE;
    border-radius: 6px;
    padding: 12px 14px;
  }
  .fs-card-head {
    font-size: 8.5pt;
    font-weight: 700;
    color: #154FA3;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid #C5D5EE;
  }
  .fs-field {
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
  }
  .fs-field:last-child { margin-bottom: 0; }
  .fs-field-label {
    font-size: 7.5pt;
    color: #888888;
    font-weight: 600;
    letter-spacing: 0.7px;
    text-transform: uppercase;
    margin-bottom: 1px;
  }
  .fs-field-value {
    font-size: 9.2pt;
    color: #2D2D2D;
    font-weight: 500;
    line-height: 1.4;
  }

  /* ── AMOUNT BOX ────────────────────────────────────────────── */
  .fs-amount-box {
    background: #154FA3;
    border-radius: 8px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .fs-amount-left {}
  .fs-amount-label {
    color: rgba(255,255,255,0.7);
    font-size: 7.5pt;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .fs-amount-value {
    color: #ffffff;
    font-size: 22pt;
    font-weight: 700;
    letter-spacing: -0.5px;
    line-height: 1.1;
    margin-bottom: 6px;
  }
  .fs-mode-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
  }
  .fs-mode-via {
    color: rgba(255,255,255,0.6);
    font-size: 7.5pt;
  }
  .fs-mode-badge {
    background: #ffffff;
    color: #154FA3;
    font-size: 8pt;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 12px;
    border: 1px solid #C5D5EE;
  }
  .fs-amount-right {
    text-align: right;
  }
  .fs-amount-program {
    color: rgba(255,255,255,0.9);
    font-size: 9.5pt;
    font-weight: 600;
    margin-bottom: 3px;
  }
  .fs-amount-sub {
    color: rgba(255,255,255,0.6);
    font-size: 8pt;
    margin-bottom: 8px;
  }
  .fs-amount-pdate {
    color: rgba(255,255,255,0.65);
    font-size: 8pt;
  }

  /* ── NOTICE ────────────────────────────────────────────────── */
  .fs-notice {
    background: #FFFBEB;
    border: 1px solid #FDE68A;
    border-radius: 6px;
    padding: 9px 14px;
    margin-bottom: 20px;
    font-size: 8.5pt;
    color: #78350F;
    line-height: 1.55;
  }

  /* ── SIGNATURE SECTION ─────────────────────────────────────── */
  .fs-sig-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 26px;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .fs-sig-col {
    width: 47%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 140px;
  }
  .fs-sig-for {
    font-weight: 700;
    font-size: 10pt;
    color: #2D2D2D;
  }
  .fs-sig-bottom {
    margin-top: auto;
    padding-top: 8px;
  }
  .fs-stamp {
    width: 130px;
    height: auto;
    max-height: 104px;
    object-fit: contain;
    display: block;
    margin-bottom: 6px;
  }
  .fs-sig-name {
    color: #154FA3;
    font-weight: 700;
    font-size: 11pt;
    margin-bottom: 2px;
  }
  .fs-sig-title {
    font-size: 8.5pt;
    color: #555555;
    margin-bottom: 1px;
  }
  .fs-sig-contact {
    font-size: 8.5pt;
    color: #555555;
  }
  .fs-sig-lines {
    margin-top: 4px;
  }
  .fs-sig-lines p {
    font-size: 9.5pt;
    color: #2D2D2D;
    margin-bottom: 10px;
    line-height: 1.7;
  }

  /* ── FOOTER ────────────────────────────────────────────────── */
  .fs-footer-divider {
    height: 1.5px;
    background: #154FA3;
    margin: 24px 0 10px;
  }
  .fs-footer-main {
    text-align: center;
    font-size: 8.2pt;
    color: #555555;
    margin-bottom: 4px;
  }
  .fs-footer-note {
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
    .fs-page {
      width: 100% !important;
      padding: 0 !important;
      font-size: 9.5pt !important;
    }
    .fs-sig-section,
    .fs-two-col,
    .fs-amount-box,
    .fs-notice {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }
  }
`;

const FeeSlipTemplate = ({
  refSequence   = '001',
  name          = '',
  fatherName    = '',
  rollNumber    = '',
  course        = '',
  university    = '',
  address       = '',
  domain        = 'Full Stack Web Development',
  batchDateTime = '',
  amount        = 4999,
  paymentMode   = 'UPI',
  paymentDate,
  logoPath      = '/images/cs-logo.png',    // → 320 × 120 px recommended
  stampPath     = '/SignandStamp.png',      // → 300 × 240 px recommended
}) => {

  /* ── helpers ── */
  const refNumber = `CS/FEE/2026/${String(refSequence).padStart(3, '0')}`;

  const formatDate = (d) => {
    const dateObj = d ? new Date(d) : new Date();
    return dateObj.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  };

  const formatAmount = (n) =>
    '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const slipDate  = formatDate(paymentDate);
  const amountStr = formatAmount(amount);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="fs-page">

        {/* ══ HEADER ══ */}
        <div className="fs-header">
          <div className="fs-brand">
            <img src={logoPath} alt="Code Scaler" className="fs-logo" />
            <span className="fs-brand-name">Code Scaler</span>
          </div>
          <div className="fs-ref-area">
            <p>Ref No: <strong>{refNumber}</strong></p>
            <p>Date: {slipDate}</p>
            <p>www.codescaler.com</p>
            <p>+91 9588161422</p>
          </div>
        </div>

        {/* ══ BLUE DIVIDER ══ */}
        <div className="fs-divider" />

        {/* ══ BANNER ══ */}
        <div className="fs-banner">
          <span className="fs-banner-title">PAYMENT RECEIPT — INTERNSHIP FEE SLIP</span>
          <span className="fs-status-paid">✓ Paid</span>
        </div>

        {/* ══ TWO-COLUMN DETAILS ══ */}
        <div className="fs-two-col">

          {/* Student details card */}
          <div className="fs-card">
            <div className="fs-card-head">Student Details</div>
            <div className="fs-field">
              <span className="fs-field-label">Name</span>
              <span className="fs-field-value">{name}</span>
            </div>
            <div className="fs-field">
              <span className="fs-field-label">Father's Name</span>
              <span className="fs-field-value">{fatherName}</span>
            </div>
            <div className="fs-field">
              <span className="fs-field-label">Roll Number</span>
              <span className="fs-field-value">{rollNumber}</span>
            </div>
            <div className="fs-field">
              <span className="fs-field-label">Course / Branch</span>
              <span className="fs-field-value">{course}</span>
            </div>
            <div className="fs-field">
              <span className="fs-field-label">University</span>
              <span className="fs-field-value">{university}</span>
            </div>
            <div className="fs-field">
              <span className="fs-field-label">Address</span>
              <span className="fs-field-value">{address}</span>
            </div>
          </div>

          {/* Internship details card */}
          <div className="fs-card">
            <div className="fs-card-head">Internship Details</div>
            <div className="fs-field">
              <span className="fs-field-label">Organization</span>
              <span className="fs-field-value">Code Scaler, Jind, Haryana</span>
            </div>
            <div className="fs-field">
              <span className="fs-field-label">Program Track</span>
              <span className="fs-field-value">{domain}</span>
            </div>
            <div className="fs-field">
              <span className="fs-field-label">Duration</span>
              <span className="fs-field-value">2 Months (8 Weeks) | 5 Days/Week</span>
            </div>
            <div className="fs-field">
              <span className="fs-field-label">Batch Date &amp; Time</span>
              <span className="fs-field-value">{batchDateTime}</span>
            </div>
            <div className="fs-field">
              <span className="fs-field-label">Mentors</span>
              <span className="fs-field-value">Deepak &amp; Ajay, Co-Founders &amp; Trainers</span>
            </div>
          </div>

        </div>

        {/* ══ AMOUNT BOX ══ */}
        <div className="fs-amount-box">
          <div className="fs-amount-left">
            <div className="fs-amount-label">Total Fee Paid</div>
            <div className="fs-amount-value">{amountStr}</div>
            <div className="fs-mode-row">
              <span className="fs-mode-via">via</span>
              <span className="fs-mode-badge">{paymentMode}</span>
            </div>
          </div>
          <div className="fs-amount-right">
            <div className="fs-amount-program">{domain}</div>
            <div className="fs-amount-sub">Industrial Internship Program 2026</div>
            <div className="fs-amount-pdate">Payment Date: {slipDate}</div>
          </div>
        </div>

        {/* ══ NOTICE ══ */}
        <div className="fs-notice">
          This receipt confirms payment received by <strong>Code Scaler</strong> towards the
          Industrial Internship Program 2026. Please retain this document for your records and
          present it to your Training &amp; Placement Cell if required by your university.
        </div>

        {/* ══ SIGNATURE SECTION ══ */}
        <div className="fs-sig-section">

          <div className="fs-sig-col">
            <p className="fs-sig-for">For Code Scaler</p>
            <div className="fs-sig-bottom">
              {/* ▼ STAMP + SIGNATURE IMAGE */}
              <img src={stampPath} alt="Signature &amp; Stamp" className="fs-stamp" />
              <p className="fs-sig-name">Deepak</p>
              <p className="fs-sig-title">Co-Founder &amp; Trainer | Code Scaler</p>
              <p className="fs-sig-contact">Jind, Haryana | +91 9588161422</p>
            </div>
          </div>

          <div className="fs-sig-col">
            <p className="fs-sig-for">Acknowledged by (Student)</p>
            <div className="fs-sig-bottom fs-sig-lines">
              <p>Name: ___________________________</p>
              <p>Sign: &nbsp;&nbsp;___________________________</p>
              <p>Date: ___________________________</p>
            </div>
          </div>

        </div>

        {/* ══ FOOTER ══ */}
        <div className="fs-footer-divider" />
        <p className="fs-footer-main">
          Code Scaler | Jind, Haryana | www.codescaler.com | +91 9588161422
        </p>
        <p className="fs-footer-note">
          This is an official payment receipt issued by Code Scaler.
          Unauthorized reproduction or distribution is strictly prohibited.
        </p>

      </div>
    </>
  );
};

export default FeeSlipTemplate;
