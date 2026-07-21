import { NextResponse } from 'next/server';

/**
 * GET /.well-known/assetlinks.json
 *
 * Required for Android App Links (HTTPS deep links) to bypass the browser
 * chooser dialog and open the FlashMed app directly.
 *
 * Android verifies this file when the app is first installed or updated.
 * The SHA-256 fingerprint MUST match the release signing certificate.
 *
 * SHA-256 for in.flashmed.app (from Play Console → Setup → App integrity):
 *   0E:BE:1C:48:71:CA:9F:32:D8:A3:7A:16:DB:02:E0:0C:58:B4:1E:12:A3:C7:44:26:21:86:C3:8B:5B:B8:EB:6B
 */
export async function GET() {
  const assetlinks = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'in.flashmed.app',
        sha256_cert_fingerprints: [
          '0E:BE:1C:48:71:CA:9F:32:D8:A3:7A:16:DB:02:E0:0C:58:B4:1E:12:A3:C7:44:26:21:86:C3:8B:5B:B8:EB:6B',
        ],
      },
    },
  ];

  return new NextResponse(JSON.stringify(assetlinks, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // Cache for 1 hour — Android caches this aggressively
      'Cache-Control': 'public, max-age=3600',
      // No X-Frame-Options on this endpoint
    },
  });
}
