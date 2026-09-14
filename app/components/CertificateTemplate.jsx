import React from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Great+Vibes&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; background: #0b1328; }
  @page { size: A4 landscape; margin: 0; }

  .certificate-page {
    position: relative;
    width: min(100vw, 1123px);
    aspect-ratio: 1123 / 794;
    overflow: hidden;
    background: #0b1328;
    color: #ffffff;
    font-family: "Poppins", "Montserrat", "Segoe UI", Arial, sans-serif;
  }

  .certificate-template {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .certificate-name {
    position: absolute;
    left: 0;
    top: 45.59%;
    width: 100%;
    text-align: center;
    font-family: "Great Vibes", "Segoe Script", cursive;
    font-size: min(5.16vw, 58px);
    line-height: 1;
    font-style: normal;
    font-weight: 400;
    color: #ffffff;
    text-shadow: 0 1px 5px rgba(255, 255, 255, 0.1);
    white-space: nowrap;
  }

  .certificate-name.is-long {
    font-size: min(4.1vw, 46px);
  }

  .certificate-ref {
    position: absolute;
    left: 15.14%;
    top: 78.72%;
    width: 19.15%;
    text-align: center;
    font-family: "DM Sans", "Segoe UI", Arial, sans-serif;
    font-size: min(1.78vw, 20px);
    line-height: 1;
    font-weight: 500;
    letter-spacing: 0.2px;
    color: #ffffff;
  }

  .certificate-date {
    position: absolute;
    left: 40.43%;
    top: 78.09%;
    width: 19.15%;
    height: 4.03%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0b1328;
    font-family: "DM Sans", "Segoe UI", Arial, sans-serif;
    font-size: min(1.78vw, 20px);
    line-height: 1;
    font-weight: 500;
    letter-spacing: 0.2px;
    color: #ffffff;
  }

  @media print {
    .certificate-page {
      width: 1123px;
      height: 794px;
    }

    .certificate-name {
      font-size: 58px;
    }

    .certificate-name.is-long {
      font-size: 46px;
    }

    .certificate-ref,
    .certificate-date {
      font-size: 20px;
    }
  }
`;

export default function CertificateTemplate({ name, refNo, issueDate, templatePath }) {
  const longName = name.length > 24;

  return (
    <main className="certificate-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <img className="certificate-template" src={templatePath} alt="" />
      <div className={`certificate-name${longName ? " is-long" : ""}`}>{name}</div>
      <div className="certificate-ref">{refNo}</div>
      {issueDate ? <div className="certificate-date">{issueDate}</div> : null}
    </main>
  );
}
