# Valentine Web App

## Overview
The Valentine Web App is a fun and interactive web application designed to celebrate love and friendship. It features a visually appealing purple and black theme, smooth transitions between cards, and an infinite running carousel in the background. Users can engage with quirky questions and ultimately receive a heartfelt invitation to be someone's valentine, accompanied by the song "Lover" by Taylor Swift.

## Features
- **Purple and Black Theme**: A cohesive and attractive color scheme that enhances the user experience.
- **Card Transitions**: Smooth transitions between 5-7 cards, each displaying unique messages and quirky questions.
- **Infinite Carousel**: A background carousel that runs infinitely, adding dynamic visuals to the app.
- **Interactive Questions**: Quirky questions presented with checkboxes for user interaction.
- **Final Card**: A special card asking if the user would be my valentine, featuring the song "Lover" by Taylor Swift.

## Project Structure
```
valentine-web-app
├── public
│   ├── index.html
│   └── assets
│       └── audio
│           └── lover.mp3
├── src
│   ├── index.js
│   ├── components
│   │   ├── Card.js
│   │   └── Carousel.js
│   ├── styles
│   │   ├── main.css
│   │   └── theme.css
│   └── data
│       └── cards.json
├── package.json
├── .gitignore
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd valentine-web-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Start the application:
   ```
   npm start
   ```

## Usage
- Open your browser and navigate to `http://localhost:3000` to view the application.
- Interact with the cards and answer the quirky questions.
- Enjoy the background music and the final card invitation!

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.