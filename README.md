# PDF CLI Tool

A command-line interface tool for manipulating PDF files. This tool provides simple commands to merge multiple PDFs into a single file and split PDFs into individual pages.

## Features

- **Merge PDFs**: Combine multiple PDF files into a single document
- **Split PDF**: Separate a PDF into individual pages as separate files

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pdf-cli.git
cd pdf-cli
```

2. Install dependencies:

```bash
npm install
```

3. Build and link the project:

```bash
npm run build
npm link
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

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes and commit them
4. Push to your fork
5. Create a pull request

