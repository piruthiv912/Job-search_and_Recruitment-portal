const express = require('express');
const { getCompanies, createCompany, getCompanyById, getMyCompany } = require('../controllers/companyController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCompanies);
router.get('/my-company', authMiddleware, getMyCompany);
router.get('/:id', getCompanyById);
router.post('/', authMiddleware, createCompany);


module.exports = router;
