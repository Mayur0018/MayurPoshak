# Security Architecture: Admin RBAC

This document explains how the Admin Dashboard is secured using Role-Based Access Control (RBAC) across the entire stack.

## 🔒 The Security Layers

We use a "Defense in Depth" strategy with 4 layers of protection:

### 1. Database Layer (Supabase RLS)
- **What**: Postgres Row Level Security (RLS) policies.
- **Why**: This is the final line of defense. Even if a bug exists in the code, the database itself will refuse to provide data unless the user has the `admin` role in their JWT.
- **Implementation**: See [rbac.sql](file:///c:/Mayur%20Projects/Mayur_Poshak/src/scripts/rbac.sql).

### 2. Edge Layer (Middleware)
- **What**: Next.js Middleware running on the Edge.
- **Why**: Stops unauthorized users before they even reach the server or render any React components. It provides the best UX by redirecting instantly.
- **Implementation**: Checks `user.user_metadata.role === 'admin'`.

### 3. Server Layer (Server Actions & Layouts)
- **What**: Server-side role validation in `layout.jsx` and Server Actions.
- **Why**: React Server Components (RSC) can bypass middleware in some edge cases. Explicitly checking the role in the `layout` ensures the admin UI is never rendered for non-admins.
- **Implementation**: Uses `supabase.auth.getUser()` to get a fresh, verified user object.

### 4. API Layer (Service Role)
- **What**: Using the `SUPABASE_SERVICE_ROLE_KEY` only when authorized.
- **Why**: Some tasks (like updating other users) require "god-level" permissions. We only invoke this key *after* we have verified that the calling user is an actual admin.

---

## 🚀 Junior-Friendly Flow

1. **User logs in**: Supabase issues a JWT (token).
2. **User visits `/admin`**: 
    - **Middleware** looks at the token. If `role` is not `admin`, it redirects them to `/`.
    - **Admin Layout** runs on the server. It double-checks the `role`. If it's wrong, it stops the page from loading.
3. **Admin clicks "Delete Product"**:
    - **Server Action** runs. It checks: "Is this user an admin?"
    - If yes, it uses the **Service Role Key** to perform the action.

## ⚠️ Common Mistakes to Avoid

1. **Client-side only checks**: Never rely on `localStorage` or `useSession()` for security. They can be faked.
2. **Exposing Service Key**: Never use a key starting with `NEXT_PUBLIC_` for the Service Role.
3. **Ignoring RLS**: Even with a secure frontend, people can call your database directly if RLS is off.
4. **Trusting JWT metadata blindly**: Middleware is great for speed, but always verify the user on the server for sensitive mutations.
