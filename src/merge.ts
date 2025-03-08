import { PDFDocument } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";
import chalk from "chalk";

export async function mergePDFs(files: string[], output: string) {
  try {
    console.log(chalk.blue("🔄 Merging PDFs..."));

    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      console.log(chalk.yellow(`📄 Adding ${file}...`));
      const pdfBytes = await readFile(file);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    await writeFile(output, mergedPdfBytes);

    console.log(chalk.green(`✅ Merged PDF saved as: ${output}`));
  } catch (error) {
    console.error(chalk.red("❌ Error merging PDFs: "), error);
  }
}
