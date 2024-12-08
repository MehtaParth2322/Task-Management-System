const ApiResponse = require("../utils/ApiResponse");
const User = require("../model/user");

/**
 *  @description Get all Users
 *  @method GET
 */
exports.getUsers = (req, res) => {
    User.find()
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error while finding a users"
            })
        })
}

/**
 *  @description Get User by ID
 *  @method GET
 */
exports.getUserById = (req, res) => {
    const userId = req.params.id;

    User.findById(userId)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Not found user with Id: " + userId })
            } else {
                data.password = undefined;
                res.status(200).send(new ApiResponse(200, data, "Request Successfull"))
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error while finding a user with Id: " + userId
            })
        })
}


/**
 *  @description Update User by ID
 *  @method PUT
 */
exports.updateUser = (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    const userId = req.params.id;

    User.findByIdAndUpdate(userId, req.body)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found user with id: " + userId });
            else
                res.status(200).send({
                    message: "User updated successfully",
                    data: data
                });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error while updating a user"
            })
        })
}


/**
 *  @description Delete User by ID
 *  @method DELETE
 */
exports.deleteUser = (req, res) => {
    const userId = req.params.id;

    User.findByIdAndDelete(userId)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found user with email: " + emailId });
            else
                res.status(200).send({ message: "User deleted successfully" });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error while deleting a user"
            })
        })
}