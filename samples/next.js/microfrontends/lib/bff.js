import analytics from '../data/analytics.json';
import users from '../data/users.json';
import support from '../data/support.json';

export function getAnalyticsData() {
  return analytics;
}

export function getUsers() {
  return users;
}

export function getOpsTickets() {
  return support;
}
