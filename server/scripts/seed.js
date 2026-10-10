import { dbStore } from '../data/store.js';

console.log('🌱 Seeding Campus Complaint Management System database...');
const data = dbStore.resetToSeed();
console.log(`✅ Database successfully initialized with:`);
console.log(`   - ${data.users.length} Users (${data.users.filter(u => u.role === 'admin').length} Admin, ${data.users.filter(u => u.role === 'student').length} Students)`);
console.log(`   - ${data.complaints.length} Complaints`);
console.log(`   - ${data.categories.length} Categories`);
console.log(`   - ${data.locations.length} Campus Locations`);
console.log('✨ Seed complete.');
