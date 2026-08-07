import React from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Great+Vibes&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; background: #0b1328; }
  @page { size: A4 landscape; margin: 0; }

  .certificate-page {
    position: relative;
    width: 1123px;
    height: 794px;
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
    top: 362px;
    width: 100%;
    text-align: center;
    font-family: "Great Vibes", "Segoe Script", cursive;
    font-size: 58px;
    line-height: 1;
    font-style: normal;
    font-weight: 400;
    color: #ffffff;
    text-shadow: 0 1px 5px rgba(255, 255, 255, 0.1);
    white-space: nowrap;
  }

  .certificate-name.is-long {
    font-size: 46px;
  }

  .certificate-ref {
    position: absolute;
    left: 170px;
    top: 625px;
    width: 215px;
    text-align: center;
    font-family: "DM Sans", "Segoe UI", Arial, sans-serif;
    font-size: 20px;
    line-height: 1;
    font-weight: 500;
    letter-spacing: 0.2px;
    color: #ffffff;
  }
`;

export default function CertificateTemplate({ name, refNo, templatePath }) {
  const longName = name.length > 24;

  return (
    <main className="certificate-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <img className="certificate-template" src={templatePath} alt="" />
      <div className={`certificate-name${longName ? " is-long" : ""}`}>{name}</div>
      <div className="certificate-ref">{refNo}</div>
    </main>
  );
}
