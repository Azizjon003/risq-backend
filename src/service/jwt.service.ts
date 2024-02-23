const { verify, sign } = require("jsonwebtoken");

export function genereteToken(data: any) {
  return sign(data, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function genereateRefreshToken(data: any) {
  return sign(data, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
}

export function checkToken(data: any) {
  try {
    return verify(data, process.env.JWT_SECRET);
  } catch (e) {
    return false;
  }
}
