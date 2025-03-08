# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-03-19

### Added
- Initial release
- `merge` command to combine multiple PDFs into a single file
- `split` command to separate a PDF into individual pages
- File overwrite protection with interactive confirmation
- Support for filenames with spaces
- Colored console output for better user experience
- Default output options (`merged.pdf` for merge, `output_pdfs` for split)
- Error handling with descriptive messages
- Progress indicators for merge and split operations

### Features
- Merge multiple PDFs with customizable output filename
- Split PDF into separate pages with customizable output directory
- Handle spaces in filenames
- Confirm before overwriting existing files
- Colorful terminal output for better user experience
- Clear error messages and operation status 