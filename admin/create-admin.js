const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function createAdminUser() {
    try {
        const userRecord = await admin.auth().createUser({
            email: 'devmittul@gmail.com',
            password: 'mittul',
            emailVerified: true
        });
        
        await admin.auth().setCustomUserClaims(userRecord.uid, {
            admin: true
        });
        
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser(); 