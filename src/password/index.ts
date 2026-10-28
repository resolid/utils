import { scryptAsync } from "@noble/hashes/scrypt.js";
import { hexEncode } from "../encoding";

const scryptConfig = {
  N: 16384,
  r: 16,
  p: 1,
  dkLen: 64,
};

async function generateKey(password: string, salt: string): Promise<Uint8Array> {
  return scryptAsync(password.normalize("NFKC"), salt, {
    N: scryptConfig.N,
    r: scryptConfig.r,
    p: scryptConfig.p,
    dkLen: scryptConfig.dkLen,
    maxmem: 128 * scryptConfig.N * scryptConfig.r * 2,
  });
}

/**
 * 使用 scrypt 对密码进行哈希，返回 `salt:key` 格式的字符串。
 *
 * 盐为 16 字节随机值，密钥长度为 64 字节，两者均以十六进制编码后拼接。
 *
 * @param password - 明文密码，哈希前会先做 NFKC 归一化
 * @returns `salt:key` 格式的哈希字符串，可直接持久化
 *
 * @see {@link verifyPassword} 校验密码与哈希是否匹配
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = hexEncode(crypto.getRandomValues(new Uint8Array(16)));
  const key = await generateKey(password, salt);
  return `${salt}:${hexEncode(key)}`;
}

/**
 * 校验明文密码是否与哈希匹配。
 *
 * @param hash - `hashPassword` 返回的 `salt:key` 格式字符串
 * @param password - 待校验的明文密码
 * @returns 匹配返回 true；哈希格式非法或密码错误返回 false
 *
 * @see {@link hashPassword} 生成密码哈希
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  const [salt, key] = hash.split(":");

  if (!salt || !key) {
    return false;
  }

  const targetKey = await generateKey(password, salt);

  return hexEncode(targetKey) === key;
}
