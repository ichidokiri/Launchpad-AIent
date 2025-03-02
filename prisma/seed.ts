import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    // Create super admin password hash
    const superAdminPassword = await bcrypt.hash("sp,.adm!!PW??2025", 12)

    // Create or update super admin account
    const superAdmin = await prisma.user.upsert({
        where: { email: "adominn@outlook.com" },
        update: {},
        create: {
            email: "adominn@outlook.com",
            password: superAdminPassword,
            role: "ADMIN",
            monadBalance: 1000000, // Initial balance for super admin
        },
    })

    console.log("Super Admin account created:", {
        id: superAdmin.id,
        email: superAdmin.email,
        role: superAdmin.role,
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error("Error seeding database:", e)
        await prisma.$disconnect()
        process.exit(1)
    })

