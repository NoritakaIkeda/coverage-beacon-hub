# Coverage Beacon Hub - Claude Memory Management

## Project Overview
Coverage Beacon Hub is a React-based web application that serves as an OSS Test Coverage Analysis Platform. It visualizes and analyzes test coverage data for open-source repositories, providing insights into code quality, complexity, and testing thoroughness.

## Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS + Radix UI
- **Routing**: React Router DOM
- **State Management**: TanStack React Query + React Hook Form
- **Validation**: Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Platform**: Lovable.dev integration

## Key Scripts and Commands
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run build:dev    # Development build  
npm run lint         # ESLint code linting
npm run preview      # Preview production build
```

## Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui component library
│   ├── CodeAnalysis.tsx    # Code analysis visualization
│   ├── CoverageChart.tsx   # Coverage charts
│   ├── FunctionList.tsx    # Function listing component
│   ├── NaturalAnalysis.tsx # Natural language analysis
│   └── RepositoryCard.tsx  # Repository card component
├── data/               # Mock data and static data
│   └── mockData.ts     # Sample repository data
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── Index.tsx       # Main dashboard page
│   ├── NotFound.tsx    # 404 page
│   └── RepositoryDetail.tsx # Repository analysis detail
└── types/              # TypeScript definitions
    └── repository.ts   # Repository data models
```

## Key Entry Points
- **Main**: `src/main.tsx` - React application entry
- **App**: `src/App.tsx` - Main app with routing
- **Dashboard**: `src/pages/Index.tsx` - Repository overview
- **Detail**: `src/pages/RepositoryDetail.tsx` - Individual repository analysis

## Data Models (src/types/repository.ts)
Core interfaces include:
- `Repository` - Main repository data structure
- `CoverageData` - Coverage statistics and metrics  
- `FunctionData` - Function-level analysis data
- `AnalysisData` - Natural language analysis results

## Mock Data (src/data/mockData.ts)
Contains sample data for major OSS projects including:
- React, Vue.js, Angular, Node.js, Django, Rails, etc.
- Comprehensive coverage metrics and analysis data

## Current State
- **Testing**: No testing framework configured yet
- **Backend**: Currently uses mock data only
- **Deployment**: Integrated with Lovable platform
- **Code Quality**: ESLint configured for TypeScript

## Development Notes
- Uses shadcn/ui component system with Tailwind CSS
- Responsive design patterns throughout
- Japanese language support in natural analysis features
- Type-safe development with comprehensive TypeScript coverage
- No current backend integration - ready for API integration

## Architecture Evolution Plan

### Current State (Monolith)
- Single package structure
- Frontend-only React application
- Mock data driven
- No backend integration

### Target State (Monorepo with CLI Package)
Planned monorepo structure for natural language analysis feature:

```
coverage-beacon-hub/
├── packages/
│   ├── coverage-hub-web/        # Current React application
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
│   ├── coverage-analyzer-agent/ # New CLI tool for NL analysis
│   │   ├── src/
│   │   │   ├── analyzers/       # T-wada/Khorikov philosophy analyzers
│   │   │   ├── llm-integration/ # LLM API interfaces
│   │   │   ├── reporters/       # Natural language report generators
│   │   │   └── cli.ts          # CLI entry point
│   │   ├── tests/              # TDD-driven test suite
│   │   └── package.json
│   └── shared-types/           # Common TypeScript definitions
│       ├── src/
│       │   ├── repository.ts    # Moved from web package
│       │   └── analysis.ts      # New analysis types
│       └── package.json
├── package.json                # Workspace root
└── ...
```

### Natural Language Analysis Agent Features
Based on PRD Section 11 requirements:

1. **Complexity Analysis Engine**
   - Business logic complexity detection
   - Technical constraint identification
   - Historical context analysis

2. **Test Strategy Evaluator**
   - T-wada "behavior specification" validation
   - Vladimir Khorikov principles application
   - Test smell detection

3. **Strategic Assessment Generator**
   - Risk evaluation based on coverage + complexity
   - Change resilience assessment
   - Specification quality evaluation

### TDD Implementation Approach
Following T-wada's philosophy:
1. Write tests that describe expected behavior
2. Tests as executable specifications
3. Behavior-driven test design over implementation details

## Common Tasks
- **Adding new components**: Use shadcn/ui patterns and place in `src/components/`
- **New pages**: Add to `src/pages/` and update routing in `App.tsx`
- **Data types**: Update `src/types/repository.ts` (to be moved to shared-types)
- **Mock data**: Modify `src/data/mockData.ts`
- **Styling**: Use Tailwind CSS utilities, follow existing patterns
- **CLI Agent**: Develop in `packages/coverage-analyzer-agent/` with TDD approach

## Important Considerations
- Always run `npm run lint` before committing changes
- Follow existing TypeScript patterns and interfaces
- Maintain responsive design principles
- Consider accessibility with Radix UI components
- Keep mock data realistic and comprehensive for testing UI
- **New**: Apply T-wada TDD methodology for CLI agent development
- **New**: Focus on behavior specification over implementation details