#!/usr/bin/env node
import { Command } from "commander";
import { mergePDFs } from "./merge";
import { splitPDF } from "./split";

const program = new Command();

program
  .name("pdf-cli")
  .description("A CLI tool to merge and split PDFs")
  .version("1.0.0");

program
  .command("merge <files...>")
  .description("Merge multiple PDFs into one")
  .option("-o, --output <output>", "Output file name", "merged.pdf")
  .action((files, options) => {
    mergePDFs(files, options.output);
  });

program
  .command("split <file>")
  .description("Split a PDF into separate pages")
  .option("-o, --output <folder>", "Output folder", "output_pdfs")
  .action((file, options) => {
    splitPDF(file, options.output);
  });

program.parse(process.argv);
