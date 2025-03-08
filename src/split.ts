import { PDFDocument } from "pdf-lib";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import chalk from "chalk";

export async function splitPDF(file: string, outputFolder: string) {
  try {
    console.log(chalk.blue("🔄 Splitting PDF..."));

    if (!existsSync(outputFolder)) {
      console.log(chalk.yellow(`📁 Creating folder: ${outputFolder}`));
      await mkdir(outputFolder);
    }

    const pdfBytes = await readFile(file);
    const pdf = await PDFDocument.load(pdfBytes);

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(copiedPage);

      const newPdfBytes = await newPdf.save();
      const outputPath = path.join(outputFolder, `page-${i + 1}.pdf`);
      await writeFile(outputPath, newPdfBytes);

      console.log(chalk.green(`✅ Saved: ${outputPath}`));
    }

    console.log(chalk.green("🎉 Splitting completed successfully!"));
  } catch (error) {
    console.error(chalk.red("❌ Error splitting PDF: "), error);
  }
}
