import { getOpsTickets } from '../../../lib/bff';

export function GET() {
  return Response.json(getOpsTickets());
}
