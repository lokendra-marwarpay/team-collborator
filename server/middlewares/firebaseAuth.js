import admin from '../config/firebase.js';
import User from '../models/User.js';

export default async function firebaseAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const idToken = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const firebaseUid = decodedToken.uid;

        // Lookup user from your DB
        const user = await User.findOne({ email: decodedToken.email });
        if (!user) {
            return res.status(403).json({ message: 'User not registered in system' });
        }

        // Attach user to request
        req.user = {
            id: user._id,
            email: user.email,
            role: user.role,
            firebaseUid,
            name: user.name
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Firebase token', error: err.message });
    }
}
