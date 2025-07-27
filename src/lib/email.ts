import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to other services
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use app-specific password
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};

export const sendVerificationEmail = async (email: string, token: string, name: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #ff9e03; padding: 20px; text-align: center;">
        <h1 style="color: #2D2D2D; margin: 0;">EGGCONOMY</h1>
        <p style="color: #2D2D2D; margin: 10px 0 0 0;">Cheaper, Better, More Together</p>
      </div>
      
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #2D2D2D;">Welcome to Eggconomy, ${name}!</h2>
        
        <p style="color: #2D2D2D; font-size: 16px; line-height: 1.6;">
          Thanks for joining our community! To complete your registration and start trading eggs, 
          please verify your email address by clicking the button below:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #ff9e03; color: #2D2D2D; padding: 15px 30px; 
                    text-decoration: none; border-radius: 5px; font-weight: bold; 
                    display: inline-block; border: 2px solid #2D2D2D;">
            VERIFY EMAIL
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, you can copy and paste this link into your browser:
        </p>
        <p style="color: #666; font-size: 14px; word-break: break-all;">
          ${verificationUrl}
        </p>
        
        <p style="color: #666; font-size: 14px;">
          This verification link will expire in 24 hours. If you didn't create an account with Eggconomy, 
          you can safely ignore this email.
        </p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
        <p style="color: #666; font-size: 12px; margin: 0;">
          Building community, one egg at a time 🥚
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify your Eggconomy account',
    html,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string, name: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #ff9e03; padding: 20px; text-align: center;">
        <h1 style="color: #2D2D2D; margin: 0;">EGGCONOMY</h1>
        <p style="color: #2D2D2D; margin: 10px 0 0 0;">Cheaper, Better, More Together</p>
      </div>
      
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #2D2D2D;">Password Reset Request</h2>
        
        <p style="color: #2D2D2D; font-size: 16px; line-height: 1.6;">
          Hi ${name}, we received a request to reset your password. Click the button below to create a new password:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #ff9e03; color: #2D2D2D; padding: 15px 30px; 
                    text-decoration: none; border-radius: 5px; font-weight: bold; 
                    display: inline-block; border: 2px solid #2D2D2D;">
            RESET PASSWORD
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, you can copy and paste this link into your browser:
        </p>
        <p style="color: #666; font-size: 14px; word-break: break-all;">
          ${resetUrl}
        </p>
        
        <p style="color: #666; font-size: 14px;">
          This reset link will expire in 1 hour. If you didn't request a password reset, 
          you can safely ignore this email.
        </p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
        <p style="color: #666; font-size: 12px; margin: 0;">
          Building community, one egg at a time 🥚
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset your Eggconomy password',
    html,
  });
}; 