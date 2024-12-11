import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req,res) => {   // here async is for incase direct db calls , promisses are handeling async await
    return res
    .status(200)
    .json(new ApiResponse(201,"just health check data","health check passed !"))
})

export {
    healthCheck
}

