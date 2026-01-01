import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Seed categories
  const categories = [
    { name: 'Concerts', slug: 'concerts', description: 'Live music performances and concerts' },
    { name: 'Conferences', slug: 'conferences', description: 'Professional and business conferences' },
    { name: 'Parties', slug: 'parties', description: 'Social gatherings and parties' },
    { name: 'Sports', slug: 'sports', description: 'Sports events and competitions' },
    { name: 'Religious Events', slug: 'religious-events', description: 'Religious gatherings and services' },
    { name: 'Comedy Shows', slug: 'comedy-shows', description: 'Stand-up comedy and comedy events' },
    { name: 'Theatre', slug: 'theatre', description: 'Theatre performances and plays' },
    { name: 'Festivals', slug: 'festivals', description: 'Cultural and music festivals' },
    { name: 'Workshops', slug: 'workshops', description: 'Educational workshops and training' },
    { name: 'Exhibitions', slug: 'exhibitions', description: 'Art and trade exhibitions' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('Categories seeded successfully')

  // Seed sample venues
  const venues = [
    {
      name: 'Eko Convention Centre',
      address: 'Victoria Island',
      city: 'Lagos',
      state: 'Lagos',
      capacity: 5000,
      coordinates: '6.4281,3.4219',
    },
    {
      name: 'National Stadium',
      address: 'Surulere',
      city: 'Lagos',
      state: 'Lagos',
      capacity: 55000,
      coordinates: '6.4969,3.3653',
    },
    {
      name: 'Transcorp Hilton',
      address: 'Central Business District',
      city: 'Abuja',
      state: 'FCT',
      capacity: 2000,
      coordinates: '9.0765,7.4998',
    },
    {
      name: 'Oriental Hotel',
      address: 'Victoria Island',
      city: 'Lagos',
      state: 'Lagos',
      capacity: 1500,
      coordinates: '6.4281,3.4219',
    },
  ]

  for (const venue of venues) {
    // Check if venue exists by name
    const existingVenue = await prisma.venue.findFirst({
      where: { name: venue.name },
    })

    if (!existingVenue) {
      await prisma.venue.create({
        data: venue,
      })
    }
  }

  console.log('Venues seeded successfully')
  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
