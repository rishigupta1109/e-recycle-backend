const PDFDocument = require("pdfkit");
const fs = require("fs");
const generateCertificate = async (name) => {
  const doc = new PDFDocument({
    layout: "landscape",
    size: "A4",
  });

  // Helper to move to next line
  function jumpLine(doc, lines) {
    for (let index = 0; index < lines; index++) {
      doc.moveDown();
    }
  }

  doc.pipe(fs.createWriteStream("output.pdf"));

  doc.rect(0, 0, doc.page.width, doc.page.height).fill("#fff");

  doc.fontSize(10);

  // Margin
  const distanceMargin = 18;

  doc
    .fillAndStroke("#228b22")
    .lineWidth(20)
    .lineJoin("round")
    .rect(
      distanceMargin,
      distanceMargin,
      doc.page.width - distanceMargin * 2,
      doc.page.height - distanceMargin * 2
    )
    .stroke();

  // Header
  const maxWidth = 140;
  const maxHeight = 70;

  doc.image(
    "./assets/logo-transparent.png",
    doc.page.width / 2 - maxWidth / 2,
    60,
    {
      fit: [maxWidth, maxHeight],
      align: "center",
    }
  );

  jumpLine(doc, 5);

  doc
    .font("fonts/NotoSansJP-Light.otf")
    .fontSize(10)
    .fill("#021c27")
    .text("E RecycleBin", {
      align: "center",
    });

  jumpLine(doc, 2);

  // Content
  doc
    .font("fonts/NotoSansJP-Regular.otf")
    .fontSize(16)
    .fill("#021c27")
    .text("CERTIFICATE OF APPRECIATION", {
      align: "center",
    });

  jumpLine(doc, 1);

  doc
    .font("fonts/NotoSansJP-Light.otf")
    .fontSize(10)
    .fill("#021c27")
    .text("Present to", {
      align: "center",
    });

  jumpLine(doc, 2);

  doc
    .font("fonts/NotoSansJP-Bold.otf")
    .fontSize(24)
    .fill("#021c27")
    .text(name, {
      align: "center",
    });

  jumpLine(doc, 1);

  doc
    .font("fonts/NotoSansJP-Light.otf")
    .fontSize(10)
    .fill("#021c27")
    .text(
      "Successfully Recycled an E waste and made a small step towards saving the enviroment.",
      {
        align: "center",
      }
    );

  jumpLine(doc, 7);

  doc.lineWidth(1);

  // Signatures
  const lineSize = 174;
  const signatureHeight = 390;

  doc.fillAndStroke("#021c27");
  doc.strokeOpacity(0.2);

  const startLine1 = 128;
  const endLine1 = 128 + lineSize;

  const startLine2 = endLine1 + 32;
  const endLine2 = startLine2 + lineSize;

  const startLine3 = endLine2 + 32;
  const endLine3 = startLine3 + lineSize;
  doc
    .moveTo(startLine3, signatureHeight)
    .lineTo(endLine3, signatureHeight)
    .stroke();

  doc
    .font("fonts/NotoSansJP-Bold.otf")
    .fontSize(10)
    .fill("#021c27")
    .text("Aarushi Jain", startLine3, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center",
    });

  doc
    .font("fonts/NotoSansJP-Light.otf")
    .fontSize(10)
    .fill("#021c27")
    .text("Director", startLine3, signatureHeight + 25, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center",
    });

  jumpLine(doc, 4);

  // Validation link
  const link = "https://validate-your-certificate.hello/validation-code-here";

  const linkWidth = doc.widthOfString(link);
  const linkHeight = doc.currentLineHeight();

  doc.end();
};

exports.generateCertificate = generateCertificate;
