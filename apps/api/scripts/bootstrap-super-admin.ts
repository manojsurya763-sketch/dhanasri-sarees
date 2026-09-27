import "dotenv/config";
import { firebaseAuth } from "../src/config/firebaseAdmin";
import { prisma } from "../src/config/db";

// One-off bootstrap for the very first Super Admin — there's no self-serve
// signup, and every other staff account is created through the in-app Staff
// page once at least one Super Admin exists to use it.
// Usage: npm run bootstrap-super-admin -- you@example.com [--password 'Temp123!'] [--name 'Jane Doe']
async function main() {
  const [email, ...rest] = process.argv.slice(2);
  if (!email) {
    console.error("Usage: npm run bootstrap-super-admin -- <email> [--password <password>] [--name <name>]");
    process.exit(1);
  }

  const passwordFlagIndex = rest.indexOf("--password");
  const password = passwordFlagIndex !== -1 ? rest[passwordFlagIndex + 1] : undefined;
  const nameFlagIndex = rest.indexOf("--name");
  const name = nameFlagIndex !== -1 ? rest[nameFlagIndex + 1] : undefined;

  let user = await firebaseAuth.getUserByEmail(email).catch(() => null);

  if (!user) {
    if (!password) {
      console.error(
        `No Firebase user found for ${email}. Create the account first (Firebase Console, or re-run with --password to create it here).`
      );
      process.exit(1);
    }
    user = await firebaseAuth.createUser({ email, password, displayName: name });
    console.log(`Created Firebase user ${email} (${user.uid})`);
  }

  const staff = await prisma.staff.upsert({
    where: { firebaseUid: user.uid },
    update: { role: "super_admin", isActive: true },
    create: { firebaseUid: user.uid, email, name, role: "super_admin" },
  });
  console.log(`${email} (${user.uid}) is now Super Admin (staff id ${staff.id}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
