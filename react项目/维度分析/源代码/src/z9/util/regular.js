export const reNumber =  /^\s*\d*(?:\.{0,1})\d*\s*$/gi;          //数字(可选带小数点)
export const rePhoneNumber = /^1[3,5,8]\d{9}$/gi;               //手机号码
export const reTelPhoneNumber = /0\d{2,3}-\d{7,8}/gi;           //固定电话号码