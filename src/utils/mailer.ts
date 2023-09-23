import nodemailer from "nodemailer";

const sendPasswordResetEmail = (email: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    html: `<p>Please click the link below to reset your password</p><br><a href=${resetLink}>Reset Password</a>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log(info);
    }
  });
};

export default sendPasswordResetEmail;
