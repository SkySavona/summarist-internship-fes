# Summarist E-Library Platform | Advanced Internship | FES

## Project Overview

The Summarist E-Library Platform is an interactive digital library that allows users to read and listen to their favorite books. The platform offers a variety of books sourced from external APIs, including recommended, suggested, and popular titles. Users can subscribe to a plan to gain access to premium content and manage their personal libraries through Firebase and Stripe integrations. This platform uses a subscription-based model with premium and basic access levels.

## Features

- **User Authentication:** Managed using Firebase authentication.
- **Subscription Plans:** Integrated with Stripe using the Firebase extension to handle payments and subscriptions.
- **Library Management:** Users can save books to their personal libraries, track finished books, and access premium content.
- **Book Recommendations:** Books are sourced from external APIs, allowing users to explore recommended and suggested books.
- **Book Player:** Users can listen to audio versions of the books directly on the platform.
- **Dynamic Content Loading:** Skeleton loaders and suspense-based loading for a smooth user experience.

## APIs Used

- **Get Book by ID:**
  ```bash
  https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}
  ```
- **Get Recommended Books:**
  ```bash
  https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended
  ```
- **Get Books by Author or Title:**
  ```bash
  https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${query}
  ```
- **Get Suggested Books:**
  ```bash
  https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested
  ```

## Project Structure

The project is organized into several directories, each serving a specific function:

```plaintext
├── public
│   ├── assets
│   └── icons
├── src
│   ├── app
│   │   ├── (sidebar)
│   │   │   ├── book
│   │   │   ├── for-you
│   │   │   ├── help
│   │   │   ├── my-library
│   │   │   ├── settings
│   │   │   └── layout.tsx
│   │   ├── api
│   │   │   ├── create-checkout-session
│   │   │   ├── library
│   │   │   └── premium-status
│   │   ├── canceled
│   │   ├── choose-plan
│   │   ├── confirmation
│   │   ├── player/[id]
│   │   └── providers
│   ├── components
│   │   ├── auth
│   │   ├── layout
│   │   └── ui
│   ├── constants
│   ├── lib
│   ├── services
│   ├── stripe
│   └── types
├── README.md
├── package.json
└── tailwind.config.ts
```

### Explanation of Key Directories

- **app/sidebar:** Contains components related to the sidebar and different sections of the app, like books, library, and settings.
- **app/api:** Houses server-side logic for handling API requests, such as creating checkout sessions and managing the user library.
- **components:** Contains reusable components, including authentication, UI elements, and layout components.
- **services:** Includes Firebase configuration and other services.
- **stripe:** Manages Stripe payment integration and user subscription status checks.
- **lib:** Utility functions used throughout the app.
- **constants:** Holds constants used across the application.
- **types:** TypeScript type declarations and interfaces.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Firebase account with Firestore enabled
- Stripe account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-url.git
   cd your-repo-folder
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   STRIPE_SECRET_KEY=your-stripe-secret-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

### Deployment

You can deploy the project using platforms like Vercel, Netlify, or Firebase Hosting.

## Contributing

Contributions are welcome! Please create a pull request for any enhancements, bug fixes, or features you would like to see added.

## License

This project is licensed under the MIT License.
