const OTP_EXPIRED_TIME_SECOND = 60 * 5;

const createRandomOTP = () => {
    return Math.round(Math.random() * 1000000);
};
