import { getAnalyticsData } from '../../../lib/bff';

export function GET() {
  return Response.json(getAnalyticsData());
}
