import sendGridMail from '@sendgrid/mail';

interface IMailParams {
    email: string;
    verificationKey: string | number;
    name?: string;
}

const renderEmailTemplate = (content: string) => {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
        <!--[if !mso]>
                    <!-->
        <meta http-equiv="X-UA-Compatible" content="IE=Edge">
        <!--
                        <![endif]-->
        <!--[if (gte mso 9)|(IE)]>
                        <xml>
                            <o:OfficeDocumentSettings>
                                <o:AllowPNG/>
                                <o:PixelsPerInch>96</o:PixelsPerInch>
                            </o:OfficeDocumentSettings>
                        </xml>
                        <![endif]-->
        <!--[if (gte mso 9)|(IE)]>
                        <style type="text/css">
        body {width: 600px;margin: 0 auto;}
        table {border-collapse: collapse;}
        table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
        img {-ms-interpolation-mode: bicubic;}
    </style>
                        <![endif]-->
        <style type="text/css">
        body,
        p,
        div {
            font-family: inherit;
            font-size: 14px;
        }

        body {
            color: #000000;
        }

        body a {
            color: #1188E6;
            text-decoration: none;
        }

        p {
            margin: 0;
            padding: 0;
        }

        table.wrapper {
            width: 100% !important;
            table-layout: fixed;
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: 100%;
            -moz-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        img.max-width {
            max-width: 100% !important;
        }

        .column.of-2 {
            width: 50%;
        }

        .column.of-3 {
            width: 33.333%;
        }

        .column.of-4 {
            width: 25%;
        }

        @media screen and (max-width:480px) {

            .preheader .rightColumnContent,
            .footer .rightColumnContent {
            text-align: left !important;
            }

            .preheader .rightColumnContent div,
            .preheader .rightColumnContent span,
            .footer .rightColumnContent div,
            .footer .rightColumnContent span {
            text-align: left !important;
            }

            .preheader .rightColumnContent,
            .preheader .leftColumnContent {
            font-size: 80% !important;
            padding: 5px 0;
            }

            table.wrapper-mobile {
            width: 100% !important;
            table-layout: fixed;
            }

            img.max-width {
            height: auto !important;
            max-width: 100% !important;
            }

            a.bulletproof-button {
            display: block !important;
            width: auto !important;
            font-size: 80%;
            padding-left: 0 !important;
            padding-right: 0 !important;
            }

            .columns {
            width: 100% !important;
            }

            .column {
            display: block !important;
            width: 100% !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            }
        }
        </style>
        <!--user entered Head Start-->
        <link href="https://fonts.googleapis.com/css?family=Muli&display=swap" rel="stylesheet">
        <style>
        body {
            font-family: 'Muli', sans-serif;
        }
        </style>
        <!--End Head user entered-->
    </head>
    <body>
        <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;">
        <div class="webkit">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
            <tbody>
                <tr>
                <td valign="top" bgcolor="#FFFFFF" width="100%">
                    <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                    <tbody>
                        <tr>
                        <td width="100%">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tbody>
                                <tr>
                                <td>
                                    <!--[if mso]>
                                    <center>
                                        <table>
                                            <tr>
                                                <td width="600">
                                                    <![endif]-->
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                                <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; padding-top: 50px;" bgcolor="#f6f6f6">
                                                <tbody>
                                                    <tr>
                                                    <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
                                                        <img class="companyLogo" src="https://socialgen.vercel.app/assets/logo.png" alt="" style="width:80px; height: 80px;">
                                                    </td>
                                                    </tr>
                                                    <tr>
                                                    <td valign="middle" style="text-align:center">
                                                        <h3 class="companyName" style="margin: 0; padding:0; display:inline-block; font-size: 32px; color: #1a1a1a; font-family: inherit">Social Gen</h3>
                                                    </td>
                                                    </tr>
                                                    <tr></tr>
                                                </tbody>
                                                </table>
                                                ${content}
                                            </table>    
                                            <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;">
                                            <p class="footerText" style="font-size: 12px; color: #1a1a1a; font-family: Poppins, calibri,sans-serif,Helvetica; margin: 2px">Copyright &copy; ${new Date().getFullYear()} Social Gen. All rights reserved</p>
                            <a class="footerText" style="font-size: 12px; font-family: Poppins, calibri,sans-serif,Helvetica;" href="https://juliusguevarra.com">https://juliusguevarra.com</a>
                            <span class="footerText">|</span>
                            <a class="footerText" style="font-size: 12px; font-family: Poppins, calibri,sans-serif,Helvetica;" href="https://facebook.com/julius.gudo14/">Facebook</a>
                                            </div>
                                        </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                    <!--[if mso]>
                                            </td>
                                        </tr>
                                    </table>
                                </center>
                                <![endif]-->
                                </td>
                                </tr>
                            </tbody>
                            </table>
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
        </center>
    </body>
    </html>
    `;
}

export const sendVerificationMail = (params: IMailParams) => {
    return new Promise((resolve, reject) => {
        try {
            (async () => {
                await sendGridMail.send({
                    to: params.email,
                    from: {
                        email: 'consumer-portal@pelco1.org.ph',
                        name: 'Social Gen'
                    }, // Use the email address or domain you verified above
                    subject: 'Social Gen - Verify your email address',
                    html: renderEmailTemplate(`
                    <table width="100%" bgcolor="#f6f6f6">
                    <tbody>
                        <tr>
                        <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#f6f6f6" width="100%" align="left">
                            <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 20px 30px 20px;">
                            <tbody>
                                <tr role="module-content">
                                <td height="100%" valign="top">
                                    <table class="column" width="540" style="width:540px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="">
                                    <tbody>
                                        <tr>
                                        <td style="padding:0px;margin:0px;border-spacing:0;">
                                            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                            <tbody>
                                                <tr>
                                                <td style="padding:50px 30px 18px 30px; line-height:36px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content">
                                                    <div>
                                                    <div style="font-family: inherit; text-align: center">
                                                        <span style="font-size: 26px">Thanks for signing up, ${params.name || params.email}!</span>
                                                    </div>
                                                    <div></div>
                                                    </div>
                                                </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-mc-module-version="2019-10-22">
                                            <tbody>
                                                <tr>
                                                <td style="padding:18px 30px 18px 30px; line-height:22px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content">
                                                    <div>
                                                    <div style="font-family: inherit; text-align: center">
                                                        <span style="font-size: 18px">Please verify your email address to</span>
                                                        <span style="color: #000000; font-size: 18px; font-family: arial,helvetica,sans-serif"> get full access of the app.</span>
                                                    </div>
                                                    </div>
                                                </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                            <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" >
                                            <tbody>
                                                <tr>
                                                <td style="padding:0px 0px 20px 0px;" role="module-content" bgcolor="#ffffff"></td>
                                                </tr>
                                            </tbody>
                                            </table>
                                            <table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%">
                                            <tbody>
                                                <tr>
                                                <td align="center" bgcolor="#ffffff" class="outer-td" style="padding:0px 0px 0px 0px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                                                    <tbody>
                                                        <tr>
                                                        <td align="center" bgcolor="#4F46E5" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                                                            <a href="${process.env.API_URL}/account/verify/${params.verificationKey}" style="background-color:#4F46E5; border:1px solid #4F46E5; border-color:#4F46E5; border-radius:0px; border-width:1px; color:#fff; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 40px 12px 40px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Verify Email Now</a>
                                                        </td>
                                                        </tr>
                                                    </tbody>
                                                    </table>
                                                </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                            <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" >
                                            <tbody>
                                                <tr>
                                                <td style="padding:0px 0px 50px 0px;" role="module-content" bgcolor="#ffffff"></td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </td>
                                </tr>
                            </tbody>
                            </table>
                    `)
                });

                resolve('Successfully sent verification mail.');
            })();
        } catch (err) {
            reject(err);
        }
    });
}

interface IMailParamsReset {
    email: string;
    token: string;
    user_id: string;
    name?: string;
}

export const sendPasswordResetInstructionMail = (params: IMailParamsReset) => {
    return new Promise((resolve, reject) => {
        try {
            (async () => {
                await sendGridMail.send({
                    to: params.email,
                    from: {
                        email: 'consumer-portal@pelco1.org.ph',
                        name: 'Social Gen'
                    }, // Use the email address or domain you verified above
                    subject: 'Social Gen - Reset your password',
                    html: renderEmailTemplate(`
                    <table width="100%" bgcolor="#f6f6f6">
                    <tbody>
                        <tr>
                        <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#f6f6f6" width="100%" align="left">
                            <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 20px 30px 20px;">
                            <tbody>
                                <tr role="module-content">
                                <td height="100%" valign="top">
                                    <table class="column" width="540" style="width:540px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="">
                                    <tbody>
                                        <tr>
                                        <td style="padding:0px;margin:0px;border-spacing:0;">
                                            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-mc-module-version="2019-10-22">
                                            <tbody>
                                                <tr>
                                                <td style="padding:50px 30px 18px 30px; line-height:36px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content">
                                                    <div>
                                                    <div style="font-family: inherit; text-align: center">
                                                        <span style="font-size: 18px">${params.name || params.email}, you requested for a password reset instruction.</span>
                                                        <br/>
                                                        <span style="font-size: 18px">To proceed with your request, click the link below</span>
                                                    </div>
                                                    <div></div>
                                                    </div>
                                                </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                            <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" >
                                            <tbody>
                                                <tr>
                                                <td style="padding:0px 0px 20px 0px;" role="module-content" bgcolor="#ffffff"></td>
                                                </tr>
                                            </tbody>
                                            </table>
                                            <table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%">
                                            <tbody>
                                                <tr>
                                                <td align="center" bgcolor="#ffffff" class="outer-td" style="padding:0px 0px 0px 0px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                                                    <tbody>
                                                        <tr>
                                                        <td align="center" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                                                            <a href="${process.env.CLIENT_URL}/password-reset?token=${params.token}&user_id=${params.user_id}" display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 40px 12px 40px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Reset Password Now</a>
                                                        </td>
                                                        </tr>
                                                    </tbody>
                                                    </table>
                                                </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                            <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" >
                                            <tbody>
                                                <tr>
                                                <td style="padding:0px 0px 50px 0px;" role="module-content" bgcolor="#ffffff"></td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </td>
                                </tr>
                            </tbody>
                            </table>
                    `)
                });

                resolve('Successfully sent verification mail.');
            })();
        } catch (err) {
            reject(err);
        }
    });
}