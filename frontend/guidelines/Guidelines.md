**Add your own guidelines here**

# General guidelines
Database schema :
Table users {
  id uuid [primary key]
  google_id varchar [unique, null, note: 'null jika masih guest']
  temp_id varchar [unique, null, note: 'null setelah login']
  is_guest boolean [not null, default: true]
  username varchar
  name varchar
  email varchar [null]
  fcm_token varchar [null, note: 'untuk Firebase push notif']
  last_active timestamp
  created_at timestamp
  updated_at timestamp
}

Table targets {
  id uuid [primary key]
  user_id uuid [not null]
  name varchar [not null]
  description text [null]
  image_url varchar [null]
  status varchar [not null, default: 'active', note: 'active | paused | completed']
  target_amount decimal(15,2) [not null]
  current_amount decimal(15,2) [not null, default: 0]
  deadline date [null]
  created_at timestamp
  updated_at timestamp
}

Table schedules {
  id uuid [primary key]
  target_id uuid [not null, unique]
  frequency enum('daily', 'weekly', 'monthly') [not null]
  amount decimal(15,2) [not null]
  next_run date [not null]
  last_run timestamp [null]
  is_active boolean [not null, default: true]
  created_at timestamp
}

Table transactions {
  id uuid [primary key]
  target_id uuid [not null]
  type enum('deposit', 'withdraw') [not null]
  amount decimal(15,2) [not null]
  note varchar [null]
  created_at timestamp
}

Table notifications {
  id uuid [primary key]
  user_id uuid [not null]
  target_id uuid [null, note: 'null jika notif global']
  title varchar [not null]
  body text [not null]
  is_read boolean [not null, default: false]
  sent_at timestamp
}

Ref: targets.user_id > users.id [delete: cascade]
Ref: schedules.target_id - targets.id [delete: cascade]
Ref: transactions.target_id > targets.id [delete: cascade]
Ref: notifications.user_id > users.id [delete: cascade]
Ref: notifications.target_id > targets.id [delete: set null]


#Files Structure Guidelines

the file name is just a sample, adjust it according to the project context

/my-app
  ├── /public/
    ├── index.html
    ├── favicon.ico
    └── /images/
  ├── /src/
    ├── /assets/           # Static assets (images, fonts, etc.)
    ├── /components/       # Reusable components
      ├── Button.tsx
      ├── Modal.tsx
      └── Navbar.tsx
    ├── /features/         # Feature-specific logic and components (could be feature folders)
      ├── /auth/           # Authentication-related components, hooks, reducers
      ├── /dashboard/      # Dashboard components, hooks, etc.
      └── /profile/        # Profile-related components
    ├── /hooks/            # Custom React hooks
      ├── useAuth.ts
      ├── useFetch.ts
      └── useForm.ts
    ├── /layouts/          # Layout components (e.g., Header, Footer, Sidebar)
      ├── MainLayout.tsx
      ├── AdminLayout.tsx
      └── DashboardLayout.tsx
    ├── /pages/            # Page components (routes)
      ├── Auth/
        ├── SignInPage.tsx
        └── SignUpPage.tsx
      ├── Dashboard.tsx
      ├── Home.tsx
      ├── Users.tsx
      ├── Prodcuts.tsx
      └── ContactUs.tsx
    ├── /services/         # API requests, utilities, external service integrations
      ├── authService.ts   # Authentication API
      └── apiService.ts    # General API calls
    ├── /store/            # State management (Redux, Zustand, Context API)
      ├── /auth/          # Auth-related Redux slices
      ├── /user/          # User-related Redux slices
      └── store.ts        # Global store configuration
    ├── /styles/           # Global styles (CSS, SASS, Styled Components)
      ├── index.css
      ├── theme.ts        # For theme configuration in styled-components
      └── global.scss     # Global styles for the app
    ├── /types/            # TypeScript types (if using TS)
      ├── auth.d.ts       # Types for authentication-related data
      ├── api.d.ts        # Types for API responses
      └── user.d.ts       # Types for user objects
    ├── /utils/            # Utility functions, helpers, and constants
      ├── formatDate.ts
      └── validateEmail.ts
    ├── /app.tsx           # App component (entry point)
    ├── /index.tsx         # Main entry point for React
    ├── /router.tsx        # Routing (React Router setup)
    └── /config/           # Environment variables and configuration files
      ├── index.ts        # Export environment variables and configurations
      ├── config.ts       # Configuration file for app set
  ├── /assets/
  ├── .gitignore
  ├── package.json
  ├── README.md
  ├── tsconfig.json (for TypeScript projects)
  ├── vite.config.js (for Vite projects)
  └── .eslintrc.json (or .eslint.js)
  
  
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
