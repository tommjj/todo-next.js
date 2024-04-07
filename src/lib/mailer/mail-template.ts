export const HTML_OTP_TEMPLATE = (otp: number) => {
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
                * {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                }
                body {
                    width: 100vw;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                main {
                    max-width: 650px;
                    min-width: 350px;
                }
            </style>
        </head>
        <body>
            <main>
                <h1 style="font-size: 30px">Verify your email</h1>
                <p style="margin-bottom: 10px; font-size: 24px; margin-top: 15px">
                    Hi,
                </p>
                <p style="font-size: 20px">
                    Please use the following OTP to access the form
                    <samp style="font-weight: 600">${otp}</samp>. Do not share
                    this OTP with any one.
                </p>
    
                <p style="margin-top: 10px; font-size: 20px">Thank you!</p>
            </main>
        </body>
    </html>`;
};
