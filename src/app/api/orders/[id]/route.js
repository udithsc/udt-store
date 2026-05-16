import { jsonResponse, readCMS, writeCMS } from '../../../../lib/serverCms';
import { isAdminRequest, unauthorizedResponse } from '../../../../lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  const { id } = await params;
  const cms = await readCMS();
  const body = await request.json();
  const orders = cms.orders.map((order) =>
    order.id === id ? { ...order, ...body, id: order.id } : order
  );

  await writeCMS({ ...cms, orders });
  return jsonResponse(orders.find((order) => order.id === id) || null);
}
