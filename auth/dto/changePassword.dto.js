import Joi from "joi";
import BaseDto from "../../common/dto/base.dto.js";

class ChangePasswordDto extends BaseDto {
    static schema = Joi.object({
        oldPassword: Joi.string().min(8).required(),
        newPassword: Joi.string().min(8).required()
    }).messages({
        "string.min": "Password must contain 8 chars minimum",
    });
}

export default ChangePasswordDto;