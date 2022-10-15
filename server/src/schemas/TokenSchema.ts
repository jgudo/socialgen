import jwt from 'jsonwebtoken';
import { Document, Model, model, Schema } from "mongoose";
import { IUser } from "./UserSchema";

export interface IToken extends Document {
    _user_id: IUser['_id'];
    token: string;
    createdAt: string | number;

}

interface ITokenModel extends Model<IToken> {
    generateVerificationToken(random: string): string;
}

const TokenSchema = new Schema<IToken, ITokenModel>({
    _user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,// this is the expiry time in seconds
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });


TokenSchema.statics.generateVerificationToken = function (random: string) {
    const verificationToken = jwt.sign(
        { hash: random },
        process.env.USER_VERIFICATION_TOKEN_SECRET,
        { expiresIn: 300000 } // 5 minutes
    );
    return verificationToken;
};

export default model<IToken, ITokenModel>('Token', TokenSchema);
