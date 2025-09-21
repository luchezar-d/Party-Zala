<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Party Zala Development Guidelines

This is a monorepo for a kids' party calendar application with a React frontend and Node.js backend.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Monorepo**: npm workspaces with `client/` and `server/` directories
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens stored in httpOnly cookies

## Design Principles
- **Colorful but tasteful**: Use the defined color palette for a kid-friendly but professional look
- **Responsive**: Mobile-first design approach
- **Accessible**: Proper ARIA labels, focus management, and keyboard navigation
- **Type-safe**: Strict TypeScript configuration throughout

## Code Style
- Use Tailwind CSS utility classes instead of custom CSS
- Prefer functional components with hooks
- Use Zustand for client-side state management
- Validate all inputs with Zod schemas
- Handle errors gracefully with user-friendly messages

## Color Palette
- **Primary**: Pink tones (`primary-*` classes)
- **Secondary**: Sky blue tones (`secondary-*` classes)  
- **Accent**: Amber/yellow tones (`accent-*` classes)
- **Success**: Green tones (`success-*` classes)

## API Guidelines
- All party routes require authentication
- Use consistent error response format
- Validate request data with Zod
- Handle database errors appropriately
- Use proper HTTP status codes

## Security
- Never expose passwords or sensitive data
- Use httpOnly cookies for JWT tokens
- Validate and sanitize all inputs
- Implement proper CORS policies
- Use rate limiting on authentication endpoints

## File Organization
- Keep components small and focused
- Use TypeScript interfaces for data models
- Organize by feature, not by file type
- Use absolute imports for better maintainability

When suggesting code changes, ensure they follow these guidelines and maintain consistency with the existing codebase.
