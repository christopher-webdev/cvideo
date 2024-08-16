const { Router } = require('express');
const Package = require('../models/Package');
const SamplePckages = require('../models/seeders/package.data');

const router = Router();

router
    .post('/', async (req, res) => {
        try {
            const { isPopular, name, amount, per, benefits } = req.body;
            const pkg = await Package.create({ isPopular, name, amount, per, benefits, });
            res.status(201).json({ success: true, data: pkg });
        } catch (error) {
            console.log('🚀 ~ router.route ~ create - error:', error);
            res.status(500).json({ success: false, errors: "Unable to create package "+ error.message });
        }
    })
    .get('/:id', async (req, res) => {
        try {
            const {id} = req.params
            const pkg = await Package.findOne({_id: id});
            res.status(200).json({ success: true, data: pkg });
        } catch (error) {
            console.log('🚀 ~ .get ~ get: - error', error);
            res.status(500).json({ success: false, errors: "Unable to get package "+ error.message });
        }
    })
    .get('/', async (req, res) => {
        try {
            let data = null
            const pkg = await Package.find({});
            if(pkg.length < 1) {data = SamplePckages}
            else {data = pkg}
            res.status(200).json({ success: true, data: data });
        } catch (error) {
            console.log('🚀 ~ .get ~ get: - error', error);
            res.status(500).json({ success: false, errors: "Unable to get all packages "+ error.message });

        }
    })
    .put('/:id', async (req, res) => {
        try {
            const { isPopular, name, amount, per, benefits } = req.body;
            const {id} = req.params
            const pkg = await Package.findOneAndUpdate({_id: id}, { isPopular, name, amount, per, benefits }, {new: true});
            res.status(200).json({ success: true, data: pkg });
        } catch (error) {
            console.log('🚀 ~ .get ~ get: - error', error);
            res.status(500).json({ success: false, errors: "Unable to update package "+ error.message });

        }
    })
    .delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await Package.findOneAndDelete({_id: id});
            res.sendStatus(204)
        } catch (error) {
            console.log('🚀 ~ .get ~ get: - error', error);
            res.status(500).json({ success: false, errors: "Unable to delete package "+ error.message });

        }
    })

module.exports = router;
