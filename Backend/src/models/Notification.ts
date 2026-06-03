import mongoose,{ Schema, Document}  from "mongoose";

export interface Notification extends Document{
    title: string;
    message:string;
    type:string;
    isRead:boolean;
    user:mongoose.Types.ObjectId;
}

const notificationSchema = new Schema<Notification>({
        title:{
            type: String,
            required: true
        },

        message:{
            type: String,
            required:true
        },

        type:{
            type: String,
            required:true
        },

        isRead:{
            type: Boolean,
            default:false
        },

        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        }
    
},{
    timestamps:true
})

export default mongoose.model<Notification>("Notification", notificationSchema);