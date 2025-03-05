import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function checkDatabase() {
    try {
        console.log("\n🔍 Checking database contents...\n")

        // Get all agents with their creators
        const agents = await prisma.agent.findMany({
            include: {
                creator: {
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        console.log(`📊 Found ${agents.length} agents in the database:\n`)

        agents.forEach((agent, index) => {
            console.log(`Agent ${index + 1}:`)
            console.log('----------------------------------------')
            console.log(`ID: ${agent.id}`)
            console.log(`Name: ${agent.name}`)
            console.log(`Symbol: ${agent.symbol}`)
            console.log(`Price: $${agent.price}`)
            console.log(`Market Cap: $${agent.marketCap}`)
            console.log(`Created At: ${agent.createdAt}`)
            console.log(`Creator: ${agent.creator.email} (ID: ${agent.creator.id})`)
            // console.log(`Logo URL: ${agent.logo || 'No logo'}`)
            console.log('----------------------------------------\n')
        })

        // Get all users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        agents: true
                    }
                }
            }
        })

        console.log(`👥 Found ${users.length} users in the database:\n`)

        users.forEach((user, index) => {
            console.log(`User ${index + 1}:`)
            console.log('----------------------------------------')
            console.log(`ID: ${user.id}`)
            console.log(`Email: ${user.email}`)
            console.log(`Role: ${user.role}`)
            console.log(`Created At: ${user.createdAt}`)
            console.log(`Number of Agents: ${user._count.agents}`)
            console.log('----------------------------------------\n')
        })

    } catch (error) {
        console.error('❌ Error checking database:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkDatabase()