// Form state and validation types

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  role: 'volunteer' | 'organizer';
}