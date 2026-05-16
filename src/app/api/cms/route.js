import { jsonResponse, readCMS, writeCMS } from '../../../lib/serverCms';
import { isAdminRequest, unauthorizedResponse } from '../../../lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const cms = await readCMS();
  return jsonResponse({
    ...cms,
    orders: isAdminRequest(request) ? cms.orders : [],
  });
}

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  const body = await request.json();

  if (body.action !== 'clear') {
    return jsonResponse({ error: 'Unsupported CMS action.' }, { status: 400 });
  }

  const emptyCMS = {
    products: [],
    banners: [],
    storeSettings: {
      storeName: 'UDT STORE',
      supportEmail: 'support@udtstore.com',
      supportPhone: '(800) 060-0730',
      currency: 'USD',
      shippingCost: 25,
      taxRate: 0.2,
    },
    orders: [],
  };

  await writeCMS(emptyCMS);
  return jsonResponse(emptyCMS);
}
