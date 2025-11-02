// Define a custom PlaidError which extends the built-in Error type
// Custom Error object will look like this:
// {
//  name: string;
//  message: string;
//  stack?: string;
//  response?: {
//  data?: any;
//  };
// }

export interface PlaidError extends Error {
  response?: {
    data?: any;
  };
}
