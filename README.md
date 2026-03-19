# receitas 🍲

Work in progress.

A digital archive of my grandmother's handwritten recipes — built to preserve and share them beyond paper.

## What is this?

This project digitizes a collection of family recipes originally written by hand. The recipes are stored in a structured **XML file** and rendered as an interactive webpage using vanilla HTML, CSS, and JavaScript.

The pipeline works like this:

1. **OCR with Qwen 2.5-VL** — the handwritten recipe cards are read and transcribed using [Qwen 2.5-VL](https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct), a vision-language model capable of handling handwritten text.
2. **XML structuring** — the transcribed text is organized into a clean, consistent XML format (`receitas.xml`), with fields for title, ingredients, and instructions.
3. **Browser rendering** — `receitas.js` parses the XML on the client side and builds the recipe cards dynamically in the page.

## Files

| File | Description |
|---|---|
| `index.html` | Main webpage |
| `receitas.css` | Styling |
| `receitas.js` | XML parsing and dynamic rendering |
| `receitas.xml` | Structured recipe data |

## Status

The project is under active development. More recipes are being added and the interface is still being refined.
