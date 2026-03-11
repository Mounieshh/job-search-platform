import mongoose, { Schema } from "mongoose";


export interface ICompany extends Document {
    name: string,
    domain: string,
    primaryLeadId: mongoose.Types.ObjectId | null
}

const CompanySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true,
        unique: true,
    },
    primaryLeadId: {
        type: Schema.Types.ObjectId, 
        ref: "User",
        default: null
    }
}, { timestamps: true })


const Company = mongoose.model<ICompany>("Company", CompanySchema)
export default Company