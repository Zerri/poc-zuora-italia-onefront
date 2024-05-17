module.exports = (req, res) => {
    // Eagerly return to skip the mock:
    if (req.url !== "/random/number") return;

    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const paddedNumber = String(randomNumber).padStart(3, "0");

    // Send out a programmable output:
    res.send({
        value: paddedNumber
    });
};
