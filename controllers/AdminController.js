const User = require('../database/models/').User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AdminController{

    static async login(req, res){
        try{
            let { email, password } = req.body;
            await User.findAll({
                where:{email: email}
            })
                .then(user=>{
                    if(user.length == 0){
                        res.status(400).json({message: "Sorry, Buyer does not exist."});
                    }else{
                        if(user[0].dataValues.role == 1){
                            let passwordIsValid = bcrypt.compareSync(password, user[0].dataValues.password.trim());

                            if (passwordIsValid){
                                let userDetails = {
                                    id: user[0].dataValues.id,
                                    full_name: user[0].dataValues.first_name,
                                    phone: user[0].dataValues.phone,
                                    email: user[0].dataValues.email,
                                    is_auth: 'admin'
                                }
                                var token = jwt.sign({
                                    user: userDetails
                                }, secret, {});

                                res.status(200).json({
                                    success: true,
                                    data: user,
                                    message: "Login successful. Token generated successfully.",
                                    token: token
                                });
                            }else{
                                res.status(401).json({
                                    success: false,
                                    message: 'Authentication failed. Wrong password'
                                });
                            }
                        }

                    }
                })
                .catch(e=>{
                    res.status(500);
                })

        }catch (e) {
            res.send(500);
        }
    }

    static async deactivateUser(req, res){
        try{
         let auth = req.decoded.user.is_auth;
         if(auth == 'admin'){
             const {user_id} = req.body;
            let deactivateUserStatus = {
                status: 0
            }
            User.update(deactivateUserStatus,{
                where: {id: user_id}
            })
                .then(result=>{
                    return res.status(201).json({
                        error:false,
                        message: 'User successfully deactivated'
                    })
                })
                .catch(err=>{
                    return res.send({error: true, message: err.kind | 'Error occurred'})
                })
         }else{
             return res.status(401).json({
                 error:true,
                 message: 'Unauthorized user is not allowed.'
             });
         }
        }catch (e) {
            return res.sendStatus(500);
        }
    }
}
module.exports = AdminController;