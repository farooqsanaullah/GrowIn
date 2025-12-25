type EmailTemplateProps = {
  founderName: string;
  investorName: string;
  startupName: string;
  amount: number;
  currency?: string;
};

const styles = {
  container: `
    max-width:600px;
    margin:0 auto;
    padding:24px;
    font-family:Inter,Arial,sans-serif;
    background:#ffffff;
    color:#111827;
  `,
  card: `
    border:1px solid #e5e7eb;
    border-radius:12px;
    padding:20px;
  `,
  heading: `
    font-size:20px;
    font-weight:600;
    margin-bottom:12px;
  `,
  text: `
    font-size:14px;
    line-height:1.6;
    margin-bottom:8px;
  `,
  amount: `
    font-size:22px;
    font-weight:700;
    color:#16a34a;
    margin:16px 0;
  `,
  muted: `
    font-size:12px;
    color:#6b7280;
    margin-top:24px;
  `,
  button: `
    display:inline-block;
    margin-top:16px;
    padding:10px 16px;
    background:#111827;
    color:#ffffff;
    text-decoration:none;
    border-radius:8px;
    font-size:14px;
  `,
};

/* ---------------- FOUNDER EMAIL ---------------- */

export const founderInvestmentReceivedEmail = ({
  founderName,
  investorName,
  startupName,
  amount,
  currency = "USD",
}: EmailTemplateProps) => ({
  subject: `🎉 New investment received`,
  html: `
    <div style="${styles.container}">
      <div style="${styles.card}">
        <h2 style="${styles.heading}">Great news, ${founderName}!</h2>
        <p style="${styles.text}">
          <strong>${investorName}</strong> has invested in your startup
          <strong>${startupName}</strong>.
        </p>

        <div style="${styles.amount}">
          ${currency} ${amount.toLocaleString()}
        </div>

        <p style="${styles.text}">
          The amount has been successfully credited and reflected in your dashboard.
        </p>

        <a href="${process.env.NEXTAUTH_URL}/founder/dashboard"
           style="${styles.button}">
          View Dashboard
        </a>

        <p style="${styles.muted}">
          © ${new Date().getFullYear()} GrowIn
        </p>
      </div>
    </div>
  `,
});

/* ---------------- INVESTOR EMAIL ---------------- */

export const investorInvestmentConfirmationEmail = ({
  investorName,
  startupName,
  amount,
  currency = "USD",
}: Omit<EmailTemplateProps, "founderName">) => ({
  subject: `✅ Investment confirmed`,
  html: `
    <div style="${styles.container}">
      <div style="${styles.card}">
        <h2 style="${styles.heading}">Thanks, ${investorName}!</h2>

        <p style="${styles.text}">
          Your investment in <strong>${startupName}</strong> has been
          successfully completed.
        </p>

        <div style="${styles.amount}">
          ${currency} ${amount.toLocaleString()}
        </div>

        <p style="${styles.text}">
          You can track your investment anytime from your dashboard.
        </p>

        <a href="${process.env.NEXTAUTH_URL}/investor/dashboard"
           style="${styles.button}">
          Go to Dashboard
        </a>

        <p style="${styles.muted}">
          © ${new Date().getFullYear()} GrowIn
        </p>
      </div>
    </div>
  `,
});
