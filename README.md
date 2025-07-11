# Metro HCMC Frontend

A modern React-based frontend application for the Ho Chi Minh City Metro system, built with TypeScript and Vite.

## 🚀 Live Demo

Visit the live application: [https://metro-hcmc.vercel.app](https://metro-hcmc.vercel.app)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Build](#build)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🚇 Metro route information and navigation
- 📱 Responsive design for mobile and desktop
- 🌐 Internationalization support (i18next)
- 📊 Interactive charts and data visualization
- 🎨 Modern UI with Ant Design and Material Tailwind
- ⚡ Fast loading with optimized builds
- 🔥 Hot reload for development

## 🛠 Tech Stack

- **Framework**: React 19.1.0
- **Language**: TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: 
  - Tailwind CSS 4.1.7
  - Ant Design 5.25.2
  - Material Tailwind 2.1.10
  - Sass/SCSS
- **State Management**: TanStack React Query 5.76.1
- **HTTP Client**: Axios 1.9.0
- **Charts**: ApexCharts 4.7.0
- **Icons**: 
  - Ant Design Icons 5.6.1
  - Lucide React 0.514.0
- **Routing**: React Router DOM 7.6.0
- **Internationalization**: react-i18next 15.5.2
- **Notifications**: React Hot Toast 2.5.2

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/SWD-metro/metro-fe.git
cd metro-fe
```

2. Navigate to the frontend directory:
```bash
cd metro-app-fe
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

## 💻 Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview the production build locally

## 🏗 Build

To create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
metro-app-fe/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   ├── styles/        # Global styles
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
├── package.json       # Project dependencies and scripts
└── vite.config.ts     # Vite configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow TypeScript best practices
- Use ESLint rules for code consistency
- Write meaningful commit messages
- Test your changes before submitting PRs
- Follow the existing code structure and naming conventions

## 🚇 About the Project

This frontend application provides users with comprehensive information about the Ho Chi Minh City Metro system, including route planning, station information, and real-time updates. The application is designed to be user-friendly and accessible across all devices.

## 📞 Support

If you encounter any issues or have questions, please open an issue on the [GitHub repository](https://github.com/SWD-metro/metro-fe/issues).

---

**Built with ❤️ by the SWD Metro Team**
