/**
 * Email service for sending OTP codes and registration confirmations
 * TODO: Integrate with real email provider (Mailgun, SendGrid, etc.)
 * For now, logs to console for development
 */

import { generateAndAttachTicket } from "./pdf-ticket";

export async function sendOtpEmail(email: string, otp: string): Promise<boolean> {
  try {
    console.log(`[EMAIL] Sending OTP to ${email}: ${otp}`);
    
    // TODO: Replace with actual email provider
    // Example with Mailgun:
    // const mailgun = require('mailgun.js');
    // const client = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
    // const messageData = {
    //   from: 'noreply@profi-deutsch.uz',
    //   to: email,
    //   subject: 'Your OTP Code',
    //   text: `Your OTP code is: ${otp}. Valid for 10 minutes.`,
    // };
    // await client.messages.create(process.env.MAILGUN_DOMAIN, messageData);

    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send OTP:", error);
    return false;
  }
}

export async function sendRegistrationConfirmation(
  email: string,
  registrationData: {
    firstName: string;
    lastName: string;
    region: string;
    examDate: string;
    startTime: string;
    level: string;
    registrationId: number;
    passportNumber?: string;
    address?: string;
    endTime?: string;
  }
): Promise<boolean> {
  try {
    console.log(`[EMAIL] Sending registration confirmation to ${email}`);
    
    const confirmationHtml = `
      <h2>Registration Confirmation</h2>
      <p>Dear ${registrationData.firstName} ${registrationData.lastName},</p>
      <p>Your registration for the telc exam has been confirmed.</p>
      
      <h3>Registration Details:</h3>
      <ul>
        <li><strong>Registration ID:</strong> #${registrationData.registrationId}</li>
        <li><strong>Level:</strong> ${registrationData.level}</li>
        <li><strong>Region:</strong> ${registrationData.region}</li>
        <li><strong>Exam Date:</strong> ${registrationData.examDate}</li>
        <li><strong>Start Time:</strong> ${registrationData.startTime}</li>
      </ul>
      
      <h3>Important Reminders:</h3>
      <ul>
        <li>Arrive 30 minutes before the exam</li>
        <li>Bring your passport (ID)</li>
        <li>Latecomers will not be admitted</li>
      </ul>
      
      <p>Your registration ticket is attached to this email.</p>
      
      <p>Best regards,<br/>Profi Deutsch Team</p>
    `;

    // Generate PDF ticket
    const ticketAttachment = await generateAndAttachTicket({
      registrationId: registrationData.registrationId,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      email,
      passportNumber: registrationData.passportNumber || "N/A",
      level: registrationData.level,
      region: registrationData.region,
      examDate: registrationData.examDate,
      startTime: registrationData.startTime,
      endTime: registrationData.endTime || "N/A",
      address: registrationData.address || "N/A",
    });

    // TODO: Replace with actual email provider
    // const mailgun = require('mailgun.js');
    // const client = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
    // const messageData = {
    //   from: 'noreply@profi-deutsch.uz',
    //   to: email,
    //   subject: 'Your telc Exam Registration Confirmation',
    //   html: confirmationHtml,
    //   attachment: [{
    //     filename: ticketAttachment.filename,
    //     data: ticketAttachment.content,
    //   }],
    // };
    // await client.messages.create(process.env.MAILGUN_DOMAIN, messageData);

    console.log(`[EMAIL] Ticket generated: ${ticketAttachment.filename}`);

    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send registration confirmation:", error);
    return false;
  }
}

export async function sendPaymentConfirmation(
  email: string,
  paymentData: {
    firstName: string;
    lastName: string;
    amount: string;
    paymentMethod: string;
    registrationId: number;
  }
): Promise<boolean> {
  try {
    console.log(`[EMAIL] Sending payment confirmation to ${email}`);
    
    const confirmationHtml = `
      <h2>Payment Confirmation</h2>
      <p>Dear ${paymentData.firstName} ${paymentData.lastName},</p>
      <p>Your payment has been successfully processed.</p>
      
      <h3>Payment Details:</h3>
      <ul>
        <li><strong>Registration ID:</strong> #${paymentData.registrationId}</li>
        <li><strong>Amount:</strong> ${paymentData.amount} UZS</li>
        <li><strong>Payment Method:</strong> ${paymentData.paymentMethod}</li>
      </ul>
      
      <p>Best regards,<br/>Profi Deutsch Team</p>
    `;

    // TODO: Replace with actual email provider

    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send payment confirmation:", error);
    return false;
  }
}
