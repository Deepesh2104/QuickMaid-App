/** Facade — core CRUD has no bridge dependency to avoid require cycles. */
export * from './bookings.core.storage';
export { submitBookingReview } from './bookings.review.storage';
