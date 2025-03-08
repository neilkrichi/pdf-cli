import { PDFDocument } from "pdf-lib";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import chalk from "chalk";
import { confirmOverwrite } from "./utils";

interface PageRange {
  start: number;
  end: number;
}

export async function splitPDF(
  file: string, 
  outputFolder: string = "output_pdfs",
  rangeString?: string
) {
  try {
    console.log(chalk.blue("🔄 Processing PDF..."));

    // Parse range string if provided
    let pageRange: PageRange | undefined;
    if (rangeString) {
      const [start, end] = rangeString.split('-').map(Number);
      pageRange = { start, end };
    }

    const normalizedFile = path.normalize(file);
    const normalizedOutputFolder = path.normalize(outputFolder);
    const baseFileName = path.basename(normalizedFile, '.pdf');

    if (!existsSync(normalizedOutputFolder)) {
      console.log(chalk.yellow(`📁 Creating folder: ${normalizedOutputFolder}`));
      await mkdir(normalizedOutputFolder, { recursive: true });
    }

    const pdfBytes = await readFile(normalizedFile);
    const pdf = await PDFDocument.load(pdfBytes);
    
    // Validate page range
    const totalPages = pdf.getPageCount();
    let startPage = 1;
    let endPage = totalPages;

    if (pageRange) {
      if (pageRange.start < 1 || pageRange.end > totalPages || pageRange.start > pageRange.end) {
        throw new Error(`Invalid page range. Document has ${totalPages} pages. Requested range: ${pageRange.start}-${pageRange.end}`);
      }
      startPage = pageRange.start;
      endPage = pageRange.end;
    }

    // Convert to 0-based index for internal use
    const startIndex = startPage - 1;
    const endIndex = endPage - 1;

    if (pageRange) {
      // Create a single PDF with the selected range
      const outputPath = path.join(
        normalizedOutputFolder, 
        `${baseFileName}-pages-${startPage}-to-${endPage}.pdf`
      );

      if (existsSync(outputPath)) {
        const shouldContinue = await confirmOverwrite(outputPath);
        if (!shouldContinue) {
          console.log(chalk.yellow("⚠️  Operation cancelled"));
          process.exit(0);
        }
      }

      const newPdf = await PDFDocument.create();
      const pageIndexes = Array.from(
        { length: endIndex - startIndex + 1 }, 
        (_, i) => startIndex + i
      );
      const copiedPages = await newPdf.copyPages(pdf, pageIndexes);
      copiedPages.forEach(page => newPdf.addPage(page));

      const newPdfBytes = await newPdf.save();
      await writeFile(outputPath, newPdfBytes);

      console.log(chalk.green(`✅ Saved: ${outputPath}`));
      console.log(chalk.green(`🎉 Extraction completed successfully! Pages ${startPage}-${endPage}`));
    } else {
      // Split into individual pages
      console.log(chalk.blue(`📄 Splitting into ${totalPages} individual pages...`));
      
      for (let i = startIndex; i <= endIndex; i++) {
        const pageNum = i + 1;
        const outputPath = path.join(
          normalizedOutputFolder, 
          `${baseFileName}-page-${pageNum}.pdf`
        );

        if (existsSync(outputPath)) {
          const shouldContinue = await confirmOverwrite(outputPath);
          if (!shouldContinue) {
            console.log(chalk.yellow(`⚠️  Skipping page ${pageNum}`));
            continue;
          }
        }

        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(copiedPage);

        const newPdfBytes = await newPdf.save();
        await writeFile(outputPath, newPdfBytes);

        console.log(chalk.green(`✅ Saved page ${pageNum}: ${outputPath}`));
      }
      console.log(chalk.green(`🎉 Split completed successfully! Created ${totalPages} files`));
    }
  } catch (error) {
    console.error(chalk.red("❌ Error processing PDF: "), error);
    process.exit(1);
  }
}
