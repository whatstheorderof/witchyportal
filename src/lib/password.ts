import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(_scrypt) as (pw: string, salt: Buffer, len: number, opts: object) => Promise<Buffer>;
const N = 16384, r = 8, p = 1, LEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, LEN, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [alg, n, rr, pp, saltB64, hashB64] = stored.split("$");
  if (alg !== "scrypt") return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length, {
    N: Number(n), r: Number(rr), p: Number(pp),
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
