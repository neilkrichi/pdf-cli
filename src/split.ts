import { PDFDocument } from "pdf-lib";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import chalk from "chalk";
import { confirmOverwrite } from "./utils";

export async function splitPDF(file: string, outputFolder: string = "output_pdfs") {
  try {
    console.log(chalk.blue("🔄 Splitting PDF..."));

    const normalizedFile = path.normalize(file);
    const normalizedOutputFolder = path.normalize(outputFolder);
    const baseFileName = path.basename(normalizedFile, '.pdf');

    if (!existsSync(normalizedOutputFolder)) {
      console.log(chalk.yellow(`📁 Creating folder: ${normalizedOutputFolder}`));
      await mkdir(normalizedOutputFolder, { recursive: true });
    }

    const pdfBytes = await readFile(normalizedFile);
    const pdf = await PDFDocument.load(pdfBytes);
    
    // Check for existing files before processing
    const existingFiles = [];
    for (let i = 0; i < pdf.getPageCount(); i++) {
      const outputPath = path.join(
        normalizedOutputFolder, 
        `${baseFileName}-page-${i + 1}.pdf`
      );
      if (existsSync(outputPath)) {
        existingFiles.push(outputPath);
      }
    }

    if (existingFiles.length > 0) {
      console.log(chalk.yellow("\n⚠️  The following files already exist:"));
      existingFiles.forEach(file => console.log(chalk.yellow(`   ${file}`)));
      
      const shouldContinue = await confirmOverwrite("these files");
      if (!shouldContinue) {
        console.log(chalk.yellow("⚠️  Operation cancelled"));
        process.exit(0);
      }
    }

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(copiedPage);

      const newPdfBytes = await newPdf.save();
      const outputPath = path.join(
        normalizedOutputFolder, 
        `${baseFileName}-page-${i + 1}.pdf`
      );
      await writeFile(outputPath, newPdfBytes);

      console.log(chalk.green(`✅ Saved: ${outputPath}`));
    }

    console.log(chalk.green("🎉 Splitting completed successfully!"));
  } catch (error) {
    console.error(chalk.red("❌ Error splitting PDF: "), error);
    process.exit(1);
  }
}
