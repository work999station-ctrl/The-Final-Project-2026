const puppeteer = require('puppeteer');

/**
 * Builds the agreement HTML document string from application data.
 * Mirrors the layout of AgreementPreview.jsx.
 */
const buildAgreementHTML = (application) => {
    const student = application.studentId;
    const offer   = application.offerId;
    const company = offer?.companyId;

    const studentName    = student?.name         || 'N/A';
    const studentYear    = student?.currentYear   || 'N/A';
    const studentDept    = student?.specialty      || 'Technology';
    const offerTitle     = offer?.title            || 'Internship Position';
    const companyName    = company?.companyName    || 'N/A';
    const internshipOffice = company?.internshipOffice || companyName;
    const universityName = student?.university     || 'N/A';
    const agreementId    = String(application._id);

    const today = new Date();
    const startDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const durationMonths = offer?.durationMonths || 6;
    const endDateObj = new Date(today);
    endDateObj.setMonth(endDateObj.getMonth() + durationMonths);
    const endDate = endDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const refNum = Math.floor(Math.random() * 900) + 100;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Internship Agreement — ${studentName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      background: #fff;
      color: #0f172a;
      font-size: 13px;
      line-height: 1.7;
    }

    .page {
      width: 794px;
      min-height: 1123px;
      margin: 0 auto;
      padding: 56px 64px;
      background: #fff;
      position: relative;
    }

    /* ── Dot pattern background ── */
    .page::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(#f1f5f9 0.5px, transparent 0.5px),
        radial-gradient(#f1f5f9 0.5px, #ffffff 0.5px);
      background-size: 20px 20px;
      background-position: 0 0, 10px 10px;
      pointer-events: none;
      z-index: 0;
    }

    .content { position: relative; z-index: 1; }

    /* ── WATERMARK ── */
    .watermark {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    .watermark span {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 110px;
      font-weight: 800;
      color: #0f172a;
      opacity: 0.03;
      transform: rotate(-45deg);
      white-space: nowrap;
    }

    /* ── HEADER ── */
    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 20px;
      border-bottom: 2.5px solid #0f172a;
      margin-bottom: 32px;
    }
    .doc-header .uni-info { display: flex; align-items: center; gap: 12px; }
    .doc-header .logo-box {
      width: 56px; height: 56px;
      background: #4f46e5;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      color: #fff;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 800;
      font-size: 18px;
      filter: grayscale(0.3);
    }
    .uni-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 15px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f172a;
    }
    .uni-dept { font-size: 11px; color: #64748b; font-family: monospace; margin-top: 2px; }
    .doc-title-block { text-align: right; }
    .doc-title-block h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.5px;
    }
    .doc-title-block p { font-size: 11px; color: #64748b; font-family: monospace; margin-top: 4px; }

    /* ── BADGE ── */
    .status-badge {
      display: inline-block;
      background: #dcfce7;
      color: #166534;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 100px;
      border: 1px solid #bbf7d0;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    /* ── BODY TEXT ── */
    .body-text { font-family: Georgia, 'Times New Roman', serif; font-size: 14px; color: #1e293b; }
    .body-text p { margin-bottom: 12px; }
    strong.highlight { background: #fef9c3; padding: 0 3px; border-radius: 2px; }

    ol { list-style: decimal; padding-left: 20px; margin-bottom: 12px; }
    ol li { margin-bottom: 12px; }
    ol li .sub { display: block; margin-left: 20px; margin-top: 4px; }

    /* ── ARTICLE ── */
    .article { margin-top: 22px; }
    .article-title {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }

    /* ── FOOTER / SIGNATURES ── */
    .footer-section {
      margin-top: 36px;
      padding-top: 20px;
      border-top: 1.5px solid #e2e8f0;
    }
    .sig-row { display: flex; justify-content: space-between; gap: 24px; margin-top: 20px; }
    .sig-box { flex: 1; text-align: center; }
    .sig-line {
      border-top: 1px solid #94a3b8;
      margin: 36px 16px 6px;
    }
    .sig-label { font-size: 10px; color: #64748b; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }

    /* ── QR / META ── */
    .meta-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20px;
      margin-top: 24px;
    }
    .meta-text p { font-size: 11px; color: #64748b; line-height: 1.6; }
    .meta-text .agr-id { font-family: monospace; font-size: 10px; color: #4f46e5; margin-top: 6px; }
    .qr-placeholder {
      width: 90px; height: 90px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #f8fafc;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      font-size: 9px;
      color: #94a3b8;
      text-align: center;
      padding: 6px;
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Watermark -->
  <div class="watermark"><span>FINAL COPY</span></div>

  <div class="content">

    <!-- Header -->
    <div class="doc-header">
      <div class="uni-info">
        <div class="logo-box">S</div>
        <div>
          <div class="uni-name">${universityName}</div>
          <div class="uni-dept">Department of ${studentDept}</div>
        </div>
      </div>
      <div class="doc-title-block">
        <h1>INTERNSHIP AGREEMENT</h1>
        <p>Ref: 2026-INT-${refNum}</p>
        <p style="margin-top:6px;"><span class="status-badge">✓ Validated</span></p>
      </div>
    </div>

    <!-- Body -->
    <div class="body-text">

      <p>This Tripartite Internship Agreement ("Agreement") is made and entered into on
        <strong class="highlight">${startDate}</strong>, by and between:</p>

      <ol>
        <li>
          <strong>The Student:</strong>
          <span class="sub">${studentName}, enrolled in ${studentYear}.</span>
        </li>
        <li>
          <strong>The Host Company:</strong>
          <span class="sub">${internshipOffice}, represented by <strong class="highlight">HR Management</strong>.</span>
        </li>
        <li>
          <strong>The Educational Institution:</strong>
          <span class="sub">${universityName}, represented by the Department Head.</span>
        </li>
      </ol>

      <div class="article">
        <div class="article-title">Article 1: Purpose &amp; Scope</div>
        <p>The purpose of this internship is to provide the Student with practical professional experience
          in the field of <strong>${offerTitle}</strong>. The Student will be integrated into the Host
          Organization's team to acquire critical skills and modern architectures related to the role.</p>
      </div>

      <div class="article">
        <div class="article-title">Article 2: Duration</div>
        <p>The internship shall commence on <strong class="highlight">${startDate}</strong> and shall
          terminate on <strong class="highlight">${endDate}</strong>.
          The weekly schedule will be full-time (40 hours/week) unless otherwise agreed upon in standard
          legal provisions.</p>
      </div>

      <div class="article">
        <div class="article-title">Article 3: Obligations of the Host Company</div>
        <p>The Host Company agrees to: (a) provide a suitable working environment; (b) assign a qualified
          supervisor; (c) not assign tasks unrelated to the internship objectives; (d) maintain
          confidentiality of the student's personal data.</p>
      </div>

      <div class="article">
        <div class="article-title">Article 4: Obligations of the Student</div>
        <p>The Student agrees to: (a) respect the internal regulations of the Host Company; (b) maintain
          confidentiality of all proprietary information; (c) submit required academic reports on schedule;
          (d) attend the internship for its full duration unless excused.</p>
      </div>

      <div class="article">
        <div class="article-title">Article 5: Insurance &amp; Liability</div>
        <p>During the internship, the Student remains affiliated with the University for social security
          purposes. Civil liability is covered under Policy Number
          <strong class="highlight" style="font-family:monospace;font-size:12px;">UNIV-INS-2026-8892</strong>.</p>
      </div>

      <div class="article">
        <div class="article-title">Article 6: Official Digital Documents &amp; Legal Validity</div>
        <p>This document is digitally issued and legally binding under Ministry of Higher Education
          standards. Authenticity is verified via the unique QR code, superseding physical signatures
          and stamps.</p>
      </div>

    </div><!-- /body-text -->

    <!-- Signatures -->
    <div class="footer-section">
      <div class="sig-row">
        <div class="sig-box">
          <div class="sig-line"></div>
          <div class="sig-label">Student<br/>${studentName}</div>
        </div>
        <div class="sig-box">
          <div class="sig-line"></div>
          <div class="sig-label">Company Representative<br/>${companyName}</div>
        </div>
        <div class="sig-box">
          <div class="sig-line"></div>
          <div class="sig-label">University Dept. Head<br/>${universityName}</div>
        </div>
      </div>
    </div>

    <!-- QR / Meta -->
    <div class="meta-row">
      <div class="meta-text">
        <p><strong style="font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;">Document Authenticity</strong></p>
        <p>Scan this QR code or visit the verification link to confirm the authenticity of this internship agreement.
           Each code is uniquely generated for <strong>${studentName}</strong>.</p>
        <p class="agr-id">ID: AGR-${agreementId}-${studentName.replace(/\s+/g,'').toUpperCase().slice(0,6)}</p>
      </div>
      <div class="qr-placeholder">
        QR Code<br/>(scan in app)
      </div>
    </div>

  </div><!-- /content -->
</div>
</body>
</html>`;
};

/**
 * Renders the agreement HTML to a PDF buffer using Puppeteer.
 * @param {object} application - Fully populated application document
 * @returns {Buffer} PDF bytes
 */
const generateAgreementPDF = async (application) => {
    const html = buildAgreementHTML(application);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
        });

        return pdfBuffer;
    } finally {
        await browser.close();
    }
};

module.exports = { generateAgreementPDF };
