export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, teamSize, industry, aiLevel, willPay, usedVirtualEmployee, message } = body

    if (!name || !email || !teamSize || !industry || !aiLevel || !willPay || !usedVirtualEmployee) {
      return Response.json({ error: 'All fields are required' }, { status: 400 })
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return Response.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const html = `
      <h2>New Alpha Testing Application</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name / Org</td><td style="padding:8px;border:1px solid #ddd;">${name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;">${email}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Team Size</td><td style="padding:8px;border:1px solid #ddd;">${teamSize}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Industry</td><td style="padding:8px;border:1px solid #ddd;">${industry}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">AI Level</td><td style="padding:8px;border:1px solid #ddd;">${aiLevel}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Will Pay for AI</td><td style="padding:8px;border:1px solid #ddd;">${willPay}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Used Virtual Employee</td><td style="padding:8px;border:1px solid #ddd;">${usedVirtualEmployee}</td></tr>
        ${message ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Message</td><td style="padding:8px;border:1px solid #ddd;">${message}</td></tr>` : ''}
      </table>
      <p style="color:#888;font-size:12px;">Submitted at: ${new Date().toISOString()}</p>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'GMVBot Alpha <onboarding@resend.dev>',
        to: '838237663@qq.com',
        subject: `[Alpha Signup] ${name} - ${email}`,
        html,
      }),
    })

    if (!res.ok) {
      const errData = await res.text()
      console.error('Resend API error:', errData)
      return Response.json({ error: 'Failed to send notification' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Alpha signup error:', error)
    return Response.json({ error: 'Failed to save' }, { status: 500 })
  }
}
