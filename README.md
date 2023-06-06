# Dance Structure CLI Tool

> 💡 This project was forked from the [Song Structure](https://github.com/doesdev/song-structure) project by [doesdev](https://github.com/doesdev).

The Dance Structure CLI tool is a command-line tool for electronic music producers that allows you to quickly and easily generate a suggested song structure. By inputting your desired song duration, BPM (beats per minute), and beats per measure, the tool will suggest a possible structure for your song, taking into account standard electronic music song structure elements such as intro, verse, build, drop, break, and outro.

This tool can help you experiment with different song structures and give you a starting point for your production. Whether you're a seasoned producer or just starting out, this tool can help spark your creativity and streamline your workflow.

## Included Files

- `index.js`: This is the core file that contains the logic for generating the song structure. It exports a `suggestedStructure` function that takes in the desired song parts, total beats, and beats per measure, and outputs a suggested structure. It also exports a `partsDefinition` object that defines the different song parts and their attributes.

- `cli.js`: This file contains the code for the command-line interface (CLI) of the tool. It uses the `prompts` library to ask the user for input, calls the `suggestedStructure` function from `index.js` to generate the song structure, and prints the results to the console.

## Usage

1. Install the required dependencies:

   - You will need to have Node.js installed on your machine.

2. Run the `cli.js` file in your terminal:

   ```
   node cli.js
   ```

3. When prompted, input your desired song duration (in either `mm:ss`, `mmm:ss`, or decimal minutes format), BPM, and beats per measure. 

4. The tool will then prompt you to select the different parts of your song structure. You can choose from Intro, Verse, Build, Drop, Break, and Outro. You can select as many parts as you like, and the tool will balance them based on their defined weights.

5. Once you're done selecting parts, choose '(done)' to complete the process.

6. The tool will print the suggested song structure to the console. Each line will include a part of the song, the suggested number of bars for that part, and the total beats for that part.

## Contributing

Contributions are welcome! If you have any improvements or features you'd like to add, feel free to make a pull request.

## Contributors
Contributions are welcomed. This project follows the all-contributors spec. ([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/github/all-contributors/itsbrex/dance-structure?color=ee8449&style=flat-square)](#contributors)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

MIT © [itsbrex](https://github.com/itsbrex)

If you found this project interesting, please consider [sponsoring me](https://github.com/sponsors/itsbrex) or <a href="https://twitter.com/itsbrex">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
