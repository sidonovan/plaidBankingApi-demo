// Helper function that converts an unknown error into a PlaidError type

// import custom PlaidError type
import { PlaidError } from './types.js';

export function toPlaidError(err: unknown): PlaidError {
  return err as PlaidError;
}
