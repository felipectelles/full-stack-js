import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import routes from './routes';

import models, { connectDb } from './models';

const port = process.env.PORT;
const app = express();

// application middlawere
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// custom Express middleware
app.use(async (req, res, next) => {
    req.context = {
        models,
        me: await models.User.findByLogin('rwieruch'),
    }
    next();
});

// routes
app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/messages', routes.message);

const eraseDatabaseOnSync = true;

connectDb().then(async () => {
    if (eraseDatabaseOnSync) {
        await Promise.all([
            models.User.deleteMany({}),
            models.Message.deleteMany({}),
        ]);

        createUsersWithMessages();
    }

    app.listen(process.env.PORT, () =>
        console.log(`Example app listening on port ${process.env.PORT}!`),
    );
});

const createUsersWithMessages = async () => {
    const user1 = new models.User({
        username: 'rwieruch',
    });

    const user2 = new models.User({
        username: 'ddavids',
    });

    const message1 = new models.Message({
        text: 'Published the Road to learn React',
        user: user1.id,
    });

    const message2 = new models.Message({
        text: 'Happy to release ...',
        user: user2.id,
    });

    const message3 = new models.Message({
        text: 'Published a complete ...',
        user: user2.id,
    });

    await message1.save();
    await message2.save();
    await message3.save();

    await user1.save();
    await user2.save();
};