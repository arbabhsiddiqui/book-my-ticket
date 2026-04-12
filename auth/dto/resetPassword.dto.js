import Joi from "joi";
import BaseDto from "../../common/dto/base.dto.js";

class ResetPasswordDto extends BaseDto {
    static schema = Joi.object({
        password: Joi.string().min(8).required(),
        token: Joi.string().required()
    }).messages({
        "string.min": "Password must contain 8 chars minimum",
    });
}

export default ResetPasswordDto;