// Admin authentication utilities

// List of authorized admin users (in a real app, this would be in the database)
const ADMIN_USERS = [
  'admin',
  'alinahassan',
  // Add more admin usernames here
];

export interface AdminUser {
  id: string;
  name: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

export const isAdminUser = (username: string): boolean => {
  return ADMIN_USERS.includes(username.toLowerCase());
};

export const checkAdminAuth = (): AdminUser | null => {
  try {
    const userSession = localStorage.getItem('userSession');
    if (!userSession) return null;

    const user = JSON.parse(userSession);
    
    if (!user.isLoggedIn) return null;
    
    if (isAdminUser(user.name)) {
      return {
        id: user.id,
        name: user.name,
        isLoggedIn: true,
        isAdmin: true
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error checking admin auth:', error);
    return null;
  }
};

export const addAdminUser = (username: string): void => {
  if (!ADMIN_USERS.includes(username.toLowerCase())) {
    ADMIN_USERS.push(username.toLowerCase());
  }
}; 