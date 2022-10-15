//@ts-ignore
import { makeResponseJson, sessionizeUser } from '@/helpers/utils';
import { isAuthenticated } from '@/middlewares';
import { ErrorHandler } from '@/middlewares/error.middleware';
import { default as Token, default as TokenSchema } from '@/schemas/TokenSchema';
import User from '@/schemas/UserSchema';
import { sendPasswordResetInstructionMail, sendVerificationMail } from '@/utils/sendMail';
import { schemas, validateBody } from '@/validations/validations';
import crypto from 'crypto';
import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = Router({ mergeParams: true });

//@route POST /api/v1/register
router.post(
    '/v1/register',
    validateBody(schemas.registerSchema),
    (req, res, next) => {
        passport.authenticate('local-register', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (user) { // if user has been successfully created
                req.logIn(user, function (err) { // <-- Log user in
                    if (err) {
                        return next(err);
                    }

                    const userData = sessionizeUser(user);
                    return res.status(200).send(makeResponseJson(userData));
                });
            } else {
                next(new ErrorHandler(409, info.message));
            }
        })(req, res, next);
    }
);

//@route POST /api/v1/authenticate
router.post(
    '/v1/authenticate',
    validateBody(schemas.loginSchema),
    (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local-login', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return next(new ErrorHandler(400, info.message))
            } else {
                req.logIn(user, function (err) { // <-- Log user in
                    if (err) {
                        return next(err);
                    }

                    const userData = sessionizeUser(user);
                    return res.status(200).send(makeResponseJson(userData));
                });
            }
        })(req, res, next);
    }
);

//@route GET /api/v1/auth/facebook FACEBOOK AUTH
router.get(
    '/v1/auth/facebook',
    passport.authenticate('facebook-auth', { scope: ['email', 'public_profile'] })
);

//@route GET /api/v1/auth/facebook/callback FACEBOOK AUTH CALLBACK
router.get(
    '/v1/auth/facebook/callback',
    passport.authenticate('facebook-auth', {
        failureRedirect: `${process.env.CLIENT_URL}/auth/facebook/failed`,
        successRedirect: `${process.env.CLIENT_URL}`
    })
);

//@route GET /api/v1/auth/github GITHUB AUTH
router.get(
    '/v1/auth/github',
    passport.authenticate('github-auth')
);

//@route GET /api/v1/auth/github/callback GITHUB AUTH
router.get(
    '/v1/auth/github/callback',
    passport.authenticate('github-auth', {
        failureRedirect: `${process.env.CLIENT_URL}/auth/github/failed`,
        successRedirect: `${process.env.CLIENT_URL}`
    })
);

//@route GET /api/v1/auth/github GITHUB AUTH
router.get(
    '/v1/auth/google',
    passport.authenticate('google-auth', { scope: ['email', 'profile'] })
);

//@route GET /api/v1/auth/github/callback GITHUB AUTH
router.get(
    '/v1/auth/google/callback',
    passport.authenticate('google-auth', {
        failureRedirect: `${process.env.CLIENT_URL}/auth/google/failed`,
        successRedirect: `${process.env.CLIENT_URL}`
    })
);

//@route DELETE /api/v1/logout
router.delete('/v1/logout', (req: Request, res: Response, next: NextFunction) => {
    try {
        req.logout((err) => {
            if (err) {
                return next(500);
            }
        });

        res.send({ success: true });
    } catch (e) {
        next(new ErrorHandler(422, 'Unable to logout. Please try again.'))
    }
});

//@route GET /api/v1/checkSession
// Check if user session exists
router.get('/v1/check-session', (req, res, next) => {
    if (req.isAuthenticated()) {
        const user = sessionizeUser(req.user);
        res.status(200).send(makeResponseJson(user));
    } else {
        next(new ErrorHandler(401, 'Session invalid/expired.'));
    }
});

router.post(
    '/v1/account/verify',
    isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await User.findOne({ username: req.user.username });
            const now = new Date();
            
            if (user.email) {
                await sendVerificationMail({ 
                    email: req.user.email, 
                    name:  req.user.firstname, 
                    verificationKey: user.generateVerificationToken()
                });
                
                console.log('Sent verification mail to ', req.user.email);
            }

            res.send(makeResponseJson({ success: true }));
        } catch (e) {
            next(e)
        }
    }
);

router.get('/v1/account/verify/:token', (req, res, next) => {
    try {
        const { token } = req.params
        // Check we have an id
        if (!token) {
            next(new ErrorHandler(422, 'Missing token.'));
        }
    
        // Step 1 -  Verify the token from the URL
        jwt.verify(
            token, 
            process.env.USER_VERIFICATION_TOKEN_SECRET,
            async (err, payload: { user_id: string }) => {
                if (err) {
                    console.log('Failed to verify email', err)
                    return res.redirect(`${process.env.CLIENT_URL}/account-verification-failed`);
                    // return next(new ErrorHandler(400, 'Invalid Token.'));
                }
    
                const user = await User.findOne({ _id: payload.user_id });
                
                if (!user) {
                    return next(new ErrorHandler(404, 'User does not exist.'));
                }

                console.log(user)

                //  Update user verification status to true
                user.isEmailValidated = true;
                await user.save();

                // TODO 
                // Redirect once validated
                res.redirect(`${process.env.CLIENT_URL}`);
                
                // return res.status(200).send({
                //     verified: true
                // });
            }
        );
    } catch (err) {
        next(err);
    }
});

router.post(
    '/v1/account/recover',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username } = req.body;
            const obj: Record<string, string> = {};

            if (username.includes('@')) {
                obj.email = username;
            } else {
                obj.username = username;
            }

            const user = await User.findOne(obj);
            
            if (user) {
                await Token.deleteMany({ _user_id: user._id });

                const resetToken = crypto.randomBytes(32).toString("hex");
                const passwordToken = TokenSchema.generateVerificationToken(resetToken);

                await new Token({
                    _user_id: user._id,
                    token: passwordToken,
                    createdAt: Date.now(),
                }).save();

                await sendPasswordResetInstructionMail({ email: user.email, token: resetToken, user_id: user._id, name: user.firstname });
            }

            res.send(makeResponseJson({ success: true }));
        } catch (e) {
            next(e)
        }
    }
);

router.patch(
    '/v1/password/reset',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id, token, password } = req.body;

            // console.log(req.body)

            const  passwordResetToken = await Token.findOne({ _user_id: user_id });

            if (!passwordResetToken || !token || !user_id) {
                console.log('NOT TOKEN PROVIDED')
                throw new Error("Invalid or expired password reset token");
            }

            jwt.verify(
                passwordResetToken.token, 
                process.env.USER_VERIFICATION_TOKEN_SECRET, 
                async (err, decoded: { hash: string }) => {
                    if (err) {
                        console.log(err)
                        return next(new ErrorHandler(400, 'Invalid or expired reset token.'));
                    }
                    
                    if (decoded.hash !== token) {
                        console.log('HASH NOT MATCH')
                        return next(new ErrorHandler(400, 'Invalid or expired reset token.'));
                    }

                    await User.findOneAndUpdate(
                        { _id: user_id },
                        { $set: { 
                                password: User.hashPassword(password)
                            } 
                        },
                        { new: true }
                    );

                    await passwordResetToken.deleteOne();

                    //Todo 
                    // Send email to user indicating password reset activity

                    res.send({ success: true });
                }
            );
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
);


export default router;
