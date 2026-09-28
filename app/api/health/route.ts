// Polled by an external uptime check against the public URL, so a 200 here
// means DNS, TLS, nginx and this Node process all answered. Under /api so the
// proxy matcher skips it: no locale redirect for the checker to follow.
export function GET() {
  return Response.json(
    { status: 'ok' },
    {
      // A cached 200 from anything in front of the app would keep reporting
      // "up" after the app itself has stopped answering.
      headers: { 'Cache-Control': 'no-store' },
    },
  )
}
