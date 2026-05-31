import axios from "axios";


// SEND OTP

export const sendOTP = async (
  phone: string
) => {
  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp",
      {
        mobile: `91${phone}`,
        template_id:
          process.env.MSG91_TEMPLATE_ID,
      },
      {
        headers: {
          authkey:
            process.env.MSG91_AUTH_KEY,
        },
      }
    );

    return response.data;

  } catch (error) {
    console.log(error);

    throw new Error("Failed to send OTP");
  }
};


// VERIFY OTP

export const verifyOTP = async (
  phone: string,
  otp: string
) => {
  try {
    const response = await axios.get(
      `https://control.msg91.com/api/v5/otp/verify?mobile=91${phone}&otp=${otp}`,
      {
        headers: {
          authkey:
            process.env.MSG91_AUTH_KEY,
        },
      }
    );

    return response.data;

  } catch (error) {
    console.log(error);

    throw new Error("OTP Verification Failed");
  }
};