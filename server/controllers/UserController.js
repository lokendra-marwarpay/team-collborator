import userService from "../services/UserService.js";

class UserController {
    async getAll(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const { email, name } = req.body;
            if (!email) return res.status(400).json({ message: "Missing email from token" });

            const existingUser = await userService.getUserByEmail(email);
            if (existingUser) return res.status(200).json(existingUser);

            const role = req.body.role || "MEMBER";

            const newUser = await userService.createUser({ email, role, name });
            res.status(201).json(newUser);
        } catch (err) {
            next(err);
        }
    }

    async getUser(req, res, next) {
        try {
            const email = req.user.email;
            const user = await userService.getUserByEmail(email);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async getRole(req, res, next) {
        try {
            const { email } = req.user;
            const role = await userService.getUserRoleByEmail(email);

            if (!role) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json({ role });
        } catch (err) {
            next(err);
        }
    }

    async updateUser(req, res, next) {
        try {
            const userId = req.params.id;
            const { role } = req.body;

            const user = await userService.updateUser(userId, { role });
            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async removeFromTeam(req, res, next) {
        try {
            const userId = req.params.id;

            const user = await userService.updateUser(userId, { $unset: { teamId: '' } });
            res.json(user);
        } catch (err) {
            next(err);
        }
    }

}

export default new UserController();
