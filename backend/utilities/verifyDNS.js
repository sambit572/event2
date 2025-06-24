// validateEmailDomain.js
import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

export async function validateEmailDomain(email) {
  const domain = email.split('@')[1];
  if (!domain) return false;

  try {
    const addresses = await resolveMx(domain);
    return addresses && addresses.length > 0;
  } catch (err) {
    console.log("Error in dns checking : ",err)
    return false;
  }
}

