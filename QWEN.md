# Stoppclock - Professional Timer Toolkit

## Project Overview

Stoppclock is an elegant, minimalist web-based timer toolkit that offers multiple timer types including stopwatch, countdown, alarm clock, interval timer, digital clock, metronome, chess clock, and lap timer. The application is built with modern web technologies including React, TypeScript, Tailwind CSS, and Vite.

### Key Features
- **Multi-Timer Support** - Up to 3 simultaneous timers can run in parallel
- **Live Synchronization** - Timers continue running in the background even when navigating away
- **Elegant Timer Bar** - Shows all active timers in a bottom bar with color coding
- **Timer Types** - Stopwatch, Countdown, Interval Timer, Digital Clock, Alarm Clock, Metronome, Chess Clock, Lap Timer, and Pomodoro Timer
- **Responsive Design** - Works on all device sizes
- **Fullscreen Mode** - For presentations and large displays
- **Precise Timing** - 10ms update interval for exact time measurement

### Technologies Used
- **Framework**: React (v18.3.1) with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives with custom styling

## Project Structure

```
quick-times/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   └── ui/            # shadcn/ui components
│   ├── contexts/          # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components for each timer type
│   ├── App.tsx           # Main application router
│   ├── main.tsx          # Application entry point
│   └── ...               # Other root files
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
├── vite.config.ts        # Vite build configuration
├── tsconfig.json         # TypeScript configuration
└── index.html           # HTML entry point
```

## Building and Running

### Development
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Or with npm
npm install
npm run dev
```

### Production Build
```bash
# Build for production
bun run build

# Preview production build
bun run preview

# Or with npm
npm run build
npm run preview
```

### Additional Scripts
- `npm run lint` - Run ESLint for code quality checks
- `npm run prestart` - Builds the project before starting
- `npm run start` - Starts the production server on PORT (defaults to 8080)

## Architecture

### Timer Management
The application uses a `TimerContext` to manage all active timers globally. Each timer runs with a 10ms precision interval for accurate timing. The `ActiveTimerBar` component displays running timers at the bottom of the screen, allowing users to switch between them seamlessly.

### Component Organization
- **Pages**: Each timer type has its own page component (in `/src/pages/`) that implements the specific functionality
- **Components**: Reusable UI elements and custom components
- **Contexts**: Global state management using React Context
- **UI Components**: Styled components using shadcn/ui and Tailwind CSS

### Internationalization
The application includes an `I18nContext` for handling multiple languages, with a language toggle component.

## Key Files

- `src/contexts/TimerContext.tsx` - Manages all active timers with precise timing
- `src/components/ActiveTimerBar.tsx` - Displays active timers with color coding
- `src/App.tsx` - Main application router with all timer routes
- `src/pages/*.tsx` - Individual timer implementations
- `tailwind.config.ts` - Custom theme colors for each timer type
- `vite.config.ts` - Build configuration with development server settings

## Styling and Theming

The application uses a custom color palette defined in CSS variables for each timer type:
- `--stopwatch`: hsl(var(--stopwatch))
- `--countdown`: hsl(var(--countdown))
- `--interval`: hsl(var(--interval))
- `--clock`: hsl(var(--clock))
- `--alarm`: hsl(var(--alarm))
- `--metronome`: hsl(var(--metronome))
- `--chess`: hsl(var(--chess))
- `--lap`: hsl(var(--lap))

This allows for consistent color coding across all timer types and creates an aesthetically pleasing experience with glasmorphism effects and gradients.

## Development Conventions

### TypeScript
- Strict null checks disabled for better compatibility
- Path aliases configured for cleaner imports (`@/*` maps to `./src/*`)

### React
- Functional components with hooks
- Context API for global state management
- Custom hooks for reusable logic
- Component-based architecture with shadcn/ui patterns

### Tailwind CSS
- Utilizes the default shadcn/ui component structure
- Custom color variables for each timer type
- Responsive design patterns with mobile-first approach
- Glasmorphism effects using backdrop filters

## Deployment

The application is designed for deployment via Vite build process with special handling for SPA routing:

```bash
# The build command includes post-processing for SPA routing
bun run build
# Creates a 404.html file as fallback for client-side routing
```

The project supports custom domains and includes proper SEO meta tags and JSON-LD structured data for each timer type.

## Environment Configuration

The application can be configured via environment variables:
- `PORT` - Port for the development/preview server (default: 8080)
- `HOST` - Host address for the development server (default: 127.0.0.1)
- `BASE_PATH` - Base URL path for the application (default: "./")

## Testing and Quality Assurance

The project includes:
- ESLint for code quality and consistency
- TypeScript for type safety
- ARIA-compliant components for accessibility
- Responsive design for all screen sizes