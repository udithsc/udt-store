import { jsonResponse, readCMS, writeCMS } from '../../../lib/serverCms';
import { isAdminRequest, unauthorizedResponse } from '../../../lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cms = await readCMS();
  return jsonResponse(cms.banners);
}

export async function PUT(request) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  const cms = await readCMS();
  const current = cms.banners[0] || { _id: 'banner1' };
  const banner = { ...current, ...(await request.json()), _id: current._id || 'banner1' };
  const banners = [banner];

  await writeCMS({ ...cms, banners });
  return jsonResponse(banners);
}
