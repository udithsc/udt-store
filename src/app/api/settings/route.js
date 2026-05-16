import { jsonResponse, readCMS, writeCMS } from '../../../lib/serverCms';
import { isAdminRequest, unauthorizedResponse } from '../../../lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cms = await readCMS();
  return jsonResponse(cms.storeSettings);
}

export async function PUT(request) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  const cms = await readCMS();
  const body = await request.json();
  const storeSettings = {
    ...cms.storeSettings,
    ...body,
    shippingCost: Number(body.shippingCost ?? cms.storeSettings.shippingCost) || 0,
    taxRate: Number(body.taxRate ?? cms.storeSettings.taxRate) || 0,
  };

  await writeCMS({ ...cms, storeSettings });
  return jsonResponse(storeSettings);
}
