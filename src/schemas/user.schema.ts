import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class User {
    @Prop()
    guid: string;

    @Prop()
    tanggal_lahir: string;

    @Prop()
    alamat: string;

    @Prop()
    no_hp: string;

    @Prop()
    name: string;

    @Prop({unique: [true, 'Email Is Existing']})
    email: string;

    @Prop()
    password: string;

}

export const UserSchema = SchemaFactory.createForClass(User)