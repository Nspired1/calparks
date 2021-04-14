// wrapper function that catches errors from asynchronous Express operations
// inner async/await Express function MUST have a next parameter

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
};

