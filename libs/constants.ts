// Constants for validation rules
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{10,}$/
);
export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MAX_LENGTH = 15;

// Error messages
export const INVALID_TYPE_ERROR_MESSAGE = "유효하지 않은 형식입니다";
export const REQUIRED_ERROR_MESSAGE = "필수 입력 사항이에요";
export const PASSWORD_MIN_ERROR_MESSAGE = `비밀번호는 최소 ${PASSWORD_MIN_LENGTH}글자 이상이어야 해요`;
export const PASSWORD_REGEX_ERROR_MESSAGE = `비밀번호는 영문, 숫자, 특수문자를 포함해야 해요`;
export const PASSWORD_NOT_MATCH_MESSAGE = `비밀번호가 일치하지 않아요`;
export const USERNAME_MIN_ERROR_MESSAGE = `이름은 최소 ${USERNAME_MIN_LENGTH}글자 이상이어야 해요`;
export const USERNAME_MAX_ERROR_MESSAGE = `이름은 최대 ${USERNAME_MAX_LENGTH}글자 이하여야 해요`;
export const USERNAME_GITHUB_ERROR_MESSAGE = `이름에 '-gh'를 포함할 수 없어요`;
export const USERNAME_ALREADY_EXISTS_MESSAGE = `이미 사용 중인 이름이에요`;
export const EMAIL_ALREADY_EXISTS_MESSAGE = `이미 사용 중인 이메일이에요`;
export const EMAIL_ERROR_MESSAGE = "올바른 형식의 이메일을 입력해주세요";
export const PHONE_ERROR_MESSAGE = "올바른 형식의 전화번호를 입력해주세요";
export const PHONE_NOT_EXISTS_MESSAGE = "존재하지 않는 전화번호에요";
export const INVALID_USER_MESSAGE = `사용자 정보가 올바르지 않아요`;
