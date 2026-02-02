import { getUsers } from '../../../lib/bff';

export function GET() {
  return Response.json(getUsers());
}
