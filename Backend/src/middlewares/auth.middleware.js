import { readAccessToken } from "../utils/auth.utils.js";

export const authenticate = async (req, res, next) => {

    const accessToken = req.headers.authorization?.split(" ")[ 1 ]


    if (!accessToken) {
        return res.status(400).json({
            message: "Access token not found in the request header"
        })
    }
    try {

        const decoded = readAccessToken(accessToken)
        req.user = decoded
        next()

    } catch (err) {

        res.status(401).json({
            message: "Invalid or expired access token",
        })
    }

}

export const authorizeseller = (req, res, next) => {

    if (req.user.role !== "seller") {
        return res.status(403).json({
            message: "Access denied. Only sellers are allowed to perform this action."
        })
    }
    next()
}
