import dbConnect from "../../utils/dbConnect";
import User from "../../models/user";

export default async function handler(req, res) {
  try {
    const { method, body } = req;
    console.log("🚀 ~ file: auth.ts ~ line 6 ~ handler ~ body", body);
    await dbConnect();
    if (!body.userName && body.type == "auth") {
      res.status(400).json({ message: "UserName is required" });
      return;
    }
    switch (method) {
      case "GET":
        try {
          res.status(400).json("only post method allow");
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
      case "POST":
        try {
          if (body.type == "auth") {
            let usr = await User.findOne({ userName: body.userName });
            if (usr) {
              // const user = await User.findOne({userName:body.userName})
              res.status(200).json({ success: true, message: "retrived   successfully", user: usr });
              return;
            } else {
              const user = await User.create({ userName: body.userName, code: "" });
              res.status(200).json({ success: true, message: "user created successfully", user });
              return;
            }
          } else if (body.type == "saveCode") {
            console.log("🚀 ~ file: auth.ts ~ line 24 ~ handler ~ saveCode", "saveCode");
            const user = await User.updateOne(
              { _id: body.userid },
              {
                code: body.code,
              }
            );
            res.status(200).json({ success: true, message: "code saved  successfully" });
            return;
          } else if (body.type == "get") {
            const user = await User.findById({ _id: body.userid });
            res.status(200).json({ success: true, message: "retrived   successfully", user });
            return;
          }
        } catch (error) {
          console.log("🚀 ~ file: auth.ts ~ line 35 ~ handler ~ error", error);
          res.status(400).json({ success: false });
        }
        break;
      default:
        res.status(400).json({ success: false });
        break;
    }
  } catch (error) {
    res.status(500).json({ success: false });
  }
}
