const Package = require('../Package');
const packages = require('../seeders/package.data');


async function seed() {
    try {
       

        packages.forEach(async ({id, benefits, ...data})=>{
            const package = await Package.create({data})
            package.updateOne({$push: {benefits}})
            await package.save()

            console.log("Created package: ", data.name);
            
        })

        console.log('Seeder completed sucessfuly');
    } catch (error) {
        console.log('🚀 ~ seed ~ error:', error);
    }
}

seed().catch(console.error);
