import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true],
    unique : true
  },
  code : {
      type : String,
  }
})

export default mongoose.models.User || mongoose.model('User', UserSchema)