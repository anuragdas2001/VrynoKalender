import slugify from "slugify";

export function getExportsSettings(reportFile: any) {
  const title = reportFile.name || "";
  const filename = `${slugify(title)}`;
  return {
    pdf: {
      title,
      author: "Vryno",
      subject: "Web Reporting",
      keywords: "reporting",
      printing: "none",
      copying: false,
      modifying: false,
      annotating: false,
      contentAccessibility: false,
      documentAssembly: false,
      pdfVersion: "1.7",
      autoPrint: true,
      filename: `${filename}.pdf`,
    },
    html: {
      title,
      filename: `${filename}.html`,
      autoPrint: true,
      multiPage: true,
      embedImages: "external",
      outputType: "html",
    },
  };
}
