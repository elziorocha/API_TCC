import nodemailer from "nodemailer";

export const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export function corpoVerificacaoEmail(nome: string, codigoVerificacao: string) {
  return `
  <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f4f6f8; padding: 40px;">
    <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
      <tr>
        <td style="background-color: #2563eb; padding: 16px 24px; border-radius: 12px 12px 0 0; color: white; text-align: center;">
          <h2 style="margin: 0;">Confirmação de E-mail - Portal do Aluno</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 32px 24px;">
          <p style="font-size: 16px; color: #333;">Olá <span style="text-transform: capitalize; font-weight: bold;">${nome}</span>,</p>
          <p style="font-size: 15px; color: #555;">
            Obrigado por se registrar no <strong>Portal do Aluno</strong>!  
            Utilize o código abaixo para confirmar seu e-mail:
          </p>

          <div style="text-align: center; margin: 28px 0;">
            <span style="font-size: 32px; letter-spacing: 4px; font-weight: bold; color: #2563eb; background: #e0e7ff; padding: 10px 20px; border-radius: 8px;">
              ${codigoVerificacao}
            </span>
          </div>

          <p style="font-size: 14px; color: #666; text-align: center;">
            Este código expira em <strong>10 minutos</strong>.
          </p>

          <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;">

          <p style="font-size: 13px; color: #999; text-align: center;">
            Se você não solicitou esta verificação, entre em contato.<br>
            © ${new Date().getFullYear()} Portal do Aluno - Todos os direitos reservados.
          </p>
        </td>
      </tr>
    </table>
  </div>
  `;
}
