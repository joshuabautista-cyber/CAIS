# Copilot Instructions

This is an Expo-based React Native student information system with role-based navigation. Understand the architecture before making changes.

## Architecture Overview

**Stack-based Navigation Architecture:**
- Root layout (`app/_layout.js`) configures Stack navigator with four screen groups
- Login screen (`app/index.js`) → successful auth routes to tabs
- Bottom tab navigation (`app/(tabs)/*`) handles main features: registration, grades, home, modules, profile
- Modal stack (`app/(settings)/*`) for user settings (change password, edit profile)
- Sub-stack (`app/(modules)/*`) for module-specific forms (enrollment, graduation, LOA, etc.)

**Key Navigation Pattern:** All screens use `expo-router` with file-based routing. Directory parentheses like `(tabs)`, `(modules)`, `(settings)` are route groups—they don't create URL segments but organize screens logically.

## Styling & UI System

**Tailwind + NativeWind Integration:**
- Tailwind CSS configured via `tailwind.config.js` with custom Montserrat font weights
- `nativewind` (v4.2.1) bridges Tailwind to React Native via className syntax
- Metro config (`metro.config.js`) processes CSS through NativeWind
- Babel preset includes NativeWind JSX transformation for className support

**Design System:**
- Primary color: `#0a5419` (dark green) for tab bar and accents
- Accent color: `#ffd700` (gold) for active tab states
- LinearGradient components use green gradients (`#8ddd9eff` → `#11581bff`)
- Custom font: Montserrat (18 weights loaded in root layout)
- All screens use `headerShown: false` for custom header control

## API Integration

**Backend Communication:**
- Axios HTTP client (`package.json` shows v1.13.2)
- API base URL: `http://192.168.107.101:8000/api` (hardcoded in `app/index.js`)
- Authentication flow: POST `/login` with email/password returns status 200 on success
- No persistent token storage visible—consider implementing AsyncStorage for auth tokens
- Error handling uses React Native `Alert` component for user feedback

**Critical Note:** The hardcoded API endpoint with local IP suggests development environment. Production deployment will need environment variable configuration.

## Development Workflows

**Start Development:**
```bash
npm start          # Start Metro bundler
npm run android    # Build for Android
npm run ios        # Build for iOS
npm run web        # Run web version
```

**Common Tasks:**
- Add new tab screen: Create file in `app/(tabs)/` matching the route name, register in `app/(tabs)/_layout.js`
- Add form/modal: Create in `app/(modules)/` or `app/(settings)/`, routed via Stack.Screen name
- Update styling: Modify `global.css` or use className attributes (NativeWind converts to StyleSheet)

## Project-Specific Conventions

1. **Montserrat Font Usage:** Always reference via `fontFamily: 'montserrat-{weight}'` or className `font-montserrat-{weight}`. Weights loaded: thin, extralight, light, regular, medium, semibold, bold, extrabold, black.

2. **Color Scheme:** Use hardcoded hex values matching the green/gold palette (primary: `#0a5419`, accent: `#ffd700`). Avoid random colors.

3. **Component Structure:** Wrap major sections with LinearGradient for consistent visual hierarchy. Example in `app/(tabs)/home.js` shows gradient background + absolute positioned logo + bottom sheet UI pattern.

4. **Table/Layout Patterns:** Use nested `View` with `flex-row`, border classes, and `flex-[n]` ratio layouts for tabular data (see home.js). This avoids FlatList complexity for static data.

5. **Loading States:** Implement `ActivityIndicator` component for async operations (shown in index.js login). Always manage loading state in component state.

## Critical Files & Dependencies

- **Routing Core:** `app/_layout.js`, `app/(tabs)/_layout.js`
- **Entry Points:** `App.js` (minimal wrapper), `app/index.js` (login), `app/(tabs)/home.js` (main dashboard)
- **Styling:** `global.css` (Tailwind directives), `tailwind.config.js` (custom fonts), `babel.config.js` (NativeWind transpilation)
- **Build:** `metro.config.js` (CSS processing), `app.json` (Expo config with newArchEnabled: true)

**Key Dependencies:**
- `expo-router` (v6): File-based routing
- `nativewind` (v4.2): Tailwind for React Native
- `axios`: HTTP requests
- `expo-linear-gradient`: Visual styling
- `react-native-element-dropdown`: Custom dropdown component
- `@react-native-async-storage`: Local data persistence (installed but not yet used)

## Known Limitations & TODOs

- API endpoint is hardcoded (needs environment variable)
- No auth token persistence between sessions
- No error boundary or global error handling
- Module screens (enrollment, graduation, LOA, etc.) defined in `app/(modules)/` but implementations may be incomplete
