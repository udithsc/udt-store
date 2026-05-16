import { jsonResponse, readCMS, writeCMS } from '../../../lib/serverCms';
import { isAdminRequest, unauthorizedResponse } from '../../../lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  const cms = await readCMS();
  return jsonResponse(cms.orders);
}

export async function POST(request) {
  const cms = await readCMS();
  const body = await request.json();
  const order = {
    ...body,
    id: `UDT-${Date.now().toString().slice(-6)}`,
    status: 'Processing',
    createdAt: new Date().toISOString(),
  };
  const orders = [order, ...cms.orders];

  await writeCMS({ ...cms, orders });
  return jsonResponse(order, { status: 201 });
}
