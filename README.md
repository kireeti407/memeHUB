
# memeHUB

memeHUB is a web application for creating, sharing, and interacting with memes. Users can sign up, log in, create memes with custom captions, like/dislike/comment on memes, and manage their profiles. The app features a trending feed, dark mode, and AI-powered meme caption suggestions.

## Features

- **User Authentication:** Sign up and log in securely.
- **Create Memes:** Upload images, add top/bottom text, and generate memes using a built-in editor.
- **AI Caption Suggestion:** Get witty meme captions using Gemini AI.
- **Trending Feed:** View and interact with trending memes from all users.
- **Like, Dislike, Comment:** Engage with memes by liking, disliking, and commenting.
- **Profile Management:** Edit your profile, upload a profile picture, and view your own memes.
- **Dark Mode:** Toggle between light and dark themes.

## Tech Stack

- HTML, CSS, JavaScript (Vanilla)
- Firebase Authentication & Realtime Database
- Cloudinary (for image uploads)
- Gemini AI (for caption suggestions)

## Project Structure

- `index.html` / `index.js`: Landing page and trending memes feed
- `js/login.html`, `js/signup.html`: Authentication pages
- `js/dashboard.html`, `js/dashboard.js`: User dashboard and meme feed
- `js/creatememe.html`, `js/cretememe.js`: Meme creation page and logic
- `stylesheet/`: CSS files for each page
- `main.js`: Firebase configuration and export

## Getting Started

1. **Clone the repository:**
	```
	git clone <repo-url>
	```
2. **Open `index.html` in your browser.**
3. **Sign up or log in to start creating and interacting with memes!**

## Usage

- **Create an Account:** Click 'Sign Up' and fill in your details.
- **Log In:** Use your credentials to access the dashboard.
- **Create a Meme:** Go to 'Create Meme', upload an image, add captions, and publish.
- **Interact:** Like, dislike, and comment on memes in the feed.
- **Edit Profile:** Update your name and profile picture from the dashboard.
- **Dark Mode:** Use the 🌙/☀️ button to toggle themes.

## Credits

- Built with Firebase, Cloudinary, and Gemini AI.

---
Enjoy sharing and discovering memes on memeHUB!
