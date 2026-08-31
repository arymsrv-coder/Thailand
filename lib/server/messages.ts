import 'server-only';
import type { ContactMessage } from '../types';
import type { ValidContact } from '../validation';
import { createStore } from './store';

/** Contact enquiries from the "Talk to us" form. */

const store = createStore<ContactMessage>('messages');

export async function createMessage(input: ValidContact): Promise<ContactMessage> {
  const message: ContactMessage = {
    id: `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    name: input.name,
    email: input.email,
    message: input.message,
    createdAt: new Date().toISOString(),
  };

  await store.append(message);
  console.log(`[contact] ${message.name} <${message.email}>`);

  return message;
}

export function listMessages(): Promise<ContactMessage[]> {
  return store.all();
}
