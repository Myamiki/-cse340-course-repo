const flashMiddleware = (req, res, next) => {
    req.flash = function (type, message) {

        if (!req.session.flash) {
            req.session.flash = {
                success: [],
                error: [],
                warning: [],
                info: []
            };
        }

        // SET MESSAGE
        if (type && message) {
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }
            req.session.flash[type].push(message);
            return;
        }

        // GET ONE TYPE
        if (type && !message) {
            const messages = req.session.flash[type] || [];
            req.session.flash[type] = [];
            return messages;
        }

        // GET ALL
        const allMessages = req.session.flash || {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        return allMessages;
    };

    next();
};

/**
 * IMPORTANT FIX:
 * We expose BOTH:
 * - flash (for controllers)
 * - messages (for EJS views)
 */
const flashLocals = (req, res, next) => {

    const messages = req.session.flash || {
        success: [],
        error: [],
        warning: [],
        info: []
    };

    // Make sure EJS NEVER crashes
    res.locals.messages = messages;

    // Optional: keep flash helper available in views
    res.locals.flash = req.flash;

    next();
};

/**
 * Combined middleware
 */
const flash = (req, res, next) => {
    flashMiddleware(req, res, () => {
        flashLocals(req, res, next);
    });
};

export default flash;
