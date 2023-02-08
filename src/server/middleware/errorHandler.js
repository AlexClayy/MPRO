export default function errorHandler(err, req, res, next) {
    console.log(err);
    res.status(400).json({ errors: err })
}