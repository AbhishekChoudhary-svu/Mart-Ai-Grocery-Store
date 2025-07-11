import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
   try {
        const token = req.cookies.accessToken || req?.headers?.authorization?.split(' ')[1];


        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized access.',
                error: true,
                success: false
             });
        }
        req.userId = decoded.id; // Attach the decoded user information to the request object
        next();
         // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(400).json({ message: 'Invalid Login.' });
    }
};

export default auth;