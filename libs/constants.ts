// Constants for validation rules
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{10,}$/
);
export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MAX_LENGTH = 15;
export const LOGIN_ID_MIN_LENGTH = 6;
export const LOGIN_ID_MAX_LENGTH = 50;
export const LOGIN_ID_REGEX = new RegExp(/^[a-zA-Z0-9]*$/);
export const POST_CONTENT_MAX_LENGTH = 150;
export const POST_TAGS_MAX_LENGTH = 150;
export const COMMENT_CONTENT_MAX_LENGTH = 1000;
export const BIO_MAX_LENGTH = 200;
export const POST_PHOTOS_MAX_LENGTH = 4;

// Error messages
export const INVALID_TYPE_ERROR_MESSAGE = "유효하지 않은 형식입니다";
export const REQUIRED_ERROR_MESSAGE = "필수 입력 사항이에요";
export const PASSWORD_MIN_ERROR_MESSAGE = `비밀번호는 최소 ${PASSWORD_MIN_LENGTH}글자 이상이어야 해요`;
export const PASSWORD_REGEX_ERROR_MESSAGE = `비밀번호는 영문, 숫자, 특수문자를 포함해야 해요`;
export const PASSWORD_NOT_MATCH_MESSAGE = `비밀번호가 일치하지 않아요`;
export const USERNAME_MIN_ERROR_MESSAGE = `이름은 최소 ${USERNAME_MIN_LENGTH}글자 이상이어야 해요`;
export const USERNAME_MAX_ERROR_MESSAGE = `이름은 ${USERNAME_MAX_LENGTH}글자 이하여야 해요`;
export const LOGIN_ID_MIN_ERROR_MESSAGE = `아이디는 최소 ${LOGIN_ID_MIN_LENGTH}글자 이상이어야 해요`;
export const LOGIN_ID_MAX_ERROR_MESSAGE = `아이디는 ${LOGIN_ID_MAX_LENGTH}글자 이하여야 해요`;
export const LOGIN_ID_REGEX_ERROR_MESSAGE = `아이디는 영어와 숫자만 입력할 수 있어요`;
export const USERNAME_RULE_ERROR_MESSAGE = `사용할 수 없는 형식의 이름이에요`;
export const LOGIN_ID_ALREADY_EXISTS_MESSAGE = `이미 사용 중인 아이디에요`;
export const EMAIL_ALREADY_EXISTS_MESSAGE = `이미 사용 중인 이메일이에요`;
export const EMAIL_ERROR_MESSAGE = "올바른 형식의 이메일을 입력해주세요";
export const PHONE_ERROR_MESSAGE = "올바른 형식의 전화번호를 입력해주세요";
export const PHONE_NOT_EXISTS_MESSAGE = "존재하지 않는 전화번호에요";
export const INVALID_USER_MESSAGE = `사용자 정보가 올바르지 않아요`;
export const POST_CONTENT_REQUIRED_ERROR_MESSAGE = `빈 글은 투고할 수 없어요`;
export const POST_CONTENT_MAX_ERROR_MESSAGE = `최대 150자의 글만 업로드 할 수 있어요`;
export const POST_TAGS_MAX_ERROR_MESSAGE = `태그가 너무 길어요`;
export const COMMENT_CONTENT_MAX_ERROR_MESSAGE = `최대 ${COMMENT_CONTENT_MAX_LENGTH}자의 댓글만 작성할 수 있어요`;
export const COMMENT_CONTENT_REQUIRED_ERROR_MESSAGE = `댓글 내용을 입력해주세요`;
export const BIO_MAX_ERROR_MESSAGE = `자기소개는 최대 ${BIO_MAX_LENGTH}자까지만 작성할 수 있어요`;
export const POST_PHOTOS_MAX_ERROR_MESSAGE = `최대 ${POST_PHOTOS_MAX_LENGTH}장의 사진까지 업로드 할 수 있어요`;

// Friendship Status
export const FRIEND_REJECTED = 0;
export const FRIEND_ACCEPTED = 1;
export const FRIEND_PENDING = 2;

// Tabs
export const TABS = [
  { name: "모아보는", link: "/posts" },
  { name: "메시지", link: "/chat" },
  { name: "나는", link: "/me" },
  { name: "친구들은", link: "/friends" },
];

export const CF_DIRECT_UPLOAD_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/images/v2/direct_upload`;
