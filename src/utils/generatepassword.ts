import crypto from "crypto";

const generatePasswordResetToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
};

export default generatePasswordResetToken;
