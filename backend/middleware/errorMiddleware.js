// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

const errorMiddleware = (err, req, res, next) => {
    console.error("ERROR:", err);

    // ------------------------------------------
    // INVALID MONGODB OBJECT ID
    // ------------------------------------------

    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format"
        });
    }


    // ------------------------------------------
    // MONGODB DUPLICATE KEY ERROR
    // ------------------------------------------

    if (err.code === 11000) {
        const duplicateField = Object.keys(
            err.keyPattern || {}
        )[0];

        return res.status(409).json({
            success: false,
            message: `${duplicateField} already exists`
        });
    }


    // ------------------------------------------
    // MONGOOSE VALIDATION ERROR
    // ------------------------------------------

    if (err.name === "ValidationError") {
        const messages = Object.values(
            err.errors
        ).map((error) => error.message);

        return res.status(400).json({
            success: false,
            message: messages.join(", ")
        });
    }


    // ------------------------------------------
    // DEFAULT SERVER ERROR
    // ------------------------------------------

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};

export default errorMiddleware;