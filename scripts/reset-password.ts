import { db } from '../src/lib/db';
import { hashPassword } from '../src/lib/password';

async function main() {
  const hashed = await hashPassword('ChangeMe@123');
  await db.user.update({
    where: { email: 'admin@nabilhridoy.com' },
    data: { password: hashed },
  });
  console.log('Password reset to: ChangeMe@123');
  await db.$disconnect();
}

main();
