import { db } from '@/lib/db';

export type ActivityAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_FAILED'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | 'CREATE_ABOUT'
  | 'UPDATE_ABOUT'
  | 'DELETE_ABOUT'
  | 'CREATE_SKILL'
  | 'UPDATE_SKILL'
  | 'DELETE_SKILL'
  | 'CREATE_PROJECT'
  | 'UPDATE_PROJECT'
  | 'DELETE_PROJECT'
  | 'CREATE_SERVICE'
  | 'UPDATE_SERVICE'
  | 'DELETE_SERVICE'
  | 'CREATE_EXPERIENCE'
  | 'UPDATE_EXPERIENCE'
  | 'DELETE_EXPERIENCE'
  | 'CREATE_EDUCATION'
  | 'UPDATE_EDUCATION'
  | 'DELETE_EDUCATION'
  | 'CREATE_CERTIFICATION'
  | 'UPDATE_CERTIFICATION'
  | 'DELETE_CERTIFICATION'
  | 'CREATE_TESTIMONIAL'
  | 'UPDATE_TESTIMONIAL'
  | 'DELETE_TESTIMONIAL'
  | 'CREATE_RESUME'
  | 'UPDATE_RESUME'
  | 'DELETE_RESUME'
  | 'UPDATE_PROFILE'
  | 'UPDATE_SECURITY'
  | 'UPDATE_SETTINGS'
  | 'CONTACT_SUBMIT'
  | string;

export interface ActivityLogInput {
  userId?: string | null;
  action: ActivityAction;
  entity?: string | null;
  entityId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * ActivityLog helper — persists an audit-trail entry.
 * Non-blocking: failures are swallowed (audit log should never break the request).
 */
export async function logActivity(input: ActivityLogInput): Promise<void> {
  try {
    await db.activityLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        entity: input.entity ?? null,
        entityId: input.entityId ?? null,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      },
    });
  } catch (err) {
    // Audit log must never throw to the caller — log to stderr instead
    console.error('[activity] Failed to log activity:', err);
  }
}
