const router = require('express').Router();
const { User, Workout, Category} = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll({
            include: [
                {
                    model: Workout,
                    attributes: ['name'],
                }
            ]
        })

        const users = userData.map((users) => users.get({ plain: true }));

        res.render('homepage', {
            users,
            logged_in: req.session.logged_in,
        });
    } catch (err){
        res.render(500).json(err)
    }
})


// Route to user's workout page
router.get('/workouts', async (req, res) => {
    try {
        const workoutData = await Workout.findAll({
            include: [
                {
                    model: Category,
                    attributes: ['name']
                },
            ],
        });

        const workouts = workoutData.map((category) => category.get({ plain: true }));

        res.render('workouts', {
            workouts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
})
// Route to user's profile page
router.get('/profile', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Workout}]
        });

        const user = userData.get({ plain: true }); 
        const isFem = (user.bodyType == 'F')
        console.log(user.goal)
        const currentGoal = () => {
            switch (user.goal) {
                case "mildWeightGain": return 'Mild Weight Gain'
                case "heavyWeightGain": return 'Heavy Weight Gain'
                case 'balance': return 'Balance Weight'
                case 'mildWeightLoss': return 'Mild Weight Loss'
                case 'heavyWeightLoss': return 'Heavy Weight Loss'
            };
        };
        const currentBodyType = () => {
            switch (user.bodyType) {
                case 'M': return "Masculine"
                case 'F': return "Feminine"
            }
        };

        res.render('userprofile', {
            user,
            logged_in: true,
            currentGoal,
            currentBodyType,
        });
        
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// If the user is already logged in, redirect the request to their profile.
router.get('/login', (req, res) => {
    if (req.session.logged_in){
        res.redirect('/profile');
        return
    }
    res.render('login')
})

module.exports = router;