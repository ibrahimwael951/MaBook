import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { ReportsValidation } from "../validator/Reports.mjs";
import { Reports } from "../mongoose/schema/Reports.mjs";
const route = Router();

route.post("/auth/report", checkSchema(ReportsValidation), async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array(),
      });
    }
    const data = matchedData(req);

    data.reportedBy = req.user._id;

    const newReport = new Reports({ ...data });
    const SaveReport = await newReport.save();
    if (!SaveReport) {
      return res
        .status(400)
        .json({ message: "Some thing went wrong while save" });
    }
    res.status(200).json(SaveReport);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", details: err.message });
  }
});

export default route;
