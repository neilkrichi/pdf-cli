import { PDFDocument } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";
import chalk from "chalk";
import path from "path";
import { confirmOverwrite } from "./utils";

export async function mergePDFs(files: string[], output: string = "merged.pdf") {
  try {
    console.log(chalk.blue("🔄 Merging PDFs..."));

    // Check if output file exists
    const normalizedOutput = path.normalize(output);
    const shouldContinue = await confirmOverwrite(normalizedOutput);
    
    if (!shouldContinue) {
      console.log(chalk.yellow("⚠️  Operation cancelled"));
      process.exit(0);
    }

    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      // Normalize the path to handle spaces and special characters
      const normalizedPath = path.normalize(file);
      console.log(chalk.yellow(`📄 Adding ${normalizedPath}...`));
      
      try {
        const pdfBytes = await readFile(normalizedPath);
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } catch (fileError) {
        console.error(chalk.red(`❌ Error processing ${normalizedPath}: `), fileError);
        throw new Error(`Failed to process ${normalizedPath}`);
      }
    }

    const mergedPdfBytes = await mergedPdf.save();
    await writeFile(normalizedOutput, mergedPdfBytes);

    console.log(chalk.green(`✅ Merged PDF saved as: ${normalizedOutput}`));
  } catch (error) {
    console.error(chalk.red("❌ Error merging PDFs: "), error);
    process.exit(1);
  }
}
