# PDF CLI Tool

A command-line interface tool for manipulating PDF files. This tool provides simple commands to merge multiple PDFs into a single file and split PDFs into individual pages.

## Features

- **Merge PDFs**: Combine multiple PDF files into a single document
- **Split PDF**: Separate a PDF into individual pages as separate files

## Installation

Install globally using npm:

```bash
npm install -g @neilkrichi/pdf-cli
```

## Usage

### Merge PDFs

To combine multiple PDFs into a single file, use the following command:

```bash
pdf-cli merge document1.pdf document2.pdf -o merged.pdf
```

Options:
- `-o, --output`: Output filename (default: "merged.pdf")

### Split PDF

To split a PDF into separate pages:

```bash
pdf-cli split input.pdf -o output-folder
```

Options:
- `-o, --output`: Output folder (default: "output_pdfs")

### Spaces in file names

If you have spaces in the file names, you can use quotes around the file name:

```bash
pdf-cli merge "document 1.pdf" "document 2.pdf" -o "merged document.pdf"
pdf-cli split "document with spaces.pdf" -o "output_pdfs"
```

### File Overwrite Protection

The tool will warn you when files are about to be overwritten and ask for confirmation:

```bash
pdf-cli merge doc1.pdf doc2.pdf -o existing.pdf
⚠️  File "existing.pdf" already exists. Overwrite? (y/N)
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Issues

If you encounter any issues or have suggestions, please file them in the [GitHub repository](https://github.com/neilkrichi/pdf-cli/issues).

